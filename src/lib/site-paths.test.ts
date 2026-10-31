import { articles } from "@/data/articles";
import { projects } from "@/data/projects";
import { getSitePaths } from "./site-paths";

describe("getSitePaths", () => {
  const paths = getSitePaths();

  it("lists every page exactly once", () => {
    const list = paths.map((entry) => entry.path);
    expect(new Set(list).size).toBe(list.length);
    expect(list).toHaveLength(8 + projects.length + articles.length);
  });

  it("includes the home page as an empty path and every detail page", () => {
    const list = paths.map((entry) => entry.path);
    expect(list).toContain("");
    expect(list).toContain("/projects/casa-olivo");
    expect(list).toContain("/journal/reuse-before-rebuild");
  });

  it("only gives a modification date to articles", () => {
    for (const entry of paths) {
      expect(Boolean(entry.lastModified), entry.path).toBe(entry.path.startsWith("/journal/"));
    }
  });
});
