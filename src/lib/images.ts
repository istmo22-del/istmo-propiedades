import { SUPABASE_URL } from "@/lib/supabase/env";

export const IMAGE_BUCKET = "property-images";
export const PLACEHOLDER_IMAGE = "/placeholder.svg";

/**
 * Las imágenes pueden ser:
 *  - rutas dentro del bucket público de Supabase (`{sellerId}/{uuid}.jpg`)
 *  - URLs absolutas (https://…), útiles para el seed o para imágenes externas
 *  - rutas locales (`/placeholder.svg`)
 */
export function imageUrl(path: string | null | undefined): string {
  if (!path) return PLACEHOLDER_IMAGE;
  if (/^(https?:)?\/\//i.test(path) || path.startsWith("/")) return path;
  return `${SUPABASE_URL}/storage/v1/object/public/${IMAGE_BUCKET}/${path}`;
}

export function firstImage(images: string[] | null | undefined): string {
  return imageUrl(images?.[0]);
}
