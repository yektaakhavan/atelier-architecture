import { routing } from "@/i18n/routing";
import en from "@/messages/en.json";
import {
  articleCategories,
  artTones,
  artVariants,
  projectCategories,
  serviceIds,
} from "@/types/content";
import { articles, featuredArticles } from "./articles";
import { projectDetails } from "./project-details";
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

describe("project details", () => {
  it("exist for every project and for no unknown slug", () => {
    expect(Object.keys(projectDetails).sort()).toEqual(
      projects.map((project) => project.slug).sort(),
    );
  });

  it("reference valid services and team members", () => {
    for (const [slug, details] of Object.entries(projectDetails)) {
      expect(details.services.length, slug).toBeGreaterThan(0);
      for (const id of details.services) expect(serviceIds, `${slug} service`).toContain(id);
      for (const member of details.team) expect([1, 2, 3, 4], `${slug} team`).toContain(member);
    }
  });

  it("have a gallery and complete bilingual copy", () => {
    for (const [slug, details] of Object.entries(projectDetails)) {
      expect(details.gallery.length, slug).toBeGreaterThanOrEqual(3);
      for (const locale of routing.locales) {
        for (const field of ["concept", "approach", "challenge", "solution"] as const) {
          expect(details[field][locale].trim(), `${slug} ${field} ${locale}`).not.toBe("");
        }
        expect(
          details.materials[locale].length,
          `${slug} materials ${locale}`,
        ).toBeGreaterThanOrEqual(3);
      }
      expect(details.materials.en.length).toBe(details.materials.fa.length);
    }
  });

  it("gives every project a country code", () => {
    for (const project of projects) expect(project.country).toMatch(/^[A-Z]{2}$/);
  });
});

describe("article data", () => {
  it("has unique, URL-safe slugs and valid UTC dates", () => {
    const slugList = articles.map((article) => article.slug);
    expect(new Set(slugList).size).toBe(slugList.length);
    for (const article of articles) {
      expect(article.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(article.publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(
        Number.isNaN(new Date(`${article.publishedAt}T00:00:00Z`).getTime()),
        article.slug,
      ).toBe(false);
    }
  });

  it("uses known categories, authors and related projects", () => {
    const projectSlugs = new Set(projects.map((project) => project.slug));
    for (const article of articles) {
      expect(articleCategories).toContain(article.category);
      expect([1, 2, 3, 4]).toContain(article.author);
      if (article.relatedProject)
        expect(projectSlugs.has(article.relatedProject), article.slug).toBe(true);
    }
  });

  it("has the same block structure in every language", () => {
    for (const article of articles) {
      const structure = (locale: "en" | "fa") => article.body[locale].map((block) => block.type);
      expect(structure("fa"), article.slug).toEqual(structure("en"));
      for (const locale of routing.locales) {
        expect(article.title[locale].trim(), `${article.slug} title`).not.toBe("");
        expect(article.excerpt[locale].trim(), `${article.slug} excerpt`).not.toBe("");
        for (const block of article.body[locale]) expect(block.text.trim()).not.toBe("");
      }
    }
  });

  it("highlights at least two featured articles", () => {
    expect(featuredArticles.length).toBeGreaterThanOrEqual(2);
  });
});
