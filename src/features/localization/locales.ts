import type { Locale } from "@/i18n/routing";

export const localeDirection = { en: "ltr", fa: "rtl" } as const satisfies Record<
  Locale,
  "ltr" | "rtl"
>;

/** Each language is named in its own script so people can find theirs. */
export const localeNames = { en: "English", fa: "فارسی" } as const satisfies Record<Locale, string>;

export function getDirection(locale: Locale) {
  return localeDirection[locale];
}
