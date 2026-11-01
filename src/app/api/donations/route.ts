import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { audit, nextSequence, readJson, requireAssociationContext } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

/** GET — سجل التبرعات */
export async function GET(req: NextRequest) {
  const { ctx, error } = await requireAssociationContext(req);
  if (error || !ctx) return error!;

  const year = Number(req.nextUrl.searchParams.get("year") ?? new Date().getFullYear());
  const donations = await db.donation.findMany({
    where: {
      associationId: ctx.associationId,
      date: { gte: new Date(year, 0, 1), lt: new Date(year + 1, 0, 1) },
    },
    orderBy: { date: "desc" },
  });
  return Response.json({ donations });
}

const createSchema = z.object({
  donorName: z.string().min(3, "اسم المتبرع مطلوب"),
  donorEmail: z.string().email().optional().or(z.literal("")),
  donorPhone: z.string().optional().or(z.literal("")),
  isAnonymous: z.boolean().default(false),
  amount: z.number().min(0).default(0),
  type: z.enum(["MONEY", "IN_KIND"]),
  inKindDescription: z.string().optional().or(z.literal("")),
  message: z.string().optional().or(z.literal("")),
  foreignSource: z.boolean().default(false),
});

/** POST — تسجيل تبرع + توليد وصل رسمي */
export async function POST(req: NextRequest) {
  const { ctx, error } = await requireAssociationContext(req);
  if (error || !ctx) return error!;
  if (!ctx.canManage) return Response.json({ error: "صلاحية الإدارة مطلوبة" }, { status: 403 });

  const body = await readJson<Record<string, unknown>>(req);
  const parsed = createSchema.safeParse({
    ...body,
    amount: Number(body?.amount ?? 0),
    isAnonymous: Boolean(body?.isAnonymous),
    foreignSource: Boolean(body?.foreignSource),
  });
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message ?? "معطيات غير صالحة" }, { status: 400 });
  }
  const d = parsed.data;

  if (d.type === "MONEY" && d.amount <= 0) {
    return Response.json({ error: "مبلغ التبرع النقدي يجب أن يكون أكبر من الصفر" }, { status: 400 });
  }
  if (d.type === "IN_KIND" && !d.inKindDescription) {
    return Response.json({ error: "وصف التبرع العيني مطلوب" }, { status: 400 });
  }

  const association = await db.association.findUnique({ where: { id: ctx.associationId } });
  const receiptNumber = await nextSequence(association?.acronym || "ASM", "donation");

  const donation = await db.donation.create({
    data: {
      donorName: d.isAnonymous ? "متبرع مجهول" : d.donorName.trim(),
      donorEmail: d.donorEmail || null,
      donorPhone: d.donorPhone || null,
      isAnonymous: d.isAnonymous,
      amount: d.type === "MONEY" ? d.amount : 0,
      type: d.type,
      inKindDescription: d.inKindDescription || null,
      message: d.message || null,
      receiptNumber,
      receiptIssued: true,
      associationId: ctx.associationId,
    },
  });

  // تسجيل تلقائي في المحاسبة (فئة التبرعات)
  await db.transaction.create({
    data: {
      description:
        d.type === "MONEY"
          ? `تبرع نقدي — ${d.donorName}${d.isAnonymous ? " (مجهول)" : ""}`
          : `تبرع عيني — ${d.inKindDescription}`,
      type: "INCOME",
      category: "تبرعات",
      amount: d.type === "MONEY" ? d.amount : 0,
      paymentMethod: "CASH",
      receiptNumber: `${receiptNumber}-TX`,
      notes: d.foreignSource ? "⚠ مصدر أجنبي: التصريح لدى السلطة المختصة مطلوب وفق القانون" : null,
      associationId: ctx.associationId,
      approvedById: ctx.userId,
    },
  });

  await audit(ctx.userId, "CREATE", "Donation", donation.id, `تبرع ${d.type} ${d.amount} د.م من ${d.donorName}`);
  return Response.json({ donation }, { status: 201 });
}

/** DELETE — حذف تبرع */
export async function DELETE(req: NextRequest) {
  const { ctx, error } = await requireAssociationContext(req);
  if (error || !ctx) return error!;
  if (!ctx.canManage) return Response.json({ error: "صلاحية الإدارة مطلوبة" }, { status: 403 });

  const id = req.nextUrl.searchParams.get("id") ?? "";
  const donation = await db.donation.findFirst({ where: { id, associationId: ctx.associationId } });
  if (!donation) return Response.json({ error: "التبرع غير موجود" }, { status: 404 });

  await db.transaction.deleteMany({ where: { receiptNumber: `${donation.receiptNumber}-TX`, associationId: ctx.associationId } });
  await db.donation.delete({ where: { id } });
  await audit(ctx.userId, "DELETE", "Donation", id, `حذف تبرع ${donation.receiptNumber}`);
  return Response.json({ ok: true });
}
