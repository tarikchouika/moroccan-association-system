"use client";

/**
 * متصفح المشاريع المشتركة — الصفحة العمومية.
 * يعرض فعاليات/برامج/مشاريع مشتركة بين الجمعيات والجهات،
 * بتصفية حسب النوع — متعدد اللغات (RTL/LTR).
 */
import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Handshake, CalendarDays, MapPin, Landmark, Briefcase, Globe, Users2,
  Building2, Sparkles, Target, ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useI18n, useDemoI18n, useDocumentTitle } from "@/lib/i18n/provider";
import type { DemoProject } from "@/generated/types";

const PARTNER_ICONS: Record<string, typeof Landmark> = {
  ASSOCIATION: Building2,
  GOVERNMENT: Landmark,
  PRIVATE: Briefcase,
  NGO: Users2,
  INTERNATIONAL: Globe,
};

export function ProjectsBrowser({ projects }: { projects: DemoProject[] }) {
  const { d } = useI18n();
  const demo = useDemoI18n();
  const t = d.projects;
  useDocumentTitle(d.meta.pages.projects);

  const [filter, setFilter] = useState<"ALL" | "EVENT" | "PROGRAM" | "PROJECT">("ALL");

  const counts = useMemo(
    () => ({
      ALL: projects.length,
      EVENT: projects.filter((p) => p.kind === "EVENT").length,
      PROGRAM: projects.filter((p) => p.kind === "PROGRAM").length,
      PROJECT: projects.filter((p) => p.kind === "PROJECT").length,
    }),
    [projects]
  );

  const filtered = filter === "ALL" ? projects : projects.filter((p) => p.kind === filter);

  const kindLabel = (k: string) =>
    k === "EVENT" ? t.kindEvent : k === "PROGRAM" ? t.kindProgram : t.kindProject;
  const kindIconCls = (k: string) =>
    k === "EVENT" ? "bg-emerald-50 text-emerald-700" : k === "PROGRAM" ? "bg-sky-50 text-sky-700" : "bg-gold-soft text-yellow-800";
  const statusInfo = (s: string) =>
    s === "IN_PROGRESS"
      ? { label: t.statusInProgress, cls: "border-sky-200 bg-sky-50 text-sky-700" }
      : s === "COMPLETED"
        ? { label: t.statusCompleted, cls: "border-primary/25 bg-secondary text-primary" }
        : s === "CANCELLED"
          ? { label: t.statusCancelled, cls: "border-red-200 bg-red-50 text-red-700" }
          : { label: t.statusPublished, cls: "border-emerald-200 bg-emerald-50 text-emerald-700" };
  const roleLabel = (r: string) =>
    r === "COORDINATION" ? t.roleCoordination
      : r === "FUNDING" ? t.roleFunding
        : r === "SUPPORT" ? t.roleSupport
          : t.roleExecution;
  const partnerTypeLabel = (type: string) =>
    type === "ASSOCIATION" ? d.nav.associations
      : type === "GOVERNMENT" ? t.partnerGovernment
        : type === "PRIVATE" ? t.partnerPrivate
          : type === "INTERNATIONAL" ? t.partnerInternational
            : t.partnerNgo;

  const TABS: { key: typeof filter; label: string; count: number }[] = [
    { key: "ALL", label: t.filterAll, count: counts.ALL },
    { key: "EVENT", label: t.filterEvents, count: counts.EVENT },
    { key: "PROGRAM", label: t.filterPrograms, count: counts.PROGRAM },
    { key: "PROJECT", label: t.filterProjects, count: counts.PROJECT },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* الترويسة */}
      <div className="mx-auto mb-10 max-w-3xl text-center">
        <Badge variant="outline" className="mb-4 gap-1.5 border-primary/30 px-3 py-1 text-[12px] font-bold text-primary">
          <Handshake className="size-3.5" />
          {t.badge}
        </Badge>
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
          {t.titleA} <span className="text-primary">{t.titleB}</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-muted-foreground">
          {t.subtitle}
        </p>
      </div>

      {/* التصفية */}
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={cn(
              "rounded-full border px-4 py-2 text-[13px] font-bold transition-colors",
              filter === tab.key
                ? "border-primary bg-secondary text-primary"
                : "border-border text-muted-foreground hover:border-primary/40 hover:text-primary"
            )}
          >
            {tab.label}
            <span className="num ms-1.5 text-[11px] opacity-70">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* البطاقات */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-16 text-center">
            <Handshake className="size-10 text-muted-foreground/40" />
            <p className="font-bold">{t.emptyTitle}</p>
            <p className="max-w-md text-sm leading-6 text-muted-foreground">{t.emptyDesc}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p) => {
            const st = statusInfo(p.status);
            const KindIcon =
              p.kind === "EVENT" ? CalendarDays : p.kind === "PROGRAM" ? Sparkles : Target;
            return (
              <Card key={p.id} className="flex h-full flex-col transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl">
                <CardContent className="flex h-full flex-col p-5">
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <span className={cn("grid size-11 shrink-0 place-items-center rounded-xl", kindIconCls(p.kind))}>
                      <KindIcon className="size-5" />
                    </span>
                    <div className="flex min-w-0 flex-wrap justify-end gap-1.5">
                      <Badge variant="outline" className={cn("text-[10px]", st.cls)}>{st.label}</Badge>
                      <Badge variant="secondary" className="text-[10px]">{kindLabel(p.kind)}</Badge>
                    </div>
                  </div>

                  <h3 className="mb-2 font-extrabold leading-snug">{p.title}</h3>
                  <p className="mb-3 line-clamp-3 text-[13px] leading-6 text-muted-foreground">{p.description}</p>

                  <div className="mb-3 space-y-1 text-[12px] font-bold text-muted-foreground">
                    <p className="flex items-center gap-1.5">
                      <CalendarDays className="size-3.5 shrink-0 text-primary" />
                      {demo.fmtDate(p.startDate ?? new Date().toISOString())}
                      {p.endDate ? ` → ${demo.fmtDate(p.endDate)}` : ""}
                    </p>
                    {(p.location || p.city) && (
                      <p className="flex items-center gap-1.5">
                        <MapPin className="size-3.5 shrink-0 text-primary" />
                        <span className="truncate">{p.location}{p.city ? ` · ${demo.city(p.city)}` : ""}</span>
                      </p>
                    )}
                    {p.objectives && (
                      <p className="flex items-start gap-1.5">
                        <Target className="mt-0.5 size-3.5 shrink-0 text-gold" />
                        <span className="line-clamp-2 font-semibold">{p.objectives}</span>
                      </p>
                    )}
                  </div>

                  {/* الجهات */}
                  <div className="mt-auto border-t border-border pt-3">
                    <p className="mb-1.5 flex items-center gap-1.5 text-[11.5px] font-bold text-muted-foreground">
                      <Landmark className="size-3.5 text-gold" />
                      {t.leadLabel}: <span className="text-foreground">{d.demo.associations[p.leadSlug]?.name ?? p.leadName}</span>
                    </p>
                    {p.participants.length === 0 ? (
                      <p className="text-[11.5px] text-muted-foreground">{t.noParticipants}</p>
                    ) : (
                      <ul className="space-y-1">
                        {p.participants.map((pt, i) => {
                          const Icon = PARTNER_ICONS[pt.type] ?? Building2;
                          return (
                            <li key={i} className="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[11.5px]">
                              <Icon className="size-3.5 shrink-0 text-primary" />
                              <span className="min-w-0 max-w-full break-words font-bold">{pt.name}</span>
                              <span className="text-muted-foreground">
                                · {roleLabel(pt.role)}
                                {pt.type !== "ASSOCIATION" && ` · ${partnerTypeLabel(pt.type)}`}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* نداء */}
      <div className="gradient-dark zellige-pattern relative mt-14 overflow-hidden rounded-3xl px-6 py-12 text-center text-white sm:px-12">
        <div className="pointer-events-none absolute -top-24 left-1/2 size-72 -translate-x-1/2 rounded-full bg-gold/15 blur-3xl" aria-hidden="true" />
        <span className="mx-auto mb-5 grid size-14 place-items-center rounded-2xl border border-gold/30 bg-gold/15">
          <Handshake className="size-7 text-gold" />
        </span>
        <h2 className="mx-auto max-w-2xl text-2xl font-black tracking-tight sm:text-3xl">{t.ctaTitle}</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-white/75 sm:text-base sm:leading-8">
          {t.ctaDesc}
        </p>
        <Button asChild size="lg" className="mt-7 h-12 gap-2 bg-gold px-7 text-base font-extrabold text-[#061229] hover:bg-gold/90">
          <Link href="/register">
            {t.ctaBtn}
            <ArrowRight className="size-4 rtl:hidden" />
            <ArrowRight className="size-4 ltr:hidden -scale-x-100" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
