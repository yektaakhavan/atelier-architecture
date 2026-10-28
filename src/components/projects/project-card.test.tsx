import { screen } from "@testing-library/react";
import { projects } from "@/data/projects";
import { renderWithIntl } from "@/test-utils/render-with-intl";
import { ProjectCard } from "./project-card";

vi.mock("@/i18n/navigation", () => ({
  Link: ({
    href,
    locale,
    ...props
  }: { href: string; locale?: string } & Record<string, unknown>) => (
    <a href={`/${locale ?? "en"}${href}`} {...props} />
  ),
}));

const project = projects[0]!;

describe("ProjectCard", () => {
  it("links to the project page and shows its key facts", () => {
    renderWithIntl(<ProjectCard project={project} />);

    expect(screen.getByRole("link")).toHaveAttribute("href", `/en/projects/${project.slug}`);
    expect(screen.getByRole("heading", { level: 3, name: project.title.en })).toBeInTheDocument();
    expect(screen.getByText(project.location.en)).toBeInTheDocument();
    expect(screen.getByText(/Residential · 2024/)).toBeInTheDocument();
  });

  it("describes the artwork as an illustration, not a photograph", () => {
    renderWithIntl(<ProjectCard project={project} />);
    expect(
      screen.getByRole("img", { name: `Illustration of ${project.title.en}` }),
    ).toBeInTheDocument();
  });

  it("renders Persian text with Persian digits", () => {
    renderWithIntl(<ProjectCard project={project} />, { locale: "fa" });

    expect(screen.getByRole("heading", { level: 3, name: project.title.fa })).toBeInTheDocument();
    expect(screen.getByText(/مسکونی · ۲۰۲۴/)).toBeInTheDocument();
  });
});
