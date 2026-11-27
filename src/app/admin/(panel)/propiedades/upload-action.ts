"use server";

import { getCurrentUser } from "@/lib/auth";
import { MAX_SOURCE_IMAGE_BYTES } from "@/lib/constants";
import { IMAGE_BUCKET } from "@/lib/images";
import { normalizeImage } from "@/lib/normalize-image";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export type UploadImageResult = { path: string } | { error: string };

/**
 * Sube UNA foto de propiedad y devuelve su ruta dentro del bucket.
 *
 * Se llama desde el gestor de imágenes apenas se elige el archivo, así cada
 * petición pesa poco (nunca se acerca al límite de Vercel) y un fallo no tumba
 * el resto del lote.
 */
export async function uploadPropertyImageAction(formData: FormData): Promise<UploadImageResult> {
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

  const { error } = await supabase.storage.from(IMAGE_BUCKET).upload(path, normalized.data, {
    contentType: normalized.contentType,
    cacheControl: "31536000",
    upsert: false,
  });

  if (error) {
    console.error("[upload] propiedad:", error.message);
    return { error: `No pudimos subir “${file.name}”. Intenta de nuevo.` };
  }

  return { path };
}

/** Borra una foto recién subida que el usuario quitó antes de guardar. */
export async function deletePropertyImageAction(path: string): Promise<{ ok: boolean }> {
  if (!isSupabaseConfigured()) return { ok: false };

  const user = await getCurrentUser();
  if (!user) return { ok: false };

  if (!path.startsWith(`${user.id}/`)) return { ok: false };

  const supabase = await createClient();
  const { error } = await supabase.storage.from(IMAGE_BUCKET).remove([path]);
  if (error) console.error("[upload] borrar:", error.message);

  return { ok: !error };
}
