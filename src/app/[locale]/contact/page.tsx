import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ContactForm } from "@/components/forms/contact-form";
import { SectionHeading } from "@/components/shared/section-heading";
import { Container } from "@/components/ui/container";
import { contactInfo } from "@/config/site";
import { routing } from "@/i18n/routing";
import { localizedAlternates } from "@/lib/seo";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "Contact" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: localizedAlternates(locale, "/contact"),
  };
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const [t, footer] = await Promise.all([getTranslations("Contact"), getTranslations("Footer")]);

  return (
    <Container className="grid gap-16 py-12 md:grid-cols-12 md:gap-8 md:py-20">
      <div className="flex flex-col gap-10 md:col-span-5">
        <SectionHeading
          level={1}
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("intro")}
        />
        <div className="border border-line p-5">
          <p className="mb-1 text-sm font-medium">{t("demoTitle")}</p>
          <p className="text-sm text-muted">{t("demoNotice")}</p>
        </div>
        <div>
          <h2 className="mb-4 text-sm font-medium">{t("detailsTitle")}</h2>
          <address className="flex flex-col gap-2 text-muted not-italic">
            <span>{footer("address")}</span>
            <a href={`mailto:${contactInfo.email}`} className="hover:text-foreground">
              {contactInfo.email}
            </a>
            <span dir="ltr" className="text-start">
              {contactInfo.phone}
            </span>
          </address>
        </div>
      </div>
      <div className="md:col-span-7 md:ps-8">
        <ContactForm />
      </div>
    </Container>
  );
}
