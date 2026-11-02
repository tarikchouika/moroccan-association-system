/**
 * تحقق نصي — يفتح صفحة الموك أب بكل لغة ويطبع النصوص المحقونة للتدقيق
 */
/* eslint-disable @typescript-eslint/no-require-imports */
const { chromium } = require("playwright");
const path = require("path");

const LANGS = ["ar", "fr", "en", "es", "it", "de", "nl", "ru"];
const base = "file://" + path.resolve(__dirname, "app-page-mockups.html");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1500, height: 1200 } });
  for (const lang of LANGS) {
    await page.goto(`${base}?lang=${lang}`, { waitUntil: "networkidle" });
    const data = await page.evaluate(() => {
      const g = (id) => document.getElementById(id)?.textContent?.trim() ?? "⚠️ MISSING";
      return {
        dir: document.documentElement.dir,
        title: g("h-title"),
        sub: g("h-sub").slice(0, 40),
        pp1: g("pp1-title"),
        pp1btn: g("pp1-more"),
        pp2: g("pp2-toggle"),
        pp3: g("pp3-title"),
        pp3open: g("pp3-open"),
      };
    });
    console.log(`[${lang}] dir=${data.dir}`);
    console.log(`   hero: ${data.title} | ${data.sub}…`);
    console.log(`   pp1: ${data.pp1} → «${data.pp1btn}» | pp2: ${data.pp2} | pp3: ${data.pp3} → «${data.pp3open}»`);
  }
  await browser.close();
})();
