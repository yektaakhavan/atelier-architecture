import { ArrowLeft } from "lucide-react";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { ButtonLink, Link } from "@/components/ui/link";
import { Container } from "@/components/ui/container";
import type { Project, ProjectDetails } from "@/types/content";
import { ProjectCard } from "./project-card";
import { ProjectGallery } from "./project-gallery";
import { ProjectImage } from "./project-image";

type DetailProps = { project: Project; details: ProjectDetails };

export function ProjectHeader({ project, details }: DetailProps) {
  const t = useTranslations("ProjectDetail");
  const projectsT = useTranslations("Projects");
  const services = useTranslations("Services.items");
  const about = useTranslations("About");
  const format = useFormatter();
  const locale = useLocale();
  const title = project.title[locale];

  const facts = [
    { label: t("location"), value: <>{project.location[locale]}</> },
    { label: t("year"), value: <>{format.number(project.year, { useGrouping: false })}</> },
    { label: t("type"), value: <>{projectsT(`categories.${project.category}`)}</> },
    ...(details.area
      ? [{ label: t("area"), value: <>{t("areaValue", { value: details.area })}</> }]
      : []),
    {
      label: t("services"),
      value: (
        <ul className="flex flex-col gap-1">
          {details.services.map((id) => (
            <li key={id}>
              <Link href={`/services#${id}`}>{services(`${id}.title`)}</Link>
            </li>
          ))}
        </ul>
      ),
    },
    {
      label: t("team"),
      value: (
        <ul className="flex flex-col gap-1">
          {details.team.map((id) => (
            <li key={id}>{about(`member${id}Name`)}</li>
          ))}
        </ul>
      ),
    },
  ];

  return (
    <>
      <Container className="grid gap-10 pb-12 md:grid-cols-12 md:gap-8 md:pb-16">
        <div className="flex flex-col gap-6 md:col-span-7">
          <h1 className="text-[clamp(2.4rem,6vw,5.5rem)] font-medium leading-[1.02] tracking-tight text-balance rtl:leading-[1.3]">
            {title}
          </h1>
          <p className="max-w-xl text-lg text-muted">{project.summary[locale]}</p>
        </div>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-5 text-sm md:col-span-5 md:self-end">
          {facts.map(({ label, value }) => (
            <div key={label} className="border-t border-line pt-3">
              <dt className="mb-1 text-muted">{label}</dt>
              <dd className="font-medium">{value}</dd>
            </div>
          ))}
        </dl>
      </Container>
      <Container>
        <div className="relative aspect-[16/9] overflow-hidden bg-surface">
          <ProjectImage
            image={project.image}
            alt={projectsT("illustrationOf", { title })}
            priority
            sizes="100vw"
          />
        </div>
      </Container>
    </>
  );
}

export function ProjectStory({ project, details }: DetailProps) {
  const t = useTranslations("ProjectDetail");
  const locale = useLocale();
  const title = project.title[locale];

  return (
    <>
      <Section labelledBy="concept-title" className="pb-0">
        <div className="grid gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-6">
            <SectionHeading id="concept-title" title={t("concept")} />
            <p className="mt-6 max-w-xl text-lg text-muted">{details.concept[locale]}</p>
          </div>
          <div className="md:col-span-6">
            <h2 className="text-headline font-medium text-balance">{t("approach")}</h2>
            <p className="mt-6 max-w-xl text-lg text-muted">{details.approach[locale]}</p>
          </div>
        </div>
      </Section>

      <Section labelledBy="materials-title">
        <div className="grid gap-12 border-t border-line pt-16 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-6">
            <SectionHeading id="materials-title" title={t("materials")} />
            <ul className="mt-8">
              {details.materials[locale].map((material) => (
                <li key={material} className="border-t border-line py-4 text-lg last:border-b">
                  {material}
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-6">
            <h2 className="text-headline font-medium text-balance">{t("challenges")}</h2>
            <dl className="mt-8 flex flex-col gap-6">
              <div className="border-t border-foreground/30 pt-3">
                <dt className="mb-1 text-sm text-accent-ink">{t("challengeLabel")}</dt>
                <dd className="text-lg">{details.challenge[locale]}</dd>
              </div>
              <div className="border-t border-foreground/30 pt-3">
                <dt className="mb-1 text-sm text-accent-ink">{t("solutionLabel")}</dt>
                <dd className="text-lg">{details.solution[locale]}</dd>
              </div>
            </dl>
          </div>
        </div>
      </Section>

      <Section labelledBy="gallery-title" className="pt-0">
        <div className="mb-8 flex flex-col gap-2">
          <h2 id="gallery-title" className="text-headline font-medium">
            {t("gallery")}
          </h2>
          <p className="text-sm text-muted">{t("galleryNote")}</p>
        </div>
        <ProjectGallery images={details.gallery} title={title} />
      </Section>
    </>
  );
}

export function ProjectRelated({ projects }: { projects: readonly Project[] }) {
  const t = useTranslations("ProjectDetail");

  return (
    <Section labelledBy="related-title" className="border-t border-line">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h2 id="related-title" className="text-headline font-medium">
          {t("related")}
        </h2>
        <ButtonLink href="/projects" variant="outline">
          <ArrowLeft aria-hidden className="size-4 rtl:-scale-x-100" />
          {t("back")}
        </ButtonLink>
      </div>
      <div className="mt-12 grid gap-x-8 gap-y-12 md:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard
            key={project.slug}
            project={project}
            ratio="landscape"
            sizes="(min-width: 768px) 30vw, 100vw"
          />
        ))}
      </div>
    </Section>
  );
}
