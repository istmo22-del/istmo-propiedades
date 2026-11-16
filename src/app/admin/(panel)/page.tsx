import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  MapPin,
  Pencil,
  Plus,
  Search,
  Star,
} from "lucide-react";

import { getCurrentUser } from "@/lib/auth";
import { STATUS_META } from "@/lib/constants";
import { imageUrl } from "@/lib/images";
import { getAdminProperties, getAdminStats } from "@/lib/properties";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { PROPERTY_STATUSES, type AdminFilters, type PropertyStatus } from "@/lib/types";
import { formatDate, formatPrice, propertyLocation } from "@/lib/utils";
import { DeletePropertyButton } from "@/components/admin/delete-property-button";
import { StatusBadge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Propiedades",
};

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const OK_MESSAGES: Record<string, string> = {
  created: "Propiedad creada correctamente. Ya está en el panel y, si la publicaste, en el sitio.",
  updated: "Cambios guardados correctamente.",
  deleted: "Propiedad eliminada del portafolio.",
};

const ERROR_MESSAGES: Record<string, string> = {
  demo: "Modo demostración: configura Supabase para administrar propiedades.",
  delete: "No pudimos eliminar esa propiedad. Intenta de nuevo.",
};

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function parseStatus(value: string | string[] | undefined): PropertyStatus | undefined {
  const raw = first(value);
  if (raw && (PROPERTY_STATUSES as readonly string[]).includes(raw)) {
    return raw as PropertyStatus;
  }
  return undefined;
}

export default async function AdminPropertiesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const configured = isSupabaseConfigured();
  const user = configured ? await getCurrentUser() : null;
  const userId = user?.id ?? "demo";

  const q = first(params.q)?.trim().slice(0, 80) || undefined;
  const status = parseStatus(params.status);
  const filters: AdminFilters = { q, status };

  const [properties, stats] = await Promise.all([
    getAdminProperties(userId, filters),
    getAdminStats(userId),
  ]);

  const ok = first(params.ok);
  const error = first(params.error);
  const hasFilters = Boolean(q || status);
  const demo = !configured;

  return (
    <div className="space-y-7">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-gold">Portafolio</p>
          <h1 className="mt-2 font-display text-4xl leading-tight">Propiedades</h1>
          <p className="mt-2 text-[13px] text-muted">
            {properties.length} de {stats.total} propiedades en tu cuenta.
          </p>
        </div>
        <Link
          href="/admin/propiedades/nueva"
          className="inline-flex h-10 items-center gap-2 rounded-full bg-deep px-5 text-[12.5px] font-semibold text-cream transition-colors hover:bg-deep-800"
        >
          <Plus className="size-4" aria-hidden="true" />
          Nueva propiedad
        </Link>
      </header>

      {ok && OK_MESSAGES[ok] && (
        <div className="flex gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[12.5px] leading-5 text-emerald-900">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {OK_MESSAGES[ok]}
        </div>
      )}

      {error && ERROR_MESSAGES[error] && (
        <div className="flex gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[12.5px] leading-5 text-red-800">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {ERROR_MESSAGES[error]}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: "Total", value: stats.total },
          { label: "Publicadas", value: stats.published },
          { label: "Borradores", value: stats.draft },
          { label: "Cerradas", value: stats.closed },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border border-line bg-white px-4 py-3.5">
            <p className="text-[10px] font-bold tracking-[0.14em] text-muted uppercase">
              {item.label}
            </p>
            <p className="mt-1 font-display text-3xl leading-none">{item.value}</p>
          </div>
        ))}
      </div>

      <form
        action="/admin"
        method="get"
        className="flex flex-col gap-2 rounded-2xl border border-line bg-white p-3 sm:flex-row sm:items-center"
      >
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted"
            aria-hidden="true"
          />
          <input
            type="search"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Buscar por título, provincia, distrito o barrio…"
            aria-label="Buscar propiedades"
            className="field pl-9"
          />
        </div>
        <select
          name="status"
          defaultValue={status ?? ""}
          aria-label="Filtrar por estado"
          className="field sm:w-48"
        >
          <option value="">Todos los estados</option>
          {PROPERTY_STATUSES.map((value) => (
            <option key={value} value={value}>
              {STATUS_META[value].label}
            </option>
          ))}
        </select>
        <div className="flex items-center gap-2">
          <button
            type="submit"
            className="inline-flex h-11 flex-1 items-center justify-center rounded-xl bg-deep px-4 text-[12.5px] font-semibold text-cream transition-colors hover:bg-deep-800 sm:flex-none"
          >
            Filtrar
          </button>
          {hasFilters && (
            <Link
              href="/admin"
              className="inline-flex h-11 items-center justify-center rounded-xl px-3 text-[12.5px] font-semibold text-muted transition-colors hover:text-ink"
            >
              Limpiar
            </Link>
          )}
        </div>
      </form>

      {properties.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-line bg-white/70 px-6 py-16 text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-sand text-muted">
            <Search className="size-6" aria-hidden="true" />
          </span>
          <h2 className="mt-5 font-display text-2xl">
            {hasFilters ? "No hay propiedades con esos filtros." : "Tu portafolio está vacío."}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
            {hasFilters
              ? "Prueba con otro término de búsqueda o cambia el estado seleccionado."
              : "Crea tu primera propiedad. Puedes guardarla como borrador y publicarla cuando esté lista."}
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            {hasFilters && (
              <Link
                href="/admin"
                className="inline-flex h-10 items-center rounded-full border border-line px-4 text-[12.5px] font-semibold text-ink transition-colors hover:bg-sand"
              >
                Limpiar filtros
              </Link>
            )}
            <Link
              href="/admin/propiedades/nueva"
              className="inline-flex h-10 items-center gap-2 rounded-full bg-deep px-5 text-[12.5px] font-semibold text-cream transition-colors hover:bg-deep-800"
            >
              <Plus className="size-4" aria-hidden="true" />
              Nueva propiedad
            </Link>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-white">
          <div className="hidden grid-cols-[minmax(0,1fr)_118px_140px_116px] items-center gap-4 border-b border-line bg-sand/60 px-5 py-3 text-[10px] font-bold tracking-[0.14em] text-muted uppercase lg:grid">
            <span>Propiedad</span>
            <span>Estado</span>
            <span>Precio</span>
            <span className="text-right">Acciones</span>
          </div>

          <ul className="divide-y divide-line">
            {properties.map((property) => {
              const publicHref = `/propiedades/${property.slug ?? property.id}`;
              return (
                <li
                  key={property.id}
                  className="grid gap-4 px-4 py-4 sm:px-5 lg:grid-cols-[minmax(0,1fr)_118px_140px_116px] lg:items-center"
                >
                  <div className="flex min-w-0 gap-3.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageUrl(property.images[0])}
                      alt=""
                      loading="lazy"
                      className="size-16 shrink-0 rounded-xl border border-line bg-sand object-cover"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <Link
                          href={`/admin/propiedades/${property.id}`}
                          className="truncate font-display text-[16px] leading-snug transition-colors hover:text-teal"
                        >
                          {property.title}
                        </Link>
                        {property.is_featured && (
                          <Star
                            className="size-3.5 shrink-0 fill-gold text-gold"
                            aria-label="Destacada"
                          />
                        )}
                      </div>
                      <p className="mt-1 flex items-center gap-1.5 truncate text-[12px] text-muted">
                        <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
                        {propertyLocation(property)}
                      </p>
                      <p className="mt-1 text-[11px] text-muted/80">
                        Actualizada el {formatDate(property.updated_at)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <StatusBadge status={property.status} />
                  </div>

                  <div>
                    <p className="text-[13.5px] font-semibold text-ink">
                      {formatPrice(property.price, property.currency)}
                      {property.transaction_type === "Alquiler" && (
                        <span className="text-[11px] font-medium text-muted"> /mes</span>
                      )}
                    </p>
                    <p className="mt-0.5 text-[11px] text-muted">
                      {property.transaction_type} · {property.property_type}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 lg:justify-end">
                    <Link
                      href={publicHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Ver ${property.title} en el sitio`}
                      className="grid size-9 place-items-center rounded-full border border-line text-muted transition-colors hover:border-teal/30 hover:bg-teal-50 hover:text-teal"
                    >
                      <Eye className="size-4" aria-hidden="true" />
                    </Link>
                    <Link
                      href={`/admin/propiedades/${property.id}`}
                      aria-label={`Editar ${property.title}`}
                      className="grid size-9 place-items-center rounded-full border border-line text-muted transition-colors hover:border-teal/30 hover:bg-teal-50 hover:text-teal"
                    >
                      <Pencil className="size-4" aria-hidden="true" />
                    </Link>
                    <DeletePropertyButton id={property.id} title={property.title} demo={demo} />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
