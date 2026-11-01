"use client";

/**
 * بطاقة معلومات أحدث إصدار — تجلب بيانات آخر إصدار من GitHub (مستودع عمومي)
 * وتعرض الإصدار والحجم والتاريخ وبصمة الشهادة، مع تدهور رشيق عند تعذر الاتصال.
 */
import { useEffect, useState } from "react";
import { Tag, CalendarDays, HardDrive, RefreshCw, ShieldCheck } from "lucide-react";

const RELEASE_API =
  "https://api.github.com/repos/tarikchouika/moroccan-association-system/releases/latest";
const DOWNLOAD_URL =
  "https://github.com/tarikchouika/moroccan-association-system/releases/latest/download/mamp.apk";

interface ReleaseInfo {
  tag: string;
  name: string;
  date: string;
  sizeMB: string | null;
  fingerprint: string | null;
}

function formatSize(bytes: number): string {
  return (bytes / (1024 * 1024)).toFixed(1);
}

export function ReleaseInfoCard() {
  const [info, setInfo] = useState<ReleaseInfo | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(RELEASE_API, { headers: { Accept: "application/vnd.github+json" } })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("failed"))))
      .then((data) => {
        if (cancelled) return;
        const apk = (data.assets ?? []).find((a: { name: string }) => a.name === "mamp.apk");
        const body: string = data.body ?? "";
        // بصمة الشهادة بصيغة الإصدارات الجديدة أو القديمة
        const fpMatch =
          body.match(/بصمة الشهادة \(SHA-256\):\s*`?([0-9a-f:]+)`?/i) ??
          body.match(/Signer #1 certificate SHA-256 digest:\s*([0-9a-f:]+)/i);
        setInfo({
          tag: (data.tag_name ?? "").replace(/^app-/, ""),
          name: data.name ?? "",
          date: data.published_at ? new Date(data.published_at).toLocaleDateString("ar-MA") : "",
          sizeMB: apk ? formatSize(apk.size) : null,
          fingerprint: fpMatch ? fpMatch[1] : null,
        });
      })
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
    };
  }, []);

  const rows: Array<{ icon: typeof Tag; label: string; value: string }> = [
    { icon: Tag, label: "الإصدار", value: info?.tag ?? "—" },
    { icon: CalendarDays, label: "تاريخ النشر", value: info?.date ?? "—" },
    { icon: HardDrive, label: "حجم الملف", value: info?.sizeMB ? `${info.sizeMB} م.ب` : "—" },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h3 className="mb-4 flex items-center gap-2 text-sm font-extrabold">
        <RefreshCw className="size-4 text-primary" />
        معلومات أحدث إصدار
      </h3>

      {failed && !info ? (
        <p className="text-[13px] leading-7 text-muted-foreground">
          تعذر جلب تفاصيل الإصدار حالياً — الرابط الدائم بالأسفل يوجهكم دائماً
          لآخر نسخة رسمية.
        </p>
      ) : (
        <dl className="grid grid-cols-3 gap-3">
          {rows.map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-xl bg-muted/50 p-3 text-center">
              <dt className="mb-1 flex items-center justify-center gap-1 text-[11px] font-bold text-muted-foreground">
                <Icon className="size-3" />
                {label}
              </dt>
              <dd className="text-sm font-extrabold">{value}</dd>
            </div>
          ))}
        </dl>
      )}

      {info?.fingerprint && (
        <div className="mt-4 rounded-xl border border-gold/30 bg-gold-soft/40 p-3">
          <p className="flex items-center gap-1.5 text-[11px] font-extrabold text-foreground">
            <ShieldCheck className="size-3.5 text-primary" />
            بصمة شهادة التوقيع (SHA-256)
          </p>
          <code dir="ltr" className="mt-1 block break-all text-[10px] leading-5 text-muted-foreground">
            {info.fingerprint}
          </code>
        </div>
      )}

      <a
        href={DOWNLOAD_URL}
        download
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-extrabold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:opacity-95 active:scale-[0.98]"
      >
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3v12" />
          <path d="m7 10 5 5 5-5" />
          <path d="M5 21h14" />
        </svg>
        تحميل ملف APK — آخر إصدار رسمي
      </a>
      <p className="mt-2 text-center text-[11px] leading-5 text-muted-foreground">
        الرابط دائم: يوجه دائماً لأحدث إصدار موقّع تلقائياً من المستودع الرسمي.
      </p>
    </div>
  );
}
