/**
 * scripts/check-i18n.ts — فحص جودة الترجمات الثماني (ضابط التسربات والهلوسات)
 *
 * 1) تطابق بنية المفاتيح مع العربية (قاموس الواجهة + الوثائق القانونية + قاعدة المعرفة)
 * 2) كشف الملفات المؤقتة (نسخ مطابقة للعربية)
 * 3) حفظ الأرقام حرفياً: كل رقم في الترجمة يجب أن يوجد في الأصل وبالعكس
 * 4) حفظ الروابط: نفس روابط HTTPS في الترجمة كما في الأصل (لا روابط جديدة مختلقة)
 * 5) حفظ الرموز المحمية: Mamp@2026 / mamp.pages.dev / TARIK CHOUIKA / scrypt ...
 * 6) كلمات مفتاحية غير فارغة ومرقمة
 *
 * الاستعمال: bun scripts/check-i18n.ts
 */
import { DICTS } from "../src/lib/i18n/dictionaries";
import { arLegalDocs } from "../src/lib/i18n/legal-docs/ar";
import { frLegalDocs } from "../src/lib/i18n/legal-docs/fr";
import { enLegalDocs } from "../src/lib/i18n/legal-docs/en";
import { esLegalDocs } from "../src/lib/i18n/legal-docs/es";
import { itLegalDocs } from "../src/lib/i18n/legal-docs/it";
import { deLegalDocs } from "../src/lib/i18n/legal-docs/de";
import { nlLegalDocs } from "../src/lib/i18n/legal-docs/nl";
import { ruLegalDocs } from "../src/lib/i18n/legal-docs/ru";
import { KB_SETS } from "../src/lib/kb/translations";
import { KB_ENTRIES } from "../src/lib/kb/data";
import { LANG_ORDER, type Lang } from "../src/lib/i18n/config";

const LEGAL_DOCS = {
  ar: arLegalDocs, fr: frLegalDocs, en: enLegalDocs, es: esLegalDocs,
  it: itLegalDocs, de: deLegalDocs, nl: nlLegalDocs, ru: ruLegalDocs,
} as const;

let errors = 0;
let warnings = 0;

function err(msg: string) {
  errors++;
  console.error(`  ❌ ${msg}`);
}
function warn(msg: string) {
  warnings++;
  console.warn(`  ⚠️  ${msg}`);
}

/** استخراج المسارات الورقية لقاموس ما */
function leafPaths(obj: unknown, prefix = ""): Map<string, unknown> {
  const out = new Map<string, unknown>();
  if (obj === null || typeof obj !== "object") {
    out.set(prefix, obj);
    return out;
  }
  if (Array.isArray(obj)) {
    if (obj.length === 0) out.set(prefix, []);
    obj.forEach((v, i) => {
      const sub = leafPaths(v, `${prefix}[${i}]`);
      sub.forEach((sv, sk) => out.set(sk, sv));
    });
    return out;
  }
  for (const [k, v] of Object.entries(obj)) {
    const sub = leafPaths(v, prefix ? `${prefix}.${k}` : k);
    sub.forEach((sv, sk) => out.set(sk, sv));
  }
  return out;
}

/** أرقام كمتعدد مجموعات */
function numberMultiset(text: string): Map<string, number> {
  const m = new Map<string, number>();
  for (const n of text.match(/\d[\d.,]*\d|\d/g) ?? []) {
    const key = n.replace(/[.,]$/, "");
    m.set(key, (m.get(key) ?? 0) + 1);
  }
  return m;
}

function compareMultisets(a: Map<string, number>, b: Map<string, number>, ctx: string) {
  for (const [k, ca] of a) {
    const cb = b.get(k) ?? 0;
    if (cb !== ca) err(`${ctx}: رقم «${k}» يظهر ${ca} مرة في الأصل و${cb} في الترجمة`);
  }
  for (const [k, cb] of b) {
    const ca = a.get(k) ?? 0;
    if (ca === 0) err(`${ctx}: رقم «${k}» غير موجود في الأصل — رقم مختلق!`);
  }
}

/** روابط HTTPS كمتعدد مجموعات */
function urlMultiset(text: string): Map<string, number> {
  const m = new Map<string, number>();
  for (const u of text.match(/https?:\/\/[^\s"'<>)\]]+/g) ?? []) {
    m.set(u, (m.get(u) ?? 0) + 1);
  }
  return m;
}

/** رموز محمية يجب حفظها حرفياً */
const PROTECTED_TOKENS = [
  "Mamp@2026",
  "mamp.pages.dev",
  "mamp-dl.pages.dev",
  "TARIK CHOUIKA",
  "CN=TARIK CHOUIKA",
  "scrypt",
  "httpOnly",
  "SameSite=Lax",
  "mamp_session",
  "admin@mamp.ma",
  "user1@mamp.ma",
  "user2@mamp.ma",
  "partenaire@mamp.ma",
];

function checkProtectedTokens(arText: string, tText: string, ctx: string) {
  for (const tok of PROTECTED_TOKENS) {
    const arCount = arText.split(tok).length - 1;
    const tCount = tText.split(tok).length - 1;
    if (arCount > 0 && tCount !== arCount) {
      err(`${ctx}: الرمز المحمي «${tok}» يظهر ${arCount} مرة في الأصل و${tCount} في الترجمة`);
    }
  }
}

function checkTextPair(arText: string, tText: string, ctx: string) {
  if (!tText || !tText.trim()) {
    err(`${ctx}: نص فارغ في الترجمة`);
    return;
  }
  compareMultisets(numberMultiset(arText), numberMultiset(tText), ctx);
  compareMultisets(urlMultiset(arText), urlMultiset(tText), ctx);
  checkProtectedTokens(arText, tText, ctx);
}

// =====================================================================
console.log("==> [1/4] فحص قواميس الواجهة (تطابق المفاتيح + الحفظ الحرفي)");
// =====================================================================
const arPaths = leafPaths(DICTS.ar);

for (const lang of LANG_ORDER) {
  if (lang === "ar") continue;
  const dict = DICTS[lang];
  if (dict === DICTS.ar) {
    err(`${lang}: القاموس نسخة مطابقة للعربية (ملف مؤقت لم يُستبدل)`);
    continue;
  }
  const paths = leafPaths(dict);
  const arKeys = new Set(arPaths.keys());
  const tKeys = new Set(paths.keys());

  for (const k of arKeys) if (!tKeys.has(k)) err(`${lang}: مفتاح ناقص ${k}`);
  for (const k of tKeys) if (!arKeys.has(k)) err(`${lang}: مفتاح زائد ${k}`);

  // فحص نصي زوجي لكل ورقة نصية
  let checked = 0;
  for (const [k, arVal] of arPaths) {
    const tVal = paths.get(k);
    if (typeof arVal === "string" && typeof tVal === "string") {
      checkTextPair(arVal, tVal, `${lang}:${k}`);
      checked++;
    } else if (typeof arVal === "string" || typeof tVal === "string") {
      err(`${lang}:${k} نوع القيمة مختلف عن الأصل`);
    }
  }
  // حسابات العرض التجريبية: البريد يجب أن يبقى كما هو (يفحص عبر الرموز المحمية)
  console.log(`  ${lang}: ${checked} نصاً مفحوصاً`);
}

// =====================================================================
console.log("==> [2/4] فحص الوثائق القانونية");
// =====================================================================
function legalPaths(docs: typeof arLegalDocs): Map<string, string> {
  const out = new Map<string, string>();
  for (const [docId, doc] of Object.entries(docs)) {
    out.set(`${docId}.title`, doc.title);
    out.set(`${docId}.subtitle`, doc.subtitle);
    out.set(`${docId}.updated`, doc.updated);
    doc.sections.forEach((s, i) => {
      out.set(`${docId}.s${i}.heading`, s.heading);
      s.paragraphs?.forEach((p, j) => out.set(`${docId}.s${i}.p${j}`, p));
      s.bullets?.forEach((b, j) => out.set(`${docId}.s${i}.b${j}`, b));
    });
  }
  return out;
}

const arLegalPaths = legalPaths(arLegalDocs);
for (const lang of LANG_ORDER) {
  if (lang === "ar") continue;
  const docs = LEGAL_DOCS[lang];
  if (docs === (arLegalDocs as never)) {
    err(`${lang}: الوثائق القانونية نسخة مطابقة للعربية (ملف مؤقت)`);
    continue;
  }
  const paths = legalPaths(docs);
  for (const [k, arVal] of arLegalPaths) {
    const tVal = paths.get(k);
    if (tVal === undefined) {
      err(`${lang}: قسم قانوني ناقص ${k}`);
      continue;
    }
    checkTextPair(arVal, tVal, `legal.${lang}:${k}`);
  }
  // عدد الأقسام
  for (const docId of ["terms", "privacy", "cookies"] as const) {
    if (docs[docId].sections.length !== arLegalDocs[docId].sections.length) {
      err(`${lang}: عدد أقسام ${docId} = ${docs[docId].sections.length} (الأصل ${arLegalDocs[docId].sections.length})`);
    }
  }
  console.log(`  ${lang}: ${paths.size} نصاً قانونياً مفحوصاً`);
}

// =====================================================================
console.log("==> [3/4] فحص ترجمات قاعدة المعرفة");
// =====================================================================
const arKBSet = KB_SETS.ar;
for (const lang of LANG_ORDER) {
  if (lang === "ar") continue;
  const set = KB_SETS[lang];
  if (set === arKBSet) {
    err(`${lang}: ترجمة قاعدة المعرفة نسخة مطابقة للعربية (ملف مؤقت)`);
    continue;
  }
  let checked = 0;
  for (const entry of KB_ENTRIES) {
    const t = set.entries[entry.id];
    if (!t) {
      err(`${lang}: مدخل قاعدة المعرفة ناقص ${entry.id}`);
      continue;
    }
    const arT = arKBSet.entries[entry.id];
    checkTextPair(arT.title, t.title, `kb.${lang}:${entry.id}.title`);
    checkTextPair(arT.answer, t.answer, `kb.${lang}:${entry.id}.answer`);
    if (!t.keywords || t.keywords.length === 0) {
      err(`${lang}: كلمات مفتاحية فارغة للمدخل ${entry.id}`);
    }
    for (const kw of t.keywords ?? []) {
      if (!kw.trim()) err(`${lang}: كلمة مفتاحية فارغة في ${entry.id}`);
    }
    checked++;
  }
  // الروابط والفئات
  const arLinkKeys = Object.keys(arKBSet.links);
  for (const k of arLinkKeys) {
    if (!set.links[k] || !set.links[k].trim()) err(`${lang}: تسمية رابط ناقصة ${k}`);
  }
  for (const k of Object.keys(set.links)) {
    if (!arLinkKeys.includes(k)) err(`${lang}: مفتاح رابط زائد ${k}`);
  }
  const arCatKeys = Object.keys(arKBSet.categories);
  for (const k of arCatKeys) {
    if (!set.categories[k] || !set.categories[k].trim()) err(`${lang}: تسمية فئة ناقصة ${k}`);
  }
  console.log(`  ${lang}: ${checked} مدخلاً مفحوصاً`);
}

// =====================================================================
console.log("==> [4/4] فحوصات ختامية");
// =====================================================================
// فحص التراكيب النصية الخطيرة
for (const lang of LANG_ORDER) {
  const dictJson = JSON.stringify(DICTS[lang]);
  if (dictJson.includes("undefined") || dictJson.includes("NaN")) {
    err(`${lang}: القاموس يحتوي undefined/NaN`);
  }
  // تحقق من أن أسماء اللغات الأصلية صحيحة في مبدل اللغة (ثابتة في config وليست مترجمة)
}

console.log("");
if (errors > 0) {
  console.error(`❌ فشل الفحص: ${errors} خطأ، ${warnings} تحذير`);
  process.exit(1);
}
console.log(`✅ اكتمل فحص الترجمات بنجاح (${warnings} تحذير)`);
