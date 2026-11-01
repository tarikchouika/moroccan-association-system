"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Bot, SendHorizonal, ShieldCheck, RotateCcw, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { KB_ENTRIES, KB_CATEGORIES } from "@/lib/kb/data";
import { localKBAnswer } from "@/lib/kb/client-answer";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

const WELCOME: Msg = {
  role: "assistant",
  content:
    "السلام عليكم 👋 أنا **المساعد الجمعوي**.\n\nأستطيع مساعدتكم في:\n• **الإجراءات الرسمية**: تأسيس الجمعيات، التصريح، النشر بالجريدة الرسمية، صفة المنفعة العامة...\n• **استعمال المنصة**: الانخراط، المحاسبة، التبرعات، الفعاليات، الوثائق.\n• **التوجيه الموثق**: نحو البوابات الرسمية للإدارات المغربية.\n\nالتزامي الصارم: أجيب فقط من قاعدة معارف رسمية مُتحقق منها — **لا هلوسة، لا روابط وهمية**. إن لم أعرف الجواب قلتها بصراحة.",
};

const QUICK = [
  "ما هي خطوات تأسيس جمعية؟",
  "ما هو الوصل المؤقت؟",
  "كيف أحصل على ICE لجمعيتي؟",
  "هل التبرعات قابلة للخصم من الضريبة؟",
  "كيف أحمي معطيات المنخرطين (CNDP)؟",
  "ما هي صلاحيات كل دور في المنصة؟",
];

function renderContent(text: string) {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
    return (
      <p key={i} className={cn("leading-8", line.startsWith("•") && "ps-4")}>
        {parts.map((p, j) =>
          p.startsWith("**") && p.endsWith("**") ? (
            <strong key={j} className="font-bold">{p.slice(2, -2)}</strong>
          ) : (
            <span key={j}>{p}</span>
          )
        )}
      </p>
    );
  });
}

export function AssistantChat() {
  const [msgs, setMsgs] = useState<Msg[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [sessionId] = useState(() => `p-${Date.now().toString(36)}`);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, busy]);

  const send = useCallback(
    async (text: string) => {
      const question = text.trim();
      if (!question || busy) return;
      setInput("");
      setMsgs((m) => [...m, { role: "user", content: question }]);
      setBusy(true);
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: question,
            sessionId,
            history: msgs.slice(-6).map((m) => ({ role: m.role, content: m.content })),
          }),
        });
        if (!res.ok) throw new Error("api-unavailable");
        const data = await res.json();
        setMsgs((m) => [
          ...m,
          { role: "assistant", content: data.answer || data.error || "تعذر الحصول على جواب." },
        ]);
      } catch {
        // نسخة احتياطية موثقة: جواب مباشر من قاعدة المعارف داخل المتصفح (بدون هلوسة)
        const fallback = localKBAnswer(question);
        setMsgs((m) => [
          ...m,
          {
            role: "assistant",
            content:
              fallback.content +
              (fallback.found ? "\n\n_(جواب من قاعدة المعارف الموثقة — الوضع دون اتصال بالخادم)_" : ""),
          },
        ]);
      } finally {
        setBusy(false);
      }
    },
    [busy, msgs, sessionId]
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
      {/* واجهة المحادثة */}
      <Card className="flex h-[600px] flex-col overflow-hidden">
        <div className="gradient-dark zellige-pattern flex items-center gap-3 p-4 text-white">
          <span className="grid size-11 place-items-center rounded-xl border border-gold/40 bg-gold/20">
            <Bot className="size-6 text-gold" />
          </span>
          <div className="flex-1">
            <h2 className="text-sm font-extrabold">المساعد الجمعوي</h2>
            <p className="flex items-center gap-1 text-[11px] text-white/70">
              <ShieldCheck className="size-3" /> قاعدة معارف رسمية · فلترة صارمة للروابط
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 hover:text-white"
            onClick={() => setMsgs([WELCOME])}
            aria-label="محادثة جديدة"
            title="محادثة جديدة"
          >
            <RotateCcw className="size-4" />
          </Button>
        </div>

        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto bg-muted/40 p-5">
          {msgs.map((m, i) => (
            <div key={i} className={cn("msg-in flex gap-2.5", m.role === "user" ? "justify-start" : "justify-end")}>
              {m.role === "assistant" && (
                <span className="mt-1 grid size-8 shrink-0 place-items-center rounded-full gradient-dark">
                  <Bot className="size-4 text-gold" />
                </span>
              )}
              <div
                className={cn(
                  "max-w-[80%] space-y-1.5 rounded-2xl px-4 py-3 text-[14px]",
                  m.role === "user"
                    ? "bg-primary text-primary-foreground rounded-ss-md"
                    : "border border-border bg-card shadow-sm rounded-se-md"
                )}
              >
                {renderContent(m.content)}
              </div>
            </div>
          ))}

          {busy && (
            <div className="flex justify-end">
              <span className="mt-1 grid size-8 place-items-center rounded-full gradient-dark">
                <Bot className="size-4 text-gold" />
              </span>
              <div className="flex gap-1.5 rounded-2xl rounded-se-md border border-border bg-card px-5 py-4">
                <span className="typing-dot size-2 rounded-full bg-primary/60" />
                <span className="typing-dot size-2 rounded-full bg-primary/60" />
                <span className="typing-dot size-2 rounded-full bg-primary/60" />
              </div>
            </div>
          )}
        </div>

        {/* أسئلة سريعة */}
        {msgs.length <= 1 && (
          <div className="flex gap-2 overflow-x-auto border-t border-border bg-card p-3 no-scrollbar">
            {QUICK.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="whitespace-nowrap rounded-full border border-border bg-background px-3.5 py-1.5 text-[12px] font-bold text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex gap-2 border-t border-border bg-card p-4"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="اكتبوا سؤالكم هنا بالتفصيل..."
            className="flex-1 min-w-0 rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            disabled={busy}
            aria-label="سؤالكم"
          />
          <Button type="submit" size="icon" className="size-12 shrink-0 rounded-xl" disabled={busy || !input.trim()} aria-label="إرسال">
            <SendHorizonal className="size-5 -scale-x-100" />
          </Button>
        </form>
      </Card>

      {/* قاعدة المعرفة */}
      <div className="space-y-4">
        <Card>
          <div className="border-b border-border p-4">
            <h3 className="flex items-center gap-2 text-sm font-extrabold">
              <BookOpen className="size-4 text-primary" />
              مصادر المعرفة ({KB_ENTRIES.length})
            </h3>
            <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
              المواضيع الرسمية التي يستند إليها المساعد — روابط مُتحقق منها يدوياً.
            </p>
          </div>
          <div className="max-h-[480px] overflow-y-auto p-3">
            {KB_CATEGORIES.map((cat) => {
              const entries = KB_ENTRIES.filter((e) => e.category === cat);
              if (!entries.length) return null;
              return (
                <div key={cat} className="mb-3">
                  <p className="mb-1.5 px-2 text-[11px] font-black uppercase text-muted-foreground">{cat}</p>
                  {entries.map((e) => (
                    <button
                      key={e.id}
                      onClick={() => send(e.title)}
                      className="w-full rounded-lg px-2.5 py-2 text-start text-[12.5px] font-bold leading-5 text-foreground/80 transition-colors hover:bg-secondary hover:text-primary"
                    >
                      {e.title}
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="border-primary/20 bg-secondary/40">
          <div className="p-4 text-[12px] leading-6 text-foreground/75">
            <p className="mb-2 flex items-center gap-1.5 font-extrabold text-primary">
              <ShieldCheck className="size-4" />
              ميثاق الموثوقية
            </p>
            <ul className="space-y-1.5 list-disc ps-4">
              <li>لا روابط إلا من اللائحة البيضاء الرسمية.</li>
              <li>لا أرقام مواد أو نسب أو تواريخ مختلقة.</li>
              <li>«لا أعرف» جواب مسموح ومشروع.</li>
              <li>فلترة آلية لكل رابط قبل عرضه.</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}
