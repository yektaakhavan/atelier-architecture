import { getFormatter, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { Link } from "@/components/ui/link";
import { contactInfo, navItems } from "@/config/site";
import { LanguageSwitcher } from "@/features/localization/language-switcher";
import { Logo } from "./logo";

const socialNetworks = ["Instagram", "LinkedIn", "Behance"] as const;

export async function SiteFooter() {
  const [t, nav, format] = await Promise.all([
    getTranslations("Footer"),
    getTranslations("Nav"),
    getFormatter(),
  ]);
  const year = format.number(new Date().getFullYear(), { useGrouping: false });

  return (
    <footer className="mt-32 border-t border-line">
      <Container className="grid gap-12 py-16 md:grid-cols-12">
        <div className="flex flex-col gap-5 md:col-span-5">
          <Logo />
          <p className="max-w-sm text-sm text-muted">{t("blurb")}</p>
        </div>

        <nav aria-label={t("explore")} className="md:col-span-3">
          <h2 className="mb-4 text-sm font-medium">{t("explore")}</h2>
          <ul className="flex flex-col gap-2 text-sm text-muted">
            {navItems.map(({ key, href }) => (
              <li key={key}>
                <Link href={href} className="hover:text-foreground">
                  {nav(key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-6 md:col-span-4">
          <div>
            <h2 className="mb-4 text-sm font-medium">{t("contact")}</h2>
            <address className="flex flex-col gap-2 text-sm not-italic text-muted">
              <span>{t("address")}</span>
              <a href={`mailto:${contactInfo.email}`} className="hover:text-foreground">
                {contactInfo.email}
              </a>
              <span dir="ltr" className="self-start">
                {contactInfo.phone}
              </span>
            </address>
          </div>
          <div>
            <h2 className="mb-3 text-sm font-medium">{t("social")}</h2>
            <p lang="en" className="text-sm text-muted">
              {socialNetworks.join(" · ")}
            </p>
          </div>
        </div>
      </Container>

      <div className="border-t border-line">
        <Container className="flex flex-wrap items-center justify-between gap-4 py-5 text-sm text-muted">
          <p>{t("rights", { year })}</p>
          <LanguageSwitcher />
        </Container>
      </div>
    </footer>
  );
}
