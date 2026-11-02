// ============================================================================
// MAMP — وكيل التوجيه على Cloudflare Pages (وضع متقدم: _worker.js)
// ----------------------------------------------------------------------------
// يجمع بين ميزتين في نطاق واحد (mamp.pages.dev):
//   1) الأصول الثابتة أولاً: الصفحات العمومية تُخدَّم كملفات ثابتة فائقة السرعة
//      (كما كانت) — لا استدعاءات عامل ولا قاعدة بيانات.
//   2) العامل الكامل (mamp-app على Workers + قاعدة D1): مسارات التطبيق —
//      الدخول/التسجيل/لوحة التحكم وكل /api/* — تُوجَّه إليه فيُصبح الدخول
//      ممكناً من المتصفح ومن التطبيق على النطاق نفسه.
//
// ملاحظات:
//  • بوجود _worker.json يتجاهل كلاودفلير ملف _headers — لذا تُطبَّق ترويسات
//    الأمان هنا على كل الاستجابات (للأصول والوكيل معاً، دون تكرار الموجود).
//  • إن أُضيف ربط خدمة باسم MAMP_APP في إعدادات مشروع Pages فسيُستعمل
//    (أسرع — داخل حافة كلاودفلير)، وإلا فيُستعمل الرابط العمومي للعامل.
// ============================================================================

const WORKER_URL = "https://mamp-app.dmgames-api.workers.dev";

/** مسارات التطبيق — تُوجَّه للعامل الكامل دائماً (قبل فحص الأصول) */
const APP_PATHS = [
  /^\/api(\/|$)/, // كل واجهات API
  /^\/dashboard(\/|$)/, // لوحة التحكم (ليست في التصدير الثابت أصلاً)
  /^\/login(\/|$)/, // الدخول — من بناء العامل لضمان تناسق التنقل إلى اللوحة
  /^\/register(\/|$)/, // التسجيل — كذلك
];

/** ترويسات الأمان الموحدة (كانت في _headers — تُطبَّق هنا لوجود _worker.js) */
const SECURITY_HEADERS = [
  ["X-Content-Type-Options", "nosniff"],
  ["X-Frame-Options", "DENY"],
  ["Referrer-Policy", "strict-origin-when-cross-origin"],
  ["X-XSS-Protection", "1; mode=block"],
  ["Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()"],
  ["Strict-Transport-Security", "max-age=31536000; includeSubDomains"],
  [
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob: https:",
      "connect-src 'self' https:",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  ],
];

/** توجيه الطلب إلى العامل الكامل (ربط خدمة إن وُجد، وإلا الرابط العمومي) */
async function proxyToWorker(request, env) {
  if (env.MAMP_APP && typeof env.MAMP_APP.fetch === "function") {
    return env.MAMP_APP.fetch(request);
  }
  const url = new URL(request.url);
  const target = WORKER_URL + url.pathname + url.search;
  // إعادة بناء الطلب بالرابط الجديد مع حفظ الطريقة والترويسات والجسم
  const proxied = new Request(target, request);
  return fetch(proxied);
}

/** تطبيق ترويسات الأمان الناقصة فقط (دون تكرار ما يضبطه التطبيق نفسه)
 *  + درع ضد النسخ العالقة: كل استجابة HTML من العامل تخرج بـ no-cache —
 *    OpenNext يضبط للصفحات العامة s-maxage=31536000 (سنة!) فتعلق نسخة قديمة
 *    في الوسائط المشتركة وذاكرة WebView للتطبيق فيتعذر الدخول ويظهر الداشبورد مشوهاً.
 *    الأصول المطفأة (المشفرة بأسماء فريدة) تحتفظ بتخزينها الأيدي. */
function withSecurityHeaders(res) {
  const headers = new Headers(res.headers);
  for (const [key, value] of SECURITY_HEADERS) {
    if (!headers.has(key)) headers.set(key, value);
  }
  const contentType = (headers.get("content-type") || "").toLowerCase();
  if (contentType.includes("text/html")) {
    headers.set("cache-control", "public, max-age=0, must-revalidate");
    headers.delete("etag");
    headers.delete("last-modified");
  }
  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers,
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 1) مسارات التطبيق → العامل الكامل مباشرة
    if (APP_PATHS.some((re) => re.test(url.pathname))) {
      return withSecurityHeaders(await proxyToWorker(request, env));
    }

    // 2) الأصول الثابتة أولاً (الصفحات العمومية — سرعة ومرونة كما كانت)
    try {
      const asset = await env.ASSETS.fetch(request);
      if (asset && asset.status !== 404) {
        return withSecurityHeaders(asset);
      }
    } catch {
      // تعذر فحص الأصول — نكمل إلى العامل
    }

    // 3) ليس أصلاً ثابتاً → العامل الكامل (مسارات لوحة التحكم وغيرها)
    return withSecurityHeaders(await proxyToWorker(request, env));
  },
};
