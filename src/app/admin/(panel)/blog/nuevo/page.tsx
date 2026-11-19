import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { PostForm } from "@/components/admin/post-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Nuevo artículo",
  robots: { index: false, follow: false },
};

export default function NewPostPage() {
  return (
    <div className="space-y-6">
      <header>
        <Link
          href="/admin/blog"
          className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-muted transition-colors hover:text-ink"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          Volver al blog
        </Link>
        <h1 className="mt-3 font-display text-3xl">Nuevo artículo</h1>
        <p className="mt-1 text-[13px] text-muted">
          Guarda como borrador mientras lo escribes y publica cuando esté listo.
        </p>
      </header>

      <PostForm mode="create" />
    </div>
  );
}
