"use client";

import Link from "next/link";
import {
  Scale, ScrollText, FileSignature, Landmark, ExternalLink, ShieldCheck,
  BookOpenCheck, Bot, Stamp, Newspaper, Building2, Coins,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { OFFICIAL_LINKS } from "@/lib/kb/data";
import { useI18n } from "@/lib/i18n/provider";

const LAW_ICONS = [ScrollText, Scale, FileSignature, ShieldCheck, BookOpenCheck, Coins];
const STEP_ICONS = [Building2, FileSignature, Stamp, Landmark, Newspaper];

/** جسم صفحة المرجع القانوني — مكون عميل متعدد اللغات */
export function LegalHub() {
  const { d, kb } = useI18n();
  const h = d.legal.hub;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* الرأس */}
      <div className="mb-12 text-center">
        <Badge variant="outline" className="mb-4 gap-1.5 border-primary/30 px-3 py-1 text-[12px] font-bold text-primary">
          <Scale className="size-3.5" />
          {h.badge}
        </Badge>
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
          {h.titleA} <span className="text-primary">{h.titleB}</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-muted-foreground">
          {h.subtitle}
        </p>
      </div>

      {/* النصوص القانونية */}
      <h2 className="mb-6 text-2xl font-black">{h.lawsTitle}</h2>
      <div className="mb-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {h.laws.map((law, i) => {
          const Icon = LAW_ICONS[i % LAW_ICONS.length];
          return (
            <Card key={law.title} className="h-full transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl">
              <CardContent className="flex h-full flex-col p-6">
                <div className="mb-4 flex items-start justify-between">
                  <span className="inline-flex size-12 items-center justify-center rounded-xl bg-secondary text-primary">
                    <Icon className="size-6" />
                  </span>
                  <Badge variant="secondary" className="text-[11px]">{law.date}</Badge>
                </div>
                <h3 className="mb-2 text-lg font-extrabold leading-snug">{law.title}</h3>
                <p className="mb-4 flex-1 text-[13px] leading-7 text-muted-foreground">{law.desc}</p>
                <p className="border-t border-border pt-3 text-[11px] font-bold text-muted-foreground">{law.ref}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* مسطرة التأسيس */}
      <h2 className="mb-2 text-2xl font-black">{h.stepsTitle}</h2>
      <p className="mb-8 max-w-2xl text-sm leading-7 text-muted-foreground">
        {h.stepsIntro}
      </p>
      <div className="mb-16 grid gap-4 md:grid-cols-5">
        {h.steps.map((s, i) => {
          const Icon = STEP_ICONS[i % STEP_ICONS.length];
          return (
            <Card key={s.title} className="relative">
              <CardContent className="p-5">
                <span className="num absolute -top-3 start-4 grid size-7 place-items-center rounded-lg bg-primary text-[12px] font-black text-primary-foreground shadow-md">
                  {i + 1}
                </span>
                <Icon />
                <h3 className="mb-2 mt-2 text-[15px] font-extrabold leading-snug">{s.title}</h3>
                <p className="text-[12px] leading-6 text-muted-foreground">{s.desc}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* البوابات الرسمية */}
      <h2 className="mb-2 text-2xl font-black">{h.portalsTitle}</h2>
      <p className="mb-8 max-w-2xl text-sm leading-7 text-muted-foreground">
        {h.portalsIntro}
      </p>
      <div className="mb-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {h.portals.map((p) => {
          const link = OFFICIAL_LINKS[p.key];
          if (!link) return null;
          return (
            <a key={p.key} href={link.url} target="_blank" rel="noopener noreferrer" className="group">
              <Card className="h-full transition-all duration-300 group-hover:-translate-y-1 group-hover:border-primary/30 group-hover:shadow-xl">
                <CardContent className="flex h-full flex-col p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="inline-flex size-10 items-center justify-center rounded-lg bg-secondary text-primary">
                      <Landmark className="size-5" />
                    </span>
                    <ExternalLink className="size-4 text-muted-foreground transition-colors group-hover:text-primary" />
                  </div>
                  <h3 className="mb-1.5 text-[15px] font-extrabold leading-snug group-hover:text-primary transition-colors">{kb.links[p.key as keyof typeof kb.links]}</h3>
                  <p className="mb-3 flex-1 text-[12px] leading-6 text-muted-foreground">{p.desc}</p>
                  <p className="num text-[11px] font-bold text-primary" dir="ltr">{link.url}</p>
                </CardContent>
              </Card>
            </a>
          );
        })}
      </div>

      {/* نماذج SGG */}
      <Card className="mb-12 overflow-hidden">
        <div className="gradient-dark zellige-pattern flex flex-wrap items-center justify-between gap-6 p-8 text-white">
          <div className="max-w-xl">
            <h2 className="mb-2 flex items-center gap-2 text-xl font-extrabold">
              <FileSignature className="size-5 text-gold" />
              {h.formsTitle}
            </h2>
            <p className="text-sm leading-7 text-white/75">
              {h.formsDesc}
            </p>
          </div>
          <Button asChild size="lg" className="h-12 gap-2 bg-gold px-6 font-extrabold text-[#061229] hover:bg-gold/90">
            <a href={OFFICIAL_LINKS.sggAssociations.url} target="_blank" rel="noopener noreferrer">
              {h.formsBtn}
              <ExternalLink className="size-4" />
            </a>
          </Button>
        </div>
      </Card>

      {/* المساعد */}
      <div className="rounded-2xl border border-dashed border-primary/30 bg-secondary/40 p-8 text-center">
        <Bot className="mx-auto mb-3 size-10 text-primary" />
        <h2 className="mb-2 text-xl font-extrabold">{h.assistantTitle}</h2>
        <p className="mx-auto mb-6 max-w-md text-sm leading-7 text-muted-foreground">
          {h.assistantDesc}
        </p>
        <Button asChild size="lg" className="gap-2 font-extrabold">
          <Link href="/assistant">
            {h.assistantBtn}
            <span className="inline-block rtl:rotate-0 ltr:rotate-180">←</span>
          </Link>
        </Button>
      </div>

      {/* إخلاء المسؤولية */}
      <p className="mt-10 rounded-xl border border-border bg-muted/50 p-4 text-center text-[12px] leading-6 text-muted-foreground">
        {h.disclaimer}
      </p>
    </div>
  );
}
