/**
 * أدوات مشتركة لمسارات API — تحقق الجلسة، سياق الجمعية، سجل التدقيق
 */
import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser, canManageAssociation, canManageFinance, forbidden, unauthorized } from "@/lib/auth";

export interface ApiCtx {
  userId: string;
  userRole: string;
  associationId: string;
  canManage: boolean;
  canFinance: boolean;
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
  const canManage = isSuper || canManageAssociation(user, associationId);
  if (!canManage) {
    // العضو العادي يمكنه قراءة بعض المعطيات فقط حسب المسار
    const membership = user.memberships.find((m) => m.associationId === associationId);
    if (!membership && user.role !== "PARTNER") {
      return { error: forbidden("لا تنتمون إلى هذه الجمعية") };
    }
  }

  return {
    ctx: {
      userId: user.id,
      userRole: user.role,
      associationId,
      canManage,
      canFinance: isSuper || canManageFinance(user, associationId),
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

/** توليد رقم تسلسلي بصيغة PREFIX-YYYY-NNN */
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
  return `${prefix}-${String(count + 1).padStart(3, "0")}`;
}
