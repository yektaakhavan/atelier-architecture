import { render, screen, within } from "@testing-library/react";
import { Breadcrumb } from "./breadcrumb";

vi.mock("@/i18n/navigation", () => ({
  Link: ({
    href,
    locale,
    ...props
  }: { href: string; locale?: string } & Record<string, unknown>) => (
    <a href={`/${locale ?? "en"}${href}`} {...props} />
  ),
}));

describe("Breadcrumb", () => {
  const items = [
    { label: "Home", href: "/" },
    { label: "Projects", href: "/projects" },
    { label: "Casa Olivo" },
  ];

  it("is a labelled navigation landmark with an ordered list", () => {
    render(<Breadcrumb label="Breadcrumb" items={items} />);
    const nav = screen.getByRole("navigation", { name: "Breadcrumb" });

    expect(within(nav).getAllByRole("listitem")).toHaveLength(3);
  });

  it("links the ancestors and marks the last item as the current page", () => {
    render(<Breadcrumb label="Breadcrumb" items={items} />);

    expect(screen.getByRole("link", { name: "Projects" })).toHaveAttribute("href", "/en/projects");
    expect(screen.queryByRole("link", { name: "Casa Olivo" })).not.toBeInTheDocument();
    expect(screen.getByText("Casa Olivo")).toHaveAttribute("aria-current", "page");
  });
});
