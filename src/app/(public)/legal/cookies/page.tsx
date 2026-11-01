import type { Metadata } from "next";
import { LegalDocPage } from "@/components/site/localized-legal-doc";

export const metadata: Metadata = {
  title: "سياسة ملفات تعريف الارتباط",
  description:
    "الملفات التي تستعملها منصة مامب: كوكي جلسة تقني واحد فقط، دون تتبع أو إعلانات — وفق القانون 09.08.",
  alternates: { canonical: "/legal/cookies/" },
};

export default function CookiesPage() {
  return <LegalDocPage kind="cookies" />;
}
