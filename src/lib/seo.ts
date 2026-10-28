import { routing, type Locale } from "@/i18n/routing";

/** Canonical and hreflang alternates for a locale-independent path such as "/projects". */
export function localizedAlternates(locale: Locale, path = "") {
  const suffix = path === "/" ? "" : path;

  return {
    canonical: `/${locale}${suffix}`,
    languages: {
      ...Object.fromEntries(routing.locales.map((l) => [l, `/${l}${suffix}`])),
      "x-default": `/${routing.defaultLocale}${suffix}`,
    },
  };
}

export const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000");
