/**
 * POST /api/messaging/call — ترحيل إشارات مكالمات WebRTC
 * ---------------------------------------------------------------
 * إشارات عابرة (OFFER/ANSWER/ICE/ACCEPT/DECLINE/END) عبر قناة SSE.
 * لا تسجيل في قاعدة البيانات ولا أثر بعد التسليم.
 * المكالمة نفسها مباشرة بين الطرفين (P2P) — الخادم يرحّل الإشارة فقط.
 */
import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser, unauthorized, forbidden } from "@/lib/auth";
import { isOnline, sendCallSignal, type CallSignalType } from "@/lib/messaging/hub";
import { isChatEligible } from "@/lib/messaging/eligibility";
import { readJson } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

const SIGNALS: CallSignalType[] = ["OFFER", "ANSWER", "ICE", "ACCEPT", "DECLINE", "END"];

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  if (!(await isChatEligible(user))) {
    return forbidden("المكالمات متاحة للمنخرطين النشيطين وطاقم المنصة");
  }

  const body = await readJson<{ to?: string; type?: string; payload?: unknown }>(req);
  const to = body?.to ?? "";
  const type = body?.type as CallSignalType;

  if (!to) return Response.json({ error: "المرسل إليه مطلوب" }, { status: 400 });
  if (to === user.id) return Response.json({ error: "طلب غير صالح" }, { status: 400 });
  if (!SIGNALS.includes(type)) {
    return Response.json({ error: "إشارة غير معروفة" }, { status: 400 });
  }

  const recipient = await db.user.findUnique({ where: { id: to } });
  if (!recipient || !recipient.isActive) {
    return Response.json({ error: "الطرف غير متوفر" }, { status: 404 });
  }

  // المكالمات تستلزم اتصالاً حياً — لا معنى لترحيل إشارة لمستقبِل غير متصل
  if (!isOnline(to)) {
    return Response.json({ error: "الطرف غير متصل حالياً", offline: true }, { status: 409 });
  }

  const ok = sendCallSignal(user.id, to, type, body?.payload ?? null);
  if (!ok) return Response.json({ error: "تعذر وصول الإشارة", offline: true }, { status: 409 });
  return Response.json({ ok: true });
}
