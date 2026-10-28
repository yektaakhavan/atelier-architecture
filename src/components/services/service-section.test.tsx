import { screen, within } from "@testing-library/react";
import { services } from "@/data/services";
import en from "@/messages/en.json";
import fa from "@/messages/fa.json";
import { renderWithIntl } from "@/test-utils/render-with-intl";
import { ServiceSection } from "./service-section";

vi.mock("@/i18n/navigation", () => ({
  Link: ({
    href,
    locale,
    ...props
  }: { href: string; locale?: string } & Record<string, unknown>) => (
    <a href={`/${locale ?? "en"}${href}`} {...props} />
  ),
}));

const service = services.find((s) => s.id === "commercial")!;
const copy = en.Services.items.commercial;

describe("ServiceSection", () => {
  it("is a labelled region with the service title and description", () => {
    renderWithIntl(<ServiceSection service={service} index={0} />);

    const region = screen.getByRole("region", { name: copy.title });
    expect(region).toHaveAttribute("id", "commercial");
    expect(within(region).getByText(copy.description)).toBeInTheDocument();
  });

  it("lists the three process steps in order", () => {
    renderWithIntl(<ServiceSection service={service} index={0} />);
    const items = screen.getAllByRole("listitem");

    expect(items).toHaveLength(3);
    expect(items[0]).toHaveTextContent(copy.step1Title);
    expect(items[2]).toHaveTextContent(copy.step3Title);
  });

  it("links to each related project and to the contact page", () => {
    renderWithIntl(<ServiceSection service={service} index={0} />);

    expect(screen.getByRole("link", { name: /North Light Studios/ })).toHaveAttribute(
      "href",
      "/en/projects/north-light-studios",
    );
    expect(screen.getByRole("link", { name: en.Services.cta })).toHaveAttribute(
      "href",
      "/en/contact",
    );
  });

  it("renders in Persian with Persian numerals", () => {
    renderWithIntl(<ServiceSection service={service} index={0} />, { locale: "fa" });

    expect(
      screen.getByRole("heading", { level: 2, name: fa.Services.items.commercial.title }),
    ).toBeInTheDocument();
    expect(screen.getByText("۰۱")).toBeInTheDocument();
  });
});
