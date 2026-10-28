import { useTranslations } from "next-intl";
import { ProjectCard } from "@/components/projects/project-card";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { archiveProjects } from "@/data/projects";

export function MoreProjects() {
  const t = useTranslations("Home");

  return (
    <Section labelledBy="more-title" className="border-t border-line">
      <SectionHeading id="more-title" eyebrow={t("moreEyebrow")} title={t("moreTitle")} />
      <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        {archiveProjects.slice(0, 4).map((project) => (
          <ProjectCard
            key={project.slug}
            project={project}
            ratio="square"
            sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw"
          />
        ))}
      </div>
    </Section>
  );
}
