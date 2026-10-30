import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { projects } from "@/data/projects";
import en from "@/messages/en.json";
import fa from "@/messages/fa.json";
import { renderWithIntl } from "@/test-utils/render-with-intl";
import { ProjectsBrowser } from "./projects-browser";

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

const copy = en.Projects;
const titles = () =>
  screen.getAllByRole("heading", { level: 2 }).map((heading) => heading.textContent);
const count = () => screen.getByRole("status").textContent;

describe("ProjectsBrowser", () => {
  beforeEach(() => {
    search.value = "";
    vi.spyOn(window.history, "replaceState");
  });
  afterEach(() => vi.restoreAllMocks());

  it("shows every project and the total count at first", () => {
    renderWithIntl(<ProjectsBrowser />);

    expect(titles()).toHaveLength(projects.length);
    expect(count()).toBe("8 projects");
    expect(screen.queryByRole("button", { name: copy.clearFilters })).not.toBeInTheDocument();
  });

  it("filters by project type and records it in the URL", async () => {
    renderWithIntl(<ProjectsBrowser />);
    await userEvent.click(screen.getByRole("button", { name: copy.categories.commercial }));

    expect(titles().sort()).toEqual(["Canopy Offices", "North Light Studios"]);
    expect(count()).toBe("2 projects");
    expect(screen.getByRole("button", { name: copy.categories.commercial })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: copy.allTypes })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(window.history.replaceState).toHaveBeenLastCalledWith(null, "", "?type=commercial");
  });

  it("searches by name as the visitor types", async () => {
    renderWithIntl(<ProjectsBrowser />);
    await userEvent.type(screen.getByLabelText(copy.searchLabel), "olivo");

    expect(titles()).toEqual(["Casa Olivo"]);
    expect(count()).toBe("1 project");
    expect(window.history.replaceState).toHaveBeenLastCalledWith(null, "", "?q=olivo");
  });

  it("filters by year and by location", async () => {
    renderWithIntl(<ProjectsBrowser />);
    await userEvent.selectOptions(screen.getByLabelText(copy.yearLabel), "2022");
    expect(titles().sort()).toEqual(["Brick Mill Renewal", "Salt Pavilion"]);

    await userEvent.selectOptions(screen.getByLabelText(copy.yearLabel), "all");
    expect(screen.getByRole("option", { name: "Iran" })).toBeInTheDocument();
    await userEvent.selectOptions(screen.getByLabelText(copy.countryLabel), "IR");
    expect(count()).toBe("3 projects");
  });

  it("re-sorts the list", async () => {
    renderWithIntl(<ProjectsBrowser />);
    await userEvent.selectOptions(screen.getByLabelText(copy.sortLabel), "title");
    const sorted = titles();

    expect(sorted).toEqual([...sorted].sort((a, b) => a!.localeCompare(b!, "en")));
    expect(sorted[0]).toBe("Brick Mill Renewal");

    await userEvent.selectOptions(screen.getByLabelText(copy.sortLabel), "oldest");
    expect(titles()[0]).toMatch(/Brick Mill Renewal|Salt Pavilion/);
  });

  it("explains an empty result and lets the visitor recover", async () => {
    renderWithIntl(<ProjectsBrowser />);
    await userEvent.type(screen.getByLabelText(copy.searchLabel), "zzz");

    expect(screen.getByRole("heading", { name: copy.emptyTitle })).toBeInTheDocument();
    expect(count()).toBe("0 projects");

    await userEvent.click(screen.getAllByRole("button", { name: copy.clearFilters })[0]!);
    expect(titles()).toHaveLength(projects.length);
    expect(screen.getByLabelText(copy.searchLabel)).toHaveValue("");
    expect(window.history.replaceState).toHaveBeenLastCalledWith(null, "", "/");
  });

  it("clearing filters keeps the chosen sort order", async () => {
    renderWithIntl(<ProjectsBrowser />);
    await userEvent.selectOptions(screen.getByLabelText(copy.sortLabel), "title");
    await userEvent.click(screen.getByRole("button", { name: copy.categories.interior }));
    await userEvent.click(screen.getByRole("button", { name: copy.clearFilters }));

    expect(screen.getByLabelText(copy.sortLabel)).toHaveValue("title");
    expect(titles()).toHaveLength(projects.length);
  });

  it("restores filters from the URL", () => {
    search.value = "type=interior&sort=oldest";
    renderWithIntl(<ProjectsBrowser />);

    expect(titles()).toEqual(["Oak & Lime Apartment"]);
    expect(screen.getByRole("button", { name: copy.categories.interior })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByLabelText(copy.sortLabel)).toHaveValue("oldest");
  });

  it("ignores invalid values in the URL", () => {
    search.value = "type=spaceship&year=1800&country=ZZ";
    renderWithIntl(<ProjectsBrowser />);
    expect(titles()).toHaveLength(projects.length);
  });

  it("toggles the filter panel on small screens and shows how many filters are active", async () => {
    renderWithIntl(<ProjectsBrowser />);
    const toggle = screen.getByRole("button", { name: copy.filters });

    expect(toggle).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");

    await userEvent.click(screen.getByRole("button", { name: copy.categories.cultural }));
    expect(screen.getByRole("button", { name: `${copy.filters} (1)` })).toBeInTheDocument();
  });

  it("renders in Persian with Persian digits, titles and country names", async () => {
    renderWithIntl(<ProjectsBrowser />, { locale: "fa" });

    expect(count()).toBe("۸ پروژه");
    expect(titles()).toContain("خانه زیتون");
    expect(screen.getByRole("option", { name: "ایران" })).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: fa.Projects.categories.residential }));
    expect(count()).toBe("۲ پروژه");
  });
});
