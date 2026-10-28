import { routing } from "@/i18n/routing";
import en from "@/messages/en.json";
import { artTones, artVariants, projectCategories, serviceIds } from "@/types/content";
import { archiveProjects, featuredProjects, projects } from "./projects";
import { services } from "./services";

describe("project data", () => {
  it("has unique, URL-safe slugs", () => {
    const slugs = projects.map((project) => project.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it("uses only known categories, art variants and tones", () => {
    for (const project of projects) {
      expect(projectCategories).toContain(project.category);
      expect(artVariants).toContain(project.image.art);
      expect(artTones).toContain(project.image.tone);
    }
  });

  it("provides every text field in every locale", () => {
    for (const project of projects) {
      for (const locale of routing.locales) {
        expect(project.title[locale].trim(), `${project.slug} title ${locale}`).not.toBe("");
        expect(project.location[locale].trim(), `${project.slug} location ${locale}`).not.toBe("");
        expect(project.summary[locale].trim(), `${project.slug} summary ${locale}`).not.toBe("");
      }
    }
  });

  it("has enough featured and archive projects for the home page layout", () => {
    expect(featuredProjects.length).toBeGreaterThanOrEqual(4);
    expect(archiveProjects.length).toBeGreaterThanOrEqual(4);
    expect(featuredProjects.length + archiveProjects.length).toBe(projects.length);
  });

  it("has a translated label for every category", () => {
    for (const category of projectCategories) {
      expect(en.Projects.categories[category]).toBeTruthy();
    }
  });
});

describe("service data", () => {
  it("covers every service id exactly once", () => {
    expect(services.map((service) => service.id).sort()).toEqual([...serviceIds].sort());
  });

  it("only references projects that exist", () => {
    const slugs = new Set(projects.map((project) => project.slug));
    for (const service of services) {
      expect(service.relatedProjects.length, service.id).toBeGreaterThan(0);
      for (const slug of service.relatedProjects)
        expect(slugs.has(slug), `${service.id} -> ${slug}`).toBe(true);
    }
  });

  it("has copy for every service", () => {
    for (const { id } of services) expect(en.Services.items[id].title).toBeTruthy();
  });
});
