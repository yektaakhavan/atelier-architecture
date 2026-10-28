import type en from "@/messages/en.json";
import type { routing } from "@/i18n/routing";

// Typed locales and message keys: a missing or misspelled key becomes a compile error.
declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof en;
  }
}
