"use server";

import { getCurrentUser } from "@/lib/auth";
import { MAX_SOURCE_IMAGE_BYTES } from "@/lib/constants";
import { normalizeImage } from "@/lib/normalize-image";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

const BLOG_BUCKET = "blog-images";

export type UploadCoverResult = { url: string } | { error: string };

/**
 * Sube la portada de un artículo apenas se elige, y devuelve su URL pública.
 * El formulario solo guarda la URL, así no envía archivos al guardar.
 */
export async function uploadBlogCoverAction(formData: FormData): Promise<UploadCoverResult> {
  if (!isSupabaseConfigured()) {
    return { error: "Modo demostración: no se pueden subir imágenes." };
  }

  const user = await getCurrentUser();
  if (!user) return { error: "Tu sesión expiró. Vuelve a iniciar sesión." };

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "No recibimos la imagen." };
  }

  if (file.size > MAX_SOURCE_IMAGE_BYTES) {
    return { error: `“${file.name}” supera los 20 MB.` };
  }

  const normalized = await normalizeImage(file);
  if (!normalized) {
    return { error: `No pudimos procesar “${file.name}”. Usa JPG, PNG o WebP.` };
  }

  const supabase = await createClient();
  const path = `${user.id}/${crypto.randomUUID()}.${normalized.extension}`;

  const { error } = await supabase.storage.from(BLOG_BUCKET).upload(path, normalized.data, {
    contentType: normalized.contentType,
    cacheControl: "31536000",
    upsert: false,
  });

  if (error) {
    console.error("[upload] portada:", error.message);
    return { error: `No pudimos subir “${file.name}”. Intenta de nuevo.` };
  }

  const { data } = supabase.storage.from(BLOG_BUCKET).getPublicUrl(path);
  return { url: data.publicUrl };
}
