import type { Metadata } from "next";
import { AssistantChat } from "@/components/chatbot/assistant-chat";

export const metadata: Metadata = {
  title: "المساعد الجمعوي",
  description:
    "مساعد ذكي يجيب عن أسئلتكم حول الجمعيات المغربية والإجراءات الرسمية — بقاعدة معارف موثقة، بدون هلوسة وبدون روابط وهمية.",
};

export default function AssistantPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
          المساعد <span className="text-primary">الجمعوي</span>
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-base leading-8 text-muted-foreground">
          اسألوا عن القوانين والمساطر الرسمية واستعمالات المنصة — كل جواب يستند إلى
          قاعدة معارف رسمية مُتحقق منها، وكل رابط يمر عبر فلترة صارمة.
        </p>
      </div>
      <AssistantChat />
    </div>
  );
}
