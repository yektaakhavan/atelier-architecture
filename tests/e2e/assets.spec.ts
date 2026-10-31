import { expect, test } from "@playwright/test";

test.describe("generated artwork", () => {
  test("is served as an immutable, cacheable SVG", async ({ request }) => {
    const response = await request.get("/art/volumes-olive.svg");

    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/svg+xml");
    expect(response.headers()["cache-control"]).toContain("immutable");
    expect(await response.text()).toContain("<svg");
  });

  test("unknown artwork is a 404 and is not redirected to a locale", async ({ request }) => {
    const response = await request.get("/art/nope.svg", { maxRedirects: 0 });
    expect(response.status()).toBe(404);
  });

  test("the home page uses a handful of image elements rather than inline drawings", async ({
    page,
  }) => {
    await page.goto("/en");
    expect(await page.locator("svg[viewBox='0 0 800 600']").count()).toBe(0);
    expect(await page.locator("img[src^='/art/']").count()).toBeGreaterThanOrEqual(10);
  });
});
