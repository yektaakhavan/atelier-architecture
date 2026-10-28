import { useTranslations } from "next-intl";
import { ArchitecturalArt } from "@/components/shared/architectural-art";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/link";

export function Hero() {
  const t = useTranslations("Home");

  return (
    <section aria-labelledby="hero-title" className="pt-10 pb-16 md:pt-16 md:pb-28">
      <Container className="grid gap-12 md:grid-cols-12 md:gap-8">
        <div className="flex flex-col justify-between gap-12 md:col-span-7">
          <p className="animate-rise flex items-center gap-3 text-sm font-medium uppercase tracking-[0.18em] text-accent-ink">
            <span aria-hidden className="h-px w-10 bg-current" />
            {t("heroEyebrow")}
          </p>
          <h1
            id="hero-title"
            className="animate-rise text-[clamp(2.4rem,6.2vw,6rem)] font-medium leading-[1.02] tracking-tight text-balance [animation-delay:120ms] rtl:leading-[1.3]"
          >
            {t.rich("heroTitle", {
              em: (chunks) => (
                <em className="font-serif font-normal text-accent-ink rtl:not-italic">{chunks}</em>
              ),
            })}
          </h1>
          <div className="animate-rise flex max-w-xl flex-col gap-8 [animation-delay:240ms]">
            <p className="text-lg text-muted">{t("heroText")}</p>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/projects" size="lg">
                {t("ctaProjects")}
              </ButtonLink>
              <ButtonLink href="/about" size="lg" variant="outline">
                {t("ctaAbout")}
              </ButtonLink>
            </div>
          </div>
        </div>

        <figure className="animate-rise md:col-span-5 [animation-delay:180ms]">
          <div className="relative aspect-[4/5] overflow-hidden bg-surface">
            <ArchitecturalArt
              variant="volumes"
              tone="olive"
              className="absolute inset-0 h-full w-full"
            />
          </div>
          <figcaption className="mt-3 text-xs text-muted">{t("heroCaption")}</figcaption>
        </figure>
      </Container>
    </section>
  );
}
