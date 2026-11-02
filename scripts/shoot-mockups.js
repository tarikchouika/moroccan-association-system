/**
 * لقطات صور صفحة التطبيق — موك أب الهاتف + دليل Play Protect
 * يولّد الصور بثماني لغات (بخطين Cairo/Inter من Google Fonts — نفس هوية الموقع):
 *   public/app-hero-{lang}.png      (960×640)
 *   public/playprotect-{1..3}-{lang}.png
 * الاستعمال: node scripts/shoot-mockups.js
 */
/* eslint-disable @typescript-eslint/no-require-imports */
const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");

const LANGS = ["ar", "fr", "en", "es", "it", "de", "nl", "ru"];
const PUBLIC = path.resolve(__dirname, "../public");

(async () => {
  // تنظيف الصور القديمة أحادية اللغة (استُبدلت بالنسخ المترجمة)
  for (const old of ["app-hero.png", "playprotect-1.png", "playprotect-2.png", "playprotect-3.png"]) {
    const p = path.join(PUBLIC, old);
    if (fs.existsSync(p)) fs.rmSync(p);
  }

  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1500, height: 1200 },
    deviceScaleFactor: 2,
  });

  const base = "file://" + path.resolve(__dirname, "app-page-mockups.html");
  let count = 0;

  for (const lang of LANGS) {
    await page.goto(`${base}?lang=${lang}`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(250);

    const shots = [
      ["#hero-shot", `app-hero-${lang}.png`, 960, 640],
      ["#pp1", `playprotect-1-${lang}.png`, null, null],
      ["#pp2", `playprotect-2-${lang}.png`, null, null],
      ["#pp3", `playprotect-3-${lang}.png`, null, null],
    ];

    for (const [sel, name, w, h] of shots) {
      const el = page.locator(sel);
      const opts = { path: path.join(PUBLIC, name) };
      if (w && h) {
        // لقطة بحجم مثبت للبطل
        const box = await el.boundingBox();
        await page.setViewportSize({ width: Math.ceil(box.width), height: Math.ceil(box.height) });
        await el.screenshot(opts);
      } else {
        await el.screenshot(opts);
      }
      count++;
      console.log(`  ✓ ${name}`);
    }
  }

  await browser.close();
  console.log(`\n✅ ${count} صورة موثّرة بثماني لغات في public/`);
})();
