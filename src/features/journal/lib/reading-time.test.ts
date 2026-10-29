import type { ArticleBlock } from "@/types/content";
import { countWords, estimateReadingMinutes } from "./reading-time";

const blockOf = (words: number): ArticleBlock => ({
  type: "paragraph",
  text: Array(words).fill("word").join(" "),
});

describe("countWords", () => {
  it("counts words separated by any whitespace", () => {
    expect(countWords("  one two\nthree\t four ")).toBe(4);
  });

  it("returns zero for empty text", () => {
    expect(countWords("   ")).toBe(0);
  });
});

describe("estimateReadingMinutes", () => {
  it("never goes below one minute", () => {
    expect(estimateReadingMinutes([], "en")).toBe(1);
    expect(estimateReadingMinutes([blockOf(5)], "fa")).toBe(1);
  });

  it("rounds up to whole minutes", () => {
    expect(estimateReadingMinutes([blockOf(221)], "en")).toBe(2);
    expect(estimateReadingMinutes([blockOf(220)], "en")).toBe(1);
  });

  it("assumes Persian is read more slowly than English", () => {
    const blocks = [blockOf(400)];
    expect(estimateReadingMinutes(blocks, "fa")).toBeGreaterThan(
      estimateReadingMinutes(blocks, "en"),
    );
  });

  it("adds up every block, headings included", () => {
    const blocks: ArticleBlock[] = [{ type: "heading", text: blockOf(110).text }, blockOf(111)];
    expect(estimateReadingMinutes(blocks, "en")).toBe(2);
  });
});
