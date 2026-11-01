import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { audit, readJson, requireAssociationContext } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

const CATEGORIES = ["ثقافية", "تكوينية", "تحسيسية", "خيرية", "اجتماعية", "رياضية", "بيئية", "أخرى"];

/** GET — فعاليات الجمعية (+ عمومية قادمة) */
export async function GET(req: NextRequest) {
  const scope = req.nextUrl.searchParams.get("scope") ?? "association";

  if (scope === "public") {
    const events = await db.event.findMany({
      where: { isPublic: true, status: "PUBLISHED", startDate: { gte: new Date() } },
      include: { association: { select: { name: true, slug: true, isVerified: true } }, _count: { select: { registrations: true } } },
      orderBy: { startDate: "asc" },
      take: 12,
    });
    return Response.json({ events });
  }

  const { ctx, error } = await requireAssociationContext(req);
  if (error || !ctx) return error!;

  const events = await db.event.findMany({
    where: { associationId: ctx.associationId },
    include: { _count: { select: { registrations: true } } },
    orderBy: { startDate: "desc" },
  });
  return Response.json({ events, categories: CATEGORIES });
}

const createSchema = z.object({
  title: z.string().min(4, "العنوان مطلوب"),
  description: z.string().optional().or(z.literal("")),
  category: z.string().default("ثقافية"),
  startDate: z.string(),
  endDate: z.string().optional().or(z.literal("")),
  location: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  maxParticipants: z.number().int().min(1).max(10000).optional(),
  isPublic: z.boolean().default(true),
});

/** POST — إنشاء فعالية (إدارة/كوأدمين) */
export async function POST(req: NextRequest) {
  const { ctx, error } = await requireAssociationContext(req);
  if (error || !ctx) return error!;
  if (!ctx.canManage) return Response.json({ error: "صلاحية الإدارة أو الكوأدمين مطلوبة" }, { status: 403 });

  const body = await readJson<Record<string, unknown>>(req);
  const parsed = createSchema.safeParse({
    ...body,
    maxParticipants: body?.maxParticipants ? Number(body.maxParticipants) : undefined,
    isPublic: Boolean(body?.isPublic ?? true),
  });
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message ?? "معطيات غير صالحة" }, { status: 400 });
  }
  const d = parsed.data;
  if (isNaN(new Date(d.startDate).getTime())) {
    return Response.json({ error: "تاريخ البداية غير صالح" }, { status: 400 });
  }

  const event = await db.event.create({
    data: {
      title: d.title.trim(),
      description: d.description || null,
      category: d.category,
      startDate: new Date(d.startDate),
      endDate: d.endDate ? new Date(d.endDate) : null,
      location: d.location || null,
      city: d.city || null,
      maxParticipants: d.maxParticipants ?? null,
      isPublic: d.isPublic,
      status: "PUBLISHED",
      associationId: ctx.associationId,
      createdById: ctx.userId,
    },
  });

  await audit(ctx.userId, "CREATE", "Event", event.id, `فعالية: ${d.title}`);
  return Response.json({ event }, { status: 201 });
}

/** PATCH — تحديث حالة فعالية أو تسجيل مشارك */
export async function PATCH(req: NextRequest) {
  const body = await readJson<{
    action?: string; id?: string; status?: string; fullName?: string; email?: string; phone?: string;
  }>(req);

  // تسجيل عمومي في فعالية (بدون صلاحيات)
  if (body?.action === "register") {
    if (!body.id || !body.fullName) {
      return Response.json({ error: "المعرف والاسم الكامل مطلوبان" }, { status: 400 });
    }
    const event = await db.event.findUnique({
      where: { id: body.id },
      include: { _count: { select: { registrations: true } } },
    });
    if (!event || !event.isPublic || event.status !== "PUBLISHED") {
      return Response.json({ error: "الفعالية غير متاحة للتسجيل العمومي" }, { status: 404 });
    }
    if (event.maxParticipants && event._count.registrations >= event.maxParticipants) {
      return Response.json({ error: "اكتمل عدد المقاعد" }, { status: 409 });
    }
    const email = (body.email || "").toLowerCase().trim();
    if (!email) return Response.json({ error: "البريد الإلكتروني مطلوب للتسجيل" }, { status: 400 });

    const exists = await db.eventRegistration.findUnique({
      where: { eventId_email: { eventId: event.id, email } },
    });
    if (exists) return Response.json({ error: "سُجلتم مسبقاً في هذه الفعالية" }, { status: 409 });

    const user = await getCurrentUser();
    await db.eventRegistration.create({
      data: {
        eventId: event.id,
        fullName: body.fullName.trim(),
        email,
        phone: body.phone || null,
        userId: user?.id ?? null,
      },
    });
    return Response.json({ ok: true }, { status: 201 });
  }

  // تغيير حالة فعالية (إدارة)
  const { ctx, error } = await requireAssociationContext(req);
  if (error || !ctx) return error!;
  if (!ctx.canManage) return Response.json({ error: "صلاحية الإدارة مطلوبة" }, { status: 403 });

  const id = body?.id ?? "";
  const status = body?.status ?? "";
  if (!["DRAFT", "PUBLISHED", "CANCELLED", "COMPLETED"].includes(status)) {
    return Response.json({ error: "حالة غير صالحة" }, { status: 400 });
  }
  const event = await db.event.findFirst({ where: { id, associationId: ctx.associationId } });
  if (!event) return Response.json({ error: "الفعالية غير موجودة" }, { status: 404 });

  await db.event.update({ where: { id }, data: { status } });
  await audit(ctx.userId, "UPDATE", "Event", id, `الحالة → ${status}`);
  return Response.json({ ok: true });
}

/** DELETE — حذف فعالية */
export async function DELETE(req: NextRequest) {
  const { ctx, error } = await requireAssociationContext(req);
  if (error || !ctx) return error!;
  if (!ctx.canManage) return Response.json({ error: "صلاحية الإدارة مطلوبة" }, { status: 403 });

  const id = req.nextUrl.searchParams.get("id") ?? "";
  const event = await db.event.findFirst({ where: { id, associationId: ctx.associationId } });
  if (!event) return Response.json({ error: "الفعالية غير موجودة" }, { status: 404 });

  await db.event.delete({ where: { id } });
  await audit(ctx.userId, "DELETE", "Event", id, `حذف فعالية: ${event.title}`);
  return Response.json({ ok: true });
}
