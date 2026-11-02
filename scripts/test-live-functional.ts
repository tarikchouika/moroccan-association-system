/**
 * scripts/test-live-functional.ts — تجارب حية شاملة ببيانات تجريبية
 * تُنفَّذ ضد النسخة الكاملة (API + لوحة التحكم + SQLite) العاملة محلياً.
 *
 * تغطي: تسجيل الدخول لكل الأدوار، إنشاء حساب، تأسيس جمعية، إضافة منخرط،
 * إنشاء فعالية، عملية مالية، تبرع، وثيقة، المساعد، الإحصائيات، الخروج.
 *
 * الاستعمال: bun scripts/test-live-functional.ts [BASE_URL]
 *
 * المتطلب: بذرة التطوير التجريبية أولاً — bun run db:seed:demo
 * (الحسابات التجريبية موجودة في بيئة التطوير فقط، ليس في الإنتاج.)
 */
const BASE = process.argv[2] ?? "http://localhost:3100";

let passed = 0;
let failed = 0;
const failures: string[] = [];

function ok(name: string, cond: boolean, extra = "") {
  if (cond) {
    passed++;
    console.log(`  ✅ ${name}${extra ? ` — ${extra}` : ""}`);
  } else {
    failed++;
    failures.push(name + (extra ? ` (${extra})` : ""));
    console.log(`  ❌ ${name}${extra ? ` — ${extra}` : ""}`);
  }
}

/** عميل يحمل الكوكيز */
function makeClient() {
  let cookie = "";
  return {
    async req(method: string, path: string, body?: unknown, headers: Record<string, string> = {}) {
      const res = await fetch(BASE + path, {
        method,
        headers: {
          ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
          ...(cookie ? { cookie } : {}),
          ...headers,
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
        redirect: "manual",
      });
      const setCookie = res.headers.getSetCookie?.() ?? [];
      if (setCookie.length) cookie = setCookie.map((c) => c.split(";")[0]).join("; ");
      let json: unknown = null;
      try {
        json = await res.json();
      } catch {
        /* ليست JSON */
      }
      return { status: res.status, json: json as Record<string, unknown> | null, headers: res.headers, setCookie };
    },
    get cookie() {
      return cookie;
    },
  };
}

const ts = Date.now().toString(36);

async function main() {
  console.log(`\n██ تجارب حية وظيفية ضد ${BASE}\n`);

  // ============ 1) تسجيل الدخول بكل الأدوار ============
  console.log("── [1] تسجيل الدخول بكل الأدوار التجريبية");
  const accounts: Array<[string, string, string]> = [
    ["admin@mamp.ma", "Mamp@2026", "SUPER_ADMIN"],
    ["user1@mamp.ma", "Mamp@2026", "ASSOCIATION_ADMIN"],
    ["user5@mamp.ma", "Mamp@2026", "ASSOCIATION_ADMIN"],
    ["partenaire@mamp.ma", "Mamp@2026", "PARTNER"],
    ["citoyen@mamp.ma", "Mamp@2026", "CITIZEN"],
  ];
  const sessions: Record<string, { status: number; json: any; client: ReturnType<typeof makeClient> }> = {};
  for (const [email, pass, role] of accounts) {
    const c = makeClient();
    const r = await c.req("POST", "/api/auth/login", { email, password: pass });
    sessions[role] = { status: r.status, json: r.json, client: c };
    ok(
      `دخول ${role} (${email})`,
      r.status === 200 && r.json?.user?.role === role,
      `status=${r.status}`
    );
  }

  // كلمة سر خاطئة
  const bad = makeClient();
  const badR = await bad.req("POST", "/api/auth/login", { email: "admin@mamp.ma", password: "WrongPass123" });
  ok("رفض كلمة السر الخاطئة (401)", badR.status === 401, `status=${badR.status}`);

  // ============ 2) جلستي /api/auth/me ============
  console.log("\n── [2] التحقق من الجلسة (me)");
  const meAdmin = await sessions.SUPER_ADMIN.client.req("GET", "/api/auth/me");
  ok(
    "me يعيد هوية السوبرأدمين",
    meAdmin.status === 200 && meAdmin.json?.user?.email === "admin@mamp.ma",
    `status=${meAdmin.status}`
  );
  const anon = makeClient();
  const meAnon = await anon.req("GET", "/api/auth/me");
  ok("me بدون جلسة يعيد user=null (بالتصميم)", meAnon.status === 200 && meAnon.json?.user === null, `status=${meAnon.status}`);

  // ============ 3) تسجيل مواطن جديد ============
  console.log("\n── [3] تسجيل حساب مواطن جديد");
  const reg = makeClient();
  const newEmail = `test-citizen-${ts}@mamp.ma`;
  const regR = await reg.req("POST", "/api/auth/register", {
    fullName: "مواطن تجريبي للاختبار",
    email: newEmail,
    password: "Test@2026pass",
    phone: "+212600000011",
    nationality: "marocaine",
    nationalId: `X${ts.slice(-6)}`,
    cndpConsent: true,
  });
  ok(
    "تسجيل مواطن جديد (201)",
    regR.status === 201 || regR.status === 200,
    `status=${regR.status} ${regR.json?.error ?? ""}`
  );
  const dupR = await reg.req("POST", "/api/auth/register", {
    fullName: "مكرر تجريبي",
    email: newEmail,
    password: "Test@2026pass",
    cndpConsent: true,
  });
  ok("رفض البريد المكرر (409/400)", dupR.status === 409 || dupR.status === 400, `status=${dupR.status}`);
  const weakR = await reg.req("POST", "/api/auth/register", {
    fullName: "ضعيف تجريبي",
    email: `weak-${ts}@mamp.ma`,
    password: "123",
    cndpConsent: true,
  });
  ok("رفض كلمة السر الضعيفة (400)", weakR.status === 400, `status=${weakR.status}`);

  // ============ 4) تأسيس جمعية جديدة ============
  console.log("\n── [4] تأسيس جمعية جديدة (المواطن الجديد)");
  const assocR = await reg.req("POST", "/api/associations", {
    name: `جمعية اختبار النظام الشامل ${ts}`,
    acronym: "TEST-SYS",
    description: "جمعية أُنشئت آلياً ضمن تجارب الجودة الشاملة للتحقق من مسطرة التأسيس الرقمي وسلامة البيانات والصلاحيات على المنصة.",
    mission: "اختبار شامل لمسار التأسيس",
    category: "تنموية",
    city: "الدار البيضاء",
    region: "الدار البيضاء - سطات",
    presidentName: "مواطن تجريبي للاختبار",
    presidentEmail: newEmail,
    presidentPassword: "Test@2026pass",
    legalStatus: "DECLARED",
  });
  const newAssocId = (assocR.json as any)?.association?.id ?? (assocR.json as any)?.id ?? "";
  ok(
    "تأسيس الجمعية (200/201)",
    (assocR.status === 200 || assocR.status === 201) && !!newAssocId,
    `status=${assocR.status} id=${newAssocId.slice(0, 8)}…`
  );
  ok("الجمعية الجديدة أُنشئت برمز فريد", !!(assocR.json as any)?.association?.slug, `slug=${(assocR.json as any)?.association?.slug?.slice(0, 24)}…`);

  // السوبرأدمين يوثق الجمعية (PATCH على المسار الجمعي: id + action)
  const approveR = await sessions.SUPER_ADMIN.client.req(
    "PATCH",
    "/api/associations",
    { id: newAssocId, action: "verify" }
  );
  ok("توثيق الجمعية من السوبرأدمين", approveR.status === 200 && (approveR.json as any)?.association?.isVerified === true, `status=${approveR.status}`);

  // ============ 5) إضافة منخرط ============
  console.log("\n── [5] إضافة منخرط جديد للجمعية");
  const memberR = await reg.req("POST", `/api/members?associationId=${newAssocId}`, {
    fullName: "منخرط تجريبي أول",
    email: `member-a-${ts}@mamp.ma`,
    password: "Member@2026",
    roleInAssociation: "MEMBER",
    memberType: "ACTIVE",
    cndpConsent: true,
    initialFee: 100,
  });
  ok("إضافة منخرط جديد", memberR.status === 200 || memberR.status === 201, `status=${memberR.status} ${memberR.json?.error ?? ""}`);

  const memberListR = await reg.req("GET", `/api/members?associationId=${newAssocId}`);
  const members = (memberListR.json as any)?.members ?? [];
  ok("قائمة المنخرطين تعيد المنخرط الجديد", members.length >= 1, `count=${members.length}`);

  // ============ 6) إنشاء فعالية ============
  console.log("\n── [6] إنشاء فعالية/نشاط");
  const eventR = await reg.req("POST", `/api/events?associationId=${newAssocId}`, {
    title: `ملتقى الاختبار الشامل ${ts}`,
    description: "فعالية أنشئت آلياً للتحقق من مسار إنشاء الأنشطة",
    category: "تكوينية",
    startDate: new Date(Date.now() + 7 * 864e5).toISOString(),
    location: "قاعة الاختبار، الدار البيضاء",
    city: "الدار البيضاء",
    maxParticipants: 50,
    isPublic: true,
  });
  ok("إنشاء فعالية عامة", eventR.status === 200 || eventR.status === 201, `status=${eventR.status} ${eventR.json?.error ?? ""}`);

  const eventsListR = await reg.req("GET", `/api/events?associationId=${newAssocId}`);
  const events = (eventsListR.json as any)?.events ?? [];
  ok("قائمة الفعاليات تعيد الفعالية", events.length >= 1, `count=${events.length}`);

  // ============ 7) المحاسبة: عملية مالية ============
  console.log("\n── [7] المحاسبة — إيراد ومصروف");
  const incomeR = await reg.req("POST", `/api/transactions?associationId=${newAssocId}`, {
    description: "منح انخراطات الاختبار",
    amount: 2500,
    type: "INCOME",
    category: "انخراطات",
    paymentMethod: "CASH",
  });
  ok("تسجيل إيراد", incomeR.status === 200 || incomeR.status === 201, `status=${incomeR.status} ${incomeR.json?.error ?? ""}`);

  const expenseR = await reg.req("POST", `/api/transactions?associationId=${newAssocId}`, {
    description: "كراء قاعة الاختبار",
    amount: 900,
    type: "EXPENSE",
    category: "كراء وتحملات",
    paymentMethod: "BANK_TRANSFER",
  });
  ok("تسجيل مصروف", expenseR.status === 200 || expenseR.status === 201, `status=${expenseR.status}`);

  const negR = await reg.req("POST", `/api/transactions?associationId=${newAssocId}`, {
    description: "مبلغ سالب مرفوض",
    amount: -50,
    type: "INCOME",
    category: "انخراطات",
  });
  ok("رفض المبلغ السالب (400)", negR.status === 400, `status=${negR.status}`);

  // ============ 8) التبرعات ============
  console.log("\n── [8] التبرعات");
  const donR = await reg.req("POST", `/api/donations?associationId=${newAssocId}`, {
    donorName: "محسن تجريبي",
    amount: 5000,
    type: "MONEY",
    isForeign: false,
  });
  ok("تسجيل تبرع نقدي", donR.status === 200 || donR.status === 201, `status=${donR.status} ${donR.json?.error ?? ""}`);

  // ============ 9) الوثائق ============
  console.log("\n── [9] الوثائق الرسمية");
  const docR = await reg.req("POST", `/api/documents?associationId=${newAssocId}`, {
    title: "القانون الأساسي للاختبار",
    type: "STATUTES",
    classification: "PUBLIC",
    content: "وثيقة اختبار — محتوى تجريبي للتحقق من الأرشفة.",
  });
  ok("أرشفة وثيقة", docR.status === 200 || docR.status === 201, `status=${docR.status} ${docR.json?.error ?? ""}`);

  // ============ 10) المساعد والإحصائيات ============
  console.log("\n── [10] المساعد الجمعوي والإحصائيات");
  const chatR = await reg.req("POST", "/api/chat", {
    message: "ما هي خطوات تأسيس جمعية بالمغرب؟",
    history: [],
  });
  const chatContent = (chatR.json as any)?.reply ?? (chatR.json as any)?.answer ?? (chatR.json as any)?.message ?? "";
  ok(
    "المساعد يجيب من قاعدة المعارف",
    chatR.status === 200 && typeof chatContent === "string" && chatContent.length > 50,
    `status=${chatR.status} len=${chatContent.length}`
  );

  const statsR = await sessions.SUPER_ADMIN.client.req("GET", "/api/stats");
  ok(
    "إحصائيات المنصة (سوبرأدمين)",
    statsR.status === 200 && statsR.json && typeof statsR.json === "object",
    `status=${statsR.status}`
  );

  // ============ 11) الخروج وإبطال الجلسة ============
  console.log("\n── [11] الخروج وإبطال الجلسة");
  const outR = await reg.req("POST", "/api/auth/logout");
  ok("طلب الخروج مقبول", outR.status === 200 || outR.status === 204, `status=${outR.status}`);
  const meAfter = await reg.req("GET", "/api/auth/me");
  ok("الجلسة أُبطلت بعد الخروج (user=null)", meAfter.status === 200 && meAfter.json?.user === null, `user=${JSON.stringify(meAfter.json?.user)}`);

  // ============ 12) التحقق من قاعدة البيانات ============
  console.log("\n── [12] تحقق نهائي من قاعدة البيانات");
  const { execSync } = await import("node:child_process");
  const dbCounts = execSync(
    `bun -e "const {PrismaClient}=require('@prisma/client');const p=new PrismaClient();(async()=>{const a=await p.association.count({where:{name:{contains:'${ts}'}}});const e=await p.event.count({where:{title:{contains:'${ts}'}}});const m=await p.membership.count({where:{association:{name:{contains:'${ts}'}}}});console.log(JSON.stringify({a,e,m}));await p.\\$disconnect();})()"`,
    { encoding: "utf-8" }
  ).trim();
  const dc = JSON.parse(dbCounts);
  ok("الجمعية محفوظة في القاعدة", dc.a >= 1, `assoc=${dc.a}`);
  ok("الفعالية محفوظة في القاعدة", dc.e >= 1, `events=${dc.e}`);
  ok("الانخراط محفوظ في القاعدة", dc.m >= 1, `memberships=${dc.m}`);

  // ============ الخلاصة ============
  console.log("\n" + "═".repeat(60));
  console.log(`النتيجة: ${passed} ناجح ✓ | ${failed} فاشل ✗`);
  if (failed) {
    console.log("\nالاختبارات الفاشلة:");
    failures.forEach((f) => console.log(`  • ${f}`));
    process.exit(1);
  }
  console.log("كل التجارب الحية الوظيفية نجحت ✅\n");
}

main().catch((e) => {
  console.error("خطأ قاتل في مجموعة الاختبارات:", e);
  process.exit(2);
});
