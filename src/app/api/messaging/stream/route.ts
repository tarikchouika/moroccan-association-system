/**
 * GET /api/messaging/stream — قناة SSE حية للمراسلة الفورية
 * ---------------------------------------------------------------
 * • أحداث: ready (لقطات الاتصال) · msg (رسالة مؤقتة) · presence ·
 *   typing · signal (إشارات مكالمات WebRTC) · ping (نبضة إبقاء)
 * • الرسائل المسلَّمة تبقى في الذاكرة حتى ACK ثم تُمحى.
 * • لا كتابة في قاعدة البيانات إطلاقاً.
 */
import { NextRequest } from "next/server";
import { getCurrentUser, unauthorized } from "@/lib/auth";
import { registerClient, onlineSnapshot, hubStats } from "@/lib/messaging/hub";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  let unregister: (() => void) | null = null;
  let heartbeat: ReturnType<typeof setInterval> | null = null;

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const enc = new TextEncoder();
      let closed = false;

      const write = (event: string, data: unknown): boolean => {
        if (closed) return false;
        try {
          controller.enqueue(
            enc.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
          );
          return true;
        } catch {
          return false;
        }
      };

      // ① لقطة البداية: من المتصل الآن + إحصاءات عامة بلا محتوى
      write("ready", {
        userId: user.id,
        online: onlineSnapshot(),
        stats: hubStats(),
      });

      // ② تسجيل العميل وتدفق المعلَّق
      unregister = registerClient(user.id, write);

      // ③ نبضة كل 25 ثانية لإبقاء القناة حية
      heartbeat = setInterval(() => {
        write("ping", { ts: Date.now() });
      }, 25_000);

      const close = () => {
        if (closed) return;
        closed = true;
        if (heartbeat) clearInterval(heartbeat);
        unregister?.();
        try {
          controller.close();
        } catch {
          /* أُغلق مسبقاً */
        }
      };
      req.signal.addEventListener("abort", close);
    },
    cancel() {
      if (heartbeat) clearInterval(heartbeat);
      unregister?.();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-store, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
