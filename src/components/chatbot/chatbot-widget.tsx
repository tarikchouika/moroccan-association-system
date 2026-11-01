"use client";

/**
 * نافذة المساعد الجمعوي العائمة — تظهر في جميع الصفحات
 * متصلة بـ /api/chat (قاعدة معارف موثقة + فلترة صارمة للروابط)
 */
import { useState, useRef, useEffect, useCallback } from "react";
import { Bot, X, SendHorizonal, Sparkles, ShieldCheck, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "كيف نؤسس جمعية بالمغرب؟",
  "ما هي وثائق ملف التأسيس؟",
  "كيف أنخرط في جمعية؟",
  "ما هو رقم ICE؟",
  "هل التبرعات قابلة للخصم الضريبي؟",
  "ما هي خطوات النشر بالجريدة الرسمية؟",
];

const WELCOME: Msg = {
  role: "assistant",
  content:
    "السلام عليكم 👋 أنا **المساعد الجمعوي**، دليلكم داخل منصة مامب.\n\nأجيب عن أسئلتكم حول:\n• تأسيس الجمعيات والإجراءات الرسمية\n• الانخراط والمحاسبة والتبرعات\n• البوابات الرسمية والهوية الرقمية\n\nأعمل بقاعدة معارف رسمية مُتحقق منها — لا أقدم روابط أو معلومات غير موثقة. كيف أخدمكم؟",
};

function renderContent(text: string) {
  // تحويل بسيط: **غامق** و • و أسطر مرقمة
  const lines = text.split("\n");
  return lines.map((line, i) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
    return (
      <p key={i} className={cn("leading-relaxed", line.startsWith("•") && "ps-3")}>
        {parts.map((p, j) =>
          p.startsWith("**") && p.endsWith("**") ? (
            <strong key={j} className="font-bold">
              {p.slice(2, -2)}
            </strong>
          ) : (
            <span key={j}>{p}</span>
          )
        )}
      </p>
    );
  });
}

export function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [sessionId] = useState(() => `s-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, busy, open]);

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
        const data = await res.json();
        setMsgs((m) => [
          ...m,
          {
            role: "assistant",
            content: data.answer || data.error || "تعذر الاتصال بالمساعد، حاولوا من جديد.",
          },
        ]);
      } catch {
        setMsgs((m) => [
          ...m,
          {
            role: "assistant",
            content: "تعذر الاتصال بالمساعد حالياً. تحققوا من الشبكة وأعيدوا المحاولة.",
          },
        ]);
      } finally {
        setBusy(false);
      }
    },
    [busy, msgs, sessionId]
  );

  return (
    <>
      {/* زر التشغيل */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="فتح المساعد الجمعوي"
        className={cn(
          "no-print fixed bottom-5 start-5 z-50 flex items-center gap-2 rounded-full",
          "bg-primary text-primary-foreground shadow-lg shadow-primary/30",
          "h-14 px-5 font-bold transition-all hover:scale-105 active:scale-95",
          open && "opacity-0 pointer-events-none"
        )}
      >
        <span className="relative flex">
          <MessageCircle className="size-6" />
          <span className="absolute -top-1 -end-1 size-3 rounded-full bg-gold animate-pulse" />
        </span>
        <span className="hidden sm:inline text-sm">المساعد الجمعوي</span>
      </button>

      {/* النافذة */}
      {open && (
        <div
          className={cn(
            "no-print fixed inset-x-3 bottom-3 z-50 sm:inset-x-auto sm:end-5 sm:bottom-5 sm:start-auto",
            "flex flex-col rounded-2xl border border-border bg-card shadow-2xl",
            "w-auto sm:w-[420px] h-[70vh] sm:h-[600px] max-h-[80dvh]",
            "msg-in"
          )}
          role="dialog"
          aria-label="المساعد الجمعوي"
        >
          {/* الرأس */}
          <div className="gradient-dark zellige-pattern rounded-t-2xl p-4 text-white flex items-center gap-3">
            <div className="relative flex size-11 items-center justify-center rounded-xl bg-gold/20 border border-gold/40">
              <Bot className="size-6 text-gold" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-extrabold text-sm">المساعد الجمعوي</h3>
              <p className="text-[11px] text-white/70 flex items-center gap-1">
                <ShieldCheck className="size-3" />
                إجابات موثقة — بدون روابط وهمية
              </p>
            </div>
            <a
              href="/assistant"
              className="rounded-lg p-2 hover:bg-white/10 transition-colors"
              aria-label="النسخة الكاملة"
              title="النسخة الكاملة"
            >
              <Sparkles className="size-4" />
            </a>
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg p-2 hover:bg-white/10 transition-colors"
              aria-label="إغلاق"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* المحادثة */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/40">
            {msgs.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "msg-in flex",
                  m.role === "user" ? "justify-start" : "justify-end"
                )}
              >
                {m.role === "assistant" && (
                  <div className="size-7 shrink-0 rounded-full gradient-dark flex items-center justify-center me-2 mt-1">
                    <Bot className="size-4 text-gold" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[82%] rounded-2xl px-3.5 py-2.5 text-[13px] space-y-1",
                    m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-ss-md"
                      : "bg-card border border-border shadow-sm rounded-se-md"
                  )}
                >
                  {renderContent(m.content)}
                </div>
              </div>
            ))}

            {busy && (
              <div className="flex justify-end">
                <div className="size-7 shrink-0 rounded-full gradient-dark flex items-center justify-center me-2 mt-1">
                  <Bot className="size-4 text-gold" />
                </div>
                <div className="bg-card border border-border rounded-2xl rounded-se-md px-4 py-3 flex gap-1.5">
                  <span className="typing-dot size-2 rounded-full bg-primary/60" />
                  <span className="typing-dot size-2 rounded-full bg-primary/60" />
                  <span className="typing-dot size-2 rounded-full bg-primary/60" />
                </div>
              </div>
            )}
          </div>

          {/* اقتراحات */}
          {msgs.length <= 1 && (
            <div className="px-3 pb-2 flex gap-2 overflow-x-auto no-scrollbar">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="whitespace-nowrap text-[11px] font-semibold rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* الإدخال */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="border-t border-border p-3 flex gap-2 bg-card rounded-b-2xl"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="اكتبوا سؤالكم هنا..."
              className="flex-1 min-w-0 rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
              disabled={busy}
              aria-label="سؤالكم للمساعد"
            />
            <Button
              type="submit"
              size="icon"
              className="size-10 shrink-0 rounded-xl"
              disabled={busy || !input.trim()}
              aria-label="إرسال"
            >
              <SendHorizonal className="size-4 -scale-x-100" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
