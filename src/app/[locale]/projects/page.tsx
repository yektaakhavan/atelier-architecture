import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProjectGrid } from "@/components/projects/project-grid";
import { ProjectsBrowser } from "@/components/projects/projects-browser";
import { SectionHeading } from "@/components/shared/section-heading";
import { Container } from "@/components/ui/container";
import { projects } from "@/data/projects";
import { sortProjects } from "@/features/projects/lib/filters";
import { routing } from "@/i18n/routing";
import { localizedAlternates } from "@/lib/seo";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "Projects" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: localizedAlternates(locale, "/projects"),
  };
}

export default async function ProjectsPage({ params }: PageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("Projects");

  return (
    <Container className="flex flex-col gap-12 py-12 md:py-20">
      <SectionHeading
        level={1}
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("intro")}
      />
      {/* The fallback is the full archive, so the static HTML is useful before (or without) JavaScript. */}
      <Suspense fallback={<ProjectGrid projects={sortProjects(projects, "newest", locale)} />}>
        <ProjectsBrowser />
      </Suspense>
    </Container>
  );
}
