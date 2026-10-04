import { defineConfig } from "@playwright/test";

/**
 * End-to-end tests run against the production build:
 *   npm run build && npm run test:e2e
 * (first time: npx playwright install chromium)
 */
export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  retries: 0,
  use: {
    baseURL: "http://localhost:3000",
    // CI/sandbox escape hatch: point at a preinstalled Chromium if provided
    launchOptions: process.env.PW_CHROMIUM
      ? { executablePath: process.env.PW_CHROMIUM }
      : {},
  },
  webServer: {
    command: "npm run start",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
