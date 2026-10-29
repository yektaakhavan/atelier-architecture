import { useFormatter, useLocale, useTranslations } from "next-intl";
import { estimateReadingMinutes } from "@/features/journal/lib/reading-time";
import type { Article } from "@/types/content";

export function ArticleMeta({ article }: { article: Article }) {
  const t = useTranslations("Journal");
  const format = useFormatter();
  const locale = useLocale();
  const minutes = estimateReadingMinutes(article.body[locale], locale);

  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
      <span className="text-accent-ink">{t(`categories.${article.category}`)}</span>
      <span aria-hidden>·</span>
      {/* UTC so a date-only value never shifts to the previous day in western time zones. */}
      <time dateTime={article.publishedAt}>
        {format.dateTime(new Date(article.publishedAt), { dateStyle: "medium", timeZone: "UTC" })}
      </time>
      <span aria-hidden>·</span>
      <span>{t("readingTime", { minutes })}</span>
    </p>
  );
}
