import type {
  Property,
  PropertyCategory,
  PropertyFilters,
  SortOption,
  TransactionType,
} from "@/lib/types";

/**
 * Colecciones curadas de la portada y del buscador. No son tipos de propiedad:
 * son combinaciones de filtros con un nombre comercial.
 */
export type CollectionKey =
  | "alquileres-chiriqui"
  | "casas-venta-david"
  | "propiedades-recientes";

export type PropertyCollection = {
  key: CollectionKey;
  eyebrow: string;
  title: string;
  description: string;
  filters: {
    transaction?: TransactionType;
    types?: PropertyCategory[];
    province?: string;
    district?: string;
    sort?: SortOption;
  };
};

export const PROPERTY_COLLECTIONS: PropertyCollection[] = [
  {
    key: "alquileres-chiriqui",
    eyebrow: "Alquileres",
    title: "Alquileres en Chiriquí",
    description:
      "Casas y apartamentos amueblados en Boquete, David y Tierras Altas, listos para entrar a vivir.",
    filters: {
      transaction: "Alquiler",
      province: "Chiriquí",
    },
  },
  {
    key: "casas-venta-david",
    eyebrow: "Venta",
    title: "Casas en venta en David",
    description:
      "Opciones familiares y modernas en la capital de Chiriquí, con patio, jardín o área de ampliación.",
    filters: {
      transaction: "Venta",
      types: ["Casas"],
      province: "Chiriquí",
      district: "David",
    },
  },
  {
    key: "propiedades-recientes",
    eyebrow: "Recién llegadas",
    title: "Propiedades recientes",
    description:
      "Lo último que entró al portafolio: una vista rápida antes de que se muevan las opciones más buscadas.",
    filters: {
      sort: "recent",
    },
  },
];

/** URL del buscador con los filtros de una colección. */
export function collectionHref(collection: PropertyCollection): string {
  const params = new URLSearchParams();
  const { filters } = collection;

  if (filters.transaction) params.set("transaction", filters.transaction);
  filters.types?.forEach((type) => params.append("type", type));
  if (filters.province) params.set("province", filters.province);
  if (filters.district) params.set("district", filters.district);
  if (filters.sort && filters.sort !== "recent") params.set("sort", filters.sort);
  if (collection.key === "propiedades-recientes") params.set("sort", "recent");

  const query = params.toString();
  return query ? `/propiedades?${query}` : "/propiedades";
}

/** Comprueba si una propiedad pertenece a una colección (sin ordenar). */
export function propertyMatchesCollection(
  property: Property,
  collection: PropertyCollection,
): boolean {
  const { filters } = collection;
  if (filters.transaction && property.transaction_type !== filters.transaction) return false;
  if (filters.types && !filters.types.includes(property.property_type)) return false;
  if (filters.province && property.province !== filters.province) return false;
  if (filters.district && property.district !== filters.district) return false;
  return true;
}

function hasRefinements(filters: PropertyFilters): boolean {
  return Boolean(
    filters.q ||
      filters.transaction ||
      filters.types.length > 0 ||
      filters.province ||
      filters.district ||
      filters.neighborhood ||
      filters.minPrice != null ||
      filters.maxPrice != null ||
      filters.minBedrooms != null ||
      filters.minBathrooms != null ||
      filters.minParking != null ||
      filters.minArea != null ||
      filters.maxArea != null ||
      filters.amenities.length > 0 ||
      filters.furnished,
  );
}

function filtersMatchCollection(filters: PropertyFilters, collection: PropertyCollection): boolean {
  const target = collection.filters;
  if (target.transaction && filters.transaction !== target.transaction) return false;
  if (
    target.types &&
    (filters.types.length !== target.types.length ||
      !target.types.every((type) => filters.types.includes(type)))
  ) {
    return false;
  }
  if (target.province && filters.province !== target.province) return false;
  if (target.district && filters.district !== target.district) return false;
  return true;
}

/**
 * Devuelve la colección activa a partir de los filtros aplicados.
 * "Propiedades recientes" solo cuenta como colección si no hay más filtros.
 */
export function detectCollectionKey(filters?: PropertyFilters): CollectionKey | "" {
  if (!filters) return "";

  for (const collection of PROPERTY_COLLECTIONS) {
    if (collection.key === "propiedades-recientes") {
      if (filters.sort === "recent" && !hasRefinements(filters)) return collection.key;
      continue;
    }
    if (filtersMatchCollection(filters, collection)) return collection.key;
  }

  return "";
}
