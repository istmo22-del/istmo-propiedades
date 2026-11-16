"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";

import { imageUrl } from "@/lib/images";
import { cn } from "@/lib/utils";

export function PropertyGallery({ images, title }: { images: string[]; title: string }) {
  const photos = images.length > 0 ? images : [""];
  const [index, setIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const isOpen = index !== null;

  const close = useCallback(() => setIndex(null), []);

  const move = useCallback(
    (delta: number) => {
      setIndex((current) => {
        if (current === null) return current;
        return (current + delta + photos.length) % photos.length;
      });
    },
    [photos.length],
  );

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") move(1);
      if (event.key === "ArrowLeft") move(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, close, move]);

  return (
    <>
      <div
        className={cn(
          "grid gap-2",
          photos.length > 1 && "sm:grid-cols-[1.65fr_1fr]",
        )}
      >
        <button
          type="button"
          onClick={() => setIndex(0)}
          className="group relative aspect-[16/10] overflow-hidden rounded-2xl bg-sand sm:aspect-auto sm:h-[460px]"
          aria-label="Abrir galería de fotos"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl(photos[0])}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            fetchPriority="high"
          />
          <span className="absolute right-3.5 bottom-3.5 inline-flex items-center gap-1.5 rounded-full bg-ink/65 px-3 py-1.5 text-[11.5px] font-semibold text-cream backdrop-blur-sm">
            <Expand className="size-3.5" aria-hidden="true" />
            {photos.length} {photos.length === 1 ? "foto" : "fotos"}
          </span>
        </button>

        {photos.length > 1 && (
          <div className="hidden grid-cols-2 grid-rows-2 gap-2 sm:grid">
            {photos.slice(1, 5).map((photo, position) => (
              <button
                key={`${photo}-${position}`}
                type="button"
                onClick={() => setIndex(position + 1)}
                className="group relative overflow-hidden rounded-xl bg-sand"
                aria-label={`Ver foto ${position + 2}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl(photo)}
                  alt={`${title} — foto ${position + 2}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
                {position === 3 && photos.length > 5 && (
                  <span className="absolute inset-0 grid place-items-center bg-ink/55 font-display text-lg text-cream">
                    +{photos.length - 5}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {photos.length > 1 && (
        <button
          type="button"
          onClick={() => setIndex(0)}
          className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-full border border-line bg-white text-[12.5px] font-semibold text-ink sm:hidden"
        >
          <Expand className="size-4" aria-hidden="true" />
          Ver todas las fotos ({photos.length})
        </button>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex flex-col bg-ink/95 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Galería de fotos"
        >
          <div className="flex shrink-0 items-center justify-between px-5 py-4 text-cream">
            <span className="text-[12px] font-semibold tracking-[0.16em]">
              {index + 1} / {photos.length}
            </span>
            <button
              type="button"
              onClick={close}
              aria-label="Cerrar galería"
              className="grid size-10 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>

          <div
            className="relative flex flex-1 items-center justify-center px-3 pb-8 sm:px-16"
            onClick={(event) => {
              if (event.target === event.currentTarget) close();
            }}
            onTouchStart={(event) => {
              touchStartX.current = event.touches[0]?.clientX ?? null;
            }}
            onTouchEnd={(event) => {
              if (touchStartX.current === null) return;
              const delta = (event.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
              if (Math.abs(delta) > 50) move(delta > 0 ? -1 : 1);
              touchStartX.current = null;
            }}
          >
            {photos.length > 1 && (
              <button
                type="button"
                onClick={() => move(-1)}
                aria-label="Foto anterior"
                className="absolute left-2 z-10 grid size-11 place-items-center rounded-full bg-white/10 text-cream transition-colors hover:bg-white/20 sm:left-5"
              >
                <ChevronLeft className="size-5" aria-hidden="true" />
              </button>
            )}

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl(photos[index])}
              alt={`${title} — foto ${index + 1}`}
              className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
            />

            {photos.length > 1 && (
              <button
                type="button"
                onClick={() => move(1)}
                aria-label="Foto siguiente"
                className="absolute right-2 z-10 grid size-11 place-items-center rounded-full bg-white/10 text-cream transition-colors hover:bg-white/20 sm:right-5"
              >
                <ChevronRight className="size-5" aria-hidden="true" />
              </button>
            )}
          </div>

          {photos.length > 1 && (
            <div className="hide-scrollbar flex shrink-0 gap-2 overflow-x-auto px-5 pb-5">
              {photos.map((photo, position) => (
                <button
                  key={`${photo}-thumb-${position}`}
                  type="button"
                  onClick={() => setIndex(position)}
                  className={cn(
                    "h-14 w-20 shrink-0 overflow-hidden rounded-md ring-2 transition-opacity",
                    position === index ? "ring-gold" : "opacity-50 ring-transparent hover:opacity-90",
                  )}
                  aria-label={`Ir a la foto ${position + 1}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl(photo)}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
