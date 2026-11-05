/**
 * POST /api/messaging/ack — تأكيد استلام الرسائل
 * الاستلام = استهلاك: تُمحى الرسائل من ذاكرة الخادم نهائياً.
 */
import { NextRequest } from "next/server";
import { getCurrentUser, unauthorized } from "@/lib/auth";
import { acknowledge } from "@/lib/messaging/hub";
import { readJson } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  const body = await readJson<{ ids?: string[] }>(req);
  const ids = Array.isArray(body?.ids) ? body!.ids!.filter((x) => typeof x === "string").slice(0, 200) : [];
  const consumed = acknowledge(user.id, ids);
  return Response.json({ ok: true, consumed });
}
