import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Smartphone, Download, ShieldCheck, PackageCheck, Rocket,
  BadgeCheck, Lock, Wifi, CheckCircle2, ChevronDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ReleaseInfoCard } from "@/components/site/release-info-card";

export const metadata: Metadata = {
  title: "تطبيق أندرويد الرسمي",
  description:
    "حمّلوا تطبيق منصة مامب لأندرويد — الإصدار الرسمي الموقّع بشهادة CN=TARIK CHOUIKA، مع دليل خطوة بخطوة للتنزيل والتثبيت الآمن.",
  alternates: { canonical: "/app/" },
};

/** بيانات منظمة للتطبيق — تحسين الفهرسة */
const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "MobileApplication",
  name: "منصة مامب — تطبيق أندرويد",
  operatingSystem: "Android 7.0+",
  applicationCategory: "GovernmentApplication",
  inLanguage: "ar",
  offers: { "@type": "Offer", price: "0", priceCurrency: "MAD" },
  author: { "@type": "Person", name: "TARIK CHOUIKA" },
  downloadUrl:
    "https://github.com/tarikchouika/moroccan-association-system/releases/latest/download/mamp.apk",
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "لماذا يطلب أندرويد السماح بالتثبيت من مصادر غير معروفة؟",
      acceptedAnswer: {
        "@type": "Answer",
        text: "لأن التطبيق يُوزع مباشرة عبر المستودع الرسمي للمنصة بدل متجر Google Play. الرسالة تحذير قياسي من أندرويد لكل تطبيق خارج المتجر، وبمجرد السماح مرة واحدة سيُثبَّت التطبيق بشكل عادي.",
      },
    },
    {
      "@type": "Question",
      name: "كيف أتأكد أن الملف رسمي ولم يُعبث به؟",
      acceptedAnswer: {
        "@type": "Answer",
        text: "كل إصدار موقّع رقمياً بشهادة CN=TARIK CHOUIKA بصلاحية 30 سنة، وبصمة الشهادة SHA-256 منشورة في ملاحظات كل إصدار على GitHub وفي هذه الصفحة. أي ملف لا يحمل هذا التوقيع ليس إصداراً رسمياً.",
      },
    },
    {
      "@type": "Question",
      name: "هل يتوفر التطبيق على iOS؟",
      acceptedAnswer: {
        "@type": "Answer",
        text: "حالياً الإصدار الرسمي مخصص لأندرويد. يمكن لمستعملي iPhone وiPad استعمال نسخة الويب الكاملة مباشرة من المتصفح عبر الرابط mamp.pages.dev بنفس الخدمات.",
      },
    },
  ],
};

const STEPS = [
  {
    icon: Download,
    title: "الخطوة 1 — تحميل الملف",
    desc: "اضغطوا زر «تحميل ملف APK» في هذه الصفحة، أو امسحوا رمز QR بكاميرا الهاتف. سيُحمّل ملف mamp.apk من المستودع الرسمي للمنصة على GitHub.",
  },
  {
    icon: ShieldCheck,
    title: "الخطوة 2 — السماح بالتثبيت",
    desc: "عند فتح الملف سيطلب أندرويد السماح بتثبيت التطبيقات من هذا المصدر (رسالة قياسية لكل تطبيق خارج المتجر). اضغطوا «الإعدادات» ثم فعّلوا «السماح من هذا المصدر».",
  },
  {
    icon: PackageCheck,
    title: "الخطوة 3 — تثبيت التطبيق",
    desc: "ارجعوا لشاشة التثبيت واضغطوا «تثبيت». انتظروا ثواني قليلة حتى تكتمل العملية — لا حاجة لأي إعدادات إضافية.",
  },
  {
    icon: Rocket,
    title: "الخطوة 4 — الفتح والاستعمال",
    desc: "افتحوا تطبيق «منصة مامب» من قائمة التطبيقات: دليل الجمعيات، المساعد الجمعوي، والفعاليات — كلها بين أيديكم مع سحب للأسفل للتحديث.",
  },
];

const FEATURES = [
  { icon: BadgeCheck, text: "الإصدار الرسمي الوحيد المعتمد للمنصة" },
  { icon: Lock, text: "اتصال مشفر HTTPS فقط — لا محتوى مختلط" },
  { icon: Wifi, text: "صفحة عربية واضحة عند انقطاع الاتصال" },
  { icon: CheckCircle2, text: "تحديث تلقائي: نفس الرابط يخدم دائماً آخر إصدار" },
];

const FAQ = [
  {
    q: "لماذا يطلب أندرويد السماح بالتثبيت من «مصادر غير معروفة»؟",
    a: "لأن التطبيق يُوزع مباشرة عبر المستودع الرسمي للمنصة على GitHub بدل متجر Google Play. هذه الرسالة تحذير قياسي يظهر لكل تطبيق خارج المتجر، وبمجرد السماح مرة واحدة سيُثبَّت التطبيق بشكل عادي تماماً.",
  },
  {
    q: "كيف أتأكد أن الملف رسمي ولم يُعبث به؟",
    a: "كل إصدار موقّع رقمياً بشهادة CN=TARIK CHOUIKA بصلاحية 30 سنة. بصمة الشهادة (SHA-256) تُنشر تلقائياً في ملاحظات كل إصدار على GitHub وتُعرض في هذه الصفحة. أي ملف لا يحمل هذا التوقيع ليس إصداراً رسمياً ولا يجب تثبيته.",
  },
  {
    q: "ما هي متطلبات التشغيل؟",
    a: "هاتف أو لوح أندرويد بنظام Android 7.0 (نوجا) أو أحدث، مع اتصال بالإنترنت. التطبيق غلاف رسمي للمنصة يعمل عبر mamp.pages.dev ويستهلك مساحة صغيرة جداً على الجهاز.",
  },
  {
    q: "هل يتوفر التطبيق على iOS؟",
    a: "حالياً الإصدار الرسمي مخصص لأندرويد. يمكن لمستعملي iPhone وiPad استعمال نسخة الويب الكاملة مباشرة من المتصفح (Safari أو Chrome) عبر mamp.pages.dev بنفس الخدمات والمحتوى.",
  },
];

export default function AppPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* البطل */}
      <section className="mb-12 text-center">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-secondary/60 px-4 py-1.5 text-xs font-extrabold text-primary">
          <Smartphone className="size-3.5" />
          التطبيق الرسمي — أندرويد
        </div>
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
          منصة مامب في جيبكم{" "}
          <span className="text-primary">بتطبيق واحد</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-muted-foreground">
          تطبيق أندرويد الرسمي للمنصة: تصفحوا دليل الجمعيات، تواصلوا مع المساعد
          الجمعوي، وسجلوا في الفعاليات — بضغطة واحدة وبتوقيع رقمي موثّق.
        </p>
      </section>

      <div className="grid items-start gap-8 lg:grid-cols-[1fr_400px]">
        {/* الخطوات */}
        <div className="space-y-4">
          <h2 className="text-xl font-extrabold">طريقة التنزيل والتثبيت</h2>
          {STEPS.map((s, i) => (
            <Card key={s.title} className="overflow-hidden">
              <CardContent className="flex items-start gap-4 p-5">
                <div className="relative shrink-0">
                  <span className="grid size-14 place-items-center rounded-2xl bg-primary/10">
                    <s.icon className="size-7 text-primary" />
                  </span>
                  <span className="absolute -end-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-gold text-[10px] font-black text-foreground">
                    {i + 1}
                  </span>
                </div>
                <div>
                  <h3 className="mb-1.5 text-[15px] font-extrabold">{s.title}</h3>
                  <p className="text-sm leading-7 text-muted-foreground">{s.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* ملاحظة المتجر */}
          <div className="rounded-2xl border border-gold/40 bg-gold-soft/50 p-4 text-[13px] leading-7">
            <p className="font-extrabold">💡 ملاحظة مهمة حول رسالة أندرويد</p>
            <p className="mt-1 text-muted-foreground">
              ظهور عبارة «مصدر غير معروف» أمر طبيعي ومتوقع: التطبيق يُوزع مباشرة
              من المستودع الرسمي للمنصة وليس من متجر تطبيقات. بمجرد السماح
              للمصدر مرة واحدة، ستمر التثبيات القادمة بسلاسة كاملة.
            </p>
          </div>
        </div>

        {/* العمود الجانبي: التحميل + QR + الأمان */}
        <div className="space-y-6 lg:sticky lg:top-24">
          <ReleaseInfoCard />

          {/* رمز QR */}
          <Card className="text-center">
            <CardContent className="p-5">
              <h3 className="mb-1 text-sm font-extrabold">مسح سريع بالكاميرا</h3>
              <p className="mb-4 text-[12px] leading-5 text-muted-foreground">
                وجّهوا كاميرا الهاتف نحو الرمز للوصول المباشر لهذه الصفحة
              </p>
              <div className="mx-auto w-fit rounded-2xl border-4 border-foreground p-2">
                <Image
                  src="/qr-app.png"
                  alt="رمز QR لصفحة تحميل تطبيق منصة مامب"
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

          {/* بطاقة الأمان والتوقيع */}
          <Card className="border-primary/20">
            <CardContent className="p-5">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-extrabold">
                <ShieldCheck className="size-4 text-primary" />
                الأمان والتوقيع الرقمي
              </h3>
              <ul className="space-y-2.5">
                <li className="flex items-start gap-2.5 text-[13px] leading-6 text-muted-foreground">
                  <BadgeCheck className="mt-0.5 size-4 shrink-0 text-gold" />
                  <span>
                    موقّع بشهادة رقمية باسم{" "}
                    <code dir="ltr" className="rounded bg-muted px-1.5 py-0.5 text-[11px] font-bold">
                      CN=TARIK CHOUIKA
                    </code>{" "}
                    — صلاحية 30 سنة (2026 – 2056)
                  </span>
                </li>
                <li className="flex items-start gap-2.5 text-[13px] leading-6 text-muted-foreground">
                  <BadgeCheck className="mt-0.5 size-4 shrink-0 text-gold" />
                  <span>يُبنى ويُوقّع آلياً عبر سير عمل GitHub — بلا تدخل يدوي</span>
                </li>
                <li className="flex items-start gap-2.5 text-[13px] leading-6 text-muted-foreground">
                  <BadgeCheck className="mt-0.5 size-4 shrink-0 text-gold" />
                  <span>بصمة الشهادة والملف (SHA-256) منشورة في كل إصدار</span>
                </li>
              </ul>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {FEATURES.map((f) => (
                  <Badge key={f.text} variant="secondary" className="gap-1 text-[10px] font-bold">
                    <f.icon className="size-3 text-primary" />
                    {f.text}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* المتطلبات */}
          <div className="rounded-2xl border border-border bg-muted/40 p-4 text-[12px] leading-6 text-muted-foreground">
            <p className="mb-1 font-extrabold text-foreground">المتطلبات</p>
            <p>أندرويد 7.0 (نوجا) أو أحدث · اتصال بالإنترنت · حوالي 3 م.ب من المساحة</p>
          </div>
        </div>
      </div>

      {/* الأسئلة الشائعة */}
      <section className="mt-16">
        <h2 className="mb-6 flex items-center gap-2 text-xl font-extrabold">
          <ChevronDown className="size-5 text-primary" />
          أسئلة شائعة حول التطبيق
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {FAQ.map((item) => (
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
          تفضلون استعمال المنصة من المتصفح؟ النسخة الكاملة متاحة دائماً عبر{" "}
          <Link href="/" className="font-extrabold text-primary underline underline-offset-4">
            الصفحة الرئيسية
          </Link>{" "}
          — وتوجد الوثائق القانونية للتطبيق في{" "}
          <Link href="/legal/terms" className="font-extrabold text-primary underline underline-offset-4">
            شروط الاستخدام
          </Link>.
        </p>
      </section>
    </div>
  );
}
