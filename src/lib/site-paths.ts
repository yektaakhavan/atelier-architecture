import { articles } from "@/data/articles";
import { projects } from "@/data/projects";

/** Locale-independent paths of every page on the site; the single source for the sitemap. */
export function getSitePaths(): { path: string; lastModified?: string }[] {
  const staticPaths = [
    "",
    "/projects",
    "/services",
    "/about",
    "/journal",
    "/contact",
    "/privacy",
    "/terms",
  ];

  return [
    ...staticPaths.map((path) => ({ path })),
    ...projects.map((project) => ({ path: `/projects/${project.slug}` })),
    // Only articles have a real date; nothing else gets an invented "last modified".
    ...articles.map((article) => ({
      path: `/journal/${article.slug}`,
      lastModified: article.publishedAt,
    })),
  ];
}
