import { normalizeText } from "./normalize";

describe("normalizeText", () => {
  it("ignores case, accents and extra whitespace", () => {
    expect(normalizeText("  Café   OLIVO ")).toBe("cafe olivo");
  });

  it("treats Arabic and Persian letter forms as equal", () => {
    expect(normalizeText("كتاب يك")).toBe(normalizeText("کتاب یک"));
  });

  it("treats a zero-width non-joiner like a space", () => {
    expect(normalizeText("خانه\u200cزیتون")).toBe("خانه زیتون");
  });

  it("strips Arabic diacritics", () => {
    expect(normalizeText("خَانِه")).toBe("خانه");
  });
});
