/**
 * scripts/test-rbac.ts — اختبار آلي شامل لمنظومة الصلاحيات (تدقيق الدورة 11)
 * ---------------------------------------------------------------------
 * يشغَّل ضد خادم حي: bun run dev (أو start) ثم:
 *   bun scripts/test-rbac.ts [http://localhost:3000]
 *
 * يغطي: الجلسات · العزل بين الجمعيات · الكتابة المالية (المحاسب للإطلاع) ·
 * حوكمة الرئاسة (منع الترقية الذاتية) · بوابة العضوية النشطة ·
 * قبول الانخراط بالرئاسة/التفويض · المراسلة المؤقتة · المقالات · التبرعات.
 *
 * ينشئ بيانات اختبارية بأسماء rbac-test-* ويمحوها في النهاية.
 */
import { PrismaClient } from "@prisma/client";
import { scryptSync, randomBytes } from "crypto";

const BASE = process.argv[2] ?? "http://localhost:3000";
const prisma = new PrismaClient();

let passed = 0;
let failed = 0;
const failures: string[] = [];

function check(name: string, cond: boolean, extra = "") {
  if (cond) {
    passed++;
    console.log(`  ✅ ${name}`);
  } else {
    failed++;
    failures.push(`${name} ${extra}`);
    console.log(`  ❌ ${name} ${extra}`);
  }
}

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}

/** جلسة بكوكيز */
async function login(email: string, password: string): Promise<string | null> {
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) return null;
  const setCookie = res.headers.getSetCookie?.() ?? [res.headers.get("set-cookie") ?? ""];
  const token = setCookie
    .map((c) => c.split(";")[0])
    .find((c) => c.startsWith("mamp_session="));
  return token ?? null;
}

async function api(
  cookie: string | null,
  path: string,
  method = "GET",
  body?: unknown
): Promise<{ status: number; data: any }> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(cookie ? { Cookie: cookie } : {}),
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  let data: any = null;
  try {
    data = await res.json();
  } catch {}
  return { status: res.status, data };
}

// بيانات الاختبار
const TS = Date.now().toString(36);
const emails = {
  owner: "tarikchouika@gmail.com",
  presA: `rbac-pres-a-${TS}@test.mamp`,
  secA: `rbac-sec-a-${TS}@test.mamp`,
  memberA: `rbac-member-a-${TS}@test.mamp`,
  pendingA: `rbac-pending-a-${TS}@test.mamp`,
  presB: `rbac-pres-b-${TS}@test.mamp`,
  memberB: `rbac-member-b-${TS}@test.mamp`,
  accountant: `rbac-acc-${TS}@test.mamp`,
  citizen: `rbac-citizen-${TS}@test.mamp`,
};
const PASS = "RbacTest#2026";

async function mkUser(email: string, role = "CITIZEN") {
  return prisma.user.create({
    data: { email, passwordHash: hashPassword(PASS), fullName: email.split("@")[0], role, isActive: true },
  });
}

async function cleanup() {
  const emailsList = Object.values(emails).filter((e) => e.endsWith("@test.mamp"));
  const users = await prisma.user.findMany({ where: { email: { in: emailsList } } });
  for (const u of users) {
    await prisma.articleLike.deleteMany({ where: { userId: u.id } }).catch(() => {});
    await prisma.articleComment.deleteMany({ where: { userId: u.id } }).catch(() => {});
  }
  await prisma.article.deleteMany({ where: { authorId: { in: users.map((u) => u.id) } } }).catch(() => {});
  const assocs = await prisma.association.findMany({ where: { slug: { startsWith: "rbac-test-" } } });
  for (const a of assocs) {
    await prisma.donation.deleteMany({ where: { associationId: a.id } }).catch(() => {});
    await prisma.transaction.deleteMany({ where: { associationId: a.id } }).catch(() => {});
  }
  await prisma.association.deleteMany({ where: { slug: { startsWith: "rbac-test-" } } }).catch(() => {});
  await prisma.user.deleteMany({ where: { email: { in: emailsList } } }).catch(() => {});
  await prisma.auditLog.deleteMany({ where: { details: { contains: "RBAC-TEST" } } }).catch(() => {});
}

async function main() {
  console.log(`\n🔐 اختبار منظومة الصلاحيات — ${BASE}\n`);
  await cleanup();

  // ===== 1) تجهيز البيانات =====
  console.log("① تجهيز بيانات الاختبار…");
  const [ownerRow] = await Promise.all([
    prisma.user.findUnique({ where: { email: emails.owner } }),
    mkUser(emails.presA), mkUser(emails.secA), mkUser(emails.memberA),
    mkUser(emails.pendingA), mkUser(emails.presB), mkUser(emails.memberB),
    mkUser(emails.accountant, "ACCOUNTANT"), mkUser(emails.citizen, "CITIZEN"),
  ]);
  if (!ownerRow) {
    console.log("❌ حساب المالك غير موجود — شغل bun run db:seed أولاً");
    process.exit(1);
  }
  const mkAssoc = async (slug: string, name: string, presId: string) =>
    prisma.association.create({
      data: {
        slug, name, description: "جمعية اختبار RBAC", category: "تنموية",
        city: "الرباط", region: "الرباط - سلا - القنيطرة", status: "ACTIVE",
        isVerified: true, createdBy: "RBAC-TEST",
      },
    });

  const assocA = await mkAssoc(`rbac-test-a-${TS}`, "جمعية اختبار أ", (await prisma.user.findUnique({ where: { email: emails.presA } }))!.id);
  const assocB = await mkAssoc(`rbac-test-b-${TS}`, "جمعية اختبار ب", (await prisma.user.findUnique({ where: { email: emails.presB } }))!.id);
  const uid = async (e: string) => (await prisma.user.findUnique({ where: { email: e } }))!.id;

  const mkMembership = (userId: string, associationId: string, role: string, status = "ACTIVE") =>
    prisma.membership.create({
      data: {
        userId, associationId, roleInAssociation: role, status,
        membershipNumber: `RBAC-${TS}-${Math.random().toString(36).slice(2, 8)}`,
        cndpConsent: true,
      },
    });

  await mkMembership(await uid(emails.presA), assocA.id, "PRESIDENT");
  await mkMembership(await uid(emails.secA), assocA.id, "SECRETARY");
  await mkMembership(await uid(emails.memberA), assocA.id, "MEMBER");
  const pendingMembership = await mkMembership(await uid(emails.pendingA), assocA.id, "MEMBER", "PENDING");
  await mkMembership(await uid(emails.presB), assocB.id, "PRESIDENT");
  await mkMembership(await uid(emails.memberB), assocB.id, "MEMBER");

  // ===== 2) الجلسات =====
  console.log("\n② الجلسات والولوج…");
  const cookie = async (e: string) => await login(e, PASS);
  const cOwner = await login(emails.owner, "Tch@10mn");
  const cPresA = await cookie(emails.presA);
  const cSecA = await cookie(emails.secA);
  const cMemberA = await cookie(emails.memberA);
  const cPending = await cookie(emails.pendingA);
  const cMemberB = await cookie(emails.memberB);
  const cAccountant = await cookie(emails.accountant);
  const cCitizen = await cookie(emails.citizen);
  check("ولوج المالك", !!cOwner);
  check("ولوج رئيس أ", !!cPresA);
  check("ولوج كاتب أ", !!cSecA);
  check("ولوج المحاسب", !!cAccountant);
  check("رفض كلمة سر خاطئة", (await login(emails.presA, "wrong-pass")) === null);

  // ===== 3) بدون جلسة =====
  console.log("\n③ الوصول دون جلسة…");
  for (const [path, method] of [
    ["/api/members?associationId=" + assocA.id, "GET"],
    ["/api/transactions?associationId=" + assocA.id, "GET"],
    ["/api/articles", "GET"],
    ["/api/messaging/contacts", "GET"],
    ["/api/donations?associationId=" + assocA.id, "GET"],
  ] as const) {
    const r = await api(null, path, method);
    check(`401 دون جلسة: ${path.split("?")[0]}`, r.status === 401, `(${r.status})`);
  }
  const rStream = await fetch(`${BASE}/api/messaging/stream`);
  check("401 لقناة SSE دون جلسة", rStream.status === 401, `(${rStream.status})`);
  await rStream.cancel?.().catch?.(() => {});

  // ===== 4) العزل بين الجمعيات =====
  console.log("\n④ العزل بين الجمعيات…");
  let r = await api(cMemberB, `/api/members?associationId=${assocA.id}`, "POST", {
    fullName: "متسلل مفترض", email: `rbac-intr-${TS}@test.mamp`, cndpConsent: true,
  });
  check("منخرط ب لا يضيف أعضاء في أ (403)", r.status === 403, `(${r.status})`);

  r = await api(cMemberB, `/api/events?associationId=${assocA.id}`, "POST", {
    title: "فعالية متسللة", startDate: new Date().toISOString(),
  });
  check("منخرط ب لا ينشئ فعاليات في أ (403)", r.status === 403, `(${r.status})`);

  r = await api(cMemberB, `/api/donations?associationId=${assocA.id}`, "POST", {
    donorName: "متبرع متسلل", amount: 100, type: "MONEY",
  });
  check("منخرط ب لا يسجل تبرعات في أ (403)", r.status === 403, `(${r.status})`);

  // ===== 5) المحاسب: إطلاع بلا كتابة (V1) =====
  console.log("\n⑤ محاسب المنصة — الإطلاع دون التنفيذ…");
  r = await api(cAccountant, `/api/transactions?associationId=${assocA.id}`, "GET");
  check("المحاسب يقرأ الدفتر (200)", r.status === 200, `(${r.status})`);
  r = await api(cAccountant, `/api/transactions?associationId=${assocA.id}`, "POST", {
    description: "قيد متسلل", amount: 500, type: "INCOME",
  });
  check("المحاسب لا يسجل قيوداً (403) — V1", r.status === 403, `(${r.status})`);

  // ===== 6) حوكمة الرئاسة (V2) =====
  console.log("\n⑥ حوكمة منصب الرئيس…");
  const secMembership = await prisma.membership.findFirst({
    where: { user: { email: emails.secA }, associationId: assocA.id },
  });
  const presMembership = await prisma.membership.findFirst({
    where: { user: { email: emails.presA }, associationId: assocA.id },
  });

  r = await api(cSecA, `/api/members?associationId=${assocA.id}`, "PATCH", {
    id: secMembership!.id, roleInAssociation: "PRESIDENT",
  });
  check("الكاتب لا يرقّي نفسه رئيساً (403) — V2", r.status === 403, `(${r.status})`);

  r = await api(cSecA, `/api/members?associationId=${assocA.id}`, "PATCH", {
    id: presMembership!.id, roleInAssociation: "MEMBER",
  });
  check("الكاتب لا يحيد الرئيس (403) — V2", r.status === 403, `(${r.status})`);

  r = await api(cSecA, `/api/members?associationId=${assocA.id}`, "PATCH", {
    id: (await prisma.membership.findFirst({ where: { user: { email: emails.memberA }, associationId: assocA.id } }))!.id,
    memberType: "HONORARY",
  });
  check("الكاتب يعدّل نوع عضوية منخرط عادي (200)", r.status === 200, `(${r.status})`);

  // ===== 7) بوابة العضوية النشطة (V3) =====
  console.log("\n⑦ العضوية المعلقة لا تقرأ بيانات الجمعية…");
  r = await api(cPending, `/api/members?associationId=${assocA.id}`, "GET");
  check("منخرط PENDING لا يقرأ اللائحة (403) — V3", r.status === 403, `(${r.status})`);
  r = await api(cPending, `/api/transactions?associationId=${assocA.id}`, "GET");
  check("منخرط PENDING لا يقرأ المحاسبة (403) — V3", r.status === 403, `(${r.status})`);
  r = await api(cPending, `/api/stats?associationId=${assocA.id}`, "GET");
  check("منخرط PENDING لا يقرأ الإحصائيات (403) — V3", r.status === 403, `(${r.status})`);

  // ===== 8) قبول الانخراط: الرئيس حصراً/التفويض =====
  console.log("\n⑧ قبول الانخراط بالرئاسة…");
  r = await api(cSecA, `/api/members?associationId=${assocA.id}`, "PATCH", {
    id: pendingMembership.id, status: "ACTIVE",
  });
  check("الكاتب لا يقبل الانخراط دون تفويض (403)", r.status === 403, `(${r.status})`);

  r = await api(cPresA, `/api/members?associationId=${assocA.id}`, "PATCH", {
    id: pendingMembership.id, status: "ACTIVE",
  });
  check("الرئيس يقبل الانخراط (200)", r.status === 200, `(${r.status})`);

  // بعد القبول: القراءة متاحة
  r = await api(cPending, `/api/members?associationId=${assocA.id}`, "GET");
  check("بعد القبول يقرأ اللائحة (200)", r.status === 200, `(${r.status})`);

  // التفويض: الرئيس يفوّض الكاتب ثم الكاتب يقبل
  r = await api(cPresA, `/api/associations`, "PATCH", {
    id: assocA.id, action: "delegate_approvals", delegateTo: await uid(emails.secA),
  });
  const assocAAfter = await prisma.association.findUnique({ where: { id: assocA.id } });
  check(
    "الرئيس يفوّض القبول للكاتب",
    r.status === 200 && assocAAfter?.approvalsDelegatedTo === (await uid(emails.secA)),
    `(${r.status})`
  );

  const pendingMembership2 = await mkMembership(await uid(emails.pendingA), assocA.id, "MEMBER", "PENDING");
  r = await api(cSecA, `/api/members?associationId=${assocA.id}`, "PATCH", {
    id: pendingMembership2.id, status: "ACTIVE",
  });
  check("المفوَّض يقبل الانخراط (200)", r.status === 200, `(${r.status})`);

  // ===== 9) المراسلة المؤقتة =====
  console.log("\n⑨ المراسلة الفورية المؤقتة…");
  const memberAId = await uid(emails.memberA);
  const memberBId = await uid(emails.memberB);
  r = await api(cCitizen, "/api/messaging/contacts", "GET");
  check("المواطن بلا انخراط لا يدخل دليل المراسلة (403)", r.status === 403, `(${r.status})`);

  r = await api(cMemberA, "/api/messaging/send", "POST", {
    to: memberBId, kind: "TEXT", content: "مرحباً — رسالة اختبار مؤقتة",
  });
  check("منخرط أ يراسل منخرط ب عبر الجمعيات (201)", r.status === 201, `(${r.status})`);
  const msgId = r.data?.id;

  r = await api(cMemberA, "/api/messaging/send", "POST", {
    to: memberBId, kind: "TEXT", content: "x".repeat(5000),
  });
  check("رفض رسالة تتجاوز حد الحجم (400)", r.status === 400, `(${r.status})`);

  r = await api(cMemberA, "/api/messaging/call", "POST", {
    to: memberBId, type: "OFFER", payload: { video: false },
  });
  check("مكالمة لمستقبِل غير متصل تُرفض (409)", r.status === 409, `(${r.status})`);

  // ACK من ب يستهلك الرسالة
  if (msgId) {
    r = await api(cMemberB, "/api/messaging/ack", "POST", { ids: [msgId] });
    check("تأكيد الاستلام يستهلك الرسالة (consumed=1)", r.data?.consumed === 1, JSON.stringify(r.data));
    // رسالة أخرى لب (معلقة) ثم ACK خاطئ من أ لا يستبدلها
    const r2 = await api(cMemberA, "/api/messaging/send", "POST", {
      to: memberBId, kind: "TEXT", content: "رسالة معلقة ثانية",
    });
    const msgId2 = r2.data?.id;
    const r3 = await api(cMemberA, "/api/messaging/ack", "POST", { ids: [msgId2] });
    check("لا يستهلك أحد رسائل غيره (consumed=0)", r3.data?.consumed === 0, JSON.stringify(r3.data));
    await api(cMemberB, "/api/messaging/ack", "POST", { ids: [msgId2] });
  }

  // ===== 10) المقالات =====
  console.log("\n⑩ المقالات وتبادل الخبرات…");
  r = await api(cCitizen, "/api/articles", "POST", {
    title: "محاولة مواطن", content: "x".repeat(60),
  });
  check("المواطن بلا انخراط لا ينشر (403)", r.status === 403, `(${r.status})`);

  r = await api(cMemberA, "/api/articles", "POST", {
    title: `خبرة اختبار ${TS}`,
    summary: "ملخص",
    content: "هذه خبرة اختبارية لتبادل المعرفة بين الجمعيات والمتطوعين ".repeat(3),
    category: "تنظيمية", status: "PUBLISHED",
  });
  check("منخرط ينشر مقالاً (201)", r.status === 201, `(${r.status})`);
  const articleId = r.data?.article?.id;

  if (articleId) {
    r = await api(cMemberB, `/api/articles/${articleId}/comments`, "POST", {
      body: "تعليق مفيد من جمعية أخرى",
    });
    check("منخرط ب يعقب على مقال منخرط أ (201)", r.status === 201, `(${r.status})`);
    r = await api(cMemberB, `/api/articles/${articleId}/like`, "POST");
    check("الإعجاب يعمل (liked=true)", r.data?.liked === true, JSON.stringify(r.data));
    r = await api(cMemberB, `/api/articles/${articleId}`, "DELETE");
    check("غير الكاتب لا يحذف المقال (403)", r.status === 403, `(${r.status})`);
    // مسودة غير منشورة لا تقرأ من الغير
    const rd = await api(cMemberA, "/api/articles", "POST", {
      title: `مسودة ${TS}`, content: "y".repeat(60), status: "DRAFT",
    });
    const draftId = rd.data?.article?.id;
    const rd2 = await api(cMemberB, `/api/articles/${draftId}`, "GET");
    check("مسودة الغير لا تُقرأ (403)", rd2.status === 403, `(${rd2.status})`);
  }

  // ===== 11) التبرعات =====
  console.log("\n⑪ التبرعات ونوع المتبرع…");
  r = await api(cMemberA, `/api/donations?associationId=${assocA.id}`, "POST", {
    donorName: "عضو عادي", amount: 50, type: "MONEY",
  });
  check("المنخرط العادي لا يسجل تبرعات (403)", r.status === 403, `(${r.status})`);

  r = await api(cSecA, `/api/donations?associationId=${assocA.id}`, "POST", {
    donorName: "جهة دون اسم", donorType: "ENTITY", amount: 500, type: "MONEY", entityName: "",
  });
  check("جهة داعمة بلا اسم مرفوضة (400)", r.status === 400, `(${r.status})`);

  r = await api(cSecA, `/api/donations/settings?associationId=${assocA.id}`, "PUT", {
    donationsEnabled: true, donationBankName: "القرض الشعبي",
    donationRib: "011 780 0000123456789012 34", acceptInKind: true,
  });
  check("المسيّر يفعّل معلومات الاستقبال (200)", r.status === 200, `(${r.status})`);

  r = await api(cMemberA, `/api/donations/settings?associationId=${assocA.id}`, "PUT", {
    donationsEnabled: false,
  });
  check("المنخرط العادي لا يعدّل الإعدادات (403)", r.status === 403, `(${r.status})`);

  // تبرع من منخرط
  r = await api(cSecA, `/api/donations?associationId=${assocA.id}`, "POST", {
    donorName: "منخرط أ", donorType: "MEMBER",
    membershipId: (await prisma.membership.findFirst({ where: { user: { email: emails.memberA }, associationId: assocA.id } }))!.id,
    amount: 200, type: "MONEY",
  });
  check("تبرع منخرط مرتبط بانخراطه (201)", r.status === 201 && r.data?.donation?.donorType === "MEMBER", `(${r.status})`);

  // ===== 12) لوحة الإدارة =====
  console.log("\n⑫ لوحة إدارة المنصة…");
  r = await api(cPresA, "/api/admin/users", "GET");
  check("رئيس جمعية لا يدخل لوحة الإدارة (403)", r.status === 403, `(${r.status})`);
  r = await api(cAccountant, "/api/admin/users", "GET");
  check("المحاسب لا يدخل لوحة الإدارة (403)", r.status === 403, `(${r.status})`);

  // ===== النتيجة =====
  console.log("\n" + "=".repeat(50));
  console.log(`النتيجة: ${passed} ناجح · ${failed} فاشل`);
  if (failures.length) {
    console.log("الإخفاقات:");
    failures.forEach((f) => console.log("  — " + f));
  }
  await cleanup();
  await prisma.$disconnect();
  process.exit(failed > 0 ? 1 : 0);
}

main().catch(async (e) => {
  console.error("💥 خطأ في الاختبار:", e);
  await cleanup().catch(() => {});
  await prisma.$disconnect();
  process.exit(1);
});
