"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import type { Database } from "@/lib/database.types";
import { getCurrentUser } from "@/lib/auth";
import { MAX_IMAGES } from "@/lib/constants";
import { IMAGE_BUCKET } from "@/lib/images";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type { ActionState, PropertyInsert, PropertyUpdate } from "@/lib/types";
import { slugify } from "@/lib/utils";
import { parseExistingImages, parsePropertyForm } from "@/lib/validation";

type Supabase = Awaited<ReturnType<typeof createClient>>;

function isHttpUrl(value: string): boolean {
  return /^https?:\/\//i.test(value);
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

async function uniqueSlug(supabase: Supabase, base: string, currentId?: string): Promise<string> {
  const clean = base || "propiedad";
  let candidate = clean;

  for (let attempt = 0; attempt < 4; attempt += 1) {
    const { data } = await supabase
      .from("properties")
      .select("id")
      .eq("slug", candidate)
      .maybeSingle();

    if (!data || data.id === currentId) return candidate;
    candidate = `${clean}-${Math.random().toString(36).slice(2, 6)}`;
  }

  return `${clean}-${Date.now().toString(36).slice(-5)}`;
}

async function removeStorageObjects(supabase: Supabase, paths: string[], userId: string) {
  const owned = paths.filter((path) => path.startsWith(`${userId}/`));
  if (owned.length > 0) {
    await supabase.storage.from(IMAGE_BUCKET).remove(owned);
  }
}

export async function savePropertyAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!isSupabaseConfigured()) {
    return {
      error:
        "Modo demostración: los cambios no se guardan. Configura Supabase y ejecuta supabase/schema.sql para activar el panel real.",
    };
  }

  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const idRaw = String(formData.get("id") ?? "").trim();
  const id = idRaw && isUuid(idRaw) ? idRaw : null;

  const parsed = parsePropertyForm(formData);
  if (!parsed.success) {
    const flat = z.flattenError(parsed.error);
    return {
      error: "Revisa los campos marcados antes de guardar.",
      fieldErrors: flat.fieldErrors as Record<string, string[]>,
    };
  }

  const fields = parsed.data;
  const supabase = await createClient();

  // En edición verificamos propiedad y pertenencia antes de tocar Storage.
  let currentImages: string[] = [];
  let currentSlug: string | null = null;

  if (id) {
    const { data: current, error: currentError } = await supabase
      .from("properties")
      .select("id, slug, images")
      .eq("id", id)
      .eq("seller_id", user.id)
      .maybeSingle();

    if (currentError || !current) {
      return { error: "No encontramos esa propiedad o no tienes permiso para editarla." };
    }

    currentImages = current.images ?? [];
    currentSlug = current.slug;
  }

  // Las fotos se suben al instante desde el gestor de imágenes, así que aquí
  // solo llegan rutas ya guardadas en Storage (o URLs externas del seed).
  const submittedImages = parseExistingImages(formData).filter(
    (image) =>
      isHttpUrl(image) ||
      image.startsWith(`${user.id}/`) ||
      (id !== null && currentImages.includes(image)),
  );

  if (submittedImages.length > MAX_IMAGES) {
    return { error: `Puedes guardar hasta ${MAX_IMAGES} imágenes por propiedad.` };
  }

  const allImages = submittedImages;

  const baseSlug = slugify(fields.title) || `propiedad-${Date.now().toString(36)}`;
  const slug = id
    ? currentSlug ?? (await uniqueSlug(supabase, baseSlug, id))
    : await uniqueSlug(supabase, baseSlug);

  const payload: PropertyInsert = {
    title: fields.title,
    description: fields.description,
    price: fields.price,
    currency: "USD",
    province: fields.province,
    district: fields.district,
    neighborhood: fields.neighborhood,
    transaction_type: fields.transaction_type,
    property_type: fields.property_type,
    bedrooms: fields.bedrooms ?? null,
    bathrooms: fields.bathrooms ?? null,
    parking_spots: fields.parking_spots ?? null,
    area_m2: fields.area_m2 ?? null,
    amenities: fields.amenities,
    is_furnished: fields.is_furnished,
    images: allImages,
    latitude: fields.latitude ?? null,
    longitude: fields.longitude ?? null,
    slug,
    status: fields.status,
    is_featured: fields.is_featured,
    seller_id: user.id,
  };

  if (id) {
    const updatePayload: PropertyUpdate = { ...payload };
    delete (updatePayload as Partial<PropertyInsert>).seller_id;

    const { data: updated, error: updateError } = await supabase
      .from("properties")
      .update(updatePayload)
      .eq("id", id)
      .eq("seller_id", user.id)
      .select("id")
      .maybeSingle();

    if (updateError || !updated) {
      return { error: "No pudimos actualizar la propiedad. Intenta de nuevo." };
    }

    const removedImages = currentImages.filter((image) => !submittedImages.includes(image));
    await removeStorageObjects(supabase, removedImages, user.id);
  } else {
    const { error: insertError } = await supabase.from("properties").insert(payload);
    if (insertError) {
      console.error("[properties] insert:", insertError.message);
      return { error: "No pudimos crear la propiedad. Revisa los datos e intenta de nuevo." };
    }
  }

  revalidatePath("/");
  revalidatePath("/propiedades");
  revalidatePath(`/propiedades/${slug}`);
  revalidatePath("/admin");

  redirect(`/admin?ok=${id ? "updated" : "created"}`);
}

export async function deletePropertyAction(formData: FormData): Promise<void> {
  if (!isSupabaseConfigured()) {
    redirect("/admin?error=demo");
  }

  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const id = String(formData.get("id") ?? "");
  if (!isUuid(id)) redirect("/admin?error=delete");

  const supabase = await createClient();
  const { data: property, error: fetchError } = await supabase
    .from("properties")
    .select("id, slug, images")
    .eq("id", id)
    .eq("seller_id", user.id)
    .maybeSingle();

  if (fetchError || !property) redirect("/admin?error=delete");

  const { error: deleteError } = await supabase
    .from("properties")
    .delete()
    .eq("id", id)
    .eq("seller_id", user.id);

  if (deleteError) redirect("/admin?error=delete");

  await removeStorageObjects(supabase, property.images ?? [], user.id);

  revalidatePath("/");
  revalidatePath("/propiedades");
  if (property.slug) revalidatePath(`/propiedades/${property.slug}`);
  revalidatePath("/admin");

  redirect("/admin?ok=deleted");
}

// Tipos auxiliares para que TypeScript valide las tablas usadas arriba.
export type PropertiesTable = Database["public"]["Tables"]["properties"];
