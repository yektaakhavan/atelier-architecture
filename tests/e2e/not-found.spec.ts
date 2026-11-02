import { expect, test } from "@playwright/test";

// Next.js 16 sends an empty error shell for notFound() and renders the page in the browser,
// so these checks only make sense in a real browser, not against the raw HTML.
test.describe("404 pages", () => {
  test("an unknown Persian page is a 404 with Persian, right-to-left content", async ({ page }) => {
    const response = await page.goto("/fa/does-not-exist");

    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("این صفحه وجود ندارد");
    await expect(page.locator("html")).toHaveAttribute("lang", "fa");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByRole("link", { name: "خدمات ما" })).toBeVisible();
  });

  test("an unknown project is a 404 with useful ways back", async ({ page }) => {
    const response = await page.goto("/en/projects/not-a-project");

    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("This page does not exist");
    await page.getByRole("link", { name: "Back to home" }).click();
    await expect(page).toHaveURL(/\/en$/);
  });

  test("an unknown article is a 404", async ({ page }) => {
    const response = await page.goto("/en/journal/not-an-article");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("This page does not exist");
  });

  test("the root redirects to English", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/en$/);
  });

  test("a 404 page follows the saved theme, even though Next.js renders it in the browser", async ({
    page,
  }) => {
    await page.addInitScript(() => localStorage.setItem("atelier-theme", "dark"));
    await page.goto("/en/does-not-exist");

    await expect(page.getByRole("heading", { level: 1 })).toHaveText("This page does not exist");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(page.locator("body")).toHaveCSS("background-color", "rgb(23, 25, 22)");
  });

  test("a 404 page follows the system preference on a first visit", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/fa/projects/not-a-project");

    await expect(page.getByRole("heading", { level: 1 })).toHaveText("این صفحه وجود ندارد");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });
});
