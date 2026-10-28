"use client";

import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/cn";
import { localeNames } from "./locales";

export function LanguageSwitcher() {
  // useSearchParams opts out of static rendering, so it lives behind Suspense and the
  // fallback (same links, no query) keeps the switcher in the static HTML.
  return (
    <Suspense fallback={<LanguageLinks search="" />}>
      <LanguageLinksWithSearch />
    </Suspense>
  );
}

function LanguageLinksWithSearch() {
  return <LanguageLinks search={useSearchParams().toString()} />;
}

function LanguageLinks({ search }: { search: string }) {
  const t = useTranslations("LanguageSwitcher");
  const currentLocale = useLocale();
  const pathname = usePathname();
  // Stay on the equivalent page and keep active query params (e.g. project filters).
  const href = search ? `${pathname}?${search}` : pathname;

  return (
    <nav aria-label={t("label")}>
      <ul className="flex items-center gap-1">
        {routing.locales.map((locale) => {
          const isCurrent = locale === currentLocale;
          const className = cn(
            "inline-flex h-11 items-center px-3 text-sm",
            isCurrent ? "font-semibold text-foreground" : "text-muted hover:text-foreground",
          );

          return (
            <li key={locale}>
              {isCurrent ? (
                <span lang={locale} aria-current="true" className={className}>
                  {localeNames[locale]}
                </span>
              ) : (
                <Link
                  href={href}
                  locale={locale}
                  lang={locale}
                  hrefLang={locale}
                  className={className}
                >
                  {localeNames[locale]}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
