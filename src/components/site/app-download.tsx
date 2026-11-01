"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Smartphone, Download, PackageCheck, Rocket,
  BadgeCheck, Lock, Wifi, CheckCircle2, ChevronDown, Cloud,
  FileArchive, MousePointerClick, TabletSmartphone,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ReleaseInfoCard } from "@/components/site/release-info-card";
import { useI18n } from "@/lib/i18n/provider";

/** رابط ZIP نسخة الويب الكاملة — يولد آلياً مع كل نشر على كلاودفلير */
const SITE_ZIP_URL = "https://mamp.pages.dev/mamp-site-latest.zip";

const STEP_ICONS = [Download, MousePointerClick, PackageCheck, Rocket];
const FEATURE_ICONS = [BadgeCheck, Lock, Wifi, CheckCircle2, TabletSmartphone];

/** جسم صفحة التطبيق — مكون عميل متعدد اللغات */
export function AppDownloadBody() {
  const { d } = useI18n();
  const t = d.app;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* البطل + صورة التطبيق */}
      <section className="mb-12">
        <div className="mb-5 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-secondary/60 px-4 py-1.5 text-xs font-extrabold text-primary">
            <Smartphone className="size-3.5" />
            {t.badge}
          </div>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
            {t.titleA}{" "}
            <span className="text-primary">{t.titleB}</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-muted-foreground">
            {t.subtitle}
          </p>
        </div>
        <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-border shadow-xl shadow-primary/5">
          <Image
            src="/app-hero.png"
            alt={t.heroImageAlt}
            width={960}
            height={640}
            priority
            className="h-auto w-full"
          />
        </div>
      </section>

      <div className="grid items-start gap-8 lg:grid-cols-[1fr_400px]">
        {/* الخطوات */}
        <div className="space-y-4">
          <h2 className="text-xl font-extrabold">{t.downloadTitle}</h2>
          {t.steps.map((s, i) => {
            const Icon = STEP_ICONS[i % STEP_ICONS.length];
            return (
              <Card key={s.title} className="overflow-hidden">
                <CardContent className="flex items-start gap-4 p-5">
                  <div className="relative shrink-0">
                    <span className="grid size-14 place-items-center rounded-2xl bg-primary/10">
                      <Icon className="size-7 text-primary" />
                    </span>
                    <span className="absolute -end-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-gold text-[10px] font-black text-[#061229]">
                      {i + 1}
                    </span>
                  </div>
                  <div>
                    <h3 className="mb-1.5 text-[15px] font-extrabold">{s.title}</h3>
                    <p className="text-sm leading-7 text-muted-foreground">{s.desc}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* ملاحظة المتجر */}
          <div className="rounded-2xl border border-gold/40 bg-gold-soft/50 p-4 text-[13px] leading-7">
            <p className="font-extrabold">{t.noteTitle}</p>
            <p className="mt-1 text-muted-foreground">
              {t.noteBody}
            </p>
          </div>

          {/* دليل Play Protect بالصور */}
          <h2 className="pt-6 text-xl font-extrabold">
            {t.playProtectTitle}
          </h2>
          <p className="-mt-2 text-sm leading-7 text-muted-foreground">
            {t.playProtectIntro}
          </p>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {t.playProtectSteps.map((p, i) => (
              <Card key={p.title} className="overflow-hidden">
                <div className="relative bg-muted/40">
                  <Image
                    src={`/playprotect-${i + 1}.png`}
                    alt={p.alt}
                    width={560}
                    height={560}
                    className="h-auto w-full"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="mb-1.5 flex items-center gap-2 text-[14px] font-extrabold leading-6">
                    <span className="grid size-6 shrink-0 place-items-center rounded-lg bg-primary text-[11px] font-black text-primary-foreground">
                      {i + 1}
                    </span>
                    {p.title}
                  </h3>
                  <p className="text-[12.5px] leading-6 text-muted-foreground">{p.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* العمود الجانبي */}
        <div className="space-y-6 lg:sticky lg:top-24">
          <ReleaseInfoCard />

          {/* رمز QR */}
          <Card className="text-center">
            <CardContent className="p-5">
              <h3 className="mb-1 text-sm font-extrabold">{t.qrTitle}</h3>
              <p className="mb-4 text-[12px] leading-5 text-muted-foreground">
                {t.qrDesc}
              </p>
              <div className="mx-auto w-fit rounded-2xl border-4 border-foreground p-2">
                <Image
                  src="/qr-app.png"
                  alt={t.qrAlt}
                  width={220}
                  height={220}
                  className="rounded-lg"
                />
              </div>
              <p dir="ltr" className="mt-3 text-[11px] font-bold text-muted-foreground">
                mamp.pages.dev/app
              </p>
            </CardContent>
          </Card>

          {/* مزايا التطبيق */}
          <Card>
            <CardContent className="p-5">
              <h3 className="mb-3 text-sm font-extrabold">{t.featuresTitle}</h3>
              <div className="flex flex-wrap gap-1.5">
                {t.features.map((f, i) => {
                  const Icon = FEATURE_ICONS[i % FEATURE_ICONS.length];
                  return (
                    <Badge key={f} variant="secondary" className="gap-1 text-[10px] font-bold">
                      <Icon className="size-3 text-primary" />
                      {f}
                    </Badge>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* نسخة الويب الكاملة — ZIP من كلاودفلير */}
          <Card className="border-primary/20">
            <CardContent className="p-5">
              <h3 className="mb-2 flex items-center gap-2 text-sm font-extrabold">
                <FileArchive className="size-4 text-primary" />
                {t.webVersionTitle}
              </h3>
              <p className="mb-4 text-[12.5px] leading-6 text-muted-foreground">
                {t.webVersionDesc}
              </p>
              <a
                href={SITE_ZIP_URL}
                download
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-3 text-[13px] font-extrabold text-secondary-foreground transition-all hover:bg-secondary/70 active:scale-[0.98]"
              >
                <Cloud className="size-4.5 text-primary" />
                {t.webVersionBtn}
              </a>
              <p dir="ltr" className="mt-2.5 break-all text-center text-[10px] leading-4 text-muted-foreground">
                mamp.pages.dev/mamp-site-latest.zip
              </p>
            </CardContent>
          </Card>

          {/* المتطلبات */}
          <div className="rounded-2xl border border-border bg-muted/40 p-4 text-[12px] leading-6 text-muted-foreground">
            <p className="mb-1 font-extrabold text-foreground">{t.requirementsTitle}</p>
            <p>{t.requirementsText}</p>
          </div>
        </div>
      </div>

      {/* الأسئلة الشائعة */}
      <section className="mt-16">
        <h2 className="mb-6 flex items-center gap-2 text-xl font-extrabold">
          <ChevronDown className="size-5 text-primary" />
          {t.faqTitle}
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {t.faq.map((item) => (
            <Card key={item.q}>
              <CardContent className="p-5">
                <h3 className="mb-2 text-[15px] font-extrabold leading-7">{item.q}</h3>
                <p className="text-sm leading-7 text-muted-foreground">{item.a}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* روابط ذات صلة */}
      <section className="mt-12 rounded-2xl border border-border bg-card p-6 text-center">
        <p className="text-sm leading-7 text-muted-foreground">
          {t.relatedPrefix}{" "}
          <Link href="/" className="font-extrabold text-primary underline underline-offset-4">
            {t.relatedHomeLink}
          </Link>{" "}
          {t.relatedMiddle}{" "}
          <Link href="/legal/terms" className="font-extrabold text-primary underline underline-offset-4">
            {t.relatedTermsLink}
          </Link>{t.relatedSuffix}
        </p>
      </section>
    </div>
  );
}
