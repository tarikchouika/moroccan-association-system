import type { MetadataRoute } from "next";
import { DEMO_DATA } from "@/generated/demo-data";

/**
 * خريطة الموقع — تُولَّد آلياً عند البناء وتشمل كل الصفحات العمومية
 * + صفحات تفاصيل الجمعيات الموثقة من قاعدة البيانات المحلية
 */
const BASE_URL = "https://mamp.pages.dev";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/associations/`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/legal/`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/legal/terms/`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${BASE_URL}/legal/privacy/`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${BASE_URL}/legal/cookies/`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/assistant/`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/app/`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/login/`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/register/`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
  ];

  const associationPages: MetadataRoute.Sitemap = DEMO_DATA.associations.map((a) => ({
    url: `${BASE_URL}/associations/${a.slug}/`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticPages, ...associationPages];
}
