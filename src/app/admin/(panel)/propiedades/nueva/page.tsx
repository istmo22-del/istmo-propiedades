import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, Info } from "lucide-react";

import { isSupabaseConfigured } from "@/lib/supabase/env";
import { PropertyForm } from "@/components/admin/property-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Nueva propiedad",
};

export default function NewPropertyPage() {
  const demo = !isSupabaseConfigured();

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
        <p className="eyebrow mt-5 text-gold">Nueva propiedad</p>
        <h1 className="mt-2 font-display text-4xl leading-tight">Crear propiedad</h1>
        <p className="mt-2 max-w-2xl text-[13px] leading-6 text-muted">
          Completa la información, sube las fotos y elige si quieres publicarla de inmediato o
          guardarla como borrador.
        </p>
      </div>

      <div className="flex gap-2.5 rounded-xl border border-line bg-white px-4 py-3 text-[12px] leading-5 text-muted">
        <Info className="mt-0.5 size-4 shrink-0 text-teal" aria-hidden="true" />
        <p>
          La primera imagen se usa como portada. Las propiedades publicadas aparecen en el sitio
          público y en el buscador; los borradores solo son visibles en este panel.
        </p>
      </div>

      <PropertyForm mode="create" demo={demo} />
    </div>
  );
}
