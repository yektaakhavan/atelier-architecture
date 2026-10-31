import { articles } from "@/data/articles";
import { projects } from "@/data/projects";
import robots from "./robots";
import sitemap from "./sitemap";

describe("sitemap", () => {
  const entries = sitemap();

  it("has every page in every language", () => {
    expect(entries).toHaveLength((8 + projects.length + articles.length) * 2);
    const urls = entries.map((entry) => entry.url);
    expect(urls.some((url) => url.endsWith("/en"))).toBe(true);
    expect(urls.some((url) => url.endsWith("/fa/projects/casa-olivo"))).toBe(true);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("links each page to its translation", () => {
    const entry = entries.find((e) => e.url.endsWith("/en/services"))!;
    expect(entry.alternates?.languages).toMatchObject({
      en: expect.stringMatching(/\/en\/services$/),
      fa: expect.stringMatching(/\/fa\/services$/),
    });
  });

  it("only dates articles", () => {
    for (const entry of entries) {
      expect(Boolean(entry.lastModified), entry.url).toBe(
        entry.url.includes("/journal/") && !entry.url.endsWith("/journal"),
      );
    }
  });
});

describe("robots", () => {
  it("allows crawling and points at the sitemap", () => {
    const config = robots();
    expect(config.rules).toMatchObject({ userAgent: "*", allow: "/" });
    expect(config.sitemap).toMatch(/\/sitemap\.xml$/);
  });
});
