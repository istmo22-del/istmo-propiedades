import Link from "next/link";
import { ArrowUpRight, Bath, BedDouble, Car, MapPin, Maximize } from "lucide-react";

import type { Property } from "@/lib/types";
import { formatArea, formatPrice, propertyLocation } from "@/lib/utils";
import { imageUrl } from "@/lib/images";
import { Badge } from "@/components/ui/badge";
import { revealDelay as revealDelayStyle } from "@/components/ui/reveal";

export function PropertyCard({
  property,
  eager = false,
  revealDelay,
}: {
  property: Property;
  eager?: boolean;
  revealDelay?: number;
}) {
  const href = `/propiedades/${property.slug ?? property.id}`;

  const specs = [
    property.bedrooms != null
      ? { icon: BedDouble, label: `${property.bedrooms} hab.` }
      : null,
    property.bathrooms != null
      ? { icon: Bath, label: `${property.bathrooms} baños` }
      : null,
    property.parking_spots != null
      ? { icon: Car, label: `${property.parking_spots} parqueos` }
      : null,
    property.area_m2 != null
      ? { icon: Maximize, label: formatArea(property.area_m2) }
      : null,
  ].filter((spec): spec is { icon: typeof BedDouble; label: string } => Boolean(spec));

  return (
    <article
      className="group"
      data-reveal={revealDelay === undefined ? undefined : ""}
      style={revealDelay === undefined ? undefined : revealDelayStyle(revealDelay)}
    >
      <Link href={href} className="block">
        <div
          className="relative aspect-[4/3] overflow-hidden rounded-[1.35rem] bg-sand"
          data-reveal-image=""
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl(property.images[0])}
            alt={property.title}
            loading={eager ? "eager" : "lazy"}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
          />

          <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3.5">
            <div className="flex flex-wrap gap-1.5">
              <Badge tone="dark">{property.transaction_type}</Badge>
              {property.is_featured && <Badge tone="gold">Destacada</Badge>}
            </div>
            {property.is_furnished && <Badge tone="glass">Amueblada</Badge>}
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-ink/75 via-ink/25 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
            <div className="text-cream">
              <p className="text-[10px] font-semibold tracking-[0.18em] text-cream/65 uppercase">
                {property.transaction_type === "Alquiler" ? "Alquiler mensual" : "Precio"}
              </p>
              <p className="mt-0.5 font-display text-[26px] leading-none tracking-tight">
                {formatPrice(property.price, property.currency)}
                {property.transaction_type === "Alquiler" && (
                  <span className="ml-1 font-sans text-[12px] font-medium tracking-normal text-cream/70">
                    /mes
                  </span>
                )}
              </p>
            </div>
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/15 text-cream ring-1 ring-white/30 backdrop-blur-sm transition-all duration-300 group-hover:bg-cream group-hover:text-ink">
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </span>
          </div>
        </div>

        <div className="px-1 pt-4">
          <p className="eyebrow text-teal/70">{property.property_type}</p>
          <h3 className="mt-1.5 line-clamp-2 font-display text-[21px] leading-[1.25] text-ink transition-colors group-hover:text-teal">
            {property.title}
          </h3>
          <p className="mt-2 flex items-center gap-1.5 text-[13px] text-muted">
            <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
            {propertyLocation(property)}
          </p>

          {specs.length > 0 && (
            <div className="mt-3.5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line/80 pt-3 text-[12.5px] font-medium text-ink/65">
              {specs.map(({ icon: Icon, label }) => (
                <span key={label} className="inline-flex items-center gap-1.5">
                  <Icon className="size-4 text-muted/80" aria-hidden="true" />
                  {label}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}
