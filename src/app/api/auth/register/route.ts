import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { hashPassword, createSession, verifyPassword } from "@/lib/auth";

export const dynamic = "force-dynamic";

const schema = z.object({
  fullName: z.string().min(3, "الاسم الكامل مطلوب (3 أحرف على الأقل)").max(80),
  email: z.string().email("البريد الإلكتروني غير صالح"),
  password: z.string().min(8, "كلمة السر يجب أن تتضمن 8 أحرف على الأقل").max(72),
  phone: z.string().max(20).optional().or(z.literal("")),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { error: parsed.error.issues[0]?.message ?? "معطيات غير صالحة" },
        { status: 400 }
      );
    }
    const { fullName, email, password, phone } = parsed.data;
    const emailNorm = email.toLowerCase().trim();

    const exists = await db.user.findUnique({ where: { email: emailNorm } });
    if (exists) {
      return Response.json({ error: "هذا البريد الإلكتروني مسجل مسبقاً" }, { status: 409 });
    }

    // التحقق من كلمة السر: حرف + رقم على الأقل
    if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      return Response.json(
        { error: "كلمة السر يجب أن تتضمن حروفاً وأرقاماً" },
        { status: 400 }
      );
    }

    const user = await db.user.create({
      data: {
        fullName: fullName.trim(),
        email: emailNorm,
        passwordHash: hashPassword(password),
        phone: phone || null,
        role: "CITIZEN",
      },
      select: { id: true, email: true, fullName: true, role: true },
    });

    await createSession({ sub: user.id, email: user.email, role: "CITIZEN", name: user.fullName });

    await db.auditLog.create({
      data: { action: "CREATE", entity: "User", entityId: user.id, details: "تسجيل حساب جديد" },
    });

    return Response.json({ user }, { status: 201 });
  } catch (e) {
    console.error("register error:", e);
    return Response.json({ error: "تعذر إنشاء الحساب، حاولوا مجدداً" }, { status: 500 });
  }
}

/** PUT — تغيير كلمة السر للمستخدم الحالي */
export async function PUT(req: NextRequest) {
  try {
    const { getSession: _unused, ...auth } = await import("@/lib/auth");
    const session = await auth.getSession();
    if (!session) return Response.json({ error: "غير مصرح" }, { status: 401 });

    const body = await req.json();
    const oldPassword = String(body.oldPassword ?? "");
    const newPassword = String(body.newPassword ?? "");
    if (newPassword.length < 8 || !/[a-zA-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      return Response.json({ error: "كلمة السر الجديدة ضعيفة (8 أحرف + أرقام)" }, { status: 400 });
    }

    const user = await db.user.findUnique({ where: { id: session.sub } });
    if (!user || !verifyPassword(oldPassword, user.passwordHash)) {
      return Response.json({ error: "كلمة السر الحالية غير صحيحة" }, { status: 400 });
    }

    await db.user.update({
      where: { id: user.id },
      data: { passwordHash: hashPassword(newPassword) },
    });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "خطأ غير متوقع" }, { status: 500 });
  }
}
