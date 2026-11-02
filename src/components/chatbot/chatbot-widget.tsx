"use client";

/**
 * نافذة المساعد الجمعوي العائمة — تظهر في جميع الصفحات
 * • العربية: تحاول /api/chat أولاً (الخادم المحلي) ثم الجواب المحلي الموثق.
 * • اللغات الأخرى: جواب مباشر من قاعدة المعارف المترجمة داخل المتصفح
 *   (استرجاع حرفي مدقق — بدون خادم وبدون توليد لغوي).
 */
import { useState, useRef, useEffect, useCallback } from "react";
import { X, SendHorizonal, Sparkles, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { localKBAnswer } from "@/lib/kb/client-answer";
import { LogoMark } from "@/components/site/logo";
import { useI18n } from "@/lib/i18n/provider";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

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
  const { d, lang } = useI18n();
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [sessionId] = useState(() => `s-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`);
  const scrollRef = useRef<HTMLDivElement>(null);

  // رسالة الترحيب تتبع لغة الواجهة
  useEffect(() => {
    setMsgs([{ role: "assistant", content: d.chatbot.welcome }]);
  }, [d.chatbot.welcome]);

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

      // لغة غير العربية → جواب محلي موثق مترجم مباشرة (بدون خادم)
      if (lang !== "ar") {
        const fallback = localKBAnswer(question, lang);
        setMsgs((m) => [
          ...m,
          {
            role: "assistant",
            content:
              fallback.content +
              (fallback.found ? `\n\n${d.chatbot.offlineNote}` : ""),
          },
        ]);
        setBusy(false);
        return;
      }

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
          {
            role: "assistant",
            content: data.answer || data.error || d.chatbot.errorFallback,
          },
        ]);
      } catch {
        // نسخة احتياطية موثقة: جواب مباشر من قاعدة المعارف داخل المتصفح (بدون هلوسة)
        const fallback = localKBAnswer(question, "ar");
        setMsgs((m) => [
          ...m,
          {
            role: "assistant",
            content:
              fallback.content +
              (fallback.found ? `\n\n${d.chatbot.offlineNote}` : ""),
          },
        ]);
      } finally {
        setBusy(false);
      }
    },
    [busy, msgs, sessionId, lang, d.chatbot.offlineNote, d.chatbot.errorFallback]
  );

  return (
    <>
      {/* زر التشغيل — أيقونة اللوغو الرسمي */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={d.chatbot.openAria}
        className={cn(
          "no-print fixed bottom-5 start-5 z-50 flex items-center gap-2 rounded-full",
          "bg-primary text-primary-foreground shadow-lg shadow-primary/30",
          "h-14 px-5 font-bold transition-all hover:scale-105 active:scale-95",
          open && "opacity-0 pointer-events-none"
        )}
      >
        <span className="relative flex size-9 items-center justify-center overflow-hidden rounded-full bg-white/95">
          <LogoMark size={30} />
          <span className="absolute -top-0.5 -end-0.5 size-2.5 rounded-full bg-gold animate-pulse" />
        </span>
        <span className="hidden sm:inline text-sm">{d.chatbot.title}</span>
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
          aria-label={d.chatbot.title}
        >
          {/* الرأس — لوغو المنصة كأيقونة للمساعد */}
          <div className="gradient-dark zellige-pattern rounded-t-2xl p-4 text-white flex items-center gap-3">
            <div className="relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/95 border border-white/30">
              <LogoMark size={34} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-extrabold text-sm">{d.chatbot.title}</h3>
              <p className="text-[11px] text-white/70 flex items-center gap-1">
                <ShieldCheck className="size-3" />
                {d.chatbot.headerSub}
              </p>
            </div>
            <a
              href="/assistant"
              className="rounded-lg p-2 hover:bg-white/10 transition-colors"
              aria-label={d.chatbot.fullVersionAria}
              title={d.chatbot.fullVersionAria}
            >
              <Sparkles className="size-4" />
            </a>
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg p-2 hover:bg-white/10 transition-colors"
              aria-label={d.chatbot.closeAria}
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
                  <div className="size-7 shrink-0 rounded-full bg-white/95 border border-border overflow-hidden flex items-center justify-center me-2 mt-1">
                    <LogoMark size={20} />
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
                <div className="size-7 shrink-0 rounded-full bg-white/95 border border-border overflow-hidden flex items-center justify-center me-2 mt-1">
                  <LogoMark size={20} />
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
              {d.chatbot.suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="shrink-0 whitespace-nowrap text-[11px] font-semibold rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
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
              placeholder={d.chatbot.inputPlaceholder}
              className="flex-1 min-w-0 rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
              disabled={busy}
              aria-label={d.chatbot.inputAria}
            />
            <Button
              type="submit"
              size="icon"
              className="size-10 shrink-0 rounded-xl"
              disabled={busy || !input.trim()}
              aria-label={d.chatbot.sendAria}
            >
              <SendHorizonal className="size-4 rtl:-scale-x-100" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
