import { useFormatter, useTranslations } from "next-intl";
import { Section } from "@/components/shared/section";
import { projects } from "@/data/projects";
import { routing } from "@/i18n/routing";
import { projectCategories } from "@/types/content";

export function StudioStats() {
  const t = useTranslations("Home");
  const format = useFormatter();
  const year = (value: number) => format.number(value, { useGrouping: false });

  const years = projects.map((project) => project.year);
  const usedTypes = new Set(projects.map((project) => project.category)).size;

  // Derived from the sample data so the numbers can never drift from what the site shows.
  const stats = [
    { label: t("statProjects"), value: format.number(projects.length) },
    {
      label: t("statTypes"),
      value: `${format.number(usedTypes)}/${format.number(projectCategories.length)}`,
    },
    { label: t("statYears"), value: `${year(Math.min(...years))}–${year(Math.max(...years))}` },
    { label: t("statLanguages"), value: format.number(routing.locales.length) },
  ];

  return (
    <Section labelledBy="stats-title" className="border-t border-line py-12 md:py-16">
      <h2 id="stats-title" className="sr-only">
        {t("statsEyebrow")}
      </h2>
      <dl className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4">
        {stats.map(({ label, value }) => (
          <div key={label} className="flex flex-col-reverse gap-2">
            <dt className="text-sm text-muted">{label}</dt>
            <dd className="text-headline font-medium">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-10 text-xs text-muted">{t("statsNote")}</p>
    </Section>
  );
}
