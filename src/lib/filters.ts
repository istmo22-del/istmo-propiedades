import { ALL_AMENITIES } from "@/lib/constants";
import {
  PROPERTY_CATEGORIES,
  SORT_OPTIONS,
  TRANSACTION_TYPES,
  type PropertyCategory,
  type PropertyFilters,
  type SortOption,
  type TransactionType,
} from "@/lib/types";

export type RawSearchParams = Record<string, string | string[] | undefined>;

const first = (value: string | string[] | undefined): string | undefined =>
  Array.isArray(value) ? value[0] : value;

const list = (value: string | string[] | undefined): string[] =>
  Array.isArray(value) ? value : value ? [value] : [];

function toNumber(value: string | string[] | undefined): number | undefined {
  const raw = first(value);
  if (raw == null || raw.trim() === "") return undefined;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

function toInteger(value: string | string[] | undefined): number | undefined {
  const parsed = toNumber(value);
  if (parsed == null) return undefined;
  return Math.floor(parsed);
}

function isTransaction(value: string): value is TransactionType {
  return (TRANSACTION_TYPES as readonly string[]).includes(value);
}

function isCategory(value: string): value is PropertyCategory {
  return (PROPERTY_CATEGORIES as readonly string[]).includes(value);
}

function isSort(value: string): value is SortOption {
  return (SORT_OPTIONS as readonly string[]).includes(value);
}

/** Normaliza y valida los parámetros de la URL del buscador. */
export function parseFilters(params: RawSearchParams): PropertyFilters {
  const q = first(params.q)?.trim().slice(0, 80) || undefined;
  const transactionRaw = first(params.transaction);
  const sortRaw = first(params.sort);
  const province = first(params.province)?.trim().slice(0, 80) || undefined;
  const district = first(params.district)?.trim().slice(0, 80) || undefined;
  const neighborhood = first(params.neighborhood)?.trim().slice(0, 100) || undefined;

  const types = Array.from(new Set(list(params.type).filter(isCategory)));
  const amenities = Array.from(new Set(list(params.amenity).filter((item) => ALL_AMENITIES.includes(item)))).slice(
    0,
    20,
  );

  const furnishedRaw = first(params.furnished);
  const page = Math.min(Math.max(toInteger(params.page) ?? 1, 1), 10_000);

  return {
    q,
    transaction: transactionRaw && isTransaction(transactionRaw) ? transactionRaw : undefined,
    types,
    province,
    district,
    neighborhood,
    minPrice: toNumber(params.min_price),
    maxPrice: toNumber(params.max_price),
    minBedrooms: toInteger(params.bedrooms),
    minBathrooms: toInteger(params.bathrooms),
    minParking: toInteger(params.parking),
    minArea: toNumber(params.min_area),
    maxArea: toNumber(params.max_area),
    amenities,
    furnished: furnishedRaw === "1" || furnishedRaw === "true" ? true : undefined,
    sort: sortRaw && isSort(sortRaw) ? sortRaw : "recent",
    page,
  };
}

/** Serializa filtros a query string (omite valores por defecto). */
export function filtersToQueryString(
  filters: PropertyFilters,
  overrides: Partial<PropertyFilters> = {},
): string {
  const merged: PropertyFilters = { ...filters, ...overrides };
  const params = new URLSearchParams();

  if (merged.q) params.set("q", merged.q);
  if (merged.transaction) params.set("transaction", merged.transaction);
  merged.types.forEach((type) => params.append("type", type));
  if (merged.province) params.set("province", merged.province);
  if (merged.district) params.set("district", merged.district);
  if (merged.neighborhood) params.set("neighborhood", merged.neighborhood);
  if (merged.minPrice != null) params.set("min_price", String(merged.minPrice));
  if (merged.maxPrice != null) params.set("max_price", String(merged.maxPrice));
  if (merged.minBedrooms != null) params.set("bedrooms", String(merged.minBedrooms));
  if (merged.minBathrooms != null) params.set("bathrooms", String(merged.minBathrooms));
  if (merged.minParking != null) params.set("parking", String(merged.minParking));
  if (merged.minArea != null) params.set("min_area", String(merged.minArea));
  if (merged.maxArea != null) params.set("max_area", String(merged.maxArea));
  merged.amenities.forEach((amenity) => params.append("amenity", amenity));
  if (merged.furnished) params.set("furnished", "1");
  if (merged.sort !== "recent") params.set("sort", merged.sort);
  if (merged.page > 1) params.set("page", String(merged.page));

  return params.toString();
}

export function countActiveFilters(filters: PropertyFilters): number {
  let count = 0;
  if (filters.q) count += 1;
  if (filters.transaction) count += 1;
  count += filters.types.length;
  if (filters.province) count += 1;
  if (filters.district) count += 1;
  if (filters.neighborhood) count += 1;
  if (filters.minPrice != null || filters.maxPrice != null) count += 1;
  if (filters.minBedrooms != null) count += 1;
  if (filters.minBathrooms != null) count += 1;
  if (filters.minParking != null) count += 1;
  if (filters.minArea != null || filters.maxArea != null) count += 1;
  count += filters.amenities.length;
  if (filters.furnished) count += 1;
  return count;
}
