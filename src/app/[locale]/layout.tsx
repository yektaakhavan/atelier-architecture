import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { getDirection } from "@/features/localization/locales";
import { routing } from "@/i18n/routing";
import { fontVariables } from "@/lib/fonts";
import { siteUrl } from "@/lib/seo";
import { themeInitScript } from "@/lib/theme";
import "../globals.css";

// Client components only receive the namespaces they use; the rest stays on the server.
const CLIENT_NAMESPACES = ["Theme", "LanguageSwitcher"] as const;

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

  const messages = await getMessages();
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
        <NextIntlClientProvider messages={clientMessages}>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
