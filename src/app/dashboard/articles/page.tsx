"use client";

/**
 * المقالات وتبادل الخبرات — بين أفراد الجمعيات والمتطوعين
 * قائمة المقالات المنشورة ومسوداتي + محرر الإنشاء والتعديل
 */
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Newspaper, Plus, Search, Eye, MessageSquare, Heart, PenLine,
  Trash2, Loader2, FileEdit, Archive, Undo2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useI18n } from "@/lib/i18n/provider";
import { useDash } from "@/components/dashboard/dash-context";
import { useToast } from "@/hooks/use-toast";
import { fmtDate } from "@/lib/format";

interface ArticleItem {
  id: string;
  title: string;
  summary: string | null;
  category: string;
  tags: string | null;
  status: string;
  views: number;
  createdAt: string;
  author: { id: string; fullName: string; avatarUrl: string | null };
  association: { id: string; name: string; slug: string } | null;
  commentsCount: number;
  likesCount: number;
  likedByMe: boolean;
  isMine: boolean;
  readingMinutes: number;
}

const CATEGORIES = ["تنظيمية", "تدبير مالي", "شراكات", "تطوع", "تواصل", "تكوين", "أخرى"];

export default function ArticlesPage() {
  const { d } = useI18n();
  const t = d.dash.articles;
  const { associations } = useDash();
  const { toast } = useToast();
  const qc = useQueryClient();

  const [q, setQ] = useState("");
  const [category, setCategory] = useState("all");
  const [tab, setTab] = useState<"all" | "mine">("all");
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    summary: "",
    content: "",
    category: "تنظيمية",
    tags: "",
    associationId: "",
    status: "DRAFT" as "DRAFT" | "PUBLISHED",
  });

  const { data, isLoading } = useQuery<{ articles: ArticleItem[] }>({
    queryKey: ["articles", q, category, tab],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (category !== "all") params.set("category", category);
      if (tab === "mine") {
        params.set("mine", "1");
        params.set("onlyMine", "1");
      }
      const res = await fetch(`/api/articles?${params}`);
      if (!res.ok) throw new Error("failed");
      return res.json();
    },
  });
  const articles = data?.articles ?? [];

  const openEditor = (a?: ArticleItem) => {
    if (a) {
      setEditId(a.id);
      setForm({
        title: a.title,
        summary: a.summary ?? "",
        content: "",
        category: a.category,
        tags: a.tags ?? "",
        associationId: a.association?.id ?? "",
        status: a.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT",
      });
      // جلب المحتوى الكامل للتعديل
      fetch(`/api/articles/${a.id}`)
        .then((r) => r.json())
        .then((d2) => {
          if (d2.article) setForm((f) => ({ ...f, content: d2.article.content }));
        })
        .catch(() => {});
    } else {
      setEditId(null);
      setForm({
        title: "", summary: "", content: "",
        category: "تنظيمية", tags: "", associationId: "", status: "DRAFT",
      });
    }
    setOpen(true);
  };

  const save = useMutation({
    mutationFn: async (status: "DRAFT" | "PUBLISHED") => {
      const payload = { ...form, status };
      const res = await fetch(editId ? `/api/articles/${editId}` : "/api/articles", {
        method: editId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data2 = await res.json();
      if (!res.ok) throw new Error(data2.error ?? "خطأ");
      return data2;
    },
    onSuccess: () => {
      toast({ title: editId ? t.toastUpdated : t.toastCreated });
      setOpen(false);
      qc.invalidateQueries({ queryKey: ["articles"] });
    },
    onError: (e: Error) => toast({ title: t.toastFailed, description: e.message, variant: "destructive" }),
  });

  const setStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await fetch(`/api/articles/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data2 = await res.json();
      if (!res.ok) throw new Error(data2.error ?? "خطأ");
      return data2;
    },
    onSuccess: () => {
      toast({ title: t.toastUpdated });
      qc.invalidateQueries({ queryKey: ["articles"] });
    },
    onError: (e: Error) => toast({ title: t.toastFailed, description: e.message, variant: "destructive" }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/articles/${id}`, { method: "DELETE" });
      const data2 = await res.json();
      if (!res.ok) throw new Error(data2.error ?? "خطأ");
      return data2;
    },
    onSuccess: () => {
      toast({ title: t.toastDeleted });
      qc.invalidateQueries({ queryKey: ["articles"] });
    },
    onError: (e: Error) => toast({ title: t.toastFailed, description: e.message, variant: "destructive" }),
  });

  const statusBadge = (s: string) =>
    s === "PUBLISHED" ? (
      <Badge className="bg-emerald-600">{t.statusPublished}</Badge>
    ) : s === "ARCHIVED" ? (
      <Badge variant="secondary">{t.statusArchived}</Badge>
    ) : (
      <Badge variant="outline">{t.statusDraft}</Badge>
    );

  return (
    <div className="space-y-5">
      {/* ترويسة */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-black sm:text-2xl">
            <Newspaper className="size-6 text-primary" />
            {t.title}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{t.subtitle}</p>
        </div>
        <Button onClick={() => openEditor()} className="gap-2 font-bold">
          <Plus className="size-4" /> {t.newBtn}
        </Button>
      </div>

      {/* أدوات التصفية */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-52 flex-1">
          <Search className="absolute start-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.searchPh} className="h-9 ps-8" />
        </div>
        <Select value={tab} onValueChange={(v) => setTab(v as "all" | "mine")}>
          <SelectTrigger className="h-9 w-40 font-bold">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.allPublished}</SelectItem>
            <SelectItem value="mine">{t.myArticles}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="h-9 w-40 font-bold">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.categoryLabel}</SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* القائمة */}
      {isLoading ? (
        <div className="grid place-items-center py-16">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      ) : articles.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 p-12 text-center">
            <Newspaper className="size-10 text-muted-foreground/40" />
            <p className="font-bold">{t.emptyTitle}</p>
            <p className="max-w-md text-sm text-muted-foreground">{t.emptyDesc}</p>
            <Button onClick={() => openEditor()} variant="outline" className="mt-2 gap-2">
              <Plus className="size-4" /> {t.newBtn}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {articles.map((a) => (
            <Card key={a.id} className="transition-shadow hover:shadow-md">
              <CardContent className="flex h-full flex-col gap-3 p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge variant="secondary" className="font-bold">{a.category}</Badge>
                    {a.association && (
                      <Badge variant="outline" className="max-w-40 truncate font-bold">{a.association.name}</Badge>
                    )}
                    {statusBadge(a.status)}
                  </div>
                </div>
                <a href={`/dashboard/articles/${a.id}`} className="text-lg font-extrabold leading-7 hover:text-primary">
                  {a.title}
                </a>
                {a.summary && <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">{a.summary}</p>}
                <p className="text-[12px] text-muted-foreground">
                  {t.byAuthor} <span className="font-bold">{a.author.fullName}</span> · {fmtDate(a.createdAt)} ·{" "}
                  <span className="num">{a.readingMinutes}</span> {t.minRead}
                </p>
                <div className="mt-auto flex flex-wrap items-center gap-3 border-t border-border pt-3 text-[12px] text-muted-foreground">
                  <span className="flex items-center gap-1"><Eye className="size-3.5" /><span className="num">{a.views}</span></span>
                  <span className="flex items-center gap-1"><MessageSquare className="size-3.5" /><span className="num">{a.commentsCount}</span></span>
                  <span className="flex items-center gap-1"><Heart className="size-3.5" /><span className="num">{a.likesCount}</span></span>
                  <a href={`/dashboard/articles/${a.id}`} className="ms-auto font-bold text-primary hover:underline">
                    {t.readMore} →
                  </a>
                  {a.isMine && (
                    <span className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="size-7" onClick={() => openEditor(a)} title={t.edit}>
                        <FileEdit className="size-3.5" />
                      </Button>
                      {a.status === "PUBLISHED" ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7"
                          onClick={() => setStatus.mutate({ id: a.id, status: "ARCHIVED" })}
                          title={t.archive}
                        >
                          <Archive className="size-3.5" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7 text-emerald-600"
                          onClick={() => setStatus.mutate({ id: a.id, status: "PUBLISHED" })}
                          title={t.publish}
                        >
                          <Undo2 className="size-3.5" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 text-red-600"
                        onClick={() => {
                          if (confirm(t.confirmDelete)) remove.mutate(a.id);
                        }}
                        title={t.delete}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* محرر المقال */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PenLine className="size-5 text-primary" />
              {editId ? t.editTitle : t.formTitle}
            </DialogTitle>
            <DialogDescription>{t.subtitle}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="font-bold">{t.titleLabel}</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder={t.titlePh}
                maxLength={160}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="font-bold">{t.summaryLabel}</Label>
              <Input
                value={form.summary}
                onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
                placeholder={t.summaryPh}
                maxLength={300}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="font-bold">{t.categoryLabel}</Label>
                <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}>
                  <SelectTrigger className="font-bold"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="font-bold">{t.assocLabel}</Label>
                <Select
                  value={form.associationId || "personal"}
                  onValueChange={(v) => setForm((f) => ({ ...f, associationId: v === "personal" ? "" : v }))}
                >
                  <SelectTrigger className="font-bold"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personal">{t.personal}</SelectItem>
                    {associations.map((a) => (
                      <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="font-bold">{t.tagsLabel}</Label>
              <Input
                value={form.tags}
                onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                placeholder={t.tagsPh}
                maxLength={200}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="font-bold">{t.contentLabel}</Label>
              <Textarea
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                placeholder={t.contentPh}
                rows={12}
                maxLength={20000}
                dir="auto"
              />
              <p className="text-[11px] text-muted-foreground">
                <span className="num">{form.content.length}</span> / 20000
              </p>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>{t.cancel}</Button>
            <Button
              variant="secondary"
              disabled={save.isPending || form.title.trim().length < 5 || form.content.trim().length < 50}
              onClick={() => save.mutate("DRAFT")}
            >
              {save.isPending && <Loader2 className="me-1 size-4 animate-spin" />}
              {t.saveDraft}
            </Button>
            <Button
              disabled={save.isPending || form.title.trim().length < 5 || form.content.trim().length < 50}
              onClick={() => save.mutate("PUBLISHED")}
            >
              {save.isPending && <Loader2 className="me-1 size-4 animate-spin" />}
              {t.publish}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
