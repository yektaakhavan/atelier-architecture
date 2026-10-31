import { artTones, artVariants, type ArtTone, type ArtVariant } from "@/types/content";

export const artUrl = (variant: ArtVariant, tone: ArtTone) => `/art/${variant}-${tone}.svg`;

/** Every artwork file that exists: one per variant and tone. */
export const artFileNames = artVariants.flatMap((variant) =>
  artTones.map((tone) => `${variant}-${tone}.svg`),
);

export function parseArtFileName(file: string): { variant: ArtVariant; tone: ArtTone } | null {
  const match = /^([a-z]+)-([a-z]+)\.svg$/.exec(file);
  const variant = artVariants.find((v) => v === match?.[1]);
  const tone = artTones.find((t) => t === match?.[2]);
  return variant && tone ? { variant, tone } : null;
}
