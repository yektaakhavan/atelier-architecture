import { useFormatter, useTranslations } from "next-intl";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";

const values = ["Light", "Material", "Longevity"] as const;

export function StudioIntro() {
  const t = useTranslations("Home");
  const format = useFormatter();

  return (
    <Section labelledBy="studio-title" className="border-t border-line">
      <div className="grid gap-12 md:grid-cols-12 md:gap-8">
        <SectionHeading
          id="studio-title"
          eyebrow={t("studioEyebrow")}
          title={t("studioTitle")}
          className="md:col-span-5"
        />
        <div className="flex flex-col gap-12 md:col-span-7">
          <div className="flex max-w-2xl flex-col gap-5 text-lg text-muted">
            <p>{t("studioText1")}</p>
            <p>{t("studioText2")}</p>
          </div>
          <ol className="grid gap-8 sm:grid-cols-3">
            {values.map((value, index) => (
              <li key={value} className="border-t border-foreground/30 pt-4">
                <p className="mb-3 text-sm text-accent-ink">
                  {format.number(index + 1, { minimumIntegerDigits: 2 })}
                </p>
                <h3 className="mb-2 text-lg font-medium">{t(`value${value}Title`)}</h3>
                <p className="text-sm text-muted">{t(`value${value}Text`)}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}
