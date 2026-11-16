"use client";

import { useEffect, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";

import type { PropertyFilters } from "@/lib/types";
import { FiltersForm } from "@/components/search/filters-form";

export function FiltersDrawer({
  filters,
  activeCount,
}: {
  filters: PropertyFilters;
  activeCount: number;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-ink/15 px-5 text-sm font-semibold text-ink transition-colors hover:bg-ink/[0.04] lg:hidden"
      >
        <SlidersHorizontal className="size-4" aria-hidden="true" />
        Filtros
        {activeCount > 0 && (
          <span className="grid size-5 place-items-center rounded-full bg-deep text-[10px] font-bold text-cream">
            {activeCount}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-[80] lg:hidden" role="dialog" aria-modal="true" aria-label="Filtros">
          <button
            type="button"
            aria-label="Cerrar filtros"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-ink/55 backdrop-blur-sm"
          />
          <div className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-cream shadow-2xl">
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-5">
              <div>
                <p className="font-display text-xl">Filtros</p>
                <p className="text-[11.5px] text-muted">Refina tu búsqueda</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Cerrar"
                className="grid size-10 place-items-center rounded-full bg-ink/[0.05] text-ink transition hover:bg-ink/10"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <FiltersForm filters={filters} idPrefix="drawer" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
