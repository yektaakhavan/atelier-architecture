import { artTones, artVariants } from "@/types/content";
import { artFileNames, artUrl, parseArtFileName } from "./art";

describe("art files", () => {
  it("has one file for every variant and tone", () => {
    expect(artFileNames).toHaveLength(artVariants.length * artTones.length);
    expect(new Set(artFileNames).size).toBe(artFileNames.length);
  });

  it("round-trips a url through the parser", () => {
    for (const variant of artVariants) {
      for (const tone of artTones) {
        expect(parseArtFileName(artUrl(variant, tone).replace("/art/", ""))).toEqual({
          variant,
          tone,
        });
      }
    }
  });

  it("rejects unknown or malformed names", () => {
    for (const name of [
      "volumes-purple.svg",
      "spaceship-olive.svg",
      "volumes-olive.png",
      "../etc.svg",
      "volumes.svg",
    ]) {
      expect(parseArtFileName(name)).toBeNull();
    }
  });
});
