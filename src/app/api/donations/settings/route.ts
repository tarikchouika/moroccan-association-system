/**
 * /api/donations/settings — معلومات استقبال التبرعات والمساهمات
 * GET : قراءة الإعدادات (كل المنخرطين في الجمعية)
 * PUT : تحديث الإعدادات (صلاحية إدارية)
 * تُعرض هذه المعلومات في الصفحة العمومية للجمعية عند التفعيل.
 */
import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { audit, readJson, requireAssociationContext } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

/** GET — الإعدادات الحالية */
export async function GET(req: NextRequest) {
  const { ctx, error } = await requireAssociationContext(req);
  if (error || !ctx) return error!;

  const a = await db.association.findUnique({
    where: { id: ctx.associationId },
    select: {
      donationsEnabled: true,
      donationBankName: true,
      donationRib: true,
      donationCcp: true,
      donationOnlineUrl: true,
      donationInstructions: true,
      acceptInKind: true,
      inKindNeeds: true,
    },
  });
  if (!a) return Response.json({ error: "الجمعية غير موجودة" }, { status: 404 });
  return Response.json({ settings: a });
}

const putSchema = z.object({
  donationsEnabled: z.boolean(),
  donationBankName: z.string().max(120).optional().or(z.literal("")),
  donationRib: z.string().max(34).optional().or(z.literal("")),
  donationCcp: z.string().max(20).optional().or(z.literal("")),
  donationOnlineUrl: z.string().url("رابط الدفع غير صالح").optional().or(z.literal("")),
  donationInstructions: z.string().max(1000).optional().or(z.literal("")),
  acceptInKind: z.boolean().default(true),
  inKindNeeds: z.string().max(600).optional().or(z.literal("")),
});

/** PUT — تحديث الإعدادات */
export async function PUT(req: NextRequest) {
  const { ctx, error } = await requireAssociationContext(req);
  if (error || !ctx) return error!;
  if (!ctx.canManage) return Response.json({ error: "صلاحية الإدارة مطلوبة" }, { status: 403 });

  const body = await readJson<Record<string, unknown>>(req);
  const parsed = putSchema.safeParse({
    ...body,
    donationsEnabled: Boolean(body?.donationsEnabled),
    acceptInKind: body?.acceptInKind === undefined ? true : Boolean(body?.acceptInKind),
  });
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message ?? "معطيات غير صالحة" }, { status: 400 });
  }
  const s = parsed.data;

  const association = await db.association.update({
    where: { id: ctx.associationId },
    data: {
      donationsEnabled: s.donationsEnabled,
      donationBankName: s.donationBankName || null,
      donationRib: s.donationRib || null,
      donationCcp: s.donationCcp || null,
      donationOnlineUrl: s.donationOnlineUrl || null,
      donationInstructions: s.donationInstructions || null,
      acceptInKind: s.acceptInKind,
      inKindNeeds: s.inKindNeeds || null,
    },
  });

  await audit(
    ctx.userId,
    "UPDATE",
    "Association",
    ctx.associationId,
    `تحديث معلومات استقبال التبرعات (${s.donationsEnabled ? "مفعّلة" : "معطلة"})`
  );
  return Response.json({
    settings: {
      donationsEnabled: association.donationsEnabled,
      donationBankName: association.donationBankName,
      donationRib: association.donationRib,
      donationCcp: association.donationCcp,
      donationOnlineUrl: association.donationOnlineUrl,
      donationInstructions: association.donationInstructions,
      acceptInKind: association.acceptInKind,
      inKindNeeds: association.inKindNeeds,
    },
  });
}
