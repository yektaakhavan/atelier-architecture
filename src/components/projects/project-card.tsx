import { useFormatter, useLocale, useTranslations } from "next-intl";
import { Link } from "@/components/ui/link";
import { cn } from "@/lib/cn";
import type { Project } from "@/types/content";
import { ProjectImage } from "./project-image";

const ratios = {
  landscape: "aspect-[4/3]",
  portrait: "aspect-[3/4]",
  square: "aspect-square",
} as const;

type ProjectCardProps = {
  project: Project;
  ratio?: keyof typeof ratios;
  sizes?: string;
  className?: string;
  /** Follow the surrounding outline: h2 when the card list sits directly under the page's h1. */
  headingLevel?: 2 | 3;
  /** Above-the-fold cards load their image eagerly. */
  priority?: boolean;
};

export function ProjectCard({
  project,
  ratio = "landscape",
  sizes,
  className,
  headingLevel = 3,
  priority,
}: ProjectCardProps) {
  const t = useTranslations("Projects");
  const format = useFormatter();
  const locale = useLocale();
  const title = project.title[locale];
  const Heading = `h${headingLevel}` as const;

  return (
    <article className={cn("group min-w-0", className)}>
      <Link href={`/projects/${project.slug}`} className="block hover:no-underline">
        <div className={cn("relative overflow-hidden bg-surface", ratios[ratio])}>
          <ProjectImage
            image={project.image}
            alt={t("illustrationOf", { title })}
            sizes={sizes}
            priority={priority}
            className="transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transform-none"
          />
        </div>
        <div className="mt-4 flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
          <div>
            <Heading className="text-xl font-medium group-hover:underline underline-offset-4">
              {title}
            </Heading>
            <p className="text-sm text-muted">{project.location[locale]}</p>
          </div>
          <p className="text-sm text-muted">
            {t(`categories.${project.category}`)} ·{" "}
            {format.number(project.year, { useGrouping: false })}
          </p>
        </div>
      </Link>
    </article>
  );
}
