import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { getDirection } from "@/features/localization/locales";
import { routing } from "@/i18n/routing";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { fontVariables } from "@/lib/fonts";
import { siteUrl } from "@/lib/seo";
import { themeInitScript } from "@/lib/theme";
import "../globals.css";

// Client components only receive the namespaces they use; the rest stays on the server.
const CLIENT_NAMESPACES = ["Theme", "LanguageSwitcher", "Nav", "Contact", "Projects"] as const;

type LayoutProps = { children: React.ReactNode; params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Pick<LayoutProps, "params">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    metadataBase: siteUrl,
    title: { default: t("title"), template: `%s — ATELIER` },
    description: t("description"),
    openGraph: {
      siteName: "ATELIER",
      locale: locale === "fa" ? "fa_IR" : "en_US",
      type: "website",
    },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const [messages, nav] = await Promise.all([getMessages(), getTranslations("Nav")]);
  const clientMessages = Object.fromEntries(CLIENT_NAMESPACES.map((ns) => [ns, messages[ns]]));

  return (
    // suppressHydrationWarning: the init script sets data-theme before React hydrates.
    <html
      lang={locale}
      dir={getDirection(locale)}
      className={fontVariables}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <NextIntlClientProvider messages={clientMessages}>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-50 focus:bg-foreground focus:px-4 focus:py-3 focus:text-background"
          >
            {nav("skipToContent")}
          </a>
          <SiteHeader />
          <main id="main-content" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <SiteFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
