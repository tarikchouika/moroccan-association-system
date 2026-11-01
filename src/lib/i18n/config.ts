/**
 * إعدادات تعدد اللغات — منصة مامب
 * ثماني لغات رسمية: العربية (افتراضية، RTL) + 7 لغات LTR.
 * الاختيار يُحفظ في localStorage (mamp-lang) ويطبق على <html lang/dir>.
 */

export type Lang = "ar" | "fr" | "en" | "es" | "it" | "de" | "nl" | "ru";

export interface LangMeta {
  code: Lang;
  /** الاسم باللغة نفسها (يظهر في قائمة اللغات) */
  nativeName: string;
  /** الاسم بالإنجليزية (للمساعدة التقنية فقط) */
  englishName: string;
  dir: "rtl" | "ltr";
  /** قيمة <html lang> */
  htmlLang: string;
  /** locale تنسيق التواريخ */
  dateLocale: string;
  /** locale تنسيق الأرقام */
  numberLocale: string;
  /** الكود المختصر لعرض الشارة */
  short: string;
}

export const LANGUAGES: Record<Lang, LangMeta> = {
  ar: { code: "ar", nativeName: "العربية", englishName: "Arabic", dir: "rtl", htmlLang: "ar", dateLocale: "ar-MA-u-nu-latn", numberLocale: "en-US", short: "AR" },
  fr: { code: "fr", nativeName: "Français", englishName: "French", dir: "ltr", htmlLang: "fr", dateLocale: "fr-MA", numberLocale: "fr-FR", short: "FR" },
  en: { code: "en", nativeName: "English", englishName: "English", dir: "ltr", htmlLang: "en", dateLocale: "en-GB", numberLocale: "en-GB", short: "EN" },
  es: { code: "es", nativeName: "Español", englishName: "Spanish", dir: "ltr", htmlLang: "es", dateLocale: "es-ES", numberLocale: "es-ES", short: "ES" },
  it: { code: "it", nativeName: "Italiano", englishName: "Italian", dir: "ltr", htmlLang: "it", dateLocale: "it-IT", numberLocale: "it-IT", short: "IT" },
  de: { code: "de", nativeName: "Deutsch", englishName: "German", dir: "ltr", htmlLang: "de", dateLocale: "de-DE", numberLocale: "de-DE", short: "DE" },
  nl: { code: "nl", nativeName: "Nederlands", englishName: "Dutch", dir: "ltr", htmlLang: "nl", dateLocale: "nl-NL", numberLocale: "nl-NL", short: "NL" },
  ru: { code: "ru", nativeName: "Русский", englishName: "Russian", dir: "ltr", htmlLang: "ru", dateLocale: "ru-RU", numberLocale: "ru-RU", short: "RU" },
};

export const LANG_ORDER: Lang[] = ["ar", "fr", "en", "es", "it", "de", "nl", "ru"];

export const DEFAULT_LANG: Lang = "ar";
export const LANG_STORAGE_KEY = "mamp-lang";

export function isLang(v: unknown): v is Lang {
  return typeof v === "string" && v in LANGUAGES;
}

/** كشف لغة المتصفح من قائمة اللغات المدعومة */
export function detectBrowserLang(): Lang {
  try {
    const langs = navigator.languages?.length ? navigator.languages : [navigator.language];
    for (const l of langs) {
      const base = (l || "").toLowerCase().split("-")[0];
      if (isLang(base)) return base;
    }
  } catch {
    /* SSR أو بيئة مقيدة */
  }
  return DEFAULT_LANG;
}

/** وحدات حجم الملف حسب اللغة */
export function sizeUnits(lang: Lang): { kb: string; mb: string } {
  return lang === "ar" ? { kb: "ك.ب", mb: "م.ب" } : { kb: "KB", mb: "MB" };
}
