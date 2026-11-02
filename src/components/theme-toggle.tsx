"use client";

/**
 * مبدّل الوضع القاتم/الفاتح — منصة مامب
 * يحفظ الاختيار في localStorage ويحترم تفضيل النظام (mamp-theme).
 */
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration-safe read of the persisted theme after mount
    setDark(document.documentElement.classList.contains("dark"));
    setMounted(true);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("mamp-theme", next ? "dark" : "light");
    } catch {
      /* التخزين غير متاح */
    }
  }

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "التبديل إلى الوضع الفاتح" : "التبديل إلى الوضع القاتم"}
      title={dark ? "الوضع الفاتح" : "الوضع القاتم"}
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
