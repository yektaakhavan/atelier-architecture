import { expect, test } from "@playwright/test";

const locales = ["en", "fa"] as const;
const paths = [
  "",
  "/projects",
  "/projects/casa-olivo",
  "/services",
  "/about",
  "/contact",
  "/journal",
  "/journal/reuse-before-rebuild",
];
const widths = [320, 375, 768, 1024, 1440];

async function openPage(
  page: import("@playwright/test").Page,
  url: string,
  theme: "light" | "dark",
) {
  await page.addInitScript((value) => localStorage.setItem("atelier-theme", value), theme);
  await page.goto(url);
  await page.waitForLoadState("networkidle");
}

test.describe("no horizontal scrolling", () => {
  for (const locale of locales) {
    for (const path of paths) {
      for (const width of widths) {
        test(`${locale}${path || "/"} at ${width}px`, async ({ page }) => {
          await page.setViewportSize({ width, height: 900 });
          await openPage(page, `/${locale}${path}`, "light");

          const { scrollWidth, clientWidth } = await page.evaluate(() => ({
            scrollWidth: document.documentElement.scrollWidth,
            clientWidth: document.documentElement.clientWidth,
          }));
          expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
          await expect(page.locator("html")).toHaveAttribute(
            "dir",
            locale === "fa" ? "rtl" : "ltr",
          );
        });
      }
    }
  }

  // The dark theme only changes colours, so two widths are enough to catch regressions.
  for (const path of paths) {
    for (const width of [375, 1440]) {
      test(`dark theme, fa${path || "/"} at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await openPage(page, `/fa${path}`, "dark");

        await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        expect(overflow).toBeLessThanOrEqual(0);
      });
    }
  }
});

test.describe("navigation adapts to the viewport", () => {
  test("phones use the menu button and a modal menu", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/en");

    await expect(page.getByRole("navigation", { name: "Primary" }).first()).toBeHidden();
    const opener = page.getByRole("button", { name: "Open menu" });
    await opener.click();

    const menu = page.getByRole("dialog", { name: "Menu" });
    await expect(menu).toBeVisible();
    await expect(menu.getByRole("link", { name: "Projects" })).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    await expect(opener).toBeFocused();
  });

  test("desktops show the full navigation and no menu button", async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto("/en");

    await expect(page.getByRole("link", { name: "Services" }).first()).toBeVisible();
    await expect(page.getByRole("button", { name: "Open menu" })).toBeHidden();
  });

  test("the Persian menu is right-to-left and closes after choosing a page", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/fa");
    await page.getByRole("button", { name: "باز کردن منو" }).click();

    const menu = page.getByRole("dialog", { name: "منو" });
    await menu.getByRole("link", { name: "خدمات" }).click();

    await expect(page).toHaveURL(/\/fa\/services$/);
    await expect(menu).toBeHidden();
  });
});
