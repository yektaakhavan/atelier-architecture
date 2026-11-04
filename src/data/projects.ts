import type { Project } from "@/types/content";

// Sample content for a fictional studio. Real photography goes in `image.src`.
export const projects: readonly Project[] = [
  {
    slug: "casa-olivo",
    country: "PT",
    category: "residential",
    year: 2024,
    featured: true,
    title: { en: "Casa Olivo", fa: "خانه زیتون" },
    location: { en: "Lisbon, Portugal", fa: "لیسبون، پرتغال" },
    summary: {
      en: "A family house of stacked limewashed volumes around an old olive tree.",
      fa: "خانه‌ای خانوادگی از حجم‌های آهک‌اندود روی هم، در اطراف یک درخت زیتون کهن.",
    },
    image: { art: "volumes", tone: "olive", src: "/images/projects/CasaOlivo-3.jpg" },
  },
  {
    slug: "courtyard-house-isfahan",
    country: "IR",
    category: "residential",
    year: 2023,
    featured: true,
    title: { en: "Courtyard House", fa: "خانه حیاط‌دار" },
    location: { en: "Isfahan, Iran", fa: "اصفهان، ایران" },
    summary: {
      en: "A contemporary reading of the courtyard typology, cooled by shade and water.",
      fa: "بازخوانی معاصر الگوی خانه حیاط‌دار، خنک‌شده با سایه و آب.",
    },
    image: { art: "arches", tone: "brick", src: "/images/projects/CourtyardHouse-1.jpg"  },
  },
  {
    slug: "north-light-studios",
    country: "DK",
    category: "commercial",
    year: 2024,
    featured: true,
    title: { en: "North Light Studios", fa: "استودیوهای نور شمالی" },
    location: { en: "Copenhagen, Denmark", fa: "کپنهاگ، دانمارک" },
    summary: {
      en: "Shared workshops under a sawtooth roof that brings even northern daylight inside.",
      fa: "کارگاه‌های مشترک زیر سقفی دندانه‌اره‌ای که نور یکنواخت شمالی را به داخل می‌آورد.",
    },
    image: { art: "facade", tone: "stone", src: "/images/projects/NorthLightStudios-1.jpg"  },
  },
  {
    slug: "salt-pavilion",
    country: "GE",
    category: "cultural",
    year: 2022,
    featured: true,
    title: { en: "Salt Pavilion", fa: "کوشک نمک" },
    location: { en: "Tbilisi, Georgia", fa: "تفلیس، گرجستان" },
    summary: {
      en: "A small exhibition pavilion in pale concrete, lit from a single roof aperture.",
      fa: "کوشک نمایشگاهی کوچک از بتن روشن که از یک روزنه‌ی سقفی نور می‌گیرد.",
    },
    image: { art: "section", tone: "night", src: "/images/projects/SaltPavilion-3.jpg"  },
  },
  {
    slug: "oak-and-lime-apartment",
    country: "TR",
    category: "interior",
    year: 2025,
    featured: false,
    title: { en: "Oak & Lime Apartment", fa: "آپارتمان بلوط و آهک" },
    location: { en: "Istanbul, Türkiye", fa: "استانبول، ترکیه" },
    summary: {
      en: "A flat reorganised around one long timber wall that hides storage and doors.",
      fa: "آپارتمانی که حول یک دیوار چوبی بلند بازسازماندهی شده و فضای ذخیره و درها را پنهان می‌کند.",
    },
    image: { art: "plan", tone: "stone", src: "/images/projects/Oak&LimeApartment-4.jpg"  },
  },
  {
    slug: "douro-terrace-hotel",
    country: "PT",
    category: "hospitality",
    year: 2023,
    featured: false,
    title: { en: "Douro Terrace Hotel", fa: "هتل تراس دورو" },
    location: { en: "Porto, Portugal", fa: "پورتو، پرتغال" },
    summary: {
      en: "Twenty-four rooms stepping down a vineyard slope, each with its own terrace.",
      fa: "بیست‌وچهار اتاق که از شیب تاکستان پایین می‌آیند، هرکدام با تراس اختصاصی.",
    },
    image: { art: "stairs", tone: "olive", src: "/images/projects/DouroTerraceHotel-1.jpg"  },
  },
  {
    slug: "brick-mill-renewal",
    country: "IR",
    category: "renovation",
    year: 2022,
    featured: false,
    title: { en: "Brick Mill Renewal", fa: "بازسازی کارخانه آجری" },
    location: { en: "Tabriz, Iran", fa: "تبریز، ایران" },
    summary: {
      en: "A disused brick mill repaired and reopened as workshops and a small market hall.",
      fa: "کارخانه‌ای آجری و متروک که مرمت شده و به‌عنوان کارگاه و بازارچه‌ای کوچک بازگشایی شده است.",
    },
    image: { art: "facade", tone: "brick", src: "/images/projects/BrickMillRenewal-1.jpg"  },
  },
  {
    slug: "canopy-offices",
    country: "IR",
    category: "commercial",
    year: 2025,
    featured: false,
    title: { en: "Canopy Offices", fa: "دفاتر کانوپی" },
    location: { en: "Shiraz, Iran", fa: "شیراز، ایران" },
    summary: {
      en: "A low-energy office block shaded by a deep timber canopy and planted terraces.",
      fa: "ساختمان اداری کم‌مصرف که زیر یک سایه‌بان چوبی عمیق و تراس‌های کاشته‌شده قرار دارد.",
    },
    image: { art: "volumes", tone: "stone", src: "/images/projects/CanopyOffices-2.jpg"  },
  },
];

export const featuredProjects = projects.filter((project) => project.featured);
export const archiveProjects = projects.filter((project) => !project.featured);
