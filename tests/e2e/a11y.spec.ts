import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const locales = ["en", "fa"] as const;
const themes = ["light", "dark"] as const;
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

// WCAG 2.2 AA is the target of the brief; axe covers the automatically checkable part of it.
const tags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"];

async function audit(page: Page, label: string) {
  const { violations } = await new AxeBuilder({ page }).withTags(tags).analyze();
  const summary = violations.map(
    (v) =>
      `${v.id} (${v.impact}): ${v.nodes.length} node(s), e.g. ${v.nodes[0]?.target.join(" ")} — ${v.help}`,
  );
  expect(summary, `axe violations on ${label}`).toEqual([]);
}

test.describe("automated accessibility audit (axe, WCAG 2.2 AA)", () => {
  for (const locale of locales) {
    for (const theme of themes) {
      for (const path of paths) {
        test(`${locale} ${theme} ${path || "/"}`, async ({ page }) => {
          await page.addInitScript((value) => localStorage.setItem("atelier-theme", value), theme);
          await page.goto(`/${locale}${path}`);
          await page.waitForLoadState("networkidle");
          await audit(page, `${locale}/${theme}${path}`);
        });
      }
    }
  }

  test("404 page", async ({ page }) => {
    await page.goto("/en/nothing-here");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await audit(page, "404");
  });

  test("open mobile menu", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/fa");
    await page.getByRole("button", { name: "باز کردن منو" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await audit(page, "mobile menu (fa)");
  });

  test("open lightbox", async ({ page }) => {
    await page.goto("/en/projects/casa-olivo");
    await page.getByRole("button", { name: "Open image 1 of 3" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await audit(page, "lightbox");
  });

  test("contact form with validation errors", async ({ page }) => {
    await page.goto("/fa/contact");
    await page.getByRole("button", { name: "ارسال درخواست" }).click();
    await expect(page.getByText("لطفاً نام خود را وارد کنید.")).toBeVisible();
    await audit(page, "contact errors (fa)");
  });

  test("archive with the filter panel open on a phone", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/en/projects");
    await page.getByRole("button", { name: "Filters" }).click();
    await audit(page, "filters open");
  });
});
