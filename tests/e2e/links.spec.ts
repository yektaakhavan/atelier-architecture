import { expect, test } from "@playwright/test";

// Crawls the site from both home pages and checks that every internal link answers 200.
// Links are read from the HTML the server sends, so this also covers what search engines see.
const START = ["/en", "/fa"];

function internalLinks(html: string) {
  const found = new Set<string>();
  for (const match of html.matchAll(/<a\s[^>]*?href="([^"]+)"/g)) {
    const href = match[1]!.replaceAll("&amp;", "&").split("#")[0]!;
    if (href.startsWith("/") && !href.startsWith("//")) found.add(href);
  }
  return found;
}

test("every internal link on the site resolves", async ({ request }) => {
  const seen = new Set<string>();
  const queue = [...START];
  const broken: string[] = [];

  while (queue.length) {
    const path = queue.shift()!;
    if (seen.has(path)) continue;
    seen.add(path);

    const response = await request.get(path);
    if (response.status() !== 200) {
      broken.push(`${path} -> ${response.status()}`);
      continue;
    }
    if (!(response.headers()["content-type"] ?? "").includes("text/html")) continue;
    for (const link of internalLinks(await response.text())) if (!seen.has(link)) queue.push(link);
  }

  expect(broken).toEqual([]);
  // 22 pages per language (8 sections + 8 projects + 6 articles); a smaller crawl means links went missing.
  expect(seen.size).toBeGreaterThanOrEqual(44);
});

test("every sitemap URL resolves, and nothing important is missing from it", async ({
  request,
}) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]!).pathname);

  expect(paths.length).toBeGreaterThanOrEqual(44);
  for (const path of paths) {
    expect((await request.get(path)).status(), path).toBe(200);
  }
});

test("robots.txt points at the sitemap", async ({ request }) => {
  const body = await (await request.get("/robots.txt")).text();
  expect(body).toContain("Allow: /");
  expect(body).toMatch(/Sitemap: .+\/sitemap\.xml/);
});
