import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Clock,
  Handshake,
  Home,
  KeyRound,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
} from "lucide-react";

import { site, whatsappLink } from "@/config/site";
import { PROPERTY_COLLECTIONS, collectionHref, type CollectionKey } from "@/lib/collections";
import { getHomeData } from "@/lib/properties";
import { formatNumber } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button";
import { CategoryIcon } from "@/components/ui/category-icon";
import { HeroSearch } from "@/components/search/hero-search";
import { PropertyCard } from "@/components/properties/property-card";
import { revealDelay } from "@/components/ui/reveal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: `${site.name} — Casas, apartamentos y fincas en Panamá` },
  description: site.description,
  alternates: { canonical: "/" },
};

const trustPoints = ["Fotos reales de cada propiedad", "Respuesta el mismo día", "Un solo asesor de principio a fin"];

const values = [
  {
    icon: ShieldCheck,
    title: "Información verificada",
    text: "Visitamos y revisamos cada propiedad antes de publicarla. Sin sorpresas al llegar.",
  },
  {
    icon: Handshake,
    title: "Trato directo",
    text: "Hablas con la persona que conoce la propiedad, no con un centro de llamadas.",
  },
  {
    icon: KeyRound,
    title: "Acompañamiento completo",
    text: "Desde la primera visita hasta la firma y la entrega de llaves.",
  },
];

const collectionVisuals: Record<
  CollectionKey,
  { icon: typeof KeyRound; iconClass: string; bar: string }
> = {
  "alquileres-chiriqui": {
    icon: KeyRound,
    iconClass: "bg-teal-50 text-teal ring-1 ring-teal/15",
    bar: "bg-teal",
  },
  "casas-venta-david": {
    icon: Home,
    iconClass: "bg-gold-100 text-gold-700 ring-1 ring-gold/30",
    bar: "bg-gold",
  },
  "propiedades-recientes": {
    icon: Clock,
    iconClass: "bg-leaf-50 text-leaf ring-1 ring-leaf/20",
    bar: "bg-leaf",
  },
};

export default async function HomePage() {
  const { total, featured, collections, categories, provinces } = await getHomeData();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: site.name,
    description: site.description,
    url: site.url,
    telephone: site.phone,
    email: site.email,
    image: `${site.url}/og.jpg`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Ciudad de Panamá",
      addressCountry: "PA",
    },
    areaServed: { "@type": "Country", name: "Panamá" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="relative isolate flex min-h-[94svh] flex-col justify-end overflow-hidden bg-deep">
        <img
          src="/hero.jpg"
          alt="Villa con piscina rodeada de palmeras en Panamá"
          className="hero-drift absolute inset-0 -z-10 h-full w-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/75 via-ink/35 to-ink/85" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(75%_55%_at_18%_28%,rgba(11,79,138,0.55),transparent_70%)]" />

        <div className="container-page relative pt-32 pb-10 sm:pb-14">
          <div className="max-w-3xl animate-rise">
            <p className="eyebrow flex items-center gap-3 text-gold">
              <span className="h-px w-10 bg-gold/80" aria-hidden="true" />
              Bienes raíces en Panamá
            </p>
            <h1 className="mt-5 text-balance font-display text-[44px] leading-[1.02] text-cream sm:text-6xl lg:text-[76px]">
              Encuentra tu lugar
              <br />
              <span className="font-light text-gold italic">en Panamá.</span>
            </h1>
            <p className="mt-6 max-w-xl text-[15px] leading-7 text-cream/75 sm:text-base">
              Apartamentos en San Francisco, casas en David, fincas en Boquete y playas
              en Coronado. Te acompañamos a encontrar el espacio que se adapta a tu vida
              o a tu próximo proyecto.
            </p>
          </div>

          <div className="max-w-4xl">
            <HeroSearch />
            <ul className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-[11.5px] font-medium text-cream/70">
              {trustPoints.map((point) => (
                <li key={point} className="flex items-center gap-2">
                  <Check className="size-3.5 text-gold" aria-hidden="true" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-line bg-cream">
        <div className="container-page flex flex-wrap items-center justify-between gap-6 py-7">
          <div className="flex flex-wrap items-center gap-x-10 gap-y-5">
            <div>
              <p
                className="font-display text-2xl leading-none tabular-nums"
                data-count-to={total}
              >
                {formatNumber(total)}
              </p>
              <p className="mt-1.5 text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">
                Propiedades activas
              </p>
            </div>
            <div className="h-10 w-px bg-line" aria-hidden="true" />
            <div>
              <p
                className="font-display text-2xl leading-none tabular-nums"
                data-count-to={provinces.length}
              >
                {provinces.length}
              </p>
              <p className="mt-1.5 text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">
                Provincias
              </p>
            </div>
            <div className="h-10 w-px bg-line" aria-hidden="true" />
            <div>
              <p
                className="font-display text-2xl leading-none tabular-nums"
                data-count-to={categories.length}
              >
                {categories.length}
              </p>
              <p className="mt-1.5 text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">
                Tipos de propiedad
              </p>
            </div>
          </div>
          <Link
            href="/propiedades"
            className="group inline-flex items-center gap-2 text-[12.5px] font-semibold text-teal"
          >
            Ver todas las propiedades
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* Colecciones curadas */}
      {PROPERTY_COLLECTIONS.map((collection, index) => {
        const items = collections[collection.key];
        if (!items || items.length === 0) return null;

        const visual = collectionVisuals[collection.key];
        const Icon = visual.icon;

        return (
          <section
            key={collection.key}
            className={`border-b border-line py-16 lg:py-20 ${
              index % 2 === 0 ? "bg-white" : "bg-sand/50"
            }`}
          >
            <div className="container-page">
              <div
                className="flex flex-wrap items-end justify-between gap-6"
                data-reveal=""
              >
                <div className="max-w-2xl">
                  <p className="eyebrow flex items-center gap-2.5 text-gold">
                    <span
                      className={`grid size-7 place-items-center rounded-lg ${visual.iconClass}`}
                    >
                      <Icon className="size-3.5" aria-hidden="true" />
                    </span>
                    {collection.eyebrow}
                  </p>
                  <h2 className="mt-3 text-balance font-display text-3xl leading-[1.12] sm:text-4xl">
                    {collection.title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-muted">{collection.description}</p>
                </div>
                <ButtonLink href={collectionHref(collection)} variant="outline" size="sm">
                  Ver todas
                  <ArrowRight className="size-4" aria-hidden="true" />
                </ButtonLink>
              </div>

              <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((property, itemIndex) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    eager={index === 0 && itemIndex === 0}
                    revealDelay={itemIndex}
                  />
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* Destacadas */}
      <section className="py-20 lg:py-24">
        <div className="container-page">
          <div
            className="flex flex-wrap items-end justify-between gap-6"
            data-reveal=""
          >
            <div>
              <p className="eyebrow text-gold">Selección destacada</p>
              <h2 className="mt-3 max-w-xl text-balance font-display text-4xl leading-[1.1] sm:text-[42px]">
                Propiedades que vale la pena ver.
              </h2>
            </div>
            <ButtonLink href="/propiedades" variant="outline" size="sm">
              Explorar portafolio
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </ButtonLink>
          </div>

          {featured.length > 0 ? (
            <div className="mt-10 grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((property, index) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  eager={index === 0}
                  revealDelay={index}
                />
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-3xl border border-dashed border-line bg-white/60 p-12 text-center">
              <p className="font-display text-2xl">Pronto publicaremos nuevas propiedades.</p>
              <p className="mt-2 text-sm text-muted">
                Cuéntanos qué buscas y te avisamos cuando llegue algo que encaje.
              </p>
              <ButtonLink href={whatsappLink()} external variant="whatsapp" className="mt-6">
                <MessageCircle className="size-4" aria-hidden="true" />
                Escribir por WhatsApp
              </ButtonLink>
            </div>
          )}
        </div>
      </section>

      {/* Categorías */}
      <section className="bg-sand py-20 lg:py-24">
        <div className="container-page">
          <div className="max-w-2xl" data-reveal="">
            <p className="eyebrow text-gold">Explora a tu manera</p>
            <h2 className="mt-3 font-display text-4xl leading-[1.1] sm:text-[42px]">
              ¿Qué tipo de propiedad buscas?
            </h2>
            <p className="mt-4 text-sm leading-6 text-muted">
              Desde un apartamento en El Cangrejo hasta una finca en Dolega o una casa
              frente al mar en Coronado. Empieza por la categoría que mejor se adapte
              a tu plan.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((category, index) => (
              <div key={category.name} data-reveal="" style={revealDelay(index)}>
                <Link
                  href={`/propiedades?type=${encodeURIComponent(category.name)}`}
                  className="group flex h-full flex-col justify-between gap-8 rounded-2xl bg-cream/70 p-4 ring-1 ring-line transition-colors hover:bg-white hover:ring-gold/40"
                >
                  <span className="grid size-11 place-items-center rounded-xl bg-deep/[0.06] text-teal transition-colors group-hover:bg-deep group-hover:text-cream">
                    <CategoryIcon category={category.name} className="size-5" />
                  </span>
                  <span>
                    <span className="block text-[13px] leading-snug font-semibold text-ink">
                      {category.name}
                    </span>
                    <span className="mt-1 block text-[11.5px] text-muted">
                      {category.count} {category.count === 1 ? "propiedad" : "propiedades"}
                    </span>
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Provincias */}
      <section className="py-20 lg:py-28">
        <div className="container-page grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start" data-reveal="">
            <p className="eyebrow text-gold">De costa a montaña</p>
            <h2 className="mt-3 font-display text-4xl leading-[1.1] sm:text-[42px]">
              Explora por provincia.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-muted">
              Panamá es mucho más que su capital. Propiedades en las montañas de Boquete
              y Volcán, en las playas de Coronado, en el Caribe de Bocas del Toro o en el
              interior del país.
            </p>
            <ButtonLink href="/propiedades" className="mt-7" size="md">
              Ver todo el portafolio
              <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
          </div>

          <div className="border-t border-line">
            {provinces.map((province, index) => (
              <div key={province.name} data-reveal="" style={revealDelay(index)}>
                <Link
                  href={`/propiedades?province=${encodeURIComponent(province.name)}`}
                  className="group flex items-center justify-between gap-6 border-b border-line py-5 transition-colors hover:bg-sand/50"
                >
                  <span className="flex items-center gap-3">
                    <MapPin className="size-4 text-gold" aria-hidden="true" />
                    <span className="font-display text-[22px] tracking-tight text-ink transition-colors group-hover:text-teal">
                      {province.name}
                    </span>
                  </span>
                  <span className="flex items-center gap-4 text-[12px] text-muted">
                    {province.count} {province.count === 1 ? "propiedad" : "propiedades"}
                    <span className="grid size-8 place-items-center rounded-full border border-line transition-all group-hover:border-deep group-hover:bg-deep group-hover:text-cream">
                      <ArrowUpRight className="size-3.5" aria-hidden="true" />
                    </span>
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nosotros */}
      <section className="bg-sand py-20 lg:py-28">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="relative" data-reveal="">
            <div className="overflow-hidden rounded-[2rem]">
              <img
                src="/about.jpg"
                alt="Villa contemporánea con piscina"
                loading="lazy"
                className="aspect-[4/3] w-full object-cover"
                data-reveal-image=""
              />
            </div>
            <div className="absolute -bottom-5 left-5 rounded-2xl bg-deep px-5 py-4 text-cream shadow-soft sm:left-8">
              <p className="text-[10px] font-semibold tracking-[0.18em] text-gold uppercase">
                Dónde trabajamos
              </p>
              <p className="mt-1 text-[13px] font-medium">Ciudad de Panamá · Boquete · Coronado</p>
            </div>
          </div>

          <div data-reveal="" style={revealDelay(1)}>
            <p className="eyebrow text-gold">Nuestra forma de trabajar</p>
            <h2 className="mt-3 text-balance font-display text-4xl leading-[1.1] sm:text-[42px]">
              Bienes raíces con criterio local.
            </h2>
            <p className="mt-5 text-sm leading-7 text-muted">
              Conocemos Panamá: el frío de Boquete, el calor de David y el tráfico de la
              capital a las 8:00 a. m. Por eso cada ficha incluye información honesta y
              fotos que muestran la propiedad tal como es.
            </p>

            <ul className="mt-8 space-y-6">
              {values.map((value) => (
                <li key={value.title} className="flex gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-cream text-teal ring-1 ring-line">
                    <value.icon className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink">{value.title}</p>
                    <p className="mt-1 text-[13px] leading-6 text-muted">{value.text}</p>
                  </div>
                </li>
              ))}
            </ul>

            <ButtonLink href="/nosotros" variant="outline" className="mt-9">
              Conoce más sobre nosotros
              <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-24">
        <div className="container-page">
          <div
            className="relative isolate overflow-hidden rounded-[2rem] bg-deep px-6 py-14 text-cream sm:px-12 lg:px-16 lg:py-20"
            data-reveal=""
          >
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_120%_at_85%_10%,rgba(232,185,63,0.26),transparent_60%)]" />
            <div className="absolute -right-10 -bottom-16 -z-10 font-display text-[220px] leading-none text-white/[0.035] select-none">
              Istmo
            </div>

            <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
              <div>
                <p className="eyebrow text-gold">Hablemos</p>
                <h2 className="mt-3 max-w-xl text-balance font-display text-4xl leading-[1.08] sm:text-5xl">
                  ¿Buscas algo en particular?
                </h2>
                <p className="mt-4 max-w-lg text-sm leading-7 text-cream/70">
                  Cuéntanos qué necesitas y te enviamos opciones que realmente encajen:
                  ubicación, presupuesto, tamaño y estilo de vida.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-stretch">
                <ButtonLink
                  href={whatsappLink({
                    message: "Hola, quiero ayuda para encontrar una propiedad en Panamá.",
                  })}
                  external
                  variant="gold"
                  size="lg"
                >
                  <MessageCircle className="size-4" aria-hidden="true" />
                  Escribir por WhatsApp
                </ButtonLink>
                <ButtonLink
                  href={site.phoneHref}
                  external
                  variant="outline"
                  size="lg"
                  className="border-white/25 text-cream hover:border-white/45 hover:bg-white/10"
                >
                  <Phone className="size-4" aria-hidden="true" />
                  {site.phone}
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
