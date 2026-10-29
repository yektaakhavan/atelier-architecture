import { screen } from "@testing-library/react";
import { articles } from "@/data/articles";
import { renderWithIntl } from "@/test-utils/render-with-intl";
import { ArticleCard } from "./article-card";

vi.mock("@/i18n/navigation", () => ({
  Link: ({
    href,
    locale,
    ...props
  }: { href: string; locale?: string } & Record<string, unknown>) => (
    <a href={`/${locale ?? "en"}${href}`} {...props} />
  ),
}));

const article = articles.find((a) => a.slug === "daylight-in-small-rooms")!;

describe("ArticleCard", () => {
  it("links to the article and shows title, excerpt and a cover illustration", () => {
    renderWithIntl(<ArticleCard article={article} />);

    expect(screen.getByRole("link")).toHaveAttribute("href", "/en/journal/daylight-in-small-rooms");
    expect(
      screen.getByRole("heading", { level: 3, name: "Daylight in small rooms" }),
    ).toBeInTheDocument();
    expect(screen.getByText(article.excerpt.en)).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Cover illustration for Daylight in small rooms" }),
    ).toBeInTheDocument();
  });

  it("shows category, a machine-readable date and the reading time", () => {
    renderWithIntl(<ArticleCard article={article} />);

    expect(screen.getByText("Small spaces")).toBeInTheDocument();
    const time = screen.getByText("Sep 18, 2026");
    expect(time.tagName.toLowerCase()).toBe("time");
    expect(time).toHaveAttribute("datetime", "2026-09-18");
    expect(screen.getByText("1 min read")).toBeInTheDocument();
  });

  it("formats the date with the Persian calendar and digits in Persian", () => {
    renderWithIntl(<ArticleCard article={article} />, { locale: "fa" });

    const time = document.querySelector("time")!;
    expect(time.textContent).toMatch(/۱۴۰۵/);
    expect(time.textContent).not.toMatch(/[0-9]/);
    expect(screen.getByText("فضاهای کوچک")).toBeInTheDocument();
    expect(screen.getByText("۱ دقیقه مطالعه")).toBeInTheDocument();
  });
});
