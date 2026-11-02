import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { audit, readJson, requireAssociationContext, nextMembershipNumber, nextSequence } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

const ROLES = ["PRESIDENT", "VICE_PRESIDENT", "SECRETARY", "TREASURER", "BOARD_MEMBER", "CO_ADMIN", "MEMBER", "VOLUNTEER"];
const STATUSES = ["PENDING", "ACTIVE", "SUSPENDED", "RESIGNED"];
const TYPES = ["ACTIVE", "HONORARY", "BENEFACTOR", "STUDENT"];

/** GET — لائحة المنخرطين */
export async function GET(req: NextRequest) {
  const { ctx, error } = await requireAssociationContext(req);
  if (error || !ctx) return error!;

  const q = req.nextUrl.searchParams.get("q") ?? "";
  const status = req.nextUrl.searchParams.get("status") ?? "all";

  const members = await db.membership.findMany({
    where: {
      associationId: ctx.associationId,
      ...(status !== "all" ? { status } : {}),
      ...(q ? { user: { fullName: { contains: q } } } : {}),
    },
    include: {
      user: { select: { id: true, fullName: true, email: true, phone: true, lastLoginAt: true } },
      feePayments: { select: { year: true, paidAt: true, amount: true, receiptNumber: true } },
    },
    orderBy: { joinedAt: "desc" },
  });

  return Response.json({ members });
}

const createSchema = z.object({
  fullName: z.string().min(3, "الاسم الكامل مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صالح"),
  password: z.string().min(8, "كلمة السر (8 أحرف على الأقل)").optional(),
  phone: z.string().optional().or(z.literal("")),
  profession: z.string().optional().or(z.literal("")),
  roleInAssociation: z.enum(ROLES.slice(6) as never).default("MEMBER"),
  memberType: z.enum(["ACTIVE", "HONORARY", "BENEFACTOR", "STUDENT"] as never).default("ACTIVE"),
  cndpConsent: z.boolean(),
  initialFee: z.number().min(0).optional(),
});

/** POST — إضافة منخرط جديد (ينشئ حساباً إن لم يوجد) */
export async function POST(req: NextRequest) {
  const { ctx, error } = await requireAssociationContext(req);
  if (error || !ctx) return error!;
  if (!ctx.canManage) return Response.json({ error: "صلاحية الإدارة مطلوبة" }, { status: 403 });

  const body = await readJson<Record<string, unknown>>(req);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message ?? "معطيات غير صالحة" }, { status: 400 });
  }
  const d = parsed.data;
  const email = d.email.toLowerCase().trim();

  if (!d.cndpConsent) {
    return Response.json({ error: "موافقة المعالجة وفق القانون 09.08 إلزامية قبل تسجيل أي منخرط" }, { status: 400 });
  }

  let user = await db.user.findUnique({ where: { email } });
  if (!user) {
    user = await db.user.create({
      data: {
        email,
        fullName: d.fullName.trim(),
        phone: d.phone || null,
        passwordHash: hashPassword(d.password || "Mamp@2026"),
        role: "CITIZEN",
      },
    });
  }

  const existingMembership = await db.membership.findFirst({
    where: { userId: user.id, associationId: ctx.associationId },
  });
  if (existingMembership) {
    return Response.json({ error: "هذا الشخص منخرط مسبقاً في الجمعية" }, { status: 409 });
  }

  const association = await db.association.findUnique({ where: { id: ctx.associationId } });
  const prefix = (association?.acronym || association?.name || "ASM").replace(/\s/g, "").slice(0, 6);

  const membership = await db.membership.create({
    data: {
      userId: user.id,
      associationId: ctx.associationId,
      roleInAssociation: d.roleInAssociation,
      memberType: d.memberType,
      membershipNumber: await nextMembershipNumber(ctx.associationId),
      status: "ACTIVE",
      profession: d.profession || null,
      cndpConsent: true,
      cndpConsentAt: new Date(),
    },
  });

  // واجب انخراط أولي إن حُدد
  if (d.initialFee && d.initialFee > 0) {
    const year = new Date().getFullYear();
    await db.feePayment.create({
      data: {
        year,
        amount: d.initialFee,
        method: "CASH",
        receiptNumber: await nextSequence(association?.acronym || "ASM", "fee"),
        membershipId: membership.id,
        associationId: ctx.associationId,
      },
    });
    // تسجيل في المحاسبة
    await db.transaction.create({
      data: {
        description: `واجب انخراط ${user.fullName} — ${year}`,
        type: "INCOME",
        category: "انخراطات",
        amount: d.initialFee,
        paymentMethod: "CASH",
        receiptNumber: await nextSequence(association?.acronym || "ASM", "transaction"),
        associationId: ctx.associationId,
        approvedById: ctx.userId,
      },
    });
  }

  await audit(ctx.userId, "CREATE", "Membership", membership.id, `إضافة منخرط: ${d.fullName}`);
  return Response.json({ membership }, { status: 201 });
}

const patchSchema = z.object({
  id: z.string(),
  status: z.enum(STATUSES as never).optional(),
  roleInAssociation: z.enum(ROLES as never).optional(),
  memberType: z.enum(TYPES as never).optional(),
  feeYear: z.number().int().min(2015).max(2100).optional(),
  feeAmount: z.number().min(0).optional(),
});

/** PATCH — تحديث حالة/دور منخرط أو تسجيل واجب سنوي */
export async function PATCH(req: NextRequest) {
  const { ctx, error } = await requireAssociationContext(req);
  if (error || !ctx) return error!;
  if (!ctx.canManage) return Response.json({ error: "صلاحية الإدارة مطلوبة" }, { status: 403 });

  const body = await readJson<unknown>(req);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return Response.json({ error: "طلب غير صالح" }, { status: 400 });
  const { id, feeYear, feeAmount, ...updates } = parsed.data;

  const membership = await db.membership.findFirst({ where: { id, associationId: ctx.associationId } });
  if (!membership) return Response.json({ error: "المنخرط غير موجود" }, { status: 404 });

  if (feeYear && feeAmount !== undefined && feeAmount >= 0) {
    const existing = await db.feePayment.findUnique({
      where: { membershipId_year: { membershipId: id, year: feeYear } },
    });
    const association = await db.association.findUnique({ where: { id: ctx.associationId } });
    const prefix = (association?.acronym || "ASM").replace(/\s/g, "");
    if (existing) {
      await db.feePayment.update({ where: { id: existing.id }, data: { amount: feeAmount, paidAt: new Date() } });
    } else {
      const seq = await db.feePayment.count({ where: { associationId: ctx.associationId } });
      await db.feePayment.create({
        data: {
          year: feeYear,
          amount: feeAmount,
          receiptNumber: `${prefix}-FEE-${feeYear}-${String(seq + 1).padStart(3, "0")}`,
          membershipId: id,
          associationId: ctx.associationId,
        },
      });
      if (feeAmount > 0) {
        const user = await db.user.findUnique({ where: { id: membership.userId } });
        await db.transaction.create({
          data: {
            description: `واجب انخراط ${user?.fullName ?? ""} — ${feeYear}`,
            type: "INCOME",
            category: "انخراطات",
            amount: feeAmount,
            receiptNumber: `${prefix}-TX-${feeYear}-${String((await db.transaction.count({ where: { associationId: ctx.associationId } })) + 1).padStart(3, "0")}`,
            associationId: ctx.associationId,
            approvedById: ctx.userId,
          },
        });
      }
    }
  }

  if (Object.keys(updates).length > 0) {
    await db.membership.update({ where: { id }, data: updates });
  }

  await audit(ctx.userId, "UPDATE", "Membership", id, "تحديث بيانات منخرط");
  return Response.json({ ok: true });
}

/** DELETE — حذف عضوية */
export async function DELETE(req: NextRequest) {
  const { ctx, error } = await requireAssociationContext(req);
  if (error || !ctx) return error!;
  if (!ctx.canManage) return Response.json({ error: "صلاحية الإدارة مطلوبة" }, { status: 403 });

  const id = req.nextUrl.searchParams.get("id") ?? "";
  const membership = await db.membership.findFirst({ where: { id, associationId: ctx.associationId } });
  if (!membership) return Response.json({ error: "المنخرط غير موجود" }, { status: 404 });
  if (membership.roleInAssociation === "PRESIDENT") {
    return Response.json({ error: "لا يمكن حذف عضوية الرئيس — غيروا المكتب أولاً" }, { status: 400 });
  }

  await db.membership.delete({ where: { id } });
  await audit(ctx.userId, "DELETE", "Membership", id, "حذف عضوية");
  return Response.json({ ok: true });
}
