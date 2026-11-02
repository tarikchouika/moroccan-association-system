import type { Metadata } from "next";
import { ProjectsBrowser } from "@/components/site/projects-browser";
import { DEMO_DATA } from "@/generated/demo-data";

export const metadata: Metadata = {
  title: "المشاريع والبرامج المشتركة",
  description:
    "فعاليات وبرامج ومشاريع مشتركة بين الجمعيات المغربية والجهات الحكومية والخاصة — تنسيق موحد وأهداف واضحة على منصة مامب.",
  alternates: { canonical: "/projects/" },
};

export default function ProjectsPage() {
  return <ProjectsBrowser projects={DEMO_DATA.projects} />;
}
