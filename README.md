
# ATELIER — Architecture & Living

A bilingual (English / Persian) architecture studio portfolio built with Next.js 16, React 19, and TypeScript. Featuring a custom design system, RTL/LTR layouts, interactive project filtering, accessible galleries, and comprehensive automated testing.

[![Live Demo](https://img.shields.io/badge/Live_Demo-ATELIER-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://atelier-architecture-1ta.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Playwright](https://img.shields.io/badge/Playwright-Tested-2EAD33?logo=playwright&logoColor=white)](https://playwright.dev/)
[![Vitest](https://img.shields.io/badge/Vitest-Tested-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev/)

> **Project type:** Frontend engineering showcase.
>
> ATELIER is a fictional contemporary architecture studio. Its projects, team members, articles, statistics, and contact details are sample content. Artwork is generated placeholder illustration, and the contact form does not submit data. See [Demo Limitations](#demo-limitations).

---

## Table of Contents

- [Overview](#overview)
- [Screenshots](#screenshots)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture & Key Decisions](#architecture--key-decisions)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Performance](#performance)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Demo Limitations](#demo-limitations)
- [Author](#author)

---

## Overview

ATELIER is a responsive, bilingual portfolio website designed for a fictional contemporary architecture studio.

The project focuses on combining visual design with practical frontend engineering. It goes beyond static pages by implementing interactive features, URL-based state management, accessible components, localized content, and automated quality checks.

The website supports both English and Persian, with complete left-to-right (LTR) and right-to-left (RTL) layouts.

It includes a project archive, individual project pages, a journal, service descriptions, and a validated contact form.

The application is built with Next.js App Router and strict TypeScript, using a custom design system and reusable components.

## Screenshots

### Homepage

![Home page - English, light theme](docs/screenshots/home-en-light.png)

### Homepage & Featured Projects

| Persian Homepage — Dark Theme | Featured Projects |
| --- | --- |
| ![Persian home page](docs/screenshots/home-fa-dark.png) | ![Featured projects](docs/screenshots/featured-projects.png) |

### Projects & Project Details

| Projects Archive | Project Detail |
| --- | --- |
| ![Projects archive](docs/screenshots/projects-archive.png) | ![Project detail](docs/screenshots/project-detail.png) |

### Journal & Gallery

| Persian Journal Article | Lightbox Gallery |
| --- | --- |
| ![Journal article](docs/screenshots/journal-article-fa.png) | ![Lightbox gallery](docs/screenshots/lightbox.png) |

### Mobile Experience

<img src="docs/screenshots/mobile-menu-fa.png" alt="Persian mobile navigation menu" width="240"> <img src="docs/screenshots/mobile-contact-errors-fa.png" alt="Persian contact form validation" width="240">

---

## Features

### Localization & Internationalization

- English and Persian language support.
- Complete LTR and RTL layouts.
- Locale-aware routing with `/en` and `/fa` prefixes.
- Language switcher that preserves the equivalent page and query parameters.
- Translated page metadata and SEO alternates.
- Localized numbers, dates, and Persian calendar formatting.
- Type-safe translation messages.

### Design & User Experience

- Custom design system with CSS-variable design tokens.
- Independently designed light and dark themes.
- Theme preference persistence and system preference detection.
- Flash-free theme initialization.
- Responsive layouts across desktop, tablet, and mobile.
- Reduced-motion support.
- Custom typography with self-hosted fonts.

### Projects Archive

- Project filtering by type, year, and location.
- Search across project names in both languages.
- Sorting and result counts.
- Empty-state handling.
- Filter and search state synchronized with URL query parameters.
- Shareable filtered views.

### Project Details

- Individual project pages with structured information.
- Project facts, concepts, materials, challenges, and solutions.
- Interactive, keyboard-operable image gallery.
- Accessible lightbox.
- Related projects and breadcrumbs.

### Journal

- Featured articles and article details.
- Search and category filtering.
- Locale-formatted publication dates.
- Reading-time calculation.
- Related articles.

### Contact Form

- React Hook Form and Zod validation.
- Translated validation messages.
- Accessible error handling and focus management.
- Loading, success, and error states.
- Double-submission protection.
- Replaceable service layer for future backend integration.

### Accessibility & SEO

- Semantic HTML and accessible form controls.
- Keyboard navigation and visible focus indicators.
- Skip navigation link.
- Native HTML `<dialog>` for navigation and gallery interactions.
- Reduced-motion support.
- WCAG 2.2 AA accessibility targets.
- Automated accessibility audits with axe-core.
- Per-page metadata and canonical URLs.
- `hreflang` alternates.
- Sitemap and robots.txt.
- Structured data for articles and breadcrumbs.
- Custom 404 page.

---

## Tech Stack

### Frontend

| Technology | Purpose |
| --- | --- |
| Next.js 16 (App Router) | Application framework and routing |
| React 19 | UI development |
| TypeScript 6 | Static typing and type safety |
| Tailwind CSS 4 | Styling and responsive layouts |
| next-intl 4 | Localization and internationalized routing |
| class-variance-authority | Component variants |
| React Hook Form | Form state management |
| Zod 4 | Schema validation |
| lucide-react | Icons |

### Testing & Code Quality

| Technology | Purpose |
| --- | --- |
| Vitest | Unit testing |
| React Testing Library | Component testing |
| Playwright | Browser and end-to-end testing |
| @axe-core/playwright | Accessibility audits |
| ESLint 9 | Code quality and linting |
| Prettier | Code formatting |

### Development & Build Tools

| Technology | Purpose |
| --- | --- |
| npm | Package management |
| Turbopack | Development and build tooling |
| Node.js | Runtime |
| Conventional Commits | Commit message conventions |

---

## Architecture & Key Decisions

**App Router & Feature-Based Organization**

The application uses Next.js App Router with locale-based routing. Components, feature logic, data, and shared utilities are organized separately to keep responsibilities clear and maintainable.

**Type-Safe Localization**

`next-intl` handles locale routing and translations. English and Persian messages are type-checked, and automated tests ensure both language files maintain matching keys and placeholders.

**Custom Design System**

Instead of relying on a pre-built component library, the interface uses reusable components, CSS-variable design tokens, and `class-variance-authority` for consistent component variants.

Light and dark themes are designed independently rather than using simple color inversion.

**URL-Based Project Filtering**

Project filters, sorting, and search are synchronized with URL query parameters. This allows visitors to share filtered archive views and return to the same state through browser navigation.

**Accessible Native Components**

Native browser capabilities such as `<dialog>` are used for interactive navigation and galleries. This reduces unnecessary dependencies while supporting keyboard interaction and accessibility.

**Localized Content & Structured Data**

Project and article content is stored in typed data modules with translations for both supported languages. Locale-aware formatting handles dates, numbers, and reading times.

**Replaceable Contact Service**

Contact form submission is separated into a service layer. The current implementation uses a demo service that can be replaced with a real API without changing the form's main logic.

**Performance & Bundle Control**

The project uses optimized Next.js image handling, localized client namespaces, and a bundle-size budget check to keep unnecessary JavaScript out of the browser.

---

## Project Structure

```text
src/
├── app/
│   ├── [locale]/              # Localized application pages
│   ├── art/                   # Generated placeholder artwork
│   ├── globals.css            # Design tokens and global styles
│   ├── sitemap.ts
│   ├── robots.ts
│   └── icon.svg
│
├── components/
│   ├── ui/                    # Reusable UI components
│   ├── shared/                # Shared sections and utilities
│   ├── layout/                # Header, footer, navigation
│   ├── forms/                 # Form components
│   ├── home/
│   ├── projects/
│   ├── services/
│   ├── about/
│   └── journal/
│
├── features/                  # Feature-specific logic
├── data/                      # Typed bilingual content
├── messages/                  # en.json and fa.json
├── i18n/                      # Localization configuration
├── lib/                       # Shared utilities and helpers
├── services/                  # Replaceable service layer
└── types/                     # Shared TypeScript types
│
tests/
└── e2e/                       # Playwright browser tests
│
scripts/                       # Build and screenshot utilities
docs/
└── screenshots/               # README screenshots
```

---

## Testing

The project includes unit, component, browser, and accessibility tests.

### Unit & Component Tests

Implemented with **Vitest** and **React Testing Library**.

Coverage includes:

- Component behavior and rendering.
- Feature logic and utility functions.
- Data validation and translation consistency.
- Localization and project content integrity.

Run:

```bash
npm test
```

### End-to-End & Browser Tests

Implemented with **Playwright**.

The browser test suite covers:

- Visitor journeys in English and Persian.
- Navigation and language switching.
- Project search, filters, sorting, and URL state.
- Gallery and lightbox keyboard interaction.
- Contact form validation and submission states.
- Theme behavior and persistence.
- Responsive layouts and horizontal overflow.
- Reduced-motion behavior.
- Browser console errors and broken links.
- 404 page behavior.
- Accessibility audits with axe-core.

Install Chromium once:

```bash
npx playwright install chromium
```

Run:

```bash
npm run test:e2e
```

The suite includes more than 170 browser tests and 200 unit and component tests.

---

<!--
## Performance

Lighthouse results measured on the production build using its mobile simulation profile (4× CPU slowdown and slow 4G).

| Page | Performance | Accessibility | Best Practices | SEO |
| --- | ---: | ---: | ---: | ---: |
| Home | 95 | 100 | 100 | 100 |
| Project Detail | 97 | 100 | 100 | 100 |
| Article | 95 | 100 | 100 | 100 |
| Journal | 95 | 100 | 100 | 100 |
| Projects Archive | 88 | 100 | 100 | 100 |
 -->
Additional performance considerations:

- First-load JavaScript is kept within defined bundle budgets.
- Page bundles are approximately 165–175 KB gzip, with the contact page around 207 KB.
- Image loading is optimized through Next.js image handling.
- Client-side translation namespaces are limited to reduce unnecessary JavaScript.
- `npm run check:bundle` checks first-load JavaScript budgets.

> Lighthouse results may vary between runs. The Projects Archive still has an LCP above 2.5 seconds in the simulated mobile environment.

---

## Getting Started

### Prerequisites

- Node.js 20.9 or newer
- npm

### Installation

Clone the repository:

```bash
git clone https://github.com/yektaakhavan/atelier-architecture.git
cd atelier-architecture
```

Install dependencies:

```bash
npm install
```

Create the environment file:

```bash
cp .env.example .env.local
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

### Environment Variables

Configure the public site URL in `.env.local`:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

For production, replace it with the deployed public origin:

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

This variable is used for canonical URLs, hreflang alternates, sitemap generation, and structured data. It is evaluated at build time.

### Run Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

The application redirects to the default English locale.

### Production Build

```bash
npm run build
npm run start
```

---

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript checks |
| `npm test` | Run unit and component tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:e2e` | Run Playwright browser tests |
| `npm run check:bundle` | Check first-load JavaScript budgets |
| `npm run docs:screenshots` | Regenerate README screenshots |
| `npm run format` | Format code with Prettier |

---

## Demo Limitations

ATELIER is a frontend engineering demonstration, not a production website for a real architecture studio.

- **Fictional content:** The studio, projects, team members, articles, statistics, and contact details are invented.
- **Placeholder artwork:** Images are generated SVG illustrations, not real architectural photography.
- **Contact form:** The form demonstrates validation and UI states but does not send messages to a backend.
- **No authentication or database:** The project does not include an admin panel, user accounts, or persistent server-side data.
- **Language content:** Persian and English copy is written for demonstration purposes and should be reviewed before real-world use.
- **Browser testing:** Automated browser tests currently target Chromium. Safari and Firefox have not been tested.
- **Deployment requirements:** The application requires a Node.js-compatible hosting environment with Next.js support. A pure static export is not supported because locale routing uses `proxy.ts`.

---

## Author

**Yekta Akhavan**

Frontend Engineer | React, Next.js, TypeScript

[![GitHub](https://img.shields.io/badge/GitHub-yektaakhavan-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/yektaakhavan)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Yekta_Akhavan-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/yekta-akhavan/)
[![Portfolio](https://img.shields.io/badge/Portfolio-Visit_Website-000000?style=flat-square&logo=vercel&logoColor=white)](https://yekta-akhavan.vercel.app/)
[![Email](https://img.shields.io/badge/Email-Contact-EA4335?style=flat-square&logo=gmail&logoColor=white)](mailto:yekta.akhavan.dev@gmail.com)
