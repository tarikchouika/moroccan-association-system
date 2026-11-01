import type { Metadata } from "next";
import { AssistantPageBody } from "@/components/site/assistant-page-body";

export const metadata: Metadata = {
  title: "المساعد الجمعوي",
  description:
    "مساعد ذكي يجيب عن أسئلتكم حول الجمعيات المغربية والإجراءات الرسمية — بقاعدة معارف موثقة، بدون هلوسة وبدون روابط وهمية.",
  alternates: { canonical: "/assistant/" },
};

export default function AssistantPage() {
  return <AssistantPageBody />;
}
