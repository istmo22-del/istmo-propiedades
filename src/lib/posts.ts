import { cache } from "react";

import { DEMO_POSTS } from "@/lib/demo-posts";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type { Post, PostStatus } from "@/lib/types";

const DEMO_MODE = !isSupabaseConfigured();

function postDate(post: Post): number {
  return +new Date(post.published_at ?? post.created_at);
}

function logError(error: { message: string }, context: string): void {
  console.error(`[supabase] ${context}:`, error.message);
}

/**
 * El blog no debe tumbar el sitio si la tabla todavía no existe:
 * se registra el error y la vista sigue funcionando sin artículos.
 */
function assertNoErrorSafe(error: { message: string } | null, context: string): void {
  if (error) logError(error, context);
}

function sortByDate(items: Post[]): Post[] {
  return [...items].sort((a, b) => postDate(b) - postDate(a));
}

/** Tiempo de lectura aproximado (200 palabras por minuto). */
export function readingMinutes(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

/** Artículos publicados, más recientes primero. */
export async function getPublishedPosts(limit = 30): Promise<Post[]> {
  if (DEMO_MODE) {
    return sortByDate(DEMO_POSTS.filter((post) => post.status === "published")).slice(0, limit);
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(limit);

  assertNoErrorSafe(error, "artículos");
  return data ?? [];
}

export const getPostBySlug = cache(async (slug: string): Promise<Post | null> => {
  let cleanSlug = slug;
  try {
    cleanSlug = decodeURIComponent(slug).trim();
  } catch {
    cleanSlug = slug.trim();
  }
  if (!cleanSlug) return null;

  if (DEMO_MODE) {
    return (
      DEMO_POSTS.find((post) => post.status === "published" && post.slug === cleanSlug) ?? null
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", cleanSlug)
    .eq("status", "published")
    .maybeSingle();

  assertNoErrorSafe(error, "artículo");
  return data ?? null;
});

/** Artículos recientes para el bloque "sigue leyendo". */
export async function getRelatedPosts(post: Post, limit = 3): Promise<Post[]> {
  if (DEMO_MODE) {
    return sortByDate(
      DEMO_POSTS.filter((item) => item.id !== post.id && item.status === "published"),
    ).slice(0, limit);
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .neq("id", post.id)
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(limit);

  assertNoErrorSafe(error, "artículos relacionados");
  return data ?? [];
}

export async function getAllPublishedPostSlugs(): Promise<
  { slug: string; updated_at: string }[]
> {
  if (DEMO_MODE) {
    return DEMO_POSTS.filter((post) => post.status === "published").map((post) => ({
      slug: post.slug,
      updated_at: post.updated_at,
    }));
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("slug, updated_at")
    .eq("status", "published");

  assertNoErrorSafe(error, "sitemap del blog");
  return data ?? [];
}

// ---------------------------------------------------------------------------
// Panel de administración
// ---------------------------------------------------------------------------

export async function getAdminPosts(
  userId: string,
  status?: PostStatus,
): Promise<Post[]> {
  if (DEMO_MODE) {
    return DEMO_POSTS.filter((post) => (status ? post.status === status : true)).sort(
      (a, b) => +new Date(b.updated_at) - +new Date(a.updated_at),
    );
  }

  const supabase = await createClient();
  let query = supabase.from("posts").select("*").eq("author_id", userId);
  if (status) query = query.eq("status", status);

  const { data, error } = await query.order("updated_at", { ascending: false });
  assertNoErrorSafe(error, "panel del blog");
  return data ?? [];
}

export async function getPostForEdit(userId: string, id: string): Promise<Post | null> {
  if (DEMO_MODE) {
    return DEMO_POSTS.find((post) => post.id === id) ?? null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .eq("author_id", userId)
    .maybeSingle();

  assertNoErrorSafe(error, "editar artículo");
  return data ?? null;
}
