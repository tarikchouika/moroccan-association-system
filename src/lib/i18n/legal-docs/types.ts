/**
 * عقد الوثائق القانونية (شروط الاستخدام / الخصوصية / الكوكيز)
 * نفس البنية الملزمة لكل اللغات — تفحص آلياً عبر TypeScript.
 */

export interface LegalSectionT {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
}

export interface LegalDocT {
  title: string;
  subtitle: string;
  updated: string;
  sections: LegalSectionT[];
}

export interface LegalDocs {
  terms: LegalDocT;
  privacy: LegalDocT;
  cookies: LegalDocT;
}

export type LegalDocId = keyof LegalDocs;
