import type { NextConfig } from "next";

/**
 * وضعان للبناء:
 *  1) الوضع الكامل (افتراضي): standalone — خادم Next كامل + API + SQLite محلية
 *  2) وضع التصدير الثابت (MAMP_EXPORT=1): output=export — للنشر على Cloudflare Pages
 *     (يستثني مسارات API ولوحة التحكم عبر scripts/build-static.sh)
 *
 * ترويسات الأمان: تُطبق في الوضع الكامل عبر headers() أدناه،
 * وفي النشر الثابت عبر ملف public/_headers (تقرأه كلاودفلير تلقائياً).
 */
const isStaticExport = process.env.MAMP_EXPORT === "1";

/** ترويسات الأمان الموحدة — مراجعة في تجارب الاختراق (الدورة السادسة) */
const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Next.js يحتاج سكربتات inline للإقلاع (سكربت الاتجاه المبكر و TRPC)
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob: https:",
      "connect-src 'self' https:",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = isStaticExport
  ? {
      output: "export",
      distDir: "out",
      images: { unoptimized: true },
      trailingSlash: true,
      typescript: { ignoreBuildErrors: true },
      reactStrictMode: false,
    }
  : {
      output: "standalone",
      typescript: { ignoreBuildErrors: true },
      reactStrictMode: false,
      // صور next/image غير محسّنة عمداً — سلوك موحد مع النسخة الثابتة
      images: { unoptimized: true },
      async headers() {
        return [
          {
            source: "/:path*",
            headers: SECURITY_HEADERS,
          },
          // صفحات الدخول والتسجيل: لا تخزين مؤقت إطلاقاً —
          // منع أي نسخة عالقة في الوسائط المشتركة وذاكرة WebView للتطبيق
          // (كانت سبب فشل الدخول من التطبيق وتشوه الهيدر — سجل v1.6.0)
          // (الأصول المطفأة /_next/static تحتفظ بتخزينها الأيدي)
          {
            source: "/login",
            headers: [{ key: "Cache-Control", value: "public, max-age=0, must-revalidate" }],
          },
          {
            source: "/register",
            headers: [{ key: "Cache-Control", value: "public, max-age=0, must-revalidate" }],
          },
        ];
      },
    };

export default nextConfig;
