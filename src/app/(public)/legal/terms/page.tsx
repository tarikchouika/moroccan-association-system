import type { Metadata } from "next";
import { LegalDocPage } from "@/components/site/localized-legal-doc";

export const metadata: Metadata = {
  title: "شروط استخدام المنصة",
  description:
    "الشروط والأحكام المعمول بها على استعمال منصة مامب لإدارة الجمعيات المغربية: الحسابات، الصلاحيات، الاستخدام المقبول، الملكية الفكرية والقانون المطبق.",
  alternates: { canonical: "/legal/terms/" },
};

export default function TermsPage() {
  return <LegalDocPage kind="terms" />;
}
