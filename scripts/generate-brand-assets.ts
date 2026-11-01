/**
 * مولد الأصول البصرية — أيقونات PWA + أيقونات تطبيق أندرويد
 * يقرأ شعار المنصة (logo.svg) وينتج كل المقاسات المطلوبة.
 * التنفيذ: bun scripts/generate-brand-assets.ts
 */
import sharp from "sharp";
import { mkdirSync, existsSync, writeFileSync } from "fs";
import { resolve } from "path";

const ROOT = resolve(__dirname, "..");
const BRAND_GREEN = "#0d6b4f";
const BRAND_DARK = "#0b1410";

/** الشعار الأصلي مع خلفية خضراء بدل الداكنة */
const greenSvg = (bg: string, radius = 4) => `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
  <path fill="${bg}" d="M24.51,28.51H5.49c-2.21,0-4-1.79-4-4V5.49c0-2.21,1.79-4,4-4h19.03c2.21,0,4,1.79,4,4v19.03C28.51,26.72,26.72,28.51,24.51,28.51z"/>
  <path fill="#ffffff" d="M15.47,7.1l-1.3,1.85c-0.2,0.29-0.54,0.47-0.9,0.47h-7.1V7.09C6.16,7.1,15.47,7.1,15.47,7.1z"/>
  <polygon fill="#ffffff" points="24.3,7.1 13.14,22.91 5.7,22.91 16.86,7.1"/>
  <path fill="#ffffff" d="M14.53,22.91l1.31-1.86c0.2-0.29,0.54-0.47,0.9-0.47h7.09v2.33H14.53z"/>
</svg>`;

/** العلامة البيضاء فقط (بدون خلفية) — للتراكب */
const markSvg = `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
  <path fill="#ffffff" d="M15.47,7.1l-1.3,1.85c-0.2,0.29-0.54,0.47-0.9,0.47h-7.1V7.09C6.16,7.1,15.47,7.1,15.47,7.1z"/>
  <polygon fill="#ffffff" points="24.3,7.1 13.14,22.91 5.7,22.91 16.86,7.1"/>
  <path fill="#ffffff" d="M14.53,22.91l1.31-1.86c0.2-0.29,0.54-0.47,0.9-0.47h7.09v2.33H14.53z"/>
</svg>`;

async function pngFromSvg(svg: string, size: number, file: string) {
  await sharp(Buffer.from(svg), { density: 480 })
    .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(file);
  console.log(`  ✓ ${file.replace(ROOT + "/", "")} (${size}x${size})`);
}

/** أيقونة maskable: خلفية خضراء كاملة + العلامة في منطقة الأمان (66%) */
async function maskableIcon(size: number, file: string) {
  const markSize = Math.round(size * 0.66);
  const offset = Math.round((size - markSize) / 2);
  const mark = await sharp(
    Buffer.from(markSvg),
    { density: 480 }
  ).resize(markSize, markSize).png().toBuffer();
  await sharp({
    create: { width: size, height: size, channels: 4, background: BRAND_GREEN },
  })
    .composite([{ input: mark, left: offset, top: offset }])
    .png()
    .toFile(file);
  console.log(`  ✓ ${file.replace(ROOT + "/", "")} (${size}x${size}, maskable)`);
}

/** أيقونة أندرويد التقليدية بزوايا مستديرة */
async function legacyIcon(size: number, file: string) {
  await pngFromSvg(greenSvg(BRAND_GREEN), size, file);
}

/** الطبقة الأمامية للأيقونة التكيفية (شفافة، العلامة 60%) */
async function adaptiveForeground(file: string) {
  const size = 432;
  const markSize = Math.round(size * 0.6);
  const offset = Math.round((size - markSize) / 2);
  const mark = await sharp(
    Buffer.from(markSvg),
    { density: 480 }
  ).resize(markSize, markSize).png().toBuffer();
  await sharp({
    create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([{ input: mark, left: offset, top: offset }])
    .png()
    .toFile(file);
  console.log(`  ✓ ${file.replace(ROOT + "/", "")} (adaptive foreground)`);
}

async function main() {
  console.log("==> [1] أيقونات PWA");
  mkdirSync(resolve(ROOT, "public"), { recursive: true });
  await legacyIcon(192, resolve(ROOT, "public/icon-192.png"));
  await legacyIcon(512, resolve(ROOT, "public/icon-512.png"));
  await maskableIcon(512, resolve(ROOT, "public/icon-512-maskable.png"));

  console.log("==> [2] أيقونات تطبيق أندرويد");
  const res = resolve(ROOT, "app-android/app/src/main/res");
  const densities: Array<[string, number]> = [
    ["mipmap-mdpi", 48],
    ["mipmap-hdpi", 72],
    ["mipmap-xhdpi", 96],
    ["mipmap-xxhdpi", 144],
    ["mipmap-xxxhdpi", 192],
  ];
  for (const [dir, size] of densities) {
    mkdirSync(resolve(res, dir), { recursive: true });
    await legacyIcon(size, resolve(res, dir, "ic_launcher.png"));
  }
  mkdirSync(resolve(res, "mipmap-xxxhdpi"), { recursive: true });
  await adaptiveForeground(resolve(res, "mipmap-xxxhdpi/ic_launcher_foreground.png"));

  /** أيقونات تكيفية XML (أندرويد 8+) */
  const anydpi = resolve(res, "mipmap-anydpi-v26");
  mkdirSync(anydpi, { recursive: true });
  writeFileSync(
    resolve(anydpi, "ic_launcher.xml"),
    `<?xml version="1.0" encoding="utf-8"?>\n<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">\n    <background android:drawable="@color/ic_launcher_background"/>\n    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>\n</adaptive-icon>\n`
  );

  /** شعار شاشة البداية (العلامة البيضاء على شفاف) */
  mkdirSync(resolve(res, "drawable-nodpi"), { recursive: true });
  await sharp(Buffer.from(markSvg), { density: 480 })
    .resize(240, 240)
    .png()
    .toFile(resolve(res, "drawable-nodpi/ic_splash_logo.png"));
  console.log("  ✓ drawable-nodpi/ic_splash_logo.png");

  console.log("==> ✅ اكتمل توليد كل الأصول البصرية");
}

main().catch((e) => {
  console.error("فشل التوليد:", e);
  process.exit(1);
});
