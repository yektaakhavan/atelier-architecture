import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/link";

export default async function NotFound() {
  const t = await getTranslations("NotFound");

  return (
    <Container className="flex min-h-[60vh] flex-col justify-center gap-8 py-24">
      <p aria-hidden className="text-display font-medium text-olive" lang="en">
        404
      </p>
      <div className="flex max-w-xl flex-col gap-4">
        <h1 className="text-headline font-medium text-balance">{t("title")}</h1>
        <p className="text-lg text-muted">{t("description")}</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <ButtonLink href="/">{t("home")}</ButtonLink>
        <ButtonLink href="/services" variant="outline">
          {t("services")}
        </ButtonLink>
        <ButtonLink href="/contact" variant="outline">
          {t("contact")}
        </ButtonLink>
      </div>
    </Container>
  );
}
