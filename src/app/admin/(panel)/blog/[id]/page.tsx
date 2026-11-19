import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { getCurrentUser } from "@/lib/auth";
import { getPostForEdit } from "@/lib/posts";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { PostForm } from "@/components/admin/post-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Editar artículo",
  robots: { index: false, follow: false },
};

type PageProps = { params: Promise<{ id: string }> };

export default async function EditPostPage({ params }: PageProps) {
  const { id } = await params;

  const configured = isSupabaseConfigured();
  const user = configured ? await getCurrentUser() : null;
  if (configured && !user) redirect("/admin/login");

  const post = await getPostForEdit(user?.id ?? "", id);
  if (!post) notFound();

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
        <h1 className="mt-3 font-display text-3xl">Editar artículo</h1>
        <p className="mt-1 text-[13px] text-muted">
          Los cambios publicados se ven en el sitio al instante.
        </p>
      </header>

      <PostForm mode="edit" post={post} />
    </div>
  );
}
