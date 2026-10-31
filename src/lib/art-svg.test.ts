import { artTones, artVariants } from "@/types/content";
import { artSvg } from "./art-svg";

const parse = (svg: string) => new DOMParser().parseFromString(svg, "image/svg+xml");

describe("artSvg", () => {
  it.each(artVariants)("produces valid, non-trivial SVG for %s in every tone", (variant) => {
    for (const tone of artTones) {
      const doc = parse(artSvg(variant, tone));

      expect(doc.querySelector("parsererror"), `${variant}-${tone}`).toBeNull();
      expect(doc.documentElement.tagName).toBe("svg");
      expect(doc.documentElement.getAttribute("viewBox")).toBe("0 0 800 600");
      expect(doc.documentElement.getAttribute("xmlns")).toBe("http://www.w3.org/2000/svg");
      // background + ground + at least three shapes of the scene itself
      expect(doc.documentElement.children.length).toBeGreaterThanOrEqual(5);
    }
  });

  it("uses the palette of the requested tone only", () => {
    expect(artSvg("plan", "night")).toContain("#2a2d27");
    expect(artSvg("plan", "olive")).not.toContain("#2a2d27");
  });

  it("is deterministic", () => {
    expect(artSvg("facade", "brick")).toBe(artSvg("facade", "brick"));
  });

  it("keeps every shape's anchor inside the canvas so nothing is lost to cropping", () => {
    for (const variant of artVariants) {
      const doc = parse(artSvg(variant, "stone"));
      const shapes = [...doc.querySelectorAll("rect[x]")].slice(2); // skip the background and ground
      for (const shape of shapes) {
        const x = Number(shape.getAttribute("x"));
        const y = Number(shape.getAttribute("y"));
        expect(x, `${variant} x`).toBeGreaterThanOrEqual(175);
        expect(
          x + Number(shape.getAttribute("width")),
          `${variant} right edge`,
        ).toBeLessThanOrEqual(625);
        expect(y, `${variant} y`).toBeGreaterThanOrEqual(75);
      }
    }
  });
});
