import { useFormatter, useTranslations } from "next-intl";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectImage } from "@/components/projects/project-image";
import { ButtonLink } from "@/components/ui/link";
import { cn } from "@/lib/cn";
import { projects } from "@/data/projects";
import type { Service } from "@/types/content";

const steps = [1, 2, 3] as const;

type ServiceSectionProps = { service: Service; index: number };

export function ServiceSection({ service, index }: ServiceSectionProps) {
  const t = useTranslations("Services");
  const s = useTranslations("Services.items");
  const format = useFormatter();
  const { id } = service;
  const headingId = `service-${id}`;
  const related = service.relatedProjects.flatMap(
    (slug) => projects.find((p) => p.slug === slug) ?? [],
  );

  return (
    // scroll-mt keeps the heading clear of the sticky header when reached via /services#id.
    <section
      id={id}
      aria-labelledby={headingId}
      className="scroll-mt-24 border-t border-line py-16 md:py-24"
    >
      <div className="grid gap-10 md:grid-cols-12 md:gap-8">
        <div className={cn("md:col-span-5", index % 2 === 1 && "md:order-last")}>
          <div className="relative aspect-[4/5] overflow-hidden bg-surface">
            <ProjectImage
              image={service.image}
              alt={t("illustrationOf", { title: s(`${id}.title`) })}
              sizes="(min-width: 768px) 40vw, 100vw"
            />
          </div>
        </div>

        <div className="flex flex-col gap-10 md:col-span-7 md:px-6">
          <header className="flex flex-col gap-4">
            <p className="text-sm text-accent-ink">
              {format.number(index + 1, { minimumIntegerDigits: 2 })}
            </p>
            <h2 id={headingId} className="text-headline font-medium text-balance">
              {s(`${id}.title`)}
            </h2>
            <p className="max-w-2xl text-lg text-muted">{s(`${id}.description`)}</p>
          </header>

          <div>
            <h3 className="mb-4 text-sm font-medium uppercase tracking-[0.18em] text-muted">
              {t("process")}
            </h3>
            <ol className="grid gap-6 sm:grid-cols-3">
              {steps.map((step) => (
                <li key={step} className="border-t border-foreground/30 pt-3">
                  <p className="mb-1 font-medium">
                    {format.number(step)}. {s(`${id}.step${step}Title`)}
                  </p>
                  <p className="text-sm text-muted">{s(`${id}.step${step}Text`)}</p>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-medium uppercase tracking-[0.18em] text-muted">
              {t("relatedProjects")}
            </h3>
            <div className="grid max-w-xl grid-cols-2 gap-6">
              {related.map((project) => (
                <ProjectCard
                  key={project.slug}
                  project={project}
                  ratio="landscape"
                  sizes="(min-width: 768px) 20vw, 45vw"
                />
              ))}
            </div>
          </div>

          <div>
            <ButtonLink href="/contact" variant="outline">
              {t("cta")}
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
