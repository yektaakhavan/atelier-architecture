import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ExpertiseList } from "@/components/home/expertise-list";
import { FeaturedProjects } from "@/components/home/featured-projects";
import { Hero } from "@/components/home/hero";
import { JournalPreview } from "@/components/home/journal-preview";
import { MoreProjects } from "@/components/home/more-projects";
import { StudioIntro } from "@/components/home/studio-intro";
import { StudioStats } from "@/components/home/studio-stats";
import { CtaBand } from "@/components/shared/cta-band";
import { routing } from "@/i18n/routing";
import { localizedAlternates } from "@/lib/seo";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  return { alternates: localizedAlternates(locale, "/") };
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("Home");

  return (
    <>
      <Hero />
      <FeaturedProjects />
      <StudioIntro />
      <StudioStats />
      <ExpertiseList />
      <MoreProjects />
      <JournalPreview />
      <CtaBand id="home-cta" title={t("ctaTitle")} text={t("ctaText")} button={t("ctaButton")} />
    </>
  );
}
