import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getSitePaths } from "@/lib/site-paths";
import { siteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const absolute = (locale: string, path: string) =>
    new URL(`/${locale}${path}`, siteUrl).toString();

  return getSitePaths().flatMap(({ path, lastModified }) =>
    routing.locales.map((locale) => ({
      url: absolute(locale, path),
      ...(lastModified ? { lastModified } : {}),
      alternates: {
        languages: Object.fromEntries(routing.locales.map((l) => [l, absolute(l, path)])),
      },
    })),
  );
}
