export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "atelier-theme";

export function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark";
}

/** A saved choice wins; otherwise follow the OS preference. */
export function resolveTheme(stored: string | null, prefersDark: boolean): Theme {
  if (isTheme(stored)) return stored;
  return prefersDark ? "dark" : "light";
}

/*
 * Inline script run in <head> before first paint, so the page never flashes
 * the wrong theme. It must stay self-contained (no imports) and mirror
 * resolveTheme(); theme.test.ts keeps the two in sync.
 */
export const themeInitScript = `(function(){try{var s=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});var t=s==="light"||s==="dark"?s:(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");var d=document.documentElement;d.dataset.theme=t;d.style.colorScheme=t}catch(e){}})();`;
