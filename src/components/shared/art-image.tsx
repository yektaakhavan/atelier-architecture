import { preload } from "react-dom";
import { artUrl } from "@/lib/art";
import { cn } from "@/lib/cn";
import type { ArtTone, ArtVariant } from "@/types/content";

type ArtImageProps = {
  variant: ArtVariant;
  tone: ArtTone;
  /** Accessible description; omit for decorative use. */
  alt?: string;
  /** Above-the-fold artwork (the hero) loads eagerly and with high priority. */
  priority?: boolean;
  className?: string;
};

export function ArtImage({ variant, tone, alt = "", priority, className }: ArtImageProps) {
  const src = artUrl(variant, tone);
  // Starts the download from <head>, before the parser reaches the <img> itself.
  if (priority) preload(src, { as: "image", fetchPriority: "high" });

  return (
    // A plain <img>: these are small, already-optimal SVG files, so next/image has nothing to optimise.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      className={cn("block object-cover", className)}
    />
  );
}
