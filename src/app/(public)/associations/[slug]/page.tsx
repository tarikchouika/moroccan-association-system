import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin, CalendarDays, Users, HandCoins, BadgeCheck, ArrowLeft,
  Building2, ScrollText, Hash, HeartHandshake, ShieldCheck, Landmark,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DEMO_DATA } from "@/generated/demo-data";

export function generateStaticParams() {
  return DEMO_DATA.associations.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = DEMO_DATA.associations.find((x) => x.slug === slug);
  if (!a) return { title: "جمعية غير موجودة" };
  return { title: a.name, description: a.description.slice(0, 150) };
}

export default async function AssociationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = DEMO_DATA.associations.find((x) => x.slug === slug);
  if (!a) notFound();

  const events = DEMO_DATA.events
    .filter((e) => e.associationSlug === a.slug)
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* رأس الجمعية */}
      <div className="gradient-dark zellige-pattern mb-8 overflow-hidden rounded-3xl p-8 text-white sm:p-10">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex items-start gap-5">
            <span className="grid size-20 shrink-0 place-items-center rounded-2xl border border-white/15 bg-white/10 text-2xl font-black text-gold">
              {a.acronym?.slice(0, 2) || a.name.slice(0, 2)}
            </span>
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                {a.isVerified && (
                  <Badge className="gap-1 border-gold/40 bg-gold/20 text-[11px] font-bold text-gold">
                    <BadgeCheck className="size-3.5" /> جمعية موثقة
                  </Badge>
                )}
                {a.legalStatus === "PUBLIC_UTILITY" && (
                  <Badge variant="outline" className="border-white/25 bg-white/10 text-[11px] font-bold text-white">
                    <Landmark className="size-3.5" /> صفة المنفعة العامة
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl font-black sm:text-3xl">{a.name}</h1>
              <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/70">
                <span className="flex items-center gap-1"><MapPin className="size-4" />{a.city} — {a.region}</span>
                {a.foundedAt && (
                  <span className="flex items-center gap-1">
                    <CalendarDays className="size-4" />
                    مؤسسة سنة <span className="num">{new Date(a.foundedAt).getFullYear()}</span>
                  </span>
                )}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2.5">
            <Button asChild size="lg" className="h-12 gap-2 bg-gold px-6 font-extrabold text-[#10231b] hover:bg-gold/90">
              <Link href={`/associations/${a.slug}#donate`}>
                <HeartHandshake className="size-5" />
                تبرعوا للجمعية
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 gap-2 border-white/25 bg-transparent px-6 font-extrabold text-white hover:bg-white/10 hover:text-white">
              <Link href={`/associations/${a.slug}#join`}>
                <Users className="size-5" />
                طلب الانخراط
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* المحتوى الرئيسي */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardContent className="p-6 sm:p-8">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-extrabold">
                <ScrollText className="size-5 text-primary" />
                نبذة عن الجمعية
              </h2>
              <p className="text-[15px] leading-8 text-muted-foreground">{a.description}</p>
              {a.mission && (
                <div className="mt-6 rounded-xl border border-primary/15 bg-secondary/60 p-5">
                  <h3 className="mb-2 flex items-center gap-2 text-base font-extrabold text-primary">
                    <ShieldCheck className="size-4" />
                    الرسالة والأهداف
                  </h3>
                  <p className="text-sm leading-7 text-foreground/80">{a.mission}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* الفعاليات */}
          {events.length > 0 && (
            <Card>
              <CardContent className="p-6 sm:p-8">
                <h2 className="mb-5 flex items-center gap-2 text-xl font-extrabold">
                  <CalendarDays className="size-5 text-primary" />
                  الفعاليات القادمة
                </h2>
                <div className="space-y-3">
                  {events.map((e) => (
                    <div
                      key={e.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-background p-4 transition-colors hover:border-primary/30"
                    >
                      <div>
                        <p className="font-extrabold">{e.title}</p>
                        <p className="mt-1 text-[12px] text-muted-foreground">
                          {e.location} · {new Date(e.startDate).toLocaleDateString("ar-MA", { day: "numeric", month: "long", year: "numeric" })}
                        </p>
                      </div>
                      <Badge variant="secondary">{e.category}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* نداء الانخراط */}
          <Card id="join" className="scroll-mt-24">
            <CardContent className="flex flex-wrap items-center justify-between gap-4 p-6 sm:p-8">
              <div>
                <h2 className="mb-1.5 text-xl font-extrabold">انخرطوا في {a.acronym || a.name}</h2>
                <p className="text-sm leading-7 text-muted-foreground">
                  ساهموا في أنشطة الجمعية وأعضائها. الطلب يُوجه لمكتب الجمعية للمصادقة،
                  وتُعالج معطياتكم بموافقتكم الصريحة وفق القانون 09.08.
                </p>
              </div>
              <Button asChild size="lg" className="h-12 gap-2 px-6 font-extrabold">
                <Link href="/register">
                  طلب الانخراط
                  <ArrowLeft className="size-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* العمود الجانبي */}
        <div className="space-y-6">
          {/* بطاقة الهوية الرقمية */}
          <Card>
            <CardContent className="p-6">
              <h3 className="mb-4 flex items-center gap-2 text-base font-extrabold">
                <Hash className="size-4 text-primary" />
                بطاقة الهوية الرقمية
              </h3>
              <dl className="space-y-3 text-sm">
                {[
                  ["المجال", a.category],
                  ["المدينة", a.city],
                  ["الجهة", a.region],
                  ...(a.foundedAt ? [["سنة التأسيس", String(new Date(a.foundedAt).getFullYear())]] : []),
                  ...(a.iceNumber ? [["رقم ICE", a.iceNumber]] : []),
                  ["الحالة القانونية", a.legalStatus === "PUBLIC_UTILITY" ? "منفعة عامة" : "مُصرّح بها"],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between gap-3 border-b border-border/70 pb-2.5 last:border-0">
                    <dt className="text-muted-foreground font-bold">{k}</dt>
                    <dd className="font-extrabold">{v}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>

          {/* مؤشرات */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Users, label: "عضو نشط", value: String(a.memberCount) },
              { icon: HandCoins, label: "تبرع مسجل", value: String(a.donationCount) },
            ].map((s) => (
              <Card key={s.label}>
                <CardContent className="p-5 text-center">
                  <s.icon className="mx-auto mb-2 size-6 text-primary" />
                  <p className="num text-2xl font-black">{s.value}</p>
                  <p className="mt-1 text-[12px] font-bold text-muted-foreground">{s.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* بطاقة التبرع */}
          <Card id="donate" className="scroll-mt-24 overflow-hidden">
            <div className="gradient-dark zellige-pattern p-6 text-white">
              <HeartHandshake className="mb-3 size-8 text-gold" />
              <h3 className="text-lg font-extrabold">تبرعوا بثقة</h3>
              <p className="mt-2 text-[13px] leading-6 text-white/75">
                كل تبرع يُسجل بوصل رسمي مرقم. التبرعات النقدية والعينية موثقة،
                والمساعدات الأجنبية تُصرح بها وفق القانون.
              </p>
              <p className="mt-3 rounded-lg border border-white/15 bg-white/5 p-3 text-[11px] leading-5 text-white/60">
                ملاحظة: في النسخة الكاملة للمنصة يتم التبرع مباشرة من هذه البطاقة
                مع تسجيل فوري في محاسبة الجمعية.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
