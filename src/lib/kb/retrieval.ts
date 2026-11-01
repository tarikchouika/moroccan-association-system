/**
 * محرك الاسترجاع من قاعدة المعرفة — عربي مع تطبيع النص
 * + فلترة صارمة للروابط (لا يمر أي رابط خارج اللائحة البيضاء)
 */
import { KB_ENTRIES, OFFICIAL_LINKS, type KBEntry } from "./data";

/** تطبيع النص العربي: إزالة التشكيل والتطويل وتوحيد الهمزات والألف */
export function normalizeArabic(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, "") // التشكيل
    .replace(/\u0640/g, "") // التطويل
    .replace(/[إأآا]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** كلمات التوقف العربية الشائعة */
const STOP_WORDS = new Set([
  "في", "من", "على", "الى", "عن", "مع", "هذا", "هذه", "ذلك", "التي", "الذي",
  "ما", "هو", "هي", "كيف", "هل", "و", "أو", "او", "ثم", "كل", "بعض", "غير",
  "the", "a", "an", "of", "to", "in", "for", "and", "or", "is", "are",
]);

function tokenize(text: string): string[] {
  return normalizeArabic(text)
    .split(" ")
    .filter((t) => t.length > 1 && !STOP_WORDS.has(t));
}

export interface ScoredEntry {
  entry: KBEntry;
  score: number;
}

/** البحث في قاعدة المعرفة بترجيح الكلمات المفتاحية والعناوين */
export function searchKB(query: string, limit = 5): ScoredEntry[] {
  const qTokens = tokenize(query);
  if (qTokens.length === 0) return [];

  const scored = KB_ENTRIES.map((entry) => {
    let score = 0;
    const titleNorm = normalizeArabic(entry.title);
    const answerNorm = normalizeArabic(entry.answer);
    const kwNorm = entry.keywords.map(normalizeArabic);

    // تقاطع الرموز مع الكلمات المفتاحية (وزن أعلى)
    for (const kw of kwNorm) {
      for (const qt of qTokens) {
        if (kw === qt) score += 6;
        else if (kw.includes(qt) && qt.length >= 3) score += 3;
        else if (qt.includes(kw) && kw.length >= 3) score += 2;
      }
    }
    // تقاطع مع العنوان
    for (const qt of qTokens) {
      if (titleNorm.includes(qt)) score += 4;
    }
    // تقاطع مع الجواب (وزن أخف)
    for (const qt of qTokens) {
      if (qt.length >= 3 && answerNorm.includes(qt)) score += 1;
    }
    return { entry, score };
  })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit);
}

/** بناء سياق مُوثق يُمرر للمساعد الذكي */
export function buildContext(results: ScoredEntry[]): string {
  if (results.length === 0) return "";
  return results
    .map(
      (r, i) =>
        `[${i + 1}] ${r.entry.title} (التصنيف: ${r.entry.category})\n${r.entry.answer}\n` +
        (r.entry.links.length
          ? `الروابط الرسمية المرجعية المسموح ذكرها: ${r.entry.links
              .map((l) => `${l.url} (${l.label})`)
              .join(" | ")}`
          : "")
    )
    .join("\n\n---\n\n");
}

/** الرمز التعريفي للجلسة إن لم يوجد */
export function sessionFallback(): string {
  return `s-${Date.now().toString(36)}`;
}

/**
 * 🔒 الفلترة الصارمة ضد الروابط الوهمية:
 * تمسح أي رابط (http/https/www) غير موجود في اللائحة البيضاء الرسمية.
 */
export function sanitizeLinks(text: string): { text: string; removed: number } {
  const whitelist = new Set(Object.values(OFFICIAL_LINKS).map((l) => l.url.toLowerCase().replace(/\/$/, "")));
  const urlRegex = /(?:https?:\/\/|www\.)[^\s،؛)\]}"'<>]+/gi;
  let removed = 0;

  const cleaned = text.replace(urlRegex, (match) => {
    const normalized = match
      .toLowerCase()
      .replace(/[.,;:!?]+$/, "")
      .replace(/\/$/, "");
    const withProto = normalized.startsWith("www.")
      ? `https://${normalized}`
      : normalized;
    if (whitelist.has(withProto) || whitelist.has(normalized)) {
      return match;
    }
    removed++;
    return "";
  });

  return { text: cleaned.replace(/\s{2,}/g, " ").trim(), removed };
}
