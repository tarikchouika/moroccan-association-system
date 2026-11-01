"use client";

/**
 * مبدّل الوضع القاتم/الفاتح — منصة مامب
 * يحفظ الاختيار في localStorage ويحترم تفضيل النظام (mamp-theme).
 */
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/provider";

export function ThemeToggle({ className }: { className?: string }) {
  const { d } = useI18n();
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // مزامنة الحالة بين نسختي الزر (سطح المكتب/الجوال) ومن التحميل الأولي
    const sync = () => setDark(document.documentElement.classList.contains("dark"));
    sync();
    setMounted(true);
    window.addEventListener("mamp-theme-change", sync);
    return () => window.removeEventListener("mamp-theme-change", sync);
  }, []);

  function toggle() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("mamp-theme", next ? "dark" : "light");
    } catch {
      /* التخزين غير متاح */
    }
    window.dispatchEvent(new CustomEvent("mamp-theme-change", { detail: next }));
  }

  return (
    <button
      onClick={toggle}
      aria-label={dark ? d.common.themeLight : d.common.themeDark}
      title={dark ? d.common.themeLight : d.common.themeDark}
      className={cn(
        "grid size-9 shrink-0 place-items-center rounded-xl border border-border bg-card text-muted-foreground",
        "transition-all hover:border-primary/40 hover:text-primary active:scale-95",
        className
      )}
    >
      {mounted && dark ? <Sun className="size-4.5" /> : <Moon className="size-4.5" />}
    </button>
  );
}
