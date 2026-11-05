/**
 * /api/articles/[id] — قراءة وتعديل وحذف مقال
 * GET    : المقال + التعليقات (زيادة المشاهدات للمقالات المنشورة لغير أصحابها)
 * PATCH  : التعديل (الكاتب، أو رئيس/كاتب عام الجمعية صاحبة المقال، أو طاقم المنصة)
 * DELETE : الحذف (نفس سلسلة الصلاحيات)
 */
import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser, unauthorized, forbidden, canManageAssociation } from "@/lib/auth";
import { audit, readJson } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

async function mayEditArticle(
  user: { id: string; role: string },
  article: { authorId: string; associationId: string | null }
): Promise<boolean> {
  if (user.id === article.authorId) return true;
  if (user.role === "SUPER_ADMIN" || user.role === "ASSOCIATION_ADMIN") return true;
  // رئيس/كاتب عام الجمعية صاحبة المقال
  if (article.associationId) {
    const m = await db.membership.findFirst({
      where: {
        userId: user.id,
        associationId: article.associationId,
        status: "ACTIVE",
        roleInAssociation: { in: ["PRESIDENT", "SECRETARY"] },
      },
    });
    if (m) return true;
  }
  return false;
}

/** GET — مقال مفرد */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  const { id } = await params;

  const article = await db.article.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, fullName: true, avatarUrl: true } },
      association: { select: { id: true, name: true, slug: true } },
      comments: {
        orderBy: { createdAt: "desc" },
        take: 100,
        include: { user: { select: { id: true, fullName: true, avatarUrl: true } } },
      },
      _count: { select: { comments: true, likes: true } },
    },
  });
  if (!article) return Response.json({ error: "المقال غير موجود" }, { status: 404 });

  const isMine = article.authorId === user.id;
  const canModerate =
    isMine ||
    user.role === "SUPER_ADMIN" ||
    user.role === "ASSOCIATION_ADMIN" ||
    (article.associationId ? canManageAssociation(user, article.associationId) : false);
  if (article.status !== "PUBLISHED" && !canModerate) {
    return Response.json({ error: "هذا المقال غير منشور" }, { status: 403 });
  }

  // زيادة المشاهدات للمقالات المنشورة لغير الكاتب
  if (article.status === "PUBLISHED" && !isMine) {
    await db.article
      .update({ where: { id }, data: { views: { increment: 1 } } })
      .catch(() => {});
  }

  const likedByMe = !!(await db.articleLike.findUnique({
    where: { articleId_userId: { articleId: id, userId: user.id } },
  }));

  return Response.json({
    article: {
      ...article,
      views: article.views + (article.status === "PUBLISHED" && !isMine ? 1 : 0),
      commentsCount: article._count.comments,
      likesCount: article._count.likes,
      likedByMe,
      isMine,
      canModerate,
      readingMinutes: Math.max(1, Math.round(article.content.length / 900)),
    },
  });
}

const updateSchema = z.object({
  title: z.string().min(5).max(160).optional(),
  summary: z.string().max(300).optional().or(z.literal("")),
  content: z.string().min(50).max(20000).optional(),
  category: z.string().optional(),
  tags: z.string().max(200).optional().or(z.literal("")),
  associationId: z.string().optional().or(z.literal("")),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
});

/** PATCH — تعديل */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  const { id } = await params;

  const article = await db.article.findUnique({ where: { id } });
  if (!article) return Response.json({ error: "المقال غير موجود" }, { status: 404 });
  if (!(await mayEditArticle(user, article))) {
    return forbidden("تعديل المقال متاح لكاتبه أو لمسيّري جمعيته أو لطاقم المنصة");
  }

  const body = await readJson<Record<string, unknown>>(req);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message ?? "معطيات غير صالحة" }, { status: 400 });
  }
  const data = parsed.data;

  const patch: Record<string, unknown> = {};
  if (data.title !== undefined) patch.title = data.title.trim();
  if (data.summary !== undefined) patch.summary = data.summary || null;
  if (data.content !== undefined) patch.content = data.content.trim();
  if (data.category !== undefined && data.category) patch.category = data.category;
  if (data.tags !== undefined) patch.tags = data.tags || null;
  if (data.status !== undefined) patch.status = data.status;
  if (data.associationId !== undefined) {
    if (!data.associationId) {
      patch.associationId = null;
    } else {
      const membership = await db.membership.findFirst({
        where: { userId: user.id, associationId: data.associationId, status: "ACTIVE" },
      });
      const isStaff = ["SUPER_ADMIN", "ASSOCIATION_ADMIN"].includes(user.role);
      if (!membership && !isStaff) return forbidden("لا تنتمون إلى هذه الجمعية");
      patch.associationId = data.associationId;
    }
  }

  const updated = await db.article.update({ where: { id }, data: patch });
  await audit(user.id, "UPDATE", "Article", id, `تعديل مقال «${updated.title}»`);
  return Response.json({ article: updated });
}

/** DELETE — حذف */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  const { id } = await params;

  const article = await db.article.findUnique({ where: { id } });
  if (!article) return Response.json({ error: "المقال غير موجود" }, { status: 404 });
  if (!(await mayEditArticle(user, article))) {
    return forbidden("حذف المقال متاح لكاتبه أو لمسيّري جمعيته أو لطاقم المنصة");
  }

  await db.article.delete({ where: { id } });
  await audit(user.id, "DELETE", "Article", id, `حذف مقال «${article.title}»`);
  return Response.json({ ok: true });
}
