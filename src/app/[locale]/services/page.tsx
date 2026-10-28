import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ServiceSection } from "@/components/services/service-section";
import { SectionHeading } from "@/components/shared/section-heading";
import { Container } from "@/components/ui/container";
import { services } from "@/data/services";
import { routing } from "@/i18n/routing";
import { localizedAlternates } from "@/lib/seo";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "Services" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: localizedAlternates(locale, "/services"),
  };
}

export default async function ServicesPage({ params }: PageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("Services");

  return (
    <Container className="pt-12 md:pt-20">
      <SectionHeading
        level={1}
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("intro")}
        className="pb-16"
      />
      {services.map((service, index) => (
        <ServiceSection key={service.id} service={service} index={index} />
      ))}
    </Container>
  );
}
