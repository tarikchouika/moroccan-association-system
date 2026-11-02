/**
 * أدوات مشتركة لمسارات API — تحقق الجلسة، سياق الجمعية، سجل التدقيق
 */
import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import {
  getCurrentUser, canManageAssociation, canManageFinance, canApproveMembers,
  isPlatformStaff, forbidden, unauthorized,
} from "@/lib/auth";

export interface ApiCtx {
  userId: string;
  userRole: string;
  associationId: string;
  canManage: boolean;
  canFinance: boolean;
  canApprove: boolean;
  isPresident: boolean;
  approvalsDelegatedTo: string | null;
}

/** فحص الجلسة وسياق الجمعية */
export async function requireAssociationContext(
  req: NextRequest
): Promise<{ ctx?: ApiCtx; error?: Response }> {
  const user = await getCurrentUser();
  if (!user) return { error: unauthorized() };

  const associationId = req.nextUrl.searchParams.get("associationId") ?? "";
  if (!associationId) {
    return { error: Response.json({ error: "معرف الجمعية مطلوب" }, { status: 400 }) };
  }

  const association = await db.association.findUnique({ where: { id: associationId } });
  if (!association) {
    return { error: Response.json({ error: "الجمعية غير موجودة" }, { status: 404 }) };
  }

  const isSuper = user.role === "SUPER_ADMIN";
  const isPlatformAccountant = user.role === "ACCOUNTANT";
  // طاقم المنصة: الأدمين يديرون كل الجمعيات — والمحاسب يطلع عليها مالياً
  const canManage =
    isSuper ||
    user.role === "ASSOCIATION_ADMIN" ||
    canManageAssociation(user, associationId);
  const isStaff = isSuper || user.role === "ASSOCIATION_ADMIN" || isPlatformAccountant || user.role === "CO_ADMIN";
  if (!canManage) {
    if (isStaff) {
      // كوأدمين/محاسب المنصة: اطلاع دون تصريف إداري — يمرون دون عضوية
    } else {
      // العضو العادي يمكنه قراءة بعض المعطيات فقط حسب المسار
      const membership = user.memberships.find((m) => m.associationId === associationId);
      if (!membership && user.role !== "PARTNER") {
        return { error: forbidden("لا تنتمون إلى هذه الجمعية") };
      }
    }
  }

  return {
    ctx: {
      userId: user.id,
      userRole: user.role,
      associationId,
      canManage,
      canFinance: isSuper || isPlatformAccountant || canManageFinance(user, associationId),
      canApprove: canApproveMembers(user, association),
      isPresident:
        user.memberships.some(
          (m) => m.associationId === associationId && m.roleInAssociation === "PRESIDENT"
        ) || isSuper,
      approvalsDelegatedTo: association.approvalsDelegatedTo ?? null,
    },
  };
}

/** طلب سوبر أدمين فقط */
export async function requireSuperAdmin(): Promise<{ userId?: string; error?: Response }> {
  const user = await getCurrentUser();
  if (!user) return { error: unauthorized() };
  if (user.role !== "SUPER_ADMIN") return { error: forbidden("هذه المساحة مخصصة لمدير المنصة") };
  return { userId: user.id };
}

/** طلب طاقم المنصة (سوبر أدمين/أدمين/كوأدمين/محاسب) — للوحة الإدارة */
export async function requirePlatformStaff(): Promise<{
  user?: Awaited<ReturnType<typeof getCurrentUser>>;
  error?: Response;
}> {
  const user = await getCurrentUser();
  if (!user) return { error: unauthorized() };
  if (!isPlatformStaff(user.role)) {
    return { error: forbidden("هذه المساحة مخصصة لطاقم إدارة المنصة") };
  }
  return { user };
}

/** تسجيل حدث في سجل التدقيق */
export async function audit(
  userId: string | null,
  action: string,
  entity: string,
  entityId?: string,
  details?: string
) {
  try {
    await db.auditLog.create({
      data: { userId, action, entity, entityId, details: details?.slice(0, 300) },
    });
  } catch {
    /* سجل التدقيق ليس حرجاً */
  }
}

/** قراءة JSON من الطلب بأمان */
export async function readJson<T>(req: NextRequest): Promise<T | null> {
  try {
    return (await req.json()) as T;
  } catch {
    return null;
  }
}

/** توليد رقم تسلسلي بصيغة PREFIX-YYYY-NNN — آمن ضد التعارض العالمي
 *  (receiptNumber فريد عالمياً في المخطط، وتوليد سابق بالعدّ فقط كان يصطدم
 *   بين جمعيتين تحملان نفس الاختصار أو بعد حذف سجلات — الآن نفحص الوجود ونتقدم) */
export async function nextSequence(
  associationAcronym: string,
  table: "donation" | "transaction" | "fee"
): Promise<string> {
  const year = new Date().getFullYear();
  const prefixMap = { donation: "DON", transaction: "TX", fee: "FEE" } as const;
  const prefix = `${associationAcronym.replace(/\s/g, "")}-${prefixMap[table]}-${year}`;

  let count = 0;
  if (table === "donation") {
    count = await db.donation.count({ where: { receiptNumber: { startsWith: prefix } } });
  } else if (table === "transaction") {
    count = await db.transaction.count({ where: { receiptNumber: { startsWith: prefix } } });
  } else {
    count = await db.feePayment.count({ where: { receiptNumber: { startsWith: prefix } } });
  }

  // تقدّم آمن: نفحص كل مرشح ضد القاعدة قبل اعتماده (فريد عالمياً)
  for (let i = count + 1; i <= count + 100; i++) {
    const candidate = `${prefix}-${String(i).padStart(3, "0")}`;
    const exists =
      table === "fee"
        ? await db.feePayment.findUnique({ where: { receiptNumber: candidate } })
        : null;
    // donation/transaction: receiptNumber غير مفروض فريداً في المخطط — يكفي التقدم التسلسلي
    if (table === "fee" && exists) continue;
    return candidate;
  }
  // احتياط نهائي: لاحقة زمنية قصيرة تضمن التفرد في كل الأحوال
  return `${prefix}-${Date.now().toString(36).toUpperCase().slice(-6)}`;
}

/** توليد رقم انخراط فريد عالمياً بصيغة PREFIX-NNNN
 *  (membershipNumber @unique عالمياً في المخطط — كان يولَّد بعدّ الجمعية فقط
 *   فيصطدم بين جمعيتين بنفس الاختصار أو بعد الحذف؛ الآن نفحص ونتقدم بثبات) */
export async function nextMembershipNumber(associationId: string): Promise<string> {
  const association = await db.association.findUnique({ where: { id: associationId } });
  const prefix = (association?.acronym || association?.name || "ASM").replace(/\s/g, "").slice(0, 6);
  const count = await db.membership.count({ where: { associationId } });

  for (let i = count + 1; i <= count + 100; i++) {
    const candidate = `${prefix}-${String(i).padStart(4, "0")}`;
    const exists = await db.membership.findUnique({ where: { membershipNumber: candidate } });
    if (!exists) return candidate;
  }
  // احتياط نهائي: لاحقة زمنية قصيرة
  return `${prefix}-M${Date.now().toString(36).toUpperCase().slice(-6)}`;
}
