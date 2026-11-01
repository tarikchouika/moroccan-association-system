/**
 * محرك الاسترجاع من قاعدة المعرفة — متعدد اللغات
 * • العربية مع تطبيع النص (كما في النسخة الأصلية)
 * • اللاتينية مع إزالة الحركات (é→e, ü→u...) والسيريلية بأحرف صغيرة
 * + فلترة صارمة للروابط (لا يمر أي رابط خارج اللائحة البيضاء)
 *
 * مبدأ منع الهلوسة محفوظ: البحث يطابق كلمات مفتاحية وعناوين موثقة فقط،
 * والجواب يُرجع حرفياً من الترجمة المدققة للمدخل — لا توليد لغوي إطلاقاً.
 */
import { KB_ENTRIES, OFFICIAL_LINKS, type KBEntry } from "./data";
import { KB_SETS } from "./translations";
import { LANG_ORDER, type Lang } from "@/lib/i18n/config";

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

/** تطبيع لاتيني/سيريلي: أحرف صغيرة + إزالة الحركات والعلائم المركبة */
export function normalizeLatin(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // الحركات المركبة (é → e)
    .replace(/ñ/g, "n").replace(/ç/g, "c").replace(/ß/g, "ss")
    .replace(/ё/g, "е")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** تطبيع موحد حسب محارف النص */
export function normalizeText(text: string): string {
  return /[\u0600-\u06FF]/.test(text) ? normalizeArabic(text) : normalizeLatin(text);
}

/** كلمات التوقف الشائعة — عربية + لغات المنصة السبع */
const STOP_WORDS = new Set([
  // عربية
  "في", "من", "على", "الى", "عن", "مع", "هذا", "هذه", "ذلك", "التي", "الذي",
  "ما", "هو", "هي", "كيف", "هل", "و", "أو", "او", "ثم", "كل", "بعض", "غير", "عن",
  // إنجليزية
  "the", "a", "an", "of", "to", "in", "for", "and", "or", "is", "are", "how", "what", "do", "does", "can", "i",
  // فرنسية
  "le", "la", "les", "de", "des", "du", "au", "aux", "et", "est", "que", "qui", "quoi", "comment", "dans", "pour", "sur", "je", "nous", "vous",
  // إسبانية
  "el", "los", "las", "un", "una", "y", "es", "que", "como", "en", "para", "por", "con",
  // إيطالية
  "il", "lo", "gli", "le", "un", "una", "e", "che", "come", "nella", "per", "con", "si",
  // ألمانية
  "der", "die", "das", "den", "dem", "und", "ist", "was", "wie", "in", "für", "mit", "auf",
  // هولندية
  "de", "het", "een", "en", "is", "wat", "hoe", "in", "voor", "met",
  // روسية
  "и", "в", "не", "на", "как", "что", "это", "для", "с", "по",
]);

function tokenize(text: string): string[] {
  return normalizeText(text)
    .split(" ")
    .filter((t) => t.length > 1 && !STOP_WORDS.has(t));
}

export interface ScoredEntry {
  entry: KBEntry;
  score: number;
}

/** البحث في قاعدة المعرفة بالعربية (النسخة الأصلية — للخادم المحلي) */
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

/**
 * البحث متعدد اللغات: يطابق استعلام المستخدم مع الكلمات المفتاحية
 * والعناوين بكل اللغات المتوفرة (اكرونيمات مثل ICE/CNDP تتقاطع بين اللغات)،
 * ثم يرجع أفضل المداخيل — يعرض الجواب لاحقاً بلغة الواجهة المختارة.
 *
 * مبدأ التسجيل: لكل رمز من رموز الاستعلام تُحتسب أفضل مساهمة واحدة فقط
 * عبر كل اللغات (وليس مجموعها) — حتى لا يتضخم النتيج بتكرار الكلمة نفسها
 * في عدة لغات (مثال: phone / téléphone / Smartphone).
 */
export function searchKBMultilingual(query: string, limit = 5): ScoredEntry[] {
  const qTokens = tokenize(query);
  if (qTokens.length === 0) return [];

  // تجهيز مسبق: لكل مدخل × لغة → كلمات مفتاحية مطبعة + رموز العنوان
  const prepared = KB_ENTRIES.map((entry) => {
    const perLang = LANG_ORDER.map((lang) => {
      const t = KB_SETS[lang]?.entries?.[entry.id];
      if (!t) return null;
      return {
        kwNorms: t.keywords.map(normalizeText).filter(Boolean),
        titleTokens: tokenize(t.title),
        titleNorm: normalizeText(t.title),
      };
    }).filter(Boolean) as Array<{ kwNorms: string[]; titleTokens: string[]; titleNorm: string }>;
    return { entry, perLang };
  });

  const scored = prepared.map(({ entry, perLang }) => {
    let score = 0;

    for (const qt of qTokens) {
      let best = 0;
      for (const { kwNorms, titleTokens, titleNorm } of perLang) {
        // الكلمات المفتاحية (بنفس اللغة)
        for (const kn of kwNorms) {
          if (kn === qt) best = Math.max(best, 6);
          else if (kn.includes(qt) && qt.length >= 3) best = Math.max(best, 3);
          else if (qt.includes(kn) && kn.length >= 3) best = Math.max(best, 2);
          // بادئة مشتركة (≥6 محارف) — تعالج التصريف والجمع بلغات متعددة
          // (association/asociaciones، ассоциация/ассоциацию…)
          else if (qt.length >= 5 && kn.length >= 5 && qt.slice(0, 6) === kn.slice(0, 6))
            best = Math.max(best, 3);
        }
        // العنوان
        if (titleTokens.some((tt) => tt === qt)) best = Math.max(best, 4);
        else if (qt.length >= 3 && titleNorm.includes(qt)) best = Math.max(best, 2);
        else if (qt.length >= 5 && titleTokens.some((tt) => tt.length >= 5 && tt.slice(0, 6) === qt.slice(0, 6)))
          best = Math.max(best, 2);
      }
      score += best;
    }

    return { entry, score };
  })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit);
}

/** بناء سياق مُوثق يُمرر للمساعد الذكي (النسخة المحلية — عربية) */
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

/** نوع لغات مساعد (تصدير للاستعمال الخارجي) */
export type { Lang };
