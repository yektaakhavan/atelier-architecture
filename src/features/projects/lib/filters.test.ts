import { projects } from "@/data/projects";
import {
  applyFilters,
  defaultFilters,
  filterProjects,
  getFilterOptions,
  hasActiveFilters,
  parseFilters,
  serializeFilters,
  sortProjects,
  type ProjectFilters,
} from "./filters";

const options = getFilterOptions(projects);
const withFilters = (overrides: Partial<ProjectFilters>): ProjectFilters => ({
  ...defaultFilters,
  ...overrides,
});
const slugs = (list: readonly { slug: string }[]) => list.map((project) => project.slug);

describe("filterProjects", () => {
  it("returns everything when no filter is active", () => {
    expect(filterProjects(projects, defaultFilters)).toHaveLength(projects.length);
  });

  it("filters by category", () => {
    const result = filterProjects(projects, withFilters({ category: "commercial" }));
    expect(slugs(result).sort()).toEqual(["canopy-offices", "north-light-studios"]);
  });

  it("filters by year and country", () => {
    expect(slugs(filterProjects(projects, withFilters({ year: 2022 }))).sort()).toEqual([
      "brick-mill-renewal",
      "salt-pavilion",
    ]);
    expect(filterProjects(projects, withFilters({ country: "IR" }))).toHaveLength(3);
  });

  it("combines filters with AND", () => {
    const result = filterProjects(
      projects,
      withFilters({ country: "PT", category: "hospitality" }),
    );
    expect(slugs(result)).toEqual(["douro-terrace-hotel"]);
  });

  it("searches names case-insensitively", () => {
    expect(slugs(filterProjects(projects, withFilters({ query: "olivo" })))).toEqual([
      "casa-olivo",
    ]);
    expect(slugs(filterProjects(projects, withFilters({ query: "  MILL " })))).toEqual([
      "brick-mill-renewal",
    ]);
  });

  it("finds a project by its Persian or English name regardless of the current language", () => {
    expect(slugs(filterProjects(projects, withFilters({ query: "کوشک" })))).toEqual([
      "salt-pavilion",
    ]);
    expect(slugs(filterProjects(projects, withFilters({ query: "salt" })))).toEqual([
      "salt-pavilion",
    ]);
  });

  it("returns an empty list when nothing matches", () => {
    expect(filterProjects(projects, withFilters({ query: "zzz-no-such-project" }))).toEqual([]);
  });

  it("treats a blank query as no query", () => {
    expect(filterProjects(projects, withFilters({ query: "   " }))).toHaveLength(projects.length);
  });
});

describe("sortProjects", () => {
  it("puts the newest first, breaking ties by title", () => {
    const years = sortProjects(projects, "newest", "en").map((project) => project.year);
    expect(years).toEqual([...years].sort((a, b) => b - a));
    const first = sortProjects(projects, "newest", "en").filter((project) => project.year === 2025);
    expect(first.map((project) => project.title.en)).toEqual([
      "Canopy Offices",
      "Oak & Lime Apartment",
    ]);
  });

  it("puts the oldest first", () => {
    const years = sortProjects(projects, "oldest", "en").map((project) => project.year);
    expect(years).toEqual([...years].sort((a, b) => a - b));
  });

  it("sorts by title in the active locale", () => {
    const en = sortProjects(projects, "title", "en").map((project) => project.title.en);
    expect(en).toEqual([...en].sort((a, b) => a.localeCompare(b, "en")));
    const fa = sortProjects(projects, "title", "fa").map((project) => project.title.fa);
    expect(fa).toEqual([...fa].sort((a, b) => a.localeCompare(b, "fa")));
  });

  it("does not mutate its input", () => {
    const before = slugs(projects);
    sortProjects(projects, "title", "en");
    expect(slugs(projects)).toEqual(before);
  });
});

describe("applyFilters", () => {
  it("filters then sorts", () => {
    const result = applyFilters(projects, withFilters({ country: "IR", sort: "oldest" }), "en");
    expect(slugs(result)).toEqual([
      "brick-mill-renewal",
      "courtyard-house-isfahan",
      "canopy-offices",
    ]);
  });
});

describe("getFilterOptions", () => {
  it("lists only values present in the data, years newest first", () => {
    expect(options.years).toEqual([2025, 2024, 2023, 2022]);
    expect(options.countries).toEqual(["DK", "GE", "IR", "PT", "TR"]);
    expect(options.categories).toHaveLength(6);
  });

  it("omits categories without projects", () => {
    const withoutCultural = projects.filter((project) => project.category !== "cultural");
    expect(getFilterOptions(withoutCultural).categories).not.toContain("cultural");
  });
});

describe("hasActiveFilters", () => {
  it("is false for defaults and for a sort change alone", () => {
    expect(hasActiveFilters(defaultFilters)).toBe(false);
    expect(hasActiveFilters(withFilters({ sort: "title" }))).toBe(false);
  });

  it("is true when any filter or query is set", () => {
    expect(hasActiveFilters(withFilters({ query: "a" }))).toBe(true);
    expect(hasActiveFilters(withFilters({ category: "interior" }))).toBe(true);
    expect(hasActiveFilters(withFilters({ year: 2024 }))).toBe(true);
    expect(hasActiveFilters(withFilters({ country: "IR" }))).toBe(true);
  });
});

describe("URL state", () => {
  it("omits defaults so the unfiltered URL stays clean", () => {
    expect(serializeFilters(defaultFilters).toString()).toBe("");
  });

  it("round-trips every filter", () => {
    const filters = withFilters({
      query: "casa",
      category: "residential",
      year: 2024,
      country: "PT",
      sort: "title",
    });
    expect(parseFilters(serializeFilters(filters), options)).toEqual(filters);
  });

  it("falls back to defaults for unknown or malformed values", () => {
    const params = new URLSearchParams("type=spaceship&year=1999&country=ZZ&sort=random&q=ok");
    expect(parseFilters(params, options)).toEqual(withFilters({ query: "ok" }));
  });

  it("ignores a non-numeric year", () => {
    expect(parseFilters(new URLSearchParams("year=abc"), options).year).toBe("all");
  });
});
