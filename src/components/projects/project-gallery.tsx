"use client";

import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";
import { Lightbox } from "@/components/ui/lightbox";
import { cn } from "@/lib/cn";
import type { ProjectImageData } from "@/types/content";
import { ProjectImage } from "./project-image";

type ProjectGalleryProps = { images: readonly ProjectImageData[]; title: string };

// First image spans the full width; the rest share rows evenly where the count allows.
function spanClass(restCount: number) {
  if (restCount % 3 === 0) return "md:col-span-2";
  if (restCount === 1) return "md:col-span-6";
  return "md:col-span-3";
}

export function ProjectGallery({ images, title }: ProjectGalleryProps) {
  const t = useTranslations("ProjectDetail");
  const format = useFormatter();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const total = images.length;
  const alt = (index: number) => t("imageAlt", { title, n: format.number(index + 1) });
  const slides = images.map((image, index) => ({
    id: `${index}`,
    caption: alt(index),
    content: (
      <ProjectImage image={image} alt={alt(index)} sizes="(min-width: 1024px) 64rem, 100vw" />
    ),
  }));

  return (
    <>
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-6">
        {images.map((image, index) => (
          <li
            key={index}
            className={cn(index === 0 ? "col-span-2 md:col-span-6" : spanClass(total - 1))}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(index)}
              aria-label={t("openImage", {
                n: format.number(index + 1),
                total: format.number(total),
              })}
              className="group relative block aspect-[4/3] w-full overflow-hidden bg-surface"
            >
              <ProjectImage
                image={image}
                alt={alt(index)}
                sizes="(min-width: 768px) 50vw, 100vw"
                className="transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transform-none"
              />
            </button>
          </li>
        ))}
      </ul>

      <Lightbox
        slides={slides}
        index={openIndex ?? 0}
        open={openIndex !== null}
        onIndexChange={setOpenIndex}
        onClose={() => setOpenIndex(null)}
        labels={{
          dialog: t("lightboxLabel"),
          close: t("close"),
          previous: t("previous"),
          next: t("next"),
        }}
        counterLabel={(current, count) => t("counter", { current, total: count })}
      />
    </>
  );
}
