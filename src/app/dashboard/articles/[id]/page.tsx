"use client";

/**
 * قارئ المقال — عرض كامل + تعليقات تبادل الخبرات + إعجابات
 */
import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowRight, Eye, Heart, MessageSquare, Send, Loader2, Newspaper, Trash2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useI18n } from "@/lib/i18n/provider";
import { useToast } from "@/hooks/use-toast";
import { fmtDate } from "@/lib/format";
import { cn } from "@/lib/utils";

interface CommentItem {
  id: string;
  body: string;
  createdAt: string;
  user: { id: string; fullName: string; avatarUrl: string | null };
}

interface ArticleFull {
  id: string;
  title: string;
  summary: string | null;
  content: string;
  category: string;
  tags: string | null;
  status: string;
  views: number;
  createdAt: string;
  author: { id: string; fullName: string; avatarUrl: string | null };
  association: { id: string; name: string; slug: string } | null;
  comments: CommentItem[];
  commentsCount: number;
  likesCount: number;
  likedByMe: boolean;
  isMine: boolean;
  canModerate: boolean;
  readingMinutes: number;
}

export default function ArticleReaderPage() {
  const params = useParams<{ id: string }>();
  const { d } = useI18n();
  const t = d.dash.articles;
  const { toast } = useToast();
  const qc = useQueryClient();
  const [commentBody, setCommentBody] = useState("");

  const { data, isLoading } = useQuery<{ article: ArticleFull }>({
    queryKey: ["article", params.id],
    queryFn: async () => {
      const res = await fetch(`/api/articles/${params.id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "خطأ");
      return data;
    },
  });

  const like = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/articles/${params.id}/like`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "خطأ");
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["article", params.id] }),
    onError: (e: Error) => toast({ title: t.toastFailed, description: e.message, variant: "destructive" }),
  });

  const comment = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/articles/${params.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: commentBody }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "خطأ");
      return data;
    },
    onSuccess: () => {
      setCommentBody("");
      qc.invalidateQueries({ queryKey: ["article", params.id] });
    },
    onError: (e: Error) => toast({ title: t.toastFailed, description: e.message, variant: "destructive" }),
  });

  const removeComment = useMutation({
    mutationFn: async (commentId: string) => {
      const res = await fetch(`/api/articles/${params.id}/comments?commentId=${commentId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "خطأ");
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["article", params.id] }),
    onError: (e: Error) => toast({ title: t.toastFailed, description: e.message, variant: "destructive" }),
  });

  if (isLoading) {
    return (
      <div className="grid place-items-center py-24">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }
  if (!data?.article) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 p-12 text-center">
          <Newspaper className="size-10 text-muted-foreground/40" />
          <p className="font-bold">{t.emptyTitle}</p>
        </CardContent>
      </Card>
    );
  }

  const a = data.article;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* زر العودة */}
      <Link href="/dashboard/articles" className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline">
        <ArrowRight className="size-4 rtl:rotate-0 ltr:rotate-180" />
        {t.backToList}
      </Link>

      {/* المقال */}
      <Card>
        <CardContent className="space-y-5 p-6 sm:p-9">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant="secondary" className="font-bold">{a.category}</Badge>
            {a.association && (
              <Badge variant="outline" className="font-bold">{a.association.name}</Badge>
            )}
            {a.status !== "PUBLISHED" && (
              <Badge variant="outline">{a.status === "ARCHIVED" ? t.statusArchived : t.statusDraft}</Badge>
            )}
          </div>

          <h1 className="text-2xl font-black leading-relaxed sm:text-3xl">{a.title}</h1>

          <div className="flex flex-wrap items-center gap-3 border-b border-border pb-4 text-[13px] text-muted-foreground">
            <span className="flex items-center gap-2">
              <Avatar className="size-7">
                {a.author.avatarUrl ? <AvatarImage src={a.author.avatarUrl} alt="" /> : null}
                <AvatarFallback className="text-[10px] font-black">{a.author.fullName.slice(0, 2)}</AvatarFallback>
              </Avatar>
              {t.byAuthor} <span className="font-bold text-foreground">{a.author.fullName}</span>
            </span>
            <span>· {fmtDate(a.createdAt)}</span>
            <span className="flex items-center gap-1">
              · <Eye className="size-3.5" /> <span className="num">{a.views}</span> {t.viewsLabel}
            </span>
            <span>
              · <span className="num">{a.readingMinutes}</span> {t.minRead}
            </span>
          </div>

          {a.summary && (
            <p className="rounded-xl border border-primary/15 bg-secondary/60 p-4 text-[15px] font-bold leading-8">
              {a.summary}
            </p>
          )}

          <div className="space-y-5 text-[15px] leading-9">
            {a.content.split(/\n{2,}/).map((p, i) => (
              <p key={i} className="whitespace-pre-wrap">{p}</p>
            ))}
          </div>

          {a.tags && (
            <div className="flex flex-wrap gap-1.5 border-t border-border pt-4">
              {a.tags.split(",").map((tag) => (
                <Badge key={tag} variant="outline" className="text-[11px]">#{tag.trim()}</Badge>
              ))}
            </div>
          )}

          {/* إعجاب */}
          <div className="flex items-center justify-between border-t border-border pt-4">
            <Button
              variant={a.likedByMe ? "default" : "outline"}
              className="gap-2 font-bold"
              onClick={() => like.mutate()}
              disabled={like.isPending}
            >
              <Heart className={cn("size-4", a.likedByMe && "fill-current")} />
              {a.likedByMe ? t.likedBtn : t.likeBtn} (<span className="num">{a.likesCount}</span>)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* التعليقات */}
      <Card>
        <CardContent className="space-y-4 p-6 sm:p-8">
          <h2 className="flex items-center gap-2 text-lg font-extrabold">
            <MessageSquare className="size-5 text-primary" />
            {t.commentsTitle} (<span className="num">{a.commentsCount}</span>)
          </h2>

          {/* نموذج التعليق */}
          <div className="space-y-2">
            <Textarea
              value={commentBody}
              onChange={(e) => setCommentBody(e.target.value)}
              placeholder={t.commentPh}
              rows={3}
              maxLength={1200}
              dir="auto"
            />
            <div className="flex justify-end">
              <Button
                className="gap-2 font-bold"
                disabled={comment.isPending || commentBody.trim().length < 2}
                onClick={() => comment.mutate()}
              >
                {comment.isPending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4 rtl:rotate-0 ltr:rotate-180" />}
                {t.commentBtn}
              </Button>
            </div>
          </div>

          {/* قائمة التعليقات */}
          {a.comments.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">{t.noComments}</p>
          ) : (
            <div className="space-y-3">
              {a.comments.map((c) => (
                <div key={c.id} className="rounded-xl border border-border bg-background p-4">
                  <div className="flex items-center gap-2">
                    <Avatar className="size-7">
                      {c.user.avatarUrl ? <AvatarImage src={c.user.avatarUrl} alt="" /> : null}
                      <AvatarFallback className="text-[10px] font-black">{c.user.fullName.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-extrabold">{c.user.fullName}</p>
                      <p className="text-[11px] text-muted-foreground">{fmtDate(c.createdAt)}</p>
                    </div>
                    {a.canModerate && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 text-red-600"
                        onClick={() => removeComment.mutate(c.id)}
                        title={t.delete}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    )}
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-7">{c.body}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
