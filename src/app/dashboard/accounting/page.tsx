"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Wallet, Plus, Loader2, Trash2, TrendingUp, TrendingDown, Search, Scale,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useDash } from "@/components/dashboard/dash-context";
import { fmtDate, fmtMAD } from "@/lib/format";

interface Tx {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  category: string;
  paymentMethod: string;
  receiptNumber: string | null;
  reference: string | null;
  approvedBy: { fullName: string } | null;
}

const METHOD_LABELS: Record<string, string> = {
  CASH: "نقداً", BANK_TRANSFER: "تحويل بنكي", CHECK: "شيك", ONLINE: "إلكترونياً",
};

export default function AccountingPage() {
  const { associationId, canFinance } = useDash();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [type, setType] = useState("all");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    description: "", amount: "", type: "EXPENSE", category: "كراء وتحملات",
    paymentMethod: "CASH", date: new Date().toISOString().slice(0, 10), reference: "",
  });

  const { data, isLoading } = useQuery<{ transactions: Tx[]; categories: { INCOME_CATEGORIES: string[]; EXPENSE_CATEGORIES: string[] } }>({
    queryKey: ["txs", associationId, type],
    queryFn: async () => {
      const res = await fetch(`/api/transactions?associationId=${associationId}&type=${type}`);
      if (!res.ok) throw new Error((await res.json()).error ?? "خطأ");
      return res.json();
    },
    enabled: !!associationId,
  });

  const addTx = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/transactions?associationId=${associationId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, amount: Number(form.amount) }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      return d;
    },
    onSuccess: () => {
      toast({ title: "سُجلت العملية", description: "تمت إضافتها إلى دفتر الحسابات" });
      setOpen(false);
      setForm({ ...form, description: "", amount: "", reference: "" });
      qc.invalidateQueries({ queryKey: ["txs", associationId] });
      qc.invalidateQueries({ queryKey: ["stats", associationId] });
    },
    onError: (e: Error) => toast({ title: "تعذر التسجيل", description: e.message, variant: "destructive" }),
  });

  const deleteTx = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/transactions?associationId=${associationId}&id=${id}`, { method: "DELETE" });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      return d;
    },
    onSuccess: () => {
      toast({ title: "حُذفت العملية" });
      qc.invalidateQueries({ queryKey: ["txs", associationId] });
      qc.invalidateQueries({ queryKey: ["stats", associationId] });
    },
    onError: (e: Error) => toast({ title: "تعذر الحذف", description: e.message, variant: "destructive" }),
  });

  const txs = (data?.transactions ?? []).filter((t) =>
    !q.trim() || t.description.includes(q.trim()) || (t.receiptNumber ?? "").includes(q.trim())
  );
  const incomeSum = (data?.transactions ?? []).filter((t) => t.type === "INCOME").reduce((s, t) => s + t.amount, 0);
  const expenseSum = (data?.transactions ?? []).filter((t) => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0);

  const categories = form.type === "INCOME"
    ? (data?.categories.INCOME_CATEGORIES ?? [])
    : (data?.categories.EXPENSE_CATEGORIES ?? []);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black">المحاسبة المالية</h1>
          <p className="mt-1 text-sm text-muted-foreground">دفتر الحسابات السنوي — {new Date().getFullYear()}</p>
        </div>
        {canFinance ? (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 font-extrabold">
                <Plus className="size-4" />
                تسجيل عملية
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>تسجيل عملية مالية</DialogTitle>
                <DialogDescription>
                  تسجيل العمليات محجوز لأمين/ة المال والرئيس/ة — كل عملية تُوثق برقم وصل وسجل تدقيق.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>نوع العملية</Label>
                    <Select
                      value={form.type}
                      onValueChange={(v) => setForm({ ...form, type: v, category: v === "INCOME" ? "انخراطات" : "كراء وتحملات" })}
                      dir="rtl"
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INCOME">مدخول</SelectItem>
                        <SelectItem value="EXPENSE">مصروف</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>المبلغ (درهم) *</Label>
                    <Input dir="ltr" className="text-start num" type="number" min={1} value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="0.00" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>الوصف *</Label>
                  <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="مثال: كراء مقر الجمعية — الربع الأول" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>الفئة</Label>
                    <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })} dir="rtl">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>طريقة الأداء</Label>
                    <Select value={form.paymentMethod} onValueChange={(v) => setForm({ ...form, paymentMethod: v })} dir="rtl">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {Object.entries(METHOD_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>التاريخ</Label>
                    <Input dir="ltr" className="text-start num" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>مرجع (اختياري)</Label>
                    <Input dir="ltr" className="text-start" value={form.reference} onChange={(e) => setForm({ ...form, reference: e.target.value })} placeholder="رقم شيك / تحويل" />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => addTx.mutate()} disabled={addTx.isPending || !form.description || !form.amount} className="font-extrabold">
                  {addTx.isPending && <Loader2 className="me-2 size-4 animate-spin" />}
                  حفظ العملية
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ) : (
          <Badge variant="outline" className="gap-1.5 border-yellow-300 bg-yellow-50 px-3 py-1.5 text-[12px] font-bold text-yellow-800">
            <Scale className="size-3.5" />
            التسجيل محجوز لأمين/ة المال والرئيس/ة
          </Badge>
        )}
      </div>

      {/* الملخص */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: TrendingUp, label: "مدخولات السنة", value: fmtMAD(incomeSum), tint: "text-emerald-700 bg-emerald-50" },
          { icon: TrendingDown, label: "مصروفات السنة", value: fmtMAD(expenseSum), tint: "text-terra bg-orange-50" },
          { icon: Wallet, label: "الرصيد", value: fmtMAD(incomeSum - expenseSum), tint: "text-primary bg-secondary" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="flex items-center gap-3 p-4">
              <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${s.tint}`}>
                <s.icon className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-muted-foreground">{s.label}</p>
                <p className="num truncate text-base font-black">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* المرشحات */}
      <div className="grid gap-3 sm:grid-cols-[1fr_200px]">
        <div className="relative">
          <Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحثوا بالوصف أو رقم الوصل..." className="ps-9 bg-card" />
        </div>
        <Select value={type} onValueChange={setType} dir="rtl">
          <SelectTrigger className="bg-card"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">كل العمليات</SelectItem>
            <SelectItem value="INCOME">المدخولات فقط</SelectItem>
            <SelectItem value="EXPENSE">المصروفات فقط</SelectItem>
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
          ) : txs.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-16 text-center">
              <Wallet className="size-10 text-muted-foreground/40" />
              <p className="font-bold">لا عمليات مسجلة</p>
              <p className="text-sm text-muted-foreground">ابدأوا بتسجيل أول مدخول أو مصروف.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>التاريخ</TableHead>
                    <TableHead>الوصف</TableHead>
                    <TableHead>الفئة</TableHead>
                    <TableHead>طريقة الأداء</TableHead>
                    <TableHead>الوصل</TableHead>
                    <TableHead className="text-end">المبلغ</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {txs.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="num whitespace-nowrap text-[12px]">{fmtDate(t.date)}</TableCell>
                      <TableCell>
                        <p className="font-bold">{t.description}</p>
                        {t.approvedBy && <p className="text-[10px] text-muted-foreground">بواسطة {t.approvedBy.fullName}</p>}
                      </TableCell>
                      <TableCell><Badge variant="secondary" className="text-[11px]">{t.category}</Badge></TableCell>
                      <TableCell className="text-[12px]">{METHOD_LABELS[t.paymentMethod] ?? t.paymentMethod}</TableCell>
                      <TableCell className="num text-[11px] text-muted-foreground" dir="ltr">{t.receiptNumber}</TableCell>
                      <TableCell className="text-end">
                        <span className={`num inline-block rounded-lg px-2.5 py-1 text-[13px] font-black ${t.type === "INCOME" ? "bg-emerald-50 text-emerald-700" : "bg-orange-50 text-terra"}`}>
                          {t.type === "INCOME" ? "+" : "−"} {fmtMAD(t.amount)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {canFinance && (
                          <Button
                            variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-destructive"
                            onClick={() => confirm("حذف هذه العملية؟ سيُسجل الحذف في سجل التدقيق.") && deleteTx.mutate(t.id)}
                            aria-label="حذف"
                          >
                            <Trash2 className="size-4" />
                          </Button>
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
    </div>
  );
}
