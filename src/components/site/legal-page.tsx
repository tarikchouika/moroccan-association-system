"use client";

import { CalendarDays, Scale } from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";
import type { LegalDocT } from "@/lib/i18n/legal-docs/types";

/**
 * قالب موحد للصفحات القانونية — متطابق مع الهوية البصرية للمنصة
 * متعدد اللغات: يعرض الوثيقة بلغة الواجهة الحالية.
 */

export function LegalPageView({ doc }: { doc: LegalDocT }) {
  const { d } = useI18n();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      {/* الترويسة */}
      <header className="mb-10">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-secondary/60 px-4 py-1.5 text-xs font-extrabold text-primary">
          <Scale className="size-3.5" />
          {d.legal.docBadge}
        </div>
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{doc.title}</h1>
        <p className="mx-auto mt-3 max-w-2xl text-base leading-8 text-muted-foreground">
          {doc.subtitle}
        </p>
        <p className="mt-4 flex items-center gap-1.5 text-[13px] font-bold text-muted-foreground">
          <CalendarDays className="size-4 text-gold" />
          {d.legal.lastUpdated} {doc.updated}
        </p>
      </header>

      {/* المحتوى */}
      <article className="space-y-8">
        {doc.sections.map((s, i) => (
          <section
            key={s.heading}
            className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-7"
          >
            <h2 className="mb-4 flex items-start gap-3 text-lg font-extrabold leading-8">
              <span className="mt-1 grid size-7 shrink-0 place-items-center rounded-lg bg-primary/10 text-[13px] font-black text-primary">
                {i + 1}
              </span>
              {s.heading}
            </h2>
            <div className="space-y-3">
              {s.paragraphs?.map((p, j) => (
                <p key={j} className="text-[15px] leading-8 text-muted-foreground">
                  {p}
                </p>
              ))}
              {s.bullets && (
                <ul className="space-y-2">
                  {s.bullets.map((b, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-2.5 text-[15px] leading-8 text-muted-foreground"
                    >
                      <span className="mt-3 size-1.5 shrink-0 rounded-full bg-gold" />
                      {b}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        ))}
      </article>

      <p className="mt-10 rounded-xl border border-gold/30 bg-gold-soft/40 p-4 text-center text-[13px] font-bold leading-7">
        {d.legal.docFooter}
      </p>
    </div>
  );
}
