import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "تطبيق أندرويد الرسمي",
  description:
    "حمّلوا تطبيق منصة مامب لأندرويد — رابط مباشر من كلاودفلير، مع دليل مبسّط بالصور للتنزيل والتثبيت وتجاوز رسالة Play Protect.",
  alternates: { canonical: "/app/" },
};

/** رابط ZIP نسخة الويب الكاملة — يولد آلياً مع كل نشر على كلاودفلير */
const SITE_ZIP_URL = "https://mamp.pages.dev/mamp-site-latest.zip";

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
  downloadUrl: "https://mamp-dl.pages.dev/mamp.apk",
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
        text: "لأن التطبيق يُوزع مباشرة عبر الموقع الرسمي للمنصة بدل متجر Google Play. الرسالة تحذير قياسي من أندرويد لكل تطبيق خارج المتجر، وبمجرد السماح مرة واحدة سيُثبَّت التطبيق بشكل عادي.",
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
    desc: "اضغطوا زر «تحميل مباشر — كلاودفلير» في هذه الصفحة، أو امسحوا رمز QR بكاميرا الهاتف. سيُحمّل ملف mamp.apk بأسرع سرعة من شبكة كلاودفلير العالمية.",
  },
  {
    icon: MousePointerClick,
    title: "الخطوة 2 — تجاوز رسالة Play Protect",
    desc: "قد تظهر رسالة «لم يتم فحص هذا التطبيق» — وهي رسالة قياسية لكل تطبيق خارج المتجر. اضغطوا «المزيد من التفاصيل» ثم «التثبيت على أي حال» كما في الصور بالأسفل.",
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

/** دليل تجاوز Play Protect بالصور — نفس الصور المولدة أعلاه */
const PLAY_PROTECT = [
  {
    img: "/playprotect-1.png",
    title: "رسالة Play Protect عند التثبيت",
    desc: "عند فتح ملف APK قد تظهر رسالة «لم يتم فحص هذا التطبيق». اضغطوا الزر الأزرق «المزيد من التفاصيل» بالأسفل — ولا تختاروا «إلغاء».",
  },
  {
    img: "/playprotect-2.png",
    title: "تفاصيل التحذير",
    desc: "يشرح أندرويد أن التطبيق خارج متجر Play — وهذا طبيعي لكل التطبيقات الموزعة مباشرة. اضغطوا «التثبيت على أي حال» للمتابعة.",
  },
  {
    img: "/playprotect-3.png",
    title: "اكتمال التثبيت",
    desc: "خلال ثوانٍ يكتمل التثبيت ويظهر زر «فتح التطبيق». هذه الخطوات تُطلب مرة واحدة فقط — التحديثات القادمة تمر بسلاسة.",
  },
];

const FEATURES = [
  { icon: BadgeCheck, text: "الإصدار الرسمي الوحيد المعتمد للمنصة" },
  { icon: Lock, text: "اتصال مشفر HTTPS فقط — لا محتوى مختلط" },
  { icon: Wifi, text: "صفحة عربية واضحة عند انقطاع الاتصال" },
  { icon: CheckCircle2, text: "تحديث تلقائي: نفس الرابط يخدم دائماً آخر إصدار" },
  { icon: TabletSmartphone, text: "يتكيف مع الهواتف واللوح — ملء كامل للشاشة" },
];

const FAQ = [
  {
    q: "لماذا يطلب أندرويد السماح بالتثبيت من «مصادر غير معروفة»؟",
    a: "لأن التطبيق يُوزع مباشرة عبر الموقع الرسمي للمنصة بدل متجر Google Play. هذه الرسالة تحذير قياسي يظهر لكل تطبيق خارج المتجر، وبمجرد السماح مرة واحدة سيُثبَّت التطبيق بشكل عادي تماماً.",
  },
  {
    q: "ما هي متطلبات التشغيل؟",
    a: "هاتف أو لوح أندرويد بنظام Android 7.0 (نوجا) أو أحدث، مع اتصال بالإنترنت. التطبيق غلاف رسمي للمنصة يعمل عبر mamp.pages.dev ويستهلك مساحة صغيرة جداً على الجهاز.",
  },
  {
    q: "هل يتوفر التطبيق على iOS؟",
    a: "حالياً الإصدار الرسمي مخصص لأندرويد. يمكن لمستعملي iPhone وiPad استعمال نسخة الويب الكاملة مباشرة من المتصفح (Safari أو Chrome) عبر mamp.pages.dev بنفس الخدمات والمحتوى.",
  },
  {
    q: "كيف أحصل على نسخة من موقع المنصة نفسه؟",
    a: "نسخة الويب الكاملة للمنصة متوفرة كملف مضغوط ZIP عبر رابط مباشر من كلاودفلير في هذه الصفحة (قسم «نسخة الويب الكاملة»)، ويُحدَّث الملف تلقائياً مع كل نشر رسمي جديد.",
  },
];

export default function AppPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* البطل + صورة التطبيق */}
      <section className="mb-12">
        <div className="mb-5 text-center">
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
            الجمعوي، وسجلوا في الفعاليات — بضغطة واحدة وبتحميل مباشر من كلاودفلير.
          </p>
        </div>
        <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-border shadow-xl shadow-primary/5">
          <Image
            src="/app-hero.png"
            alt="واجهة تطبيق منصة مامب على هاتف أندرويد — الدليل والمساعد الجمعوي والفعاليات"
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
          <h2 className="text-xl font-extrabold">طريقة التنزيل والتثبيت</h2>
          {STEPS.map((s, i) => (
            <Card key={s.title} className="overflow-hidden">
              <CardContent className="flex items-start gap-4 p-5">
                <div className="relative shrink-0">
                  <span className="grid size-14 place-items-center rounded-2xl bg-primary/10">
                    <s.icon className="size-7 text-primary" />
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
          ))}

          {/* ملاحظة المتجر */}
          <div className="rounded-2xl border border-gold/40 bg-gold-soft/50 p-4 text-[13px] leading-7">
            <p className="font-extrabold">💡 ملاحظة مهمة حول رسالة أندرويد</p>
            <p className="mt-1 text-muted-foreground">
              ظهور عبارة «مصدر غير معروف» أو «لم يتم فحص هذا التطبيق» أمر طبيعي
              ومتوقع: التطبيق يُوزع مباشرة من الموقع الرسمي للمنصة وليس من متجر
              تطبيقات. بمجرد السماح للمصدر مرة واحدة، ستمر التثبيات القادمة
              بسلاسة كاملة.
            </p>
          </div>

          {/* دليل Play Protect بالصور */}
          <h2 className="pt-6 text-xl font-extrabold">
            تجاوز رسالة Play Protect — خطوة بخطوة بالصور
          </h2>
          <p className="-mt-2 text-sm leading-7 text-muted-foreground">
            تظهر هذه الرسالة على هواتف أندرويد الحديثة عند تثبيت أي تطبيق خارج
            متجر Play. اتبعوا الصور الثلاث التالية بالترتيب:
          </p>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {PLAY_PROTECT.map((p, i) => (
              <Card key={p.title} className="overflow-hidden">
                <div className="relative bg-muted/40">
                  <Image
                    src={p.img}
                    alt={`الخطوة ${i + 1} من تجاوز رسالة Play Protect: ${p.title}`}
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

          {/* مزايا التطبيق */}
          <Card>
            <CardContent className="p-5">
              <h3 className="mb-3 text-sm font-extrabold">مزايا التطبيق</h3>
              <div className="flex flex-wrap gap-1.5">
                {FEATURES.map((f) => (
                  <Badge key={f.text} variant="secondary" className="gap-1 text-[10px] font-bold">
                    <f.icon className="size-3 text-primary" />
                    {f.text}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* نسخة الويب الكاملة — ZIP من كلاودفلير */}
          <Card className="border-primary/20">
            <CardContent className="p-5">
              <h3 className="mb-2 flex items-center gap-2 text-sm font-extrabold">
                <FileArchive className="size-4 text-primary" />
                نسخة الويب الكاملة
              </h3>
              <p className="mb-4 text-[12.5px] leading-6 text-muted-foreground">
                آخر نسخة من موقع المنصة كاملة في ملف مضغوط واحد — رابط مباشر من
                كلاودفلير يتحدث تلقائياً مع كل نشر رسمي جديد.
              </p>
              <a
                href={SITE_ZIP_URL}
                download
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-3 text-[13px] font-extrabold text-secondary-foreground transition-all hover:bg-secondary/70 active:scale-[0.98]"
              >
                <Cloud className="size-4.5 text-primary" />
                تحميل الموقع — ZIP مباشر
              </a>
              <p dir="ltr" className="mt-2.5 break-all text-center text-[10px] leading-4 text-muted-foreground">
                mamp.pages.dev/mamp-site-latest.zip
              </p>
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
