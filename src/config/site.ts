/**
 * Datos del negocio. Este es el ÚNICO archivo que hay que editar para
 * personalizar el portal (nombre, contacto, redes, horario).
 * Reemplaza los datos de ejemplo por los reales antes de publicar.
 */
export const site = {
  name: "Istmo Propiedades",
  shortName: "Istmo",
  tagline: "Bienes raíces en Panamá",
  description:
    "Casas, apartamentos, fincas y propiedades frente al mar en Panamá. Asesoría personalizada para comprar, vender o alquilar.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/+$/, ""),
  locale: "es_PA",

  // --- Contacto (REEMPLAZAR) ---
  phone: "+507 6000-0000",
  phoneHref: "tel:+50760000000",
  whatsapp: "50760000000", // solo dígitos, con código de país
  email: "hola@istmopropiedades.com",
  address: "Ciudad de Panamá, Panamá",
  hours: "Lun–Vie 9:00–18:00 · Sáb 9:00–13:00",

  // --- Redes sociales (dejar vacío para ocultar) ---
  instagram: "",
  facebook: "",
} as const;

type WhatsAppOptions = {
  /** Mensaje prellenado. */
  message?: string;
  /** Página de origen, ayuda a saber de qué propiedad escribe el cliente. */
  url?: string;
};

export function whatsappLink({ message, url }: WhatsAppOptions = {}): string {
  const lines = [message ?? `Hola ${site.name}, quiero más información sobre una propiedad.`];
  if (url) lines.push("", url);
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`;
}

export const siteNav = [
  { href: "/propiedades?transaction=Venta", label: "Comprar" },
  { href: "/propiedades?transaction=Alquiler", label: "Alquilar" },
  { href: "/propiedades", label: "Propiedades" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
] as const;
