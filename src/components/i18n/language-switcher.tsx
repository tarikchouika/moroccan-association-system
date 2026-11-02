"use client";

/**
 * مبدّل اللغة — ثماني لغات رسمية.
 * سطح المكتب والجوال: زر كرة أرضية (نسخة compact في أشرطة الجوال) مع قائمة منسدلة.
 * هو الأداة الوحيدة لتغيير اللغة في الهيدر — لا شرائح مكررة داخل القوائم.
 */
import { Check, Globe } from "lucide-react";
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
