"use client";

import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";

import { PROPERTY_COLLECTIONS, collectionHref, detectCollectionKey } from "@/lib/collections";
import type { PropertyFilters } from "@/lib/types";
import { cn } from "@/lib/utils";

type CategorySelectProps = {
  id: string;
  filters?: PropertyFilters;
  className?: string;
  selectClassName?: string;
};

/**
 * Selector de colecciones curadas. Al cambiar, navega al buscador con los
 * filtros de esa colección ya aplicados. En el formulario lateral funciona
 * como un acceso rápido y reinicia los filtros anteriores.
 */
export function CategorySelect({
  id,
  filters,
  className,
  selectClassName,
}: CategorySelectProps) {
  const router = useRouter();
  const value = detectCollectionKey(filters);

  return (
    <div className={cn("relative", className)}>
      <label htmlFor={id} className="sr-only">
        Categoría
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => {
          const key = event.target.value;
          if (!key) {
            router.push("/propiedades");
            return;
          }
          const collection = PROPERTY_COLLECTIONS.find((item) => item.key === key);
          if (collection) router.push(collectionHref(collection));
        }}
        className={cn(
          "w-full appearance-none rounded-xl border border-line bg-white px-3.5 pr-9 text-sm font-medium text-ink outline-none transition focus:border-teal focus:ring-4 focus:ring-teal/10",
          selectClassName ?? "h-11",
        )}
      >
        <option value="">Todas las categorías</option>
        {PROPERTY_COLLECTIONS.map((collection) => (
          <option key={collection.key} value={collection.key}>
            {collection.title}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted"
        aria-hidden="true"
      />
    </div>
  );
}
