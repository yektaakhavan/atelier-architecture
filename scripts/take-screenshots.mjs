// Regenerates the README screenshots from a running production build:
//   npm run build && npm run start -- --port 3100     (in one terminal)
//   npm run docs:screenshots                          (in another)
// Set CHROMIUM_PATH to reuse an existing Chromium, BASE_URL to target another server.
import { chromium } from "@playwright/test";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3100";
const executablePath = process.env.CHROMIUM_PATH;

const shots = [
  { name: "home-en-light", url: "/en", w: 1440, h: 900 },
  { name: "home-fa-dark", url: "/fa", w: 1440, h: 900, theme: "dark" },
  { name: "featured-projects", url: "/en", w: 1440, h: 900, scroll: 950 },
  { name: "projects-archive", url: "/en/projects", w: 1440, h: 900 },
  { name: "project-detail", url: "/en/projects/casa-olivo", w: 1440, h: 900 },
  { name: "journal-article-fa", url: "/fa/journal/reuse-before-rebuild", w: 1280, h: 900 },
  {
    name: "lightbox",
    url: "/en/projects/casa-olivo",
    w: 1024,
    h: 768,
    click: "button[aria-label='Open image 2 of 3']",
  },
  {
    name: "mobile-menu-fa",
    url: "/fa",
    w: 375,
    h: 812,
    theme: "dark",
    click: "button[aria-label='باز کردن منو']",
  },
  {
    name: "mobile-contact-errors-fa",
    url: "/fa/contact",
    w: 375,
    h: 812,
    click: "button[type=submit]",
    scroll: 380,
  },
];

const browser = await chromium.launch({
  executablePath,
  args: executablePath ? ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"] : [],
});

for (const shot of shots) {
  const context = await browser.newContext({
    viewport: { width: shot.w, height: shot.h },
    reducedMotion: "reduce",
  });
  await context.addInitScript(
    (theme) => localStorage.setItem("atelier-theme", theme),
    shot.theme ?? "light",
  );
  const page = await context.newPage();
  await page.goto(`${BASE_URL}${shot.url}`, { waitUntil: "networkidle" });
  if (shot.click) await page.click(shot.click);
  if (shot.scroll) {
    await page.evaluate((y) => window.scrollTo(0, y), shot.scroll);
    await page.waitForLoadState("networkidle"); // lazy images below the fold
  }
  await page.waitForTimeout(400);
  await page.screenshot({ path: `docs/screenshots/${shot.name}.jpg`, type: "jpeg", quality: 82 });
  await context.close();
  console.log("captured", shot.name);
}

await browser.close();
