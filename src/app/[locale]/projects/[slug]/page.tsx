import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ProjectHeader, ProjectRelated, ProjectStory } from "@/components/projects/project-detail";
import { JsonLd } from "@/components/shared/json-ld";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Container } from "@/components/ui/container";
import { getProjectDetails, projectDetails } from "@/data/project-details";
import { projects } from "@/data/projects";
import { getRelatedProjects } from "@/features/projects/lib/related";
import { routing } from "@/i18n/routing";
import { localizedAlternates } from "@/lib/seo";
import { breadcrumbList } from "@/lib/structured-data";

type PageProps = { params: Promise<{ locale: string; slug: string }> };

// Only the known slugs exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => projects.map(({ slug }) => ({ locale, slug })));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!hasLocale(routing.locales, locale) || !project) return {};

  return {
    title: project.title[locale],
    description: project.summary[locale],
    alternates: localizedAlternates(locale, `/projects/${slug}`),
    openGraph: { title: project.title[locale], description: project.summary[locale] },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const project = projects.find((p) => p.slug === slug);
  const details = getProjectDetails(slug);
  if (!project || !details) notFound();
  setRequestLocale(locale);

  const nav = await getTranslations("Nav");
  const related = getRelatedProjects(project, projects, projectDetails);

  return (
    <>
      <JsonLd
        data={breadcrumbList([
          { name: nav("home"), path: `/${locale}` },
          { name: nav("projects"), path: `/${locale}/projects` },
          { name: project.title[locale], path: `/${locale}/projects/${slug}` },
        ])}
      />
      <Container className="py-8">
        <Breadcrumb
          label={nav("breadcrumb")}
          items={[
            { label: nav("home"), href: "/" },
            { label: nav("projects"), href: "/projects" },
            { label: project.title[locale] },
          ]}
        />
      </Container>
      <ProjectHeader project={project} details={details} />
      <ProjectStory project={project} details={details} />
      <ProjectRelated projects={related} />
    </>
  );
}
