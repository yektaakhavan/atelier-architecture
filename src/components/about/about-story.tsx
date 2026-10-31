import { useFormatter, useTranslations } from "next-intl";
import { ArtImage } from "@/components/shared/art-image";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";

const principles = [1, 2, 3] as const;

export function AboutStory() {
  const t = useTranslations("About");

  return (
    <Section labelledBy="story-title" className="pt-0 md:pt-0">
      <div className="grid gap-10 md:grid-cols-12 md:gap-8">
        <div className="flex flex-col gap-6 md:col-span-6">
          <SectionHeading id="story-title" title={t("storyTitle")} />
          <div className="flex max-w-xl flex-col gap-5 text-lg text-muted">
            <p>{t("storyText1")}</p>
            <p>{t("storyText2")}</p>
          </div>
        </div>
        <figure className="md:col-span-6">
          <div className="relative aspect-[4/3] overflow-hidden bg-surface">
            <ArtImage
              variant="section"
              tone="stone"
              alt={t("storyArt")}
              className="absolute inset-0 h-full w-full"
            />
          </div>
        </figure>
      </div>
    </Section>
  );
}

export function AboutPhilosophy() {
  const t = useTranslations("About");
  const format = useFormatter();

  return (
    <Section labelledBy="philosophy-title" className="border-t border-line">
      <div className="grid gap-12 md:grid-cols-12 md:gap-8">
        <div className="flex flex-col gap-6 md:col-span-5">
          <SectionHeading id="philosophy-title" title={t("philosophyTitle")} />
          <p className="max-w-md text-lg text-muted">{t("philosophyText")}</p>
        </div>
        <ol className="flex flex-col md:col-span-7">
          {principles.map((n) => (
            <li
              key={n}
              className="grid gap-2 border-t border-line py-6 last:border-b sm:grid-cols-[4rem_1fr]"
            >
              <span className="text-sm text-accent-ink">
                {format.number(n, { minimumIntegerDigits: 2 })}
              </span>
              <div>
                <h3 className="mb-1 text-xl font-medium">{t(`principle${n}Title`)}</h3>
                <p className="text-muted">{t(`principle${n}Text`)}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
