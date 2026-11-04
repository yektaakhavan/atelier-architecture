import type { Service } from "@/types/content";

// Titles and copy live in messages/*.json under Services.items.<id>.
export const services: readonly Service[] = [
  {
    id: "residential",
    image: { art: "volumes", tone: "olive", src: "/images/services/residentialArchitecture.jpg" },
    relatedProjects: ["casa-olivo", "courtyard-house-isfahan"],
  },
  {
    id: "villa",
    image: { art: "stairs", tone: "stone", src: "/images/services/villaDesign.jpg" },
    relatedProjects: ["douro-terrace-hotel", "casa-olivo"],
  },
  {
    id: "interior",
    image: { art: "plan", tone: "brick", src: "/images/services/interiorDesign.jpg" },
    relatedProjects: ["oak-and-lime-apartment"],
  },
  {
    id: "commercial",
    image: { art: "facade", tone: "night", src: "/images/services/commercialSpaces.jpg" },
    relatedProjects: ["north-light-studios", "canopy-offices"],
  },
  {
    id: "renovation",
    image: { art: "arches", tone: "brick", src: "/images/services/renovation.jpg" },
    relatedProjects: ["brick-mill-renewal"],
  },
  {
    id: "sustainable",
    image: { art: "section", tone: "olive", src: "/images/services/sustainableDesign.jpg" },
    relatedProjects: ["canopy-offices", "courtyard-house-isfahan"],
  },
  {
    id: "concept",
    image: { art: "section", tone: "stone", src: "/images/services/conceptDesign.jpg" },
    relatedProjects: ["salt-pavilion"],
  },
];
