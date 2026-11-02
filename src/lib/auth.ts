/**
 * نظام المصادقة والأدوار — منصة MAMP
 * JWT موقّع (jose) داخل كوكي httpOnly + تشفير كلمات السر عبر scrypt (node:crypto)
 */
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { scryptSync, randomBytes, timingSafeEqual } from "crypto";
import { db } from "@/lib/db";

const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "mamp-dev-secret-change-me-in-production-2026"
);
export const SESSION_COOKIE = "mamp_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // أسبوع

// ---------------------------------------------------------------
// الأدوار على مستوى المنصة
// ---------------------------------------------------------------
export type PlatformRole =
  | "SUPER_ADMIN" // مالك المنصة
  | "ASSOCIATION_ADMIN" // أدمين (أعضاء مكتب الجمعية أو أدمين منصة معرّف من المالك)
  | "CO_ADMIN" // كوأدمين (منخرطون ومتطوعون بصلاحيات)
  | "ACCOUNTANT" // محاسب المنصة — إشراف مالي على الجمعيات
  | "PARTNER" // جهات حكومية وخاصة مختصة
  | "CITIZEN"; // المواطنون والأجانب

/** طاقم المنصة — يعيّنهم السوبر أدمين للمساعدة على الإدارة */
export const PLATFORM_STAFF_ROLES = [
  "SUPER_ADMIN",
  "ASSOCIATION_ADMIN",
  "CO_ADMIN",
  "ACCOUNTANT",
] as const;

export function isPlatformStaff(role: string | undefined | null): boolean {
  return !!role && (PLATFORM_STAFF_ROLES as readonly string[]).includes(role);
}

/** من يملك إجراءات الإشراف على الجمعيات (توثيق/تنشيط/تعليق) */
export function canModerateAssociations(role: string | undefined | null): boolean {
  return role === "SUPER_ADMIN" || role === "ASSOCIATION_ADMIN";
}

export const ROLE_LABELS: Record<PlatformRole, string> = {
  SUPER_ADMIN: "المدير العام للمنصة",
  ASSOCIATION_ADMIN: "أدمين",
  CO_ADMIN: "كوأدمين",
  ACCOUNTANT: "محاسب المنصة",
  PARTNER: "جهة شريكة",
  CITIZEN: "مواطن",
};

export const ROLE_DESCRIPTIONS: Record<PlatformRole, string> = {
  SUPER_ADMIN:
    "مالك المنصة: إدارة الجمعيات والمستخدمين والصلاحيات، التوثيق، الإشراف العام وسجل التدقيق.",
  ASSOCIATION_ADMIN:
    "أدمين منصة يعيّنه المالك: إشراف على الجمعيات (توثيق وتنشيط وتعليق) — في حين تأتي سلطات أعضاء مكاتب الجمعيات من عضوياتهم داخل جمعياتهم.",
  CO_ADMIN:
    "الكوأدمين: صلاحيات محدودة يمنحها المالك أو المكتب (الفعاليات، التواصل، الاطلاع).",
  ACCOUNTANT:
    "محاسب المنصة: اطلاع مالي موثق على محاسبة الجمعيات (المداخيل، المصاريف، التقارير).",
  PARTNER: "الجهات الحكومية والخاصة المختصة: اطلاع موثق على المعطيات المصرح بها.",
  CITIZEN: "المواطنون والأجانب: التصفح، التبرع، التسجيل في الفعاليات العامة.",
};

export const IN_ASSOCIATION_ROLES = [
  "PRESIDENT",
  "VICE_PRESIDENT",
  "SECRETARY",
  "TREASURER",
  "BOARD_MEMBER",
  "CO_ADMIN",
  "MEMBER",
  "VOLUNTEER",
] as const;

export const ASSOCIATION_ROLE_LABELS: Record<string, string> = {
  PRESIDENT: "الرئيس/ة",
  VICE_PRESIDENT: "نائب/ة الرئيس",
  SECRETARY: "الكاتب/ة العام",
  TREASURER: "أمين/ة المال",
  BOARD_MEMBER: "عضو مجلس",
  CO_ADMIN: "كوأدمين",
  MEMBER: "منخرط/ة",
  VOLUNTEER: "متطوع/ة",
};

// ---------------------------------------------------------------
// كلمات السر
// ---------------------------------------------------------------
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  return candidate.length === expected.length && timingSafeEqual(candidate, expected);
}

// ---------------------------------------------------------------
// الجلسة
// ---------------------------------------------------------------
export interface SessionPayload {
  sub: string; // معرف المستخدم
  email: string;
  role: PlatformRole;
  name: string;
}

export async function createSession(payload: SessionPayload) {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(SECRET);

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return {
      sub: payload.sub as string,
      email: payload.email as string,
      role: payload.role as PlatformRole,
      name: payload.name as string,
    };
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------
// الاستعلام عن المستخدم الكامل + صلاحياته
// ---------------------------------------------------------------
export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;
  const user = await db.user.findUnique({
    where: { id: session.sub },
    include: {
      memberships: {
        include: { association: { select: { id: true, name: true, slug: true, status: true, isVerified: true } } },
      },
    },
  });
  if (!user || !user.isActive) return null;
  return user;
}

/** العضوية النشطة الأولى للمستخدم داخل جمعية معينة */
export function membershipIn(
  user: Awaited<ReturnType<typeof getCurrentUser>>,
  associationId: string
) {
  if (!user) return null;
  return (
    user.memberships.find(
      (m) => m.associationId === associationId && m.status === "ACTIVE"
    ) ?? null
  );
}

/** هل يملك المستخدم صلاحيات إدارية داخل جمعية؟
 *  (طاقم المنصة من الأدمين يديرون كل الجمعيات لمساعدة المالك) */
export function canManageAssociation(
  user: Awaited<ReturnType<typeof getCurrentUser>>,
  associationId: string
): boolean {
  if (user?.role === "SUPER_ADMIN" || user?.role === "ASSOCIATION_ADMIN") return true;
  const m = membershipIn(user, associationId);
  if (!m) return false;
  return ["PRESIDENT", "VICE_PRESIDENT", "SECRETARY", "TREASURER", "CO_ADMIN"].includes(
    m.roleInAssociation
  );
}

/** هل يملك صلاحيات مالية (أمين مال/رئيس/سوبر أدمين/محاسب المنصة)؟ */
export function canManageFinance(
  user: Awaited<ReturnType<typeof getCurrentUser>>,
  associationId: string
): boolean {
  if (user?.role === "SUPER_ADMIN" || user?.role === "ACCOUNTANT") return true;
  const m = membershipIn(user, associationId);
  if (!m) return false;
  return ["PRESIDENT", "TREASURER"].includes(m.roleInAssociation);
}

/** من يملك قبول طلبات الانخراط الجديدة في جمعية؟
 *  القاعدة (طلب المالك): الرئيس حصراً — أو من يفوّضه من المسيّرين،
 *  مع السوبر أدمين وأدمين المنصة للإشراف الاستثنائي. */
export function canApproveMembers(
  user: Awaited<ReturnType<typeof getCurrentUser>>,
  association: { id: string; approvalsDelegatedTo?: string | null }
): boolean {
  if (!user) return false;
  if (user.role === "SUPER_ADMIN" || user.role === "ASSOCIATION_ADMIN") return true;
  const m = membershipIn(user, association.id);
  if (!m) return false;
  if (m.roleInAssociation === "PRESIDENT") return true;
  return !!association.approvalsDelegatedTo && association.approvalsDelegatedTo === user.id;
}

export function unauthorized(message = "غير مصرح لك بالوصول") {
  return Response.json({ error: message }, { status: 401 });
}

export function forbidden(message = "لا تتوفرون على الصلاحيات الكافية") {
  return Response.json({ error: message }, { status: 403 });
}
