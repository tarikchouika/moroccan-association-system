"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  HandCoins, Plus, Loader2, Trash2, Receipt, Printer, Globe2, Search,
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
  amount: number;
  type: "MONEY" | "IN_KIND";
  inKindDescription: string | null;
  date: string;
  message: string | null;
  receiptNumber: string | null;
}

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

  const addDonation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, amount: Number(form.amount) || 0 }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      return d;
    },
    onSuccess: (d) => {
      toast({ title: "سُجل التبرع", description: `الوصل ${d.donation.receiptNumber} جاهز للطبع` });
      setOpen(false);
      setForm({ ...form, donorName: "", donorEmail: "", donorPhone: "", amount: "", inKindDescription: "", message: "" });
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
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>اسم المتبرع *</Label>
                    <Input value={form.donorName} onChange={(e) => setForm({ ...form, donorName: e.target.value })} placeholder="الاسم الكامل أو المقاولة" />
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
                  disabled={addDonation.isPending || !form.donorName || (form.type === "MONEY" && !form.amount) || (form.type === "IN_KIND" && !form.inKindDescription)}
                  className="font-extrabold"
                >
                  {addDonation.isPending && <Loader2 className="me-2 size-4 animate-spin" />}
                  حفظ وإصدار الوصل
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

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
                        {d.isAnonymous ? "متبرع مجهول" : d.donorName}
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
                <p className="text-[10px] text-muted-foreground">صدر إلكترونياً عبر منصة مامب</p>
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
