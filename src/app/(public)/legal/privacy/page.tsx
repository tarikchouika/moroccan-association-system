import type { Metadata } from "next";
import { LegalDocPage } from "@/components/site/localized-legal-doc";

export const metadata: Metadata = {
  title: "سياسة الخصوصية وحماية المعطيات",
  description:
    "كيف تجمع منصة MAMP المعطيات الشخصية وتعالجها وتحميها وفق القانون 09.08 واللجنة الوطنية CNDP — حقوقكم وطريقة ممارستها.",
  alternates: { canonical: "/legal/privacy/" },
};

export default function PrivacyPage() {
  return <LegalDocPage kind="privacy" />;
}
