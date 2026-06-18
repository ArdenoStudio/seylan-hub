import { test, expect, type Page } from "@playwright/test";
import {
  API_DEEP_HEALTH,
  LIVE_APP,
  LOCAL_MARKETING,
  STATUS_PAGE,
  caption,
  hideCaption,
  installDemoChrome,
  moveAndClick,
  showClosingOverlay,
  smoothScrollBy,
  wait,
  waitForAssistantIdle,
} from "./helpers";

const P = 1800;

test.describe.configure({ mode: "serial" });

test("Seylan Hub full product demo (recorded)", async ({ page, context }) => {
  test.setTimeout(600_000);
  await installDemoChrome(context);
  await context.grantPermissions(["microphone"], { origin: LIVE_APP });

  // ── PART 1 — Marketing (local frontend) ─────────────────────────────
  await caption(page, "Part 1 — Marketing site (local)");
  await page.goto(LOCAL_MARKETING, { waitUntil: "networkidle" });
  await wait(2500);

  await caption(page, "Hero — WordRotate cycles through every persona line.");
  await wait(13_000);

  await hideCaption(page);
  await smoothScrollBy(page, 520);
  await wait(P);
  await smoothScrollBy(page, 480);
  await wait(2000);

  await caption(page, "Stats strip — modules, bilingual AI, demo mode.");
  await smoothScrollBy(page, 400);
  await wait(P);

  await caption(page, "Product showcase — Profile, Wallet, Seylan AI, Loans, Business.");
  const tabOrder = ["Profile", "Wallet", "Seylan AI", "Loans", "Business"] as const;
  for (const label of tabOrder) {
    const btn = page.getByRole("button", { name: label, exact: true }).first();
    await moveAndClick(page, btn);
    await wait(2000);
  }

  await hideCaption(page);
  await smoothScrollBy(page, 700);
  await wait(P);
  await caption(page, "Four module cards — wallet, AI, loans, business.");
  await smoothScrollBy(page, 900);
  await wait(P);

  await caption(page, "How it works — three steps; Sinhala + English callout.");
  await page.getByText("How it works", { exact: false }).first().scrollIntoViewIfNeeded();
  await wait(1500);
  await smoothScrollBy(page, 500);
  await wait(P);

  await caption(page, "Technology partners — banks, models, infra.");
  await smoothScrollBy(page, 650);
  await wait(2500);

  await caption(page, "CTA — Open SeylanHub (Ctrl+click opens new tab; we go to production profile).");
  const bannerCta = page
    .locator("section")
    .filter({ has: page.getByRole("heading", { name: /Ready to see your money clearly/i }) })
    .getByRole("link", { name: /Open SeylanHub/i })
    .first();

  await bannerCta.scrollIntoViewIfNeeded();
  await wait(800);
  const [popup] = await Promise.all([
    context.waitForEvent("page", { timeout: 5000 }).catch(() => null),
    bannerCta.click({ modifiers: ["Control"] }),
  ]);
  if (popup && !popup.isClosed()) await popup.close();
  await wait(800);
  await page.goto(`${LIVE_APP}/profile`, { waitUntil: "domcontentloaded" });
  await wait(P);

  // ── PART 2 — Profile / Home ─────────────────────────────────────────
  await caption(page, "Part 2 — Profile / Home — demo account & balances.");
  await expect(page.locator('[data-module="profile"]')).toBeVisible({ timeout: 60_000 });
  await page.getByRole("link", { name: "Profile", exact: true }).first().click();
  await wait(1500);
  await page.getByRole("heading", { level: 1 }).first().scrollIntoViewIfNeeded();
  await wait(2000);

  // ── PART 3 — Wallet + realtime spend ───────────────────────────────
  await caption(page, "Part 3 — Family Wallet — members, buckets, rules.");
  await moveAndClick(page, page.getByRole("link", { name: "Wallet", exact: true }).first());
  await expect(page.locator('[data-module="wallet"]')).toBeVisible();
  await wait(2000);
  await smoothScrollBy(page, 400);
  await wait(P);

  await hideCaption(page);
  const demoAux = await context.newPage();
  await demoAux.goto(`${LIVE_APP}/demo`, { waitUntil: "domcontentloaded" });
  await demoAux.getByRole("button", { name: /trigger wallet spend/i }).click();
  await demoAux.close();
  await page.bringToFront();
  await caption(page, "Live spend pushed from Demo panel — wallet updates via Supabase Realtime.");
  await wait(4000);

  // ── PART 4 — Assistant (EN + SI + voice caption + TTS) ──────────────
  await caption(page, "Part 4 — Seylan AI — English, Sinhala, voice, TTS.");
  await moveAndClick(page, page.getByRole("link", { name: "Seylan AI", exact: true }).first());
  await expect(page.locator('[data-module="assistant"]')).toBeVisible();

  const ta = page.locator("textarea").first();
  await ta.fill(
    "What is my current balance and how much did I spend on groceries this month?"
  );
  await moveAndClick(page, page.getByRole("button", { name: "Send message" }));
  await wait(2000);
  const thinkingBtn = page.getByRole("button", { name: /thinking/i }).first();
  await thinkingBtn.waitFor({ state: "visible", timeout: 30_000 }).catch(() => {});
  await wait(1500);
  if (await thinkingBtn.isVisible().catch(() => false)) {
    await moveAndClick(page, thinkingBtn);
    await wait(2000);
  }
  await waitForAssistantIdle(page);
  await wait(2500);

  await moveAndClick(page, page.getByRole("button", { name: "SI", exact: true }));
  await wait(600);
  await ta.fill("මගේ ණය ගෙවීමේ තත්වය කොහොමද?");
  await moveAndClick(page, page.getByRole("button", { name: "Send message" }));
  await wait(2000);
  await waitForAssistantIdle(page, 150_000);
  await wait(2500);

  await caption(
    page,
    "Voice: in a live walkthrough, hold the mic and speak; here we type the same intent for a reliable take."
  );
  await moveAndClick(page, page.getByRole("button", { name: "EN", exact: true }));
  await wait(400);
  await ta.fill("Show me my recent transactions");
  await moveAndClick(page, page.getByRole("button", { name: "Send message" }));
  await waitForAssistantIdle(page);
  await wait(2000);

  const playBtn = page.getByRole("button", { name: /play assistant response/i });
  if (await playBtn.isVisible().catch(() => false)) {
    await caption(page, "ElevenLabs TTS — Play reads the answer aloud (enable speakers for capture).");
    await moveAndClick(page, playBtn.last());
    await wait(8000);
  }

  const showThinking = page.getByRole("button", { name: /show thinking/i }).first();
  if (await showThinking.isVisible().catch(() => false)) {
    await moveAndClick(page, showThinking);
    await wait(2500);
  }

  // ── PART 5 — Loans + optional MPGS ───────────────────────────────────
  await caption(page, "Part 5 — Loan health, timeline, advisor, payments.");
  await moveAndClick(page, page.getByRole("link", { name: "Loans", exact: true }).first());
  await expect(page.locator('[data-module="loans"]')).toBeVisible();
  await wait(2000);
  await smoothScrollBy(page, 450);
  await wait(P);

  await page.locator("#loan-advisor").scrollIntoViewIfNeeded();
  await wait(2500);

  await moveAndClick(page, page.getByRole("link", { name: "Seylan AI", exact: true }).first());
  await wait(800);
  await ta.fill(
    "Can I afford to make an extra payment this month without affecting my savings goal?"
  );
  await moveAndClick(page, page.getByRole("button", { name: "Send message" }));
  await waitForAssistantIdle(page, 150_000);
  await wait(2500);

  await moveAndClick(page, page.getByRole("link", { name: "Loans", exact: true }).first());
  await wait(1000);
  await moveAndClick(page, page.getByRole("button", { name: "Make Payment" }));
  await wait(1000);

  const mpgsHandled = await tryMpgsCardFlow(page);
  if (!mpgsHandled) {
    await caption(
      page,
      "MPGS Hosted Checkout is feature-flagged on some deployments; sandbox or Demo Mode applies."
    );
    await wait(3000);
    await page.keyboard.press("Escape").catch(() => {});
  }

  await page.goto(`${LIVE_APP}/business`, { waitUntil: "domcontentloaded" });
  await wait(1200);

  // ── PART 6 — Business + tax jar realtime ─────────────────────────────
  await caption(page, "Part 6 — Business P&L, AI categories, Tax Jar.");
  await expect(page.locator('[data-module="business"]')).toBeVisible();
  await wait(2000);
  await smoothScrollBy(page, 500);
  await wait(P);

  const demoAux2 = await context.newPage();
  await demoAux2.goto(`${LIVE_APP}/demo`, { waitUntil: "domcontentloaded" });
  await demoAux2.getByRole("button", { name: /trigger tax jar/i }).click();
  await demoAux2.close();
  await page.bringToFront();
  await caption(page, "Tax Jar accrual triggered from Demo — balance updates live on Business.");
  await wait(4000);

  await moveAndClick(page, page.getByRole("button", { name: /accept card payment/i }));
  await wait(800);
  await tryMpgsTaxJar(page);

  await page.goto(`${LIVE_APP}/metrics`, { waitUntil: "domcontentloaded" });
  await wait(1200);

  // ── PART 7 — Metrics ────────────────────────────────────────────────
  await caption(page, "Part 7 — Metrics — agent cards & Phoenix observability.");
  await expect(page.locator('[data-module="metrics"]')).toBeVisible();
  await wait(2000);
  await smoothScrollBy(page, 400);
  await wait(2000);

  // ── PART 8 — Demo control panel (same tab) ──────────────────────────
  await caption(page, "Part 8 — Demo control panel — spend, tax, reset, prewarm.");
  await page.goto(`${LIVE_APP}/demo`, { waitUntil: "domcontentloaded" });
  await wait(1500);
  await smoothScrollBy(page, 200);
  await moveAndClick(page, page.getByRole("button", { name: /reset demo/i }));
  await wait(2500);
  await moveAndClick(page, page.getByRole("link", { name: "Wallet", exact: true }).first());
  await wait(2000);

  // ── PART 9 — Status + API health ─────────────────────────────────────
  await caption(page, "Part 9 — Public status page & deep API health JSON.");
  const statusPage = await context.newPage();
  await statusPage.goto(STATUS_PAGE, { waitUntil: "domcontentloaded" });
  await wait(3000);
  await smoothScrollBy(statusPage, 600);
  await wait(2000);
  await statusPage.close();

  const health = await context.newPage();
  await health.goto(API_DEEP_HEALTH, { waitUntil: "domcontentloaded" });
  await caption(health, "Deep health — Supabase, Groq, OpenAI, ElevenLabs checks.");
  await wait(5000);
  await health.close();

  // ── PART 10 — Closing on local hero ──────────────────────────────────
  await page.bringToFront();
  await caption(page, "Part 10 — Closing on the marketing hero.");
  await page.goto(LOCAL_MARKETING, { waitUntil: "networkidle" });
  await wait(2000);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  await wait(12_000);
  await showClosingOverlay(page);
  await wait(7000);
});

/**
 * Attempt Mastercard Hosted Checkout on the redirected page.
 * Returns true if navigation to a gateway-like URL was observed.
 */
async function tryMpgsCardFlow(page: Page): Promise<boolean> {
  const dialogPay = page.getByRole("button", { name: /^Pay / });
  await dialogPay.click({ timeout: 8000 }).catch(() => {});
  try {
    await page.waitForURL(/session|gateway|mastercard|mpgs|checkout|ap\.gateway/i, {
      timeout: 22_000,
    });
  } catch {
    return false;
  }

  await wait(3000);

  const cardInputs = [
    page.locator('input[name="card.number"], input[name="cardNumber"], #card-number'),
    page.frameLocator("iframe").first().locator("input[type='text'], input[type='tel']").first(),
  ];

  for (const target of cardInputs) {
    const first = target.first();
    try {
      await first.waitFor({ state: "visible", timeout: 10_000 });
      await first.fill("5123450000000008");
      const exp = page
        .locator(
          'input[name*="expir" i], input[placeholder*="MM" i], input[id*="expiry" i]'
        )
        .first();
      if (await exp.isVisible().catch(() => false)) await exp.fill("0139");
      const cvv = page
        .locator('input[name*="cvv" i], input[name*="security" i], input[id*="cvv" i]')
        .first();
      if (await cvv.isVisible().catch(() => false)) await cvv.fill("100");
      const name = page
        .locator('input[name*="holder" i], input[name*="name" i], input[id*="name" i]')
        .first();
      if (await name.isVisible().catch(() => false)) await name.fill("KASUN PERERA");
      await page
        .getByRole("button", { name: /pay|submit|continue|purchase/i })
        .first()
        .click({ timeout: 8000 })
        .catch(() => {});
      await wait(10_000);
      return true;
    } catch {
      /* try next locator strategy */
    }
  }
  return true;
}

async function tryMpgsTaxJar(page: Page) {
  const charge = page.getByRole("button", { name: /^Charge / });
  if (await charge.isVisible().catch(() => false)) {
    await charge.click().catch(() => {});
    await wait(4000);
  }
  await page.keyboard.press("Escape").catch(() => {});
}
