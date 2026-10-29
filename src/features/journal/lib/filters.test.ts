import { articles } from "@/data/articles";
import {
  defaultJournalFilters,
  filterArticles,
  getArticleCategories,
  getRelatedArticles,
  hasActiveJournalFilters,
  parseJournalFilters,
  serializeJournalFilters,
  sortArticles,
  type JournalFilters,
} from "./filters";

const categories = getArticleCategories(articles);
const withFilters = (overrides: Partial<JournalFilters>): JournalFilters => ({
  ...defaultJournalFilters,
  ...overrides,
});
const slugs = (list: readonly { slug: string }[]) => list.map((article) => article.slug);

describe("sortArticles", () => {
  it("puts the newest article first and does not mutate its input", () => {
    const before = slugs(articles);
    const dates = sortArticles(articles).map((article) => article.publishedAt);

    expect(dates).toEqual([...dates].sort().reverse());
    expect(slugs(articles)).toEqual(before);
  });
});

describe("filterArticles", () => {
  it("returns everything, newest first, without filters", () => {
    const result = filterArticles(articles, defaultJournalFilters);
    expect(result).toHaveLength(articles.length);
    expect(result[0]?.slug).toBe("daylight-in-small-rooms");
  });

  it("filters by category", () => {
    expect(slugs(filterArticles(articles, withFilters({ category: "lighting" })))).toEqual([
      "warm-light-at-night",
    ]);
  });

  it("searches titles and excerpts, ignoring case", () => {
    expect(slugs(filterArticles(articles, withFilters({ query: "LIME PLASTER" })))).toEqual([
      "why-lime-plaster",
    ]);
    expect(slugs(filterArticles(articles, withFilters({ query: "dark 96" })))).toEqual([
      "case-study-oak-and-lime",
    ]);
  });

  it("finds an article by its Persian text too", () => {
    expect(slugs(filterArticles(articles, withFilters({ query: "حیاط" })))).toContain(
      "the-courtyard-reconsidered",
    );
  });

  it("combines category and query, and can return nothing", () => {
    expect(
      filterArticles(articles, withFilters({ category: "materials", query: "courtyard" })),
    ).toEqual([]);
  });
});

describe("getArticleCategories", () => {
  it("lists only categories that have articles", () => {
    expect(categories).toEqual([
      "contemporary",
      "sustainable",
      "materials",
      "lighting",
      "smallSpaces",
      "caseStudy",
    ]);
    expect(categories).not.toContain("interior");
  });
});

describe("hasActiveJournalFilters", () => {
  it("detects a query or category", () => {
    expect(hasActiveJournalFilters(defaultJournalFilters)).toBe(false);
    expect(hasActiveJournalFilters(withFilters({ query: " x " }))).toBe(true);
    expect(hasActiveJournalFilters(withFilters({ category: "materials" }))).toBe(true);
  });
});

describe("URL state", () => {
  it("keeps the default URL clean and round-trips filters", () => {
    expect(serializeJournalFilters(defaultJournalFilters).toString()).toBe("");
    const filters = withFilters({ query: "light", category: "lighting" });
    expect(parseJournalFilters(serializeJournalFilters(filters), categories)).toEqual(filters);
  });

  it("falls back to defaults for categories that do not exist", () => {
    expect(parseJournalFilters(new URLSearchParams("category=interior"), categories).category).toBe(
      "all",
    );
    expect(parseJournalFilters(new URLSearchParams("category=nope"), categories).category).toBe(
      "all",
    );
  });
});

describe("getRelatedArticles", () => {
  const first = articles[0]!;

  it("excludes the article itself and respects the limit", () => {
    const related = getRelatedArticles(first, articles, 2);
    expect(related).toHaveLength(2);
    expect(slugs(related)).not.toContain(first.slug);
  });

  it("prefers the same category, then the newest", () => {
    const withSameCategory = { ...articles[1]!, category: first.category };
    const pool = [first, withSameCategory, ...articles.slice(2)];
    expect(getRelatedArticles(first, pool)[0]?.slug).toBe(withSameCategory.slug);
  });
});
