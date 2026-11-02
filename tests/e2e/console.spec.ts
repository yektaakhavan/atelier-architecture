import { expect, test, type Page } from "@playwright/test";

// A page can look fine and still be broken: next-intl logs MISSING_MESSAGE and renders raw keys,
// React logs hydration problems, and so on. None of that fails a visual or accessibility check,
// so every page must also load with a completely quiet console.

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
  "/privacy",
  "/terms",
];

// A translation key that leaked into the page, such as "Journal.searchLabel".
const RAW_KEY =
  /\b(Journal|Projects|ProjectDetail|Contact|Nav|Theme|LanguageSwitcher|Footer|Home|About|Services|Legal|NotFound|Metadata)\.[A-Za-z]{3,}/;

function watchConsole(page: Page) {
  const problems: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error" || message.type() === "warning") {
      problems.push(`console.${message.type()}: ${message.text().split("\n")[0]}`);
    }
  });
  page.on("pageerror", (error) => problems.push(`pageerror: ${error.message}`));
  return problems;
}

test.describe("quiet console and no leaked translation keys", () => {
  for (const locale of locales) {
    for (const path of paths) {
      test(`${locale}${path || "/"}`, async ({ page }) => {
        const problems = watchConsole(page);
        await page.goto(`/${locale}${path}`);
        await page.waitForLoadState("networkidle");

        expect(await page.locator("body").innerText()).not.toMatch(RAW_KEY);
        expect(problems).toEqual([]);
      });
    }
  }

  test("client-side navigation through the header stays quiet", async ({ page }) => {
    const problems = watchConsole(page);
    await page.goto("/en");

    for (const name of ["Projects", "Services", "About", "Journal", "Contact"]) {
      await page.getByRole("banner").getByRole("link", { name }).click();
      await page.waitForLoadState("networkidle");
      expect(await page.locator("body").innerText(), name).not.toMatch(RAW_KEY);
    }
    expect(problems).toEqual([]);
  });

  test("switching language on the journal archive stays quiet", async ({ page }) => {
    const problems = watchConsole(page);
    await page.goto("/en/journal?category=lighting");
    await page.getByRole("banner").getByRole("link", { name: "فارسی" }).click();
    await expect(page).toHaveURL(/\/fa\/journal\?category=lighting$/);

    expect(await page.locator("body").innerText()).not.toMatch(RAW_KEY);
    expect(problems).toEqual([]);
  });

  test("404 pages log nothing except the browser's own note about the 404 status", async ({
    page,
  }) => {
    const problems = watchConsole(page);
    await page.goto("/fa/does-not-exist");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("این صفحه وجود ندارد");

    expect(problems.filter((problem) => !/Failed to load resource.*404/.test(problem))).toEqual([]);
  });
});
