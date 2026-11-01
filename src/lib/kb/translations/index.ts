import type { Lang } from "@/lib/i18n/config";
import type { KBTranslationSet } from "./types";
import { arKB } from "./ar";
import { frKB } from "./fr";
import { enKB } from "./en";
import { esKB } from "./es";
import { itKB } from "./it";
import { deKB } from "./de";
import { nlKB } from "./nl";
import { ruKB } from "./ru";

/** كل ترجمات قاعدة المعرفة — الاستيراد المركزي */
export const KB_SETS: Record<Lang, KBTranslationSet> = {
  ar: arKB, fr: frKB, en: enKB, es: esKB, it: itKB, de: deKB, nl: nlKB, ru: ruKB,
};

/** ترجمة آمنة مع رجوع للعربية */
export function getKBSet(lang: Lang): KBTranslationSet {
  return KB_SETS[lang] ?? KB_SETS.ar;
}
