import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ExternalLink, Star } from "lucide-react";

import { getCurrentUser } from "@/lib/auth";
import { getPropertyForEdit } from "@/lib/properties";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { formatDate } from "@/lib/utils";
import { DeletePropertyButton } from "@/components/admin/delete-property-button";
import { PropertyForm } from "@/components/admin/property-form";
import { StatusBadge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Editar propiedad",
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditPropertyPage({ params }: PageProps) {
  const { id } = await params;
  const configured = isSupabaseConfigured();
  const user = configured ? await getCurrentUser() : null;
  const property = await getPropertyForEdit(user?.id ?? "demo", id);

  if (!property) notFound();

  const demo = !configured;
  const publicHref = `/propiedades/${property.slug ?? property.id}`;

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-1 text-[12px] font-semibold text-muted transition-colors hover:text-ink"
        >
          <ChevronLeft className="size-3.5" aria-hidden="true" />
          Volver al panel
        </Link>

        <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="eyebrow text-gold">Editar propiedad</p>
            <h1 className="mt-2 max-w-3xl text-balance font-display text-4xl leading-[1.1]">
              {property.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <StatusBadge status={property.status} />
              {property.is_featured && (
                <span className="inline-flex items-center gap-1 rounded-full bg-gold-100 px-2.5 py-1 text-[11px] font-semibold text-[#6a4d1c]">
                  <Star className="size-3 fill-current" aria-hidden="true" />
                  Destacada
                </span>
              )}
              <span className="text-[11.5px] text-muted">
                Actualizada el {formatDate(property.updated_at)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {property.status === "published" && (
              <Link
                href={publicHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-white px-4 text-[12.5px] font-semibold text-ink transition-colors hover:border-teal/30 hover:text-teal"
              >
                <ExternalLink className="size-4" aria-hidden="true" />
                Ver en el sitio
              </Link>
            )}
            <DeletePropertyButton id={property.id} title={property.title} demo={demo} />
          </div>
        </div>
      </div>

      <PropertyForm mode="edit" property={property} demo={demo} />
    </div>
  );
}
