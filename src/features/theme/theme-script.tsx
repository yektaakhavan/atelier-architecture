"use client";

import { useLayoutEffect, useSyncExternalStore } from "react";
import { applyStoredTheme, themeInitScript } from "@/lib/theme";

const subscribe = () => () => {};

/**
 * Puts the theme-initialisation script in <head>.
 *
 * - Server render and hydration: the script is part of the HTML, runs while the page is parsed and sets
 *   data-theme before first paint (no flash). During hydration React uses the server snapshot, so the
 *   markup matches; afterwards the element is dropped, which is harmless because it already ran.
 * - Rendered only in the browser (Next.js 16 does this for notFound() pages): React never executes a
 *   script it creates itself and warns about it, so none is created. The layout effect applies the
 *   saved theme instead.
 */
export function ThemeScript() {
  const isServerRender = useSyncExternalStore(
    subscribe,
    () => false,
    () => true,
  );

  useLayoutEffect(applyStoredTheme, []);

  return isServerRender ? <script dangerouslySetInnerHTML={{ __html: themeInitScript }} /> : null;
}
