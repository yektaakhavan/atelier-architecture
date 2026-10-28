import type { Locale } from "@/i18n/routing";
import { projectCategories, type Project, type ProjectCategory } from "@/types/content";
import { normalizeText } from "./normalize";

export const sortKeys = ["newest", "oldest", "title"] as const;
export type SortKey = (typeof sortKeys)[number];

export type ProjectFilters = {
  query: string;
  category: ProjectCategory | "all";
  year: number | "all";
  country: string | "all";
  sort: SortKey;
};

export const defaultFilters: ProjectFilters = {
  query: "",
  category: "all",
  year: "all",
  country: "all",
  sort: "newest",
};

export type FilterOptions = {
  categories: ProjectCategory[];
  years: number[];
  countries: string[];
};

export function filterProjects(projects: readonly Project[], filters: ProjectFilters): Project[] {
  const query = normalizeText(filters.query);

  return projects.filter((project) => {
    if (filters.category !== "all" && project.category !== filters.category) return false;
    if (filters.year !== "all" && project.year !== filters.year) return false;
    if (filters.country !== "all" && project.country !== filters.country) return false;
    // Titles are matched in every language so "Courtyard" finds the project from /fa too.
    return (
      !query || Object.values(project.title).some((title) => normalizeText(title).includes(query))
    );
  });
}

export function sortProjects(
  projects: readonly Project[],
  sort: SortKey,
  locale: Locale,
): Project[] {
  const byTitle = (a: Project, b: Project) =>
    a.title[locale].localeCompare(b.title[locale], locale);
  const sorted = [...projects];

  if (sort === "title") return sorted.sort(byTitle);
  const direction = sort === "newest" ? -1 : 1;
  return sorted.sort((a, b) => direction * (a.year - b.year) || byTitle(a, b));
}

export function applyFilters(
  projects: readonly Project[],
  filters: ProjectFilters,
  locale: Locale,
) {
  return sortProjects(filterProjects(projects, filters), filters.sort, locale);
}

/** Only offers values that exist in the data, so a filter can never produce an empty result by itself. */
export function getFilterOptions(projects: readonly Project[]): FilterOptions {
  const present = new Set(projects.map((project) => project.category));
  return {
    categories: projectCategories.filter((category) => present.has(category)),
    years: [...new Set(projects.map((project) => project.year))].sort((a, b) => b - a),
    countries: [...new Set(projects.map((project) => project.country))].sort(),
  };
}

export function hasActiveFilters(filters: ProjectFilters) {
  return (
    filters.query.trim() !== "" ||
    filters.category !== "all" ||
    filters.year !== "all" ||
    filters.country !== "all"
  );
}

const PARAM = {
  query: "q",
  category: "type",
  year: "year",
  country: "country",
  sort: "sort",
} as const;

/** Reads filters from a URL; anything unknown or invalid silently falls back to the default. */
export function parseFilters(params: URLSearchParams, options: FilterOptions): ProjectFilters {
  const category = params.get(PARAM.category);
  const year = Number(params.get(PARAM.year));
  const country = params.get(PARAM.country);
  const sort = params.get(PARAM.sort);

  return {
    query: params.get(PARAM.query) ?? "",
    category: options.categories.find((c) => c === category) ?? "all",
    year: options.years.find((y) => y === year) ?? "all",
    country: options.countries.find((c) => c === country) ?? "all",
    sort: sortKeys.find((key) => key === sort) ?? "newest",
  };
}

/** Defaults are omitted so an unfiltered archive keeps a clean /projects URL. */
export function serializeFilters(filters: ProjectFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.query.trim()) params.set(PARAM.query, filters.query.trim());
  if (filters.category !== "all") params.set(PARAM.category, filters.category);
  if (filters.year !== "all") params.set(PARAM.year, String(filters.year));
  if (filters.country !== "all") params.set(PARAM.country, filters.country);
  if (filters.sort !== defaultFilters.sort) params.set(PARAM.sort, filters.sort);
  return params;
}
