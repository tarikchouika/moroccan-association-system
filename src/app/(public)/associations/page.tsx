import type { Metadata } from "next";
import { AssociationsBrowser } from "@/components/site/associations-browser";
import { DEMO_DATA } from "@/generated/demo-data";

export const metadata: Metadata = {
  title: "دليل الجمعيات الموثقة",
  description: "استكشفوا الجمعيات المغربية الموثقة على منصة MAMP وفق المجالات والمدن — للانخراط أو التبرع بثقة.",
  alternates: { canonical: "/associations/" },
};

export default function AssociationsPage() {
  return <AssociationsBrowser associations={DEMO_DATA.associations} />;
}
