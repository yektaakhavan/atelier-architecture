import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import en from "@/messages/en.json";
import fa from "@/messages/fa.json";
import { renderWithIntl } from "@/test-utils/render-with-intl";
import { SiteHeader } from "./site-header";

vi.mock("next/navigation", () => ({ useSearchParams: () => new URLSearchParams() }));
vi.mock("@/i18n/navigation", () => ({
  usePathname: () => "/services",
  Link: ({
    href,
    locale,
    ...props
  }: { href: string; locale?: string } & Record<string, unknown>) => (
    <a href={`/${locale ?? "en"}${href}`} {...props} />
  ),
}));

describe("SiteHeader", () => {
  it("lists the main sections and marks the current page", () => {
    renderWithIntl(<SiteHeader />);
    const nav = screen.getAllByRole("navigation", { name: en.Nav.primary })[0]!;

    for (const label of [
      en.Nav.projects,
      en.Nav.services,
      en.Nav.about,
      en.Nav.journal,
      en.Nav.contact,
    ]) {
      expect(within(nav).getByRole("link", { name: label })).toBeInTheDocument();
    }
    expect(within(nav).getByRole("link", { name: en.Nav.services })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(within(nav).getByRole("link", { name: en.Nav.about })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("keeps the mobile menu closed until requested", () => {
    renderWithIntl(<SiteHeader />);
    const opener = screen.getByRole("button", { name: en.Nav.openMenu });

    expect(opener).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens and closes the mobile menu", async () => {
    renderWithIntl(<SiteHeader />);
    await userEvent.click(screen.getByRole("button", { name: en.Nav.openMenu }));

    expect(screen.getByRole("button", { name: en.Nav.openMenu })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    const dialog = screen.getByRole("dialog", { name: en.Nav.menu });
    expect(within(dialog).getByRole("link", { name: en.Nav.contact })).toBeInTheDocument();

    await userEvent.click(within(dialog).getByRole("button", { name: en.Nav.closeMenu }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: en.Nav.openMenu })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("closes the menu after choosing a link", async () => {
    renderWithIntl(<SiteHeader />);
    await userEvent.click(screen.getByRole("button", { name: en.Nav.openMenu }));
    const dialog = screen.getByRole("dialog");
    await userEvent.click(within(dialog).getByRole("link", { name: en.Nav.about }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("restores page scrolling when the menu closes", async () => {
    renderWithIntl(<SiteHeader />);
    await userEvent.click(screen.getByRole("button", { name: en.Nav.openMenu }));
    expect(document.documentElement.style.overflow).toBe("hidden");

    await userEvent.click(screen.getByRole("button", { name: en.Nav.closeMenu }));
    expect(document.documentElement.style.overflow).toBe("");
  });

  it("renders Persian labels", () => {
    renderWithIntl(<SiteHeader />, { locale: "fa" });
    const nav = screen.getAllByRole("navigation", { name: fa.Nav.primary })[0]!;
    expect(within(nav).getByRole("link", { name: fa.Nav.projects })).toBeInTheDocument();
  });
});
