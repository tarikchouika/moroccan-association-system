"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Menu, X, LayoutDashboard, LogIn } from "lucide-react";
import { Logo } from "@/components/site/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "الرئيسية" },
  { href: "/associations", label: "دليل الجمعيات" },
  { href: "/legal", label: "المرجع القانوني" },
  { href: "/assistant", label: "المساعد الجمعوي" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

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
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" aria-label="منصة مامب — الرئيسية">
          <Logo />
        </Link>

        {/* روابط سطح المكتب */}
        <nav className="hidden md:flex items-center gap-1" aria-label="التنقل الرئيسي">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "rounded-lg px-3.5 py-2 text-sm font-bold transition-colors",
                pathname === l.href
                  ? "text-primary bg-secondary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          <Button asChild variant="ghost" className="font-bold">
            <Link href="/login">
              <LogIn className="size-4" />
              الدخول
            </Link>
          </Button>
          <Button asChild className="font-bold bg-primary hover:bg-primary/90">
            <Link href="/register">
              <LayoutDashboard className="size-4" />
              إنشاء حساب
            </Link>
          </Button>
        </div>

        {/* زر الجوال */}
        <div className="flex items-center gap-1.5 md:hidden">
          <ThemeToggle />
          <button
            className="rounded-lg p-2 hover:bg-muted"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
            aria-expanded={open}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {/* قائمة الجوال */}
      {open && (
        <div className="md:hidden msg-in border-t border-border bg-card px-4 pb-4 pt-2 shadow-lg">
          <nav className="flex flex-col gap-1" aria-label="التنقل — جوال">
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
                <Link href="/login">الدخول</Link>
              </Button>
              <Button asChild className="font-bold">
                <Link href="/register">إنشاء حساب</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
