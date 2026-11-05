/**
 * /api/articles/[id]/like — تبديل الإعجاب بمقال (مرة واحدة لكل مستخدم)
 */
import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser, unauthorized, forbidden } from "@/lib/auth";
import { isChatEligible } from "@/lib/messaging/eligibility";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  if (!(await isChatEligible(user))) {
    return forbidden("التفاعل متاح للمنخرطين النشيطين والمتطوعين وطاقم المنصة");
  }
  const { id } = await params;

  const article = await db.article.findUnique({ where: { id } });
  if (!article || article.status !== "PUBLISHED") {
    return Response.json({ error: "المقال غير متاح" }, { status: 404 });
  }

  const existing = await db.articleLike.findUnique({
    where: { articleId_userId: { articleId: id, userId: user.id } },
  });

  if (existing) {
    await db.articleLike.delete({ where: { id: existing.id } });
  } else {
    await db.articleLike.create({ data: { articleId: id, userId: user.id } });
  }

  const likesCount = await db.articleLike.count({ where: { articleId: id } });
  return Response.json({ liked: !existing, likesCount });
}
