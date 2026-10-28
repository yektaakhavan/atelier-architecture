"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useLocale } from "next-intl";
import { useEffect, useRef } from "react";
import { getDirection } from "@/features/localization/locales";
import { useScrollLock } from "@/hooks/use-scroll-lock";

export type LightboxSlide = { id: string; content: React.ReactNode; caption: string };

type LightboxProps = {
  slides: readonly LightboxSlide[];
  index: number;
  open: boolean;
  onIndexChange: (index: number) => void;
  onClose: () => void;
  labels: { dialog: string; close: string; previous: string; next: string };
  counterLabel: (current: number, total: number) => string;
};

// The viewer stays dark in both themes, like a gallery wall; colours are fixed on purpose.
const buttonClass =
  "inline-flex size-12 items-center justify-center border border-white/30 text-[#f0efe8] transition-colors hover:bg-white/10 focus-visible:outline-[#d9926f]";

export function Lightbox({
  slides,
  index,
  open,
  onIndexChange,
  onClose,
  labels,
  counterLabel,
}: LightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const direction = getDirection(useLocale());
  const total = slides.length;
  const slide = slides[index];

  // Native <dialog> gives focus trapping, Escape and focus return to the thumbnail that opened it.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useScrollLock(open);

  const go = (delta: number) => onIndexChange((index + delta + total) % total);
  // In right-to-left pages "next" is on the left, so the arrow keys swap meaning.
  const keyStep = direction === "rtl" ? -1 : 1;

  const closeOnBackdrop = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      aria-label={labels.dialog}
      // Only user-initiated closes (Escape) reach the parent; closing from `open` already told it.
      onClose={() => {
        if (open) onClose();
      }}
      onClick={closeOnBackdrop}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") go(keyStep);
        if (event.key === "ArrowLeft") go(-keyStep);
      }}
      className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none bg-[#171916] p-0 text-[#f0efe8] backdrop:bg-black open:flex"
    >
      {slide ? (
        <div onClick={closeOnBackdrop} className="flex h-full w-full flex-col gap-4 p-4 sm:p-8">
          <div className="flex items-center justify-between">
            <p aria-live="polite" className="text-sm text-[#f0efe8]/80">
              {counterLabel(index + 1, total)}
            </p>
            <button
              type="button"
              aria-label={labels.close}
              onClick={onClose}
              className={buttonClass}
            >
              <X aria-hidden className="size-5" />
            </button>
          </div>

          <div
            onClick={closeOnBackdrop}
            className="flex min-h-0 flex-1 items-center justify-center"
          >
            <figure className="flex w-full max-w-5xl flex-col gap-3">
              <div className="relative aspect-[4/3] max-h-[70dvh] w-full overflow-hidden">
                {slide.content}
              </div>
              <figcaption className="text-sm text-[#f0efe8]/80">{slide.caption}</figcaption>
            </figure>
          </div>

          {total > 1 ? (
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                aria-label={labels.previous}
                onClick={() => go(-1)}
                className={buttonClass}
              >
                <ChevronLeft aria-hidden className="size-5 rtl:-scale-x-100" />
              </button>
              <button
                type="button"
                aria-label={labels.next}
                onClick={() => go(1)}
                className={buttonClass}
              >
                <ChevronRight aria-hidden className="size-5 rtl:-scale-x-100" />
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </dialog>
  );
}
