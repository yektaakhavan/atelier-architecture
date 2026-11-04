import type { ArtTone, ArtVariant, ProjectDetails, ProjectImageData } from "@/types/content";

const gallery = (tone: ArtTone, ...arts: ArtVariant[]): ProjectImageData[] =>
  arts.map((art) => ({ art, tone }));

// Sample content for a fictional studio, keyed by project slug.
export const projectDetails: Record<string, ProjectDetails> = {
  "casa-olivo": {
    area: 420,
    services: ["residential", "sustainable"],
    team: [1, 3],
    concept: {
      en: "Four limewashed volumes are stacked and offset so that every room opens toward the olive tree at the centre of the plot.",
      fa: "چهار حجم آهک‌اندود روی هم و جابه‌جا چیده شده‌اند تا هر اتاق به درخت زیتونِ مرکز زمین باز شود.",
    },
    approach: {
      en: "The plan follows the sun: bedrooms face east, living spaces turn south, and deep reveals shade the glass in summer.",
      fa: "پلان آفتاب را دنبال می‌کند: اتاق‌های خواب رو به شرق، فضاهای نشیمن رو به جنوب، و عمق جداره‌ها در تابستان شیشه را سایه می‌اندازد.",
    },
    materials: {
      en: ["Limewashed masonry", "Oiled oak joinery", "Local limestone floors"],
      fa: ["بنای آهک‌اندود", "نجاری بلوط روغن‌خورده", "کف سنگ آهکی محلی"],
    },
    challenge: {
      en: "The old olive tree and a steep boundary wall limited where the house could stand.",
      fa: "درخت کهن زیتون و دیوار شیب‌دار مرز، جای ساختمان را محدود می‌کرد.",
    },
    solution: {
      en: "Volumes were shifted around the root zone and the wall became the retaining edge of a terraced garden.",
      fa: "حجم‌ها دور ناحیه ریشه جابه‌جا شدند و دیوار به لبه‌ی نگهدارنده‌ی باغی پلکانی تبدیل شد.",
    },
    gallery: [
      { art: "plan", tone: "olive", src: "/images/projects/CasaOlivo-3.jpg" },
      { art: "section", tone: "olive", src: "/images/projects/CasaOlivo-1.jpg" },
      { art: "stairs", tone: "olive", src: "/images/projects/CasaOlivo-2.jpg" },
    ],
  },
  "courtyard-house-isfahan": {
    area: 380,
    services: ["residential", "sustainable"],
    team: [1, 4],
    concept: {
      en: "A central courtyard with a shallow pool organises the house, as in traditional Persian houses, but with slimmer, more open edges.",
      fa: "حیاطی مرکزی با حوضچه‌ای کم‌عمق خانه را سازمان می‌دهد، مانند خانه‌های سنتی ایرانی، اما با لبه‌هایی باریک‌تر و بازتر.",
    },
    approach: {
      en: "Rooms surround the courtyard on two levels, so cross-ventilation and shade do most of the cooling work.",
      fa: "اتاق‌ها در دو طبقه دور حیاط قرار گرفته‌اند تا تهویه‌ی متقاطع و سایه بیشتر کار خنک‌سازی را انجام دهند.",
    },
    materials: {
      en: ["Handmade brick", "Lime plaster", "Cedar screens"],
      fa: ["آجر دست‌ساز", "گچ و آهک", "پرده‌های چوبی سدر"],
    },
    challenge: {
      en: "Summer temperatures are extreme and the plot is narrow.",
      fa: "دمای تابستان بسیار بالاست و زمین باریک است.",
    },
    solution: {
      en: "A deep courtyard, thick walls and a wind-catching tower keep the interior cool without mechanical cooling.",
      fa: "حیاط عمیق، دیوارهای ضخیم و بادگیر، فضای داخلی را بدون سرمایش مکانیکی خنک نگه می‌دارند.",
    },
    gallery: [
      { art: "plan", tone: "olive", src: "/images/projects/CourtyardHouse-1.jpg" },
      { art: "section", tone: "olive", src: "/images/projects/CourtyardHouse-2.jpg" },
      { art: "stairs", tone: "olive", src: "/images/projects/CourtyardHouse-3.jpg" },
    ],
  },
  "north-light-studios": {
    area: 1850,
    services: ["commercial", "sustainable"],
    team: [2, 4],
    concept: {
      en: "A row of workshops under a sawtooth roof, each lit from the north by tall glazing that avoids glare and heat.",
      fa: "ردیفی از کارگاه‌ها زیر سقف دندانه‌اره‌ای، هرکدام با شیشه‌ی بلند شمالی که از خیرگی و گرما جلوگیری می‌کند.",
    },
    approach: {
      en: "Structure and services are exposed and regular, so tenants can reconfigure studios without touching the base building.",
      fa: "سازه و تأسیسات عیان و منظم‌اند تا مستأجران بتوانند استودیوها را بدون دست زدن به ساختمان پایه بازچینی کنند.",
    },
    materials: {
      en: ["Exposed glulam frame", "Concrete floors", "Recycled brick infill"],
      fa: ["قاب چوب چندلایه عیان", "کف بتنی", "پرکننده‌ی آجر بازیافتی"],
    },
    challenge: {
      en: "Tenants needed very different layouts, from ceramics to digital labs.",
      fa: "مستأجران به چیدمان‌های بسیار متفاوتی نیاز داشتند، از سفالگری تا آزمایشگاه دیجیتال.",
    },
    solution: {
      en: "A regular grid and generous floor-to-ceiling height make each bay adaptable.",
      fa: "شبکه‌ی منظم و ارتفاع سخاوتمندانه‌ی طبقات، هر دهانه را سازگار می‌کند.",
    },
    gallery: [
      { art: "plan", tone: "olive", src: "/images/projects/NorthLightStudios-1.jpg" },
      { art: "section", tone: "olive", src: "/images/projects/NorthLightStudios-2.jpg" },
      { art: "stairs", tone: "olive", src: "/images/projects/NorthLightStudios-3.jpg" },
    ],
  },
  "salt-pavilion": {
    area: 140,
    services: ["concept"],
    team: [1],
    concept: {
      en: "A single pale concrete room with a round roof opening, designed to feel like standing inside a block of salt.",
      fa: "یک اتاق بتنی روشن با روزنه‌ی گرد سقفی، طراحی‌شده تا حس ایستادن درون یک قطعه نمک را بدهد.",
    },
    approach: {
      en: "The light moves across the walls through the day, so the exhibition changes without anything being moved.",
      fa: "نور در طول روز روی دیوارها حرکت می‌کند، پس نمایشگاه بدون جابه‌جایی چیزی تغییر می‌کند.",
    },
    materials: {
      en: ["Pigmented white concrete", "Salt-glazed tiles", "Blackened steel"],
      fa: ["بتن سفید رنگدانه‌دار", "کاشی لعاب نمکی", "فولاد سیاه‌شده"],
    },
    challenge: {
      en: "The budget was small and the plot sat on soft ground.",
      fa: "بودجه اندک بود و زمین خاک نرم داشت.",
    },
    solution: {
      en: "A shallow raft foundation and a thin shell roof kept the structure light and economical.",
      fa: "پی گسترده‌ی کم‌عمق و سقف پوسته‌ای نازک سازه را سبک و اقتصادی نگه داشتند.",
    },
    gallery: [
      { art: "plan", tone: "olive", src: "/images/projects/SaltPavilion-3.jpg" },
      { art: "section", tone: "olive", src: "/images/projects/SaltPavilion-1.jpg" },
      { art: "stairs", tone: "olive", src: "/images/projects/SaltPavilion-2.jpg" },
    ],
  },
  "oak-and-lime-apartment": {
    area: 96,
    services: ["interior"],
    team: [2],
    concept: {
      en: "One long oak wall runs the length of the flat, concealing storage, doors and a hidden kitchen.",
      fa: "یک دیوار بلند بلوطی در تمام طول آپارتمان کشیده شده و فضای ذخیره، درها و آشپزخانه‌ای پنهان را پوشانده است.",
    },
    approach: {
      en: "Fixed furniture was kept to the wall so the rooms stay open, bright and easy to rearrange.",
      fa: "مبلمان ثابت به دیوار سپرده شد تا اتاق‌ها باز، روشن و قابل جابه‌جایی بمانند.",
    },
    materials: {
      en: ["Oiled oak", "Lime plaster", "Terrazzo counters"],
      fa: ["بلوط روغن‌خورده", "گچ و آهک", "پیشخوان موزاییک"],
    },
    challenge: {
      en: "A dark, chopped-up plan with little storage.",
      fa: "پلانی تاریک و تکه‌تکه با فضای ذخیره‌ی اندک.",
    },
    solution: {
      en: "Walls were opened up and the oak wall gathered all services into one calm line.",
      fa: "دیوارها باز شدند و دیوار بلوطی همه‌ی خدمات را در یک خط آرام جمع کرد.",
    },
    gallery: [
      { art: "plan", tone: "olive", src: "/images/projects/Oak&LimeApartment-4.jpg" },
      { art: "section", tone: "olive", src: "/images/projects/Oak&LimeApartment-1.jpg" },
      { art: "stairs", tone: "olive", src: "/images/projects/Oak&LimeApartment-2.jpg" },
      { art: "stairs", tone: "olive", src: "/images/projects/Oak&LimeApartment-3.jpg" },
    ],
  },
  "douro-terrace-hotel": {
    area: 2600,
    services: ["villa", "sustainable"],
    team: [1, 2, 3],
    concept: {
      en: "Twenty-four rooms step down the slope like vineyard terraces, each roof becoming the next room's terrace.",
      fa: "بیست‌وچهار اتاق مانند تراس‌های تاکستان از شیب پایین می‌آیند و بام هر اتاق تراس اتاق بعدی می‌شود.",
    },
    approach: {
      en: "Stone walls follow the old terrace lines, and planted roofs keep the building quiet in the landscape.",
      fa: "دیوارهای سنگی خطوط تراس‌های قدیمی را دنبال می‌کنند و بام‌های سبز ساختمان را در منظر آرام نگه می‌دارند.",
    },
    materials: {
      en: ["Dry-stacked schist", "Planted roofs", "Chestnut timber"],
      fa: ["سنگ شیست خشکه‌چین", "بام‌های سبز", "چوب شاه‌بلوط"],
    },
    challenge: {
      en: "A steep slope with protected vineyard terraces.",
      fa: "شیبی تند با تراس‌های حفاظت‌شده‌ی تاکستان.",
    },
    solution: {
      en: "The rooms were built on the line of the old terraces, so no new cuts were needed.",
      fa: "اتاق‌ها روی خط تراس‌های قدیمی ساخته شدند، پس برش تازه‌ای لازم نبود.",
    },
    gallery: [
      { art: "plan", tone: "olive", src: "/images/projects/DouroTerraceHotel-1.jpg" },
      { art: "section", tone: "olive", src: "/images/projects/DouroTerraceHotel-2.jpg" },
      { art: "stairs", tone: "olive", src: "/images/projects/DouroTerraceHotel-3.jpg" },
    ],
  },
  "brick-mill-renewal": {
    area: 3200,
    services: ["renovation", "sustainable"],
    team: [3, 4],
    concept: {
      en: "The mill's brick shell and chimney stay; the new life is a covered street of workshops and a small market hall.",
      fa: "پوسته‌ی آجری و دودکش کارخانه می‌ماند؛ زندگی تازه، خیابانی سرپوشیده از کارگاه‌ها و یک بازارچه‌ی کوچک است.",
    },
    approach: {
      en: "Repairs match the old brick and lime, while new steel and glass are kept visibly separate.",
      fa: "مرمت‌ها با آجر و آهک قدیمی هماهنگ‌اند، در حالی که فولاد و شیشه‌ی تازه آشکارا جدا نگه داشته شده‌اند.",
    },
    materials: {
      en: ["Reclaimed brick", "Lime mortar", "Weathering steel"],
      fa: ["آجر بازیافتی", "ملات آهک", "فولاد هوازده"],
    },
    challenge: {
      en: "Cracked walls and a roof near collapse.",
      fa: "دیوارهای ترک‌خورده و بامی نزدیک به فروریختن.",
    },
    solution: {
      en: "Walls were stitched and grouted, and a light steel roof now carries the loads.",
      fa: "دیوارها دوخته و تزریق شدند و حالا یک بام فولادی سبک بارها را تحمل می‌کند.",
    },
    gallery: [
      { art: "plan", tone: "olive", src: "/images/projects/BrickMillRenewal-1.jpg" },
      { art: "section", tone: "olive", src: "/images/projects/BrickMillRenewal-2.jpg" },
      { art: "stairs", tone: "olive", src: "/images/projects/BrickMillRenewal-3.jpg" },
    ],
  },
  "canopy-offices": {
    area: 5400,
    services: ["commercial", "sustainable"],
    team: [2, 3],
    concept: {
      en: "A deep timber canopy shades the office floors and planted terraces, cutting cooling demand in a hot climate.",
      fa: "سایه‌بانی چوبی و عمیق، طبقات اداری و تراس‌های کاشته‌شده را سایه می‌اندازد و نیاز سرمایش را در اقلیمی گرم کم می‌کند.",
    },
    approach: {
      en: "Floor plates are narrow for daylight, and operable windows allow natural ventilation in the milder months.",
      fa: "پلان طبقات برای نور روز باریک است و پنجره‌های بازشو در ماه‌های معتدل تهویه‌ی طبیعی را ممکن می‌کنند.",
    },
    materials: {
      en: ["Laminated timber canopy", "Rammed-earth core walls", "Low-carbon concrete"],
      fa: ["سایه‌بان چوب چندلایه", "دیوارهای هسته‌ی خاک کوبیده", "بتن کم‌کربن"],
    },
    challenge: {
      en: "Strong western sun and a tight energy target.",
      fa: "آفتاب شدید غرب و هدف انرژی سختگیرانه.",
    },
    solution: {
      en: "Vertical fins on the west and a deep canopy above cut solar gain before it reaches the glass.",
      fa: "پره‌های عمودی در غرب و سایه‌بان عمیق بالا، تابش خورشید را پیش از رسیدن به شیشه کم می‌کنند.",
    },
    gallery: [
      { art: "plan", tone: "olive", src: "/images/projects/CanopyOffices-1.jpg" },
      { art: "section", tone: "olive", src: "/images/projects/CanopyOffices-2.jpg" },
      { art: "stairs", tone: "olive", src: "/images/projects/CanopyOffices-3.jpg" },
    ],
  },
};

export function getProjectDetails(slug: string) {
  return projectDetails[slug];
}
