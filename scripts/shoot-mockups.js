// لقطات صور صفحة التطبيق — موك أب الهاتف + دليل Play Protect
/* eslint-disable @typescript-eslint/no-require-imports */
const { chromium } = require("playwright");
const path = require("path");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1400, height: 1000 },
    deviceScaleFactor: 2,
  });
  const url = "file://" + path.resolve(__dirname, "app-page-mockups.html");
  await page.goto(url, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);

  const shots = [
    ["#hero-shot", "app-hero.png", 960, 640],
    ["#pp1", "playprotect-1.png", 560, null],
    ["#pp2", "playprotect-2.png", 560, null],
    ["#pp3", "playprotect-3.png", 560, null],
  ];

  for (const [sel, name] of shots) {
    const el = page.locator(sel);
    await el.scrollIntoViewIfNeeded();
    await el.screenshot({ path: path.resolve(__dirname, "../public", name) });
    console.log("✓", name);
  }

  await browser.close();
})();
