import type { Article } from "@/types/content";
import { ArticleCard } from "./article-card";

// Repeating rhythm: one wide card, then three narrower ones (8+4, then 4+4+4).
const pattern = [
  { span: "md:col-span-8", ratio: "landscape", sizes: "(min-width: 768px) 64vw, 100vw" },
  { span: "md:col-span-4", ratio: "portrait", sizes: "(min-width: 768px) 32vw, 100vw" },
  { span: "md:col-span-4", ratio: "square", sizes: "(min-width: 768px) 32vw, 100vw" },
  { span: "md:col-span-4", ratio: "square", sizes: "(min-width: 768px) 32vw, 100vw" },
  { span: "md:col-span-4", ratio: "square", sizes: "(min-width: 768px) 32vw, 100vw" },
] as const;

export function ArticleGrid({ articles }: { articles: readonly Article[] }) {
  return (
    <div className="grid items-start gap-x-8 gap-y-14 md:grid-cols-12">
      {articles.map((article, index) => {
        const slot = pattern[index % pattern.length]!;
        return (
          <ArticleCard
            key={article.slug}
            article={article}
            ratio={slot.ratio}
            sizes={slot.sizes}
            className={slot.span}
          />
        );
      })}
    </div>
  );
}
