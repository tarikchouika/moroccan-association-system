/**
 * scripts/test-stress.ts — تجارب الضغط والحمولة على النسخة الكاملة
 *
 * القياسات: الإنجازية (RPS)، كمون p50/p95/p99، معدل الأخطاء،
 * واختبار سباقات: إضافة منخرطين متزامنين لنفس الجمعية (توليد الأرقام الفريدة).
 *
 * الاستعمال: bun scripts/test-stress.ts [BASE_URL] [CONCURRENCY] [TOTAL]
 */
const BASE = process.argv[2] ?? "http://localhost:3100";
const CONCURRENCY = Number(process.argv[3] ?? 50);
const TOTAL = Number(process.argv[4] ?? 500);

function percentile(sorted: number[], p: number): number {
  if (!sorted.length) return 0;
  const idx = Math.min(sorted.length - 1, Math.ceil((p / 100) * sorted.length) - 1);
  return sorted[Math.max(0, idx)];
}

function fmtMs(ms: number): string {
  return ms >= 1000 ? `${(ms / 1000).toFixed(2)}s` : `${Math.round(ms)}ms`;
}

interface Target {
  name: string;
  run: (i: number) => Promise<number>; // يعيد رمز الحالة
}

async function getLoginCookie(): Promise<string> {
  const res = await fetch(BASE + "/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@mamp.ma", password: "Mamp@2026" }),
  });
  const sc = res.headers.getSetCookie?.() ?? [];
  return sc.map((c) => c.split(";")[0]).join("; ");
}

async function loadTest(target: Target): Promise<void> {
  console.log(`\n── ${target.name}`);
  const latencies: number[] = [];
  const statusCounts = new Map<number, number>();
  let errors = 0;
  const start = performance.now();
  let issued = 0;

  async function worker() {
    while (true) {
      const i = issued++;
      if (i >= TOTAL) return;
      const t0 = performance.now();
      try {
        const status = await target.run(i);
        latencies.push(performance.now() - t0);
        statusCounts.set(status, (statusCounts.get(status) ?? 0) + 1);
      } catch {
        latencies.push(performance.now() - t0);
        errors++;
        statusCounts.set(0, (statusCounts.get(0) ?? 0) + 1);
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  const elapsed = (performance.now() - start) / 1000;
  const sorted = [...latencies].sort((a, b) => a - b);
  const rps = TOTAL / elapsed;
  const statusLine = [...statusCounts.entries()].map(([s, c]) => `${s}:${c}`).join(" ");

  console.log(`     الطلبات: ${TOTAL} | التزامن: ${CONCURRENCY} | المدة: ${elapsed.toFixed(2)}s`);
  console.log(`     الإنجازية: ${rps.toFixed(1)} طلب/ث | الأخطاء الشبكية: ${errors}`);
  console.log(`     الرموز: ${statusLine}`);
  console.log(
    `     الكمون: p50=${fmtMs(percentile(sorted, 50))} | p95=${fmtMs(percentile(sorted, 95))} | p99=${fmtMs(percentile(sorted, 99))} | أقصى=${fmtMs(sorted[sorted.length - 1] ?? 0)}`
  );

  const serverErrors = (statusCounts.get(500) ?? 0) + (statusCounts.get(502) ?? 0) + errors;
  if (serverErrors > 0) {
    console.log(`     ❌ ${serverErrors} خطأ خادم/شبكة تحت الحمل!`);
  } else {
    console.log(`     ✅ صفر أخطاء خادم تحت الحمل`);
  }
}

async function main() {
  console.log(`\n██ تجارب الضغط ضد ${BASE} — تزامن ${CONCURRENCY} × ${TOTAL} طلب لكل هدف`);
  const cookie = await getLoginCookie();
  const authHeaders = { "Content-Type": "application/json", cookie };

  // 1) الصفحة الرئيسية (تصيير SSR/ثابت)
  await loadTest({
    name: "الصفحة الرئيسية (GET /)",
    run: async () => (await fetch(BASE + "/")).status,
  });

  // 2) قائمة الجمعيات العمومية
  await loadTest({
    name: "API الجمعيات (GET /api/associations)",
    run: async () => (await fetch(BASE + "/api/associations")).status,
  });

  // 3) الدخول بكلمة سر خاطئة (عبء scrypt + استعلام)
  await loadTest({
    name: "API الدخول الفاشل (scrypt + استعلام)",
    run: async () =>
      (
        await fetch(BASE + "/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: "admin@mamp.ma", password: "WrongPass99" }),
        })
      ).status,
  });

  // 4) مسار مصادق (بيانات الجمعية)
  await loadTest({
    name: "API مصادق — /api/stats",
    run: async () => (await fetch(BASE + "/api/stats", { headers: authHeaders })).status,
  });

  // 5) سباق الكتابة: إنشاء فعاليات متزامنة لنفس الجمعية
  const assocsRes = await fetch(BASE + "/api/associations");
  const assocId = ((await assocsRes.json()) as any)?.associations?.[0]?.id;
  if (assocId) {
    await loadTest({
      name: "سباق الكتابة — إنشاء فعاليات متزامنة (نفس الجمعية)",
      run: async (i) =>
        (
          await fetch(`${BASE}/api/events?associationId=${assocId}`, {
            method: "POST",
            headers: authHeaders,
            body: JSON.stringify({
              title: `فعالية ضغط متزامنة ${i} — ${Date.now()}`,
              description: "إنشاء تحت حمل متزامن عالٍ للتحقق من سلامة الكتابة المتزامنة",
              category: "ثقافية",
              startDate: new Date(Date.now() + 30 * 864e5).toISOString(),
            }),
          })
        ).status,
    });
  }

  console.log("\n██ اكتملت تجارب الضغط\n");
}

main().catch((e) => {
  console.error("خطأ قاتل:", e);
  process.exit(2);
});
