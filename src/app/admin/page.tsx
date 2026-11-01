"use client";

/**
 * لوحة إدارة المنصة — سوبرأدمين
 * تعرض إحصائيات شاملة عن جميع الجمعيات المسجلة وتتيح الاطلاع على كل جمعية.
 * تعمل مع النسخة الكاملة (API) وتتدهور برشاقة في النسخة الثابتة العمومية.
 */
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Landmark, Users, Wallet, HandCoins, CalendarDays, ShieldCheck,
  Building2, Loader2, AlertTriangle, ArrowLeft, BadgeCheck, Clock,
  MapPin, Database, Bot, Smartphone, Inbox, Lock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/site/logo";
import { fmtMAD } from "@/lib/format";

interface AdminAssociation {
  id: string;
  slug: string;
  name: string;
  acronym: string | null;
  city: string | null;
  region: string | null;
  status: string;
  isVerified: boolean;
  createdAt: string;
  viewCount: number;
  iceNumber: string | null;
  _count?: { memberships: number; donations: number; events: number };
}

type Phase = "loading" | "denied" | "offline" | "ready";

export default function AdminPage() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [assocs, setAssocs] = useState<AdminAssociation[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const meRes = await fetch("/api/auth/me", { cache: "no-store" });
        if (!meRes.ok) throw new Error("offline");
        const me = await meRes.json();
        if (cancelled) return;
        if (me?.user?.role !== "SUPER_ADMIN") {
          setPhase("denied");
          return;
        }
        const res = await fetch("/api/associations?scope=mine", { cache: "no-store" });
        if (!res.ok) throw new Error("offline");
        const data = await res.json();
        if (cancelled) return;
        setAssocs(data.associations ?? []);
        setPhase("ready");
      } catch {
        if (!cancelled) setPhase("offline");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const stats = useMemo(() => {
    const active = assocs.filter((a) => a.status === "ACTIVE");
    return {
      total: assocs.length,
      active: active.length,
      verified: assocs.filter((a) => a.isVerified).length,
      members: assocs.reduce((s, a) => s + (a._count?.memberships ?? 0), 0),
      donations: assocs.reduce((s, a) => s + (a._count?.donations ?? 0), 0),
      events: assocs.reduce((s, a) => s + (a._count?.events ?? 0), 0),
      views: assocs.reduce((s, a) => s + (a.viewCount ?? 0), 0),
    };
  }, [assocs]);

  const filtered = useMemo(() => {
    const t = q.trim();
    if (!t) return assocs;
    return assocs.filter(
      (a) =>
        a.name.includes(t) ||
        (a.acronym ?? "").toLowerCase().includes(t.toLowerCase()) ||
        (a.city ?? "").includes(t) ||
        (a.iceNumber ?? "").includes(t)
    );
  }, [assocs, q]);

  return (
    <div className="min-h-screen bg-muted/40">
      {/* الرأس — كحلي بهوية المنصة */}
      <header className="gradient-dark zellige-pattern text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <Logo light />
            <span className="hidden h-8 w-px bg-white/15 sm:block" />
            <div className="hidden sm:block">
              <h1 className="flex items-center gap-2 text-lg font-black leading-tight">
                <Landmark className="size-5 text-[#8fc7ff]" />
                لوحة إدارة المنصة
              </h1>
              <p className="text-[11px] text-white/60">إحصائيات وتسيير جميع الجمعيات المسجلة</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#38a6ff]/40 bg-[#38a6ff]/15 px-3 py-1.5 text-[11px] font-bold text-[#9fd0ff]">
              <ShieldCheck className="size-3.5" />
              صلاحية مدير المنصة
            </span>
            <ThemeToggle className="border-white/20 bg-white/10 text-white hover:border-white/40 hover:text-white" />
            <Button
              asChild
              size="sm"
              variant="outline"
              className="gap-2 border-white/25 bg-white/10 font-bold text-white hover:bg-white/20 hover:text-white"
            >
              <Link href="/dashboard">
                <ArrowLeft className="size-4" />
                لوحة التحكم
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 p-4 py-8 sm:px-6">
        {phase === "loading" && (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
        )}

        {phase === "denied" && (
          <Card className="mx-auto max-w-lg border-gold/40">
            <CardContent className="p-8 text-center">
              <span className="mx-auto mb-4 grid size-14 place-items-center rounded-2xl bg-gold-soft">
                <Lock className="size-7 text-gold" />
              </span>
              <h2 className="mb-2 text-lg font-black">صفحة مخصصة لمدير المنصة</h2>
              <p className="mb-5 text-sm leading-7 text-muted-foreground">
                هذه اللوحة متاحة فقط للحسابات بصلاحية مدير المنصة (SUPER_ADMIN).
                إذا كنتم تملكون هذه الصلاحية فسجّلوا الدخول بالحساب المختص.
              </p>
              <Button asChild className="font-bold">
                <Link href="/login">تسجيل الدخول</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {phase === "offline" && (
          <Card className="mx-auto max-w-xl border-primary/30">
            <CardContent className="p-8 text-center">
              <span className="mx-auto mb-4 grid size-14 place-items-center rounded-2xl bg-secondary">
                <Database className="size-7 text-primary" />
              </span>
              <h2 className="mb-2 text-lg font-black">النسخة العمومية الثابتة</h2>
              <p className="mb-5 text-sm leading-7 text-muted-foreground">
                لوحة إدارة المنصة تحتاج النسخة الكاملة من المنصة (خادم + قاعدة بيانات).
                النسخة المتصفحون عليها الآن هي النسخة العمومية الثابتة بدون وصول للبيانات الداخلية.
              </p>
              <div className="flex flex-wrap justify-center gap-2.5">
                <Button asChild className="font-bold">
                  <Link href="/dashboard">لوحة التحكم</Link>
                </Button>
                <Button asChild variant="outline" className="font-bold">
                  <Link href="/">الصفحة الرئيسية</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {phase === "ready" && (
          <>
            {/* بطاقات الإحصائيات */}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
              {[
                { icon: Building2, label: "جمعيات مسجلة", value: String(stats.total), tint: "bg-secondary text-primary" },
                { icon: BadgeCheck, label: "نشطة", value: String(stats.active), tint: "bg-emerald-50 text-emerald-700" },
                { icon: ShieldCheck, label: "موثقة", value: String(stats.verified), tint: "bg-gold-soft text-yellow-800" },
                { icon: Users, label: "عضوية مسجلة", value: String(stats.members), tint: "bg-secondary text-primary" },
                { icon: HandCoins, label: "تبرعات", value: String(stats.donations), tint: "bg-emerald-50 text-emerald-700" },
                { icon: CalendarDays, label: "فعاليات", value: String(stats.events), tint: "bg-secondary text-primary" },
              ].map((c) => (
                <Card key={c.label}>
                  <CardContent className="p-4">
                    <span className={`mb-3 inline-flex size-9 items-center justify-center rounded-lg ${c.tint}`}>
                      <c.icon className="size-4.5" />
                    </span>
                    <p className="text-[11px] font-bold text-muted-foreground">{c.label}</p>
                    <p className="num mt-0.5 text-lg font-black leading-tight">{c.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* شريط معلومات */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="md:col-span-2">
                <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
                  <div className="flex items-center gap-3">
                    <span className="grid size-11 place-items-center rounded-xl bg-secondary">
                      <Wallet className="size-5 text-primary" />
                    </span>
                    <div>
                      <p className="text-[12px] font-bold text-muted-foreground">مجموع مشاهدات الملف العمومي</p>
                      <p className="num text-2xl font-black">{stats.views.toLocaleString("ar-MA")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="grid size-11 place-items-center rounded-xl bg-emerald-50">
                      <Bot className="size-5 text-emerald-600" />
                    </span>
                    <div>
                      <p className="text-[12px] font-bold text-muted-foreground">المساعد الجمعوي</p>
                      <p className="text-sm font-extrabold">قاعدة معارف موثقة · بلا هلوسة</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center gap-3 p-5">
                  <span className="grid size-11 place-items-center rounded-xl bg-gold-soft">
                    <Smartphone className="size-5 text-gold" />
                  </span>
                  <div>
                    <p className="text-[12px] font-bold text-muted-foreground">تطبيق أندرويد</p>
                    <Link href="/app" className="text-sm font-extrabold text-primary underline underline-offset-4">
                      صفحة التحميل الرسمية
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* جدول الجمعيات */}
            <Card>
              <CardContent className="p-5">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <h2 className="flex items-center gap-2 text-base font-extrabold">
                    <Inbox className="size-5 text-primary" />
                    جميع الجمعيات ({filtered.length})
                  </h2>
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="بحث بالاسم أو المدينة أو ICE…"
                    className="w-full max-w-xs rounded-xl border border-input bg-background px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    aria-label="بحث في الجمعيات"
                  />
                </div>

                {filtered.length === 0 ? (
                  <p className="py-10 text-center text-sm text-muted-foreground">لا نتائج مطابقة للبحث</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px] text-sm">
                      <thead>
                        <tr className="border-b border-border text-[11px] font-bold text-muted-foreground">
                          <th className="p-2.5 text-start">الجمعية</th>
                          <th className="p-2.5 text-start">المدينة</th>
                          <th className="p-2.5 text-center">الأعضاء</th>
                          <th className="p-2.5 text-center">التبرعات</th>
                          <th className="p-2.5 text-center">الفعاليات</th>
                          <th className="p-2.5 text-center">الحالة</th>
                          <th className="p-2.5 text-center">التسجيل</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((a) => (
                          <tr key={a.id} className="border-b border-border/60 transition-colors hover:bg-muted/50">
                            <td className="p-2.5">
                              <Link
                                href={`/associations/${a.slug}`}
                                className="font-extrabold text-primary underline-offset-4 hover:underline"
                              >
                                {a.name}
                              </Link>
                              {a.acronym && (
                                <span className="ms-1.5 text-[11px] font-bold text-muted-foreground">
                                  ({a.acronym})
                                </span>
                              )}
                            </td>
                            <td className="p-2.5 text-muted-foreground">
                              {a.city ? (
                                <span className="inline-flex items-center gap-1">
                                  <MapPin className="size-3.5" />
                                  {a.city}
                                </span>
                              ) : (
                                "—"
                              )}
                            </td>
                            <td className="num p-2.5 text-center font-bold">{a._count?.memberships ?? 0}</td>
                            <td className="num p-2.5 text-center font-bold">{a._count?.donations ?? 0}</td>
                            <td className="num p-2.5 text-center font-bold">{a._count?.events ?? 0}</td>
                            <td className="p-2.5 text-center">
                              <div className="flex flex-wrap items-center justify-center gap-1">
                                <Badge
                                  variant="secondary"
                                  className={
                                    a.status === "ACTIVE"
                                      ? "border-emerald-200 bg-emerald-50 text-[10px] text-emerald-700"
                                      : "border-yellow-200 bg-yellow-50 text-[10px] text-yellow-800"
                                  }
                                >
                                  {a.status === "ACTIVE" ? "نشطة" : "قيد الدراسة"}
                                </Badge>
                                {a.isVerified && (
                                  <Badge className="gap-1 border-gold/40 bg-gold-soft text-[10px] text-yellow-800">
                                    <BadgeCheck className="size-3" />
                                    موثقة
                                  </Badge>
                                )}
                              </div>
                            </td>
                            <td className="num p-2.5 text-center text-[12px] text-muted-foreground">
                              <span className="inline-flex items-center gap-1">
                                <Clock className="size-3.5" />
                                {new Date(a.createdAt).toLocaleDateString("ar-MA")}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            <p className="flex items-center justify-center gap-1.5 pb-4 text-center text-[11px] text-muted-foreground">
              <AlertTriangle className="size-3.5" />
              بيانات هذه اللوحة للإدارة الداخلية فقط — لا تفهرسها محركات البحث.
            </p>
          </>
        )}
      </main>
    </div>
  );
}
