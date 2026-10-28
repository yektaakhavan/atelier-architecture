import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { LanguageSwitcher } from "@/features/localization/language-switcher";
import { ThemeToggle } from "@/features/theme/theme-toggle";
import { routing } from "@/i18n/routing";
import { localizedAlternates } from "@/lib/seo";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  return { alternates: localizedAlternates(locale, "/") };
}

// Temporary design-system preview; replaced by the real home page in stage 5.
export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("Home");

  return (
    <Container as="main" className="flex min-h-screen flex-col justify-center gap-10 py-16">
      <div className="flex items-start justify-between gap-6">
        <SectionHeading
          level={1}
          eyebrow={t("previewEyebrow")}
          title={t("previewTitle")}
          description={t("previewDescription")}
        />
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
      <p className="text-display font-medium">
        {t("taglineLead")}{" "}
        <em className="font-serif font-normal text-accent-ink rtl:not-italic">
          {t("taglineAccent")}
        </em>
      </p>
      <div className="flex flex-wrap gap-3">
        <Button>Primary</Button>
        <Button variant="accent">Accent</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
      </div>
    </Container>
  );
}
