import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { audit, nextSequence, readJson, requireAssociationContext } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

const INCOME_CATEGORIES = ["انخراطات", "تبرعات", "إعانات ومساعدات", "أنشطة وفعاليات", "أخرى"];
const EXPENSE_CATEGORIES = ["كراء وتحملات", "تجهيزات ومعدات", "أتعاب ومصاريف إدارية", "تواصل وتكوين", "أنشطة وفعاليات", "أخرى"];
const METHODS = ["CASH", "BANK_TRANSFER", "CHECK", "ONLINE"];

export const CATEGORY_LABELS: Record<string, string> = {
  CASH: "نقداً", BANK_TRANSFER: "تحويل بنكي", CHECK: "شيك", ONLINE: "إلكترونياً",
};

/** GET — لائحة العمليات المالية */
export async function GET(req: NextRequest) {
  const { ctx, error } = await requireAssociationContext(req);
  if (error || !ctx) return error!;

  const type = req.nextUrl.searchParams.get("type") ?? "all";
  const category = req.nextUrl.searchParams.get("category") ?? "all";
  const year = Number(req.nextUrl.searchParams.get("year") ?? new Date().getFullYear());
  const startOfYear = new Date(year, 0, 1);
  const endOfYear = new Date(year + 1, 0, 1);

  const transactions = await db.transaction.findMany({
    where: {
      associationId: ctx.associationId,
      date: { gte: startOfYear, lt: endOfYear },
      ...(type !== "all" ? { type } : {}),
      ...(category !== "all" ? { category } : {}),
    },
    include: { approvedBy: { select: { fullName: true } } },
    orderBy: { date: "desc" },
    take: 500,
  });

  return Response.json({
    transactions,
    categories: { INCOME_CATEGORIES, EXPENSE_CATEGORIES, METHODS, CATEGORY_LABELS },
  });
}

const createSchema = z.object({
  description: z.string().min(3, "الوصف مطلوب"),
  amount: z.number().positive("المبلغ يجب أن يكون أكبر من الصفر"),
  type: z.enum(["INCOME", "EXPENSE"]),
  category: z.string().min(2),
  paymentMethod: z.enum(["CASH", "BANK_TRANSFER", "CHECK", "ONLINE"] as never).default("CASH"),
  date: z.string().optional(),
  reference: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
});

/** POST — تسجيل عملية مالية (أمين المال أو الرئيس فقط) */
export async function POST(req: NextRequest) {
  const { ctx, error } = await requireAssociationContext(req);
  if (error || !ctx) return error!;
  if (!ctx.canFinance) {
    return Response.json({ error: "تسجيل العمليات المالية محجوز لأمين المال والرئيس" }, { status: 403 });
  }

  const body = await readJson<Record<string, unknown>>(req);
  const parsed = createSchema.safeParse({ ...body, amount: Number(body?.amount) });
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message ?? "معطيات غير صالحة" }, { status: 400 });
  }
  const d = parsed.data;

  const validCat =
    d.type === "INCOME" ? INCOME_CATEGORIES.includes(d.category) : EXPENSE_CATEGORIES.includes(d.category);
  if (!validCat) return Response.json({ error: "الفئة غير متوافقة مع نوع العملية" }, { status: 400 });

  const association = await db.association.findUnique({ where: { id: ctx.associationId } });
  const receiptNumber = await nextSequence(association?.acronym || "ASM", "transaction");

  const tx = await db.transaction.create({
    data: {
      description: d.description.trim(),
      amount: d.amount,
      type: d.type,
      category: d.category,
      paymentMethod: d.paymentMethod,
      date: d.date ? new Date(d.date) : new Date(),
      reference: d.reference || null,
      notes: d.notes || null,
      receiptNumber,
      associationId: ctx.associationId,
      approvedById: ctx.userId,
    },
  });

  await audit(ctx.userId, "CREATE", "Transaction", tx.id, `${d.type} ${d.amount} د.م — ${d.description}`);
  return Response.json({ transaction: tx }, { status: 201 });
}

/** DELETE — حذف عملية (مع تدقيق) */
export async function DELETE(req: NextRequest) {
  const { ctx, error } = await requireAssociationContext(req);
  if (error || !ctx) return error!;
  if (!ctx.canFinance) return Response.json({ error: "صلاحية مالية مطلوبة" }, { status: 403 });

  const id = req.nextUrl.searchParams.get("id") ?? "";
  const tx = await db.transaction.findFirst({ where: { id, associationId: ctx.associationId } });
  if (!tx) return Response.json({ error: "العملية غير موجودة" }, { status: 404 });

  await db.transaction.delete({ where: { id } });
  await audit(ctx.userId, "DELETE", "Transaction", id, `حذف ${tx.type} ${tx.amount} د.م — ${tx.description}`);
  return Response.json({ ok: true });
}
