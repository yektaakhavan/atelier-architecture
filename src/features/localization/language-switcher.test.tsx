import { screen } from "@testing-library/react";
import fa from "@/messages/fa.json";
import { renderWithIntl } from "@/test-utils/render-with-intl";
import { LanguageSwitcher } from "./language-switcher";

const search = vi.hoisted(() => ({ value: "" }));

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(search.value),
}));

vi.mock("@/i18n/navigation", () => ({
  usePathname: () => "/projects",
  Link: ({
    href,
    locale,
    ...props
  }: { href: string; locale: string } & Record<string, unknown>) => (
    <a href={`/${locale}${href}`} {...props} />
  ),
}));

describe("LanguageSwitcher", () => {
  beforeEach(() => {
    search.value = "";
  });

  it("marks the current language and links to the other one", () => {
    renderWithIntl(<LanguageSwitcher />);

    expect(screen.getByText("English")).toHaveAttribute("aria-current", "true");
    const link = screen.getByRole("link", { name: "فارسی" });
    expect(link).toHaveAttribute("href", "/fa/projects");
    expect(link).toHaveAttribute("lang", "fa");
    expect(link).toHaveAttribute("hreflang", "fa");
  });

  it("keeps the visitor on the equivalent page, preserving query params", () => {
    search.value = "type=residential&year=2024";
    renderWithIntl(<LanguageSwitcher />);

    expect(screen.getByRole("link", { name: "فارسی" })).toHaveAttribute(
      "href",
      "/fa/projects?type=residential&year=2024",
    );
  });

  it("flips the current language and the group label for Persian", () => {
    renderWithIntl(<LanguageSwitcher />, { locale: "fa" });

    expect(screen.getByRole("navigation", { name: fa.LanguageSwitcher.label })).toBeInTheDocument();
    expect(screen.getByText("فارسی")).toHaveAttribute("aria-current", "true");
    expect(screen.getByRole("link", { name: "English" })).toHaveAttribute("href", "/en/projects");
  });
});
