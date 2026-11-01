"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Users, TrendingUp, TrendingDown, Wallet, HandCoins, CalendarDays,
  FileText, Loader2, AlertTriangle, MapPin,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  PieChart, Pie, Cell,
} from "recharts";
import { useDash } from "@/components/dashboard/dash-context";
import { fmtMAD, fmtDate } from "@/lib/format";

interface Stats {
  association: {
    members: number;
    pendingMembers: number;
    incomeTotal: number;
    expenseTotal: number;
    balance: number;
    donationsTotal: number;
    donationCount: number;
    events: number;
    docs: number;
    budget: { plannedIncome: number; plannedExpense: number; status: string } | null;
    monthly: Array<{ month: string; income: number; expense: number }>;
    expenseByCategory: Array<{ category: string; amount: number }>;
    upcomingEvents: Array<{ id: string; title: string; startDate: string; location: string | null; registrations: number; maxParticipants: number | null }>;
  };
}

export default function DashboardOverviewPage() {
  const { associationId, associations, isSuper } = useDash();

  const { data, isLoading, error } = useQuery<Stats>({
    queryKey: ["stats", associationId],
    queryFn: async () => {
      const res = await fetch(`/api/stats?associationId=${associationId}`);
      if (!res.ok) throw new Error((await res.json()).error ?? "خطأ");
      return res.json();
    },
    enabled: !!associationId,
  });

  // لا جمعيات بعد: دعوة للتسجيل
  if (!associationId) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <span className="mx-auto mb-5 grid size-16 place-items-center rounded-2xl bg-secondary">
          <Users className="size-8 text-primary" />
        </span>
        <h1 className="mb-2 text-2xl font-black">أهلاً بكم في لوحة التحكم</h1>
        <p className="mb-6 text-sm leading-7 text-muted-foreground">
          {isSuper
            ? "بصفتكم مدير المنصة، يمكنكم الوصول إلى لوحة إدارة المنصة للاطلاع على كل الجمعيات، أو تسجيل جمعية جديدة من الإعدادات."
            : "أنتم غير مرتبطين بجمعية حالياً. سجلوا جمعيتكم على المنصة أو انتظروا قبول انخراطكم من طرف المكتب."}
        </p>
        <div className="flex justify-center gap-3">
          <Button asChild className="font-bold">
            <a href="/dashboard/settings#new">تسجيل جمعية</a>
          </Button>
          {isSuper && (
            <Button asChild variant="outline" className="font-bold">
              <a href="/admin">لوحة إدارة المنصة</a>
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <Card className="border-destructive/30">
        <CardContent className="flex items-center gap-3 p-6 text-destructive">
          <AlertTriangle className="size-5" />
          تعذر تحميل المؤشرات: {(error as Error)?.message}
        </CardContent>
      </Card>
    );
  }

  const s = data.association;
  const year = new Date().getFullYear();
  const assoc = associations.find((a) => a.id === associationId);

  const cards = [
    { icon: Users, label: "منخرط نشط", value: String(s.members), sub: s.pendingMembers ? `${s.pendingMembers} طلب معلق` : "", tint: "bg-secondary text-primary" },
    { icon: TrendingUp, label: `مدخولات ${year}`, value: fmtMAD(s.incomeTotal), tint: "bg-emerald-50 text-emerald-700" },
    { icon: TrendingDown, label: `مصروفات ${year}`, value: fmtMAD(s.expenseTotal), tint: "bg-orange-50 text-terra" },
    { icon: Wallet, label: "رصيد الخزينة", value: fmtMAD(s.balance), tint: "bg-gold-soft text-yellow-800" },
    { icon: HandCoins, label: "تبرعات مسجلة", value: fmtMAD(s.donationsTotal), sub: `${s.donationCount} وصل`, tint: "bg-secondary text-primary" },
    { icon: CalendarDays, label: "فعاليات", value: String(s.events), sub: `${s.upcomingEvents.length} قادمة`, tint: "bg-secondary text-primary" },
  ];

  const pieColors = ["#0072d6", "#eda81d", "#00b368", "#c05a21", "#7e96b8", "#9db9d8"];

  return (
    <div className="space-y-6">
      {/* العنوان */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black">نظرة عامة — {year}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{assoc?.name} · مؤشرات السنة المالية الجارية</p>
        </div>
        {s.budget && (
          <Badge variant="outline" className="border-primary/30 bg-secondary px-3 py-1.5 text-[12px] font-bold text-primary">
            الميزانية المعتمدة: {fmtMAD(s.budget.plannedIncome)}
          </Badge>
        )}
      </div>

      {/* البطاقات */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardContent className="p-4">
              <span className={`mb-3 inline-flex size-9 items-center justify-center rounded-lg ${c.tint}`}>
                <c.icon className="size-4.5" />
              </span>
              <p className="text-[11px] font-bold text-muted-foreground">{c.label}</p>
              <p className="num mt-0.5 text-lg font-black leading-tight">{c.value}</p>
              {c.sub && <p className="mt-1 text-[10px] font-bold text-muted-foreground">{c.sub}</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* الرسوم */}
      <div className="grid gap-5 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardContent className="p-5">
            <h3 className="mb-1 text-base font-extrabold">التدفق المالي الشهري</h3>
            <p className="mb-4 text-[12px] text-muted-foreground">مقارنة المدخولات بالمصروفات (درهم)</p>
            <div className="h-72" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={s.monthly} margin={{ top: 5, right: 5, left: 5, bottom: 0 }}>
                  <XAxis dataKey="month" tick={{ fontSize: 10, fontFamily: "Cairo" }} interval={0} angle={-35} textAnchor="end" height={50} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${v / 1000}k`} />
                  <Tooltip
                    formatter={(v: number, name: string) => [fmtMAD(v), name === "income" ? "مدخول" : "مصروف"]}
                    labelStyle={{ fontFamily: "Cairo", direction: "rtl" }}
                    contentStyle={{ fontFamily: "Cairo", direction: "rtl", borderRadius: 12, border: "1px solid #dce6f4" }}
                  />
                  <Legend formatter={(v) => (v === "income" ? "مدخول" : "مصروف")} wrapperStyle={{ fontFamily: "Cairo" }} />
                  <Bar dataKey="income" fill="#0072d6" radius={[4, 4, 0, 0]} name="income" />
                  <Bar dataKey="expense" fill="#eda81d" radius={[4, 4, 0, 0]} name="expense" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardContent className="p-5">
            <h3 className="mb-1 text-base font-extrabold">توزيع المصروفات</h3>
            <p className="mb-4 text-[12px] text-muted-foreground">حسب الفئات المحاسبية</p>
            {s.expenseByCategory.length === 0 ? (
              <div className="flex h-72 items-center justify-center text-sm text-muted-foreground">لا مصروفات مسجلة بعد</div>
            ) : (
              <div className="h-72" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={s.expenseByCategory}
                      dataKey="amount"
                      nameKey="category"
                      innerRadius={55}
                      outerRadius={90}
                      paddingAngle={3}
                    >
                      {s.expenseByCategory.map((_, i) => (
                        <Cell key={i} fill={pieColors[i % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v: number, n: string) => [fmtMAD(v), n]}
                      contentStyle={{ fontFamily: "Cairo", direction: "rtl", borderRadius: 12, border: "1px solid #dce6f4" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* الفعاليات القادمة */}
      <Card>
        <CardContent className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-extrabold">الفعاليات القادمة</h3>
            <Button asChild variant="outline" size="sm" className="font-bold">
              <a href="/dashboard/events">كل الفعاليات</a>
            </Button>
          </div>
          {s.upcomingEvents.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">لا فعاليات مبرمجة حالياً</p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {s.upcomingEvents.map((e) => (
                <div key={e.id} className="rounded-xl border border-border bg-background p-4">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <p className="font-extrabold leading-snug">{e.title}</p>
                    <Badge variant="secondary" className="shrink-0 text-[10px]">
                      {e.registrations}/{e.maxParticipants ?? "∞"}
                    </Badge>
                  </div>
                  <p className="text-[12px] text-muted-foreground">
                    <CalendarDays className="me-1 inline size-3.5" />
                    {fmtDate(e.startDate)}
                    {e.location && (
                      <>
                        <br />
                        <MapPin className="me-1 inline size-3.5" />
                        {e.location}
                      </>
                    )}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
