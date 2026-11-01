import type { NextConfig } from "next";

/**
 * وضعان للبناء:
 *  1) الوضع الكامل (افتراضي): standalone — خادم Next كامل + API + SQLite محلية
 *  2) وضع التصدير الثابت (MAMP_EXPORT=1): output=export — للنشر على Cloudflare Pages
 *     (يستثني مسارات API ولوحة التحكم عبر scripts/build-static.sh)
 */
const isStaticExport = process.env.MAMP_EXPORT === "1";

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
    };

export default nextConfig;
