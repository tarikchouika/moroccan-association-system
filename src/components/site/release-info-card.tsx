"use client";

/**
 * بطاقة معلومات أحدث إصدار — تحاول جلب latest.json من رابط كلاودفلير المباشر
 * (مشروع mamp-dl الذي ينشره سير عمل GitHub آلياً) ثم تعود لواجهة GitHub.
 * تتضمن زر تحميل مباشراً من كلاودفلير + رابطاً احتياطياً من GitHub.
 */
import { useEffect, useState } from "react";
import { Tag, CalendarDays, HardDrive, RefreshCw, Download, Cloud, Github } from "lucide-react";
import { LANGUAGES, sizeUnits } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/provider";

/** رابط التحميل المباشر من كلاودفلير — يخدم دائماً آخر إصدار */
const CF_LATEST_JSON = "https://mamp-dl.pages.dev/latest.json";
const CF_DOWNLOAD_URL = "https://mamp-dl.pages.dev/mamp.apk";
const GH_RELEASE_API =
  "https://api.github.com/repos/tarikchouika/moroccan-association-system/releases/latest";
const GH_DOWNLOAD_URL =
  "https://github.com/tarikchouika/moroccan-association-system/releases/latest/download/mamp.apk";

interface ReleaseInfo {
  tag: string;
  name: string;
  date: string;
  sizeMB: string | null;
}

export function ReleaseInfoCard() {
  const { d, lang } = useI18n();
  const [info, setInfo] = useState<ReleaseInfo | null>(null);
  const [failed, setFailed] = useState(false);

  const units = sizeUnits(lang);
  const dateLocale = LANGUAGES[lang].dateLocale;

  function formatSize(bytes: number): string {
    if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} ${units.kb}`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} ${units.mb}`;
  }

  useEffect(() => {
    let cancelled = false;

    async function fromCloudflare(): Promise<ReleaseInfo | null> {
      const r = await fetch(CF_LATEST_JSON, { cache: "no-store" });
      if (!r.ok) return null;
      const d = await r.json();
      if (!d?.tag) return null;
      return {
        tag: String(d.tag).replace(/^app-/, ""),
        name: d.name ?? "",
        date: d.date ? new Date(d.date).toLocaleDateString(dateLocale) : "",
        sizeMB: d.size ? formatSize(Number(d.size)) : null,
      };
    }

    async function fromGitHub(): Promise<ReleaseInfo | null> {
      const r = await fetch(GH_RELEASE_API, {
        headers: { Accept: "application/vnd.github+json" },
      });
      if (!r.ok) return null;
      const data = await r.json();
      const apk = (data.assets ?? []).find((a: { name: string }) => a.name === "mamp.apk");
      return {
        tag: (data.tag_name ?? "").replace(/^app-/, ""),
        name: data.name ?? "",
        date: data.published_at ? new Date(data.published_at).toLocaleDateString(dateLocale) : "",
        sizeMB: apk ? formatSize(apk.size) : null,
      };
    }

    (async () => {
      try {
        const cf = await fromCloudflare().catch(() => null);
        if (cancelled) return;
        if (cf) {
          setInfo(cf);
          return;
        }
        const gh = await fromGitHub();
        if (cancelled) return;
        if (gh) setInfo(gh);
        else setFailed(true);
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  const rows: Array<{ icon: typeof Tag; label: string; value: string }> = [
    { icon: Tag, label: d.release.versionLabel, value: info?.tag ?? "—" },
    { icon: CalendarDays, label: d.release.dateLabel, value: info?.date ?? "—" },
    { icon: HardDrive, label: d.release.sizeLabel, value: info?.sizeMB ?? "—" },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h3 className="mb-4 flex items-center gap-2 text-sm font-extrabold">
        <RefreshCw className="size-4 text-primary" />
        {d.release.title}
      </h3>

      {failed && !info ? (
        <p className="text-[13px] leading-7 text-muted-foreground">
          {d.release.failedText}
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

      {/* التحميل المباشر من كلاودفلير */}
      <a
        href={CF_DOWNLOAD_URL}
        download
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-extrabold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:opacity-95 active:scale-[0.98]"
      >
        <Cloud className="size-4.5" />
        {d.release.downloadBtn}
      </a>
      <p className="mt-2 text-center text-[11px] leading-5 text-muted-foreground">
        {d.release.downloadNote}
      </p>

      {/* رابط احتياطي: GitHub */}
      <a
        href={GH_DOWNLOAD_URL}
        download
        className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-[13px] font-bold text-foreground transition-all hover:border-primary/40 hover:text-primary"
      >
        <Github className="size-4" />
        {d.release.backupBtn}
      </a>

      <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[10px] text-muted-foreground">
        <Download className="size-3" />
        mamp-dl.pages.dev/mamp.apk
      </p>
    </div>
  );
}
