import Image from "next/image";
import { ArchitecturalArt } from "@/components/shared/architectural-art";
import { cn } from "@/lib/cn";
import type { ProjectImageData } from "@/types/content";

type ProjectImageProps = {
  image: ProjectImageData;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
};

/** Fills its (relatively positioned, fixed-ratio) parent with a photo or the placeholder artwork. */
export function ProjectImage({
  image,
  alt,
  sizes = "100vw",
  priority,
  className,
}: ProjectImageProps) {
  if (image.src) {
    return (
      <Image
        src={image.src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn("object-cover", className)}
      />
    );
  }

  return (
    <ArchitecturalArt
      variant={image.art}
      tone={image.tone}
      label={alt}
      className={cn("absolute inset-0 h-full w-full", className)}
    />
  );
}
