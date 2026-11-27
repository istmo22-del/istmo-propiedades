import type { PostStatus, PropertyStatus } from "@/lib/types";

export const SITE_NAME = "Istmo Realty";

/** Cantidad de propiedades por página en el buscador. */
export const PAGE_SIZE = 9;

/** Máximo de imágenes por propiedad. */
export const MAX_IMAGES = 10;

/** Tamaño máximo por imagen ya optimizada (5 MB, igual que el límite del bucket). */
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

/** Tamaño máximo del archivo original antes de optimizarlo en el navegador. */
export const MAX_SOURCE_IMAGE_BYTES = 20 * 1024 * 1024;

/**
 * Límite real por petición en Vercel (4,5 MB en funciones serverless).
 * Cada foto se sube sola, así que basta con que una no lo supere.
 */
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export const POST_STATUS_META: Record<
  PostStatus,
  { label: string; description: string; className: string }
> = {
  published: {
    label: "Publicado",
    description: "Visible en el blog público.",
    className: "bg-emerald-50 text-emerald-800 ring-emerald-600/20",
  },
  draft: {
    label: "Borrador",
    description: "Solo visible para ti.",
    className: "bg-amber-50 text-amber-800 ring-amber-600/20",
  },
};

export const STATUS_META: Record<
  PropertyStatus,
  { label: string; description: string; className: string }
> = {
  published: {
    label: "Publicada",
    description: "Visible en el sitio público.",
    className: "bg-emerald-50 text-emerald-800 ring-emerald-600/20",
  },
  draft: {
    label: "Borrador",
    description: "Solo visible para ti.",
    className: "bg-amber-50 text-amber-800 ring-amber-600/20",
  },
  sold: {
    label: "Vendida",
    description: "Cerrada. No aparece como disponible.",
    className: "bg-slate-100 text-slate-700 ring-slate-500/20",
  },
  rented: {
    label: "Alquilada",
    description: "Cerrada. No aparece como disponible.",
    className: "bg-slate-100 text-slate-700 ring-slate-500/20",
  },
};

export const SORT_LABELS: Record<string, string> = {
  recent: "Más recientes",
  price_asc: "Precio: menor a mayor",
  price_desc: "Precio: mayor a menor",
  area_desc: "Área: mayor a menor",
};

export const AMENITY_GROUPS: { label: string; items: string[] }[] = [
  {
    label: "Áreas sociales y recreación",
    items: [
      "Piscina",
      "Gimnasio",
      "Área social",
      "Salón de eventos",
      "Terraza",
      "Balcón",
      "Jardín",
      "Patio",
      "Parrillera",
      "Jacuzzi",
      "Cancha de tenis",
      "Cancha de pádel",
      "Área de juegos infantiles",
    ],
  },
  {
    label: "Interior y servicios",
    items: [
      "Aire acondicionado",
      "Aire acondicionado central",
      "Cocina equipada",
      "Closets empotrados",
      "Cuarto de servicio",
      "Home office",
      "Lavandería",
      "Chimenea",
      "Amueblado",
      "Sistema de seguridad",
      "Panel solar",
      "Planta eléctrica",
      "Pozo de agua",
      "Agua potable",
      "Sistema de riego",
    ],
  },
  {
    label: "Exterior y entorno",
    items: [
      "Vista al mar",
      "Vista a la montaña",
      "Acceso a playa",
      "Muelle",
      "Cerca perimetral",
      "Portón automático",
      "Área verde",
      "Bodega",
      "Depósito",
      "Vitrina",
      "Acceso por camino",
      "Senderos",
    ],
  },
  {
    label: "Comercial",
    items: [
      "Recepción",
      "Oficina privada",
      "Sala de reuniones",
      "Carga y descarga",
      "Estacionamiento de visitantes",
      "Seguridad 24/7",
      "Cableado estructurado",
    ],
  },
];

export const ALL_AMENITIES = AMENITY_GROUPS.flatMap((group) => group.items);

export const BEDROOM_OPTIONS = [1, 2, 3, 4, 5] as const;
export const BATHROOM_OPTIONS = [1, 2, 3, 4] as const;
