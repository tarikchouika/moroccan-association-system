import { KB_ENTRIES, OFFICIAL_LINKS, KB_CATEGORIES } from "../data";
import type { KBTranslationSet, KBTranslations, KBLinkLabels, KBCategoryLabels } from "./types";

/**
 * الترجمة العربية لقاعدة المعرفة — مشتقة آلياً من المصدر المرجعي data.ts
 * (لا ازدواجية ولا انزياح بين الملفين).
 */
const entries = Object.fromEntries(
  KB_ENTRIES.map((e) => [e.id, { title: e.title, keywords: e.keywords, answer: e.answer }])
) as KBTranslations;

const links = Object.fromEntries(
  Object.entries(OFFICIAL_LINKS).map(([k, v]) => [k, v.label])
) as KBLinkLabels;

const categories = Object.fromEntries(
  KB_CATEGORIES.map((c) => [c, c])
) as KBCategoryLabels;

export const arKB: KBTranslationSet = { entries, links, categories };
