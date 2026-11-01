import type { Metadata } from "next";
import { AppDownloadBody } from "@/components/site/app-download";

export const metadata: Metadata = {
  title: "تطبيق أندرويد الرسمي",
  description:
    "حمّلوا تطبيق منصة مامب لأندرويد — رابط مباشر من كلاودفلير، مع دليل مبسّط بالصور للتنزيل والتثبيت وتجاوز رسالة Play Protect.",
  alternates: { canonical: "/app/" },
};

/** بيانات منظمة للتطبيق — تحسين الفهرسة */
const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "MobileApplication",
  name: "منصة مامب — تطبيق أندرويد",
  operatingSystem: "Android 7.0+",
  applicationCategory: "GovernmentApplication",
  inLanguage: ["ar", "fr", "en", "es", "it", "de", "nl", "ru"],
  offers: { "@type": "Offer", price: "0", priceCurrency: "MAD" },
  author: { "@type": "Person", name: "TARIK CHOUIKA" },
  downloadUrl: "https://mamp-dl.pages.dev/mamp.apk",
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "لماذا يطلب أندرويد السماح بالتثبيت من مصادر غير معروفة؟",
      acceptedAnswer: {
        "@type": "Answer",
        text: "لأن التطبيق يُوزع مباشرة عبر الموقع الرسمي للمنصة بدل متجر Google Play. الرسالة تحذير قياسي من أندرويد لكل تطبيق خارج المتجر، وبمجرد السماح مرة واحدة سيُثبَّت التطبيق بشكل عادي.",
      },
    },
    {
      "@type": "Question",
      name: "هل يتوفر التطبيق على iOS؟",
      acceptedAnswer: {
        "@type": "Answer",
        text: "حالياً الإصدار الرسمي مخصص لأندرويد. يمكن لمستعملي iPhone وiPad استعمال نسخة الويب الكاملة مباشرة من المتصفح عبر الرابط mamp.pages.dev بنفس الخدمات.",
      },
    },
  ],
};

export default function AppPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <AppDownloadBody />
    </>
  );
}
