/**
 * اختبار مسار المشاركة: جلب مشاريع ميدو + قبول المشاركة + تحقق
 * التنفيذ: bun scripts/test-project-participation.ts
 */
const BASE = "http://localhost:3000";

async function login(email: string): Promise<string> {
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, password: "Mamp@2026" }),
  });
  if (!res.ok) throw new Error(`login ${email} → ${res.status}`);
  const cookie = res.headers.get("set-cookie")?.split(";")[0] ?? "";
  return cookie;
}

async function main() {
  // 1) دخول رئيسة ميدو
  const midoCookie = await login("user7@mamp.ma");
  const H = { cookie: midoCookie, "content-type": "application/json" };

  // 2) معرف جمعية ميدو من me
  const me = await (await fetch(`${BASE}/api/auth/me`, { headers: H })).json();
  const midoId = me.user?.memberships?.[0]?.associationId;
  console.log("✓ دخول ليلى (ميدو) — associationId:", midoId);

  // 3) مشاريع ميدو (قيادة أو مشاركة)
  const mine = await (await fetch(`${BASE}/api/projects?scope=mine&associationId=${midoId}`, { headers: H })).json();
  const tree = mine.projects?.find((p: any) => p.title.includes("التشجير الموحد"));
  if (!tree) throw new Error("مشروع التشجير غير موجود في مشاريع ميدو");
  const ourPart = tree.participants.find((x: any) => x.associationId === midoId);
  console.log("✓ المشروع موجود — مشاركة ميدو:", ourPart?.status);

  // 4) قبول المشاركة (الجهة المشاركة نفسها)
  const acc = await fetch(`${BASE}/api/projects`, {
    method: "PATCH",
    headers: H,
    body: JSON.stringify({ action: "participant-status", participantId: ourPart.id, status: "ACTIVE" }),
  });
  const accData = await acc.json();
  console.log(acc.ok ? `✓ القبول: ${accData.participant?.status}` : `❌ القبول فشل: ${acc.status} ${JSON.stringify(accData)}`);

  // 5) محاولة غير مصرح: منخرط في جمعية أخرى يحاول قبول مشاركة ميدو
  const otherCookie = await login("user4@mamp.ma"); // متطوع في ندوة
  const hack = await fetch(`${BASE}/api/projects`, {
    method: "PATCH",
    headers: { cookie: otherCookie, "content-type": "application/json" },
    body: JSON.stringify({ action: "participant-status", participantId: ourPart.id, status: "DECLINED" }),
  });
  console.log(hack.status === 403 ? "✓ منخرط ندوة مُنع من تغيير حالة ميدو (403)" : `⚠ سلوك غير متوقع: ${hack.status}`);

  // 6) تحقق نهائي من العموم
  const pub = await (await fetch(`${BASE}/api/projects?scope=public`)).json();
  const pubTree = pub.projects.find((p: any) => p.title.includes("التشجير"));
  const midoPart = pubTree.participants.find((x: any) => x.association?.slug?.includes("mido"));
  console.log("حالة ميدو في العموم:", midoPart?.status);
}

main().catch((e) => { console.error("❌", e); process.exit(1); });
