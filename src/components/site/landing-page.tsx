"use client";

/**
 * صفحة الهبوط — منصة MAMP
 * واجهة عصرية بهوية مغربية (أزرق سماوي + كحلي + ذهب + نقشة زليج)
 * متعددة اللغات: كل النصوص من القاموس، والاتجاه RTL/LTR حسب اللغة.
 */
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Users, Wallet, HeartHandshake, CalendarDays, FileCheck2, Landmark,
  ShieldCheck, BarChart3, Bot, CheckCircle2, Sparkles,
  Building2, HandCoins, ScrollText, UserCog, Globe2, BadgeCheck,
  FileSignature, Coins, Megaphone, Lock, TrendingUp, Handshake,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { DemoData } from "@/generated/types";
import { useI18n, useDemoI18n, useDocumentTitle } from "@/lib/i18n/provider";

// -------------------------------------------------------------------
// عداد متحرك
// -------------------------------------------------------------------
function Counter({ to, suffix = "", duration = 1600 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [val, setVal] = useState(0);
  const { fmtNum } = useDemoI18n();

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setVal(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);

  return (
    <span ref={ref} className="num font-black">
      {fmtNum(val)}
      {suffix}
    </span>
  );
}

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.55, ease: "easeOut" as const },
};

// -------------------------------------------------------------------
// البطل
// -------------------------------------------------------------------
function Hero({ stats, featured }: { stats: DemoData["stats"]; featured?: DemoData["associations"][number] }) {
  const { d } = useI18n();
  const { assocName, fmtMAD } = useDemoI18n();

  return (
    <section className="gradient-hero zellige-light relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 pb-16 pt-14 sm:px-6 lg:grid-cols-2 lg:pb-24 lg:pt-20">
        <div className="flex flex-col justify-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge className="mb-5 gap-1.5 border-gold/40 bg-gold-soft px-3 py-1.5 text-[12px] font-bold text-yellow-800">
              <BadgeCheck className="size-3.5" />
              {d.home.hero.badge}
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="text-4xl font-black leading-[1.25] tracking-tight sm:text-5xl lg:text-[3.4rem]"
          >
            {d.home.hero.titleA}
            <br />
            <span className="text-gradient-gold">{d.home.hero.titleB}</span>
            <br />
            {d.home.hero.titleC}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="mt-5 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg"
          >
            {d.home.hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Button asChild size="lg" className="h-12 gap-2 px-7 text-base font-extrabold shadow-lg shadow-primary/25">
              <Link href="/register">
                {d.home.hero.ctaPrimary}
                <span className="inline-block rtl:rotate-0 ltr:rotate-180">←</span>
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 gap-2 px-7 text-base font-extrabold">
              <Link href="/associations">
                <Building2 className="size-4" />
                {d.home.hero.ctaSecondary}
              </Link>
            </Button>
          </motion.div>

          {/* شريط الثقة */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] font-bold text-muted-foreground"
          >
            <span className="flex items-center gap-1.5"><ScrollText className="size-4 text-primary" /> {d.home.hero.trustDahir}</span>
            <span className="flex items-center gap-1.5"><ScrollText className="size-4 text-primary" /> {d.home.hero.trustLaw}</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="size-4 text-primary" /> {d.home.hero.trustData}</span>
          </motion.div>
        </div>

        {/* لوحة مرئية */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative hidden lg:block"
        >
          <div className="absolute -inset-6 rounded-[2rem] bg-primary/5 blur-2xl" aria-hidden="true" />
          {/* بطاقة رئيسية: مؤشرات */}
          <Card className="relative overflow-hidden rounded-2xl border-primary/15 shadow-2xl">
            <div className="gradient-dark zellige-pattern flex items-center justify-between px-5 py-4 text-white">
              <div className="flex items-center gap-2 text-sm font-extrabold">
                <Building2 className="size-4 text-gold" />
                {featured ? assocName(featured) : ""}
              </div>
              <Badge className="border-gold/40 bg-gold/20 text-[10px] font-bold text-gold">{d.home.hero.cardVerified}</Badge>
            </div>
            <CardContent className="grid grid-cols-2 gap-3 p-5">
              {[
                { icon: Users, label: d.home.hero.cardActiveMember, value: "13", tint: "text-primary bg-secondary" },
                { icon: TrendingUp, label: d.home.hero.cardIncome, value: fmtMAD(132620), tint: "text-emerald-700 bg-emerald-50" },
                { icon: HandCoins, label: d.home.hero.cardDonations, value: fmtMAD(70100), tint: "text-yellow-800 bg-gold-soft" },
                { icon: Wallet, label: d.home.hero.cardTreasury, value: fmtMAD(84420), tint: "text-terra bg-orange-50" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-border bg-background p-3.5">
                  <span className={`mb-2 inline-flex size-8 items-center justify-center rounded-lg ${s.tint}`}>
                    <s.icon className="size-4" />
                  </span>
                  <p className="text-[11px] font-bold text-muted-foreground">{s.label}</p>
                  <p className="num mt-0.5 text-lg font-black">{s.value}</p>
                </div>
              ))}
              {/* شريط محادثة مصغرة */}
              <div className="col-span-2 rounded-xl border border-border bg-muted/50 p-3">
                <p className="mb-2 flex items-center gap-1.5 text-[11px] font-extrabold text-primary">
                  <Bot className="size-3.5" /> {d.home.hero.cardAssistant}
                </p>
                <div className="space-y-1.5 text-[11px] leading-5">
                  <p className="w-fit max-w-[85%] rounded-lg rounded-ss-sm bg-card border border-border px-2.5 py-1.5">
                    {d.home.hero.cardUserMsg}
                  </p>
                  <p className="w-fit max-w-[90%] rounded-lg rounded-se-sm bg-primary px-2.5 py-1.5 text-primary-foreground">
                    {d.home.hero.cardBotMsg} <span className="underline decoration-gold decoration-2">{d.common.learnMore}</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* شريط الإحصائيات */}
      <div className="border-t border-border/70 bg-card/60 backdrop-blur">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-border/60 px-4 py-6 text-center sm:px-6 rtl:divide-x-reverse lg:grid-cols-4">
          {[
            { label: d.home.hero.statAssociations, value: stats.associations, suffix: "" },
            { label: d.home.hero.statMembers, value: stats.activeMembers, suffix: "+" },
            { label: d.home.hero.statTransactions, value: stats.transactions, suffix: "" },
            { label: d.home.hero.statManaged, value: stats.managedAmount, suffix: "" },
          ].map((s) => (
            <div key={s.label} className="px-2 py-2">
              <p className="text-2xl font-black text-primary sm:text-3xl">
                <Counter to={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-1 text-[12px] font-bold text-muted-foreground sm:text-[13px]">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// -------------------------------------------------------------------
// الخصائص
// -------------------------------------------------------------------
function Features() {
  const { d } = useI18n();
  const icons = [Users, Wallet, HandCoins, CalendarDays, FileCheck2, Landmark, BarChart3, Bot, ShieldCheck];

  return (
    <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <motion.div {...fadeUp} className="mx-auto mb-12 max-w-2xl text-center">
        <Badge variant="outline" className="mb-4 gap-1.5 border-primary/30 px-3 py-1 text-[12px] font-bold text-primary">
          <Sparkles className="size-3.5" />
          {d.home.features.badge}
        </Badge>
        <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
          {d.home.features.titleA} <span className="text-primary">{d.home.features.titleB}</span>
        </h2>
        <p className="mt-4 text-base leading-7 text-muted-foreground">
          {d.home.features.subtitle}
        </p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {d.home.features.items.map((f, i) => {
          const Icon = icons[i % icons.length];
          return (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: (i % 3) * 0.08 }}
            >
              <Card className="group h-full border-border/80 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5">
                <CardContent className="p-6">
                  <span className="mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-secondary text-primary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <Icon className="size-6" />
                  </span>
                  <h3 className="mb-2 text-lg font-extrabold">{f.title}</h3>
                  <p className="text-sm leading-7 text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

// -------------------------------------------------------------------
// الأدوار الخمسة
// -------------------------------------------------------------------
function Roles() {
  const { d } = useI18n();
  const icons = [Lock, UserCog, Handshake, Landmark, Globe2];

  return (
    <section className="gradient-dark zellige-pattern py-20 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div {...fadeUp} className="mx-auto mb-12 max-w-2xl text-center">
          <Badge className="mb-4 gap-1.5 border-gold/40 bg-gold/15 px-3 py-1 text-[12px] font-bold text-gold">
            <Users className="size-3.5" />
            {d.home.roles.badge}
          </Badge>
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
            {d.home.roles.titleA} <span className="text-gradient-gold">{d.home.roles.titleB}</span>
          </h2>
          <p className="mt-4 text-base leading-7 text-white/70">
            {d.home.roles.subtitle}
          </p>
        </motion.div>

        <Tabs defaultValue="super" className="w-full">
          <TabsList className="mx-auto mb-8 flex h-auto w-full max-w-3xl flex-wrap justify-center gap-1 rounded-2xl border border-white/10 bg-white/5 p-1.5">
            {d.home.roles.items.map((r, i) => (
              <TabsTrigger
                key={r.title}
                value={["super", "admin", "coadmin", "partner", "citizen"][i]}
                className="rounded-xl px-4 py-2.5 text-[13px] font-bold data-[state=active]:bg-gold data-[state=active]:text-[#061229]"
              >
                {(() => { const Icon = icons[i]; return <Icon className="me-1.5 inline size-4" />; })()}
                {r.title}
              </TabsTrigger>
            ))}
          </TabsList>
          {d.home.roles.items.map((r, i) => (
            <TabsContent key={r.title} value={["super", "admin", "coadmin", "partner", "citizen"][i]} className="mt-0">
              <div className="grid items-center gap-6 rounded-2xl border border-white/10 bg-white/[0.04] p-6 sm:p-8 lg:grid-cols-[1.2fr_1fr]">
                <div>
                  <p className="mb-1 text-[12px] font-bold uppercase tracking-wide text-gold">{r.subtitle}</p>
                  <h3 className="mb-3 text-2xl font-black">{r.title}</h3>
                  <p className="text-sm leading-8 text-white/75">{r.desc}</p>
                </div>
                <ul className="space-y-2.5">
                  {r.points.map((p) => (
                    <li key={p} className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold">
                      <CheckCircle2 className="size-4 shrink-0 text-gold" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}

// -------------------------------------------------------------------
// كيف تعمل المنصة
// -------------------------------------------------------------------
function HowItWorks() {
  const { d } = useI18n();
  const icons = [FileSignature, Building2, Megaphone, Coins];

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <motion.div {...fadeUp} className="mx-auto mb-14 max-w-2xl text-center">
        <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
          {d.home.howItWorks.titleA} <span className="text-primary">{d.home.howItWorks.titleB}</span>
        </h2>
        <p className="mt-4 text-base leading-7 text-muted-foreground">{d.home.howItWorks.subtitle}</p>
      </motion.div>

      <div className="relative grid gap-8 md:grid-cols-4">
        <div className="absolute top-7 right-[12%] left-[12%] hidden h-0.5 bg-gradient-to-l from-primary/10 via-primary/30 to-primary/10 md:block" aria-hidden="true" />
        {d.home.howItWorks.steps.map((s, i) => {
          const Icon = icons[i % icons.length];
          return (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="relative text-center"
            >
              <div className="relative z-10 mx-auto mb-4 grid size-14 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
                <Icon className="size-6" />
                <span className="num absolute -top-2 -start-2 grid size-6 place-items-center rounded-full bg-gold text-[11px] font-black text-[#061229]">
                  {i + 1}
                </span>
              </div>
              <h3 className="mb-2 text-base font-extrabold">{s.title}</h3>
              <p className="mx-auto max-w-[240px] text-[13px] leading-6 text-muted-foreground">{s.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

// -------------------------------------------------------------------
// معاينة الجمعيات
// -------------------------------------------------------------------
function AssociationsPreview({ associations }: { associations: DemoData["associations"] }) {
  const { d } = useI18n();
  const demo = useDemoI18n();

  if (!associations.length) return null;
  return (
    <section className="bg-muted/50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div {...fadeUp} className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              {d.home.preview.titleA} <span className="text-primary">{d.home.preview.titleB}</span>
            </h2>
            <p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground">
              {d.home.preview.subtitle}
            </p>
          </div>
          <Button asChild variant="outline" className="font-bold">
            <Link href="/associations">
              {d.home.preview.viewAll}
              <span className="inline-block rtl:rotate-0 ltr:rotate-180">←</span>
            </Link>
          </Button>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-3">
          {associations.slice(0, 3).map((a, i) => (
            <motion.div
              key={a.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
            >
              <Link href={`/associations/${a.slug}`} className="group block h-full">
                <Card className="h-full transition-all duration-300 group-hover:-translate-y-1.5 group-hover:border-primary/30 group-hover:shadow-xl">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-start justify-between">
                      {a.logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element -- لوغو data URL من قاعدة البيانات
                        <img
                          src={a.logoUrl}
                          alt={demo.assocName(a)}
                          className="size-12 rounded-xl border border-border bg-white object-contain p-1"
                          loading="lazy"
                        />
                      ) : (
                        <span className="grid size-12 place-items-center rounded-xl bg-secondary text-lg font-black text-primary">
                          {demo.assocAcronym(a)?.slice(0, 2) || a.name.slice(0, 2)}
                        </span>
                      )}
                      <div className="flex flex-col items-end gap-1.5">
                        {a.isVerified && (
                          <Badge className="gap-1 border-primary/25 bg-secondary px-2 py-0.5 text-[10px] font-bold text-primary">
                            <BadgeCheck className="size-3" /> {d.common.verified}
                          </Badge>
                        )}
                        {a.legalStatus === "PUBLIC_UTILITY" && (
                          <Badge variant="outline" className="border-gold/50 bg-gold-soft px-2 py-0.5 text-[10px] font-bold text-yellow-800">
                            {d.common.publicUtility}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <h3 className="mb-1.5 text-lg font-extrabold leading-snug group-hover:text-primary transition-colors">{demo.assocName(a)}</h3>
                    <p className="mb-4 line-clamp-2 text-[13px] leading-6 text-muted-foreground">{demo.assocDescription(a)}</p>
                    <div className="flex items-center justify-between border-t border-border pt-4 text-[12px] font-bold text-muted-foreground">
                      <span>{demo.category(a.category)} · {demo.city(a.city)}</span>
                      <span className="flex items-center gap-1">
                        <Users className="size-3.5" />
                        <span className="num">{a.memberCount}</span> {d.common.memberWord}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// -------------------------------------------------------------------
// نداء المساعد
// -------------------------------------------------------------------
function AssistantCTA() {
  const { d } = useI18n();

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6 }}
        className="gradient-dark zellige-pattern relative overflow-hidden rounded-3xl px-6 py-14 text-center text-white sm:px-12"
      >
        <div className="pointer-events-none absolute -top-24 left-1/2 size-72 -translate-x-1/2 rounded-full bg-gold/15 blur-3xl" aria-hidden="true" />
        <span className="mx-auto mb-6 grid size-16 place-items-center rounded-2xl border border-gold/30 bg-gold/15">
          <Bot className="size-8 text-gold" />
        </span>
        <h2 className="mx-auto max-w-2xl text-3xl font-black tracking-tight sm:text-4xl">
          {d.home.assistantCta.titleA} <span className="text-gradient-gold">{d.home.assistantCta.titleB}</span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-white/75">
          {d.home.assistantCta.subtitle}
          <span className="font-bold text-gold">{d.home.assistantCta.subtitleBold}</span>
          {d.home.assistantCta.subtitleEnd}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg" className="h-12 gap-2 bg-gold px-7 text-base font-extrabold text-[#061229] hover:bg-gold/90">
            <Link href="/assistant">
              <Bot className="size-5" />
              {d.home.assistantCta.cta}
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-12 gap-2 border-white/25 bg-transparent px-7 text-base font-extrabold text-white hover:bg-white/10 hover:text-white">
            <Link href="/legal">{d.home.assistantCta.secondary}</Link>
          </Button>
        </div>
      </motion.div>
    </section>
  );
}

// -------------------------------------------------------------------
// الأسئلة الشائعة
// -------------------------------------------------------------------
function FAQ() {
  const { d } = useI18n();

  return (
    <section className="mx-auto max-w-3xl px-4 pb-20 sm:px-6">
      <motion.div {...fadeUp} className="mb-10 text-center">
        <h2 className="text-3xl font-black tracking-tight sm:text-4xl">{d.home.faq.title}</h2>
      </motion.div>
      <Accordion type="single" collapsible className="space-y-3">
        {d.home.faq.items.map((f, i) => (
          <AccordionItem key={i} value={`q${i}`} className="rounded-xl border border-border bg-card px-5 shadow-sm data-[state=open]:border-primary/30">
            <AccordionTrigger className="py-4 text-start text-[15px] font-extrabold hover:no-underline">
              {f.q}
            </AccordionTrigger>
            <AccordionContent className="pb-4 pt-0 text-sm leading-7 text-muted-foreground">
              {f.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

// -------------------------------------------------------------------
// الصفحة
// -------------------------------------------------------------------
export function LandingPage({ data }: { data: DemoData }) {
  const { d } = useI18n();
  // الصفحة الرئيسية: عنوان الموقع الافتراضي + وصف موحد بلغة الواجهة
  useDocumentTitle(undefined, d.meta.siteDescription);
  return (
    <>
      <Hero stats={data.stats} featured={data.associations[0]} />
      <Features />
      <Roles />
      <HowItWorks />
      <AssociationsPreview associations={data.associations} />
      <AssistantCTA />
      <FAQ />
    </>
  );
}
