import { localizedAlternates } from "./seo";

describe("localizedAlternates", () => {
  it("builds canonical and hreflang URLs for a nested path", () => {
    expect(localizedAlternates("fa", "/projects")).toEqual({
      canonical: "/fa/projects",
      languages: { en: "/en/projects", fa: "/fa/projects", "x-default": "/en/projects" },
    });
  });

  it("does not add a trailing slash for the home page", () => {
    const { canonical, languages } = localizedAlternates("en", "/");
    expect(canonical).toBe("/en");
    expect(languages["x-default"]).toBe("/en");
  });
});
