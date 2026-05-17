/**
 * Short browser recording (no Jest/Playwright test harness) — hero + live profile.
 * Run from repo: `node demo-recording/scripts/short-record.mjs`
 * Requires local marketing site on http://127.0.0.1:3000
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const outDir = join(process.cwd(), "artifacts");
mkdirSync(outDir, { recursive: true });

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1920, height: 1080 },
  deviceScaleFactor: 1,
  recordVideo: { dir: outDir, size: { width: 1920, height: 1080 } },
});

const page = await context.newPage();

await page.goto("http://127.0.0.1:3000/", { waitUntil: "networkidle", timeout: 60_000 });
await wait(2500);
await page.screenshot({ path: join(outDir, "peek-01-hero.png"), fullPage: false });
await wait(8000);
await page.evaluate(() => window.scrollBy({ top: 900, behavior: "smooth" }));
await wait(3000);
await page.screenshot({ path: join(outDir, "peek-02-scrolled.png"), fullPage: false });

await page.goto("https://seylan-hub-frontend.netlify.app/profile", {
  waitUntil: "domcontentloaded",
  timeout: 60_000,
});
await wait(4000);
await page.screenshot({ path: join(outDir, "peek-03-profile.png"), fullPage: false });

await context.close();
await browser.close();

console.log("Done. Screenshots and WebM are in:", outDir);
