import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { filtersToQueryString } from "@/lib/filters";
import type { PropertyFilters } from "@/lib/types";
import { cn } from "@/lib/utils";

function pageWindow(page: number, pageCount: number): (number | "ellipsis")[] {
  const pages = new Set<number>([1, pageCount, page - 1, page, page + 1]);
  const sorted = [...pages].filter((value) => value >= 1 && value <= pageCount).sort((a, b) => a - b);
  const result: (number | "ellipsis")[] = [];
  sorted.forEach((value, index) => {
    if (index > 0 && value - sorted[index - 1] > 1) result.push("ellipsis");
    result.push(value);
  });
  return result;
}

export function Pagination({
  page,
  pageCount,
  filters,
}: {
  page: number;
  pageCount: number;
  filters: PropertyFilters;
}) {
  if (pageCount <= 1) return null;

  const hrefFor = (target: number) =>
    `/propiedades?${filtersToQueryString(filters, { page: target })}`;

  return (
    <nav className="mt-14 flex items-center justify-between gap-4 border-t border-line pt-6" aria-label="Paginación">
      <p className="text-[12.5px] text-muted">
        Página <span className="font-semibold text-ink">{page}</span> de {pageCount}
      </p>

      <div className="hidden items-center gap-1 sm:flex">
        {page > 1 ? (
          <Link
            href={hrefFor(page - 1)}
            className="grid size-9 place-items-center rounded-full border border-line text-ink transition hover:bg-sand"
            aria-label="Página anterior"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </Link>
        ) : (
          <span className="grid size-9 place-items-center rounded-full border border-line/60 text-muted/40">
            <ChevronLeft className="size-4" aria-hidden="true" />
          </span>
        )}

        {pageWindow(page, pageCount).map((item, index) =>
          item === "ellipsis" ? (
            <span key={`ellipsis-${index}`} className="px-1.5 text-muted">
              …
            </span>
          ) : (
            <Link
              key={item}
              href={hrefFor(item)}
              aria-current={item === page ? "page" : undefined}
              className={cn(
                "grid size-9 place-items-center rounded-full text-[13px] font-semibold transition",
                item === page
                  ? "bg-deep text-cream"
                  : "text-ink/70 hover:bg-sand hover:text-ink",
              )}
            >
              {item}
            </Link>
          ),
        )}

        {page < pageCount ? (
          <Link
            href={hrefFor(page + 1)}
            className="grid size-9 place-items-center rounded-full border border-line text-ink transition hover:bg-sand"
            aria-label="Página siguiente"
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </Link>
        ) : (
          <span className="grid size-9 place-items-center rounded-full border border-line/60 text-muted/40">
            <ChevronRight className="size-4" aria-hidden="true" />
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 sm:hidden">
        {page > 1 && (
          <Link
            href={hrefFor(page - 1)}
            className="inline-flex h-9 items-center gap-1 rounded-full border border-line px-4 text-[12.5px] font-semibold"
          >
            <ChevronLeft className="size-4" aria-hidden="true" /> Anterior
          </Link>
        )}
        {page < pageCount && (
          <Link
            href={hrefFor(page + 1)}
            className="inline-flex h-9 items-center gap-1 rounded-full bg-deep px-4 text-[12.5px] font-semibold text-cream"
          >
            Siguiente <ChevronRight className="size-4" aria-hidden="true" />
          </Link>
        )}
      </div>
    </nav>
  );
}
