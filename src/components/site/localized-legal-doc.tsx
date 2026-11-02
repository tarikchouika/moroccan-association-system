"use client";

import { LegalPageView } from "@/components/site/legal-page";
import { useI18n, useDocumentTitle } from "@/lib/i18n/provider";
import type { LegalDocId } from "@/lib/i18n/legal-docs/types";

/**
 * صفحة وثيقة قانونية كاملة — مكون عميل يختار الوثيقة
 * ويعرضها بلغة الواجهة الحالية (مع رجوع تلقائي للعربية).
 */
export function LegalDocPage({ kind }: { kind: LegalDocId }) {
  const { legal, d } = useI18n();
  useDocumentTitle(d.meta.pages[kind]);
  return <LegalPageView doc={legal[kind]} />;
}
