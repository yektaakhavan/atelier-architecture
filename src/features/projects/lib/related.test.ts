import { projectDetails } from "@/data/project-details";
import { projects } from "@/data/projects";
import { getRelatedProjects } from "./related";

const casa = projects.find((project) => project.slug === "casa-olivo")!;

describe("getRelatedProjects", () => {
  it("never includes the project itself", () => {
    const related = getRelatedProjects(casa, projects, projectDetails, 8);
    expect(related.map((project) => project.slug)).not.toContain("casa-olivo");
  });

  it("ranks projects in the same category first", () => {
    const [first] = getRelatedProjects(casa, projects, projectDetails);
    expect(first?.slug).toBe("courtyard-house-isfahan");
  });

  it("falls back to shared services when no project has the same category", () => {
    const hotel = projects.find((project) => project.slug === "douro-terrace-hotel")!;
    const related = getRelatedProjects(hotel, projects, projectDetails).map(
      (project) => project.slug,
    );

    // All score 1 (shared "sustainable"); ties go to the newer year, then to the slug.
    expect(related).toEqual(["canopy-offices", "casa-olivo", "north-light-studios"]);
  });

  it("respects the limit", () => {
    expect(getRelatedProjects(casa, projects, projectDetails, 2)).toHaveLength(2);
  });

  it("returns a stable order", () => {
    const run = () =>
      getRelatedProjects(casa, projects, projectDetails).map((project) => project.slug);
    expect(run()).toEqual(run());
  });
});
