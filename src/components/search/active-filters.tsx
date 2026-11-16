import Link from "next/link";
import { X } from "lucide-react";

import { filtersToQueryString } from "@/lib/filters";
import type { PropertyFilters } from "@/lib/types";
import { formatArea, formatPrice } from "@/lib/utils";

type Chip = {
  id: string;
  label: string;
  overrides: Partial<PropertyFilters>;
};

export function ActiveFilters({ filters }: { filters: PropertyFilters }) {
  const chips: Chip[] = [];

  if (filters.q) chips.push({ id: "q", label: `“${filters.q}”`, overrides: { q: undefined } });
  if (filters.transaction) {
    chips.push({
      id: "transaction",
      label: filters.transaction,
      overrides: { transaction: undefined },
    });
  }
  filters.types.forEach((type) => {
    chips.push({
      id: `type-${type}`,
      label: type,
      overrides: { types: filters.types.filter((item) => item !== type) },
    });
  });
  if (filters.province) {
    chips.push({
      id: "province",
      label: filters.province,
      overrides: { province: undefined, district: undefined },
    });
  }
  if (filters.district) {
    chips.push({ id: "district", label: filters.district, overrides: { district: undefined } });
  }
  if (filters.neighborhood) {
    chips.push({
      id: "neighborhood",
      label: filters.neighborhood,
      overrides: { neighborhood: undefined },
    });
  }
  if (filters.minPrice != null || filters.maxPrice != null) {
    const label =
      filters.minPrice != null && filters.maxPrice != null
        ? `${formatPrice(filters.minPrice)} – ${formatPrice(filters.maxPrice)}`
        : filters.minPrice != null
          ? `Desde ${formatPrice(filters.minPrice)}`
          : `Hasta ${formatPrice(filters.maxPrice!)}`;
    chips.push({ id: "price", label, overrides: { minPrice: undefined, maxPrice: undefined } });
  }
  if (filters.minBedrooms != null) {
    chips.push({
      id: "bedrooms",
      label: `${filters.minBedrooms}+ hab.`,
      overrides: { minBedrooms: undefined },
    });
  }
  if (filters.minBathrooms != null) {
    chips.push({
      id: "bathrooms",
      label: `${filters.minBathrooms}+ baños`,
      overrides: { minBathrooms: undefined },
    });
  }
  if (filters.minParking != null) {
    chips.push({
      id: "parking",
      label: `${filters.minParking}+ parqueos`,
      overrides: { minParking: undefined },
    });
  }
  if (filters.minArea != null || filters.maxArea != null) {
    const label = `${filters.minArea != null ? formatArea(filters.minArea) : "0 m²"} – ${
      filters.maxArea != null ? formatArea(filters.maxArea) : "sin límite"
    }`;
    chips.push({ id: "area", label, overrides: { minArea: undefined, maxArea: undefined } });
  }
  filters.amenities.forEach((amenity) => {
    chips.push({
      id: `amenity-${amenity}`,
      label: amenity,
      overrides: { amenities: filters.amenities.filter((item) => item !== amenity) },
    });
  });
  if (filters.furnished) {
    chips.push({ id: "furnished", label: "Amueblada", overrides: { furnished: undefined } });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => {
        const query = filtersToQueryString(filters, { ...chip.overrides, page: 1 });
        return (
          <Link
            key={chip.id}
            href={`/propiedades${query ? `?${query}` : ""}`}
            className="group inline-flex items-center gap-1.5 rounded-full border border-line bg-white py-1.5 pr-2 pl-3 text-[12px] font-medium text-ink/75 transition-colors hover:border-ink/25 hover:text-ink"
          >
            {chip.label}
            <span className="grid size-4 place-items-center rounded-full bg-ink/[0.05] text-muted transition-colors group-hover:bg-ink/10 group-hover:text-ink">
              <X className="size-2.5" aria-hidden="true" />
            </span>
            <span className="sr-only">Quitar filtro</span>
          </Link>
        );
      })}
      <Link
        href="/propiedades"
        className="ml-1 text-[12px] font-semibold text-teal underline-offset-4 hover:underline"
      >
        Limpiar todo
      </Link>
    </div>
  );
}
