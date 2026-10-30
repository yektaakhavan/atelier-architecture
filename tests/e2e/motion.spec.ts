import { expect, test } from "@playwright/test";

const duration = (page: import("@playwright/test").Page, selector: string) =>
  page
    .locator(selector)
    .first()
    .evaluate((el) => {
      const style = getComputedStyle(el);
      return { name: style.animationName, seconds: parseFloat(style.animationDuration) };
    });

test.describe("with default motion settings", () => {
  test("the hero title animates in", async ({ page }) => {
    await page.goto("/en");
    const { name, seconds } = await duration(page, "h1");

    expect(name).toBe("rise");
    expect(seconds).toBeGreaterThan(0.3);
  });

  test("the mobile menu eases in", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/en");
    await page.getByRole("button", { name: "Open menu" }).click();

    const { name, seconds } = await duration(page, "dialog[open]");
    expect(name).toBe("dialog-in");
    expect(seconds).toBeGreaterThan(0.1);
  });
});

test.describe("when the visitor prefers reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("animations are effectively instant", async ({ page }) => {
    await page.goto("/en");
    const hero = await duration(page, "h1");

    expect(hero.seconds).toBeLessThan(0.01);
    await expect(page.locator("h1").first()).toHaveCSS("opacity", "1");
  });

  test("dialog animations are instant too", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/en");
    await page.getByRole("button", { name: "Open menu" }).click();

    const { seconds } = await duration(page, "dialog[open]");
    expect(seconds).toBeLessThan(0.01);
  });
});
