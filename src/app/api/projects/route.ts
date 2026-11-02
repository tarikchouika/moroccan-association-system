import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser, canManageAssociation } from "@/lib/auth";
import { audit, readJson, requireAssociationContext } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

const KINDS = ["EVENT", "PROGRAM", "PROJECT"] as const;
const PARTNER_TYPES = ["GOVERNMENT", "PRIVATE", "NGO", "INTERNATIONAL"] as const;
const PARTNER_ROLES = ["COORDINATION", "FUNDING", "EXECUTION", "SUPPORT"] as const;
const STATUSES = ["DRAFT", "PUBLISHED", "IN_PROGRESS", "COMPLETED", "CANCELLED"] as const;

const PARTICIPANT_INCLUDE = {
  participants: {
    include: {
      association: { select: { id: true, name: true, slug: true, acronym: true, isVerified: true } },
    },
    orderBy: { joinedAt: "asc" as const },
  },
  leadAssociation: { select: { id: true, name: true, slug: true, acronym: true, isVerified: true } },
};

/** GET — المشاريع المشتركة
 *  ?scope=public                     → المشاريع المنشورة العمومية (بلا مصادقة)
 *  ?scope=mine&associationId=…       → مشاريع الجمعية (قيادة أو مشاركة)
 */
export async function GET(req: NextRequest) {
  const scope = req.nextUrl.searchParams.get("scope") ?? "public";

  if (scope === "public") {
    const projects = await db.collaborativeProject.findMany({
      where: { isPublic: true, status: { in: ["PUBLISHED", "IN_PROGRESS"] } },
      include: PARTICIPANT_INCLUDE,
      orderBy: [{ startDate: "asc" }, { createdAt: "desc" }],
      take: 60,
    });
    return Response.json({ projects });
  }

  if (scope === "mine") {
    const { ctx, error } = await requireAssociationContext(req);
    if (error || !ctx) return error!;
    const projects = await db.collaborativeProject.findMany({
      where: {
        OR: [
          { leadAssociationId: ctx.associationId },
          { participants: { some: { associationId: ctx.associationId } } },
        ],
      },
      include: PARTICIPANT_INCLUDE,
      orderBy: { createdAt: "desc" },
    });
    return Response.json({ projects, kinds: KINDS });
  }

  return Response.json({ error: "نطاق غير معروف" }, { status: 400 });
}

const participantSchema = z.object({
  associationId: z.string().optional(),
  partnerName: z.string().min(2, "اسم الجهة مطلوب").max(120).optional(),
  partnerType: z.enum(PARTNER_TYPES).default("GOVERNMENT"),
  partnerRole: z.enum(PARTNER_ROLES).default("EXECUTION"),
});

const createSchema = z.object({
  title: z.string().min(4, "العنوان مطلوب (4 أحرف على الأقل)"),
  description: z.string().optional().or(z.literal("")),
  objectives: z.string().optional().or(z.literal("")),
  kind: z.enum(KINDS).default("PROJECT"),
  category: z.string().min(2).default("تنموية"),
  startDate: z.string().optional().or(z.literal("")),
  endDate: z.string().optional().or(z.literal("")),
  location: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  isPublic: z.boolean().default(true),
  status: z.enum(STATUSES).default("PUBLISHED"),
  participants: z.array(participantSchema).max(12, "12 جهة كحد أقصى").default([]),
});

/** POST — إنشاء مشروع/برنامج/فعالية مشتركة (قيادة الجمعية أو سوبر أدمين) */
export async function POST(req: NextRequest) {
  const { ctx, error } = await requireAssociationContext(req);
  if (error || !ctx) return error!;
  if (!ctx.canManage) {
    return Response.json({ error: "صلاحية الإدارة مطلوبة لإنشاء عمل مشترك" }, { status: 403 });
  }

  const body = await readJson<Record<string, unknown>>(req);
  const parsed = createSchema.safeParse({
    ...body,
    isPublic: Boolean(body?.isPublic ?? true),
    participants: Array.isArray(body?.participants) ? body.participants : [],
  });
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message ?? "معطيات غير صالحة" }, { status: 400 });
  }
  const d = parsed.data;

  if (d.startDate && isNaN(new Date(d.startDate).getTime())) {
    return Response.json({ error: "تاريخ البداية غير صالح" }, { status: 400 });
  }
  if (d.endDate && isNaN(new Date(d.endDate).getTime())) {
    return Response.json({ error: "تاريخ النهاية غير صالح" }, { status: 400 });
  }

  // التحقق من الجهات المشاركة (جمعيات موجودة أو أسماء خارجية صريحة)
  const seenAssocs = new Set<string>();
  const external: { partnerName: string; partnerType: string; partnerRole: string; status: string }[] = [];
  const assocIds: string[] = [];
  for (const p of d.participants) {
    if (p.associationId) {
      if (p.associationId === ctx.associationId) continue; // القائد ليس مشاركاً
      const assoc = await db.association.findUnique({ where: { id: p.associationId } });
      if (!assoc) return Response.json({ error: "جمعية مشاركة غير موجودة" }, { status: 400 });
      if (seenAssocs.has(p.associationId)) continue;
      seenAssocs.add(p.associationId);
      assocIds.push(p.associationId);
    } else if (p.partnerName) {
      external.push({
        partnerName: p.partnerName.trim(),
        partnerType: p.partnerType,
        partnerRole: p.partnerRole,
        status: "PENDING",
      });
    }
  }

  const project = await db.collaborativeProject.create({
    data: {
      title: d.title.trim(),
      description: d.description || null,
      objectives: d.objectives || null,
      kind: d.kind,
      category: d.category,
      startDate: d.startDate ? new Date(d.startDate) : null,
      endDate: d.endDate ? new Date(d.endDate) : null,
      location: d.location || null,
      city: d.city || null,
      isPublic: d.isPublic,
      status: d.status,
      leadAssociationId: ctx.associationId,
      createdById: ctx.userId,
      participants: {
        create: [
          ...assocIds.map((associationId) => ({
            associationId,
            status: "PENDING" as const,
            partnerRole: "EXECUTION",
          })),
          ...external,
        ],
      },
    },
    include: PARTICIPANT_INCLUDE,
  });

  await audit(ctx.userId, "CREATE", "CollaborativeProject", project.id, `${d.kind}: ${d.title}`);
  return Response.json({ project }, { status: 201 });
}

const patchSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("status"),
    id: z.string(),
    status: z.enum(STATUSES),
  }),
  z.object({
    action: z.literal("participant-status"),
    participantId: z.string(),
    status: z.enum(["PENDING", "ACTIVE", "DECLINED"]),
  }),
  z.object({
    action: z.literal("participant-role"),
    participantId: z.string(),
    partnerRole: z.enum(PARTNER_ROLES),
  }),
]);

/** التحقق من صلاحية إدارة مشروع (قيادة الجمعية أو سوبر أدمين) */
async function canManageProject(projectId: string) {
  const user = await getCurrentUser();
  if (!user) return { error: Response.json({ error: "سجلوا الدخول أولاً" }, { status: 401 }) };
  const project = await db.collaborativeProject.findUnique({
    where: { id: projectId },
    select: { leadAssociationId: true },
  });
  if (!project) return { error: Response.json({ error: "المشروع غير موجود" }, { status: 404 }) };
  const isSuper = user.role === "SUPER_ADMIN";
  if (!isSuper && !canManageAssociation(user, project.leadAssociationId)) {
    return { error: Response.json({ error: "صلاحية إدارة المشروع مطلوبة" }, { status: 403 }) };
  }
  return { userId: user.id };
}

/** PATCH — تحديث حالة المشروع أو مشارك (قيادة المشروع) */
export async function PATCH(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "سجلوا الدخول أولاً" }, { status: 401 });

  const body = await readJson<Record<string, unknown>>(req);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return Response.json({ error: "طلب غير صالح" }, { status: 400 });
  const p = parsed.data;

  if (p.action === "status") {
    const chk = await canManageProject(p.id);
    if (chk.error) return chk.error;
    const project = await db.collaborativeProject.update({
      where: { id: p.id },
      data: { status: p.status },
      include: PARTICIPANT_INCLUDE,
    });
    await audit(chk.userId, "UPDATE", "CollaborativeProject", p.id, `الحالة → ${p.status}`);
    return Response.json({ project });
  }

  const participant = await db.projectParticipant.findUnique({
    where: { id: p.participantId },
    include: { project: { select: { id: true } } },
  });
  if (!participant) return Response.json({ error: "المشارك غير موجود" }, { status: 404 });

  // الجهة المشاركة نفسها يمكنها قبول أو رفض مشاركتها (دون تغيير دورها)
  if (p.action === "participant-status") {
    const isSelf =
      !!participant.associationId &&
      user.memberships.some(
        (m) => m.associationId === participant.associationId && m.status === "ACTIVE" &&
          ["PRESIDENT", "VICE_PRESIDENT", "SECRETARY", "CO_ADMIN"].includes(m.roleInAssociation)
      );
    const chk = await canManageProject(participant.project.id);
    if (!isSelf && chk.error) return chk.error;
    const updated = await db.projectParticipant.update({
      where: { id: p.participantId },
      data: { status: p.status },
    });
    await audit(user.id, "UPDATE", "ProjectParticipant", p.participantId, `حالة المشاركة → ${p.status}`);
    return Response.json({ participant: updated });
  }

  // تغيير دور الجهة: قيادة المشروع فقط
  const chk = await canManageProject(participant.project.id);
  if (chk.error) return chk.error;
  const updated = await db.projectParticipant.update({
    where: { id: p.participantId },
    data: { partnerRole: p.partnerRole },
  });
  await audit(user.id, "UPDATE", "ProjectParticipant", p.participantId, `الدور → ${p.partnerRole}`);
  return Response.json({ participant: updated });
}

/** إضافة مشارك إلى مشروع قائم (قيادة المشروع) */
export async function PUT(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "سجلوا الدخول أولاً" }, { status: 401 });

  const body = await readJson<Record<string, unknown>>(req);
  const parsed = z
    .object({ projectId: z.string(), participant: participantSchema })
    .safeParse(body);
  if (!parsed.success) return Response.json({ error: "طلب غير صالح" }, { status: 400 });
  const { projectId, participant } = parsed.data;

  const chk = await canManageProject(projectId);
  if (chk.error) return chk.error;

  const project = await db.collaborativeProject.findUnique({
    where: { id: projectId },
    include: { participants: true },
  });
  if (!project) return Response.json({ error: "المشروع غير موجود" }, { status: 404 });

  if (participant.associationId) {
    if (participant.associationId === project.leadAssociationId) {
      return Response.json({ error: "الجمعية القائدة مشاركة بطبيعة الحال" }, { status: 400 });
    }
    if (project.participants.some((x) => x.associationId === participant.associationId)) {
      return Response.json({ error: "هذه الجمعية مشاركة أصلاً" }, { status: 400 });
    }
    const created = await db.projectParticipant.create({
      data: { projectId, associationId: participant.associationId, status: "PENDING", partnerRole: participant.partnerRole },
    });
    await audit(user.id, "CREATE", "ProjectParticipant", created.id, "إضافة جمعية مشاركة");
    return Response.json({ participant: created }, { status: 201 });
  }

  if (!participant.partnerName) {
    return Response.json({ error: "اسم الجهة أو الجمعية مطلوب" }, { status: 400 });
  }
  const created = await db.projectParticipant.create({
    data: {
      projectId,
      partnerName: participant.partnerName.trim(),
      partnerType: participant.partnerType,
      partnerRole: participant.partnerRole,
      status: "PENDING",
    },
  });
  await audit(user.id, "CREATE", "ProjectParticipant", created.id, `إضافة جهة: ${participant.partnerName}`);
  return Response.json({ participant: created }, { status: 201 });
}

/** DELETE — حذف مشروع (قيادة المشروع) أو فك مشاركة جهة */
export async function DELETE(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "سجلوا الدخول أولاً" }, { status: 401 });

  const id = req.nextUrl.searchParams.get("id");
  const participantId = req.nextUrl.searchParams.get("participantId");

  if (participantId) {
    const participant = await db.projectParticipant.findUnique({
      where: { id: participantId },
      include: { project: { select: { id: true } } },
    });
    if (!participant) return Response.json({ error: "المشارك غير موجود" }, { status: 404 });
    const chk = await canManageProject(participant.project.id);
    if (chk.error) return chk.error;
    await db.projectParticipant.delete({ where: { id: participantId } });
    await audit(user.id, "DELETE", "ProjectParticipant", participantId);
    return Response.json({ ok: true });
  }

  if (!id) return Response.json({ error: "معرف المشروع مطلوب" }, { status: 400 });
  const chk = await canManageProject(id);
  if (chk.error) return chk.error;
  await db.collaborativeProject.delete({ where: { id } });
  await audit(user.id, "DELETE", "CollaborativeProject", id);
  return Response.json({ ok: true });
}
