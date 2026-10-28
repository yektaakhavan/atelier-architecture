import { useTranslations } from "next-intl";
import { ProjectCard } from "@/components/projects/project-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { Section } from "@/components/shared/section";
import { ButtonLink } from "@/components/ui/link";
import { featuredProjects } from "@/data/projects";

// Deliberately uneven: sizes and vertical offsets give the grid an editorial rhythm.
const layout = [
  { className: "md:col-span-7", ratio: "landscape", sizes: "(min-width: 768px) 58vw, 100vw" },
  {
    className: "md:col-span-5 md:mt-40",
    ratio: "portrait",
    sizes: "(min-width: 768px) 40vw, 100vw",
  },
  { className: "md:col-span-5", ratio: "portrait", sizes: "(min-width: 768px) 40vw, 100vw" },
  {
    className: "md:col-span-7 md:mt-24",
    ratio: "landscape",
    sizes: "(min-width: 768px) 58vw, 100vw",
  },
] as const;

export function FeaturedProjects() {
  const t = useTranslations("Home");

  return (
    <Section labelledBy="featured-title">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading
          id="featured-title"
          eyebrow={t("featuredEyebrow")}
          title={t("featuredTitle")}
        />
        <ButtonLink href="/projects" variant="outline">
          {t("featuredViewAll")}
        </ButtonLink>
      </div>
      <div className="mt-14 grid gap-x-8 gap-y-16 md:grid-cols-12">
        {featuredProjects.slice(0, layout.length).map((project, index) => {
          const slot = layout[index]!;
          return (
            <ProjectCard
              key={project.slug}
              project={project}
              ratio={slot.ratio}
              sizes={slot.sizes}
              className={slot.className}
            />
          );
        })}
      </div>
    </Section>
  );
}
