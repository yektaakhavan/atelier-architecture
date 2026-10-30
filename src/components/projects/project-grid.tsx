import type { Project } from "@/types/content";
import { ProjectCard } from "./project-card";

// Repeating five-card rhythm (7+5, then 4+4+4) so the archive reads like an editorial spread.
const pattern = [
  { span: "md:col-span-7", ratio: "landscape", sizes: "(min-width: 768px) 58vw, 100vw" },
  { span: "md:col-span-5", ratio: "portrait", sizes: "(min-width: 768px) 40vw, 100vw" },
  { span: "md:col-span-4", ratio: "portrait", sizes: "(min-width: 768px) 32vw, 100vw" },
  { span: "md:col-span-4", ratio: "portrait", sizes: "(min-width: 768px) 32vw, 100vw" },
  { span: "md:col-span-4", ratio: "portrait", sizes: "(min-width: 768px) 32vw, 100vw" },
] as const;

export function ProjectGrid({
  projects,
  headingLevel,
}: {
  projects: readonly Project[];
  headingLevel?: 2 | 3;
}) {
  return (
    <div className="grid items-start gap-x-8 gap-y-16 md:grid-cols-12">
      {projects.map((project, index) => {
        const slot = pattern[index % pattern.length]!;
        return (
          <ProjectCard
            key={project.slug}
            project={project}
            ratio={slot.ratio}
            sizes={slot.sizes}
            className={slot.span}
            headingLevel={headingLevel}
          />
        );
      })}
    </div>
  );
}
