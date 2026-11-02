# Technical decisions

The reasoning behind the main choices in this project, including the ones that were changed after real
measurement. Each entry says what was decided, why, and what it costs.

1. [Server and Client Components](#1-server-and-client-components)
2. [Internationalisation](#2-internationalisation)
3. [Right-to-left support](#3-right-to-left-support)
4. [Theming without a flash](#4-theming-without-a-flash)
5. [State management: the URL first](#5-state-management-the-url-first)
6. [Placeholder artwork and performance](#6-placeholder-artwork-and-performance)
7. [Forms and the demo backend seam](#7-forms-and-the-demo-backend-seam)
8. [Accessibility](#8-accessibility)
9. [Testing strategy](#9-testing-strategy)
10. [How 404 works in Next.js 16](#10-how-404-works-in-nextjs-16)
11. [Dependencies deliberately not used](#11-dependencies-deliberately-not-used)
12. [Deployment constraints](#12-deployment-constraints)

---

## 1. Server and Client Components

**Decision.** Pages and almost all sections are Server Components. Only parts that need browser state or
events are Client Components: the header (menu, active link), the theme toggle, the language switcher, the
projects and journal browsers (filtering), the gallery and lightbox, and the contact form.

**Why.** Content pages (project facts, articles, services, legal text) are rendered to static HTML and ship no
component JavaScript of their own. First-load JavaScript is about 165-175 KB gzip per page, of which React and
the Next.js runtime are roughly 115 KB and `next-intl`'s message formatter about 12 KB; the rest is our own
code and icons. The contact page is the heaviest (about 207 KB) because it ships React Hook Form and Zod, and
has its own budget. Next.js also emits a legacy-browser polyfill chunk (about 39 KB gzip) marked `nomodule`;
modern browsers never download it, so the budget script excludes it.

**Cost.** React still hydrates the whole tree under a client boundary, so node count matters for
main-thread time (see section 6). Cards used inside client components need their translations in the client
message subset.

**Client messages.** `NextIntlClientProvider` receives only the namespaces client components use
(`CLIENT_NAMESPACES` in `src/i18n/client-namespaces.ts`). Page copy such as the home text never reaches the
browser as JSON.

This is easy to get wrong silently: a namespace missing from the list is not a build error. next-intl logs
`MISSING_MESSAGE` and renders raw keys, and unit tests render with _every_ message so they cannot notice. It
happened once (the journal archive shipped without its messages). A test now walks the import graph from every
`"use client"` file, collects each `useTranslations()` namespace it can reach, and fails if one is missing from
the list (or listed without being used), naming the files involved.

## 2. Internationalisation

**Routing.** `/en` and `/fa`, always prefixed, handled by `next-intl` in `proxy.ts` (Next.js 16's name for
middleware). Locale detection from `Accept-Language` is **off**: the brief makes English the default for
everyone, and the URL is the single source of truth. `/` redirects to `/en`.

**Typed messages.** `AppConfig` in `src/types/next-intl.d.ts` ties message keys and locales to `en.json`, so a
missing or misspelled key is a compile error. A test also requires `fa.json` to have exactly the same keys and
the same ICU placeholders.

**Locale-dependent data.** Content data (projects, articles) carries both languages in the data file, typed as
`Localized<T>`; interface text lives in the message files. Numbers and dates go through `Intl` (via
`next-intl`), which gives Persian digits and the Persian calendar for free. Dates are stored as date-only ISO
strings and formatted in UTC so a date never shifts a day in western time zones. Country names come from
`Intl.DisplayNames`, so the data only stores ISO codes.

**Search across languages.** Searching a name in either language finds the project in either language, and
text is normalised first (Arabic and Persian letter forms such as ي/ی and ك/ک, diacritics and zero-width
joiners compare equal).

**Language switch.** The switcher renders real links with `lang` and `hreflang`, so it works without
JavaScript. It keeps the query string by reading `useSearchParams` behind a `Suspense` boundary whose fallback
is the same links without the query, which keeps the switcher in the static HTML.

## 3. Right-to-left support

- **Logical CSS everywhere** (`ms-*`, `ps-*`, `start`/`end`, `text-start`) and the `rtl:` variant only where
  a visual really has to flip (chevrons, arrows). There are no separate Persian templates.
- **Letter-spacing is reset to zero for Persian.** Negative tracking breaks the joining of Arabic-script
  letters. The rule is written unlayered so it beats Tailwind's `tracking-*` utilities, and it matches by each
  element's own language so a `lang="en"` island (the wordmark) keeps its tracking.
- **Fonts.** Latin text uses Inter Tight and Persian falls through per glyph to Vazirmatn, so mixed text needs
  no per-element font switching. The Fraunces italic accent is disabled in Persian because synthesised italic
  Persian is wrong.
- **Mixed-direction content.** Email and phone inputs are `dir="ltr"` but aligned to the start of the line
  (`self-start`), so digits read correctly and the block still lines up with its neighbours.
- **Keyboard behaviour follows reading direction.** In the lightbox, `ArrowLeft` means "next" on Persian pages.
- **Artwork is not mirrored.** Illustrations are images, not layout.

## 4. Theming without a flash

A tiny inline script in `<head>` sets `data-theme` on `<html>` before first paint. It applies the saved choice,
otherwise the system preference. It is a self-contained string in `lib/theme.ts`; a test runs it in jsdom for
every combination of stored value and system preference and compares the result with the typed
`resolveTheme()`, so the two cannot drift. The browser suite also blocks **every** script bundle and verifies
the page still renders dark, which proves the inline script alone does the job.

**Pages React renders only in the browser.** For `notFound()` responses Next.js 16 sends an empty shell and
renders the layout in the browser (see section 10). React never executes a `<script>` it creates itself and
warns about it in development, so on those pages the inline script above would not run, and a visitor with the
dark theme saved got a _light_ 404 page. `ThemeScript` therefore renders the inline script only during server
rendering and hydration (a `useSyncExternalStore` whose server snapshot is `true`), where it is part of the
HTML and runs before first paint. When the page is rendered only in the browser it creates no script and a
layout effect applies the saved theme instead (`applyStoredTheme`). 404 pages therefore follow the saved
theme, with a brief light flash because their content already needs JavaScript.

The toggle reads the theme through `useSyncExternalStore` on the `<html>` attribute (server snapshot "light",
corrected immediately after hydration), and both icons are rendered and swapped with CSS so the icon is right
on first paint.

**Contrast.** The brief's olive (`#737B60`) and brick (`#B66A4A`) measure 4.0:1 and 3.7:1 on the paper
background, which fails for body text. They are kept for decoration; separate `*-ink` tokens (about 5.5-6:1) are
used for text and `--accent` for solid fills. In the final axe audit across all pages, both themes, there
were no colour-contrast violations. One decorative numeral on the 404 page did fail (1.4:1) and was fixed.

## 5. State management: the URL first

Filters, search and sorting are plain React state initialised from the URL once on load, then written back with
`history.replaceState` on every change. That makes any filtered view shareable and survive a reload and a
language switch, with no store library. Zustand was never needed: there is no state shared between distant
components that is not already in the URL, the theme (which lives on `<html>`), or form state.

Invalid values in the URL fall back to defaults silently (tested). The archive's static HTML is the full
unfiltered grid, used as the `Suspense` fallback, so the page is complete without JavaScript and for crawlers.

Trade-off: state flows URL to state once, then state to URL, so browser back/forward does not re-parse the
URL. `replaceState` (not `pushState`) means filtering does not pile up history entries.

## 6. Placeholder artwork and performance

This decision was **reversed after measuring**.

_First version:_ the artwork was an inline SVG component. Lighthouse reported 700 ms of Total Blocking Time on
the home page. Measuring showed the inline SVG drawings were about 35% of all DOM nodes (198 of 563), plus a
large share of the HTML (116 KB) and the serialised RSC payload (69 KB), and React hydrates every node.

_Now:_ a pure string generator (`lib/art-svg.ts`) produces each drawing; a route handler
(`app/art/[file]/route.ts`) prerenders all 24 variant-and-tone files at build time with an `immutable` cache
header; components reference them with a single `<img>`. The generator is also the only place the drawings
live, and a test parses each output as real SVG and checks its shapes stay inside the "safe zone" that survives
`object-fit: cover` cropping on portrait, square and 16:9 frames.

| Home page, mobile Lighthouse | Inline SVG | `<img>` files |
| ---------------------------- | ---------- | ------------- |
| Performance                  | 83         | 95            |
| Total Blocking Time          | 700 ms     | 250 ms        |
| DOM nodes                    | 563        | 418           |
| HTML                         | 116 KB     | 91 KB         |

**Side effect, handled.** Inline SVG is invisible to Largest Contentful Paint, so the earlier 0.8 s was really
the timing of a heading. As images they became LCP candidates, and LCP rose until above-the-fold images were
loaded eagerly with `fetchpriority="high"` and a `<link rel="preload">` (the hero, the first archive cards, the
first featured article).

**Caveats.** Single Lighthouse runs are noisy: one run reported 690 ms TBT where three repeats gave 250 ms
every time. The archive page's simulated LCP is still above 2.5 s although the image loads in about 40 ms; the
remainder is hydration cost under 4x CPU throttling. `npm run check:bundle` guards the JavaScript budget.

## 7. Forms and the demo backend seam

Zod error messages are **translation keys** (`nameRequired`), not sentences, so the schema is locale-free and
testable, and the form translates them at render time. Selects start as `""` so the placeholder is a real value
that fails validation.

Submission goes through `services/contact.ts`, which only returns `{ ok: true | false }`. Replacing the demo
with a real endpoint means changing that one file. The success message says plainly that nothing was sent.

Behaviour that is easy to get wrong and is tested: first invalid field is focused; errors are linked with
`aria-describedby`; the button is disabled while sending and a second Enter press is ignored; after success,
focus moves to the result (the submit button that had it is gone).

## 8. Accessibility

- Native `<dialog>` for the mobile menu and the lightbox. The browser provides focus trapping, Escape and
  focus return; the lightbox only reports user-initiated closes to its parent (a bug found by a test: closing
  from `open` also fired the native `close` event and called `onClose` twice).
- A skip link; a labelled landmark per region; headings follow the page outline (archive cards are `h2` under
  the `h1`, found by axe); two landmarks never share a name (the language switcher is a labelled group, found
  by axe).
- Illustrations are described as illustrations ("Illustration of ...") and never pass as photographs.
- `prefers-reduced-motion` collapses every animation and transition globally.
- Automated tools detect only part of the possible WCAG issues. They do not replace a manual pass with a
  screen reader, which has not been done.

## 9. Testing strategy

| Layer         | Tool                        | What it protects                                                                                       |
| ------------- | --------------------------- | ------------------------------------------------------------------------------------------------------ |
| Pure logic    | Vitest                      | Filtering, search normalisation, sorting, URL state, reading time, related items, theme script, schema |
| Components    | Vitest + Testing Library    | What a visitor can observe: roles, names, states, translations, keyboard behaviour                     |
| Data          | Vitest                      | Unique slugs, complete translations, valid references, block parity                                    |
| Real browser  | Playwright                  | Journeys, URL state, theme flash, 404, overflow at 5 widths, reduced motion, links                     |
| Accessibility | axe via Playwright          | WCAG 2.2 AA for every page, both languages and themes, and interactive states                          |
| Budget        | `scripts/check-bundle-size` | First-load JavaScript per page                                                                         |

Lessons from building it:

- **jsdom is not a browser.** Everything passed in HTML and jsdom checks while the site was, in a real browser,
  unstyled at one point and overflowing horizontally at 320 px on another page. Browser tests caught both.
- **A test that has never failed has not proved anything.** The overflow test was checked by temporarily
  reintroducing the bug and confirming it fails (page 384 px wide in a 320 px viewport). The same was done for
  the namespace and theme fixes below.
- **A quiet console is a test.** Visual, structural and accessibility checks all passed while the journal archive
  logged dozens of `MISSING_MESSAGE` errors per page load and 404 pages logged a React error and lost the dark
  theme. `console.spec.ts` now loads every page in both languages (and navigates client-side) and fails on any
  console error or warning, or on a translation key leaking into the page text. It runs against the production
  build, so development-only warnings still need an occasional look in `npm run dev`.
- **Check what you are actually testing.** An early run silently hit a stale server on the same port. The test
  harness now refuses to start if the port is taken and verifies the stylesheet is served.
- **Repeat performance runs.** See section 6.

Tooling note: `tailwind-merge` does not know custom utilities, so `cn()` is configured with the project's
`text-display` / `text-headline` sizes. Without that, they were mistaken for colours and dropped (it shrank the
mobile menu links), and a regression test now covers it.

## 10. How 404 works in Next.js 16

With the locale as a top-level dynamic segment, a `notFound()` response (unknown page, project or article) is
sent with status 404, but the HTML body is Next.js's empty error shell; the not-found UI, `lang` and `dir` are
rendered in the browser. Several alternatives were tried (a force-dynamic catch-all, a root `not-found.tsx`, a
nested route-group layout, the experimental `globalNotFound`, `notFound()` from static and dynamic pages) and
all behaved the same, and Next's own source shows this recovery path is deliberate. The cost is that 404 pages
need JavaScript to show content, which does not matter for pages that should not be indexed. The real-browser
suite verifies Persian 404s (status, text, `lang`, `dir`, working links, and that they follow the saved or
system theme). Because the layout is rendered in the browser there, anything in it that only works when
server-rendered (an inline script, for example) needs a browser-side fallback; see section 4.

## 11. Dependencies deliberately not used

| Not used       | Reason                                                                                                                   |
| -------------- | ------------------------------------------------------------------------------------------------------------------------ |
| shadcn/ui      | Native `<dialog>` and a few small components cover every interactive need; adding it would also make the UI look generic |
| Zustand        | No cross-component state beyond the URL, the theme on `<html>`, and form state                                           |
| TanStack Query | There is no API; data is local and typed                                                                                 |
| Embla Carousel | No slider is needed; the lightbox is a modal viewer                                                                      |
| Motion         | Installed at first, then removed: all motion is CSS (entrances, dialogs, panels) and adds no JavaScript                  |

## 12. Deployment constraints

Locale routing is in `proxy.ts`, so a pure `output: "export"` is not possible; run `next start` or use a
platform with native Next.js support. Set `NEXT_PUBLIC_SITE_URL` at build time: it feeds canonical links,
hreflang, the sitemap and structured data, and a mismatch was the only thing between SEO 91 and 100 in
Lighthouse. Static assets under `/_next/static` and `/art` are served with long-lived immutable caching.
