import type { Locale } from "@/i18n/routing";
import type { ArticleBlock } from "@/types/content";

// Persian is read a little slower than English on screen; both are rough, commonly used averages.
const wordsPerMinute: Record<Locale, number> = { en: 220, fa: 180 };

export function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/** Whole minutes, never below one. */
export function estimateReadingMinutes(blocks: readonly ArticleBlock[], locale: Locale) {
  const words = blocks.reduce((total, block) => total + countWords(block.text), 0);
  return Math.max(1, Math.ceil(words / wordsPerMinute[locale]));
}
