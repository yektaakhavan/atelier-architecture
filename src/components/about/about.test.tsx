import { screen, within } from "@testing-library/react";
import en from "@/messages/en.json";
import fa from "@/messages/fa.json";
import { renderWithIntl } from "@/test-utils/render-with-intl";
import { AboutCollaboration, AboutTeam } from "./about-practice";
import { AboutPhilosophy } from "./about-story";

vi.mock("@/i18n/navigation", () => ({
  Link: ({
    href,
    locale,
    ...props
  }: { href: string; locale?: string } & Record<string, unknown>) => (
    <a href={`/${locale ?? "en"}${href}`} {...props} />
  ),
}));

describe("About sections", () => {
  it("lists the four collaboration steps in order", () => {
    renderWithIntl(<AboutCollaboration />);
    const items = within(
      screen.getByRole("region", { name: en.About.collaborationTitle }),
    ).getAllByRole("listitem");

    expect(items).toHaveLength(4);
    expect(items[0]).toHaveTextContent(en.About.step1Title);
    expect(items[3]).toHaveTextContent(en.About.step4Title);
  });

  it("labels the team as fictional and shows every member", () => {
    renderWithIntl(<AboutTeam />);

    expect(screen.getByText(en.About.teamNote)).toBeInTheDocument();
    for (const name of [
      en.About.member1Name,
      en.About.member2Name,
      en.About.member3Name,
      en.About.member4Name,
    ]) {
      expect(screen.getByRole("heading", { level: 3, name })).toBeInTheDocument();
    }
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("numbers principles with Persian digits in Persian", () => {
    renderWithIntl(<AboutPhilosophy />, { locale: "fa" });

    expect(screen.getByText("۰۱")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: fa.About.principle1Title }),
    ).toBeInTheDocument();
  });
});
