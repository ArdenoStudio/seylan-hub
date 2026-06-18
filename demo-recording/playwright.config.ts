import { defineConfig, devices } from "@playwright/test";

const LOCAL_MARKETING = "http://127.0.0.1:3000";

/**
 * Marketing site runs from this repo's `frontend` app (there is no separate seylanhub-www package).
 * Playwright starts it automatically unless something is already listening on port 3000.
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  workers: 1,
  timeout: 600_000,
  expect: { timeout: 90_000 },
  reporter: [["list"]],
  outputDir: "./test-output",
  use: {
    ...devices["Desktop Chrome"],
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
    video: { mode: "on", size: { width: 1920, height: 1080 } },
    launchOptions: {
      slowMo: 60,
    },
  },
  webServer: {
    command: "cd ../frontend && npm run dev -- -p 3000",
    url: LOCAL_MARKETING,
    reuseExistingServer: true,
    timeout: 180_000,
  },
});
