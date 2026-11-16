import { ExternalLink, MapPin } from "lucide-react";

import type { Property } from "@/lib/types";
import { propertyLocation } from "@/lib/utils";

export function PropertyMap({ property }: { property: Property }) {
  const hasCoordinates = property.latitude != null && property.longitude != null;
  const mapQuery = hasCoordinates
    ? `${property.latitude},${property.longitude}`
    : `${property.neighborhood ?? ""}, ${property.district}, ${property.province}, Panamá`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;

  return (
    <div>
      {hasCoordinates ? (
        <div className="overflow-hidden rounded-2xl border border-line bg-sand">
          <iframe
            title={`Mapa de ${property.title}`}
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${property.longitude! - 0.01}%2C${
              property.latitude! - 0.01
            }%2C${property.longitude! + 0.01}%2C${property.latitude! + 0.01}&layer=mapnik&marker=${property.latitude}%2C${
              property.longitude
            }`}
            className="h-80 w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      ) : (
        <div className="flex h-56 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-line bg-sand/60 text-center">
          <span className="grid size-12 place-items-center rounded-full bg-white text-teal ring-1 ring-line">
            <MapPin className="size-5" aria-hidden="true" />
          </span>
          <div>
            <p className="font-display text-lg">{propertyLocation(property)}</p>
            <p className="mt-1 text-[12px] text-muted">
              Coordenadas exactas disponibles al coordinar una visita.
            </p>
          </div>
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[12px] text-muted">
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="size-3.5 text-gold" aria-hidden="true" />
          {propertyLocation(property)}
        </span>
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-semibold text-teal hover:underline"
        >
          Ver en Google Maps
          <ExternalLink className="size-3.5" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
