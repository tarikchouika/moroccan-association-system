/**
 * /api/articles — المقالات وتبادل الخبرات بين أفراد الجمعيات والمتطوعين
 * GET  : قائمة (المنشورة للجميع + مسوداتي) مع بحث وتصفية
 * POST : إنشاء مقال (منخرطون نشيطون ومتطوعون وطاقم المنصة)
 */
import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser, unauthorized, forbidden } from "@/lib/auth";
import { audit, readJson } from "@/lib/api-helpers";
import { isChatEligible } from "@/lib/messaging/eligibility";

export const dynamic = "force-dynamic";

const CATEGORIES = ["تنظيمية", "تدبير مالي", "شراكات", "تطوع", "تواصل", "تكوين", "أخرى"];

/** GET — قائمة المقالات */
export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  const q = (req.nextUrl.searchParams.get("q") ?? "").trim();
  const category = req.nextUrl.searchParams.get("category") ?? "";
  const mine = req.nextUrl.searchParams.get("mine") === "1";

  const where: Record<string, unknown> = {
    OR: [{ status: "PUBLISHED" }, ...(mine ? [{ authorId: user.id }] : [])],
  };
  if (mine && req.nextUrl.searchParams.get("mine") === "1" && req.nextUrl.searchParams.get("onlyMine") === "1") {
    delete where.OR;
    where.authorId = user.id;
  }
  if (category && CATEGORIES.includes(category)) where.category = category;
  if (q) {
    where.AND = [
      {
        OR: [
          { title: { contains: q } },
          { summary: { contains: q } },
          { content: { contains: q } },
          { tags: { contains: q } },
          { author: { fullName: { contains: q } } },
        ],
      },
    ];
  }

  const articles = await db.article.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 60,
    include: {
      author: { select: { id: true, fullName: true, avatarUrl: true } },
      association: { select: { id: true, name: true, slug: true } },
      _count: { select: { comments: true, likes: true } },
    },
  });

  const likedByMe = await db.articleLike.findMany({
    where: { userId: user.id, articleId: { in: articles.map((a) => a.id) } },
    select: { articleId: true },
  });
  const likedSet = new Set(likedByMe.map((l) => l.articleId));

  return Response.json({
    articles: articles.map((a) => ({
      id: a.id,
      slug: a.slug,
      title: a.title,
      summary: a.summary,
      category: a.category,
      tags: a.tags,
      status: a.status,
      views: a.views,
      createdAt: a.createdAt,
      author: a.author,
      association: a.association,
      commentsCount: a._count.comments,
      likesCount: a._count.likes,
      likedByMe: likedSet.has(a.id),
      isMine: a.authorId === user.id,
      readingMinutes: Math.max(1, Math.round(a.content.length / 900)),
    })),
  });
}

const createSchema = z.object({
  title: z.string().min(5, "العنوان مطلوب (5 أحرف على الأقل)").max(160),
  summary: z.string().max(300).optional().or(z.literal("")),
  content: z.string().min(50, "المحتوى مطلوب (50 حرفاً على الأقل)").max(20000),
  category: z.string().default("أخرى"),
  tags: z.string().max(200).optional().or(z.literal("")),
  associationId: z.string().optional().or(z.literal("")),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
});

/** POST — إنشاء مقال */
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  if (!(await isChatEligible(user))) {
    return forbidden("النشر متاح للمنخرطين النشيطين والمتطوعين وطاقم المنصة");
  }

  const body = await readJson<Record<string, unknown>>(req);
  const parsed = createSchema.safeParse({
    title: typeof body?.title === "string" ? body.title.trim() : "",
    summary: body?.summary ?? "",
    content: typeof body?.content === "string" ? body.content.trim() : "",
    category: CATEGORIES.includes(String(body?.category)) ? body?.category : "أخرى",
    tags: body?.tags ?? "",
    associationId: body?.associationId ?? "",
    status: body?.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT",
  });
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message ?? "معطيات غير صالحة" }, { status: 400 });
  }
  const data = parsed.data;

  // النشر باسم جمعية: يجب أن تكون عضواً نشيطاً فيها (أو طاقم منصة)
  let associationId: string | null = null;
  if (data.associationId) {
    const membership = await db.membership.findFirst({
      where: { userId: user.id, associationId: data.associationId, status: "ACTIVE" },
    });
    const isStaff = ["SUPER_ADMIN", "ASSOCIATION_ADMIN"].includes(user.role);
    if (!membership && !isStaff) {
      return forbidden("لا تنتمون إلى هذه الجمعية");
    }
    const assoc = await db.association.findUnique({ where: { id: data.associationId } });
    if (!assoc) return Response.json({ error: "الجمعية غير موجودة" }, { status: 404 });
    associationId = assoc.id;
  }

  // مقطع عنوان آمن للرابط (يدعم العربية) + لاحقة تفرد
  const slugBase = data.title
    .replace(/[\s\u200f\u200e]+/g, "-")
    .replace(/[^\p{L}\p{N}-]/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
  const slug = `${slugBase || "مقال"}-${Date.now().toString(36)}`;

  const article = await db.article.create({
    data: {
      slug,
      title: data.title,
      summary: data.summary || null,
      content: data.content,
      category: data.category,
      tags: data.tags || null,
      associationId,
      authorId: user.id,
      status: data.status,
    },
  });

  await audit(user.id, "CREATE", "Article", article.id, `مقال «${article.title}» (${article.status})`);
  return Response.json({ article }, { status: 201 });
}
