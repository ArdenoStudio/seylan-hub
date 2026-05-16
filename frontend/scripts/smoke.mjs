import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

const requiredFiles = [
  "app/page.tsx",
  "app/wallet/page.tsx",
  "app/assistant/page.tsx",
  "app/loans/page.tsx",
  "app/business/page.tsx",
  "app/demo/page.tsx",
  "public/seylan-logo.svg",
  "public/seylan-logo-white.svg",
  "components/layout/DemoModeBadge.tsx",
  "components/assistant/AudioPlayer.tsx",
];

const requiredSnippets = [
  ["app/page.tsx", "aria-label={`Continue as"],
  ["hooks/useWalletRealtime.ts", "seylan:mock-transaction"],
  ["app/wallet/page.tsx", "Polling fallback"],
  ["components/assistant/MessageBubble.tsx", "<AudioPlayer"],
  ["app/demo/page.tsx", "Trigger wallet spend"],
  ["public/manifest.json", "/seylan-logo.svg"],
];

const missing = requiredFiles.filter((file) => !existsSync(join(root, file)));

for (const [file, snippet] of requiredSnippets) {
  const content = readFileSync(join(root, file), "utf8");
  if (!content.includes(snippet)) {
    missing.push(`${file} missing snippet: ${snippet}`);
  }
}

if (missing.length > 0) {
  console.error("Smoke check failed:");
  for (const item of missing) {
    console.error(`- ${item}`);
  }
  process.exit(1);
}

console.log("Smoke check passed: demo-critical frontend files are present.");
