import { screen, within } from "@testing-library/react";
import { getProjectDetails } from "@/data/project-details";
import { projects } from "@/data/projects";
import en from "@/messages/en.json";
import { renderWithIntl } from "@/test-utils/render-with-intl";
import { ProjectHeader, ProjectRelated, ProjectStory } from "./project-detail";

vi.mock("@/i18n/navigation", () => ({
  Link: ({
    href,
    locale,
    ...props
  }: { href: string; locale?: string } & Record<string, unknown>) => (
    <a href={`/${locale ?? "en"}${href}`} {...props} />
  ),
}));

const project = projects.find((p) => p.slug === "casa-olivo")!;
const details = getProjectDetails("casa-olivo")!;

describe("ProjectHeader", () => {
  it("shows the title, summary and key facts", () => {
    renderWithIntl(<ProjectHeader project={project} details={details} />);

    expect(screen.getByRole("heading", { level: 1, name: "Casa Olivo" })).toBeInTheDocument();
    expect(screen.getByText(project.summary.en)).toBeInTheDocument();
    expect(screen.getByText("Lisbon, Portugal")).toBeInTheDocument();
    expect(screen.getByText("2024")).toBeInTheDocument();
    expect(screen.getByText("Residential")).toBeInTheDocument();
    expect(screen.getByText("420 m²")).toBeInTheDocument();
  });

  it("links services to their section and lists the team", () => {
    renderWithIntl(<ProjectHeader project={project} details={details} />);

    expect(screen.getByRole("link", { name: en.Services.items.residential.title })).toHaveAttribute(
      "href",
      "/en/services#residential",
    );
    expect(screen.getByText(en.About.member1Name)).toBeInTheDocument();
    expect(screen.getByText(en.About.member3Name)).toBeInTheDocument();
  });

  it("omits the area when it is unknown", () => {
    renderWithIntl(<ProjectHeader project={project} details={{ ...details, area: undefined }} />);
    expect(screen.queryByText(en.ProjectDetail.area)).not.toBeInTheDocument();
  });

  it("formats area and year for Persian readers", () => {
    renderWithIntl(<ProjectHeader project={project} details={details} />, { locale: "fa" });

    expect(screen.getByText("۴۲۰ متر مربع")).toBeInTheDocument();
    expect(screen.getByText("۲۰۲۴")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "خانه زیتون" })).toBeInTheDocument();
  });
});

describe("ProjectStory", () => {
  it("presents concept, approach, materials, challenge/solution and the gallery", () => {
    renderWithIntl(<ProjectStory project={project} details={details} />);

    expect(screen.getByRole("region", { name: en.ProjectDetail.concept })).toHaveTextContent(
      details.concept.en,
    );
    expect(
      screen.getByRole("heading", { level: 2, name: en.ProjectDetail.approach }),
    ).toBeInTheDocument();
    const materials = within(
      screen.getByRole("region", { name: en.ProjectDetail.materials }),
    ).getAllByRole("listitem");
    expect(materials.map((item) => item.textContent)).toEqual(details.materials.en);
    expect(screen.getByText(details.challenge.en)).toBeInTheDocument();
    expect(screen.getByText(details.solution.en)).toBeInTheDocument();
    expect(screen.getByRole("region", { name: en.ProjectDetail.gallery })).toBeInTheDocument();
  });
});

describe("ProjectRelated", () => {
  it("lists related projects and links back to the archive", () => {
    renderWithIntl(<ProjectRelated projects={projects.slice(1, 4)} />);

    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(3);
    expect(screen.getByRole("link", { name: en.ProjectDetail.back })).toHaveAttribute(
      "href",
      "/en/projects",
    );
  });
});
