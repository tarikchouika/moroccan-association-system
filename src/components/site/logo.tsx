import { cn } from "@/lib/utils";

/** شعار منصة مامب — نجمة ثمانية مغربية + كف الجماعة */
export function Logo({ className, light = false }: { className?: string; light?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 select-none", className)}>
      <span className="relative grid place-items-center">
        <svg width="40" height="40" viewBox="0 0 48 48" fill="none" aria-hidden="true">
          {/* النجمة الثمانية (الختمية) */}
          <path
            d="M24 2l5.2 11.6L41 8.9l-4.7 11.8L48 24l-11.7 3.3L41 39.1l-11.8-4.7L24 46l-5.2-11.6L7 39.1l4.7-11.8L0 24l11.7-3.3L7 8.9l11.8 4.7L24 2z"
            fill="currentColor"
            className={light ? "text-gold" : "text-primary"}
            opacity="0.92"
          />
          <circle cx="24" cy="24" r="9.5" fill="white" fillOpacity="0.14" />
          {/* ميم مامب */}
          <text
            x="24"
            y="29.5"
            textAnchor="middle"
            fontSize="13"
            fontWeight="900"
            fontFamily="Cairo, sans-serif"
            fill={light ? "#0f2018" : "#ffffff"}
          >
            م
          </text>
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span className={cn("text-xl font-black tracking-tight", light ? "text-white" : "text-foreground")}>
          مـامـب
        </span>
        <span className={cn("text-[10px] font-semibold mt-1", light ? "text-gold" : "text-primary")}>
          MAMP · إدارة الجمعيات
        </span>
      </span>
    </span>
  );
}
