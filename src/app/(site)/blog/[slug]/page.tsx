import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Clock, MessageCircle } from "lucide-react";

import { site, whatsappLink } from "@/config/site";
import { imageUrl } from "@/lib/images";
import { getPostBySlug, getRelatedPosts, readingMinutes } from "@/lib/posts";
import { absoluteUrl, formatDate, truncate } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button";
import { MarkdownContent } from "@/components/blog/markdown-content";
import { PostCard } from "@/components/blog/post-card";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Artículo no encontrado" };

  const description = truncate(
    (post.excerpt ?? post.content).replace(/[#*_>`\n]+/g, " ").replace(/\s+/g, " ").trim(),
    158,
  );
  const image = post.cover_image ? absoluteUrl(imageUrl(post.cover_image)) : absoluteUrl("/og.jpg");

  return {
    title: post.title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description,
      images: [{ url: image, alt: post.title }],
      type: "article",
      locale: "es_PA",
      publishedTime: post.published_at ?? post.created_at,
      modifiedTime: post.updated_at,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: [image],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const related = await getRelatedPosts(post);
  const canonical = absoluteUrl(`/blog/${post.slug}`);
  const date = post.published_at ?? post.created_at;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt ?? undefined,
    image: post.cover_image ? [absoluteUrl(imageUrl(post.cover_image))] : undefined,
    datePublished: date,
    dateModified: post.updated_at,
    author: { "@type": "Organization", name: site.name, url: site.url },
    publisher: {
      "@type": "Organization",
      name: site.name,
      logo: { "@type": "ImageObject", url: absoluteUrl("/icon.svg") },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="pt-28 pb-16 sm:pt-32">
        <div className="container-page">
          <nav
            aria-label="Ruta de navegación"
            className="flex flex-wrap items-center gap-1.5 text-[11.5px] text-muted"
          >
            <Link href="/" className="transition-colors hover:text-ink">
              Inicio
            </Link>
            <ChevronRight className="size-3" aria-hidden="true" />
            <Link href="/blog" className="transition-colors hover:text-ink">
              Blog
            </Link>
            <ChevronRight className="size-3" aria-hidden="true" />
            <span className="max-w-60 truncate text-ink/70">{post.title}</span>
          </nav>

          <header className="mx-auto mt-8 max-w-3xl">
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] font-medium text-muted">
              <span>{formatDate(date)}</span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="size-3" aria-hidden="true" />
                {readingMinutes(post.content)} min de lectura
              </span>
            </p>

            <h1 className="mt-3 text-balance font-display text-[34px] leading-[1.08] sm:text-[46px]">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="mt-5 text-[16px] leading-7 text-muted">{post.excerpt}</p>
            )}

            <div className="mt-6 flex items-center gap-3 border-t border-line pt-5">
              <span className="grid size-10 place-items-center rounded-full bg-deep text-[12px] font-bold text-cream">
                IR
              </span>
              <div>
                <p className="text-[13px] font-semibold text-ink">{site.name}</p>
                <p className="text-[11.5px] text-muted">Bienes raíces en Panamá</p>
              </div>
            </div>
          </header>

          {post.cover_image && (
            <div className="mx-auto mt-9 max-w-4xl overflow-hidden rounded-[2rem]">
              <img
                src={imageUrl(post.cover_image)}
                alt=""
                className="aspect-[16/9] w-full object-cover"
              />
            </div>
          )}

          <div className="mx-auto mt-10 max-w-3xl">
            <MarkdownContent content={post.content} />

            <div className="mt-12 rounded-[1.75rem] bg-deep px-6 py-9 text-cream sm:px-10">
              <p className="eyebrow text-gold">¿Necesitas asesoría?</p>
              <h2 className="mt-2 max-w-lg text-balance font-display text-2xl leading-tight sm:text-3xl">
                Te ayudamos a aplicar esto a tu caso.
              </h2>
              <p className="mt-3 max-w-lg text-[13px] leading-6 text-cream/70">
                Escríbenos y revisamos juntos la propiedad, el título o el contrato que
                tengas en mente.
              </p>
              <div className="mt-6 flex flex-wrap gap-2.5">
                <ButtonLink
                  href={whatsappLink({
                    message: `Hola, leí el artículo "${post.title}" y quiero asesoría.`,
                    url: canonical,
                  })}
                  external
                  variant="whatsapp"
                  size="md"
                >
                  <MessageCircle className="size-4" aria-hidden="true" />
                  Escribir por WhatsApp
                </ButtonLink>
                <ButtonLink
                  href="/propiedades"
                  size="md"
                  className="border border-white/25 bg-transparent text-cream hover:border-white/45 hover:bg-white/10"
                >
                  Ver propiedades
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-20 border-t border-line pt-14">
            <div className="container-page">
              <p className="eyebrow text-gold">Sigue leyendo</p>
              <h2 className="mt-2.5 font-display text-3xl sm:text-4xl">Más artículos</h2>

              <div className="mt-8 grid gap-x-6 gap-y-11 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((item, index) => (
                  <PostCard key={item.id} post={item} revealDelay={index % 3} />
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
