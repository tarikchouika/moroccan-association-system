"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/site/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher, LanguageChips } from "@/components/i18n/language-switcher";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/provider";

export function Navbar() {
  const { d } = useI18n();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const NAV_LINKS = [
    { href: "/", label: d.nav.home },
    { href: "/associations", label: d.nav.associations },
    { href: "/projects", label: d.nav.projects },
    { href: "/legal", label: d.nav.legal },
    { href: "/assistant", label: d.nav.assistant },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- close the menu after navigation
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "no-print sticky top-0 z-40 w-full transition-all duration-300",
        scrolled ? "glass border-b border-border shadow-sm" : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link href="/" aria-label={d.nav.homeAria}>
          <Logo taglineClassName="hidden 2xl:block" />
        </Link>

        {/* روابط سطح المكتب — من xl ففقط: أوسع تسمية (الروسية) تتطلب ~1250px */}
        <nav className="hidden min-w-0 items-center gap-1 xl:flex" aria-label={d.nav.mainNavAria}>
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "rounded-lg px-2.5 py-2 text-[13px] font-bold transition-colors",
                pathname === l.href
                  ? "text-primary bg-secondary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-1 xl:flex">
          <ThemeToggle />
          <LanguageSwitcher />
          <Button asChild variant="ghost" className="px-3 text-[13px] font-bold">
            <Link href="/login">
              {d.nav.login}
            </Link>
          </Button>
          <Button asChild className="bg-primary px-3 text-[13px] font-bold hover:bg-primary/90">
            <Link href="/register">
              {d.nav.register}
            </Link>
          </Button>
        </div>

        {/* زر الجوال — مبدل اللغة + السمة + القائمة */}
        <div className="flex items-center gap-1 xl:hidden">
          <LanguageSwitcher compact />
          <ThemeToggle />
          <button
            className="rounded-lg p-2 hover:bg-muted"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? d.nav.closeMenu : d.nav.openMenu}
            aria-expanded={open}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {/* قائمة الجوال */}
      {open && (
        <div className="msg-in border-t border-border bg-card px-4 pb-4 pt-2 shadow-lg xl:hidden">
          <nav className="flex flex-col gap-1" aria-label={d.nav.mainNavAria}>
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "rounded-lg px-3 py-2.5 text-sm font-bold",
                  pathname === l.href ? "text-primary bg-secondary" : "text-foreground hover:bg-muted"
                )}
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Button asChild variant="outline" className="font-bold">
                <Link href="/login">{d.nav.login}</Link>
              </Button>
              <Button asChild className="font-bold">
                <Link href="/register">{d.nav.register}</Link>
              </Button>
            </div>
            <LanguageChips />
          </nav>
        </div>
      )}
    </header>
  );
}
