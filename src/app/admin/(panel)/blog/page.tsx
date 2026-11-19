import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Eye, EyeOff, Pencil, Plus } from "lucide-react";

import { setPostStatusAction } from "@/app/admin/(panel)/blog/actions";
import { getCurrentUser } from "@/lib/auth";
import { POST_STATUS_META } from "@/lib/constants";
import { getAdminPosts } from "@/lib/posts";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { PostStatus } from "@/lib/types";
import { cn, formatDate, truncate } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams: Promise<{ estado?: string; guardado?: string; eliminado?: string }>;
};

const FILTERS: { label: string; href: string; status?: PostStatus }[] = [
  { label: "Todos", href: "/admin/blog" },
  { label: "Borradores", href: "/admin/blog?estado=borradores", status: "draft" },
  { label: "Publicados", href: "/admin/blog?estado=publicados", status: "published" },
];

export default async function AdminBlogPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const status: PostStatus | undefined =
    params.estado === "borradores" ? "draft" : params.estado === "publicados" ? "published" : undefined;

  const configured = isSupabaseConfigured();
  const user = configured ? await getCurrentUser() : null;
  const posts = await getAdminPosts(user?.id ?? "", status);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-gold">Contenido</p>
          <h1 className="mt-1.5 font-display text-3xl">Blog</h1>
          <p className="mt-1 text-[13px] text-muted">
            {posts.length} {posts.length === 1 ? "artículo" : "artículos"} en esta vista.
          </p>
        </div>

        <ButtonLink href="/admin/blog/nuevo" size="md">
          <Plus className="size-4" aria-hidden="true" />
          Nuevo artículo
        </ButtonLink>
      </header>

      {params.guardado && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[12.5px] text-emerald-900">
          <CheckCircle2 className="size-4 shrink-0" aria-hidden="true" />
          Artículo guardado correctamente.
        </div>
      )}

      {params.eliminado && (
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[12.5px] text-slate-700">
          <CheckCircle2 className="size-4 shrink-0" aria-hidden="true" />
          Artículo eliminado.
        </div>
      )}

      <nav className="flex flex-wrap gap-1.5" aria-label="Filtrar artículos">
        {FILTERS.map((filter) => {
          const active = status === filter.status;
          return (
            <Link
              key={filter.label}
              href={filter.href}
              className={cn(
                "inline-flex h-9 items-center rounded-full px-3.5 text-[12.5px] font-semibold transition-colors",
                active
                  ? "bg-deep text-cream"
                  : "border border-line bg-white text-muted hover:text-ink",
              )}
            >
              {filter.label}
            </Link>
          );
        })}
      </nav>

      {posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-white/60 p-10 text-center">
          <p className="font-display text-xl">Todavía no hay artículos aquí.</p>
          <p className="mt-1.5 text-[13px] text-muted">
            Escribe el primero y empieza a atraer visitas desde Google.
          </p>
          <ButtonLink href="/admin/blog/nuevo" size="sm" className="mt-5">
            <Plus className="size-3.5" aria-hidden="true" />
            Nuevo artículo
          </ButtonLink>
        </div>
      ) : (
        <ul className="space-y-3">
          {posts.map((post) => {
            const meta = POST_STATUS_META[post.status];
            const isPublished = post.status === "published";

            return (
              <li
                key={post.id}
                className="rounded-2xl border border-line bg-white p-4 sm:p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-semibold ring-1 ring-inset",
                          meta.className,
                        )}
                      >
                        <span className="size-1.5 rounded-full bg-current opacity-70" />
                        {meta.label}
                      </span>
                      <span className="text-[11px] text-muted">
                        {isPublished && post.published_at
                          ? `Publicado el ${formatDate(post.published_at)}`
                          : `Editado el ${formatDate(post.updated_at)}`}
                      </span>
                    </div>

                    <Link
                      href={`/admin/blog/${post.id}`}
                      className="mt-2 block truncate font-display text-[19px] leading-tight text-ink transition-colors hover:text-teal"
                    >
                      {post.title}
                    </Link>

                    {post.excerpt && (
                      <p className="mt-1 text-[12.5px] leading-5 text-muted">
                        {truncate(post.excerpt, 120)}
                      </p>
                    )}
                  </div>

                  <div className="flex shrink-0 items-center gap-1.5">
                    {isPublished && (
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold text-teal transition-colors hover:bg-teal-50"
                      >
                        <Eye className="size-3.5" aria-hidden="true" />
                        Ver
                      </Link>
                    )}

                    <Link
                      href={`/admin/blog/${post.id}`}
                      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold text-ink transition-colors hover:bg-sand"
                    >
                      <Pencil className="size-3.5" aria-hidden="true" />
                      Editar
                    </Link>

                    <form action={setPostStatusAction}>
                      <input type="hidden" name="id" value={post.id} />
                      <input
                        type="hidden"
                        name="status"
                        value={isPublished ? "draft" : "published"}
                      />
                      <button
                        type="submit"
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors",
                          isPublished
                            ? "text-muted hover:bg-sand hover:text-ink"
                            : "text-emerald-700 hover:bg-emerald-50",
                        )}
                      >
                        {isPublished ? (
                          <EyeOff className="size-3.5" aria-hidden="true" />
                        ) : (
                          <Eye className="size-3.5" aria-hidden="true" />
                        )}
                        {isPublished ? "Despublicar" : "Publicar"}
                      </button>
                    </form>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
