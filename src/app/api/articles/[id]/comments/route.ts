/**
 * /api/articles/[id]/comments — تعليقات تبادل الخبرات
 * POST   : إضافة تعليق (منخرطون نشيطون ومتطوعون وطاقم المنصة)
 * DELETE : حذف تعليق (?commentId=) — صاحبه أو الكاتب الأصلي أو طاقم الإشراف
 */
import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser, unauthorized, forbidden } from "@/lib/auth";
import { audit, readJson } from "@/lib/api-helpers";
import { isChatEligible } from "@/lib/messaging/eligibility";

export const dynamic = "force-dynamic";

const commentSchema = z.object({
  body: z.string().min(2, "التعليق قصير جداً").max(1200),
});

/** POST — تعليق جديد */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  if (!(await isChatEligible(user))) {
    return forbidden("التعليق متاح للمنخرطين النشيطين والمتطوعين وطاقم المنصة");
  }
  const { id } = await params;

  const article = await db.article.findUnique({ where: { id } });
  if (!article || article.status !== "PUBLISHED") {
    return Response.json({ error: "المقال غير متاح للتعليق" }, { status: 404 });
  }

  const body = await readJson<Record<string, unknown>>(req);
  const parsed = commentSchema.safeParse({ body: typeof body?.body === "string" ? body.body.trim() : "" });
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message ?? "معطيات غير صالحة" }, { status: 400 });
  }

  const comment = await db.articleComment.create({
    data: { articleId: id, userId: user.id, body: parsed.data.body },
    include: { user: { select: { id: true, fullName: true, avatarUrl: true } } },
  });
  return Response.json({ comment }, { status: 201 });
}

/** DELETE — حذف تعليق */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  const { id } = await params;
  const commentId = req.nextUrl.searchParams.get("commentId") ?? "";

  const comment = await db.articleComment.findUnique({
    where: { id: commentId },
    include: { article: { select: { id: true, authorId: true, associationId: true } } },
  });
  if (!comment || comment.article.id !== id) {
    return Response.json({ error: "التعليق غير موجود" }, { status: 404 });
  }

  const isCommenter = comment.userId === user.id;
  const isArticleAuthor = comment.article.authorId === user.id;
  const isStaff = ["SUPER_ADMIN", "ASSOCIATION_ADMIN"].includes(user.role);
  let isAssocManager = false;
  if (comment.article.associationId) {
    const m = await db.membership.findFirst({
      where: {
        userId: user.id,
        associationId: comment.article.associationId,
        status: "ACTIVE",
        roleInAssociation: { in: ["PRESIDENT", "SECRETARY"] },
      },
    });
    isAssocManager = !!m;
  }
  if (!isCommenter && !isArticleAuthor && !isStaff && !isAssocManager) {
    return forbidden("حذف التعليق متاح لصاحبه أو لكاتب المقال أو للمشرفين");
  }

  await db.articleComment.delete({ where: { id: commentId } });
  await audit(user.id, "DELETE", "ArticleComment", commentId, "حذف تعليق");
  return Response.json({ ok: true });
}
