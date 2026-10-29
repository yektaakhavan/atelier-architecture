import { useLocale, useTranslations } from "next-intl";
import { ProjectImage } from "@/components/projects/project-image";
import { Link } from "@/components/ui/link";
import { cn } from "@/lib/cn";
import type { Article } from "@/types/content";
import { ArticleMeta } from "./article-meta";

const ratios = {
  landscape: "aspect-[4/3]",
  portrait: "aspect-[3/4]",
  square: "aspect-square",
} as const;

type ArticleCardProps = {
  article: Article;
  ratio?: keyof typeof ratios;
  sizes?: string;
  className?: string;
};

export function ArticleCard({ article, ratio = "landscape", sizes, className }: ArticleCardProps) {
  const t = useTranslations("Journal");
  const locale = useLocale();
  const title = article.title[locale];

  return (
    <article className={cn("group", className)}>
      <Link href={`/journal/${article.slug}`} className="block hover:no-underline">
        <div className={cn("relative overflow-hidden bg-surface", ratios[ratio])}>
          <ProjectImage
            image={article.image}
            alt={t("coverAlt", { title })}
            sizes={sizes}
            className="transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transform-none"
          />
        </div>
        <div className="mt-4 flex flex-col gap-2">
          <ArticleMeta article={article} />
          <h3 className="text-xl font-medium text-balance underline-offset-4 group-hover:underline">
            {title}
          </h3>
          <p className="text-muted">{article.excerpt[locale]}</p>
        </div>
      </Link>
    </article>
  );
}
