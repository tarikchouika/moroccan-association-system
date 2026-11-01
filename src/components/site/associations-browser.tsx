"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, MapPin, Users, BadgeCheck, Building2, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { DemoAssociation } from "@/generated/types";

export function AssociationsBrowser({ associations }: { associations: DemoAssociation[] }) {
  const [q, setQ] = useState("");
  const [city, setCity] = useState("all");
  const [category, setCategory] = useState("all");

  const cities = useMemo(() => [...new Set(associations.map((a) => a.city))], [associations]);
  const categories = useMemo(() => [...new Set(associations.map((a) => a.category))], [associations]);

  const filtered = useMemo(() => {
    return associations.filter((a) => {
      if (city !== "all" && a.city !== city) return false;
      if (category !== "all" && a.category !== category) return false;
      if (q.trim()) {
        const needle = q.trim();
        if (!(a.name.includes(needle) || a.description.includes(needle) || a.category.includes(needle) || a.city.includes(needle)))
          return false;
      }
      return true;
    });
  }, [associations, q, city, category]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* الرأس */}
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
          دليل <span className="text-primary">الجمعيات الموثقة</span>
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
          استكشفوا الجمعيات المسجلة على المنصة وفق مجالاتها ومدنها. كل جمعية موثقة
          تظهر هنا بعد التحقق من مرجعها القانوني — لتبرعوا أو تنخرطوا بثقة.
        </p>
      </div>

      {/* المرشحات */}
      <div className="mb-8 grid gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm sm:grid-cols-[1fr_180px_180px]">
        <div className="relative">
          <Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ابحثوا بالاسم أو المجال..."
            className="ps-9 bg-background"
            aria-label="البحث في الجمعيات"
          />
        </div>
        <Select value={city} onValueChange={setCity} dir="rtl">
          <SelectTrigger className="bg-background" aria-label="المدينة">
            <MapPin className="size-4 text-muted-foreground" />
            <SelectValue placeholder="كل المدن" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">كل المدن</SelectItem>
            {cities.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={category} onValueChange={setCategory} dir="rtl">
          <SelectTrigger className="bg-background" aria-label="المجال">
            <Filter className="size-4 text-muted-foreground" />
            <SelectValue placeholder="كل المجالات" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">كل المجالات</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* النتائج */}
      <p className="mb-4 text-sm font-bold text-muted-foreground">
        <span className="num">{filtered.length}</span> جمعية
      </p>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <Building2 className="size-10 text-muted-foreground/50" />
            <p className="font-bold">لا توجد نتائج مطابقة</p>
            <p className="text-sm text-muted-foreground">جربوا تغيير كلمات البحث أو إزالة المرشحات.</p>
            <Button
              variant="outline"
              onClick={() => {
                setQ("");
                setCity("all");
                setCategory("all");
              }}
            >
              إزالة المرشحات
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((a) => (
            <Link key={a.slug} href={`/associations/${a.slug}`} className="group">
              <Card className="h-full transition-all duration-300 group-hover:-translate-y-1 group-hover:border-primary/30 group-hover:shadow-xl">
                <CardContent className="flex h-full flex-col p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <span className="grid size-12 place-items-center rounded-xl bg-secondary text-lg font-black text-primary">
                      {a.acronym?.slice(0, 2) || a.name.slice(0, 2)}
                    </span>
                    <div className="flex flex-col items-end gap-1.5">
                      {a.isVerified && (
                        <Badge className="gap-1 border-primary/25 bg-secondary px-2 py-0.5 text-[10px] font-bold text-primary">
                          <BadgeCheck className="size-3" /> موثقة
                        </Badge>
                      )}
                      {a.legalStatus === "PUBLIC_UTILITY" && (
                        <Badge variant="outline" className="border-gold/50 bg-gold-soft px-2 py-0.5 text-[10px] font-bold text-yellow-800">
                          منفعة عامة
                        </Badge>
                      )}
                    </div>
                  </div>
                  <h3 className="mb-1.5 text-lg font-extrabold leading-snug group-hover:text-primary transition-colors">
                    {a.name}
                  </h3>
                  <p className="mb-4 line-clamp-3 flex-1 text-[13px] leading-6 text-muted-foreground">{a.description}</p>
                  <div className="flex items-center justify-between border-t border-border pt-4 text-[12px] font-bold text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="size-3.5" />{a.city}</span>
                    <span className="flex items-center gap-1">
                      <Users className="size-3.5" />
                      <span className="num">{a.memberCount}</span> عضو
                    </span>
                    <Badge variant="secondary" className="text-[10px]">{a.category}</Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
