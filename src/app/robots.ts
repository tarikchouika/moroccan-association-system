import type { MetadataRoute } from "next";

/** robots.txt — السماح لكل محركات الفهرسة + الإشارة لخريطة الموقع */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard/", "/api/"],
      },
    ],
    sitemap: "https://mamp.pages.dev/sitemap.xml",
    host: "https://mamp.pages.dev",
  };
}
