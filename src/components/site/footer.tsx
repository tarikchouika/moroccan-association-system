"use client";

import Link from "next/link";
import { Landmark, Scale, ShieldCheck, Bot, ExternalLink, Mail, Smartphone, FileText } from "lucide-react";
import { Logo } from "@/components/site/logo";
import { OFFICIAL_LINKS } from "@/lib/kb/data";
import { useI18n } from "@/lib/i18n/provider";
import type { KBLink } from "@/lib/kb/data";

/** التذييل — روابط رسمية موثقة فقط (بأسماء مترجمة حسب اللغة) */
export function Footer() {
  const { d, kb } = useI18n();

  const officialKeys = [
    "maroc",
    "sgg",
    "interieur",
    "tax",
    "ice",
    "cnss",
    "cndp",
    "asd",
  ] as const;

  const officialPortals: KBLink[] = officialKeys.map(
    (k) => ({ ...OFFICIAL_LINKS[k], label: kb.links[k] })
  );

  return (
    <footer className="no-print gradient-dark zellige-pattern text-white mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-12">
          {/* الهوية */}
          <div className="md:col-span-5 space-y-4">
            <Logo light />
            <p className="text-sm leading-7 text-white/70 max-w-md">{d.footer.about}</p>
            <div className="flex flex-wrap gap-2 text-[11px] font-bold">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5">
                <Scale className="size-3.5 text-gold" />
                {d.footer.badgeLaw}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5">
                <ShieldCheck className="size-3.5 text-gold" />
                {d.footer.badgePrivacy}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5">
                <Bot className="size-3.5 text-gold" />
                {d.footer.badgeAssistant}
              </span>
            </div>
          </div>

          {/* روابط المنصة */}
          <div className="md:col-span-2">
            <h3 className="mb-4 text-sm font-extrabold text-gold">{d.footer.platformTitle}</h3>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li><Link className="hover:text-white transition-colors" href="/associations">{d.nav.associations}</Link></li>
              <li><Link className="hover:text-white transition-colors" href="/projects">{d.nav.projects}</Link></li>
              <li><Link className="hover:text-white transition-colors" href="/legal">{d.nav.legal}</Link></li>
              <li><Link className="hover:text-white transition-colors" href="/assistant">{d.nav.assistant}</Link></li>
              <li><Link className="hover:text-white transition-colors" href="/login">{d.footer.membersLogin}</Link></li>
              <li><Link className="hover:text-white transition-colors" href="/register">{d.nav.register}</Link></li>
              <li><Link className="hover:text-white transition-colors" href="/dashboard">{d.footer.dashboard}</Link></li>
              <li>
                <Link className="group inline-flex items-center gap-1.5 hover:text-white transition-colors" href="/app">
                  <Smartphone className="size-3.5 text-gold" />
                  {d.footer.androidApp}
                </Link>
              </li>
            </ul>
          </div>

          {/* الوثائق القانونية */}
          <div className="md:col-span-2">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-extrabold text-gold">
              <FileText className="size-4" />
              {d.footer.legalDocsTitle}
            </h3>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li><Link className="hover:text-white transition-colors" href="/legal/terms">{d.footer.terms}</Link></li>
              <li><Link className="hover:text-white transition-colors" href="/legal/privacy">{d.footer.privacy}</Link></li>
              <li><Link className="hover:text-white transition-colors" href="/legal/cookies">{d.footer.cookies}</Link></li>
            </ul>
          </div>

          {/* بوابات رسمية */}
          <div className="md:col-span-3">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-extrabold text-gold">
              <Landmark className="size-4" />
              {d.footer.officialPortalsTitle}
            </h3>
            <ul className="space-y-2.5 text-sm text-white/70">
              {officialPortals.map((p) => (
                <li key={p.url}>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1.5 hover:text-white transition-colors"
                  >
                    <ExternalLink className="size-3 opacity-50 group-hover:opacity-100" />
                    {p.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-[12px] text-white/50 sm:flex-row">
          <p>{d.footer.copyright}</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link className="hover:text-white/80 transition-colors" href="/legal/terms">{d.footer.terms}</Link>
            <Link className="hover:text-white/80 transition-colors" href="/legal/privacy">{d.footer.privacy}</Link>
            <p className="flex items-center gap-1.5 text-center">
              <Mail className="size-3.5" />
              {d.footer.legalNotice}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
