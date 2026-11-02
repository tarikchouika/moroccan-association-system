import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { audit, readJson, nextMembershipNumber } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

/**
 * طلب الانخراط — أي مستخدم مسجل يمكنه طلب الانخراط في جمعية نشطة.
 * يُنشأ طلب بعضوية PENDING ينتظر قبول الرئيس (أو المسيّر المفوَّض)،
 * وفق القاعدة: «لرئيس الجمعية صلاحية قبول تسجيل منخرط جديد أو تفويضها».
 */
const joinSchema = z.object({
  associationId: z.string().min(1, "معرف الجمعية مطلوب"),
  motivation: z.string().max(500).optional().or(z.literal("")),
});

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "سجلوا الدخول أولاً لطلب الانخراط" }, { status: 401 });

  const body = await readJson<unknown>(req);
  const parsed = joinSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "معطيات غير صالحة" },
      { status: 400 }
    );
  }
  const { associationId, motivation } = parsed.data;

  const association = await db.association.findUnique({ where: { id: associationId } });
  if (!association) return Response.json({ error: "الجمعية غير موجودة" }, { status: 404 });
  if (association.status !== "ACTIVE") {
    return Response.json(
      { error: "هذه الجمعية غير نشطة حالياً على المنصة" },
      { status: 400 }
    );
  }

  const existing = await db.membership.findFirst({
    where: { userId: user.id, associationId },
  });
  if (existing) {
    if (existing.status === "PENDING") {
      return Response.json({ error: "طلب انخراطكم قيد الدراسة من طرف المكتب" }, { status: 409 });
    }
    return Response.json({ error: "أنتم منخرطون مسبقاً في هذه الجمعية" }, { status: 409 });
  }

  const membership = await db.membership.create({
    data: {
      userId: user.id,
      associationId,
      roleInAssociation: "MEMBER",
      memberType: "ACTIVE",
      membershipNumber: await nextMembershipNumber(associationId),
      status: "PENDING",
      cndpConsent: true,
      cndpConsentAt: new Date(),
      notes: motivation ? `دوافع الانخراط: ${motivation}`.slice(0, 500) : null,
    },
  });

  // إشعار الرئيس (أو المسيّر المفوَّض) بطلب الانخراط الجديد
  const approverId = association.approvalsDelegatedTo ?? null;
  let notifierUserId = approverId;
  if (!notifierUserId) {
    const president = await db.membership.findFirst({
      where: { associationId, roleInAssociation: "PRESIDENT", status: "ACTIVE" },
      select: { userId: true },
    });
    notifierUserId = president?.userId ?? null;
  }
  if (notifierUserId) {
    await db.notification.create({
      data: {
        title: "طلب انخراط جديد",
        body: `${user.fullName} يطلب الانخراط في ${association.name} — بانتظار قراركم.`,
        type: "INFO",
        userId: notifierUserId,
        associationId,
      },
    }).catch(() => null);
  }

  await audit(user.id, "CREATE", "Membership", membership.id, `طلب انخراط: ${association.name}`);

  return Response.json(
    { membership: { id: membership.id, status: membership.status }, association: { name: association.name } },
    { status: 201 }
  );
}
