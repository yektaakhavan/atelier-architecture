import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;
// Environments that cannot download Playwright's browsers can point at an existing Chromium:
//   CHROMIUM_PATH=/path/to/chromium npm run test:e2e
const executablePath = process.env.CHROMIUM_PATH;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "on-first-retry",
    launchOptions: executablePath
      ? { executablePath, args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"] }
      : {},
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  // Tests run against the production build, which is what visitors get.
  webServer: {
    command: `npm run build && npm run start -- --port ${PORT}`,
    url: `http://localhost:${PORT}/en`,
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
  },
});
