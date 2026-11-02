"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Users, Search, UserPlus, Loader2, Trash2, MoreHorizontal, BadgeCheck,
  ShieldCheck, Receipt, HandCoins, Inbox, UserCheck, UserX, Crown, KeyRound,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
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
import { useToast } from "@/hooks/use-toast";
import { useDash } from "@/components/dashboard/dash-context";
import { fmtDate, fmtMAD } from "@/lib/format";

interface Member {
  id: string;
  membershipNumber: string;
  roleInAssociation: string;
  memberType: string;
  status: string;
  joinedAt: string;
  profession: string | null;
  cndpConsent: boolean;
  notes: string | null;
  user: { id: string; fullName: string; email: string; phone: string | null };
  feePayments: Array<{ year: number; paidAt: string; amount: number; receiptNumber: string }>;
}

interface Permissions {
  canApprove: boolean;
  isPresident: boolean;
  approvalsDelegatedTo: string | null;
}

const ROLE_LABELS: Record<string, string> = {
  PRESIDENT: "الرئيس/ة", VICE_PRESIDENT: "نائب/ة الرئيس", SECRETARY: "الكاتب/ة العام",
  TREASURER: "أمين/ة المال", BOARD_MEMBER: "عضو مجلس", CO_ADMIN: "كوأدمين",
  MEMBER: "منخرط/ة", VOLUNTEER: "متطوع/ة",
};

const DELEGATABLE_ROLES = ["VICE_PRESIDENT", "SECRETARY", "TREASURER", "BOARD_MEMBER", "CO_ADMIN"];

const STATUS_BADGES: Record<string, { label: string; cls: string }> = {
  ACTIVE: { label: "نشط", cls: "border-emerald-200 bg-emerald-50 text-emerald-700" },
  PENDING: { label: "قيد الانتظار", cls: "border-yellow-200 bg-yellow-50 text-yellow-800" },
  SUSPENDED: { label: "معلق", cls: "border-red-200 bg-red-50 text-red-700" },
  RESIGNED: { label: "منسحب", cls: "border-gray-200 bg-gray-50 text-gray-600" },
};

export default function MembersPage() {
  const { associationId, canManage } = useDash();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    fullName: "", email: "", phone: "", profession: "",
    roleInAssociation: "MEMBER", memberType: "ACTIVE", initialFee: "0", cndpConsent: false,
  });

  const { data, isLoading } = useQuery<{ members: Member[]; permissions: Permissions }>({
    queryKey: ["members", associationId, status],
    queryFn: async () => {
      const res = await fetch(`/api/members?associationId=${associationId}&status=${status}`);
      if (!res.ok) throw new Error((await res.json()).error ?? "خطأ");
      return res.json();
    },
    enabled: !!associationId,
  });

  const members = data?.members ?? [];
  const perms = data?.permissions ?? { canApprove: false, isPresident: false, approvalsDelegatedTo: null };
  const pendingMembers = members.filter((m) => m.status === "PENDING");
  const delegatable = members.filter(
    (m) => m.status === "ACTIVE" && DELEGATABLE_ROLES.includes(m.roleInAssociation)
  );
  const delegatedToName =
    members.find((m) => m.user.id === perms.approvalsDelegatedTo)?.user.fullName ?? null;

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["members", associationId] });
    qc.invalidateQueries({ queryKey: ["stats", associationId] });
  };

  const addMember = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/members?associationId=${associationId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, initialFee: Number(form.initialFee) || 0 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      toast({ title: "تمت الإضافة", description: "سُجل المنخرط الجديد بنجاح" });
      setOpen(false);
      setForm({ fullName: "", email: "", phone: "", profession: "", roleInAssociation: "MEMBER", memberType: "ACTIVE", initialFee: "0", cndpConsent: false });
      invalidate();
    },
    onError: (e: Error) => toast({ title: "تعذرت الإضافة", description: e.message, variant: "destructive" }),
  });

  const updateMember = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const res = await fetch(`/api/members?associationId=${associationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, id: payload.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      toast({ title: "تم التحديث" });
      invalidate();
    },
    onError: (e: Error) => toast({ title: "تعذر التحديث", description: e.message, variant: "destructive" }),
  });

  const deleteMember = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/members?associationId=${associationId}&id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      toast({ title: "تم الحذف" });
      invalidate();
    },
    onError: (e: Error) => toast({ title: "تعذر الحذف", description: e.message, variant: "destructive" }),
  });

  // تفويض قبول الانخراط — الرئيس حصراً
  const delegate = useMutation({
    mutationFn: async (delegateTo: string) => {
      const res = await fetch("/api/associations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: associationId, action: "delegate_approvals", delegateTo }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      return data;
    },
    onSuccess: (d) => {
      toast({
        title: d.delegatedTo ? "تم التفويض" : "أُلغي التفويض",
        description: d.delegatedTo
          ? `صلاحية قبول الانخراط انتقلت إلى ${d.delegatedTo}`
          : "عادت صلاحية قبول الانخراط إلى الرئيس",
      });
      invalidate();
    },
    onError: (e: Error) => toast({ title: "تعذر التفويض", description: e.message, variant: "destructive" }),
  });

  const filtered = members.filter((m) =>
    !q.trim() || m.user.fullName.includes(q.trim()) || m.user.email.includes(q.trim()) || m.membershipNumber.includes(q.trim())
  );
  const year = new Date().getFullYear();

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black">الأعضاء والانخراطات</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            <span className="num font-bold">{members.length}</span> منخرط · تتبع الواجبات السنوية والموافقات (قانون 09.08)
          </p>
        </div>
        {canManage && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 font-extrabold">
                <UserPlus className="size-4" />
                إضافة منخرط
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>إضافة منخرط جديد</DialogTitle>
                <DialogDescription>
                  يُنشأ حساب دخول للمستخدم إن لم يكن لديه واحد (كلمة السر الافتراضية: Mamp@2026).
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>الاسم الكامل *</Label>
                    <Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="مثال: فاطمة بنعلي" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>البريد الإلكتروني *</Label>
                    <Input dir="ltr" className="text-start" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="name@mail.ma" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>الهاتف</Label>
                    <Input dir="ltr" className="text-start" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+2126..." />
                  </div>
                  <div className="space-y-1.5">
                    <Label>المهنة</Label>
                    <Input value={form.profession} onChange={(e) => setForm({ ...form, profession: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>الدور داخل الجمعية</Label>
                    <Select value={form.roleInAssociation} onValueChange={(v) => setForm({ ...form, roleInAssociation: v })} dir="rtl">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MEMBER">منخرط/ة</SelectItem>
                        <SelectItem value="VOLUNTEER">متطوع/ة</SelectItem>
                        <SelectItem value="CO_ADMIN">كوأدمين</SelectItem>
                        <SelectItem value="BOARD_MEMBER">عضو مجلس</SelectItem>
                        <SelectItem value="SECRETARY">الكاتب/ة العام</SelectItem>
                        <SelectItem value="TREASURER">أمين/ة المال</SelectItem>
                        <SelectItem value="VICE_PRESIDENT">نائب/ة الرئيس</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>نوع الانخراط</Label>
                    <Select value={form.memberType} onValueChange={(v) => setForm({ ...form, memberType: v })} dir="rtl">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ACTIVE">عادي</SelectItem>
                        <SelectItem value="STUDENT">طالب</SelectItem>
                        <SelectItem value="HONORARY">شرفي</SelectItem>
                        <SelectItem value="BENEFACTOR">فاعل خير</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>واجب الانخراط الأولي (درهم)</Label>
                  <Input dir="ltr" className="text-start num" type="number" min={0} value={form.initialFee} onChange={(e) => setForm({ ...form, initialFee: e.target.value })} />
                </div>
                <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-muted/40 p-3 text-[12px] leading-6">
                  <Checkbox checked={form.cndpConsent} onCheckedChange={(v) => setForm({ ...form, cndpConsent: v === true })} className="mt-0.5" />
                  <span className="text-muted-foreground">
                    أُقر بأن المنخرط وافق صراحة على معالجة معطياته الشخصية وفق القانون 09.08 (CNDP).
                    تسجيل الموافقة إلزامي قبل الحفظ.
                  </span>
                </label>
              </div>
              <DialogFooter>
                <Button onClick={() => addMember.mutate()} disabled={addMember.isPending} className="font-extrabold">
                  {addMember.isPending && <Loader2 className="me-2 size-4 animate-spin" />}
                  حفظ المنخرط
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* صلاحية القبول والتفويض — الرئيس */}
      <Card className="border-primary/25 bg-secondary/40">
        <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
          <div className="flex items-start gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-secondary">
              <Crown className="size-5 text-primary" />
            </span>
            <div>
              <p className="text-[14px] font-extrabold">صلاحية قبول طلبات الانخراط</p>
              <p className="mt-1 text-[12.5px] leading-6 text-muted-foreground">
                {perms.approvalsDelegatedTo
                  ? `مفوَّضة حالياً إلى: ${delegatedToName ?? "مسيّر معيَّن"} — يبقى للرئيس الحق في استعادتها في أي وقت.`
                  : "الرئيس/ة يقبل طلبات الانخراط الجديدة. يمكنه تفويض الصلاحية لأحد المسيّرين (نائب الرئيس، الكاتب، أمين المال، مستشار أو كوأدمين)."}
              </p>
            </div>
          </div>
          {perms.isPresident && (
            <div className="flex flex-wrap items-center gap-2">
              <Select
                value={perms.approvalsDelegatedTo ?? "none"}
                onValueChange={(v) => delegate.mutate(v === "none" ? "" : v)}
                dir="rtl"
                disabled={delegate.isPending || delegatable.length === 0}
              >
                <SelectTrigger className="w-64 bg-card font-bold" aria-label="تفويض قبول الانخراط">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">الرئيس نفسه (بلا تفويض)</SelectItem>
                  {delegatable.map((m) => (
                    <SelectItem key={m.id} value={m.user.id}>
                      {m.user.fullName} — {ROLE_LABELS[m.roleInAssociation]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {delegatable.length === 0 && (
                <p className="text-[11px] text-muted-foreground">أضيفوا مسيّرين أولاً لتفويض الصلاحية</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* طلبات الانخراط المعلقة */}
      {pendingMembers.length > 0 && (
        <Card className="border-yellow-300/70">
          <CardContent className="p-5">
            <h2 className="mb-1 flex items-center gap-2 text-base font-extrabold">
              <Inbox className="size-5 text-yellow-600" />
              طلبات انخراط جديدة
              <Badge variant="outline" className="num border-yellow-300 bg-yellow-50 text-[11px] text-yellow-800">
                {pendingMembers.length}
              </Badge>
            </h2>
            <p className="mb-4 text-[12px] text-muted-foreground">
              {perms.canApprove
                ? "بانتظار قراركم — القبول يفعّل عضوية المنخرط ورقم انخراطه."
                : "بانتظار قبول الرئيس أو المسيّر المفوَّض."}
            </p>
            <div className="space-y-2.5">
              {pendingMembers.map((m) => (
                <div
                  key={m.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-background p-3.5"
                >
                  <div className="min-w-0">
                    <p className="font-extrabold">{m.user.fullName}</p>
                    <p className="text-[11.5px] text-muted-foreground" dir="ltr">{m.user.email}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      طُلب في {fmtDate(m.joinedAt)}
                      {m.notes ? ` · ${m.notes}` : ""}
                    </p>
                  </div>
                  {perms.canApprove ? (
                    <div className="flex shrink-0 gap-2">
                      <Button
                        size="sm"
                        className="gap-1.5 bg-emerald-600 font-bold text-white hover:bg-emerald-700"
                        onClick={() => updateMember.mutate({ id: m.id, status: "ACTIVE" })}
                        disabled={updateMember.isPending}
                      >
                        <UserCheck className="size-4" />
                        قبول الانخراط
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5 border-red-200 font-bold text-red-700 hover:bg-red-50 hover:text-red-800"
                        onClick={() => updateMember.mutate({ id: m.id, status: "RESIGNED" })}
                        disabled={updateMember.isPending}
                      >
                        <UserX className="size-4" />
                        رفض
                      </Button>
                    </div>
                  ) : (
                    <Badge variant="outline" className="border-yellow-200 bg-yellow-50 text-[11px] text-yellow-800">
                      بانتظار الرئيس/المفوَّض
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* المرشحات */}
      <div className="grid gap-3 sm:grid-cols-[1fr_220px]">
        <div className="relative">
          <Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحثوا بالاسم أو البريد أو رقم الانخراط..." className="ps-9 bg-card" />
        </div>
        <Select value={status} onValueChange={setStatus} dir="rtl">
          <SelectTrigger className="bg-card"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">كل الحالات</SelectItem>
            <SelectItem value="ACTIVE">نشط</SelectItem>
            <SelectItem value="PENDING">قيد الانتظار</SelectItem>
            <SelectItem value="SUSPENDED">معلق</SelectItem>
            <SelectItem value="RESIGNED">منسحب</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* الجدول */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex h-48 items-center justify-center">
              <Loader2 className="size-7 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-16 text-center">
              <Users className="size-10 text-muted-foreground/40" />
              <p className="font-bold">لا منخرطين مطابقين</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>المنخرط</TableHead>
                    <TableHead>رقم الانخراط</TableHead>
                    <TableHead>الدور</TableHead>
                    <TableHead>تاريخ الانضمام</TableHead>
                    <TableHead className="text-center">واجب {year}</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((m) => {
                    const st = STATUS_BADGES[m.status] ?? STATUS_BADGES.PENDING;
                    const feePaid = m.feePayments.some((f) => f.year === year);
                    return (
                      <TableRow key={m.id}>
                        <TableCell>
                          <div>
                            <p className="font-extrabold">
                              {m.user.fullName}
                              {perms.approvalsDelegatedTo === m.user.id && (
                                <Badge variant="secondary" className="ms-1.5 gap-1 bg-gold-soft text-[10px] text-yellow-800">
                                  <KeyRound className="size-3" />
                                  مفوَّض بالقبول
                                </Badge>
                              )}
                            </p>
                            <p className="text-[11px] text-muted-foreground" dir="ltr">{m.user.email}</p>
                          </div>
                        </TableCell>
                        <TableCell className="num text-[12px] font-bold">{m.membershipNumber}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-[11px]">{ROLE_LABELS[m.roleInAssociation] ?? m.roleInAssociation}</Badge>
                        </TableCell>
                        <TableCell className="text-[12px]">{fmtDate(m.joinedAt)}</TableCell>
                        <TableCell className="text-center">
                          {feePaid ? (
                            <Badge className="gap-1 border-emerald-200 bg-emerald-50 text-[10px] text-emerald-700" variant="outline">
                              <Receipt className="size-3" /> مؤدى
                            </Badge>
                          ) : (
                            canManage ? (
                              <Button
                                size="sm" variant="outline"
                                className="h-7 gap-1 border-yellow-300 text-[11px] font-bold text-yellow-800"
                                onClick={() => updateMember.mutate({ id: m.id, feeYear: year, feeAmount: 120 })}
                              >
                                <HandCoins className="size-3.5" />
                                تسجيل 120 د.م
                              </Button>
                            ) : (
                              <Badge variant="outline" className="border-yellow-200 bg-yellow-50 text-[10px] text-yellow-800">غير مؤدى</Badge>
                            )
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-[11px] ${st.cls}`}>{st.label}</Badge>
                        </TableCell>
                        <TableCell>
                          {canManage && m.roleInAssociation !== "PRESIDENT" && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="size-8" aria-label="إجراءات">
                                  <MoreHorizontal className="size-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {m.status !== "ACTIVE" && m.status !== "PENDING" && (
                                  <DropdownMenuItem onClick={() => updateMember.mutate({ id: m.id, status: "ACTIVE" })} className="gap-2 font-bold">
                                    <BadgeCheck className="size-4 text-emerald-600" /> تنشيط
                                  </DropdownMenuItem>
                                )}
                                {m.status === "ACTIVE" && (
                                  <DropdownMenuItem onClick={() => updateMember.mutate({ id: m.id, status: "SUSPENDED" })} className="gap-2 font-bold">
                                    <ShieldCheck className="size-4" /> تعليق
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                  onClick={() => {
                                    if (confirm(`حذف عضوية ${m.user.fullName}؟ سيبقى حساب المستخدم موجوداً.`))
                                      deleteMember.mutate(m.id);
                                  }}
                                  className="gap-2 font-bold text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="size-4" /> حذف العضوية
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
