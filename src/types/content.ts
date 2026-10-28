import type { Locale } from "@/i18n/routing";

export type Localized<T = string> = Record<Locale, T>;

export const projectCategories = [
  "residential",
  "commercial",
  "interior",
  "hospitality",
  "cultural",
  "renovation",
] as const;
export type ProjectCategory = (typeof projectCategories)[number];

export const artVariants = ["volumes", "facade", "section", "arches", "stairs", "plan"] as const;
export type ArtVariant = (typeof artVariants)[number];

export const artTones = ["olive", "brick", "stone", "night"] as const;
export type ArtTone = (typeof artTones)[number];

/** Placeholder artwork until real photography is added: set `src` and the artwork is ignored. */
export type ProjectImageData = { art: ArtVariant; tone: ArtTone; src?: string };

export type Project = {
  slug: string;
  category: ProjectCategory;
  year: number;
  featured: boolean;
  title: Localized;
  location: Localized;
  summary: Localized;
  image: ProjectImageData;
};

export const serviceIds = [
  "residential",
  "villa",
  "interior",
  "commercial",
  "renovation",
  "sustainable",
  "concept",
] as const;
export type ServiceId = (typeof serviceIds)[number];

export type Service = {
  id: ServiceId;
  image: ProjectImageData;
  relatedProjects: readonly string[];
};
