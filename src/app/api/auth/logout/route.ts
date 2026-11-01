import { db } from "@/lib/db";
import { destroySession, getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST() {
  const session = await getSession();
  if (session) {
    await db.auditLog.create({
      data: { action: "LOGOUT", entity: "User", entityId: session.sub, details: "تسجيل خروج" },
    }).catch(() => null);
  }
  await destroySession();
  return Response.json({ ok: true });
}
