import type { Property, TransactionType } from "@/lib/types";

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

const priceFormatter = new Intl.NumberFormat("es-PA", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

export function formatPrice(value: number, currency = "USD"): string {
  if (!Number.isFinite(value)) return "—";
  if (currency === "PAB") {
    return `B/. ${new Intl.NumberFormat("es-PA", { maximumFractionDigits: 0 }).format(value)}`;
  }
  return priceFormatter.format(value).replace(/\s/g, " ");
}

/** Devuelve " /mes" para alquileres, para usar junto al precio. */
export function priceSuffix(transaction: TransactionType): string {
  return transaction === "Alquiler" ? " /mes" : "";
}

export function formatNumber(value: number, maximumFractionDigits = 0): string {
  return new Intl.NumberFormat("es-PA", { maximumFractionDigits }).format(value);
}

/** Áreas grandes se muestran en hectáreas (1 ha = 10,000 m²). */
export function formatArea(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return "—";
  if (value >= 10_000) {
    return `${formatNumber(value / 10_000, 1)} ha`;
  }
  return `${formatNumber(value)} m²`;
}

export function formatDate(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("es-PA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

/** Convierte "Casa en Boquete · Vista al volcán" en "casa-en-boquete-vista-al-volcan". */
export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ñ/gi, "n")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72)
    .replace(/-+$/g, "");
}

export function absoluteUrl(path: string): string {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/+$/, "");
  return path.startsWith("http") ? path : `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}…`;
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function pluralize(count: number, singular: string, plural: string): string {
  return count === 1 ? singular : plural;
}

/** "Punta Pacífica, Panamá" sin repetir distrito/provincia cuando coinciden. */
export function propertyLocation(
  property: Pick<Property, "neighborhood" | "district" | "province">,
): string {
  const parts = [property.neighborhood, property.district, property.province].filter(
    (part): part is string => Boolean(part),
  );
  return parts.filter((part, index) => index === 0 || part !== parts[index - 1]).join(", ");
}
