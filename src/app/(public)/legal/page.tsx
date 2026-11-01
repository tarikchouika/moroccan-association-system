import type { Metadata } from "next";
import { LegalHub } from "@/components/site/legal-hub";

export const metadata: Metadata = {
  title: "المرجع القانوني للعمل الجمعوي",
  description:
    "القوانين والمساطر الرسمية المؤطرة للجمعيات بالمغرب: ظهير 1958، القانون 75.00، القانون 09.08 — مع الروابط الرسمية الموثقة.",
  alternates: { canonical: "/legal/" },
};

export default function LegalPage() {
  return <LegalHub />;
}
