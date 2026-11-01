"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CalendarDays, Plus, Loader2, Trash2, MapPin, Users, Globe2, Lock,
  MoreHorizontal, CheckCircle2, XCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useDash } from "@/components/dashboard/dash-context";
import { fmtDate } from "@/lib/format";

interface EventItem {
  id: string;
  title: string;
  description: string | null;
  category: string;
  startDate: string;
  endDate: string | null;
  location: string | null;
  city: string | null;
  maxParticipants: number | null;
  isPublic: boolean;
  status: string;
  _count: { registrations: number };
}

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  PUBLISHED: { label: "منشورة", cls: "border-emerald-200 bg-emerald-50 text-emerald-700" },
  DRAFT: { label: "مسودة", cls: "border-gray-200 bg-gray-50 text-gray-600" },
  CANCELLED: { label: "ملغاة", cls: "border-red-200 bg-red-50 text-red-700" },
  COMPLETED: { label: "منتهية", cls: "border-primary/25 bg-secondary text-primary" },
};

export default function EventsPage() {
  const { associationId, canManage } = useDash();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", category: "ثقافية",
    startDate: "", endDate: "", location: "", city: "", maxParticipants: "", isPublic: true,
  });

  const { data, isLoading } = useQuery<{ events: EventItem[]; categories: string[] }>({
    queryKey: ["events", associationId],
    queryFn: async () => {
      const res = await fetch(`/api/events?associationId=${associationId}`);
      if (!res.ok) throw new Error((await res.json()).error ?? "خطأ");
      return res.json();
    },
    enabled: !!associationId,
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["events", associationId] });
    qc.invalidateQueries({ queryKey: ["stats", associationId] });
  };

  const create = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, maxParticipants: form.maxParticipants ? Number(form.maxParticipants) : undefined }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      return d;
    },
    onSuccess: () => {
      toast({ title: "أُنشئت الفعالية", description: "ظهرت في جدول الفعاليات" });
      setOpen(false);
      setForm({ ...form, title: "", description: "", startDate: "", endDate: "", location: "", maxParticipants: "" });
      invalidate();
    },
    onError: (e: Error) => toast({ title: "تعذر الإنشاء", description: e.message, variant: "destructive" }),
  });

  const setStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await fetch("/api/events", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      return d;
    },
    onSuccess: () => {
      toast({ title: "حُدثت الحالة" });
      invalidate();
    },
    onError: (e: Error) => toast({ title: "تعذر التحديث", description: e.message, variant: "destructive" }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/events?associationId=${associationId}&id=${id}`, { method: "DELETE" });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      return d;
    },
    onSuccess: () => {
      toast({ title: "حُذفت الفعالية" });
      invalidate();
    },
    onError: (e: Error) => toast({ title: "تعذر الحذف", description: e.message, variant: "destructive" }),
  });

  const events = data?.events ?? [];
  const now = new Date();

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black">الفعاليات والأنشطة</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            <span className="num font-bold">{events.length}</span> فعالية · منها{" "}
            <span className="num font-bold">{events.filter((e) => new Date(e.startDate) >= now && e.status === "PUBLISHED").length}</span> قادمة
          </p>
        </div>
        {canManage && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 font-extrabold">
                <Plus className="size-4" />
                فعالية جديدة
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>برمجة فعالية جديدة</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="space-y-1.5">
                  <Label>العنوان *</Label>
                  <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="مثال: الدورة التكوينية في المحاسبة الجمعوية" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>الفئة</Label>
                    <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })} dir="rtl">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {(data?.categories ?? ["ثقافية", "تكوينية", "تحسيسية", "خيرية", "اجتماعية", "رياضية", "بيئية", "أخرى"]).map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>عدد المقاعد</Label>
                    <Input dir="ltr" className="text-start num" type="number" min={1} value={form.maxParticipants} onChange={(e) => setForm({ ...form, maxParticipants: e.target.value })} placeholder="غير محدود" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>تاريخ البداية *</Label>
                    <Input dir="ltr" className="text-start num" type="datetime-local" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>تاريخ النهاية</Label>
                    <Input dir="ltr" className="text-start num" type="datetime-local" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>المكان</Label>
                    <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="قاعة، شارع، مدينة..." />
                  </div>
                  <div className="space-y-1.5">
                    <Label>المدينة</Label>
                    <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>الوصف</Label>
                  <Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-muted/40 p-3 text-[12px]">
                  <Checkbox checked={form.isPublic} onCheckedChange={(v) => setForm({ ...form, isPublic: v === true })} />
                  <span className="font-bold">فعالية عمومية — تظهر في الموقع وتقبل تسجيل المواطنين</span>
                </label>
              </div>
              <DialogFooter>
                <Button onClick={() => create.mutate()} disabled={create.isPending || !form.title || !form.startDate} className="font-extrabold">
                  {create.isPending && <Loader2 className="me-2 size-4 animate-spin" />}
                  إنشاء الفعالية
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {isLoading ? (
        <div className="flex h-48 items-center justify-center">
          <Loader2 className="size-7 animate-spin text-primary" />
        </div>
      ) : events.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-16 text-center">
            <CalendarDays className="size-10 text-muted-foreground/40" />
            <p className="font-bold">لا فعاليات بعد</p>
            <p className="text-sm text-muted-foreground">برمجوا أول نشاط لجمعيتكم.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {events.map((e) => {
            const st = STATUS_LABELS[e.status] ?? STATUS_LABELS.DRAFT;
            const upcoming = new Date(e.startDate) >= now;
            const full = !!e.maxParticipants && e._count.registrations >= e.maxParticipants;
            return (
              <Card key={e.id} className={upcoming && e.status === "PUBLISHED" ? "border-primary/25" : "opacity-90"}>
                <CardContent className="flex h-full flex-col p-5">
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <div className="flex flex-wrap gap-1.5">
                      <Badge variant="outline" className={`text-[10px] ${st.cls}`}>{st.label}</Badge>
                      <Badge variant="secondary" className="text-[10px]">{e.category}</Badge>
                      {e.isPublic ? (
                        <Badge variant="outline" className="gap-1 border-primary/25 bg-secondary text-[10px] text-primary">
                          <Globe2 className="size-3" /> عمومية
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="gap-1 border-border text-[10px] text-muted-foreground">
                          <Lock className="size-3" /> داخلية
                        </Badge>
                      )}
                    </div>
                    {canManage && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8 shrink-0" aria-label="إجراءات">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {e.status !== "COMPLETED" && (
                            <DropdownMenuItem onClick={() => setStatus.mutate({ id: e.id, status: "COMPLETED" })} className="gap-2 font-bold">
                              <CheckCircle2 className="size-4 text-emerald-600" /> تأشير كمنتهية
                            </DropdownMenuItem>
                          )}
                          {e.status !== "CANCELLED" && (
                            <DropdownMenuItem onClick={() => setStatus.mutate({ id: e.id, status: "CANCELLED" })} className="gap-2 font-bold">
                              <XCircle className="size-4 text-red-600" /> إلغاء
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => confirm("حذف الفعالية وتسجيلاتها؟") && remove.mutate(e.id)}
                            className="gap-2 font-bold text-destructive focus:text-destructive"
                          >
                            <Trash2 className="size-4" /> حذف
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                  <h3 className="mb-1.5 font-extrabold leading-snug">{e.title}</h3>
                  <p className="mb-3 text-[12px] text-muted-foreground">
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
                  <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
                    <span className="flex items-center gap-1.5 text-[12px] font-bold text-muted-foreground">
                      <Users className="size-4 text-primary" />
                      <span className="num">{e._count.registrations}</span> مسجل
                      {e.maxParticipants && <span className="num">/ {e.maxParticipants}</span>}
                    </span>
                    {full && <Badge variant="outline" className="border-red-200 bg-red-50 text-[10px] text-red-700">مكتملة</Badge>}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
