import type { Metadata } from "next";
import Link from "next/link";
import {
  Scale, ScrollText, FileSignature, Landmark, ExternalLink, ShieldCheck,
  BookOpenCheck, Bot, ArrowLeft, Stamp, Newspaper, Building2, Coins,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { OFFICIAL_LINKS } from "@/lib/kb/data";

export const metadata: Metadata = {
  title: "المرجع القانوني للعمل الجمعوي",
  description:
    "القوانين والمساطر الرسمية المؤطرة للجمعيات بالمغرب: ظهير 1958، القانون 75.00، القانون 09.08 — مع الروابط الرسمية الموثقة.",
  alternates: { canonical: "/legal/" },
};

const LAWS = [
  {
    icon: ScrollText,
    title: "الظهير الشريف رقم 1.58.376",
    date: "15 نونبر 1958",
    desc: "المرجع التأسيسي لحق تأسيس الجمعيات بالمغرب كما تغير وتتمم. نظام تصريحي يضمن حرية التأسيس دون ترخيص مسبق.",
    ref: "الجريدة الرسمية عدد 2404 مكرر (27 نونبر 1958)",
  },
  {
    icon: Scale,
    title: "القانون رقم 75.00",
    date: "23 يوليوز 2002",
    desc: "صادر بتنفيذه الظهير الشريف رقم 1.02.206. وضّح مسطرة التصريح وتسليم الوصل، وقنّن علاقات الجمعيات بالإدارة.",
    ref: "الظهير الشريف رقم 1.02.206",
  },
  {
    icon: FileSignature,
    title: "القانون رقم 07.09",
    date: "تعديل الفصل 5",
    desc: "عدّل الفصل 5 من ظهير 1958 المنظم لمسطرة التصريح بالجمعية لدى السلطة الإدارية المحلية وتسليم الوصل.",
    ref: "المعدل للفصل 5 من ظهير 1958",
  },
  {
    icon: ShieldCheck,
    title: "القانون رقم 09.08",
    date: "18 فبراير 2009",
    desc: "حماية الأشخاص الذاتيين تجاه معالجة المعطيات ذات الطابع الشخصي. يلزم الجمعيات بالتصريح لدى CNDP عند معالجة معطيات الأعضاء.",
    ref: "الإشراف: اللجنة الوطنية CNDP",
  },
  {
    icon: BookOpenCheck,
    title: "دستور المملكة 2011",
    date: "الفصلان 12 و 29",
    desc: "يكرس الديمقراطية التشاركية ودور الجمعيات في إعداد القرارات، ويضمن حرية تأسيس الجمعيات والانخراط فيها.",
    ref: "البوابة الرسمية maroc.ma",
  },
  {
    icon: Coins,
    title: "المادة 10 — المدونة العامة للضرائب",
    date: "النظام الجبائي",
    desc: "تحدد شروط خصم الهبات والتبرعات النقدية والعينية الممنوحة للجهات المؤهلة من الوعاء الضريبي للمتبرعين.",
    ref: "المديرية العامة للضرائب",
  },
];

const STEPS = [
  { title: "الجمع العام التأسيسي", desc: "المصادقة على القانون الأساسي وانتخاب المكتب المسير.", icon: Users_icon },
  { title: "إعداد الملف", desc: "نسخ القانون الأساسي الموقعة، محضر التأسيس، لائحة الأعضاء ونسخ البطائق.", icon: FileSignature },
  { title: "إيداع التصريح", desc: "لدى السلطة الإدارية المحلية بمقر الجمعية، مباشرة أو بواسطة عون قضائي.", icon: Stamp },
  { title: "تسليم الوصل", desc: "وصل مؤقت مختوم ومؤرخ يسلم في الحال (الفصل 5 من ظهير 1958).", icon: Landmark },
  { title: "النشر بالجريدة الرسمية", desc: "طلب من الأمانة العامة للحكومة لاكتساب الشخصية المعنوية.", icon: Newspaper },
];

function Users_icon() {
  return <Building2 className="size-5" />;
}

const PORTALS = [
  { ...OFFICIAL_LINKS.maroc, desc: "البوابة الرسمية للمملكة والخدمات الرقمية العمومية." },
  { ...OFFICIAL_LINKS.sggAssociations, desc: "النصوص القانونية، النماذج الرسمية، مسطرة المنفعة العامة وجمع التبرعات." },
  { ...OFFICIAL_LINKS.interieur, desc: "الوزارة الوصية على الإدارة الترابية المتلقية للتصريحات." },
  { ...OFFICIAL_LINKS.tax, desc: "النظام الجبائي للجمعيات، الوصولات، والاستفسارات الضريبية." },
  { ...OFFICIAL_LINKS.ice, desc: "طلب المعرف الموحد للمقاولة (ICE) للجمعيات." },
  { ...OFFICIAL_LINKS.cnss, desc: "تصريح أجراء الجمعية والاشتراكات الاجتماعية." },
  { ...OFFICIAL_LINKS.cndp, desc: "التصريح بمعالجة المعطيات الشخصية (القانون 09.08)." },
  { ...OFFICIAL_LINKS.asd, desc: "بوابة الدعم الاجتماعي المباشر." },
  { ...OFFICIAL_LINKS.mcrpsc, desc: "النصوص المؤطرة للحياة الجمعوية وبرامج الدعم القطاعية." },
];

export default function LegalPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* الرأس */}
      <div className="mb-12 text-center">
        <Badge variant="outline" className="mb-4 gap-1.5 border-primary/30 px-3 py-1 text-[12px] font-bold text-primary">
          <Scale className="size-3.5" />
          مرجع موثق ومحدث
        </Badge>
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
          المرجع القانوني <span className="text-primary">للعمل الجمعوي المغربي</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-muted-foreground">
          كل ما تحتاجونه لفهم الإطار القانوني للجمعيات: النصوص الأساسية، مسطرة التأسيس
          خطوة بخطوة، والبوابات الرسمية الموثقة — بروابط تم التحقق منها من مصادرها.
        </p>
      </div>

      {/* النصوص القانونية */}
      <h2 className="mb-6 text-2xl font-black">النصوص المؤطرة</h2>
      <div className="mb-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {LAWS.map((law) => (
          <Card key={law.title} className="h-full transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl">
            <CardContent className="flex h-full flex-col p-6">
              <div className="mb-4 flex items-start justify-between">
                <span className="inline-flex size-12 items-center justify-center rounded-xl bg-secondary text-primary">
                  <law.icon className="size-6" />
                </span>
                <Badge variant="secondary" className="text-[11px]">{law.date}</Badge>
              </div>
              <h3 className="mb-2 text-lg font-extrabold leading-snug">{law.title}</h3>
              <p className="mb-4 flex-1 text-[13px] leading-7 text-muted-foreground">{law.desc}</p>
              <p className="border-t border-border pt-3 text-[11px] font-bold text-muted-foreground">{law.ref}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* مسطرة التأسيس */}
      <h2 className="mb-2 text-2xl font-black">مسطرة تأسيس جمعية — خطوة بخطوة</h2>
      <p className="mb-8 max-w-2xl text-sm leading-7 text-muted-foreground">
        وفق نظام التصريحي المكرس بظهير 15 نونبر 1958 كما غيّره القانون 75.00 والقانون 07.09.
      </p>
      <div className="mb-16 grid gap-4 md:grid-cols-5">
        {STEPS.map((s, i) => (
          <Card key={s.title} className="relative">
            <CardContent className="p-5">
              <span className="num absolute -top-3 start-4 grid size-7 place-items-center rounded-lg bg-primary text-[12px] font-black text-primary-foreground shadow-md">
                {i + 1}
              </span>
              <s.icon />
              <h3 className="mb-2 mt-2 text-[15px] font-extrabold leading-snug">{s.title}</h3>
              <p className="text-[12px] leading-6 text-muted-foreground">{s.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* البوابات الرسمية */}
      <h2 className="mb-2 text-2xl font-black">البوابات الرسمية الموثقة</h2>
      <p className="mb-8 max-w-2xl text-sm leading-7 text-muted-foreground">
        حصرياً روابط رسمية تم التحقق منها — نفس اللائحة التي يستعملها المساعد الجمعوي،
        فلا يقدم للمستخدمين أي رابط خارجها.
      </p>
      <div className="mb-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PORTALS.map((p) => (
          <a key={p.url} href={p.url} target="_blank" rel="noopener noreferrer" className="group">
            <Card className="h-full transition-all duration-300 group-hover:-translate-y-1 group-hover:border-primary/30 group-hover:shadow-xl">
              <CardContent className="flex h-full flex-col p-5">
                <div className="mb-3 flex items-center justify-between">
                  <span className="inline-flex size-10 items-center justify-center rounded-lg bg-secondary text-primary">
                    <Landmark className="size-5" />
                  </span>
                  <ExternalLink className="size-4 text-muted-foreground transition-colors group-hover:text-primary" />
                </div>
                <h3 className="mb-1.5 text-[15px] font-extrabold leading-snug group-hover:text-primary transition-colors">{p.label}</h3>
                <p className="mb-3 flex-1 text-[12px] leading-6 text-muted-foreground">{p.desc}</p>
                <p className="num text-[11px] font-bold text-primary" dir="ltr">{p.url}</p>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>

      {/* نماذج SGG */}
      <Card className="mb-12 overflow-hidden">
        <div className="gradient-dark zellige-pattern flex flex-wrap items-center justify-between gap-6 p-8 text-white">
          <div className="max-w-xl">
            <h2 className="mb-2 flex items-center gap-2 text-xl font-extrabold">
              <FileSignature className="size-5 text-gold" />
              النماذج الرسمية الجاهزة
            </h2>
            <p className="text-sm leading-7 text-white/75">
              نموذج التصريح بتأسيس جمعية، المقتضيات الواجب إدراجها في الأنظمة الأساسية،
              طلب صفة المنفعة العامة، التصريح بالمساعدات الأجنبية، وطلب ترخيص جمع التبرعات —
              كلها متوفرة رسمياً عبر صفحة الجمعيات بالأمانة العامة للحكومة.
            </p>
          </div>
          <Button asChild size="lg" className="h-12 gap-2 bg-gold px-6 font-extrabold text-[#061229] hover:bg-gold/90">
            <a href={OFFICIAL_LINKS.sggAssociations.url} target="_blank" rel="noopener noreferrer">
              الوصول إلى النماذج
              <ExternalLink className="size-4" />
            </a>
          </Button>
        </div>
      </Card>

      {/* المساعد */}
      <div className="rounded-2xl border border-dashed border-primary/30 bg-secondary/40 p-8 text-center">
        <Bot className="mx-auto mb-3 size-10 text-primary" />
        <h2 className="mb-2 text-xl font-extrabold">عندكم سؤال قانوني؟</h2>
        <p className="mx-auto mb-6 max-w-md text-sm leading-7 text-muted-foreground">
          اسألوا «المساعد الجمعوي» — يجيب من قاعدة المعارف الرسمية أعلاه،
          بدون هلوسة وبدون اختراع روابط.
        </p>
        <Button asChild size="lg" className="gap-2 font-extrabold">
          <Link href="/assistant">
            تحدثوا مع المساعد
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
      </div>

      {/* إخلاء المسؤولية */}
      <p className="mt-10 rounded-xl border border-border bg-muted/50 p-4 text-center text-[12px] leading-6 text-muted-foreground">
        تنبيه: المعلومات القانونية في هذه الصفة إرشادية وملخصة؛ المرجع المعتمد يبقى النص الرسمي
        للظهائر والقوانين كما نُشر بالجريدة الرسمية، وللاستشارات الدقيقة يرجى الرجوع للمختصين
        والإدارات المعنية.
      </p>
    </div>
  );
}
