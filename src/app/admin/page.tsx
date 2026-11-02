"use client";

/**
 * لوحة إدارة المنصة — طاقم الإدارة (سوبر أدمين/أدمين/كوأدمين/محاسب)
 * • إحصائيات شاملة عن جميع الجمعيات المسجلة
 * • مراجعة الوثائق الرسمية للجمعيات قبل توثيقها (السوبر أدمين والأدمين)
 * • إدارة مستخدمي المنصة: إنشاء أدمين/كوأدمين/محاسب وتفويض الصلاحيات
 *   وتنشيط/تعطيل الحسابات وإعادة تعيين كلمات السر (سوبر أدمين حصراً)
 */
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Landmark, Users, Wallet, HandCoins, ShieldCheck,
  Building2, Loader2, AlertTriangle, ArrowLeft, BadgeCheck, Clock,
  MapPin, Database, Bot, Smartphone, Inbox, Lock, UserCog, UserPlus,
  KeyRound, FileText, Eye, Ban, CheckCircle2, XCircle, MoreHorizontal,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/site/logo";
import { useToast } from "@/hooks/use-toast";
import { fmtDate } from "@/lib/format";

const STAFF_ROLES = ["SUPER_ADMIN", "ASSOCIATION_ADMIN", "CO_ADMIN", "ACCOUNTANT"];

const ROLE_BADGES: Record<string, { label: string; cls: string }> = {
  SUPER_ADMIN: { label: "المدير العام", cls: "border-gold/50 bg-gold-soft text-yellow-800" },
  ASSOCIATION_ADMIN: { label: "أدمين", cls: "border-blue-200 bg-blue-50 text-blue-700" },
  CO_ADMIN: { label: "كوأدمين", cls: "border-slate-200 bg-slate-50 text-slate-700" },
  ACCOUNTANT: { label: "محاسب", cls: "border-emerald-200 bg-emerald-50 text-emerald-700" },
  PARTNER: { label: "جهة شريكة", cls: "border-purple-200 bg-purple-50 text-purple-700" },
  CITIZEN: { label: "مواطن", cls: "border-gray-200 bg-gray-50 text-gray-600" },
};

const ASSIGNABLE_ROLE_OPTIONS = [
  { value: "ASSOCIATION_ADMIN", label: "أدمين — يدير الجمعيات ويساعد في الإشراف" },
  { value: "CO_ADMIN", label: "كوأدمين — صلاحيات محدودة للمساعدة" },
  { value: "ACCOUNTANT", label: "محاسب — اطلاع مالي على الجمعيات" },
  { value: "PARTNER", label: "جهة شريكة — اطلاع موثق" },
  { value: "CITIZEN", label: "مواطن — حساب عادي" },
];

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

interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  role: string;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  _count?: { memberships: number };
}

interface AssocDocument {
  id: string;
  title: string;
  type: string;
  description: string | null;
  url: string;
  createdAt: string;
}

type Phase = "loading" | "denied" | "offline" | "ready";

export default function AdminPage() {
  const { toast } = useToast();
  const [phase, setPhase] = useState<Phase>("loading");
  const [myRole, setMyRole] = useState("");
  const [assocs, setAssocs] = useState<AdminAssociation[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [q, setQ] = useState("");
  const [uq, setUq] = useState("");
  const [usersTab, setUsersTab] = useState<"associations" | "users">("associations");

  // نموذج إنشاء مستخدم منصة
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({ fullName: "", email: "", phone: "", password: "", role: "ASSOCIATION_ADMIN" });

  // إعادة تعيين كلمة السر
  const [resetTarget, setResetTarget] = useState<AdminUser | null>(null);
  const [resetPassword, setResetPassword] = useState("");

  // مراجعة الوثائق
  const [docsAssoc, setDocsAssoc] = useState<AdminAssociation | null>(null);
  const [docs, setDocs] = useState<AssocDocument[]>([]);
  const [docsLoading, setDocsLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const meRes = await fetch("/api/auth/me", { cache: "no-store" });
        if (!meRes.ok) throw new Error("offline");
        const me = await meRes.json();
        if (cancelled) return;
        const role = me?.user?.role ?? "";
        if (!STAFF_ROLES.includes(role)) {
          setPhase("denied");
          return;
        }
        setMyRole(role);
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

  // مستخدمو المنصة — سوبر أدمين حصراً
  const loadUsers = async () => {
    try {
      const res = await fetch("/api/admin/users", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      setUsers(data.users ?? []);
    } catch {
      /* تجاهل — تبقى اللائحة السابقة */
    }
  };

  useEffect(() => {
    if (myRole === "SUPER_ADMIN") loadUsers();
  }, [myRole]);

  const isSuper = myRole === "SUPER_ADMIN";
  const canModerate = myRole === "SUPER_ADMIN" || myRole === "ASSOCIATION_ADMIN";

  const stats = useMemo(() => {
    const active = assocs.filter((a) => a.status === "ACTIVE");
    return {
      total: assocs.length,
      active: active.length,
      pending: assocs.filter((a) => a.status === "PENDING").length,
      verified: assocs.filter((a) => a.isVerified).length,
      members: assocs.reduce((s, a) => s + (a._count?.memberships ?? 0), 0),
      donations: assocs.reduce((s, a) => s + (a._count?.donations ?? 0), 0),
      events: assocs.reduce((s, a) => s + (a._count?.events ?? 0), 0),
      views: assocs.reduce((s, a) => s + (a.viewCount ?? 0), 0),
      staff: users.filter((u) => STAFF_ROLES.includes(u.role)).length,
    };
  }, [assocs, users]);

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

  const filteredUsers = useMemo(() => {
    const t = uq.trim();
    if (!t) return users;
    return users.filter(
      (u) => u.fullName.includes(t) || u.email.toLowerCase().includes(t.toLowerCase())
    );
  }, [users, uq]);

  // ---------- إجراءات الإشراف على الجمعيات ----------
  async function moderate(id: string, action: "verify" | "suspend" | "activate") {
    try {
      const res = await fetch("/api/associations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAssocs((list) =>
        list.map((a) =>
          a.id === id
            ? { ...a, status: data.association.status, isVerified: data.association.isVerified }
            : a
        )
      );
      toast({
        title:
          action === "verify" ? "تم توثيق الجمعية" : action === "activate" ? "تم تنشيط الجمعية" : "تم تعليق الجمعية",
      });
    } catch (e) {
      toast({ title: "تعذر الإجراء", description: e instanceof Error ? e.message : "", variant: "destructive" });
    }
  }

  // ---------- مراجعة الوثائق ----------
  async function openDocs(a: AdminAssociation) {
    setDocsAssoc(a);
    setDocs([]);
    setDocsLoading(true);
    try {
      const res = await fetch(`/api/associations/documents?id=${a.id}`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setDocs(data.documents ?? []);
    } catch (e) {
      toast({ title: "تعذر تحميل الوثائق", description: e instanceof Error ? e.message : "", variant: "destructive" });
      setDocsAssoc(null);
    } finally {
      setDocsLoading(false);
    }
  }

  // ---------- إنشاء مستخدم منصة ----------
  async function createUser() {
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast({
        title: "أُنشئ المستخدم",
        description: `${data.user.fullName} — ${ROLE_BADGES[data.user.role]?.label ?? data.user.role}`,
      });
      setCreateOpen(false);
      setCreateForm({ fullName: "", email: "", phone: "", password: "", role: "ASSOCIATION_ADMIN" });
      loadUsers();
    } catch (e) {
      toast({ title: "تعذر الإنشاء", description: e instanceof Error ? e.message : "", variant: "destructive" });
    }
  }

  // ---------- تحديث مستخدم (دور/تنشيط/كلمة سر) ----------
  async function patchUser(payload: Record<string, unknown>, successTitle: string) {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setUsers((list) => list.map((u) => (u.id === data.user.id ? { ...u, ...data.user } : u)));
      toast({ title: successTitle });
    } catch (e) {
      toast({ title: "تعذر التحديث", description: e instanceof Error ? e.message : "", variant: "destructive" });
    }
  }

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
              <p className="text-[11px] text-white/60">الجمعيات والمستخدمون والصلاحيات — إدارة شاملة</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#38a6ff]/40 bg-[#38a6ff]/15 px-3 py-1.5 text-[11px] font-bold text-[#9fd0ff]">
              <ShieldCheck className="size-3.5" />
              {ROLE_BADGES[myRole]?.label ?? "طاقم الإدارة"}
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
              <h2 className="mb-2 text-lg font-black">صفحة مخصصة لطاقم إدارة المنصة</h2>
              <p className="mb-5 text-sm leading-7 text-muted-foreground">
                هذه اللوحة متاحة للحسابات الإدارية (المدير العام، الأدمين، الكوأدمين، المحاسب).
                إذا كنتم تملكون هذه الصلاحية فسجلوا الدخول بالحساب المختص.
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
                { icon: BadgeCheck, label: "موثقة", value: String(stats.verified), tint: "bg-gold-soft text-yellow-800" },
                { icon: Clock, label: "قيد الدراسة", value: String(stats.pending), tint: "bg-yellow-50 text-yellow-800" },
                { icon: Users, label: "عضوية مسجلة", value: String(stats.members), tint: "bg-secondary text-primary" },
                { icon: HandCoins, label: "تبرعات", value: String(stats.donations), tint: "bg-emerald-50 text-emerald-700" },
                { icon: UserCog, label: "طاقم المنصة", value: String(stats.staff), tint: "bg-blue-50 text-blue-700" },
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

            {/* تبويبات: الجمعيات / المستخدمون */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex w-full gap-1.5 rounded-xl border border-border bg-card p-1.5 sm:w-fit">
                <button
                  onClick={() => setUsersTab("associations")}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-[13px] font-extrabold transition-colors sm:flex-none ${
                    usersTab === "associations" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <Building2 className="size-4" />
                  الجمعيات ({filtered.length})
                </button>
                {isSuper && (
                  <button
                    onClick={() => setUsersTab("users")}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-[13px] font-extrabold transition-colors sm:flex-none ${
                      usersTab === "users" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <UserCog className="size-4" />
                    مستخدمو المنصة ({filteredUsers.length})
                  </button>
                )}
              </div>

              {usersTab === "associations" ? (
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="بحث بالاسم أو المدينة أو ICE…"
                  className="w-full max-w-xs rounded-xl border border-input bg-card px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                  aria-label="بحث في الجمعيات"
                />
              ) : (
                <div className="flex w-full max-w-xs gap-2">
                  <input
                    value={uq}
                    onChange={(e) => setUq(e.target.value)}
                    placeholder="بحث بالاسم أو البريد…"
                    className="w-full rounded-xl border border-input bg-card px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    aria-label="بحث في المستخدمين"
                  />
                  <Button className="shrink-0 gap-1.5 font-extrabold" onClick={() => setCreateOpen(true)}>
                    <UserPlus className="size-4" />
                    مستخدم جديد
                  </Button>
                </div>
              )}
            </div>

            {/* جدول الجمعيات */}
            {usersTab === "associations" && (
              <Card>
                <CardContent className="p-5">
                  <h2 className="mb-4 flex items-center gap-2 text-base font-extrabold">
                    <Inbox className="size-5 text-primary" />
                    جميع الجمعيات
                  </h2>

                  {filtered.length === 0 ? (
                    <p className="py-10 text-center text-sm text-muted-foreground">لا نتائج مطابقة للبحث</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table className="min-w-[860px]">
                        <TableHeader>
                          <TableRow className="text-[11px] font-bold text-muted-foreground">
                            <TableHead className="p-2.5">الجمعية</TableHead>
                            <TableHead className="p-2.5">المدينة</TableHead>
                            <TableHead className="p-2.5 text-center">الأعضاء</TableHead>
                            <TableHead className="p-2.5 text-center">التبرعات</TableHead>
                            <TableHead className="p-2.5 text-center">الحالة</TableHead>
                            <TableHead className="p-2.5 text-center">الوثائق</TableHead>
                            <TableHead className="p-2.5 text-center">التسجيل</TableHead>
                            <TableHead className="p-2.5 w-12"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filtered.map((a) => (
                            <TableRow key={a.id} className="transition-colors hover:bg-muted/50">
                              <TableCell className="p-2.5">
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
                              </TableCell>
                              <TableCell className="p-2.5 text-muted-foreground">
                                {a.city ? (
                                  <span className="inline-flex items-center gap-1">
                                    <MapPin className="size-3.5" />
                                    {a.city}
                                  </span>
                                ) : (
                                  "—"
                                )}
                              </TableCell>
                              <TableCell className="num p-2.5 text-center font-bold">{a._count?.memberships ?? 0}</TableCell>
                              <TableCell className="num p-2.5 text-center font-bold">{a._count?.donations ?? 0}</TableCell>
                              <TableCell className="p-2.5 text-center">
                                <div className="flex flex-wrap items-center justify-center gap-1">
                                  <Badge
                                    variant="secondary"
                                    className={
                                      a.status === "ACTIVE"
                                        ? "border-emerald-200 bg-emerald-50 text-[10px] text-emerald-700"
                                        : a.status === "PENDING"
                                          ? "border-yellow-200 bg-yellow-50 text-[10px] text-yellow-800"
                                          : "border-red-200 bg-red-50 text-[10px] text-red-700"
                                    }
                                  >
                                    {a.status === "ACTIVE" ? "نشطة" : a.status === "PENDING" ? "قيد الدراسة" : "معلقة"}
                                  </Badge>
                                  {a.isVerified && (
                                    <Badge className="gap-1 border-gold/40 bg-gold-soft text-[10px] text-yellow-800">
                                      <BadgeCheck className="size-3" />
                                      موثقة
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="p-2.5 text-center">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 gap-1 text-[11px] font-bold"
                                  onClick={() => openDocs(a)}
                                >
                                  <Eye className="size-3.5" />
                                  مراجعة
                                </Button>
                              </TableCell>
                              <TableCell className="num p-2.5 text-center text-[12px] text-muted-foreground">
                                <span className="inline-flex items-center gap-1">
                                  <Clock className="size-3.5" />
                                  {new Date(a.createdAt).toLocaleDateString("ar-MA")}
                                </span>
                              </TableCell>
                              <TableCell className="p-2.5">
                                {canModerate && (
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon" className="size-8" aria-label="إجراءات الإشراف">
                                        <MoreHorizontal className="size-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      {!a.isVerified && (
                                        <DropdownMenuItem
                                          onClick={() => moderate(a.id, "verify")}
                                          className="gap-2 font-bold"
                                        >
                                          <CheckCircle2 className="size-4 text-emerald-600" />
                                          توثيق وتنشيط
                                        </DropdownMenuItem>
                                      )}
                                      {a.status !== "ACTIVE" && (
                                        <DropdownMenuItem
                                          onClick={() => moderate(a.id, "activate")}
                                          className="gap-2 font-bold"
                                        >
                                          <BadgeCheck className="size-4" /> تنشيط فقط
                                        </DropdownMenuItem>
                                      )}
                                      {a.status === "ACTIVE" && (
                                        <DropdownMenuItem
                                          onClick={() => moderate(a.id, "suspend")}
                                          className="gap-2 font-bold text-destructive focus:text-destructive"
                                        >
                                          <Ban className="size-4" /> تعليق
                                        </DropdownMenuItem>
                                      )}
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* جدول مستخدمي المنصة — سوبر أدمين */}
            {usersTab === "users" && isSuper && (
              <Card>
                <CardContent className="p-5">
                  <h2 className="mb-1 flex items-center gap-2 text-base font-extrabold">
                    <UserCog className="size-5 text-primary" />
                    مستخدمو المنصة والصلاحيات
                  </h2>
                  <p className="mb-4 text-[12px] leading-6 text-muted-foreground">
                    أنشئوا أدميناً وكوأدميناً ومحاسباً للمساعدة على إدارة المنصة، وفعّضوا الصلاحيات
                    (تغيير الدور)، ونشّطوا/عطّلوا الحسابات وأعيدوا تعيين كلمات السر.
                  </p>

                  {filteredUsers.length === 0 ? (
                    <p className="py-10 text-center text-sm text-muted-foreground">لا نتائج مطابقة للبحث</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table className="min-w-[780px]">
                        <TableHeader>
                          <TableRow className="text-[11px] font-bold text-muted-foreground">
                            <TableHead className="p-2.5">المستخدم</TableHead>
                            <TableHead className="p-2.5">الدور</TableHead>
                            <TableHead className="p-2.5 text-center">عضويات</TableHead>
                            <TableHead className="p-2.5 text-center">آخر دخول</TableHead>
                            <TableHead className="p-2.5 text-center">الحالة</TableHead>
                            <TableHead className="p-2.5 text-center">التسجيل</TableHead>
                            <TableHead className="p-2.5 w-12"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredUsers.map((u) => (
                            <TableRow key={u.id} className="transition-colors hover:bg-muted/50">
                              <TableCell className="p-2.5">
                                <p className="font-extrabold">{u.fullName}</p>
                                <p className="text-[11px] text-muted-foreground" dir="ltr">{u.email}</p>
                              </TableCell>
                              <TableCell className="p-2.5">
                                <Badge variant="outline" className={`text-[10px] ${ROLE_BADGES[u.role]?.cls ?? ""}`}>
                                  {ROLE_BADGES[u.role]?.label ?? u.role}
                                </Badge>
                              </TableCell>
                              <TableCell className="num p-2.5 text-center font-bold">{u._count?.memberships ?? 0}</TableCell>
                              <TableCell className="p-2.5 text-center text-[11.5px] text-muted-foreground">
                                {u.lastLoginAt ? fmtDate(u.lastLoginAt) : "—"}
                              </TableCell>
                              <TableCell className="p-2.5 text-center">
                                {u.isActive ? (
                                  <Badge variant="outline" className="gap-1 border-emerald-200 bg-emerald-50 text-[10px] text-emerald-700">
                                    <CheckCircle2 className="size-3" /> نشط
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="gap-1 border-red-200 bg-red-50 text-[10px] text-red-700">
                                    <XCircle className="size-3" /> معطل
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell className="num p-2.5 text-center text-[11.5px] text-muted-foreground">
                                {fmtDate(u.createdAt)}
                              </TableCell>
                              <TableCell className="p-2.5">
                                {u.role !== "SUPER_ADMIN" && (
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon" className="size-8" aria-label="إجراءات المستخدم">
                                        <MoreHorizontal className="size-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <div className="px-2 py-1.5 text-[11px] font-bold text-muted-foreground">
                                        تفويض الدور:
                                      </div>
                                      {ASSIGNABLE_ROLE_OPTIONS.filter((r) => r.value !== u.role).map((r) => (
                                        <DropdownMenuItem
                                          key={r.value}
                                          onClick={() => patchUser({ id: u.id, role: r.value }, `صار الدور: ${r.label.split(" —")[0]}`)}
                                          className="gap-2 text-[12px] font-bold"
                                        >
                                          <UserCog className="size-3.5" />
                                          {r.label}
                                        </DropdownMenuItem>
                                      ))}
                                      <DropdownMenuItem
                                        onClick={() => {
                                          setResetTarget(u);
                                          setResetPassword("");
                                        }}
                                        className="gap-2 font-bold"
                                      >
                                        <KeyRound className="size-4" />
                                        إعادة تعيين كلمة السر
                                      </DropdownMenuItem>
                                      {u.isActive ? (
                                        <DropdownMenuItem
                                          onClick={() => patchUser({ id: u.id, isActive: false }, "عُطل الحساب")}
                                          className="gap-2 font-bold text-destructive focus:text-destructive"
                                        >
                                          <Ban className="size-4" /> تعطيل الحساب
                                        </DropdownMenuItem>
                                      ) : (
                                        <DropdownMenuItem
                                          onClick={() => patchUser({ id: u.id, isActive: true }, "نُشّط الحساب")}
                                          className="gap-2 font-bold"
                                        >
                                          <CheckCircle2 className="size-4 text-emerald-600" /> تنشيط الحساب
                                        </DropdownMenuItem>
                                      )}
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <p className="flex items-center justify-center gap-1.5 pb-4 text-center text-[11px] text-muted-foreground">
              <AlertTriangle className="size-3.5" />
              بيانات هذه اللوحة للإدارة الداخلية فقط — لا تفهرسها محركات البحث.
            </p>
          </>
        )}
      </main>

      {/* نافذة إنشاء مستخدم منصة */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="size-5 text-primary" />
              إنشاء مستخدم منصة
            </DialogTitle>
            <DialogDescription>
              أنشئوا حساباً بدور محدد للمساعدة على إدارة المنصة — الأدمين يدير الجمعيات،
              والكوأدمين بصلاحيات محدودة، والمحاسب باطلاع مالي موثق.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="space-y-1.5">
              <Label>الاسم الكامل *</Label>
              <Input
                value={createForm.fullName}
                onChange={(e) => setCreateForm({ ...createForm, fullName: e.target.value })}
                placeholder="مثال: محمد العلمي"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>البريد الإلكتروني *</Label>
                <Input
                  dir="ltr"
                  className="text-start"
                  type="email"
                  value={createForm.email}
                  onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                  placeholder="name@mail.ma"
                />
              </div>
              <div className="space-y-1.5">
                <Label>الهاتف</Label>
                <Input
                  dir="ltr"
                  className="text-start"
                  value={createForm.phone}
                  onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
                  placeholder="+2126..."
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>كلمة السر المؤقتة *</Label>
              <Input
                dir="ltr"
                className="text-start"
                type="text"
                value={createForm.password}
                onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                placeholder="8 أحرف على الأقل — حروف وأرقام"
              />
              <p className="text-[11px] text-muted-foreground">
                يسلمها المالك للمستخدم شخصياً — يغيّرها المستخدم من إعدادات لوحة التحكم.
              </p>
            </div>
            <div className="space-y-1.5">
              <Label>الدور (الصلاحية) *</Label>
              <Select
                value={createForm.role}
                onValueChange={(v) => setCreateForm({ ...createForm, role: v })}
                dir="rtl"
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ASSIGNABLE_ROLE_OPTIONS.map((r) => (
                    <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={createUser} className="font-extrabold">
              <UserPlus className="me-2 size-4" />
              إنشاء المستخدم
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* نافذة إعادة تعيين كلمة السر */}
      <Dialog open={!!resetTarget} onOpenChange={(o) => !o && setResetTarget(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyRound className="size-5 text-primary" />
              إعادة تعيين كلمة السر
            </DialogTitle>
            <DialogDescription>
              الحساب: {resetTarget?.fullName} — {resetTarget?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5">
            <Label>كلمة السر الجديدة *</Label>
            <Input
              dir="ltr"
              className="text-start"
              type="text"
              value={resetPassword}
              onChange={(e) => setResetPassword(e.target.value)}
              placeholder="8 أحرف على الأقل — حروف وأرقام"
            />
            <p className="text-[11px] leading-5 text-muted-foreground">
              يتطلب التأكيد كلمة سركم الحالية — تُطلب عند التنفيذ (حماية إضافية).
            </p>
          </div>
          <DialogFooter>
            <Button
              onClick={async () => {
                const currentPassword = prompt("أكدوا كلمة سركم الحالية (المالك):");
                if (!currentPassword) return;
                await patchUser(
                  { id: resetTarget?.id, newPassword: resetPassword, currentPassword },
                  "أعيد تعيين كلمة السر"
                );
                setResetTarget(null);
              }}
              disabled={resetPassword.length < 8}
              className="font-extrabold"
            >
              <KeyRound className="me-2 size-4" />
              تأكيد التعيين
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* نافذة مراجعة الوثائق الرسمية */}
      <Dialog open={!!docsAssoc} onOpenChange={(o) => !o && setDocsAssoc(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="size-5 text-primary" />
              الوثائق الرسمية — {docsAssoc?.name}
            </DialogTitle>
            <DialogDescription>
              الوثائق المرفقة عند تسجيل الجمعية — راجعوها قبل التوثيق (وفق ظهير 1958 كما غُيّر بالقانون 75.00).
            </DialogDescription>
          </DialogHeader>
          {docsLoading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="size-7 animate-spin text-primary" />
            </div>
          ) : docs.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              لا وثائق مرفقة لهذه الجمعية
            </p>
          ) : (
            <div className="space-y-5">
              {docs.map((doc) => (
                <div key={doc.id} className="space-y-2 rounded-xl border border-border bg-muted/30 p-3.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-[13.5px] font-extrabold">{doc.title}</p>
                    <Badge variant="secondary" className="text-[10px]">
                      {new Date(doc.createdAt).toLocaleDateString("ar-MA")}
                    </Badge>
                  </div>
                  {doc.description && (
                    <p className="text-[11.5px] text-muted-foreground">{doc.description}</p>
                  )}
                  {/* eslint-disable-next-line @next/next/no-img-element -- وثيقة data URL خاصة بالإدارة */}
                  <img
                    src={doc.url}
                    alt={doc.title}
                    className="max-h-[420px] w-full rounded-lg border border-border bg-background object-contain"
                  />
                </div>
              ))}
            </div>
          )}
          {canModerate && docsAssoc && !docsAssoc.isVerified && (
            <DialogFooter>
              <Button
                onClick={async () => {
                  await moderate(docsAssoc.id, "verify");
                  setDocsAssoc(null);
                }}
                className="gap-2 bg-emerald-600 font-extrabold text-white hover:bg-emerald-700"
              >
                <CheckCircle2 className="size-4" />
                توثيق الجمعية بعد المراجعة
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
