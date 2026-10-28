import { useEffect } from "react";

/** Freezes page scrolling behind a full-screen overlay and restores it on close or unmount. */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, [locked]);
}
