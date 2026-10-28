import { useTranslations } from "next-intl";
import { Section } from "@/components/shared/section";
import { ButtonLink } from "@/components/ui/link";

export function CtaBand() {
  const t = useTranslations("Home");

  return (
    <Section labelledBy="cta-title" className="pb-0">
      <div className="flex flex-col gap-8 bg-foreground p-8 text-background md:flex-row md:items-end md:justify-between md:p-16">
        <div className="flex max-w-2xl flex-col gap-5">
          <h2 id="cta-title" className="text-headline font-medium text-balance">
            {t("ctaTitle")}
          </h2>
          <p className="text-lg text-background/75">{t("ctaText")}</p>
        </div>
        <ButtonLink href="/contact" variant="accent" size="lg" className="shrink-0">
          {t("ctaButton")}
        </ButtonLink>
      </div>
    </Section>
  );
}
