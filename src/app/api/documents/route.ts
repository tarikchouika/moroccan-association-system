import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { audit, readJson, requireAssociationContext } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

const TYPES = ["STATUTES", "MINUTES", "ANNUAL_REPORT", "FINANCIAL_REPORT", "RECEIPT", "AGREEMENT", "OTHER"];

export const DOC_TYPE_LABELS: Record<string, string> = {
  STATUTES: "القانون الأساسي",
  MINUTES: "محضر",
  ANNUAL_REPORT: "تقرير سنوي",
  FINANCIAL_REPORT: "تقرير مالي",
  RECEIPT: "وصل",
  AGREEMENT: "اتفاقية شراكة",
  OTHER: "أخرى",
};

/** GET — وثائق الجمعية */
export async function GET(req: NextRequest) {
  const { ctx, error } = await requireAssociationContext(req);
  if (error || !ctx) return error!;

  const type = req.nextUrl.searchParams.get("type") ?? "all";
  const documents = await db.document.findMany({
    where: { associationId: ctx.associationId, ...(type !== "all" ? { type } : {}) },
    include: { uploadedBy: { select: { fullName: true } } },
    orderBy: { createdAt: "desc" },
  });
  return Response.json({ documents, types: TYPES, typeLabels: DOC_TYPE_LABELS });
}

const createSchema = z.object({
  title: z.string().min(4, "عنوان الوثيقة مطلوب"),
  type: z.string(),
  description: z.string().optional().or(z.literal("")),
  url: z.string().optional().or(z.literal("")),
  isPublic: z.boolean().default(false),
});

/** POST — إضافة وثيقة للأرشيف */
export async function POST(req: NextRequest) {
  const { ctx, error } = await requireAssociationContext(req);
  if (error || !ctx) return error!;
  if (!ctx.canManage) return Response.json({ error: "صلاحية الإدارة مطلوبة" }, { status: 403 });

  const body = await readJson<Record<string, unknown>>(req);
  const parsed = createSchema.safeParse({ ...body, isPublic: Boolean(body?.isPublic) });
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message ?? "معطيات غير صالحة" }, { status: 400 });
  }
  const d = parsed.data;
  if (!TYPES.includes(d.type)) return Response.json({ error: "نوع الوثيقة غير صالح" }, { status: 400 });

  const document = await db.document.create({
    data: {
      title: d.title.trim(),
      type: d.type,
      description: d.description || null,
      url: d.url || null,
      isPublic: d.isPublic,
      associationId: ctx.associationId,
      uploadedById: ctx.userId,
    },
  });

  await audit(ctx.userId, "CREATE", "Document", document.id, `وثيقة: ${d.title}`);
  return Response.json({ document }, { status: 201 });
}

/** DELETE — حذف وثيقة */
export async function DELETE(req: NextRequest) {
  const { ctx, error } = await requireAssociationContext(req);
  if (error || !ctx) return error!;
  if (!ctx.canManage) return Response.json({ error: "صلاحية الإدارة مطلوبة" }, { status: 403 });

  const id = req.nextUrl.searchParams.get("id") ?? "";
  const doc = await db.document.findFirst({ where: { id, associationId: ctx.associationId } });
  if (!doc) return Response.json({ error: "الوثيقة غير موجودة" }, { status: 404 });

  await db.document.delete({ where: { id } });
  await audit(ctx.userId, "DELETE", "Document", id, `حذف وثيقة: ${doc.title}`);
  return Response.json({ ok: true });
}
