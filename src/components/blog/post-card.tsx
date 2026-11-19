import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

import { imageUrl } from "@/lib/images";
import { readingMinutes } from "@/lib/posts";
import type { Post } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";
import { IstmoMark } from "@/components/ui/logo";

function PostCover({ post, className }: { post: Post; className?: string }) {
  if (!post.cover_image) {
    return (
      <div
        className={cn(
          "relative flex items-center justify-center overflow-hidden bg-deep",
          className,
        )}
      >
        <div className="absolute inset-0 bg-[radial-gradient(70%_90%_at_80%_10%,rgba(232,185,63,0.24),transparent_65%)]" />
        <IstmoMark className="relative size-14 opacity-90" />
      </div>
    );
  }

  return (
    <div className={cn("overflow-hidden bg-sand", className)}>
      <img
        src={imageUrl(post.cover_image)}
        alt=""
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      />
    </div>
  );
}

export function PostCard({
  post,
  featured = false,
}: {
  post: Post;
  featured?: boolean;
}) {
  const date = post.published_at ?? post.created_at;

  return (
    <article>
      <Link
        href={`/blog/${post.slug}`}
        className={cn(
          "group block",
          featured && "grid gap-6 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-10",
        )}
      >
        <PostCover
          post={post}
          className={cn(
            "rounded-2xl",
            featured ? "aspect-[16/10] lg:aspect-[16/11]" : "aspect-[16/10]",
          )}
        />

        <div className={cn(featured ? "min-w-0" : "mt-4")}>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] font-medium text-muted">
            <span>{formatDate(date)}</span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3" aria-hidden="true" />
              {readingMinutes(post.content)} min de lectura
            </span>
          </p>

          <h3
            className={cn(
              "mt-2 text-balance font-display leading-[1.15] text-ink transition-colors group-hover:text-teal",
              featured ? "text-3xl sm:text-[34px]" : "text-[22px]",
            )}
          >
            {post.title}
          </h3>

          {post.excerpt && (
            <p
              className={cn(
                "mt-2 text-[13.5px] leading-6 text-muted",
                featured ? "sm:text-[14.5px] sm:leading-7" : "line-clamp-3",
              )}
            >
              {post.excerpt}
            </p>
          )}

          <span className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-teal">
            Leer artículo
            <ArrowRight
              className="size-3.5 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </span>
        </div>
      </Link>
    </article>
  );
}
