"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/provider";

/**
 * شعار منصة MAMP — اللوغو الرسمي (درع MAMP)
 * • الوضع الفاتح: اللوغو الأصلي
 * • الوضع القاتم: نسخة مرتفعة الظلال كي تبقى التفاصيل مرئية على الكحلي
 * • light=true: للأقسام الكحلية الداكنة دائماً (الفوتر، الشريط الجانبي…)
 * • السطر الصغير تحت الاسم مترجم حسب لغة الواجهة
 */
export function Logo({
  className,
  light = false,
  compact = false,
  taglineClassName,
}: {
  className?: string;
  light?: boolean;
  compact?: boolean;
  /** أصناف إضافية لسطر الشعار الصغير (مثال: إخفاؤه تحت 2xl في الشريط الضيق) */
  taglineClassName?: string;
}) {
  const { d } = useI18n();
  return (
    <span className={cn("inline-flex items-center gap-2.5 select-none", className)}>
      <span className="relative grid h-10 w-11 place-items-center">
        {light ? (
          <Image
            src="/logo-dark.png"
            alt="MAMP"
            width={44}
            height={38}
            priority
            className="h-10 w-auto"
          />
        ) : (
          <>
            <Image
              src="/logo.png"
              alt="MAMP"
              width={44}
              height={38}
              priority
              className="h-10 w-auto dark:hidden"
            />
            <Image
              src="/logo-dark.png"
              alt="MAMP"
              width={44}
              height={38}
              priority
              className="hidden h-10 w-auto dark:block"
            />
          </>
        )}
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              "text-xl font-black tracking-tight",
              light ? "text-white" : "text-foreground"
            )}
          >
            {"MAMP"}
          </span>
          <span
            className={cn(
              "mt-1 text-[10px] font-semibold",
              light ? "text-[#8fc7ff]" : "text-primary",
              taglineClassName
            )}
          >
            {d.common.brandTagline}
          </span>
        </span>
      )}
    </span>
  );
}

/** أيقونة اللوغو فقط — للمساعد الجمعوي والعلامات المصغرة */
export function LogoMark({
  className,
  size = 40,
  light = false,
}: {
  className?: string;
  size?: number;
  light?: boolean;
}) {
  return (
    <Image
      src={light ? "/logo-dark.png" : "/logo.png"}
      alt="MAMP"
      width={size}
      height={size}
      priority
      className={cn("h-auto", className)}
      style={{ width: size }}
    />
  );
}
