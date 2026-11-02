// ============================================================================
// MAMP — وكيل التوجيه على Cloudflare Pages (وضع متقدم: _worker.js)
// ----------------------------------------------------------------------------
// • الأصول الثابتة أولاً: الصفحات العمومية تُخدَّم من Pages بسرعة.
// • مسارات التطبيق (/api, /login, /register, /dashboard) تُوجَّه إلى Worker
//   ثابت (mamp-api) يعيد توجيهها إلى النفق النشط عبر KV.
// • أي أصل غير موجود في التصدير الثابت (مثل _next chunks الخاصة بالخادم)
//   يُوجَّه أيضاً إلى Worker، فيعمل الدخول ولوحة التحكم على نفس النطاق.
//
// ملاحظة: وجود _worker.js يُلغي ملف _headers، لذا تُطبَّق ترويسات الأمان هنا.
// ============================================================================

const WORKER_URL = "https://mamp-api.mamp-local-5381.workers.dev";

const APP_PATHS = [
  /^\/api(\/|$)/,
  /^\/dashboard(\/|$)/,
  /^\/login(\/|$)/,
  /^\/register(\/|$)/,
];

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
      "connect-src 'self' https: wss:",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  ],
];

function sanitize(res, origin) {
  const headers = new Headers(res.headers);
  const loc = headers.get("location");
  if (loc) {
    try {
      const u = new URL(loc, origin);
      headers.set("location", u.pathname + u.search + u.hash);
    } catch {
      // اترك Location كما هو إن تعذّر تحليله
    }
  }
  const cookies = typeof headers.getSetCookie === "function" ? headers.getSetCookie() : [];
  if (cookies.length) {
    headers.delete("set-cookie");
    for (const c of cookies) {
      headers.append("set-cookie", c.replace(/;\s*Domain=[^;]+/i, ""));
    }
  }
  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers,
  });
}

function withSecurityHeaders(res) {
  const headers = new Headers(res.headers);
  for (const [key, value] of SECURITY_HEADERS) {
    if (!headers.has(key)) headers.set(key, value);
  }
  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers,
  });
}

async function proxyToWorker(request) {
  const url = new URL(request.url);
  const target = WORKER_URL + url.pathname + url.search;
  const proxied = new Request(target, request);
  const res = await fetch(proxied, { redirect: "manual" });
  return sanitize(res, target);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 1) مسارات التطبيق → Worker مباشرة
    if (APP_PATHS.some((re) => re.test(url.pathname))) {
      return withSecurityHeaders(await proxyToWorker(request));
    }

    // 2) الأصول الثابتة أولاً
    try {
      const asset = await env.ASSETS.fetch(request);
      if (asset && asset.status !== 404) {
        return withSecurityHeaders(asset);
      }
    } catch {
      // تعذّر فحص الأصول — نكمل إلى Worker
    }

    // 3) أصل غير موجود أو مسار تطبيق → Worker
    return withSecurityHeaders(await proxyToWorker(request));
  },
};
