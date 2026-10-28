import type { Service } from "@/types/content";

// Titles and copy live in messages/*.json under Services.items.<id>.
export const services: readonly Service[] = [
  {
    id: "residential",
    image: { art: "volumes", tone: "olive" },
    relatedProjects: ["casa-olivo", "courtyard-house-isfahan"],
  },
  {
    id: "villa",
    image: { art: "stairs", tone: "stone" },
    relatedProjects: ["douro-terrace-hotel", "casa-olivo"],
  },
  {
    id: "interior",
    image: { art: "plan", tone: "brick" },
    relatedProjects: ["oak-and-lime-apartment"],
  },
  {
    id: "commercial",
    image: { art: "facade", tone: "night" },
    relatedProjects: ["north-light-studios", "canopy-offices"],
  },
  {
    id: "renovation",
    image: { art: "arches", tone: "brick" },
    relatedProjects: ["brick-mill-renewal"],
  },
  {
    id: "sustainable",
    image: { art: "section", tone: "olive" },
    relatedProjects: ["canopy-offices", "courtyard-house-isfahan"],
  },
  {
    id: "concept",
    image: { art: "section", tone: "stone" },
    relatedProjects: ["salt-pavilion"],
  },
];
