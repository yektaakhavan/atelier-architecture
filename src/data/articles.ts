import type { Article, ArticleBlock } from "@/types/content";

const h = (text: string): ArticleBlock => ({ type: "heading", text });
const p = (text: string): ArticleBlock => ({ type: "paragraph", text });

// Fictional articles written for this demo. Each article has the same block structure in both languages.
export const articles: readonly Article[] = [
  {
    slug: "daylight-in-small-rooms",
    category: "smallSpaces",
    publishedAt: "2026-09-18",
    featured: true,
    author: 2,
    image: { art: "section", tone: "stone" },
    title: { en: "Daylight in small rooms", fa: "نور روز در اتاق‌های کوچک" },
    excerpt: {
      en: "Small rooms rarely lack light; they lack a clear path for it. Habits that make a modest flat feel generous.",
      fa: "اتاق‌های کوچک کم‌نور نیستند؛ مسیر روشنی برای نور ندارند. عادت‌هایی که یک آپارتمان کم‌متراژ را گشاده نشان می‌دهد.",
    },
    body: {
      en: [
        h("Start with the window wall"),
        p(
          "A single large opening almost always beats two small ones. It gives the light one clear direction and leaves the other walls free for storage and shelves.",
        ),
        p(
          "Keep the sill low and the reveals thin. The less frame you see, the more sky the room seems to own.",
        ),
        h("Let light bounce"),
        p(
          "Pale lime plaster on the ceiling and the wall beside the window turns a single opening into a soft, even glow.",
        ),
        p(
          "Add one dark, matte surface, such as an oiled oak panel, so that the bright areas read as bright rather than flat.",
        ),
      ],
      fa: [
        h("از دیوار پنجره شروع کنید"),
        p(
          "یک بازشوی بزرگ تقریباً همیشه از دو بازشوی کوچک بهتر است. نور را یک جهت روشن می‌دهد و دیوارهای دیگر را برای قفسه و فضای ذخیره آزاد می‌گذارد.",
        ),
        p(
          "آستانه را کوتاه و جداره‌ها را نازک نگه دارید. هرچه قاب کمتری دیده شود، اتاق آسمان بیشتری را از آنِ خود می‌داند.",
        ),
        h("بگذارید نور بازتاب شود"),
        p(
          "گچ و آهک روشن روی سقف و دیوار کنار پنجره، یک بازشو را به درخششی نرم و یکنواخت تبدیل می‌کند.",
        ),
        p(
          "یک سطح تیره و مات، مثل تخته‌ی بلوط روغن‌خورده، اضافه کنید تا بخش‌های روشن، روشن دیده شوند نه مسطح.",
        ),
      ],
    },
  },
  {
    slug: "why-lime-plaster",
    category: "materials",
    publishedAt: "2026-08-27",
    featured: false,
    author: 3,
    image: { art: "facade", tone: "olive" },
    title: { en: "Why we keep returning to lime plaster", fa: "چرا مدام به گچ و آهک برمی‌گردیم" },
    excerpt: {
      en: "It breathes, it repairs itself and it ages with grace. A short case for the oldest wall finish we still use.",
      fa: "نفس می‌کشد، خودش را ترمیم می‌کند و زیبا پیر می‌شود. دفاعیه‌ای کوتاه از قدیمی‌ترین پرداخت دیواری که هنوز به کار می‌بریم.",
    },
    body: {
      en: [
        h("A wall that manages moisture"),
        p(
          "Lime plaster absorbs and releases humidity, which steadies the air in a room and protects old masonry from trapped damp.",
        ),
        p(
          "It also heals small cracks as it slowly re-carbonates, so minor movement rarely becomes a visible flaw.",
        ),
        h("Honest about its age"),
        p(
          "Because it is applied by hand, no two walls look the same. Trowel marks and soft colour shifts become part of the room.",
        ),
        p(
          "When a wall does need repair, a patch can be blended in without removing the surrounding surface.",
        ),
      ],
      fa: [
        h("دیواری که رطوبت را مدیریت می‌کند"),
        p(
          "گچ و آهک رطوبت را جذب و آزاد می‌کند؛ این کار هوای اتاق را متعادل نگه می‌دارد و از بنای قدیمی در برابر نم محبوس محافظت می‌کند.",
        ),
        p(
          "همچنین با کربناته شدنِ آهسته، ترک‌های کوچک را ترمیم می‌کند و جابه‌جایی‌های جزئی کمتر به عیبی دیدنی تبدیل می‌شود.",
        ),
        h("صادق درباره‌ی سن خود"),
        p(
          "چون با دست اجرا می‌شود، هیچ دو دیواری شبیه هم نیست. اثر ماله و تغییرهای نرم رنگ بخشی از اتاق می‌شود.",
        ),
        p(
          "وقتی دیواری نیاز به تعمیر دارد، می‌توان لکه‌ی تعمیر را بدون برداشتن سطح اطراف با آن هماهنگ کرد.",
        ),
      ],
    },
  },
  {
    slug: "reuse-before-rebuild",
    category: "sustainable",
    publishedAt: "2026-07-09",
    featured: true,
    author: 3,
    relatedProject: "brick-mill-renewal",
    image: { art: "arches", tone: "brick" },
    title: { en: "Reuse before rebuild", fa: "بازاستفاده پیش از ساخت دوباره" },
    excerpt: {
      en: "The greenest building is often the one that is already standing. How we decide what an old structure can still carry.",
      fa: "سبزترین ساختمان اغلب همان است که هم‌اکنون سرپاست. چگونه تصمیم می‌گیریم یک سازه‌ی قدیمی هنوز چه چیزی را تحمل می‌کند.",
    },
    body: {
      en: [
        h("Count the carbon already spent"),
        p(
          "Most of a building's embodied carbon is released the day it is built. Keeping a sound frame avoids repeating that cost.",
        ),
        p(
          "A careful survey tells us what is worth keeping: foundations, structure and envelope first, finishes last.",
        ),
        h("Repair visibly"),
        p(
          "New steel and glass can sit beside old brick without pretending to match. The contrast makes the building's history easier to read.",
        ),
        p(
          "The Brick Mill Renewal followed this approach, turning a derelict mill into workshops and a market hall.",
        ),
      ],
      fa: [
        h("کربنِ هزینه‌شده را بشمارید"),
        p(
          "بیشتر کربن نهفته‌ی یک ساختمان همان روزی که ساخته می‌شود آزاد می‌گردد. نگه داشتن یک قاب سالم از تکرار این هزینه جلوگیری می‌کند.",
        ),
        p(
          "یک برداشت دقیق به ما می‌گوید چه چیزی ارزش حفظ دارد: ابتدا پی، سازه و پوسته، و در آخر پرداخت‌ها.",
        ),
        h("آشکارا مرمت کنید"),
        p(
          "فولاد و شیشه‌ی تازه می‌تواند کنار آجر کهن بنشیند، بی‌آنکه وانمود کند با آن یکی است. این تضاد خواندن تاریخ ساختمان را آسان‌تر می‌کند.",
        ),
        p(
          "بازسازی کارخانه آجری با همین رویکرد انجام شد و کارخانه‌ای متروک را به کارگاه و بازارچه تبدیل کرد.",
        ),
      ],
    },
  },
  {
    slug: "the-courtyard-reconsidered",
    category: "contemporary",
    publishedAt: "2026-06-02",
    featured: false,
    author: 1,
    relatedProject: "courtyard-house-isfahan",
    image: { art: "arches", tone: "olive" },
    title: { en: "The courtyard, reconsidered", fa: "بازاندیشی حیاط" },
    excerpt: {
      en: "An old idea that solves very current problems: shade, privacy and a calm centre for the home.",
      fa: "ایده‌ای کهن که مسائل بسیار امروزی را حل می‌کند: سایه، خلوت و مرکزی آرام برای خانه.",
    },
    body: {
      en: [
        h("A room without a roof"),
        p(
          "A courtyard is the most generous room in the house: it brings in light, air and sky while keeping the street at a distance.",
        ),
        p(
          "In hot climates a shaded court and a small pool cool the surrounding rooms without any machinery.",
        ),
        h("Made for today"),
        p(
          "Slimmer edges, larger openings and flexible furniture turn the traditional plan into something that suits contemporary life.",
        ),
        p(
          "Our Courtyard House in Isfahan explores exactly this balance between inheritance and invention.",
        ),
      ],
      fa: [
        h("اتاقی بدون سقف"),
        p(
          "حیاط سخاوتمندترین اتاق خانه است: نور، هوا و آسمان را می‌آورد و خیابان را دور نگه می‌دارد.",
        ),
        p(
          "در اقلیم‌های گرم، حیاطی سایه‌دار و حوضچه‌ای کوچک اتاق‌های اطراف را بی‌هیچ ماشینی خنک می‌کند.",
        ),
        h("ساخته‌شده برای امروز"),
        p(
          "لبه‌های باریک‌تر، بازشوهای بزرگ‌تر و مبلمان انعطاف‌پذیر، پلان سنتی را به چیزی مناسب زندگی معاصر تبدیل می‌کند.",
        ),
        p("خانه حیاط‌دار ما در اصفهان دقیقاً همین توازن میان میراث و ابداع را می‌کاود."),
      ],
    },
  },
  {
    slug: "warm-light-at-night",
    category: "lighting",
    publishedAt: "2026-05-14",
    featured: false,
    author: 2,
    image: { art: "volumes", tone: "night" },
    title: {
      en: "Evening light: choose warmth over brightness",
      fa: "نور شبانه: گرمی را بر روشنی ترجیح دهید",
    },
    excerpt: {
      en: "A single bright ceiling light flattens a room. Layering a few low, warm sources does the opposite.",
      fa: "یک چراغ سقفی پرنور اتاق را مسطح می‌کند. چند منبع کم‌نور و گرم روی هم، عکسش را انجام می‌دهد.",
    },
    body: {
      en: [
        h("Think in layers"),
        p(
          "Combine a soft ambient glow, a few task lights where you read or cook, and one accent on a wall or plant.",
        ),
        p(
          "Keep every source below eye level in the evening so the ceiling stays quiet and the room feels lower and calmer.",
        ),
        h("Choose the colour of the light"),
        p(
          "Warm bulbs around 2700 kelvin flatter timber, lime and skin. Cooler light belongs in workshops and kitchens, not in living rooms.",
        ),
        p("Dimmers on every circuit let one room serve many moods."),
      ],
      fa: [
        h("لایه‌لایه فکر کنید"),
        p(
          "یک درخشش ملایم عمومی، چند چراغ کار برای جایی که می‌خوانید یا می‌پزید، و یک نور تأکیدی روی دیوار یا گیاه را ترکیب کنید.",
        ),
        p(
          "در شب همه‌ی منابع را پایین‌تر از سطح چشم نگه دارید تا سقف ساکت بماند و اتاق کوتاه‌تر و آرام‌تر حس شود.",
        ),
        h("رنگِ نور را انتخاب کنید"),
        p(
          "لامپ‌های گرم حدود ۲۷۰۰ کلوین چوب، آهک و پوست را زیباتر نشان می‌دهند. نور سردتر جای کارگاه و آشپزخانه است، نه اتاق نشیمن.",
        ),
        p("دیمر روی هر مدار باعث می‌شود یک اتاق حال‌وهواهای مختلف را تاب بیاورد."),
      ],
    },
  },
  {
    slug: "case-study-oak-and-lime",
    category: "caseStudy",
    publishedAt: "2026-04-21",
    featured: false,
    author: 2,
    relatedProject: "oak-and-lime-apartment",
    image: { art: "plan", tone: "stone" },
    title: {
      en: "Case study: one oak wall, a whole flat",
      fa: "مطالعه‌ی موردی: یک دیوار بلوطی، یک آپارتمان کامل",
    },
    excerpt: {
      en: "How a single long timber wall reorganised a dark 96-square-metre apartment.",
      fa: "چگونه یک دیوار چوبی بلند، آپارتمانی تاریک و ۹۶ متری را بازسازماندهی کرد.",
    },
    body: {
      en: [
        h("The problem"),
        p(
          "The flat was chopped into small, dark rooms, with doors opening onto every corridor and storage in none of them.",
        ),
        p("The brief asked for more light, more storage and fewer visible doors."),
        h("The wall that does the work"),
        p(
          "We opened the plan and gathered storage, doors and a hidden kitchen into one oiled oak wall that runs the whole length of the flat.",
        ),
        p(
          "With the services in a single line, the rest of the rooms could stay open, bright and easy to rearrange.",
        ),
      ],
      fa: [
        h("مسئله"),
        p(
          "آپارتمان به اتاق‌های کوچک و تاریک تقسیم شده بود؛ به هر راهرو دری باز می‌شد و در هیچ‌کدام فضای ذخیره نبود.",
        ),
        p("برنامه، نور بیشتر، فضای ذخیره‌ی بیشتر و درهای کمتر دیده‌شده می‌خواست."),
        h("دیواری که کار را انجام می‌دهد"),
        p(
          "پلان را باز کردیم و فضای ذخیره، درها و یک آشپزخانه‌ی پنهان را در یک دیوار بلوطی روغن‌خورده جمع کردیم که در تمام طول آپارتمان کشیده شده است.",
        ),
        p(
          "با قرار گرفتن تأسیسات در یک خط، بقیه‌ی اتاق‌ها می‌توانستند باز، روشن و قابل جابه‌جایی بمانند.",
        ),
      ],
    },
  },
];

export const featuredArticles = articles.filter((article) => article.featured);
