// فحص بصري شامل للنسخة الثابتة — الوضعان الفاتح والقاتم + استجابة الجوال
/* eslint-disable @typescript-eslint/no-require-imports */
const { chromium } = require("playwright");
const http = require("http");
const fs = require("fs");
const path = require("path");

const OUT = path.resolve(__dirname, "../out");
const PORT = 4173;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "application/javascript",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".json": "application/json",
  ".webmanifest": "application/manifest+json",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
  ".zip": "application/zip",
  ".woff2": "font/woff2",
};

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]);
  if (p.endsWith("/")) p += "index.html";
  let file = path.join(OUT, p);
  if (!fs.existsSync(file) && fs.existsSync(file + ".html")) file += ".html";
  if (fs.existsSync(file) && fs.statSync(file).isFile()) {
    res.writeHead(200, { "Content-Type": MIME[path.extname(file)] || "application/octet-stream" });
    fs.createReadStream(file).pipe(res);
  } else {
    res.writeHead(404); res.end("404");
  }
});

(async () => {
  await new Promise((r) => server.listen(PORT, r));
  const base = `http://localhost:${PORT}`;
  const browser = await chromium.launch();

  const shots = [
    { name: "home-light", url: "/", dark: false, vp: { width: 1360, height: 900 }, full: false },
    { name: "home-dark", url: "/", dark: true, vp: { width: 1360, height: 900 }, full: false },
    { name: "app-light", url: "/app/", dark: false, vp: { width: 1360, height: 900 }, full: true },
    { name: "app-dark", url: "/app/", dark: true, vp: { width: 1360, height: 900 }, full: true },
    { name: "app-mobile", url: "/app/", dark: false, vp: { width: 390, height: 844 }, full: false },
    { name: "assistant-light", url: "/assistant/", dark: false, vp: { width: 1360, height: 900 }, full: false },
    { name: "assistant-dark", url: "/assistant/", dark: true, vp: { width: 1360, height: 900 }, full: false },
    { name: "admin-light", url: "/admin/", dark: false, vp: { width: 1360, height: 900 }, full: false },
    { name: "admin-dark", url: "/admin/", dark: true, vp: { width: 1360, height: 900 }, full: false },
    { name: "associations-light", url: "/associations/", dark: false, vp: { width: 1360, height: 900 }, full: false },
    { name: "associations-dark", url: "/associations/", dark: true, vp: { width: 1360, height: 900 }, full: false },
    { name: "legal-light", url: "/legal/", dark: false, vp: { width: 1360, height: 900 }, full: false },
    { name: "footer-light", url: "/", dark: false, vp: { width: 1360, height: 900 }, full: false, scrollBottom: true },
    { name: "footer-dark", url: "/", dark: true, vp: { width: 1360, height: 900 }, full: false, scrollBottom: true },
  ];

  for (const s of shots) {
    const ctx = await browser.newContext({
      viewport: s.vp,
      deviceScaleFactor: 1,
      colorScheme: s.dark ? "dark" : "light",
    });
    const page = await ctx.newPage();
    await page.addInitScript((dark) => {
      localStorage.setItem("mamp-theme", dark ? "dark" : "light");
    }, s.dark);
    await page.goto(base + s.url, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(400);
    if (s.scrollBottom) await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.screenshot({
      path: path.resolve(__dirname, `../tmp-shots/${s.name}.png`),
      fullPage: s.full,
    });
    await ctx.close();
    console.log("✓", s.name);
  }

  await browser.close();
  server.close();
})();
