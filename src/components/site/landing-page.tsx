"use client";

/**
 * صفحة الهبوط — منصة مامب
 * واجهة عصرية RTL بهوية مغربية (أخضر عميق + ذهب + نقشة زليج)
 */
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Users, Wallet, HeartHandshake, CalendarDays, FileCheck2, Landmark,
  ShieldCheck, BarChart3, Bot, ArrowLeft, CheckCircle2, Sparkles,
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

// -------------------------------------------------------------------
// عداد متحرك
// -------------------------------------------------------------------
function Counter({ to, suffix = "", duration = 1600 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [val, setVal] = useState(0);

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
      {val.toLocaleString("en-US")}
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
function Hero({ stats }: { stats: DemoData["stats"] }) {
  return (
    <section className="gradient-hero zellige-light relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 pb-16 pt-14 sm:px-6 lg:grid-cols-2 lg:pb-24 lg:pt-20">
        <div className="flex flex-col justify-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge className="mb-5 gap-1.5 border-gold/40 bg-gold-soft px-3 py-1.5 text-[12px] font-bold text-yellow-800">
              <BadgeCheck className="size-3.5" />
              أول منصة مغربية شاملة لرقمنة العمل الجمعوي
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="text-4xl font-black leading-[1.25] tracking-tight sm:text-5xl lg:text-[3.4rem]"
          >
            رقمنة إدارة ومحاسبة
            <br />
            <span className="text-gradient-gold">الجمعيات المغربية</span>
            <br />
            باحترافية وأمان
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="mt-5 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg"
          >
            من التأسيس إلى التقرير السنوي: انخراطات، محاسبة، تبرعات بوصولات رسمية،
            فعاليات، وثائق قانونية — ومساعد جمعوي ذكي يرشدكم خطوة بخطوة،
            وفق القانون 75.00 وظهير 15 نونبر 1958.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Button asChild size="lg" className="h-12 gap-2 px-7 text-base font-extrabold shadow-lg shadow-primary/25">
              <Link href="/register">
                ابدأوا مجاناً الآن
                <ArrowLeft className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 gap-2 px-7 text-base font-extrabold">
              <Link href="/associations">
                <Building2 className="size-4" />
                دليل الجمعيات
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
            <span className="flex items-center gap-1.5"><ScrollText className="size-4 text-primary" /> ظهير 1.58.376</span>
            <span className="flex items-center gap-1.5"><ScaleIcon /> القانون 75.00</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="size-4 text-primary" /> القانون 09.08 (CNDP)</span>
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
                جمعية ندوة للتنمية والتشغيل
              </div>
              <Badge className="border-gold/40 bg-gold/20 text-[10px] font-bold text-gold">موثقة ✓</Badge>
            </div>
            <CardContent className="grid grid-cols-2 gap-3 p-5">
              {[
                { icon: Users, label: "منخرط نشط", value: "13", tint: "text-primary bg-secondary" },
                { icon: TrendingUp, label: "مدخول 2026", value: "132,620 د.م", tint: "text-emerald-700 bg-emerald-50" },
                { icon: HandCoins, label: "تبرعات مسجلة", value: "70,100 د.م", tint: "text-yellow-800 bg-gold-soft" },
                { icon: Wallet, label: "رصيد الخزينة", value: "84,420 د.م", tint: "text-terra bg-orange-50" },
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
                  <Bot className="size-3.5" /> المساعد الجمعوي
                </p>
                <div className="space-y-1.5 text-[11px] leading-5">
                  <p className="w-fit max-w-[85%] rounded-lg rounded-ss-sm bg-card border border-border px-2.5 py-1.5">
                    كيف نودع ملف تأسيس الجمعية؟
                  </p>
                  <p className="w-fit max-w-[90%] rounded-lg rounded-se-sm bg-primary px-2.5 py-1.5 text-primary-foreground">
                    التصريح يودع بمقر السلطة المحلية مع 4 نسخ من القانون الأساسي ومحضر التأسيس… <span className="underline decoration-gold decoration-2">المزيد</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* شريط الإحصائيات */}
      <div className="border-t border-border/70 bg-card/60 backdrop-blur">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-x-reverse divide-border/60 px-4 py-6 text-center sm:px-6 lg:grid-cols-4">
          {[
            { label: "جمعية على المنصة", value: stats.associations, suffix: "" },
            { label: "منخرط ومتطوع", value: stats.activeMembers, suffix: "+" },
            { label: "عمليات مالية مسجلة", value: stats.transactions, suffix: "" },
            { label: "درهم مُدار رقمياً", value: stats.managedAmount, suffix: "" },
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

function ScaleIcon() {
  return <ScrollText className="size-4 text-primary" />;
}

// -------------------------------------------------------------------
// الخصائص
// -------------------------------------------------------------------
const FEATURES = [
  { icon: Users, title: "إدارة الانخراطات", desc: "ملفات الأعضاء، الطلبات، واجبات الانخراط السنوية بوصولات مرقمة، وتنبيهات التجديد." },
  { icon: Wallet, title: "محاسبة احترافية", desc: "مدخولات ومصروفات مصنفة، ميزانية تقديرية، اعتماد ثنائي، وتقرير مالي سنوي جاهز للطبع." },
  { icon: HandCoins, title: "التبرعات والوصولات", desc: "تسجيل التبرعات النقدية والعينية، توليد وصولات رسمية، وتتبع الامتثال (المساعدات الأجنبية)." },
  { icon: CalendarDays, title: "الفعاليات والأنشطة", desc: "برمجة الدورات والملتقيات والقوافل، تسجيل المشاركين عمومياً، ومتابعة الحضور." },
  { icon: FileCheck2, title: "الوثائق الرسمية", desc: "أرشيف موثق: القانون الأساسي، المحاضر، التقارير السنوية — بنسخ وتصنيف وحساسية." },
  { icon: Landmark, title: "الهوية الرقمية للجمعية", desc: "بطاقة رقمية تجمع ICE والتعريف الجبائي والمراجع القانونية — قابلة للمشاركة والتحقق." },
  { icon: BarChart3, title: "تقارير ولوحات قيادة", desc: "مؤشرات فورية ورسوم بيانية لأداء الجمعية، تصلح للعرض على الجمع العام والشركاء." },
  { icon: Bot, title: "المساعد الجمعوي", desc: "مساعد ذكي يجيب عن الإجراءات والقوانين — بقاعدة معارف رسمية مُتحقق منها، بلا هلوسة." },
  { icon: ShieldCheck, title: "أمان وصلاحيات دقيقة", desc: "تشفير كلمات السر، جلسات موقعة، صلاحيات لكل دور، وسجل تدقيق لكل العمليات الحساسة." },
];

function Features() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <motion.div {...fadeUp} className="mx-auto mb-12 max-w-2xl text-center">
        <Badge variant="outline" className="mb-4 gap-1.5 border-primary/30 px-3 py-1 text-[12px] font-bold text-primary">
          <Sparkles className="size-3.5" />
          خصائص شاملة
        </Badge>
        <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
          كل ما تحتاجه جمعيتكم في <span className="text-primary">منصة واحدة</span>
        </h2>
        <p className="mt-4 text-base leading-7 text-muted-foreground">
          صممنا كل وحدة لتخدم العمل الجمعوي اليومي كما تمليه القوانين المغربية،
          مع بساطة تصلح لكل مستويات الخبرة الرقمية.
        </p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => (
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
                  <f.icon className="size-6" />
                </span>
                <h3 className="mb-2 text-lg font-extrabold">{f.title}</h3>
                <p className="text-sm leading-7 text-muted-foreground">{f.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// -------------------------------------------------------------------
// الأدوار الخمسة
// -------------------------------------------------------------------
const ROLES = [
  {
    value: "super",
    icon: Lock,
    title: "السوبر أدمين",
    subtitle: "مالك المنصة",
    desc: "إشراف كامل: توثيق الجمعيات الجديدة وتعليق المخالفة منها، متابعة إحصائيات المنصة، إدارة المستخدمين، وسجل تدقيق يوثق كل عملية حساسة.",
    points: ["توثيق وتعليق الجمعيات", "إحصائيات المنصة الشاملة", "سجل التدقيق الكامل", "إدارة الحسابات والصلاحيات"],
  },
  {
    value: "admin",
    icon: UserCog,
    title: "أدمين الجمعية",
    subtitle: "أعضاء المكتب المسير",
    desc: "تسيير جمعيتهم بكل أريحية: قبول الانخراطات، تسجيل العمليات المالية، رفع الوثائق، تنظيم الفعاليات، وإصدار التقارير للجمع العام.",
    points: ["قبول/رفض طلبات الانخراط", "المحاسبة والميزانية", "الوثائق والتقارير الرسمية", "تنظيم الفعاليات"],
  },
  {
    value: "coadmin",
    icon: Handshake,
    title: "الكوأدمين",
    subtitle: "المنخرطون والمتطوعون",
    desc: "صلاحيات محددة يمنحها المكتب: تنظيم فعاليات، متابعة تسجيلات المشاركين، إدارة التواصل — مع فصل واضح عن المعطيات المالية.",
    points: ["تنظيم فعاليات موكلة", "استقبال تسجيلات المشاركين", "لوحة مخصصة للمهام", "بلا اطلاع على المالية"],
  },
  {
    value: "partner",
    icon: Landmark,
    title: "الجهات الحكومية والخاصة",
    subtitle: "الإدارات والشركاء المختصون",
    desc: "حسابات شريكة موثقة تمكن الجهات المختصة من الاطلاع على المعطيات المصرح بها للجمعيات (الحالة القانونية، ICE، التقارير العمومية).",
    points: ["عرض موثق للجمعيات", "التحقق من الهوية الرقمية", "التقارير العمومية", "قناة تواصل رسمية"],
  },
  {
    value: "citizen",
    icon: Globe2,
    title: "المواطنون والأجانب",
    subtitle: "العموم",
    desc: "حساب مجاني: استكشاف الجمعيات الموثقة، التبرع مع الحصول على وصل، التسجيل في الفعاليات العمومية، وطرح الأسئلة على المساعد الجمعوي.",
    points: ["دليل الجمعيات الموثقة", "التبرع بوصل رسمي", "التسجيل في الفعاليات", "المساعد الجمعوي"],
  },
];

function Roles() {
  return (
    <section className="gradient-dark zellige-pattern py-20 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div {...fadeUp} className="mx-auto mb-12 max-w-2xl text-center">
          <Badge className="mb-4 gap-1.5 border-gold/40 bg-gold/15 px-3 py-1 text-[12px] font-bold text-gold">
            <Users className="size-3.5" />
            نظام صلاحيات من خمسة مستويات
          </Badge>
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
            لكل فاعلٍ جمعوي <span className="text-gradient-gold">مكانه المناسب</span>
          </h2>
          <p className="mt-4 text-base leading-7 text-white/70">
            من مالك المنصة إلى المواطن: صلاحيات دقيقة مفحوصة على الخادم،
            تضمن الفصل بين الأدوار وحماية المعطيات الحساسة.
          </p>
        </motion.div>

        <Tabs defaultValue="super" dir="rtl" className="w-full">
          <TabsList className="mx-auto mb-8 flex h-auto w-full max-w-3xl flex-wrap justify-center gap-1 rounded-2xl border border-white/10 bg-white/5 p-1.5">
            {ROLES.map((r) => (
              <TabsTrigger
                key={r.value}
                value={r.value}
                className="rounded-xl px-4 py-2.5 text-[13px] font-bold data-[state=active]:bg-gold data-[state=active]:text-[#061229]"
              >
                <r.icon className="me-1.5 inline size-4" />
                {r.title}
              </TabsTrigger>
            ))}
          </TabsList>
          {ROLES.map((r) => (
            <TabsContent key={r.value} value={r.value} className="mt-0">
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
const STEPS = [
  { icon: FileSignature, title: "أنشئوا الحساب", desc: "تسجيل مجاني في دقيقة: مواطن، متطوع، أو عضو مكتب جمعية." },
  { icon: Building2, title: "سجلوا جمعيتكم", desc: "بطاقة تعريف كاملة تنتظر توثيق فريق المنصة — ثم تنفتح كل الوحدات." },
  { icon: Megaphone, title: "سيروا ونشروا", desc: "انخراطات، محاسبة، فعاليات، وثائق — كل شيء موثق ومتتبع." },
  { icon: Coins, title: "قيسوا وقروا الشركاء", desc: "تقارير رسمية وبطاقة هوية رقمية تقنع الممولين والإدارات." },
];

function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <motion.div {...fadeUp} className="mx-auto mb-14 max-w-2xl text-center">
        <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
          من الصفر إلى جمعية <span className="text-primary">رقمية بالكامل</span>
        </h2>
        <p className="mt-4 text-base leading-7 text-muted-foreground">أربع خطوات فقط تفصلكم عن تسيير جمعوي عصري.</p>
      </motion.div>

      <div className="relative grid gap-8 md:grid-cols-4">
        <div className="absolute top-7 right-[12%] left-[12%] hidden h-0.5 bg-gradient-to-l from-primary/10 via-primary/30 to-primary/10 md:block" aria-hidden="true" />
        {STEPS.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: i * 0.12 }}
            className="relative text-center"
          >
            <div className="relative z-10 mx-auto mb-4 grid size-14 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
              <s.icon className="size-6" />
              <span className="num absolute -top-2 -start-2 grid size-6 place-items-center rounded-full bg-gold text-[11px] font-black text-[#061229]">
                {i + 1}
              </span>
            </div>
            <h3 className="mb-2 text-base font-extrabold">{s.title}</h3>
            <p className="mx-auto max-w-[240px] text-[13px] leading-6 text-muted-foreground">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// -------------------------------------------------------------------
// معاينة الجمعيات
// -------------------------------------------------------------------
function AssociationsPreview({ associations }: { associations: DemoData["associations"] }) {
  if (!associations.length) return null;
  return (
    <section className="bg-muted/50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div {...fadeUp} className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              جمعيات <span className="text-primary">موثقة</span> على المنصة
            </h2>
            <p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground">
              كل جمعية تمر عبر مسار توثيق يتحقق من هويتها ومرجعها القانوني قبل الظهور في الدليل العمومي.
            </p>
          </div>
          <Button asChild variant="outline" className="font-bold">
            <Link href="/associations">
              كل الجمعيات
              <ArrowLeft className="size-4" />
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
                      <span className="grid size-12 place-items-center rounded-xl bg-secondary text-lg font-black text-primary">
                        {a.acronym?.slice(0, 2) || a.name.slice(0, 2)}
                      </span>
                      <div className="flex flex-col items-end gap-1.5">
                        {a.isVerified && (
                          <Badge className="gap-1 border-primary/25 bg-secondary px-2 py-0.5 text-[10px] font-bold text-primary">
                            <BadgeCheck className="size-3" /> موثقة
                          </Badge>
                        )}
                        {a.legalStatus === "PUBLIC_UTILITY" && (
                          <Badge variant="outline" className="border-gold/50 bg-gold-soft px-2 py-0.5 text-[10px] font-bold text-yellow-800">
                            منفعة عامة
                          </Badge>
                        )}
                      </div>
                    </div>
                    <h3 className="mb-1.5 text-lg font-extrabold leading-snug group-hover:text-primary transition-colors">{a.name}</h3>
                    <p className="mb-4 line-clamp-2 text-[13px] leading-6 text-muted-foreground">{a.description}</p>
                    <div className="flex items-center justify-between border-t border-border pt-4 text-[12px] font-bold text-muted-foreground">
                      <span>{a.category} · {a.city}</span>
                      <span className="flex items-center gap-1">
                        <Users className="size-3.5" />
                        <span className="num">{a.memberCount}</span> عضو
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
          «المساعد الجمعوي» — <span className="text-gradient-gold">مرشدكم الموثوق</span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-white/75">
          اسألوه عن خطوات تأسيس جمعية، وثائق التصريح، صفة المنفعة العامة، رقم ICE،
          الخصم الضريبي للتبرعات… يجيبكم من قاعدة معارف رسمية مُتحقق منها:
          <span className="font-bold text-gold"> بدون هلوسة وبدون روابط وهمية</span> —
          وإن لم يعرف، يقولها بصراحة ويوجهكم للمصدر الرسمي.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg" className="h-12 gap-2 bg-gold px-7 text-base font-extrabold text-[#061229] hover:bg-gold/90">
            <Link href="/assistant">
              <Bot className="size-5" />
              تحدثوا مع المساعد
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-12 gap-2 border-white/25 bg-transparent px-7 text-base font-extrabold text-white hover:bg-white/10 hover:text-white">
            <Link href="/legal">المرجع القانوني</Link>
          </Button>
        </div>
      </motion.div>
    </section>
  );
}

// -------------------------------------------------------------------
// الأسئلة الشائعة
// -------------------------------------------------------------------
const FAQS = [
  {
    q: "هل المنصة مجانية؟",
    a: "إنشاء الحساب، دليل الجمعيات، التسجيل في الفعاليات العمومية، والمساعد الجمعوي — مجانية لكل المستخدمين. تحتفظ المنصة بحق تقديم خدمات متقدمة للجمعيات الكبيرة لاحقاً مع إشعار مسبق.",
  },
  {
    q: "هل بيانات جمعيتنا آمنة؟",
    a: "نعم: كلمات السر مشفرة، الجلسات موقعة رقمياً، الصلاحيات مفحوصة في كل طلب على الخادم، وسجل التدقيق يوثق كل عملية. معالجة المعطيات الشخصية تتم بموافقة صريحة وفق القانون 09.08 (CNDP).",
  },
  {
    q: "هل المنصة بديلة عن الإدارات الرسمية؟",
    a: "لا. مامب أداة تسيير رقمية للجمعيات: تنظم ملفاتكم ومحاسبتكم ووثائقكم وتجهزها للمساطر الرسمية. التصريح لدى السلطة المحلية، النشر بالجريدة الرسمية، وطلبات الإدارات تتم عبر قنواتها الرسمية المعتمدة.",
  },
  {
    q: "كيف تتم عملية توثيق الجمعيات؟",
    a: "عند تسجيل جمعية جديدة يراجع فريق المنصة معطياتها (المرجع القانوني، المكتب، مجال العمل) قبل منحها علامة «موثقة» وظهورها في الدليل العمومي. الجمعيات غير الموثقة تبقى في وضع قيد المصادقة.",
  },
  {
    q: "هل يمكن للأجانب استعمال المنصة؟",
    a: "نعم، المنصة مفتوحة للمواطنين والأجانب على السواء: تصفح دليل الجمعيات، التبرع، التسجيل في الفعاليات العمومية — والواجهة متوفرة بالعربية مع دعم كامل لاتجاه RTL.",
  },
  {
    q: "ماذا لو احتاجت جمعيتنا تقريراً رسمياً؟",
    a: "وحدة التقارير تولد التقرير الأدبي والمالي السنوي وقائمة الانخراطات وسجل التبرعات — كلها بصيغة قابلة للطبع والعرض على الجمع العام أو الشركاء والجهات المانحة.",
  },
];

function FAQ() {
  return (
    <section className="mx-auto max-w-3xl px-4 pb-20 sm:px-6">
      <motion.div {...fadeUp} className="mb-10 text-center">
        <h2 className="text-3xl font-black tracking-tight sm:text-4xl">أسئلة شائعة</h2>
      </motion.div>
      <Accordion type="single" collapsible className="space-y-3">
        {FAQS.map((f, i) => (
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
  return (
    <>
      <Hero stats={data.stats} />
      <Features />
      <Roles />
      <HowItWorks />
      <AssociationsPreview associations={data.associations} />
      <AssistantCTA />
      <FAQ />
    </>
  );
}
