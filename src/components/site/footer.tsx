import Link from "next/link";
import { Landmark, Scale, ShieldCheck, Bot, ExternalLink, Mail } from "lucide-react";
import { Logo } from "@/components/site/logo";
import { OFFICIAL_LINKS } from "@/lib/kb/data";

/** التذييل — روابط رسمية موثقة فقط */
export function Footer() {
  const officialPortals = [
    OFFICIAL_LINKS.maroc,
    OFFICIAL_LINKS.sgg,
    OFFICIAL_LINKS.interieur,
    OFFICIAL_LINKS.tax,
    OFFICIAL_LINKS.ice,
    OFFICIAL_LINKS.cnss,
    OFFICIAL_LINKS.cndp,
    OFFICIAL_LINKS.asd,
  ];

  return (
    <footer className="no-print gradient-dark zellige-pattern text-white mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-12">
          {/* الهوية */}
          <div className="md:col-span-5 space-y-4">
            <Logo light />
            <p className="text-sm leading-7 text-white/70 max-w-md">
              منصة رقمية مغربية لإدارة وتسيير الجمعيات: الانخراطات، المحاسبة، التبرعات،
              الفعاليات والوثائق الرسمية — وفق الظهير الشريف 1.58.376 كما غيّره القانون 75.00،
              وباحترام القانون 09.08 لحماية المعطيات الشخصية.
            </p>
            <div className="flex flex-wrap gap-2 text-[11px] font-bold">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5">
                <Scale className="size-3.5 text-gold" />
                متوافق مع القانون 75.00
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5">
                <ShieldCheck className="size-3.5 text-gold" />
                حماية المعطيات (CNDP)
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5">
                <Bot className="size-3.5 text-gold" />
                مساعد بلا هلوسة
              </span>
            </div>
          </div>

          {/* روابط المنصة */}
          <div className="md:col-span-3">
            <h3 className="mb-4 text-sm font-extrabold text-gold">المنصة</h3>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li><Link className="hover:text-white transition-colors" href="/associations">دليل الجمعيات</Link></li>
              <li><Link className="hover:text-white transition-colors" href="/legal">المرجع القانوني</Link></li>
              <li><Link className="hover:text-white transition-colors" href="/assistant">المساعد الجمعوي</Link></li>
              <li><Link className="hover:text-white transition-colors" href="/login">دخول الأعضاء</Link></li>
              <li><Link className="hover:text-white transition-colors" href="/register">إنشاء حساب</Link></li>
              <li><Link className="hover:text-white transition-colors" href="/dashboard">لوحة التحكم</Link></li>
            </ul>
          </div>

          {/* بوابات رسمية */}
          <div className="md:col-span-4">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-extrabold text-gold">
              <Landmark className="size-4" />
              بوابات رسمية موثقة
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
          <p>© 2026 منصة مامب — جميع الحقوق محفوظة.</p>
          <p className="flex items-center gap-1.5 text-center">
            <Mail className="size-3.5" />
            المعلومة القانونية إرشادية؛ الرجوع دائماً للنصوص الرسمية والمختصين.
          </p>
        </div>
      </div>
    </footer>
  );
}
