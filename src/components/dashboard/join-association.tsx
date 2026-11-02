"use client";

/**
 * بطاقة الانخراط في جمعية — تظهر للمستخدمين غير المرتبطين بجمعية
 * (ولمن يريد الانخراط في جمعية إضافية). تجلب الجمعيات النشطة الموثقة
 * مباشرة من قاعدة المنصة، وطلب الانخراط ينتظر قبول الرئيس (أو المفوَّض).
 */
import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Building2, Search, MapPin, Loader2, UserPlus, BadgeCheck, CheckCircle2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useDash } from "@/components/dashboard/dash-context";

interface PublicAssociation {
  id: string;
  slug: string;
  name: string;
  acronym: string | null;
  category: string;
  city: string;
  region: string;
  description: string;
  isVerified: boolean;
  _count?: { memberships?: number };
}

export function JoinAssociationCard({ compact = false }: { compact?: boolean }) {
  const { associations } = useDash();
  const { toast } = useToast();
  const [q, setQ] = useState("");

  const { data, isLoading } = useQuery<{ associations: PublicAssociation[] }>({
    queryKey: ["joinableAssociations"],
    queryFn: async () => {
      const res = await fetch("/api/associations?scope=public");
      if (!res.ok) return { associations: [] };
      return res.json();
    },
  });

  const join = useMutation({
    mutationFn: async (associationId: string) => {
      const res = await fetch("/api/members/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ associationId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      return data;
    },
    onSuccess: (d) => {
      toast({
        title: "أُرسل طلب الانخراط",
        description: `طلبكم بانتظار قبول رئيس ${d.association?.name ?? "الجمعية"} — ستظهر عضويتكم بعد الموافقة.`,
      });
    },
    onError: (e: Error) =>
      toast({ title: "تعذر إرسال الطلب", description: e.message, variant: "destructive" }),
  });

  const myAssocIds = useMemo(() => new Set(associations.map((a) => a.id)), [associations]);
  const list = (data?.associations ?? []).filter(
    (a) =>
      !myAssocIds.has(a.id) &&
      (!q.trim() || a.name.includes(q.trim()) || a.city.includes(q.trim()) || a.category.includes(q.trim()))
  );

  return (
    <Card className={compact ? "border-primary/20" : "border-primary/25 bg-secondary/30"}>
      <CardContent className="p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-base font-extrabold">
            <Building2 className="size-5 text-primary" />
            {compact ? "الانخراط في جمعية أخرى" : "انخرطوا في جمعية"}
          </h2>
          <p className="max-w-md text-[12px] leading-5 text-muted-foreground">
            طلبكم يصل إلى رئيس الجمعية (أو المسيّر المفوَّض) — وتُفعَّل عضويتكم بعد القبول.
          </p>
        </div>

        <div className="relative mb-3 max-w-sm">
          <Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ابحثوا عن جمعية بالاسم أو المدينة..."
            className="bg-card ps-9"
            aria-label="بحث في الجمعيات"
          />
        </div>

        {isLoading ? (
          <div className="flex h-24 items-center justify-center">
            <Loader2 className="size-6 animate-spin text-primary" />
          </div>
        ) : list.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            لا توجد جمعيات مطابقة حالياً — الجمعيات الموثقة وحدها تتقبل طلبات الانخراط.
          </p>
        ) : (
          <div className={`grid gap-3 ${compact ? "sm:grid-cols-2" : "sm:grid-cols-2 xl:grid-cols-3"}`}>
            {list.slice(0, compact ? 4 : 12).map((a) => (
              <div
                key={a.id}
                className="flex flex-col rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/30"
              >
                <div className="mb-1.5 flex items-start justify-between gap-2">
                  <p className="min-w-0 break-words font-extrabold leading-6">{a.name}</p>
                  {a.isVerified && (
                    <Badge variant="secondary" className="gap-1 shrink-0 bg-gold-soft text-[10px] text-yellow-800">
                      <BadgeCheck className="size-3" />
                      موثقة
                    </Badge>
                  )}
                </div>
                <p className="mb-1 flex items-center gap-1 text-[11.5px] text-muted-foreground">
                  <MapPin className="size-3.5 shrink-0" />
                  {a.city}
                </p>
                <p className="mb-3 line-clamp-2 flex-1 text-[12px] leading-5 text-muted-foreground">{a.description}</p>
                <Button
                  size="sm"
                  className="gap-1.5 font-bold"
                  onClick={() => join.mutate(a.id)}
                  disabled={join.isPending}
                >
                  {join.isPending && join.variables === a.id ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <UserPlus className="size-4" />
                  )}
                  طلب الانخراط
                </Button>
              </div>
            ))}
          </div>
        )}
        {join.isSuccess && (
          <p className="mt-3 flex items-center gap-1.5 text-[12px] font-bold text-emerald-700">
            <CheckCircle2 className="size-4" />
            طلبكم قيد الدراسة — تابعوا حالته من صفحة الأعضاء بعد القبول.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
