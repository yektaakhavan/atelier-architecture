import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { articles } from "@/data/articles";
import en from "@/messages/en.json";
import fa from "@/messages/fa.json";
import { renderWithIntl } from "@/test-utils/render-with-intl";
import { JournalBrowser } from "./journal-browser";

const search = vi.hoisted(() => ({ value: "" }));

vi.mock("next/navigation", () => ({ useSearchParams: () => new URLSearchParams(search.value) }));
vi.mock("@/i18n/navigation", () => ({
  Link: ({
    href,
    locale,
    ...props
  }: { href: string; locale?: string } & Record<string, unknown>) => (
    <a href={`/${locale ?? "en"}${href}`} {...props} />
  ),
}));

const copy = en.Journal;
const titles = () =>
  screen.getAllByRole("heading", { level: 3 }).map((heading) => heading.textContent);
const count = () => screen.getByRole("status").textContent;

describe("JournalBrowser", () => {
  beforeEach(() => {
    search.value = "";
    vi.spyOn(window.history, "replaceState");
  });
  afterEach(() => vi.restoreAllMocks());

  it("lists every article, newest first, with a count", () => {
    renderWithIntl(<JournalBrowser />);

    expect(titles()).toHaveLength(articles.length);
    expect(titles()[0]).toBe("Daylight in small rooms");
    expect(count()).toBe("6 articles");
  });

  it("filters by category and records it in the URL", async () => {
    renderWithIntl(<JournalBrowser />);
    await userEvent.click(screen.getByRole("button", { name: copy.categories.materials }));

    expect(titles()).toEqual(["Why we keep returning to lime plaster"]);
    expect(count()).toBe("1 article");
    expect(screen.getByRole("button", { name: copy.categories.materials })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(window.history.replaceState).toHaveBeenLastCalledWith(null, "", "?category=materials");
  });

  it("only offers categories that have articles", () => {
    renderWithIntl(<JournalBrowser />);
    expect(
      screen.queryByRole("button", { name: copy.categories.interior }),
    ).not.toBeInTheDocument();
  });

  it("searches as the visitor types", async () => {
    renderWithIntl(<JournalBrowser />);
    await userEvent.type(screen.getByLabelText(copy.searchLabel), "courtyard");

    expect(titles()).toEqual(["The courtyard, reconsidered"]);
    expect(window.history.replaceState).toHaveBeenLastCalledWith(null, "", "?q=courtyard");
  });

  it("explains an empty result and recovers with clear filters", async () => {
    renderWithIntl(<JournalBrowser />);
    await userEvent.type(screen.getByLabelText(copy.searchLabel), "zzz");

    expect(screen.getByRole("heading", { name: copy.emptyTitle })).toBeInTheDocument();
    await userEvent.click(screen.getAllByRole("button", { name: copy.clearFilters })[0]!);

    expect(titles()).toHaveLength(articles.length);
    expect(screen.getByLabelText(copy.searchLabel)).toHaveValue("");
  });

  it("restores filters from the URL and ignores unknown categories", () => {
    search.value = "category=lighting";
    const { unmount } = renderWithIntl(<JournalBrowser />);
    expect(titles()).toEqual(["Evening light: choose warmth over brightness"]);
    unmount();

    search.value = "category=interior";
    renderWithIntl(<JournalBrowser />);
    expect(titles()).toHaveLength(articles.length);
  });

  it("works in Persian with Persian digits", async () => {
    renderWithIntl(<JournalBrowser />, { locale: "fa" });
    expect(count()).toBe("۶ مقاله");

    await userEvent.type(screen.getByLabelText(fa.Journal.searchLabel), "نور");
    expect(titles()).toContain("نور روز در اتاق‌های کوچک");
  });
});
