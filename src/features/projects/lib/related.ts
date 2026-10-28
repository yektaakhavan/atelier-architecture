import type { Project, ProjectDetails } from "@/types/content";

/** Same category counts most, shared services add to the score; ties go to the newer project. */
export function getRelatedProjects(
  project: Project,
  all: readonly Project[],
  details: Record<string, ProjectDetails | undefined>,
  limit = 3,
): Project[] {
  const services = new Set(details[project.slug]?.services ?? []);

  const score = (candidate: Project) => {
    const shared = (details[candidate.slug]?.services ?? []).filter((id) =>
      services.has(id),
    ).length;
    return (candidate.category === project.category ? 2 : 0) + shared;
  };

  return all
    .filter((candidate) => candidate.slug !== project.slug)
    .map((candidate) => ({ candidate, score: score(candidate) }))
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.candidate.year - a.candidate.year ||
        a.candidate.slug.localeCompare(b.candidate.slug),
    )
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}
