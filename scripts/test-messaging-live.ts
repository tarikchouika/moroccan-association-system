/**
 * scripts/test-messaging-live.ts — اختبار حي لقناة SSE الفورية
 * مستخدمان مؤقتان: أ يرسل ← ب يستلم لحظياً ← ب يستهلك (ACK) ← الذاكرة تفرغ.
 */
import { PrismaClient } from "@prisma/client";
import { scryptSync, randomBytes } from "crypto";

const BASE = process.argv[2] ?? "http://localhost:3000";
const prisma = new PrismaClient();
const TS = Date.now().toString(36);
const PASS = "SseTest#2026";

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}

async function main() {
  console.log(`\n📡 اختبار قناة SSE الحية — ${BASE}`);
  const u1 = await prisma.user.create({
    data: { email: `sse-a-${TS}@test.mamp`, passwordHash: hashPassword(PASS), fullName: "مرسل الاختبار", role: "CITIZEN", isActive: true },
  });
  const u2 = await prisma.user.create({
    data: { email: `sse-b-${TS}@test.mamp`, passwordHash: hashPassword(PASS), fullName: "مستقبل الاختبار", role: "CITIZEN", isActive: true },
  });
  const assoc = await prisma.association.create({
    data: { slug: `sse-test-${TS}`, name: "جمعية اختبار SSE", description: "وصف", category: "تنموية", city: "الرباط", region: "الرباط - سلا - القنيطرة", status: "ACTIVE", isVerified: true, createdBy: "SSE-TEST" },
  });
  await prisma.membership.create({ data: { userId: u1.id, associationId: assoc.id, roleInAssociation: "MEMBER", status: "ACTIVE", membershipNumber: `SSE1-${TS}`, cndpConsent: true } });
  await prisma.membership.create({ data: { userId: u2.id, associationId: assoc.id, roleInAssociation: "VOLUNTEER", status: "ACTIVE", membershipNumber: `SSE2-${TS}`, cndpConsent: true } });

  const login = async (email: string) => {
    const res = await fetch(`${BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: PASS }),
    });
    const cookies = res.headers.getSetCookie?.() ?? [];
    return cookies.map((c) => c.split(";")[0]).find((c) => c.startsWith("mamp_session="))!;
  };
  const c1 = await login(`sse-a-${TS}@test.mamp`);
  const c2 = await login(`sse-b-${TS}@test.mamp`);

  // فتح قناة SSE للمستقبل قبل الإرسال
  const controller = new AbortController();
  const events: string[] = [];
  const sse = fetch(`${BASE}/api/messaging/stream`, {
    headers: { Cookie: c2, Accept: "text/event-stream" },
    signal: controller.signal,
  });

  const readerPromise = (async () => {
    const res = await sse;
    if (!res.ok || !res.body) throw new Error(`SSE فشل: ${res.status}`);
    const reader = res.body.getReader();
    const dec = new TextDecoder();
    let buf = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      for (const chunk of buf.split("\n\n")) {
        const evLine = chunk.split("\n").find((l) => l.startsWith("event: "));
        const dataLine = chunk.split("\n").find((l) => l.startsWith("data: "));
        if (evLine && dataLine) events.push(`${evLine.slice(7)}|${dataLine.slice(6).slice(0, 80)}`);
      }
      buf = buf.slice(buf.lastIndexOf("\n\n") + 2);
      if (events.some((e) => e.startsWith("msg|"))) break;
    }
  })();

  // انتظار جاهزية القناة ثم الإرسال
  await new Promise((r) => setTimeout(r, 1200));
  const sendRes = await fetch(`${BASE}/api/messaging/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: c1 },
    body: JSON.stringify({ to: u2.id, kind: "TEXT", content: "رسالة لحظية عبر SSE 🚀" }),
  });
  const sent = await sendRes.json();
  console.log(sendRes.status === 201 ? "  ✅ أُرسلت الرسالة (201)" : `  ❌ فشل الإرسال (${sendRes.status})`);

  const timeout = new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), 8000));
  await Promise.race([readerPromise, timeout]).catch((e) => console.log(`  ⚠️ ${e.message}`));
  controller.abort();

  const gotMsg = events.find((e) => e.startsWith("msg|"));
  console.log(gotMsg ? `  ✅ وصلت لحظياً عبر SSE: ${gotMsg.slice(0, 70)}…` : "  ❌ لم تصل رسالة عبر SSE");
  const readyOk = events.some((e) => e.startsWith("ready|"));
  console.log(readyOk ? "  ✅ حدث ready عند الاتصال" : "  ❌ لا حدث ready");

  // ACK يستهلك
  const msgId = sent.id;
  const ackRes = await fetch(`${BASE}/api/messaging/ack`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: c2 },
    body: JSON.stringify({ ids: [msgId] }),
  });
  const ack = await ackRes.json();
  console.log(ack.consumed === 1 ? "  ✅ ACK استهلك الرسالة من الذاكرة" : `  ❌ ACK: ${JSON.stringify(ack)}`);

  // التنظيف
  await prisma.membership.deleteMany({ where: { associationId: assoc.id } });
  await prisma.association.delete({ where: { id: assoc.id } });
  await prisma.user.deleteMany({ where: { id: { in: [u1.id, u2.id] } } });
  console.log("  🧹 نُظفت بيانات الاختبار\n");
  await prisma.$disconnect();
  process.exit(gotMsg && ack.consumed === 1 && readyOk && sendRes.status === 201 ? 0 : 1);
}

main().catch(async (e) => {
  console.error("💥", e);
  await prisma.membership.deleteMany({ where: { membershipNumber: { startsWith: `SSE` } } }).catch(() => {});
  await prisma.association.deleteMany({ where: { slug: { startsWith: "sse-test-" } } }).catch(() => {});
  await prisma.user.deleteMany({ where: { email: { startsWith: "sse-" } } }).catch(() => {});
  await prisma.$disconnect();
  process.exit(1);
});
