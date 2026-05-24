import type { BrowserContext, Locator, Page } from "@playwright/test";

export const LIVE_APP =
  process.env.SEYLAN_LIVE_APP ?? "https://seylan-hub-frontend.netlify.app";
export const STATUS_PAGE = "https://seylan-hub-status.netlify.app/";
export const API_DEEP_HEALTH = "https://seylan-hub-api.fly.dev/health/deep";
export const LOCAL_MARKETING = "http://127.0.0.1:3000";

export const wait = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Injected on every document: yellow cursor ring + lower-third caption host. */
export async function installDemoChrome(context: BrowserContext) {
  await context.addInitScript(() => {
    const w = window as unknown as { __seylanDemoUi?: boolean };
    if (w.__seylanDemoUi) return;
    w.__seylanDemoUi = true;

    const boot = () => {
      if (!document.body || document.getElementById("__demo-caption")) return;

      const ring = document.createElement("div");
      ring.id = "__demo-cursor-ring";
      ring.style.cssText =
        "position:fixed;width:44px;height:44px;border:3px solid rgba(255,220,48,0.95);" +
        "border-radius:50%;pointer-events:none;z-index:2147483646;transform:translate(-50%,-50%);" +
        "box-shadow:0 0 0 5px rgba(255,220,48,0.22);display:none;mix-blend-mode:normal;";
      document.body.appendChild(ring);
      document.addEventListener(
        "mousemove",
        (e) => {
          ring.style.display = "block";
          ring.style.left = `${e.clientX}px`;
          ring.style.top = `${e.clientY}px`;
        },
        true
      );

      const cap = document.createElement("div");
      cap.id = "__demo-caption";
      cap.style.cssText =
        "position:fixed;bottom:28px;left:36px;right:36px;max-width:min(960px,92vw);z-index:2147483647;" +
        "padding:14px 22px;background:rgba(10,6,8,0.9);color:#fafafa;font:500 16px/1.45 " +
        "ui-sans-serif,system-ui,sans-serif;border-radius:10px;pointer-events:none;" +
        "border-left:5px solid #E31821;box-shadow:0 12px 48px rgba(0,0,0,0.5);opacity:0;" +
        "transition:opacity 0.35s ease;";
      document.body.appendChild(cap);
    };

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", boot, { once: true });
    } else {
      boot();
    }
  });
}

export async function caption(page: Page, text: string) {
  await page.evaluate((t) => {
    const el = document.getElementById("__demo-caption");
    if (!el) return;
    el.textContent = t;
    el.style.opacity = "1";
  }, text);
}

export async function hideCaption(page: Page) {
  await page.evaluate(() => {
    const el = document.getElementById("__demo-caption");
    if (el) el.style.opacity = "0";
  });
}

export async function smoothScrollBy(page: Page, deltaY: number) {
  const steps = Math.max(6, Math.round(Math.abs(deltaY) / 100));
  const step = deltaY / steps;
  for (let i = 0; i < steps; i++) {
    await page.mouse.wheel(0, step);
    await wait(90);
  }
}

export async function moveAndClick(_page: Page, locator: Locator) {
  const owner = locator.page();
  await locator.scrollIntoViewIfNeeded();
  const box = await locator.boundingBox();
  if (box) {
    await owner.mouse.move(box.x + box.width / 2, box.y + box.height / 2, {
      steps: 16,
    });
    await wait(220);
  }
  await locator.click();
}

/** Wait until assistant Send control is enabled (streaming finished). */
export async function waitForAssistantIdle(page: Page, timeoutMs = 120_000) {
  const send = page.getByRole("button", { name: "Send message" });
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      if (await send.isEnabled()) return;
    } catch {
      /* locator may be stale during re-render */
    }
    await wait(400);
  }
}

export async function showClosingOverlay(page: Page) {
  await page.evaluate(() => {
    const existing = document.getElementById("__closing-overlay");
    if (existing) existing.remove();
    const wrap = document.createElement("div");
    wrap.id = "__closing-overlay";
    wrap.style.cssText =
      "position:fixed;inset:0;z-index:2147483647;display:flex;flex-direction:column;" +
      "align-items:center;justify-content:center;background:linear-gradient(" +
      "to top,rgba(8,4,6,0.92),rgba(8,4,6,0.55));color:#fff;text-align:center;padding:48px;";
    wrap.innerHTML =
      "<h2 style=\"font:600 2rem/1.25 ui-sans-serif;margin:0 0 16px;max-width:900px;\">" +
      "Seylan Hub — AI-powered banking clarity for every Sri Lankan.</h2>" +
      "<p style=\"font:400 15px/1.6 ui-sans-serif;opacity:0.85;max-width:820px;margin:0;\">" +
      "Built with: OpenAI · Groq · Mastercard · Seylan Bank · Supabase · " +
      "ElevenLabs · Arize Phoenix</p>";
    document.body.appendChild(wrap);
  });
}
