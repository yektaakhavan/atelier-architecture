import { ArrowUpRight } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { Link } from "@/components/ui/link";
import { services } from "@/data/services";

export function ExpertiseList() {
  const t = useTranslations("Home");
  const s = useTranslations("Services.items");
  const format = useFormatter();

  return (
    <Section labelledBy="expertise-title" className="border-t border-line">
      <SectionHeading
        id="expertise-title"
        eyebrow={t("expertiseEyebrow")}
        title={t("expertiseTitle")}
      />
      <ol className="mt-12 border-t border-line">
        {services.map((service, index) => (
          <li key={service.id} className="border-b border-line">
            <Link
              href={`/services#${service.id}`}
              className="group grid items-baseline gap-3 py-7 hover:no-underline md:grid-cols-12 md:gap-6"
            >
              <span className="text-sm text-muted md:col-span-1">
                {format.number(index + 1, { minimumIntegerDigits: 2 })}
              </span>
              <h3 className="text-2xl font-medium transition-transform duration-300 group-hover:translate-x-2 motion-reduce:transform-none rtl:group-hover:-translate-x-2 md:col-span-4">
                {s(`${service.id}.title`)}
              </h3>
              <p className="text-muted md:col-span-6">{s(`${service.id}.summary`)}</p>
              <ArrowUpRight
                aria-hidden
                className="hidden size-5 justify-self-end text-muted transition-colors group-hover:text-foreground md:block md:col-span-1 rtl:-scale-x-100"
              />
            </Link>
          </li>
        ))}
      </ol>
    </Section>
  );
}
