import { useTranslations } from "next-intl";
import { ArticleCard } from "@/components/journal/article-card";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { ButtonLink } from "@/components/ui/link";
import { articles } from "@/data/articles";
import { sortArticles } from "@/features/journal/lib/filters";

export function JournalPreview() {
  const t = useTranslations("Home");

  return (
    <Section labelledBy="journal-title" className="border-t border-line">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading
          id="journal-title"
          eyebrow={t("journalEyebrow")}
          title={t("journalTitle")}
        />
        <ButtonLink href="/journal" variant="outline">
          {t("journalViewAll")}
        </ButtonLink>
      </div>
      <div className="mt-12 grid gap-x-8 gap-y-12 md:grid-cols-3">
        {sortArticles(articles)
          .slice(0, 3)
          .map((article) => (
            <ArticleCard
              key={article.slug}
              article={article}
              sizes="(min-width: 768px) 30vw, 100vw"
            />
          ))}
      </div>
    </Section>
  );
}
