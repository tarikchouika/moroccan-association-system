import { LandingPage } from "@/components/site/landing-page";
import { DEMO_DATA } from "@/generated/demo-data";

/** بيانات منظمة JSON-LD — تحسين الفهرسة في محركات البحث */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://mamp.pages.dev/#organization",
      name: "منصة مامب",
      alternateName: "MAMP — Moroccan Associations Management Platform",
      url: "https://mamp.pages.dev/",
      logo: "https://mamp.pages.dev/icon-512.png",
      founder: { "@type": "Person", name: "TARIK CHOUIKA" },
      description:
        "منصة رقمية مغربية لإدارة وتسيير الجمعيات: الانخراطات، المحاسبة، التبرعات، الفعاليات والوثائق الرسمية.",
      areaServed: { "@type": "Country", name: "Morocco" },
      knowsLanguage: ["ar", "fr", "en", "es", "it", "de", "nl", "ru"],
    },
    {
      "@type": "WebSite",
      "@id": "https://mamp.pages.dev/#website",
      url: "https://mamp.pages.dev/",
      name: "منصة مامب — إدارة الجمعيات المغربية",
      inLanguage: "ar",
      publisher: { "@id": "https://mamp.pages.dev/#organization" },
    },
    {
      "@type": "WebApplication",
      "@id": "https://mamp.pages.dev/#webapp",
      name: "منصة مامب",
      url: "https://mamp.pages.dev/",
      applicationCategory: "GovernmentApplication",
      operatingSystem: "Web, Android",
      inLanguage: "ar",
      offers: { "@type": "Offer", price: "0", priceCurrency: "MAD" },
      publisher: { "@id": "https://mamp.pages.dev/#organization" },
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LandingPage data={DEMO_DATA} />
    </>
  );
}
