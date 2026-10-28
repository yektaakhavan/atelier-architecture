import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "fa"],
  defaultLocale: "en",
  localePrefix: "always",
  // The URL is the single source of truth: "/" always lands on English, whatever the
  // browser's Accept-Language says (the brief makes English the default for everyone).
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
