import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser, hashPassword, verifyPassword } from "@/lib/auth";
import { audit, readJson, requireSuperAdmin } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

/**
 * إدارة مستخدمي المنصة — سوبر أدمين حصراً
 * إنشاء أدمين/كوأدمين/محاسب للمساعدة على إدارة المنصة، وتفويض الصلاحيات
 * (تغيير الدور)، والتنشيط/التعطيل وإعادة تعيين كلمة السر.
 */

const ASSIGNABLE_ROLES = [
  "ASSOCIATION_ADMIN",
  "CO_ADMIN",
  "ACCOUNTANT",
  "PARTNER",
  "CITIZEN",
] as const;

/** GET — لائحة مستخدمي المنصة (بحث وتصفية حسب الدور) */
export async function GET(req: NextRequest) {
  const sa = await requireSuperAdmin();
  if (sa.error) return sa.error;

  const q = (req.nextUrl.searchParams.get("q") ?? "").trim();
  const role = req.nextUrl.searchParams.get("role") ?? "all";

  const users = await db.user.findMany({
    where: {
      ...(role !== "all" ? { role } : {}),
      ...(q
        ? {
            OR: [
              { fullName: { contains: q } },
              { email: { contains: q } },
              { phone: { contains: q } },
            ],
          }
        : {}),
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      role: true,
      isActive: true,
      lastLoginAt: true,
      createdAt: true,
      _count: { select: { memberships: true } },
    },
    orderBy: [{ role: "asc" }, { createdAt: "desc" }],
  });

  return Response.json({ users });
}

const createSchema = z.object({
  fullName: z.string().min(3, "الاسم الكامل مطلوب (3 أحرف على الأقل)").max(80),
  email: z.string().email("البريد الإلكتروني غير صالح"),
  password: z.string().min(8, "كلمة السر يجب أن تتضمن 8 أحرف على الأقل").max(72),
  phone: z.string().max(20).optional().or(z.literal("")),
  role: z.enum(ASSIGNABLE_ROLES),
});

/** POST — إنشاء مستخدم منصة بدور محدد (تفويض صلاحيات) */
export async function POST(req: NextRequest) {
  const sa = await requireSuperAdmin();
  if (sa.error) return sa.error;

  const body = await readJson<Record<string, unknown>>(req);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "معطيات غير صالحة" },
      { status: 400 }
    );
  }
  const d = parsed.data;
  const email = d.email.toLowerCase().trim();

  if (!/[a-zA-Z]/.test(d.password) || !/[0-9]/.test(d.password)) {
    return Response.json(
      { error: "كلمة السر يجب أن تتضمن حروفاً وأرقاماً" },
      { status: 400 }
    );
  }

  const exists = await db.user.findUnique({ where: { email } });
  if (exists) {
    return Response.json({ error: "هذا البريد الإلكتروني مسجل مسبقاً" }, { status: 409 });
  }

  const user = await db.user.create({
    data: {
      fullName: d.fullName.trim(),
      email,
      phone: d.phone || null,
      passwordHash: hashPassword(d.password),
      role: d.role,
    },
    select: { id: true, fullName: true, email: true, role: true },
  });

  await audit(sa.userId ?? null, "CREATE", "User", user.id, `إنشاء مستخدم منصة (${d.role}): ${d.fullName}`);

  return Response.json({ user }, { status: 201 });
}

const patchSchema = z.object({
  id: z.string().min(1),
  role: z.enum(ASSIGNABLE_ROLES).optional(),
  isActive: z.boolean().optional(),
  newPassword: z.string().min(8).max(72).optional(),
  currentPassword: z.string().optional(),
});

/** PATCH — تفويض/تغيير الدور، التنشيط/التعطيل، إعادة تعيين كلمة السر */
export async function PATCH(req: NextRequest) {
  const sa = await requireSuperAdmin();
  if (sa.error) return sa.error;

  const body = await readJson<Record<string, unknown>>(req);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "معطيات غير صالحة" },
      { status: 400 }
    );
  }
  const { id, role, isActive, newPassword, currentPassword } = parsed.data;

  const target = await db.user.findUnique({ where: { id } });
  if (!target) return Response.json({ error: "المستخدم غير موجود" }, { status: 404 });

  if (target.role === "SUPER_ADMIN") {
    return Response.json(
      { error: "لا يمكن تعديل حساب مالك المنصة من هنا" },
      { status: 400 }
    );
  }

  // إعادة تعيين كلمة السر تتطلب تأكيد كلمة سر المالك (حماية إضافية)
  if (newPassword) {
    if (!/[a-zA-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      return Response.json(
        { error: "كلمة السر الجديدة يجب أن تتضمن حروفاً وأرقاماً" },
        { status: 400 }
      );
    }
    const me = await getCurrentUser();
    if (!me || !currentPassword || !verifyPassword(currentPassword, me.passwordHash)) {
      return Response.json(
        { error: "أكدوا كلمة سركم الحالية لإعادة تعيين كلمة سر المستخدم" },
        { status: 403 }
      );
    }
  }

  const updates: Record<string, unknown> = {};
  if (role) updates.role = role;
  if (typeof isActive === "boolean") updates.isActive = isActive;
  if (newPassword) updates.passwordHash = hashPassword(newPassword);

  if (Object.keys(updates).length === 0) {
    return Response.json({ error: "لا تغييرات مطلوبة" }, { status: 400 });
  }

  const updated = await db.user.update({
    where: { id },
    data: updates,
    select: { id: true, fullName: true, email: true, role: true, isActive: true },
  });

  const changes = [
    role && `الدور → ${role}`,
    typeof isActive === "boolean" && (isActive ? "تنشيط" : "تعطيل"),
    newPassword && "إعادة تعيين كلمة السر",
  ]
    .filter(Boolean)
    .join(" · ");
  await audit(sa.userId ?? null, "UPDATE", "User", id, `${target.fullName}: ${changes}`);

  return Response.json({ user: updated });
}
