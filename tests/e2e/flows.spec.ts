import { expect, test } from "@playwright/test";

const header = (page: import("@playwright/test").Page) => page.getByRole("banner");

test("the full visitor journey, in English then Persian", async ({ page }) => {
  // 1. The site opens in English.
  await page.goto("/");
  await expect(page).toHaveURL(/\/en$/);
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Architecture that");

  // 2-3. Switching language keeps the page and flips the direction.
  await header(page).getByRole("link", { name: "فارسی" }).click();
  await expect(page).toHaveURL(/\/fa$/);
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.locator("html")).toHaveAttribute("lang", "fa");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("معماری‌ای که به زمین");

  // 4. The theme can be switched and survives a reload.
  await header(page).getByRole("button", { name: "تغییر به تم تاریک" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

  // 5-6. Projects page and a filter, which is recorded in the URL.
  await header(page).getByRole("link", { name: "پروژه‌ها" }).click();
  await expect(page).toHaveURL(/\/fa\/projects$/);
  await expect(page.getByRole("status")).toHaveText("۸ پروژه");
  await page.getByRole("button", { name: "مسکونی" }).click();
  await expect(page.getByRole("status")).toHaveText("۲ پروژه");
  await expect(page).toHaveURL(/\?type=residential$/);

  // 7. A project page, with the breadcrumb leading back.
  await page
    .getByRole("link", { name: /خانه زیتون/ })
    .first()
    .click();
  await expect(page).toHaveURL(/\/fa\/projects\/casa-olivo$/);
  await expect(page.getByRole("heading", { level: 1, name: "خانه زیتون" })).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "مسیر صفحه" }).getByRole("link", { name: "پروژه‌ها" }),
  ).toBeVisible();

  // 8. Services.
  await header(page).getByRole("link", { name: "خدمات" }).click();
  await expect(page).toHaveURL(/\/fa\/services$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("از اولین طرح");

  // 9-10. Contact: invalid, then valid.
  await header(page).getByRole("link", { name: "تماس" }).click();
  await page.getByRole("button", { name: "ارسال درخواست" }).click();
  await expect(page.getByText("لطفاً نام خود را وارد کنید.")).toBeVisible();
  await expect(page.getByLabel("نام شما")).toBeFocused();

  await page.getByLabel("نام شما").fill("سارا احمدی");
  await page.getByLabel("ایمیل").fill("sara@example.com");
  await page.getByLabel("موضوع").fill("خانه‌ای روی دامنه");
  await page.getByLabel("نوع پروژه").selectOption("residential");
  await page
    .getByLabel("پیام")
    .fill("ما یک زمین شیب‌دار داریم و می‌خواهیم درباره‌ی ساخت یک خانه‌ی کوچک صحبت کنیم.");
  await page.getByRole("button", { name: "ارسال درخواست" }).click();

  const result = page.getByRole("status");
  await expect(result).toContainText("سپاس، پیام دریافت شد (دمو)");
  await expect(result).toContainText("برای هیچ‌کس ارسال نشد");
  await expect(result).toBeFocused();
});

test("filters, search and sorting work together on the archive", async ({ page }) => {
  await page.goto("/en/projects");

  await page.getByLabel("Search by name").fill("canopy");
  await expect(page.getByRole("status")).toHaveText("1 project");
  await expect(page).toHaveURL(/\?q=canopy$/);

  await page.getByLabel("Search by name").fill("no such project");
  await expect(page.getByRole("heading", { name: "No projects match your filters" })).toBeVisible();
  await page.getByRole("button", { name: "Clear filters" }).first().click();
  await expect(page.getByRole("status")).toHaveText("8 projects");
  await expect(page).toHaveURL(/\/en\/projects$/);

  await page.getByLabel("Location").selectOption("IR");
  await page.getByLabel("Sort by").selectOption("oldest");
  await expect(page.getByRole("status")).toHaveText("3 projects");
  await expect(page.getByRole("heading", { level: 2 }).first()).toHaveText("Brick Mill Renewal");
});

test("a filtered archive can be shared, reloaded and translated", async ({ page }) => {
  await page.goto("/en/projects?type=cultural&sort=title");
  await expect(page.getByRole("status")).toHaveText("1 project");
  await expect(page.getByRole("button", { name: "Cultural" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );

  await page.getByRole("banner").getByRole("link", { name: "فارسی" }).click();
  await expect(page).toHaveURL(/\/fa\/projects\?type=cultural&sort=title$/);
  await expect(page.getByRole("status")).toHaveText("۱ پروژه");
  await expect(page.locator("main").getByRole("heading", { level: 2 })).toHaveText("کوشک نمک");
});

test("the gallery lightbox is fully keyboard operable", async ({ page }) => {
  await page.goto("/en/projects/casa-olivo");
  const opener = page.getByRole("button", { name: "Open image 1 of 3" });
  await opener.focus();
  await page.keyboard.press("Enter");

  const viewer = page.getByRole("dialog", { name: "Image viewer" });
  await expect(viewer.getByText("1 / 3")).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(viewer.getByText("2 / 3")).toBeVisible();
  await page.keyboard.press("ArrowLeft");
  await page.keyboard.press("ArrowLeft");
  await expect(viewer.getByText("3 / 3")).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(viewer).toBeHidden();
  await expect(opener).toBeFocused();
});

test("in Persian the lightbox arrow keys follow the reading direction", async ({ page }) => {
  await page.goto("/fa/projects/casa-olivo");
  await page.getByRole("button", { name: "باز کردن تصویر ۱ از ۳" }).click();
  const viewer = page.getByRole("dialog", { name: "نمایشگر تصویر" });

  await page.keyboard.press("ArrowLeft");
  await expect(viewer.getByText("۲ / ۳")).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(viewer.getByText("۱ / ۳")).toBeVisible();
});

test("the skip link jumps past the navigation", async ({ page }) => {
  await page.goto("/en/about");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await expect(skip).toBeVisible();

  await page.keyboard.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();
});

test("the journal archive searches and filters in the browser", async ({ page }) => {
  await page.goto("/en/journal");
  const count = page.getByRole("status");
  await expect(count).toHaveText("6 articles");

  await page.getByRole("button", { name: "Lighting" }).click();
  await expect(count).toHaveText("1 article");
  await expect(page).toHaveURL(/\?category=lighting$/);
  await expect(page.getByRole("button", { name: "Lighting" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );

  await page.getByRole("button", { name: "Clear filters" }).click();
  await page.getByLabel("Search articles").fill("courtyard");
  await expect(count).toHaveText("1 article");
  await expect(
    page.locator("main").getByRole("heading", { level: 3, name: "The courtyard, reconsidered" }),
  ).toBeVisible();

  await page.getByLabel("Search articles").fill("no such article");
  await expect(page.getByRole("heading", { name: "No articles found" })).toBeVisible();
});

test("the Persian journal archive is fully translated", async ({ page }) => {
  await page.goto("/fa/journal");

  await expect(page.getByRole("status")).toHaveText("۶ مقاله");
  await expect(page.getByLabel("جست‌وجوی مقاله")).toBeVisible();
  await page.getByRole("button", { name: "نورپردازی" }).click();
  await expect(page.getByRole("status")).toHaveText("۱ مقاله");
});
