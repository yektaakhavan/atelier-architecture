import type { Locale } from "@/i18n/routing";
import { siteUrl } from "./seo";

const absolute = (path: string) => new URL(path, siteUrl).toString();

/** BreadcrumbList for a page's trail; `path` is the locale-prefixed URL path of each step. */
export function breadcrumbList(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absolute(item.path),
    })),
  };
}

export function article(input: {
  headline: string;
  description: string;
  datePublished: string;
  author: string;
  locale: Locale;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.headline,
    description: input.description,
    datePublished: input.datePublished,
    inLanguage: input.locale,
    mainEntityOfPage: absolute(input.path),
    author: { "@type": "Person", name: input.author },
  };
}

/** JSON for a <script type="application/ld+json">; "<" is escaped so content can never close the tag. */
export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
