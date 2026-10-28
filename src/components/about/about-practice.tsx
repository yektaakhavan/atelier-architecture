import { useFormatter, useTranslations } from "next-intl";
import { ProjectCard } from "@/components/projects/project-card";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { ButtonLink } from "@/components/ui/link";
import { featuredProjects } from "@/data/projects";

const values = [1, 2, 3] as const;
const points = [1, 2, 3] as const;
const steps = [1, 2, 3, 4] as const;
const members = [1, 2, 3, 4] as const;

export function AboutValues() {
  const t = useTranslations("About");

  return (
    <Section labelledBy="values-title" className="border-t border-line">
      <SectionHeading id="values-title" title={t("valuesTitle")} />
      <ul className="mt-12 grid gap-8 md:grid-cols-3">
        {values.map((n) => (
          <li key={n} className="border-t border-foreground/30 pt-4">
            <h3 className="mb-2 text-xl font-medium">{t(`value${n}Title`)}</h3>
            <p className="text-muted">{t(`value${n}Text`)}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function AboutSustainability() {
  const t = useTranslations("About");

  return (
    <Section labelledBy="sustainability-title" className="border-t border-line">
      <div className="grid gap-10 md:grid-cols-12 md:gap-8">
        <div className="flex flex-col gap-6 md:col-span-6">
          <SectionHeading id="sustainability-title" title={t("sustainabilityTitle")} />
          <p className="max-w-xl text-lg text-muted">{t("sustainabilityText")}</p>
        </div>
        <ul className="flex flex-col md:col-span-6">
          {points.map((n) => (
            <li key={n} className="border-t border-line py-5 text-xl last:border-b">
              {t(`point${n}`)}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

export function AboutCollaboration() {
  const t = useTranslations("About");
  const format = useFormatter();

  return (
    <Section labelledBy="collaboration-title" className="border-t border-line">
      <SectionHeading id="collaboration-title" title={t("collaborationTitle")} />
      <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((n) => (
          <li key={n} className="border-t border-foreground/30 pt-4">
            <p className="mb-3 text-sm text-accent-ink">
              {format.number(n, { minimumIntegerDigits: 2 })}
            </p>
            <h3 className="mb-2 text-lg font-medium">{t(`step${n}Title`)}</h3>
            <p className="text-sm text-muted">{t(`step${n}Text`)}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

export function AboutTeam() {
  const t = useTranslations("About");

  return (
    <Section labelledBy="team-title" className="border-t border-line">
      <div className="flex flex-col gap-3">
        <SectionHeading id="team-title" title={t("teamTitle")} />
        <p className="text-sm text-muted">{t("teamNote")}</p>
      </div>
      <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {members.map((n) => {
          const name = t(`member${n}Name`);
          return (
            <li key={n} className="flex items-center gap-4">
              {/* Monogram instead of a portrait: no stock photo is passed off as a real person. */}
              <span
                aria-hidden
                className="grid size-16 shrink-0 place-items-center bg-olive-ink text-xl font-medium text-background"
              >
                {name.charAt(0)}
              </span>
              <div>
                <h3 className="font-medium">{name}</h3>
                <p className="text-sm text-muted">{t(`member${n}Role`)}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

export function AboutProjects() {
  const t = useTranslations("About");

  return (
    <Section labelledBy="about-projects-title" className="border-t border-line">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading
          id="about-projects-title"
          eyebrow={t("projectsEyebrow")}
          title={t("projectsTitle")}
        />
        <ButtonLink href="/projects" variant="outline">
          {t("projectsViewAll")}
        </ButtonLink>
      </div>
      <div className="mt-12 grid gap-x-8 gap-y-12 md:grid-cols-3">
        {featuredProjects.slice(0, 3).map((project) => (
          <ProjectCard
            key={project.slug}
            project={project}
            ratio="portrait"
            sizes="(min-width: 768px) 30vw, 100vw"
          />
        ))}
      </div>
    </Section>
  );
}
