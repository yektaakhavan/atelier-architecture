import { normalizeText } from "@/features/projects/lib/normalize";
import { articleCategories, type Article, type ArticleCategory } from "@/types/content";

export type JournalFilters = { query: string; category: ArticleCategory | "all" };

export const defaultJournalFilters: JournalFilters = { query: "", category: "all" };

export function sortArticles(articles: readonly Article[]): Article[] {
  return [...articles].sort(
    (a, b) => b.publishedAt.localeCompare(a.publishedAt) || a.slug.localeCompare(b.slug),
  );
}

export function filterArticles(articles: readonly Article[], filters: JournalFilters): Article[] {
  const query = normalizeText(filters.query);

  return sortArticles(
    articles.filter((article) => {
      if (filters.category !== "all" && article.category !== filters.category) return false;
      if (!query) return true;
      // Matches titles and excerpts in every language, like the project search.
      return [...Object.values(article.title), ...Object.values(article.excerpt)].some((text) =>
        normalizeText(text).includes(query),
      );
    }),
  );
}

/** Only categories that have articles, in a fixed order. */
export function getArticleCategories(articles: readonly Article[]): ArticleCategory[] {
  const present = new Set(articles.map((article) => article.category));
  return articleCategories.filter((category) => present.has(category));
}

export function hasActiveJournalFilters(filters: JournalFilters) {
  return filters.query.trim() !== "" || filters.category !== "all";
}

export function parseJournalFilters(
  params: URLSearchParams,
  categories: readonly ArticleCategory[],
): JournalFilters {
  const category = params.get("category");
  return {
    query: params.get("q") ?? "",
    category: categories.find((c) => c === category) ?? "all",
  };
}

export function serializeJournalFilters(filters: JournalFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.query.trim()) params.set("q", filters.query.trim());
  if (filters.category !== "all") params.set("category", filters.category);
  return params;
}

/** Same category first, then the newest; never the article itself. */
export function getRelatedArticles(
  article: Article,
  all: readonly Article[],
  limit = 3,
): Article[] {
  return sortArticles(all.filter((candidate) => candidate.slug !== article.slug))
    .map((candidate) => ({ candidate, same: candidate.category === article.category ? 1 : 0 }))
    .sort((a, b) => b.same - a.same)
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}
