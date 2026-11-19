// Tipos de dominio compartidos por cliente y servidor.

export const TRANSACTION_TYPES = ["Venta", "Alquiler"] as const;
export type TransactionType = (typeof TRANSACTION_TYPES)[number];

export const PROPERTY_CATEGORIES = [
  "Apartamentos",
  "Casas",
  "Lotes y Terrenos",
  "Locales comerciales y bodegas",
  "Oficinas",
  "Fincas",
  "Propiedades de playa",
  "Edificios",
  "Negocios",
  "Estacionamientos y otros",
  "Propiedades de isla",
] as const;
export type PropertyCategory = (typeof PROPERTY_CATEGORIES)[number];

export const PROPERTY_STATUSES = ["draft", "published", "sold", "rented"] as const;
export type PropertyStatus = (typeof PROPERTY_STATUSES)[number];

export const SORT_OPTIONS = ["recent", "price_asc", "price_desc", "area_desc"] as const;
export type SortOption = (typeof SORT_OPTIONS)[number];

export type Property = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  currency: string;
  province: string;
  district: string;
  neighborhood: string | null;
  transaction_type: TransactionType;
  property_type: PropertyCategory;
  bedrooms: number | null;
  bathrooms: number | null;
  parking_spots: number | null;
  area_m2: number | null;
  amenities: string[];
  is_furnished: boolean;
  images: string[];
  latitude: number | null;
  longitude: number | null;
  slug: string | null;
  status: PropertyStatus;
  is_featured: boolean;
  seller_id: string | null;
  created_at: string;
  updated_at: string;
};

export type PropertyInsert = Omit<Property, "id" | "created_at" | "updated_at"> & {
  id?: string;
};

export type PropertyUpdate = Partial<Property>;

export type PropertyFilters = {
  q?: string;
  transaction?: TransactionType;
  types: PropertyCategory[];
  province?: string;
  district?: string;
  neighborhood?: string;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  minBathrooms?: number;
  minParking?: number;
  minArea?: number;
  maxArea?: number;
  amenities: string[];
  furnished?: boolean;
  sort: SortOption;
  page: number;
};

export type AdminFilters = {
  q?: string;
  status?: PropertyStatus;
};

/** Estado que devuelven las server actions a `useActionState`. */
export type ActionState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  success?: string;
} | null;

// ---------------------------------------------------------------------------
// Blog
// ---------------------------------------------------------------------------

export const POST_STATUSES = ["draft", "published"] as const;
export type PostStatus = (typeof POST_STATUSES)[number];

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  status: PostStatus;
  published_at: string | null;
  author_id: string | null;
  created_at: string;
  updated_at: string;
};

export type PostInsert = Omit<Post, "id" | "created_at" | "updated_at"> & {
  id?: string;
};

export type PostUpdate = Partial<Post>;

export type PostFilters = {
  status?: PostStatus;
};
