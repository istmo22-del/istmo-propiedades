"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { getCurrentUser } from "@/lib/auth";
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_BYTES } from "@/lib/constants";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type { ActionState } from "@/lib/types";
import { slugify } from "@/lib/utils";
import { parsePostForm } from "@/lib/validation";

const BLOG_BUCKET = "blog-images";

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

type Supabase = Awaited<ReturnType<typeof createClient>>;

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

async function uniqueSlug(
  supabase: Supabase,
  base: string,
  currentId?: string,
): Promise<string> {
  const clean = base || "articulo";
  let candidate = clean;

  for (let attempt = 0; attempt < 4; attempt += 1) {
    const { data } = await supabase
      .from("posts")
      .select("id")
      .eq("slug", candidate)
      .maybeSingle();

    if (!data || data.id === currentId) return candidate;
    candidate = `${clean}-${Math.random().toString(36).slice(2, 6)}`;
  }

  return `${clean}-${Date.now().toString(36).slice(-5)}`;
}

/** "https://…/blog-images/{uid}/{uuid}.jpg" → "{uid}/{uuid}.jpg" */
function storagePathFromPublicUrl(url: string | null): string | null {
  if (!url) return null;
  const marker = `/storage/v1/object/public/${BLOG_BUCKET}/`;
  const index = url.indexOf(marker);
  if (index === -1) return null;
  return decodeURIComponent(url.slice(index + marker.length));
}

async function removeCover(supabase: Supabase, url: string | null, userId: string) {
  const path = storagePathFromPublicUrl(url);
  if (path && path.startsWith(`${userId}/`)) {
    await supabase.storage.from(BLOG_BUCKET).remove([path]);
  }
}

export async function savePostAction(
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

  const parsed = parsePostForm(formData);
  if (!parsed.success) {
    const flat = z.flattenError(parsed.error);
    return {
      error: "Revisa los campos marcados antes de guardar.",
      fieldErrors: flat.fieldErrors as Record<string, string[]>,
    };
  }

  const fields = parsed.data;
  const supabase = await createClient();

  let currentSlug: string | null = null;
  let currentCover: string | null = null;
  let currentPublishedAt: string | null = null;

  if (id) {
    const { data: current, error: currentError } = await supabase
      .from("posts")
      .select("id, slug, cover_image, published_at")
      .eq("id", id)
      .eq("author_id", user.id)
      .maybeSingle();

    if (currentError || !current) {
      return { error: "No encontramos ese artículo o no tienes permiso para editarlo." };
    }

    currentSlug = current.slug;
    currentCover = current.cover_image;
    currentPublishedAt = current.published_at;
  }

  const baseSlug = slugify(fields.slug || fields.title) || `articulo-${Date.now().toString(36)}`;
  const slug = await uniqueSlug(supabase, baseSlug, id ?? undefined);

  // Portada nueva (opcional): se sube al bucket del blog.
  const file = formData.get("cover");
  const submittedCover = String(formData.get("cover_image") ?? "").trim() || null;
  let coverImage = submittedCover;
  let uploadedPath: string | null = null;

  if (file instanceof File && file.size > 0) {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      return { error: "La portada debe ser JPG, PNG, WebP o AVIF." };
    }
    if (file.size > MAX_IMAGE_BYTES) {
      return { error: "La portada no puede superar 5 MB." };
    }

    const extension = EXTENSIONS[file.type];
    const path = `${user.id}/${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage
      .from(BLOG_BUCKET)
      .upload(path, file, { contentType: file.type, upsert: false });

    if (uploadError) {
      console.error("[blog] subir portada:", uploadError.message);
      return { error: "No pudimos subir la portada. Intenta de nuevo." };
    }

    uploadedPath = path;
    coverImage = supabase.storage.from(BLOG_BUCKET).getPublicUrl(path).data.publicUrl;
  }

  const publishedAt =
    fields.status === "published"
      ? currentPublishedAt ?? new Date().toISOString()
      : null;

  const payload = {
    title: fields.title,
    slug,
    excerpt: fields.excerpt,
    content: fields.content,
    cover_image: coverImage,
    status: fields.status,
    published_at: publishedAt,
  };

  if (id) {
    const { error } = await supabase
      .from("posts")
      .update(payload)
      .eq("id", id)
      .eq("author_id", user.id);

    if (error) {
      console.error("[blog] actualizar:", error.message);
      if (uploadedPath) await supabase.storage.from(BLOG_BUCKET).remove([uploadedPath]);
      return { error: "No pudimos guardar el artículo. Intenta de nuevo." };
    }
  } else {
    const { error } = await supabase
      .from("posts")
      .insert({ ...payload, author_id: user.id });

    if (error) {
      console.error("[blog] crear:", error.message);
      if (uploadedPath) await supabase.storage.from(BLOG_BUCKET).remove([uploadedPath]);
      return { error: "No pudimos crear el artículo. Intenta de nuevo." };
    }
  }

  // Limpieza: si la portada cambió, borra la anterior del bucket.
  if (currentCover && currentCover !== coverImage) {
    await removeCover(supabase, currentCover, user.id);
  }

  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  if (currentSlug && currentSlug !== slug) revalidatePath(`/blog/${currentSlug}`);
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/admin/blog");
  redirect("/admin/blog?guardado=1");
}

const statusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["draft", "published"]),
});

/** Publicar o despublicar desde el listado, sin abrir el editor. */
export async function setPostStatusAction(formData: FormData): Promise<void> {
  if (!isSupabaseConfigured()) return;

  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const parsed = statusSchema.safeParse({
    id: formData.get("id"),
    status: formData.get("status"),
  });
  if (!parsed.success) return;

  const supabase = await createClient();

  const { data: current } = await supabase
    .from("posts")
    .select("published_at")
    .eq("id", parsed.data.id)
    .eq("author_id", user.id)
    .maybeSingle();

  if (!current) return;

  await supabase
    .from("posts")
    .update({
      status: parsed.data.status,
      published_at:
        parsed.data.status === "published"
          ? current.published_at ?? new Date().toISOString()
          : null,
    })
    .eq("id", parsed.data.id)
    .eq("author_id", user.id);

  revalidatePath("/blog");
  revalidatePath("/admin/blog");
}

export async function deletePostAction(formData: FormData): Promise<void> {
  if (!isSupabaseConfigured()) {
    redirect("/admin/blog");
  }

  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const id = String(formData.get("id") ?? "").trim();
  if (!id || !isUuid(id)) redirect("/admin/blog");

  const supabase = await createClient();
  const { data: post } = await supabase
    .from("posts")
    .select("slug, cover_image")
    .eq("id", id)
    .eq("author_id", user.id)
    .maybeSingle();

  if (!post) redirect("/admin/blog");

  await supabase.from("posts").delete().eq("id", id).eq("author_id", user.id);
  await removeCover(supabase, post.cover_image, user.id);

  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);
  revalidatePath("/admin/blog");
  redirect("/admin/blog?eliminado=1");
}
