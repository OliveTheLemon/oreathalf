import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";
const baseURLObject = new URL(baseURL);
const isLocalTarget = ["localhost", "127.0.0.1", "::1", "[::1]"].includes(
  baseURLObject.hostname,
);
const localPort = baseURLObject.port || "3000";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
  ],
  workers: 2,
  use: {
    baseURL,
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: isLocalTarget
    ? {
        command: `npm run dev -- --hostname 127.0.0.1 --port ${localPort}`,
        url: baseURLObject.origin,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      }
    : undefined,
});
