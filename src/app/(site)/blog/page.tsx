import type { Metadata } from "next";
import { MessageCircle } from "lucide-react";

import { whatsappLink } from "@/config/site";
import { getPublishedPosts } from "@/lib/posts";
import { ButtonLink } from "@/components/ui/button";
import { PostCard } from "@/components/blog/post-card";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Guías prácticas para comprar, vender y alquilar propiedades en Panamá: títulos, barrios, precios y trámites.",
  alternates: {
    canonical: "/blog",
    types: { "application/rss+xml": "/blog/rss.xml" },
  },
};

export default async function BlogPage() {
  const posts = await getPublishedPosts();
  const [lead, ...rest] = posts;

  return (
    <>
      <header className="bg-sand/70 pt-32 pb-14 sm:pt-36">
        <div className="container-page">
          <p className="eyebrow text-gold">Blog</p>
          <h1 className="mt-4 max-w-3xl text-balance font-display text-5xl leading-[1.04] sm:text-6xl">
            Notas sobre vivir e invertir en Panamá.
          </h1>
          <p className="mt-6 max-w-2xl text-[15px] leading-7 text-muted">
            Guías concretas para comprar, vender y alquilar con información real: títulos,
            barrios, precios y trámites.
          </p>
        </div>
      </header>

      <div className="container-page py-14 lg:py-20">
        {posts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-line bg-white/60 p-12 text-center">
            <p className="font-display text-2xl">Pronto publicaremos el primer artículo.</p>
            <p className="mt-2 text-sm text-muted">
              Mientras tanto, escríbenos y te asesoramos directo.
            </p>
            <ButtonLink href={whatsappLink()} external variant="whatsapp" className="mt-6">
              <MessageCircle className="size-4" aria-hidden="true" />
              Escribir por WhatsApp
            </ButtonLink>
          </div>
        ) : (
          <>
            {lead && <PostCard post={lead} featured />}

            {rest.length > 0 && (
              <div className="mt-14 grid gap-x-6 gap-y-12 border-t border-line pt-14 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((post, index) => (
                  <PostCard key={post.id} post={post} revealDelay={index % 3} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
