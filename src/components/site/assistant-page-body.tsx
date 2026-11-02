"use client";

import { AssistantChat } from "@/components/chatbot/assistant-chat";
import { useI18n, useDocumentTitle } from "@/lib/i18n/provider";

/** جسم صفحة المساعد — مكون عميل متعدد اللغات */
export function AssistantPageBody() {
  const { d } = useI18n();
  useDocumentTitle(d.meta.pages.assistant);
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
          {d.assistant.titleA} <span className="text-primary">{d.assistant.titleB}</span>
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-base leading-8 text-muted-foreground">
          {d.assistant.subtitle}
        </p>
      </div>
      <AssistantChat />
    </div>
  );
}
