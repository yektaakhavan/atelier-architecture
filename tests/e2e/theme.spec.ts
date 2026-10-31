import { expect, test } from "@playwright/test";

const DARK_BACKGROUND = "rgb(23, 25, 22)"; // #171916
const LIGHT_BACKGROUND = "rgb(245, 243, 238)"; // #F5F3EE

test.describe("theme", () => {
  test("the stored theme is applied before any JavaScript bundle loads (no flash)", async ({
    page,
  }) => {
    // Without the page's scripts only the tiny inline snippet in <head> can have set the theme.
    await page.route("**/_next/static/**/*.js", (route) => route.abort());
    await page.addInitScript(() => localStorage.setItem("atelier-theme", "dark"));
    await page.goto("/en");

    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(page.locator("body")).toHaveCSS("background-color", DARK_BACKGROUND);
  });

  test("a stored light theme wins over a dark system preference", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.addInitScript(() => localStorage.setItem("atelier-theme", "light"));
    await page.goto("/en");

    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await expect(page.locator("body")).toHaveCSS("background-color", LIGHT_BACKGROUND);
  });

  test("first visits follow the system preference", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/en");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });

  test("the toggle changes the whole page and the choice persists across pages", async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/en");
    await page.getByRole("banner").getByRole("button", { name: "Switch to dark theme" }).click();

    await expect(page.locator("body")).toHaveCSS("background-color", DARK_BACKGROUND);
    await page.getByRole("banner").getByRole("link", { name: "About" }).click();
    await expect(page).toHaveURL(/\/en\/about$/);
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(
      page.getByRole("banner").getByRole("button", { name: "Switch to light theme" }),
    ).toBeVisible();
  });

  test("the artwork loads and is identical in both themes", async ({ page }) => {
    await page.goto("/en");
    const art = page.getByRole("img", { name: /Illustration of Casa Olivo/ }).first();
    await art.scrollIntoViewIfNeeded();
    await expect
      .poll(() => art.evaluate((el: HTMLImageElement) => el.naturalWidth))
      .toBeGreaterThan(0);
    const light = await art.getAttribute("src");

    await page.getByRole("banner").getByRole("button", { name: "Switch to dark theme" }).click();
    expect(await art.getAttribute("src")).toBe(light);
  });
});
