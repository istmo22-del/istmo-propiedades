import { z } from "zod";

import { MAX_IMAGES } from "@/lib/constants";
import { isValidProvince } from "@/lib/panama";
import { PROPERTY_CATEGORIES, PROPERTY_STATUSES, TRANSACTION_TYPES } from "@/lib/types";

const optionalInt = (min: number, max: number, message: string) =>
  z.preprocess(
    (value) => (value === "" || value == null ? undefined : value),
    z.coerce.number({ message }).int(message).min(min, message).max(max, message).optional(),
  );

const optionalNumber = (min: number, max: number, message: string) =>
  z.preprocess(
    (value) => (value === "" || value == null ? undefined : value),
    z.coerce.number({ message }).min(min, message).max(max, message).optional(),
  );

/** Campos de texto del formulario (las imágenes se procesan en la action). */
export const propertyFieldsSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "El título debe tener al menos 5 caracteres.")
    .max(160, "El título no puede superar 160 caracteres."),
  description: z
    .string()
    .trim()
    .max(8000, "La descripción no puede superar 8000 caracteres.")
    .optional()
    .transform((value) => value || null),
  price: z.coerce
    .number({ message: "Indica un precio válido." })
    .positive("El precio debe ser mayor a 0.")
    .max(100_000_000, "El precio es demasiado alto."),
  transaction_type: z.enum(TRANSACTION_TYPES, { message: "Selecciona Venta o Alquiler." }),
  property_type: z.enum(PROPERTY_CATEGORIES, { message: "Selecciona un tipo de propiedad." }),
  province: z
    .string()
    .trim()
    .min(1, "Selecciona una provincia.")
    .refine(isValidProvince, "Selecciona una provincia válida."),
  district: z.string().trim().min(2, "Selecciona un distrito.").max(80),
  neighborhood: z
    .string()
    .trim()
    .max(120, "El barrio no puede superar 120 caracteres.")
    .optional()
    .transform((value) => value || null),
  bedrooms: optionalInt(0, 50, "Usa un número entre 0 y 50."),
  bathrooms: optionalInt(0, 50, "Usa un número entre 0 y 50."),
  parking_spots: optionalInt(0, 50, "Usa un número entre 0 y 50."),
  area_m2: optionalNumber(1, 50_000_000, "El área debe ser mayor a 0."),
  latitude: optionalNumber(-90, 90, "La latitud debe estar entre -90 y 90."),
  longitude: optionalNumber(-180, 180, "La longitud debe estar entre -180 y 180."),
  is_furnished: z.boolean(),
  status: z.enum(PROPERTY_STATUSES),
  is_featured: z.boolean(),
  amenities: z.array(z.string().trim().min(1).max(80)).max(60),
});

export type PropertyFields = z.infer<typeof propertyFieldsSchema>;

export function parsePropertyForm(formData: FormData) {
  const raw = {
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    price: String(formData.get("price") ?? ""),
    transaction_type: String(formData.get("transaction_type") ?? ""),
    property_type: String(formData.get("property_type") ?? ""),
    province: String(formData.get("province") ?? ""),
    district: String(formData.get("district") ?? ""),
    neighborhood: String(formData.get("neighborhood") ?? ""),
    bedrooms: String(formData.get("bedrooms") ?? ""),
    bathrooms: String(formData.get("bathrooms") ?? ""),
    parking_spots: String(formData.get("parking_spots") ?? ""),
    area_m2: String(formData.get("area_m2") ?? ""),
    latitude: String(formData.get("latitude") ?? ""),
    longitude: String(formData.get("longitude") ?? ""),
    is_furnished: formData.get("is_furnished") === "on" || formData.get("is_furnished") === "true",
    status: String(formData.get("status") ?? "draft"),
    is_featured: formData.get("is_featured") === "on" || formData.get("is_featured") === "true",
    amenities: formData.getAll("amenities").map(String).filter(Boolean),
  };

  return propertyFieldsSchema.safeParse(raw);
}

/** Lista de imágenes ya guardadas que el usuario mantiene (hidden input JSON). */
export function parseExistingImages(formData: FormData): string[] {
  const raw = formData.get("images");
  if (typeof raw !== "string" || !raw.trim()) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string" && item.length > 0).slice(0, MAX_IMAGES);
  } catch {
    return [];
  }
}
