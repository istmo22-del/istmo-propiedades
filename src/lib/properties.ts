import { cache } from "react";

import { PAGE_SIZE } from "@/lib/constants";
import { DEMO_PROPERTIES } from "@/lib/demo-data";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type {
  AdminFilters,
  Property,
  PropertyCategory,
  PropertyFilters,
} from "@/lib/types";

const DEMO_MODE = !isSupabaseConfigured();

function assertNoError(error: { message: string } | null, context: string): void {
  if (error) {
    console.error(`[supabase] ${context}:`, error.message);
    throw new Error(`No pudimos cargar la información (${context}). Intenta de nuevo.`);
  }
}

/** Limpia el término para no romper la sintaxis de filtros de PostgREST. */
function safeTerm(value: string | undefined): string {
  if (!value) return "";
  return value
    .replace(/[%_,()."\\*']/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 60);
}

function sortProperties(items: Property[], sort: PropertyFilters["sort"]): Property[] {
  const sorted = [...items];
  switch (sort) {
    case "price_asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price_desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "area_desc":
      return sorted.sort((a, b) => (b.area_m2 ?? 0) - (a.area_m2 ?? 0));
    default:
      return sorted.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
  }
}

function filterDemoProperties(filters: PropertyFilters): Property[] {
  const term = filters.q?.toLocaleLowerCase("es");
  let items = DEMO_PROPERTIES.filter((property) => property.status === "published");

  if (term) {
    items = items.filter((property) =>
      [property.title, property.description, property.neighborhood, property.district, property.province]
        .filter(Boolean)
        .some((value) => value!.toLocaleLowerCase("es").includes(term)),
    );
  }
  if (filters.transaction) {
    items = items.filter((property) => property.transaction_type === filters.transaction);
  }
  if (filters.types.length > 0) {
    items = items.filter((property) => filters.types.includes(property.property_type));
  }
  if (filters.province) items = items.filter((property) => property.province === filters.province);
  if (filters.district) items = items.filter((property) => property.district === filters.district);
  if (filters.neighborhood) {
    const neighborhood = filters.neighborhood.toLocaleLowerCase("es");
    items = items.filter((property) =>
      property.neighborhood?.toLocaleLowerCase("es").includes(neighborhood),
    );
  }
  if (filters.minPrice != null) items = items.filter((property) => property.price >= filters.minPrice!);
  if (filters.maxPrice != null) items = items.filter((property) => property.price <= filters.maxPrice!);
  if (filters.minBedrooms != null) {
    items = items.filter((property) => (property.bedrooms ?? 0) >= filters.minBedrooms!);
  }
  if (filters.minBathrooms != null) {
    items = items.filter((property) => (property.bathrooms ?? 0) >= filters.minBathrooms!);
  }
  if (filters.minParking != null) {
    items = items.filter((property) => (property.parking_spots ?? 0) >= filters.minParking!);
  }
  if (filters.minArea != null) items = items.filter((property) => (property.area_m2 ?? 0) >= filters.minArea!);
  if (filters.maxArea != null) {
    items = items.filter((property) => property.area_m2 != null && property.area_m2 <= filters.maxArea!);
  }
  if (filters.amenities.length > 0) {
    items = items.filter((property) =>
      filters.amenities.every((amenity) => property.amenities.includes(amenity)),
    );
  }
  if (filters.furnished) items = items.filter((property) => property.is_furnished);

  return sortProperties(items, filters.sort);
}

export type PropertyPage = {
  items: Property[];
  total: number;
  page: number;
  pageCount: number;
};

/** Propiedades publicadas con filtros + paginación. */
export async function getPublishedProperties(filters: PropertyFilters): Promise<PropertyPage> {
  if (DEMO_MODE) {
    const filtered = filterDemoProperties(filters);
    const from = (filters.page - 1) * PAGE_SIZE;
    return {
      items: filtered.slice(from, from + PAGE_SIZE),
      total: filtered.length,
      page: filters.page,
      pageCount: Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)),
    };
  }

  const supabase = await createClient();
  let query = supabase
    .from("properties")
    .select("*", { count: "exact" })
    .eq("status", "published");

  if (filters.transaction) query = query.eq("transaction_type", filters.transaction);
  if (filters.types.length > 0) query = query.in("property_type", filters.types);
  if (filters.province) query = query.eq("province", filters.province);
  if (filters.district) query = query.eq("district", filters.district);
  if (filters.neighborhood) query = query.ilike("neighborhood", `%${filters.neighborhood}%`);
  if (filters.minPrice != null) query = query.gte("price", filters.minPrice);
  if (filters.maxPrice != null) query = query.lte("price", filters.maxPrice);
  if (filters.minBedrooms != null) query = query.gte("bedrooms", filters.minBedrooms);
  if (filters.minBathrooms != null) query = query.gte("bathrooms", filters.minBathrooms);
  if (filters.minParking != null) query = query.gte("parking_spots", filters.minParking);
  if (filters.minArea != null) query = query.gte("area_m2", filters.minArea);
  if (filters.maxArea != null) query = query.lte("area_m2", filters.maxArea);
  if (filters.amenities.length > 0) query = query.contains("amenities", filters.amenities);
  if (filters.furnished) query = query.eq("is_furnished", true);

  const term = safeTerm(filters.q);
  if (term) {
    query = query.or(
      [
        `title.ilike.%${term}%`,
        `description.ilike.%${term}%`,
        `neighborhood.ilike.%${term}%`,
        `district.ilike.%${term}%`,
        `province.ilike.%${term}%`,
      ].join(","),
    );
  }

  switch (filters.sort) {
    case "price_asc":
      query = query.order("price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price", { ascending: false });
      break;
    case "area_desc":
      query = query.order("area_m2", { ascending: false, nullsFirst: false });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  const from = (filters.page - 1) * PAGE_SIZE;
  const { data, error, count } = await query.range(from, from + PAGE_SIZE - 1);
  assertNoError(error, "propiedades");

  const total = count ?? data?.length ?? 0;
  return {
    items: data ?? [],
    total,
    page: filters.page,
    pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}

export type HomeData = {
  total: number;
  featured: Property[];
  latest: Property[];
  categories: { name: PropertyCategory; count: number }[];
  provinces: { name: string; count: number }[];
};

function buildHomeData(items: Property[]): HomeData {
  const featured = items.filter((property) => property.is_featured).slice(0, 3);
  const latest = items.slice(0, 6);

  const categoryMap = new Map<PropertyCategory, number>();
  const provinceMap = new Map<string, number>();
  for (const property of items) {
    categoryMap.set(property.property_type, (categoryMap.get(property.property_type) ?? 0) + 1);
    provinceMap.set(property.province, (provinceMap.get(property.province) ?? 0) + 1);
  }

  return {
    total: items.length,
    featured: featured.length > 0 ? featured : latest.slice(0, 3),
    latest,
    categories: [...categoryMap.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count),
    provinces: [...provinceMap.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count),
  };
}

/** Datos de la portada (una sola consulta). */
export async function getHomeData(): Promise<HomeData> {
  if (DEMO_MODE) {
    return buildHomeData(filterDemoProperties({ ...emptyFilters(), sort: "recent" }));
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(500);

  assertNoError(error, "portada");
  return buildHomeData(data ?? []);
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const getPropertyBySlug = cache(async (slug: string): Promise<Property | null> => {
  let cleanSlug = slug;
  try {
    cleanSlug = decodeURIComponent(slug).trim();
  } catch {
    cleanSlug = slug.trim();
  }
  if (!cleanSlug) return null;

  if (DEMO_MODE) {
    return (
      DEMO_PROPERTIES.find(
        (property) =>
          property.status === "published" &&
          (property.slug === cleanSlug || property.id === cleanSlug),
      ) ?? null
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("slug", cleanSlug)
    .eq("status", "published")
    .maybeSingle();

  assertNoError(error, "propiedad");
  if (data) return data;

  // Enlaces antiguos o propiedades sin slug: permite /propiedades/{id}.
  if (!UUID_PATTERN.test(cleanSlug)) return null;

  const byId = await supabase
    .from("properties")
    .select("*")
    .eq("id", cleanSlug)
    .eq("status", "published")
    .maybeSingle();

  assertNoError(byId.error, "propiedad");
  return byId.data ?? null;
});

export async function getSimilarProperties(property: Property, limit = 3): Promise<Property[]> {
  if (DEMO_MODE) {
    return DEMO_PROPERTIES.filter(
      (item) =>
        item.id !== property.id &&
        item.status === "published" &&
        (item.province === property.province || item.property_type === property.property_type),
    ).slice(0, limit);
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("status", "published")
    .eq("province", property.province)
    .neq("id", property.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  assertNoError(error, "propiedades similares");
  if ((data?.length ?? 0) >= limit) return data ?? [];

  const excludeIds = [property.id, ...(data ?? []).map((item) => item.id)];
  const fallback = await supabase
    .from("properties")
    .select("*")
    .eq("status", "published")
    .eq("property_type", property.property_type)
    .not("id", "in", `(${excludeIds.join(",")})`)
    .order("created_at", { ascending: false })
    .limit(limit - (data?.length ?? 0));

  assertNoError(fallback.error, "propiedades similares");
  return [...(data ?? []), ...(fallback.data ?? [])];
}

export async function getAllPublishedSlugs(): Promise<{ slug: string; updated_at: string }[]> {
  if (DEMO_MODE) {
    return DEMO_PROPERTIES.filter((property) => property.status === "published" && property.slug).map(
      (property) => ({ slug: property.slug!, updated_at: property.updated_at }),
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("properties")
    .select("slug, updated_at")
    .eq("status", "published")
    .not("slug", "is", null);

  assertNoError(error, "sitemap");
  return (data ?? []).filter((item): item is { slug: string; updated_at: string } => Boolean(item.slug));
}

// ---------------------------------------------------------------------------
// Panel de administración
// ---------------------------------------------------------------------------

export async function getAdminProperties(
  userId: string,
  filters: AdminFilters = {},
): Promise<Property[]> {
  if (DEMO_MODE) {
    const term = filters.q?.toLocaleLowerCase("es");
    return DEMO_PROPERTIES.filter((property) => {
      if (filters.status && property.status !== filters.status) return false;
      if (!term) return true;
      return [property.title, property.province, property.district, property.neighborhood]
        .filter(Boolean)
        .some((value) => value!.toLocaleLowerCase("es").includes(term));
    }).sort((a, b) => +new Date(b.updated_at) - +new Date(a.updated_at));
  }

  const supabase = await createClient();
  let query = supabase.from("properties").select("*").eq("seller_id", userId);
  if (filters.status) query = query.eq("status", filters.status);

  const term = safeTerm(filters.q);
  if (term) {
    query = query.or(
      [
        `title.ilike.%${term}%`,
        `province.ilike.%${term}%`,
        `district.ilike.%${term}%`,
        `neighborhood.ilike.%${term}%`,
      ].join(","),
    );
  }

  const { data, error } = await query.order("updated_at", { ascending: false });
  assertNoError(error, "panel de propiedades");
  return data ?? [];
}

export type AdminStats = {
  total: number;
  published: number;
  draft: number;
  closed: number;
};

/** Conteos del portafolio para el resumen del panel. */
export async function getAdminStats(userId: string): Promise<AdminStats> {
  if (DEMO_MODE) {
    const total = DEMO_PROPERTIES.length;
    const published = DEMO_PROPERTIES.filter((property) => property.status === "published").length;
    const draft = DEMO_PROPERTIES.filter((property) => property.status === "draft").length;
    return { total, published, draft, closed: Math.max(0, total - published - draft) };
  }

  const supabase = await createClient();
  const [totalQuery, publishedQuery, draftQuery] = await Promise.all([
    supabase
      .from("properties")
      .select("*", { count: "exact", head: true })
      .eq("seller_id", userId),
    supabase
      .from("properties")
      .select("*", { count: "exact", head: true })
      .eq("seller_id", userId)
      .eq("status", "published"),
    supabase
      .from("properties")
      .select("*", { count: "exact", head: true })
      .eq("seller_id", userId)
      .eq("status", "draft"),
  ]);

  assertNoError(totalQuery.error ?? publishedQuery.error ?? draftQuery.error, "resumen del panel");

  const total = totalQuery.count ?? 0;
  const published = publishedQuery.count ?? 0;
  const draft = draftQuery.count ?? 0;
  return { total, published, draft, closed: Math.max(0, total - published - draft) };
}

export async function getPropertyForEdit(userId: string, id: string): Promise<Property | null> {
  if (DEMO_MODE) {
    return DEMO_PROPERTIES.find((property) => property.id === id) ?? null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .eq("seller_id", userId)
    .maybeSingle();

  assertNoError(error, "editar propiedad");
  return data ?? null;
}

function emptyFilters(): PropertyFilters {
  return {
    types: [],
    amenities: [],
    sort: "recent",
    page: 1,
  };
}
