/**
 * Message namespaces sent to the browser. Client Components can only read what is listed here,
 * which keeps page copy out of the JavaScript payload. client-namespaces.test.ts fails if a
 * namespace used by client code is missing (or listed without being used).
 */
export const CLIENT_NAMESPACES = [
  "Theme",
  "LanguageSwitcher",
  "Nav",
  "Contact",
  "Projects",
  "ProjectDetail",
  "Journal",
] as const;
