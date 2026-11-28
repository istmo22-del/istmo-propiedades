import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, MessageCircle, SearchX } from "lucide-react";

import { whatsappLink } from "@/config/site";
import { PAGE_SIZE } from "@/lib/constants";
import { countActiveFilters, filtersToQueryString, parseFilters, type RawSearchParams } from "@/lib/filters";
import { getPublishedProperties } from "@/lib/properties";
import { pluralize } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button";
import { ActiveFilters } from "@/components/search/active-filters";
import { FiltersDrawer } from "@/components/search/filters-drawer";
import { FiltersForm } from "@/components/search/filters-form";
import { Pagination } from "@/components/search/pagination";
import { SortSelect } from "@/components/search/sort-select";
import { PropertyCard } from "@/components/properties/property-card";

export const dynamic = "force-dynamic";

type PageProps = { searchParams: Promise<RawSearchParams> };

function buildHeading(filters: ReturnType<typeof parseFilters>): string {
  if (filters.q) return `Resultados para “${filters.q}”`;

  const subject = filters.types.length === 1 ? filters.types[0] : "Propiedades";
  const operation =
    filters.transaction === "Venta"
      ? "en venta"
      : filters.transaction === "Alquiler"
        ? "en alquiler"
        : "";
  const place = filters.district
    ? `en ${filters.district}`
    : filters.province
      ? `en ${filters.province}`
      : "en Panamá";

  return [subject, operation, place].filter(Boolean).join(" ");
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const filters = parseFilters(await searchParams);
  const heading = buildHeading(filters);
  return {
    title: heading,
    description: `${heading}. Explora fotos, precios y detalles de propiedades en Panamá.`,
    alternates: { canonical: "/propiedades" },
    robots: filters.q ? { index: false, follow: true } : { index: true, follow: true },
  };
}

export default async function PropertiesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filters = parseFilters(params);
  const { items, total, page, pageCount } = await getPublishedProperties(filters);
  const activeCount = countActiveFilters(filters);
  const formKey = filtersToQueryString(filters, { page: 1 });
  const heading = buildHeading(filters);

  return (
    <>
      <header className="border-b border-line bg-sand/70 pt-28 pb-10 sm:pt-32">
        <div className="container-page">
          <nav aria-label="Ruta de navegación" className="flex items-center gap-1.5 text-[11.5px] text-muted">
            <Link href="/" className="transition-colors hover:text-ink">
              Inicio
            </Link>
            <ChevronRight className="size-3" aria-hidden="true" />
            <span className="text-ink/70">Propiedades</span>
          </nav>

          <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow text-gold">Portafolio</p>
              <h1 className="mt-2.5 max-w-3xl text-balance font-display text-4xl leading-[1.08] sm:text-5xl">
                {heading}
              </h1>
            </div>
            <p className="text-[13px] text-muted">
              {total} {pluralize(total, "propiedad disponible", "propiedades disponibles")}
            </p>
          </div>
        </div>
      </header>

      <section className="container-page py-10 lg:py-12">
        <div className="grid gap-10 lg:grid-cols-[276px_1fr] lg:gap-12">
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <div className="mb-5 flex items-center justify-between">
                <p className="font-display text-xl">Filtros</p>
                {activeCount > 0 && (
                  <span className="rounded-full bg-deep px-2 py-0.5 text-[10px] font-bold text-cream">
                    {activeCount}
                  </span>
                )}
              </div>
              <FiltersForm key={formKey} filters={filters} />
            </div>
          </aside>

          <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <FiltersDrawer filters={filters} activeCount={activeCount} />
                <p className="text-[12.5px] text-muted">
                  {total > 0 ? (
                    <>
                      Mostrando{" "}
                      <span className="font-semibold text-ink">
                        {(page - 1) * PAGE_SIZE + 1}–{(page - 1) * PAGE_SIZE + items.length}
                      </span>{" "}
                      de {total}
                    </>
                  ) : (
                    "Sin resultados"
                  )}
                </p>
              </div>
              <SortSelect value={filters.sort} />
            </div>

            <div className="mt-4">
              <ActiveFilters filters={filters} />
            </div>

            {items.length > 0 ? (
              <>
                <div className="mt-7 grid gap-x-6 gap-y-11 sm:grid-cols-2 xl:grid-cols-3">
                  {items.map((property, index) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      eager={index < 3}
                      revealDelay={index % 3}
                    />
                  ))}
                </div>
                <Pagination page={page} pageCount={pageCount} filters={filters} />
              </>
            ) : (
              <div className="mt-8 rounded-3xl border border-dashed border-line bg-white/70 px-6 py-16 text-center">
                <span className="mx-auto grid size-14 place-items-center rounded-full bg-sand text-muted">
                  <SearchX className="size-6" aria-hidden="true" />
                </span>
                <h2 className="mt-5 font-display text-2xl">
                  {activeCount > 0
                    ? "No encontramos propiedades con esos filtros."
                    : "Todavía no hay propiedades publicadas."}
                </h2>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
                  {activeCount > 0
                    ? "Prueba ampliando el rango de precio, quitando alguna amenidad o buscando en otra provincia."
                    : "Estamos preparando el portafolio. Escríbenos y te avisamos en cuanto publiquemos algo que encaje contigo."}
                </p>
                <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                  {activeCount > 0 && (
                    <ButtonLink href="/propiedades" variant="outline">
                      Limpiar filtros
                    </ButtonLink>
                  )}
                  <ButtonLink
                    href={whatsappLink({
                      message: "Hola, busco una propiedad en Panamá y no encontré lo que necesito en el sitio.",
                    })}
                    external
                    variant="whatsapp"
                  >
                    <MessageCircle className="size-4" aria-hidden="true" />
                    Cuéntanos qué buscas
                  </ButtonLink>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
