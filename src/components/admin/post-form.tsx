"use client";

import { useActionState, useState, type ChangeEvent, type MouseEvent, type ReactNode } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Clock,
  Eye,
  ExternalLink,
  ImagePlus,
  Loader2,
  PenLine,
  Save,
  Trash2,
} from "lucide-react";

import {
  deletePostAction,
  savePostAction,
} from "@/app/admin/(panel)/blog/actions";
import { ACCEPTED_IMAGE_TYPES, POST_STATUS_META } from "@/lib/constants";
import type { Post } from "@/lib/types";
import { cn, slugify } from "@/lib/utils";
import { MarkdownContent } from "@/components/blog/markdown-content";
import { buttonClasses } from "@/components/ui/button";

function Field({
  label,
  htmlFor,
  error,
  hint,
  required,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="label">
        {label}
        {required && <span className="ml-0.5 text-gold">*</span>}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 text-[11.5px] text-red-700">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-[11.5px] text-muted">{hint}</p>
      ) : null}
    </div>
  );
}

function ContentStats({ content }: { content: string }) {
  const words = content.trim() ? content.trim().split(/\s+/).filter(Boolean).length : 0;
  const minutes = Math.max(1, Math.round(words / 200));

  return (
    <p className="flex items-center gap-4 text-[11.5px] text-muted">
      <span>{words} palabras</span>
      <span className="inline-flex items-center gap-1">
        <Clock className="size-3" aria-hidden="true" />
        {minutes} min de lectura
      </span>
    </p>
  );
}

export function PostForm({
  mode,
  post,
}: {
  mode: "create" | "edit";
  post?: Post;
}) {
  const [state, action, pending] = useActionState(savePostAction, null);

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(Boolean(post?.slug));
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const existingCover = post?.cover_image ?? "";
  const fieldError = (name: string) => state?.fieldErrors?.[name]?.[0];

  function handleTitle(value: string) {
    setTitle(value);
    if (!slugEdited) setSlug(slugify(value));
  }

  function handleCover(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setCoverPreview(file ? URL.createObjectURL(file) : null);
  }

  function confirmDelete(event: MouseEvent<HTMLButtonElement>) {
    if (!window.confirm("¿Eliminar este artículo? Esta acción no se puede deshacer.")) {
      event.preventDefault();
    }
  }

  const statusMeta = POST_STATUS_META[post?.status ?? "draft"];

  return (
    <form action={action} className="space-y-5">
      {post?.id && <input type="hidden" name="id" value={post.id} />}
      <input type="hidden" name="cover_image" value={existingCover} />

      {state?.error && (
        <div className="flex gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[12.5px] leading-5 text-red-800">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {state.error}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset",
              statusMeta.className,
            )}
          >
            <span className="size-1.5 rounded-full bg-current opacity-70" />
            {statusMeta.label}
          </span>
          {post?.status === "published" && (
            <Link
              href={`/blog/${post.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1 text-[12px] font-semibold text-teal hover:underline"
            >
              Ver artículo
              <ExternalLink className="size-3" aria-hidden="true" />
            </Link>
          )}
        </div>

        {mode === "edit" && (
          <button
            type="submit"
            formAction={deletePostAction}
            onClick={confirmDelete}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold text-red-700 transition-colors hover:bg-red-50"
          >
            <Trash2 className="size-3.5" aria-hidden="true" />
            Eliminar
          </button>
        )}
      </div>

      <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
        <div className="mb-5 border-b border-line pb-4">
          <h2 className="font-display text-xl">El artículo</h2>
          <p className="mt-1 text-[12px] leading-5 text-muted">
            El título y el extracto aparecen en el listado del blog y en Google.
          </p>
        </div>

        <div className="grid gap-4">
          <Field label="Título" htmlFor="title" required error={fieldError("title")}>
            <input
              id="title"
              name="title"
              required
              maxLength={160}
              value={title}
              onChange={(event) => handleTitle(event.target.value)}
              className="field"
              placeholder="Ej. Qué revisar antes de firmar una promesa de compraventa"
            />
          </Field>

          <Field
            label="Enlace (slug)"
            htmlFor="slug"
            error={fieldError("slug")}
            hint="Se genera solo desde el título. Forma la dirección: /blog/tu-enlace"
          >
            <div className="flex items-center gap-2">
              <span className="text-[12px] text-muted">/blog/</span>
              <input
                id="slug"
                name="slug"
                value={slug}
                onChange={(event) => {
                  setSlugEdited(true);
                  setSlug(event.target.value);
                }}
                className="field"
                placeholder="enlace-del-articulo"
              />
            </div>
          </Field>

          <Field
            label="Extracto"
            htmlFor="excerpt"
            error={fieldError("excerpt")}
            hint={`${excerpt.length}/300 caracteres. Es el texto que se ve en el listado y en Google.`}
          >
            <textarea
              id="excerpt"
              name="excerpt"
              rows={3}
              maxLength={300}
              value={excerpt}
              onChange={(event) => setExcerpt(event.target.value)}
              className="field-textarea min-h-20"
              placeholder="Una o dos frases que resuman el artículo."
            />
          </Field>

          <div>
            <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
              <label htmlFor="content" className="label mb-0">
                Contenido<span className="ml-0.5 text-gold">*</span>
              </label>

              <div className="flex items-center rounded-full border border-line bg-sand p-0.5">
                <button
                  type="button"
                  onClick={() => setTab("write")}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11.5px] font-semibold transition-colors",
                    tab === "write" ? "bg-white text-ink shadow-sm" : "text-muted",
                  )}
                >
                  <PenLine className="size-3.5" aria-hidden="true" />
                  Escribir
                </button>
                <button
                  type="button"
                  onClick={() => setTab("preview")}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11.5px] font-semibold transition-colors",
                    tab === "preview" ? "bg-white text-ink shadow-sm" : "text-muted",
                  )}
                >
                  <Eye className="size-3.5" aria-hidden="true" />
                  Vista previa
                </button>
              </div>
            </div>

            {tab === "write" ? (
              <textarea
                id="content"
                name="content"
                required
                rows={18}
                value={content}
                onChange={(event) => setContent(event.target.value)}
                className="field-textarea min-h-96 font-mono text-[13px] leading-6"
                placeholder={"Escribe en Markdown.\n\n## Un subtítulo\n\nUn párrafo normal, con **negrita** y enlaces.\n\n- Punto uno\n- Punto dos"}
              />
            ) : (
              <>
                <input type="hidden" name="content" value={content} />
                <div className="min-h-96 rounded-xl border border-line bg-white px-4 py-4">
                  {content.trim() ? (
                    <MarkdownContent content={content} />
                  ) : (
                    <p className="text-[13px] text-muted">
                      Aún no hay contenido. Vuelve a la pestaña Escribir para redactar.
                    </p>
                  )}
                </div>
              </>
            )}

            <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
              <ContentStats content={content} />
              <p className="text-[11px] text-muted">
                Markdown: ## para subtítulos, **negrita**, - para listas.
              </p>
            </div>

            {fieldError("content") && (
              <p className="mt-1.5 text-[11.5px] text-red-700">{fieldError("content")}</p>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
        <div className="mb-4 border-b border-line pb-4">
          <h2 className="font-display text-xl">Portada</h2>
          <p className="mt-1 text-[12px] leading-5 text-muted">
            Opcional. Se usa en el listado, en el artículo y al compartir el enlace.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-[220px_1fr] sm:items-start">
          <div className="overflow-hidden rounded-xl border border-line bg-sand">
            {coverPreview || existingCover ? (
              <img
                src={coverPreview ?? existingCover}
                alt="Portada del artículo"
                className="aspect-[16/10] w-full object-cover"
              />
            ) : (
              <div className="flex aspect-[16/10] items-center justify-center text-muted">
                <ImagePlus className="size-6" aria-hidden="true" />
              </div>
            )}
          </div>

          <div>
            <label htmlFor="cover" className="label">
              Subir imagen (JPG, PNG, WebP o AVIF · máx. 5 MB)
            </label>
            <input
              id="cover"
              name="cover"
              type="file"
              accept={ACCEPTED_IMAGE_TYPES.join(",")}
              onChange={handleCover}
              className="block w-full text-[12.5px] text-muted file:mr-3 file:h-9 file:rounded-full file:border-0 file:bg-sand file:px-4 file:text-[12.5px] file:font-semibold file:text-ink"
            />
            <p className="mt-2 text-[11.5px] leading-5 text-muted">
              Si no subes una, el artículo usa una portada con tu marca.
            </p>
          </div>
        </div>
      </section>

      <div className="sticky bottom-4 z-20 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-cream/95 px-4 py-3 shadow-soft backdrop-blur">
        <Link
          href="/admin/blog"
          className="text-[12.5px] font-semibold text-muted transition-colors hover:text-ink"
        >
          Cancelar
        </Link>

        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            name="status"
            value="draft"
            disabled={pending}
            className={buttonClasses({ variant: "outline", size: "md" })}
          >
            <Save className="size-4" aria-hidden="true" />
            Guardar borrador
          </button>
          <button
            type="submit"
            name="status"
            value="published"
            disabled={pending}
            className={buttonClasses({ size: "md" })}
          >
            {pending ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : null}
            Publicar
          </button>
        </div>
      </div>
    </form>
  );
}
