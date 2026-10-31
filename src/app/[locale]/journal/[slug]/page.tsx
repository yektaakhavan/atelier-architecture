import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ArticleBody } from "@/components/journal/article-body";
import { ArticleCard } from "@/components/journal/article-card";
import { ArticleMeta } from "@/components/journal/article-meta";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectImage } from "@/components/projects/project-image";
import { JsonLd } from "@/components/shared/json-ld";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/link";
import { articles } from "@/data/articles";
import { projects } from "@/data/projects";
import { getRelatedArticles } from "@/features/journal/lib/filters";
import { routing } from "@/i18n/routing";
import { localizedAlternates } from "@/lib/seo";
import { article as articleJsonLd, breadcrumbList } from "@/lib/structured-data";

type PageProps = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => articles.map(({ slug }) => ({ locale, slug })));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!hasLocale(routing.locales, locale) || !article) return {};

  return {
    title: article.title[locale],
    description: article.excerpt[locale],
    alternates: localizedAlternates(locale, `/journal/${slug}`),
    openGraph: {
      type: "article",
      title: article.title[locale],
      description: article.excerpt[locale],
      publishedTime: article.publishedAt,
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const article = articles.find((a) => a.slug === slug);
  if (!article) notFound();
  setRequestLocale(locale);

  const [t, nav, about] = await Promise.all([
    getTranslations("Journal"),
    getTranslations("Nav"),
    getTranslations("About"),
  ]);
  const title = article.title[locale];
  const project = projects.find((p) => p.slug === article.relatedProject);
  const related = getRelatedArticles(article, articles);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbList([
            { name: nav("home"), path: `/${locale}` },
            { name: nav("journal"), path: `/${locale}/journal` },
            { name: title, path: `/${locale}/journal/${slug}` },
          ]),
          articleJsonLd({
            headline: title,
            description: article.excerpt[locale],
            datePublished: article.publishedAt,
            author: about(`member${article.author}Name`),
            locale,
            path: `/${locale}/journal/${slug}`,
          }),
        ]}
      />
      <Container className="py-8">
        <Breadcrumb
          label={nav("breadcrumb")}
          items={[
            { label: nav("home"), href: "/" },
            { label: nav("journal"), href: "/journal" },
            { label: title },
          ]}
        />
      </Container>

      <article>
        <Container size="narrow" className="flex flex-col gap-6 pb-12">
          <ArticleMeta article={article} />
          <h1 className="text-[clamp(2.2rem,5vw,4rem)] font-medium leading-[1.05] tracking-tight text-balance rtl:leading-[1.3]">
            {title}
          </h1>
          <p className="text-xl text-muted">{article.excerpt[locale]}</p>
          <p className="text-sm text-muted">
            {t("byAuthor", { name: about(`member${article.author}Name`) })}
          </p>
        </Container>

        <Container>
          <div className="relative aspect-[16/9] overflow-hidden bg-surface">
            <ProjectImage
              image={article.image}
              alt={t("coverAlt", { title })}
              priority
              sizes="100vw"
            />
          </div>
        </Container>

        <Container size="narrow" className="py-16">
          <ArticleBody blocks={article.body[locale]} />
          <p className="mt-16 border-t border-line pt-6 text-sm text-muted">{t("fictionalNote")}</p>
        </Container>
      </article>

      {project ? (
        <Container size="narrow" className="pb-16">
          <h2 className="mb-6 text-sm font-medium uppercase tracking-[0.18em] text-muted">
            {t("relatedProject")}
          </h2>
          <ProjectCard
            project={project}
            ratio="landscape"
            sizes="(min-width: 768px) 48rem, 100vw"
          />
        </Container>
      ) : null}

      <Container className="border-t border-line py-16">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="text-headline font-medium">{t("relatedArticles")}</h2>
          <ButtonLink href="/journal" variant="outline">
            <ArrowLeft aria-hidden className="size-4 rtl:-scale-x-100" />
            {t("backToJournal")}
          </ButtonLink>
        </div>
        <div className="mt-12 grid gap-x-8 gap-y-12 md:grid-cols-3">
          {related.map((item) => (
            <ArticleCard key={item.slug} article={item} sizes="(min-width: 768px) 30vw, 100vw" />
          ))}
        </div>
      </Container>
    </>
  );
}
