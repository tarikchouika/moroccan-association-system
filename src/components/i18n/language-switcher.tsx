"use client";

/**
 * مبدل اللغة — ثماني لغات رسمية.
 * سطح المكتب: زر كرة أرضية مع قائمة منسدلة.
 * الجوال: نسخة مدمجة (أيقونة فقط) في الشريط + شرائح داخل القائمة.
 */
import { Check, Globe, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n } from "@/lib/i18n/provider";
import { LANGUAGES, LANG_ORDER, type Lang } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({
  className,
  compact = false,
}: {
  className?: string;
  /** نسخة مضغوطة لأشرطة الجوال: أيقونة + رمز اللغة فقط */
  compact?: boolean;
}) {
  const { lang, setLang } = useI18n();
  const meta = LANGUAGES[lang];

  return (
    <DropdownMenu dir="ltr">
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-9 gap-1.5 rounded-lg px-2.5 font-bold",
            compact && "px-2",
            className
          )}
          aria-label={meta.nativeName}
          title={meta.nativeName}
        >
          <Globe className="size-4 shrink-0" />
          <span className="text-[12px] tracking-wide">{meta.short}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {LANG_ORDER.map((l) => (
          <DropdownMenuItem
            key={l}
            onClick={() => setLang(l as Lang)}
            className={cn(
              "flex cursor-pointer items-center justify-between gap-2 text-[13px] font-bold",
              l === lang && "bg-secondary text-primary"
            )}
            dir={LANGUAGES[l].dir}
          >
            <span className="flex items-center gap-2">
              <span className="w-7 text-[10px] font-black text-muted-foreground">{LANGUAGES[l].short}</span>
              {LANGUAGES[l].nativeName}
            </span>
            {l === lang && <Check className="size-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** نسخة الجوال — شرائح أفقية */
export function LanguageChips() {
  const { lang, setLang } = useI18n();
  return (
    <div className="mt-3 border-t border-border pt-3">
      <p className="mb-2 flex items-center gap-1.5 text-[11px] font-black text-muted-foreground">
        <Languages className="size-3.5" />
        {LANGUAGES[lang].nativeName} · 8
      </p>
      <div className="flex flex-wrap gap-1.5">
        {LANG_ORDER.map((l) => (
          <button
            key={l}
            onClick={() => setLang(l as Lang)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-[12px] font-bold transition-colors",
              l === lang
                ? "border-primary bg-secondary text-primary"
                : "border-border text-muted-foreground hover:border-primary/40 hover:text-primary"
            )}
          >
            {LANGUAGES[l].nativeName}
          </button>
        ))}
      </div>
    </div>
  );
}
