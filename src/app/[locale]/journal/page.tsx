import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArticleCard } from "@/components/journal/article-card";
import { ArticleGrid } from "@/components/journal/article-grid";
import { JournalBrowser } from "@/components/journal/journal-browser";
import { SectionHeading } from "@/components/shared/section-heading";
import { Container } from "@/components/ui/container";
import { articles, featuredArticles } from "@/data/articles";
import { sortArticles } from "@/features/journal/lib/filters";
import { routing } from "@/i18n/routing";
import { localizedAlternates } from "@/lib/seo";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "Journal" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: localizedAlternates(locale, "/journal"),
  };
}

export default async function JournalPage({ params }: PageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("Journal");

  return (
    <Container className="flex flex-col gap-20 py-12 md:py-20">
      <SectionHeading
        level={1}
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("intro")}
      />

      <section aria-labelledby="featured-articles">
        <h2
          id="featured-articles"
          className="mb-8 text-sm font-medium uppercase tracking-[0.18em] text-muted"
        >
          {t("featuredTitle")}
        </h2>
        <div className="grid gap-x-8 gap-y-12 md:grid-cols-2">
          {featuredArticles.map((article) => (
            <ArticleCard
              key={article.slug}
              article={article}
              sizes="(min-width: 768px) 48vw, 100vw"
            />
          ))}
        </div>
      </section>

      <section aria-labelledby="all-articles" className="flex flex-col gap-8">
        <h2 id="all-articles" className="text-headline font-medium">
          {t("allTitle")}
        </h2>
        {/* The fallback is the full list, so the static HTML is complete without JavaScript. */}
        <Suspense fallback={<ArticleGrid articles={sortArticles(articles)} />}>
          <JournalBrowser />
        </Suspense>
      </section>
    </Container>
  );
}
