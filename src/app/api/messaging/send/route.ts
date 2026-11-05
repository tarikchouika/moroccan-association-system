/**
 * POST /api/messaging/send — إرسال رسالة مؤقتة (نص/صوت/صورة/ملف)
 * ---------------------------------------------------------------
 * • الرسالة تُسلَّم عبر قناة SSE وتُحفظ في RAM حتى ACK — لا قاعدة بيانات.
 * • حدود: نص 4000 حرف · وسائط ≈2 ميغابايت · 40 رسالة/دقيقة.
 */
import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser, unauthorized, forbidden } from "@/lib/auth";
import { LIMITS, allowSend, sendMessage, sendTyping, type MessageKind } from "@/lib/messaging/hub";
import { isChatEligible } from "@/lib/messaging/eligibility";
import { readJson } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

const KINDS: MessageKind[] = ["TEXT", "VOICE", "IMAGE", "FILE"];

interface SendBody {
  to?: string;
  kind?: string;
  content?: string;
  fileName?: string;
  duration?: number;
  typing?: boolean;
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  const body = await readJson<SendBody>(req);
  if (!body) return Response.json({ error: "معطيات غير صالحة" }, { status: 400 });

  // مؤشر الكتابة (عابر — لا يخزَّن)
  if (body.typing) {
    if (!body.to) return Response.json({ error: "المرسل إليه مطلوب" }, { status: 400 });
    sendTyping(user.id, body.to);
    return Response.json({ ok: true });
  }

  const to = body.to ?? "";
  const kind = (body.kind ?? "") as MessageKind;
  const content = body.content ?? "";

  if (!to) return Response.json({ error: "المرسل إليه مطلوب" }, { status: 400 });
  if (to === user.id) return Response.json({ error: "لا يمكن مراسلة النفس" }, { status: 400 });
  if (!KINDS.includes(kind)) return Response.json({ error: "نوع رسالة غير معروف" }, { status: 400 });

  // أهلية المرسل والمستقبِل (تصنيف فقط — دون لمس محتوى الرسائل)
  if (!(await isChatEligible(user))) {
    return forbidden("المراسلة متاحة للمنخرطين النشيطين وطاقم المنصة");
  }
  const recipient = await db.user.findUnique({ where: { id: to } });
  if (!recipient || !recipient.isActive) {
    return Response.json({ error: "المستقبِل غير متوفر" }, { status: 404 });
  }
  if (!(await isChatEligible(recipient))) {
    return Response.json({ error: "المستقبِل غير مؤهل لاستقبال الرسائل" }, { status: 403 });
  }

  // حدود الحجم والمحتوى
  if (kind === "TEXT") {
    const text = content.trim();
    if (!text) return Response.json({ error: "الرسالة فارغة" }, { status: 400 });
    if (text.length > LIMITS.textLen) {
      return Response.json({ error: `الرسالة النصية لا تتجاوز ${LIMITS.textLen} حرف` }, { status: 400 });
    }
  } else {
    if (!content.startsWith("data:")) {
      return Response.json({ error: "محتوى الوسائط غير صالح" }, { status: 400 });
    }
    if (content.length > LIMITS.contentLen) {
      return Response.json({ error: "حجم الملف يتجاوز الحد المسموح (2 ميغابايت)" }, { status: 413 });
    }
    if (kind === "VOICE" && !content.startsWith("data:audio/")) {
      return Response.json({ error: "تسجيل صوتي غير صالح" }, { status: 400 });
    }
    if (kind === "IMAGE" && !content.startsWith("data:image/")) {
      return Response.json({ error: "صورة غير صالحة" }, { status: 400 });
    }
    if (kind === "FILE" && content.length > LIMITS.contentLen) {
      return Response.json({ error: "حجم الملف يتجاوز الحد المسموح" }, { status: 413 });
    }
  }

  if (!allowSend(user.id)) {
    return Response.json({ error: "تم تجاوز حد الإرسال، تفضلوا بالانتظار قليلاً" }, { status: 429 });
  }

  const msg = sendMessage({
    from: user.id,
    to,
    kind,
    content,
    fileName: body.fileName?.slice(0, 120),
    duration:
      typeof body.duration === "number" && body.duration > 0
        ? Math.min(Math.round(body.duration), 600)
        : undefined,
  });

  return Response.json({ id: msg.id, ts: msg.ts }, { status: 201 });
}
