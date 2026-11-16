import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Bath,
  BedDouble,
  Car,
  Check,
  ChevronRight,
  Clock,
  Mail,
  MapPin,
  Maximize,
  MessageCircle,
  Phone,
  Tag,
} from "lucide-react";

import { site, whatsappLink } from "@/config/site";
import { absoluteUrl, formatArea, formatDate, formatPrice, propertyLocation, truncate } from "@/lib/utils";
import { imageUrl } from "@/lib/images";
import { getPropertyBySlug, getSimilarProperties } from "@/lib/properties";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { PropertyCard } from "@/components/properties/property-card";
import { PropertyGallery } from "@/components/properties/property-gallery";
import { PropertyMap } from "@/components/properties/property-map";
import { ShareButton } from "@/components/properties/share-button";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) return { title: "Propiedad no encontrada" };

  const description = truncate(
    (property.description ?? `${property.property_type} en ${propertyLocation(property)}`).replace(/\s+/g, " "),
    158,
  );
  const image = imageUrl(property.images[0]);

  return {
    title: property.title,
    description,
    alternates: { canonical: `/propiedades/${property.slug ?? property.id}` },
    openGraph: {
      title: property.title,
      description,
      images: [{ url: image, alt: property.title }],
      type: "website",
      locale: "es_PA",
    },
    twitter: {
      card: "summary_large_image",
      title: property.title,
      description,
      images: [image],
    },
  };
}

export default async function PropertyPage({ params }: PageProps) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) notFound();

  const similar = await getSimilarProperties(property);
  const location = propertyLocation(property);
  const canonical = absoluteUrl(`/propiedades/${property.slug ?? property.id}`);
  const message = `Hola, me interesa la propiedad "${property.title}" (${location}). ¿Sigue disponible?`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Residence",
    name: property.title,
    description: property.description ?? undefined,
    url: canonical,
    image: property.images.map((image) => absoluteUrl(imageUrl(image))),
    address: {
      "@type": "PostalAddress",
      streetAddress: property.neighborhood ?? undefined,
      addressLocality: property.district,
      addressRegion: property.province,
      addressCountry: "PA",
    },
    numberOfRooms: property.bedrooms ?? undefined,
    numberOfBathroomsTotal: property.bathrooms ?? undefined,
    floorSize:
      property.area_m2 != null
        ? { "@type": "QuantitativeValue", value: property.area_m2, unitCode: "MTK" }
        : undefined,
    offers: {
      "@type": "Offer",
      price: property.price,
      priceCurrency: property.currency,
      availability: "https://schema.org/InStock",
      url: canonical,
    },
  };

  const details = [
    { label: "Operación", value: property.transaction_type },
    { label: "Tipo", value: property.property_type },
    property.bedrooms != null
      ? { label: "Habitaciones", value: `${property.bedrooms}` }
      : null,
    property.bathrooms != null ? { label: "Baños", value: `${property.bathrooms}` } : null,
    property.parking_spots != null
      ? { label: "Parqueos", value: `${property.parking_spots}` }
      : null,
    property.area_m2 != null ? { label: "Área", value: formatArea(property.area_m2) } : null,
    { label: "Amueblada", value: property.is_furnished ? "Sí" : "No" },
    { label: "Publicado", value: formatDate(property.created_at) },
  ].filter((detail): detail is { label: string; value: string } => detail !== null);

  const paragraphs = (property.description ?? "")
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="pt-26 pb-16 sm:pt-30">
        <div className="container-page">
          <nav aria-label="Ruta de navegación" className="flex flex-wrap items-center gap-1.5 text-[11.5px] text-muted">
            <Link href="/" className="transition-colors hover:text-ink">
              Inicio
            </Link>
            <ChevronRight className="size-3" aria-hidden="true" />
            <Link href="/propiedades" className="transition-colors hover:text-ink">
              Propiedades
            </Link>
            <ChevronRight className="size-3" aria-hidden="true" />
            <Link
              href={`/propiedades?province=${encodeURIComponent(property.province)}`}
              className="transition-colors hover:text-ink"
            >
              {property.province}
            </Link>
            <ChevronRight className="size-3" aria-hidden="true" />
            <span className="max-w-52 truncate text-ink/70">{property.title}</span>
          </nav>

          <header className="mt-7 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="dark">{property.transaction_type}</Badge>
                <Badge tone="sand">{property.property_type}</Badge>
                {property.is_featured && <Badge tone="gold">Destacada</Badge>}
                {property.is_furnished && <Badge tone="green">Amueblada</Badge>}
              </div>

              <h1 className="mt-4 text-balance font-display text-[34px] leading-[1.06] sm:text-5xl">
                {property.title}
              </h1>

              <p className="mt-3 flex items-center gap-2 text-[13.5px] text-muted">
                <MapPin className="size-4 shrink-0 text-gold" aria-hidden="true" />
                {location}
              </p>
            </div>

            <div className="shrink-0 lg:text-right">
              <p className="text-[10px] font-semibold tracking-[0.18em] text-muted uppercase">
                {property.transaction_type === "Alquiler" ? "Alquiler mensual" : "Precio de venta"}
              </p>
              <p className="mt-1 font-display text-4xl leading-none tracking-tight">
                {formatPrice(property.price, property.currency)}
                {property.transaction_type === "Alquiler" && (
                  <span className="ml-1 font-sans text-sm font-medium text-muted">/mes</span>
                )}
              </p>
              <p className="mt-2 inline-flex items-center gap-1.5 text-[11.5px] text-muted">
                <Tag className="size-3" aria-hidden="true" />
                Ref. {property.id.slice(0, 8).toUpperCase()}
              </p>
            </div>
          </header>

          <div className="mt-8">
            <PropertyGallery images={property.images} title={property.title} />
          </div>

          <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_360px] lg:gap-14 xl:grid-cols-[1fr_390px]">
            <div className="min-w-0">
              <section aria-labelledby="descripcion">
                <h2 id="descripcion" className="font-display text-2xl">
                  Sobre esta propiedad
                </h2>
                {paragraphs.length > 0 ? (
                  <div className="mt-4 space-y-4 text-[14.5px] leading-7 text-ink/75">
                    {paragraphs.map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-muted">
                    Contáctanos para conocer todos los detalles de esta propiedad.
                  </p>
                )}
              </section>

              <section aria-labelledby="detalles" className="mt-10 border-t border-line pt-9">
                <h2 id="detalles" className="font-display text-2xl">
                  Detalles
                </h2>
                <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {details.map((detail) => (
                    <div key={detail.label} className="rounded-xl bg-sand/70 px-4 py-3.5">
                      <dt className="text-[10.5px] font-semibold tracking-[0.1em] text-muted uppercase">
                        {detail.label}
                      </dt>
                      <dd className="mt-1 text-[13.5px] font-semibold text-ink">{detail.value}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-5 hidden flex-wrap gap-4 text-[12.5px] text-muted sm:flex">
                  {property.bedrooms != null && (
                    <span className="inline-flex items-center gap-1.5">
                      <BedDouble className="size-4 text-teal" aria-hidden="true" />
                      {property.bedrooms} habitaciones
                    </span>
                  )}
                  {property.bathrooms != null && (
                    <span className="inline-flex items-center gap-1.5">
                      <Bath className="size-4 text-teal" aria-hidden="true" />
                      {property.bathrooms} baños
                    </span>
                  )}
                  {property.parking_spots != null && (
                    <span className="inline-flex items-center gap-1.5">
                      <Car className="size-4 text-teal" aria-hidden="true" />
                      {property.parking_spots} parqueos
                    </span>
                  )}
                  {property.area_m2 != null && (
                    <span className="inline-flex items-center gap-1.5">
                      <Maximize className="size-4 text-teal" aria-hidden="true" />
                      {formatArea(property.area_m2)}
                    </span>
                  )}
                </div>
              </section>

              {property.amenities.length > 0 && (
                <section aria-labelledby="amenidades" className="mt-10 border-t border-line pt-9">
                  <h2 id="amenidades" className="font-display text-2xl">
                    Características y amenidades
                  </h2>
                  <ul className="mt-5 grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
                    {property.amenities.map((amenity) => (
                      <li key={amenity} className="flex items-center gap-2.5 text-[13.5px] text-ink/75">
                        <span className="grid size-5 shrink-0 place-items-center rounded-full bg-teal-50 text-teal">
                          <Check className="size-3" aria-hidden="true" />
                        </span>
                        {amenity}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <section aria-labelledby="ubicacion" className="mt-10 border-t border-line pt-9">
                <h2 id="ubicacion" className="font-display text-2xl">
                  Ubicación
                </h2>
                <p className="mt-2 text-[13px] text-muted">
                  {property.neighborhood
                    ? `${property.neighborhood}, ${property.district}, ${property.province}`
                    : `${property.district}, ${property.province}`}
                </p>
                <div className="mt-5">
                  <PropertyMap property={property} />
                </div>
              </section>
            </div>

            <aside className="lg:relative">
              <div className="lg:sticky lg:top-28">
                <div className="rounded-2xl border border-line bg-white p-6 shadow-card">
                  <p className="eyebrow text-gold">¿Te interesa?</p>
                  <h2 className="mt-2 font-display text-[26px] leading-tight">
                    Agenda una visita
                  </h2>
                  <p className="mt-2 text-[13px] leading-6 text-muted">
                    Escríbenos y coordinamos una visita o te enviamos más fotos, planos y
                    información del entorno.
                  </p>

                  <div className="mt-5 space-y-2">
                    <ButtonLink
                      href={whatsappLink({ message, url: canonical })}
                      external
                      variant="whatsapp"
                      size="lg"
                      className="w-full"
                    >
                      <MessageCircle className="size-4" aria-hidden="true" />
                      Solicitar información
                    </ButtonLink>
                    <ButtonLink
                      href={site.phoneHref}
                      external
                      variant="outline"
                      className="w-full"
                    >
                      <Phone className="size-4" aria-hidden="true" />
                      {site.phone}
                    </ButtonLink>
                  </div>

                  <div className="mt-6 border-t border-line pt-5">
                    <p className="text-[13px] font-semibold text-ink">{site.name}</p>
                    <p className="mt-0.5 text-[11.5px] text-muted">Asesoría directa</p>

                    <ul className="mt-4 space-y-2.5 text-[12.5px] text-ink/75">
                      <li>
                        <a
                          href={`mailto:${site.email}?subject=${encodeURIComponent(property.title)}`}
                          className="flex items-center gap-2 transition-colors hover:text-teal"
                        >
                          <Mail className="size-4 text-teal" aria-hidden="true" />
                          {site.email}
                        </a>
                      </li>
                      <li className="flex items-start gap-2 text-muted">
                        <Clock className="mt-0.5 size-4 shrink-0 text-teal" aria-hidden="true" />
                        {site.hours}
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-3">
                  <ShareButton title={property.title} text={location} />
                </div>

                <p className="mt-4 rounded-xl bg-teal-50 px-4 py-3 text-[11.5px] leading-5 text-teal">
                  Respondemos el mismo día hábil. Podemos coordinar visitas presenciales o
                  recorridos por video.
                </p>
              </div>
            </aside>
          </div>
        </div>

        {similar.length > 0 && (
          <section className="mt-20 border-t border-line pt-14">
            <div className="container-page">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="eyebrow text-gold">También te puede interesar</p>
                  <h2 className="mt-2.5 font-display text-3xl sm:text-4xl">
                    Propiedades similares
                  </h2>
                </div>
                <Link
                  href={`/propiedades?province=${encodeURIComponent(property.province)}`}
                  className="text-[12.5px] font-semibold text-teal hover:underline"
                >
                  Ver más en {property.province}
                </Link>
              </div>

              <div className="mt-8 grid gap-x-6 gap-y-11 sm:grid-cols-2 lg:grid-cols-3">
                {similar.map((item) => (
                  <PropertyCard key={item.id} property={item} />
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
