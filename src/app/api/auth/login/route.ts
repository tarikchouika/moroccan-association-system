import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { verifyPassword, createSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

const schema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالح"),
  password: z.string().min(1, "كلمة السر مطلوبة"),
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
    const email = parsed.data.email.toLowerCase().trim();

    const user = await db.user.findUnique({ where: { email } });
    if (!user || !verifyPassword(parsed.data.password, user.passwordHash)) {
      return Response.json({ error: "البريد الإلكتروني أو كلمة السر غير صحيحة" }, { status: 401 });
    }
    if (!user.isActive) {
      return Response.json({ error: "الحساب معطل — تواصلوا مع إدارة المنصة" }, { status: 403 });
    }

    await db.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    await createSession({ sub: user.id, email: user.email, role: user.role as never, name: user.fullName });

    await db.auditLog.create({
      data: { action: "LOGIN", entity: "User", entityId: user.id, details: "تسجيل دخول ناجح" },
    });

    return Response.json({
      user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role },
    });
  } catch (e) {
    console.error("login error:", e);
    return Response.json({ error: "تعذر تسجيل الدخول، حاولوا مجدداً" }, { status: 500 });
  }
}
