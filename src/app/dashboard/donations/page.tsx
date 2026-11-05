"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  HandCoins, Plus, Loader2, Trash2, Receipt, Printer, Globe2, Search, Settings2, Landmark,
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useDash, useSelectedAssociation } from "@/components/dashboard/dash-context";
import { fmtDate, fmtMADPrecise } from "@/lib/format";

interface Donation {
  id: string;
  donorName: string;
  donorEmail: string | null;
  donorPhone: string | null;
  isAnonymous: boolean;
  donorType: string;
  entityName: string | null;
  amount: number;
  type: "MONEY" | "IN_KIND";
  inKindDescription: string | null;
  date: string;
  message: string | null;
  receiptNumber: string | null;
}

interface ReceptionSettings {
  donationsEnabled: boolean;
  donationBankName: string | null;
  donationRib: string | null;
  donationCcp: string | null;
  donationOnlineUrl: string | null;
  donationInstructions: string | null;
  acceptInKind: boolean;
  inKindNeeds: string | null;
}

const DONOR_TYPE_LABELS: Record<string, string> = {
  MEMBER: "منخرط",
  ENTITY: "جهة داعمة",
  CITIZEN: "مواطن",
  OTHER: "آخر",
};

export default function DonationsPage() {
  const { associationId, canManage } = useDash();
  const assoc = useSelectedAssociation();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [receipt, setReceipt] = useState<Donation | null>(null);
  const [form, setForm] = useState({
    donorName: "", donorEmail: "", donorPhone: "",
    isAnonymous: false, amount: "", type: "MONEY", inKindDescription: "",
    message: "", foreignSource: false,
    donorType: "OTHER", entityName: "", membershipId: "",
  });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsForm, setSettingsForm] = useState<ReceptionSettings>({
    donationsEnabled: false, donationBankName: "", donationRib: "", donationCcp: "",
    donationOnlineUrl: "", donationInstructions: "", acceptInKind: true, inKindNeeds: "",
  });

  const { data, isLoading } = useQuery<{ donations: Donation[] }>({
    queryKey: ["donations", associationId],
    queryFn: async () => {
      const res = await fetch(`/api/donations?associationId=${associationId}`);
      if (!res.ok) throw new Error((await res.json()).error ?? "خطأ");
      return res.json();
    },
    enabled: !!associationId,
  });

  // إعدادات استقبال التبرعات
  const { data: settingsData } = useQuery<{ settings: ReceptionSettings }>({
    queryKey: ["donation-settings", associationId],
    queryFn: async () => {
      const res = await fetch(`/api/donations/settings?associationId=${associationId}`);
      if (!res.ok) throw new Error((await res.json()).error ?? "خطأ");
      return res.json();
    },
    enabled: !!associationId,
  });

  // لائحة المنخرطين النشيطين (لاختيار المتبرع المنخرط)
  const { data: membersData } = useQuery<{
    members: { id: string; user: { fullName: string; email: string | null } }[];
  }>({
    queryKey: ["members-for-donations", associationId],
    queryFn: async () => {
      const res = await fetch(`/api/members?associationId=${associationId}&status=ACTIVE`);
      if (!res.ok) throw new Error("خطأ");
      return res.json();
    },
    enabled: !!associationId && canManage,
  });

  const saveSettings = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/donations/settings?associationId=${associationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settingsForm),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      return d;
    },
    onSuccess: () => {
      toast({ title: "حُفظت معلومات استقبال التبرعات" });
      setSettingsOpen(false);
      qc.invalidateQueries({ queryKey: ["donation-settings", associationId] });
    },
    onError: (e: Error) => toast({ title: "تعذر الحفظ", description: e.message, variant: "destructive" }),
  });

  const addDonation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/donations?associationId=${associationId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          amount: Number(form.amount) || 0,
          donorName: form.donorType === "ENTITY" && form.entityName ? form.entityName : form.donorName,
        }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      return d;
    },
    onSuccess: (d) => {
      toast({ title: "سُجل التبرع", description: `الوصل ${d.donation.receiptNumber} جاهز للطبع` });
      setOpen(false);
      setForm({ ...form, donorName: "", donorEmail: "", donorPhone: "", amount: "", inKindDescription: "", message: "", entityName: "", membershipId: "" });
      qc.invalidateQueries({ queryKey: ["donations", associationId] });
      qc.invalidateQueries({ queryKey: ["stats", associationId] });
      setReceipt(d.donation);
    },
    onError: (e: Error) => toast({ title: "تعذر التسجيل", description: e.message, variant: "destructive" }),
  });

  const deleteDonation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/donations?associationId=${associationId}&id=${id}`, { method: "DELETE" });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      return d;
    },
    onSuccess: () => {
      toast({ title: "حُذف التبرع" });
      qc.invalidateQueries({ queryKey: ["donations", associationId] });
      qc.invalidateQueries({ queryKey: ["stats", associationId] });
    },
    onError: (e: Error) => toast({ title: "تعذر الحذف", description: e.message, variant: "destructive" }),
  });

  const donations = (data?.donations ?? []).filter((d) =>
    !q.trim() || d.donorName.includes(q.trim()) || (d.receiptNumber ?? "").toLowerCase().includes(q.trim().toLowerCase())
  );
  const total = (data?.donations ?? []).filter((d) => d.type === "MONEY").reduce((s, d) => s + d.amount, 0);

  const openSettings = () => {
    const s = settingsData?.settings;
    setSettingsForm({
      donationsEnabled: s?.donationsEnabled ?? false,
      donationBankName: s?.donationBankName ?? "",
      donationRib: s?.donationRib ?? "",
      donationCcp: s?.donationCcp ?? "",
      donationOnlineUrl: s?.donationOnlineUrl ?? "",
      donationInstructions: s?.donationInstructions ?? "",
      acceptInKind: s?.acceptInKind ?? true,
      inKindNeeds: s?.inKindNeeds ?? "",
    });
    setSettingsOpen(true);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black">التبرعات والوصولات</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            <span className="num font-bold">{data?.donations.length ?? 0}</span> تبرع · مجموع نقدي: <span className="num font-black text-primary">{fmtMADPrecise(total)}</span>
          </p>
        </div>
        {canManage && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={openSettings} className="gap-2 font-bold">
              <Settings2 className="size-4" />
              معلومات استقبال التبرعات
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 font-extrabold">
                <Plus className="size-4" />
                تسجيل تبرع
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>تسجيل تبرع جديد</DialogTitle>
                <DialogDescription>
                  يُولد وصل رسمي مرقم تلقائياً، ويُسجل التبرع في المحاسبة (فئة التبرعات).
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                {/* نوع المتبرع + نوع التبرع */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>نوع المتبرع</Label>
                    <Select
                      value={form.donorType}
                      onValueChange={(v) => setForm({ ...form, donorType: v, membershipId: "", entityName: "" })}
                      dir="rtl"
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MEMBER">منخرط</SelectItem>
                        <SelectItem value="ENTITY">جهة داعمة</SelectItem>
                        <SelectItem value="CITIZEN">مواطن</SelectItem>
                        <SelectItem value="OTHER">آخر</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>نوع التبرع</Label>
                    <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })} dir="rtl">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MONEY">نقدي</SelectItem>
                        <SelectItem value="IN_KIND">عيني</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* جهة داعمة: اسم الجهة */}
                {form.donorType === "ENTITY" && (
                  <div className="space-y-1.5">
                    <Label>اسم الجهة الداعمة *</Label>
                    <Input
                      value={form.entityName}
                      onChange={(e) => setForm({ ...form, entityName: e.target.value, donorName: e.target.value })}
                      placeholder="مثال: مؤسسة التعاون الوطني / مقاولة خاصة"
                    />
                  </div>
                )}

                {/* منخرط: اختيار من اللائحة */}
                {form.donorType === "MEMBER" && (
                  <div className="space-y-1.5">
                    <Label>المنخرط المتبرع *</Label>
                    <Select
                      value={form.membershipId}
                      onValueChange={(v) => {
                        const m = (membersData?.members ?? []).find((x) => x.id === v);
                        setForm({
                          ...form,
                          membershipId: v,
                          donorName: m?.user.fullName ?? "",
                          donorEmail: m?.user.email ?? "",
                        });
                      }}
                      dir="rtl"
                    >
                      <SelectTrigger><SelectValue placeholder="اختر منخرطاً..." /></SelectTrigger>
                      <SelectContent>
                        {(membersData?.members ?? []).map((m) => (
                          <SelectItem key={m.id} value={m.id}>{m.user.fullName}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label>اسم المتبرع *</Label>
                  <Input value={form.donorName} onChange={(e) => setForm({ ...form, donorName: e.target.value })} placeholder="الاسم الكامل أو المقاولة" />
                </div>

                {form.type === "MONEY" ? (
                  <div className="space-y-1.5">
                    <Label>المبلغ (درهم) *</Label>
                    <Input dir="ltr" className="text-start num" type="number" min={1} value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="0.00" />
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <Label>وصف التبرع العيني *</Label>
                    <Input value={form.inKindDescription} onChange={(e) => setForm({ ...form, inKindDescription: e.target.value })} placeholder="مثال: 10 حاسبات محمولة" />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>البريد الإلكتروني</Label>
                    <Input dir="ltr" className="text-start" type="email" value={form.donorEmail} onChange={(e) => setForm({ ...form, donorEmail: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>الهاتف</Label>
                    <Input dir="ltr" className="text-start" value={form.donorPhone} onChange={(e) => setForm({ ...form, donorPhone: e.target.value })} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label>كلمة/رسالة (اختياري)</Label>
                  <Input value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                </div>

                <div className="space-y-2.5">
                  <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-muted/40 p-3 text-[12px]">
                    <Checkbox checked={form.isAnonymous} onCheckedChange={(v) => setForm({ ...form, isAnonymous: v === true })} />
                    <span className="font-bold">تبرع باسم مجهول (يظهر في السجل كـ «متبرع مجهول»)</span>
                  </label>
                  <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-yellow-300/60 bg-yellow-50/60 p-3 text-[12px] leading-6">
                    <Checkbox checked={form.foreignSource} onCheckedChange={(v) => setForm({ ...form, foreignSource: v === true })} className="mt-0.5" />
                    <span>
                      <span className="flex items-center gap-1.5 font-extrabold text-yellow-800">
                        <Globe2 className="size-3.5" />
                        المصدر أجنبي (دولة/منظمة أجنبية)
                      </span>
                      <span className="text-yellow-800/80">
                        يجب التصريح به لدى السلطات المختصة وفق ظهير 1958 — سيُعلَّم في المحاسبة والسجل.
                      </span>
                    </span>
                  </label>
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={() => addDonation.mutate()}
                  disabled={
                    addDonation.isPending || !form.donorName ||
                    (form.type === "MONEY" && !form.amount) ||
                    (form.type === "IN_KIND" && !form.inKindDescription) ||
                    (form.donorType === "ENTITY" && !form.entityName) ||
                    (form.donorType === "MEMBER" && !form.membershipId)
                  }
                  className="font-extrabold"
                >
                  {addDonation.isPending && <Loader2 className="me-2 size-4 animate-spin" />}
                  حفظ وإصدار الوصل
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          </div>
        )}
      </div>

      {/* بطاقة معلومات استقبال التبرعات */}
      <Card className="border-primary/20">
        <CardContent className="flex flex-wrap items-center justify-between gap-3 p-5">
          <div className="flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10">
              <Landmark className="size-5 text-primary" />
            </span>
            <div>
              <p className="font-extrabold">معلومات استقبال التبرعات والمساهمات</p>
              <p className="mt-0.5 text-[12px] leading-6 text-muted-foreground">
                {settingsData?.settings.donationsEnabled
                  ? "مفعّلة — تُعرض وسائل الدعم في الصفحة العمومية للجمعية."
                  : "غير مفعّلة — فعّلوها لنشر وسائل الدعم (بنك/بريد/رابط إلكتروني) على صفحة الجمعية."}
              </p>
            </div>
          </div>
          {canManage && (
            <Button variant={settingsData?.settings.donationsEnabled ? "default" : "outline"} onClick={openSettings} className="gap-2 font-bold">
              <Settings2 className="size-4" />
              {settingsData?.settings.donationsEnabled ? "تعديل المعلومات" : "تفعيل واستقبال"}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* البحث */}
      <div className="relative max-w-md">
        <Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحثوا باسم المتبرع أو رقم الوصل..." className="ps-9 bg-card" />
      </div>

      {/* الجدول */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex h-48 items-center justify-center">
              <Loader2 className="size-7 animate-spin text-primary" />
            </div>
          ) : donations.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-16 text-center">
              <HandCoins className="size-10 text-muted-foreground/40" />
              <p className="font-bold">لا تبرعات مسجلة بعد</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>رقم الوصل</TableHead>
                    <TableHead>المتبرع</TableHead>
                    <TableHead>النوع</TableHead>
                    <TableHead>التاريخ</TableHead>
                    <TableHead className="text-end">المبلغ/الوصف</TableHead>
                    <TableHead className="w-28"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {donations.map((d) => (
                    <TableRow key={d.id}>
                      <TableCell className="num text-[11px] font-bold text-muted-foreground" dir="ltr">{d.receiptNumber}</TableCell>
                      <TableCell className="font-bold">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {d.isAnonymous ? "متبرع مجهول" : d.donorName}
                          {d.donorType && d.donorType !== "OTHER" && (
                            <Badge variant="outline" className="text-[10px]">{DONOR_TYPE_LABELS[d.donorType] ?? d.donorType}</Badge>
                          )}
                        </div>
                        {d.entityName && d.donorType === "ENTITY" && (
                          <p className="text-[10px] font-normal text-muted-foreground">{d.entityName}</p>
                        )}
                        {d.message && <p className="text-[10px] font-normal text-muted-foreground">«{d.message}»</p>}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-[11px]">{d.type === "MONEY" ? "نقدي" : "عيني"}</Badge>
                      </TableCell>
                      <TableCell className="num whitespace-nowrap text-[12px]">{fmtDate(d.date)}</TableCell>
                      <TableCell className="text-end">
                        {d.type === "MONEY" ? (
                          <span className="num font-black text-primary">{fmtMADPrecise(d.amount)}</span>
                        ) : (
                          <span className="text-[12px] font-bold">{d.inKindDescription}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="size-8" onClick={() => setReceipt(d)} aria-label="عرض الوصل" title="عرض الوصل">
                            <Receipt className="size-4" />
                          </Button>
                          {canManage && (
                            <Button
                              variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-destructive"
                              onClick={() => confirm("حذف هذا التبرع وقصاده المحاسبي؟") && deleteDonation.mutate(d.id)}
                              aria-label="حذف"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* نافذة إعدادات استقبال التبرعات */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>معلومات استقبال التبرعات والمساهمات</DialogTitle>
            <DialogDescription>
              تُعرض هذه المعلومات للعموم في صفحة الجمعية عند التفعيل — لتسهيل دعم المنخرطين والجهات الداعمة.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-muted/40 p-3 text-[13px]">
              <Checkbox
                checked={settingsForm.donationsEnabled}
                onCheckedChange={(v) => setSettingsForm({ ...settingsForm, donationsEnabled: v === true })}
              />
              <span className="font-bold">تفعيل استقبال التبرعات ونشر المعلومات</span>
            </label>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>اسم البنك</Label>
                <Input
                  value={settingsForm.donationBankName ?? ""}
                  onChange={(e) => setSettingsForm({ ...settingsForm, donationBankName: e.target.value })}
                  placeholder="مثال: القرض الشعبي"
                />
              </div>
              <div className="space-y-1.5">
                <Label>رقم الحساب البنكي (RIB)</Label>
                <Input
                  dir="ltr"
                  className="num text-start"
                  value={settingsForm.donationRib ?? ""}
                  onChange={(e) => setSettingsForm({ ...settingsForm, donationRib: e.target.value })}
                  placeholder="000 000 0000000000000000 00"
                  maxLength={34}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>حساب البريد (CCP)</Label>
                <Input
                  dir="ltr"
                  className="num text-start"
                  value={settingsForm.donationCcp ?? ""}
                  onChange={(e) => setSettingsForm({ ...settingsForm, donationCcp: e.target.value })}
                  placeholder="0000000"
                  maxLength={20}
                />
              </div>
              <div className="space-y-1.5">
                <Label>رابط الدفع الإلكتروني</Label>
                <Input
                  dir="ltr"
                  className="text-start"
                  value={settingsForm.donationOnlineUrl ?? ""}
                  onChange={(e) => setSettingsForm({ ...settingsForm, donationOnlineUrl: e.target.value })}
                  placeholder="https://..."
                  type="url"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>تعليمات وتوجيهات التبرع</Label>
              <Input
                value={settingsForm.donationInstructions ?? ""}
                onChange={(e) => setSettingsForm({ ...settingsForm, donationInstructions: e.target.value })}
                placeholder="مثال: تُوجَّل الإشعارات إلى البريد الإلكتروني للجمعية"
                maxLength={1000}
              />
            </div>

            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-muted/40 p-3 text-[13px]">
              <Checkbox
                checked={settingsForm.acceptInKind}
                onCheckedChange={(v) => setSettingsForm({ ...settingsForm, acceptInKind: v === true })}
              />
              <span className="font-bold">قبول التبرعات والمساهمات العينية</span>
            </label>

            {settingsForm.acceptInKind && (
              <div className="space-y-1.5">
                <Label>الاحتياجات العينية الحالية</Label>
                <Input
                  value={settingsForm.inKindNeeds ?? ""}
                  onChange={(e) => setSettingsForm({ ...settingsForm, inKindNeeds: e.target.value })}
                  placeholder="مثال: تجهيزات مدرسية · بطانيات · مواد غذائية"
                  maxLength={600}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSettingsOpen(false)}>إغلاق</Button>
            <Button onClick={() => saveSettings.mutate()} disabled={saveSettings.isPending} className="font-extrabold">
              {saveSettings.isPending && <Loader2 className="me-2 size-4 animate-spin" />}
              حفظ المعلومات
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* وصل التبرع — قابل للطبع */}
      <Dialog open={!!receipt} onOpenChange={(o) => !o && setReceipt(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="no-print">
            <DialogTitle>وصل تبرع</DialogTitle>
          </DialogHeader>
          {receipt && (
            <div className="print-area rounded-xl border-2 border-primary/25 p-6" id="receipt-paper">
              <div className="mb-4 flex items-center justify-between border-b border-dashed border-border pb-4">
                <div>
                  <p className="text-lg font-black text-primary">{assoc?.name ?? "جمعية"}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {receipt.type === "MONEY" ? "وصل تبرع نقدي" : "وصل تبرع عيني"}
                  </p>
                </div>
                <div className="text-end">
                  <p className="text-[10px] text-muted-foreground">رقم الوصل</p>
                  <p className="num text-sm font-black" dir="ltr">{receipt.receiptNumber}</p>
                </div>
              </div>

              <dl className="space-y-2.5 text-[13px]">
                <div className="flex justify-between border-b border-border/60 pb-2">
                  <dt className="text-muted-foreground">تاريخ التسليم</dt>
                  <dd className="num font-bold">{fmtDate(receipt.date)}</dd>
                </div>
                <div className="flex justify-between border-b border-border/60 pb-2">
                  <dt className="text-muted-foreground">اسم المتبرع/ة</dt>
                  <dd className="font-bold">{receipt.isAnonymous ? "متبرع مجهول" : receipt.donorName}</dd>
                </div>
                {receipt.type === "MONEY" ? (
                  <div className="flex justify-between border-b border-border/60 pb-2">
                    <dt className="text-muted-foreground">المبلغ</dt>
                    <dd className="num text-base font-black text-primary">{fmtMADPrecise(receipt.amount)}</dd>
                  </div>
                ) : (
                  <div className="flex justify-between border-b border-border/60 pb-2">
                    <dt className="text-muted-foreground">التبرع العيني</dt>
                    <dd className="font-bold">{receipt.inKindDescription}</dd>
                  </div>
                )}
              </dl>

              <p className="mt-5 rounded-lg bg-muted/60 p-3 text-[11px] leading-6 text-muted-foreground">
                أُسلِّم هذا الوصل للمتبرع/ة للاستعمال القانوني. للتبرعات الممنوحة للجهات المؤهلة،
                يُرجع في شروط الخصم الضريبي إلى النص الجاري به العمل للمدونة العامة للضرائب (المادة 10).
              </p>

              <div className="mt-6 flex items-end justify-between">
                <div className="text-center">
                  <p className="w-28 border-t border-foreground/40 pt-1 text-[11px] font-bold">توقيع أمين/ة المال</p>
                </div>
                <p className="text-[10px] text-muted-foreground">صدر إلكترونياً عبر منصة MAMP</p>
                <div className="text-center">
                  <p className="w-28 border-t border-foreground/40 pt-1 text-[11px] font-bold">خاتم الجمعية</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="no-print">
            <Button variant="outline" onClick={() => setReceipt(null)}>إغلاق</Button>
            <Button className="gap-2 font-extrabold" onClick={() => window.print()}>
              <Printer className="size-4" />
              طباعة الوصل
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
