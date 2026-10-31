import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { LegalDocument } from "@/components/shared/legal-document";
import { routing } from "@/i18n/routing";
import { localizedAlternates } from "@/lib/seo";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "Legal.privacy" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: localizedAlternates(locale, "/privacy"),
  };
}

export default async function PrivacyPage({ params }: PageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const [t, legal] = await Promise.all([
    getTranslations("Legal.privacy"),
    getTranslations("Legal"),
  ]);

  const sections = ([1, 2, 3, 4, 5] as const).map((n) => ({
    title: t(`s${n}Title`),
    text: t(`s${n}Text`),
  }));

  return (
    <LegalDocument
      eyebrow={legal("eyebrow")}
      title={t("title")}
      intro={t("intro")}
      sections={sections}
    />
  );
}
