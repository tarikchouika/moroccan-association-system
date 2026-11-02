"use client";

/**
 * مزود اللغة — قلب نظام تعدد اللغات في منصة MAMP.
 * • يقرأ اللغة المحفوظة (localStorage) بعد الترطيب لتفادي أي عدم تطابق SSR.
 * • يطبق <html lang/dir> فور تغيير اللغة (RTL للعربية / LTR للبقية).
 * • يوفر القاموس المكتوب (d) والوثائق القانونية وترجمات قاعدة المعرفة
 *   ومساعدي تنسيق البيانات التجريبية — مع رجوع تلقائي للعربية عند أي نقص.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { LANGUAGES, DEFAULT_LANG, LANG_STORAGE_KEY, isLang, detectBrowserLang, type Lang } from "./config";
import type { Dict } from "./types";
import type { LegalDocs } from "./legal-docs/types";
import { DICTS } from "./dictionaries";
import { arLegalDocs } from "./legal-docs/ar";
import { frLegalDocs } from "./legal-docs/fr";
import { enLegalDocs } from "./legal-docs/en";
import { esLegalDocs } from "./legal-docs/es";
import { itLegalDocs } from "./legal-docs/it";
import { deLegalDocs } from "./legal-docs/de";
import { nlLegalDocs } from "./legal-docs/nl";
import { ruLegalDocs } from "./legal-docs/ru";
import type { KBTranslationSet } from "@/lib/kb/translations/types";
import { KB_SETS } from "@/lib/kb/translations";
import type { DemoAssociation, DemoEvent } from "@/generated/types";

const LEGAL_DOCS: Record<Lang, LegalDocs> = {
  ar: arLegalDocs, fr: frLegalDocs, en: enLegalDocs, es: esLegalDocs,
  it: itLegalDocs, de: deLegalDocs, nl: nlLegalDocs, ru: ruLegalDocs,
};

interface I18nValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  dir: "rtl" | "ltr";
  locale: string;
  /** القاموس المكتوب للغة الحالية (مع بنيته الكاملة) */
  d: Dict;
  legal: LegalDocs;
  kb: KBTranslationSet;
}

const I18nContext = createContext<I18nValue | null>(null);

function applyHtmlAttrs(lang: Lang) {
  if (typeof document === "undefined") return;
  const meta = LANGUAGES[lang];
  document.documentElement.lang = meta.htmlLang;
  document.documentElement.dir = meta.dir;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  // دائماً نبدأ بالعربية (مطابق للـ SSR) ثم نبدل بعد الترطيب إن اختار المستخدم لغة أخرى
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LANG_STORAGE_KEY);
      if (isLang(saved) && saved !== DEFAULT_LANG) {
        setLangState(saved);
        applyHtmlAttrs(saved);
      } else {
        const detected = detectBrowserLang();
        if (detected !== DEFAULT_LANG && !saved) {
          setLangState(detected);
          applyHtmlAttrs(detected);
        }
      }
    } catch {
      /* بيئة مقيدة */
    }
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    applyHtmlAttrs(l);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, l);
    } catch {
      /* تجاهل */
    }
  }, []);

  const value = useMemo<I18nValue>(() => {
    const meta = LANGUAGES[lang];
    return {
      lang,
      setLang,
      dir: meta.dir,
      locale: meta.dateLocale,
      d: DICTS[lang] ?? DICTS[DEFAULT_LANG],
      legal: LEGAL_DOCS[lang] ?? LEGAL_DOCS[DEFAULT_LANG],
      kb: KB_SETS[lang] ?? KB_SETS[DEFAULT_LANG],
    };
  }, [lang, setLang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within LanguageProvider");
  return ctx;
}

/**
 * يضبط عنوان التبويب (ووصف الصفحة اختيارياً) بلغة الواجهة الحالية،
 * ويتحدث تلقائياً عند تغيير اللغة — فيظل التبويب متطابقاً مع لغة المحتوى.
 * • بدون عنوان: يُستعمل عنوان الموقع الافتراضي (الصفحة الرئيسية).
 * • الوصف يُطبق مرة واحدة لكل لغة على الصفحة الرئيسية فقط (تجنب مسح أوصاف الصفحات الداخلية).
 */
export function useDocumentTitle(title?: string, description?: string) {
  const { lang, d } = useI18n();
  useEffect(() => {
    const full = title ? `${title} | ${d.meta.siteName}` : d.meta.siteTitle;
    if (document.title !== full) document.title = full;
    if (description) {
      const el = document.querySelector('meta[name="description"]');
      if (el && el.getAttribute("content") !== description) {
        el.setAttribute("content", description);
      }
    }
    // حماية: قد يعيد React فرض عنوان RSC العربي عند اكتمال الترطيب المتأخر
    // (مثل تحميل ودجت المساعد) — المراقب يعيد تثبيت عنوان لغة الواجهة فوراً.
    const titleEl = document.head.querySelector("title");
    let observer: MutationObserver | null = null;
    if (titleEl) {
      observer = new MutationObserver(() => {
        if (document.title !== full) document.title = full;
      });
      observer.observe(titleEl, { childList: true, characterData: true, subtree: true });
    }
    return () => observer?.disconnect();
  }, [title, description, lang, d.meta.siteName, d.meta.siteTitle]);
}

/** مساعدو توطين بيانات العرض (الجمعيات والفعاليات) مع رجوع للعربية */
export function useDemoI18n() {
  const { lang, d, locale } = useI18n();
  return useMemo(() => {
    const numLocale = LANGUAGES[lang].numberLocale;
    return {
      city: (v: string) => d.demo.cities[v] ?? v,
      region: (v: string) => d.demo.regions[v] ?? v,
      category: (v: string) => d.demo.categories[v] ?? v,
      eventCategory: (v: string) => d.demo.eventCategories[v] ?? v,
      assocName: (a: DemoAssociation) => d.demo.associations[a.slug]?.name ?? a.name,
      assocAcronym: (a: DemoAssociation) => d.demo.associations[a.slug]?.acronym ?? a.acronym,
      assocDescription: (a: DemoAssociation) => d.demo.associations[a.slug]?.description ?? a.description,
      assocMission: (a: DemoAssociation) => d.demo.associations[a.slug]?.mission ?? a.mission,
      eventTitle: (e: DemoEvent) => d.demo.events[e.title]?.title ?? e.title,
      eventLocation: (e: DemoEvent) => d.demo.events[e.title]?.location ?? e.location,
      fmtDate: (date: string | Date, opts?: Intl.DateTimeFormatOptions) =>
        new Date(date).toLocaleDateString(locale, opts ?? { day: "numeric", month: "long", year: "numeric" }),
      fmtNum: (n: number) => n.toLocaleString(numLocale),
      fmtMAD: (n: number) =>
        `${n.toLocaleString(numLocale, { maximumFractionDigits: 0 })} ${d.common.currency}`,
    };
  }, [lang, d, locale]);
}
