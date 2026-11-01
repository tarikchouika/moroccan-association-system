/**
 * عقد ترجمات قاعدة المعرفة — البنية الملزمة لكل اللغات.
 * المصدر المرجعي هو src/lib/kb/data.ts (العربية).
 * كل ملف ترجمة يجب أن يغطي كل المداخيل والروابط والفئات — يفحص آلياً.
 */
import type { KB_ENTRIES, OFFICIAL_LINKS, KB_CATEGORIES } from "../data";

export type KBEntryId = (typeof KB_ENTRIES)[number]["id"];
export type KBLinkKey = keyof typeof OFFICIAL_LINKS;
export type KBCategoryKey = (typeof KB_CATEGORIES)[number];

export interface KBEntryT {
  title: string;
  keywords: string[];
  answer: string;
}

export type KBTranslations = Record<KBEntryId, KBEntryT>;
export type KBLinkLabels = Record<KBLinkKey, string>;
export type KBCategoryLabels = Record<KBCategoryKey, string>;

export interface KBTranslationSet {
  entries: KBTranslations;
  links: KBLinkLabels;
  categories: KBCategoryLabels;
}
