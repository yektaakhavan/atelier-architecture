import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import {
  AboutCollaboration,
  AboutProjects,
  AboutSustainability,
  AboutTeam,
  AboutValues,
} from "@/components/about/about-practice";
import { AboutPhilosophy, AboutStory } from "@/components/about/about-story";
import { CtaBand } from "@/components/shared/cta-band";
import { SectionHeading } from "@/components/shared/section-heading";
import { Container } from "@/components/ui/container";
import { routing } from "@/i18n/routing";
import { localizedAlternates } from "@/lib/seo";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "About" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: localizedAlternates(locale, "/about"),
  };
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("About");

  return (
    <>
      <Container className="py-12 md:py-20">
        <SectionHeading
          level={1}
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("intro")}
        />
      </Container>
      <AboutStory />
      <AboutPhilosophy />
      <AboutValues />
      <AboutSustainability />
      <AboutCollaboration />
      <AboutTeam />
      <AboutProjects />
      <CtaBand id="about-cta" title={t("ctaTitle")} text={t("ctaText")} button={t("ctaButton")} />
    </>
  );
}
