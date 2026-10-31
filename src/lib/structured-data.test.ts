import { article, breadcrumbList, serializeJsonLd } from "./structured-data";

describe("breadcrumbList", () => {
  it("numbers the steps and uses absolute URLs", () => {
    const data = breadcrumbList([
      { name: "Home", path: "/en" },
      { name: "Projects", path: "/en/projects" },
    ]);

    expect(data["@type"]).toBe("BreadcrumbList");
    expect(data.itemListElement.map((item) => item.position)).toEqual([1, 2]);
    expect(data.itemListElement[1]?.item).toMatch(/^https?:\/\/[^/]+\/en\/projects$/);
  });
});

describe("article", () => {
  it("describes the article with its language and date", () => {
    const data = article({
      headline: "H",
      description: "D",
      datePublished: "2026-09-18",
      author: "Mara",
      locale: "fa",
      path: "/fa/journal/x",
    });

    expect(data).toMatchObject({
      "@type": "Article",
      inLanguage: "fa",
      datePublished: "2026-09-18",
    });
    expect(data.author).toEqual({ "@type": "Person", name: "Mara" });
  });
});

describe("serializeJsonLd", () => {
  it("cannot be broken out of its script tag", () => {
    const json = serializeJsonLd({ headline: "</script><script>alert(1)</script>" });
    expect(json).not.toContain("</script>");
    expect(json).not.toContain("<");
    expect(JSON.parse(json).headline).toBe("</script><script>alert(1)</script>");
  });
});
