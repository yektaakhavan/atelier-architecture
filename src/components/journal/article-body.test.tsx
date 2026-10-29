import { render, screen } from "@testing-library/react";
import { articles } from "@/data/articles";
import { ArticleBody } from "./article-body";

describe("ArticleBody", () => {
  it("renders headings as h2 and paragraphs as text, in order", () => {
    const blocks = articles[0]!.body.en;
    const { container } = render(<ArticleBody blocks={blocks} />);

    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(
      blocks.filter((b) => b.type === "heading").length,
    );
    expect([...container.firstElementChild!.children].map((el) => el.textContent)).toEqual(
      blocks.map((block) => block.text),
    );
  });
});
