"use client";

import { useActionState, useState, type ReactNode } from "react";
import Link from "next/link";
import { AlertCircle, ChevronDown, Loader2, Save } from "lucide-react";

import { savePropertyAction } from "@/app/admin/(panel)/propiedades/actions";
import { AMENITY_GROUPS } from "@/lib/constants";
import { districtsOf, PANAMA_PROVINCES } from "@/lib/panama";
import {
  PROPERTY_CATEGORIES,
  PROPERTY_STATUSES,
  TRANSACTION_TYPES,
  type Property,
} from "@/lib/types";
import { STATUS_META } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ImageManager } from "@/components/admin/image-manager";

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
      <div className="mb-5 border-b border-line pb-4">
        <h2 className="font-display text-xl">{title}</h2>
        {description && <p className="mt-1 text-[12px] leading-5 text-muted">{description}</p>}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

function Field({
  label,
  htmlFor,
  error,
  hint,
  required,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="label">
        {label}
        {required && <span className="ml-0.5 text-gold">*</span>}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 text-[11.5px] text-red-700">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-[11.5px] text-muted">{hint}</p>
      ) : null}
    </div>
  );
}

export function PropertyForm({
  mode,
  property,
  demo = false,
}: {
  mode: "create" | "edit";
  property?: Property;
  demo?: boolean;
}) {
  const [state, action, pending] = useActionState(savePropertyAction, null);
  const [province, setProvince] = useState(property?.province ?? "Panamá");
  const [district, setDistrict] = useState(property?.district ?? "");

  const districts = districtsOf(province);
  const districtOptions = districts.includes(district)
    ? districts
    : [district, ...districts].filter(Boolean);
  const selectedAmenities = new Set(property?.amenities ?? []);
  const fieldError = (name: string) => state?.fieldErrors?.[name]?.[0];

  return (
    <form action={action} className="space-y-5">
      {property?.id && <input type="hidden" name="id" value={property.id} />}

      {state?.error && (
        <div className="flex gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[12.5px] leading-5 text-red-800">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {state.error}
        </div>
      )}

      {demo && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[12.5px] leading-5 text-amber-900">
          <strong className="font-semibold">Modo demostración.</strong> Puedes explorar el
          formulario, pero los cambios no se guardan hasta configurar Supabase.
        </div>
      )}

      <FormSection
        title="Información principal"
        description="Lo primero que verá el cliente en el listado y en la ficha."
      >
        <Field
          label="Título"
          htmlFor="title"
          required
          error={fieldError("title")}
          className="sm:col-span-2"
        >
          <input
            id="title"
            name="title"
            defaultValue={property?.title ?? ""}
            placeholder="Ej. Casa de campo en Boquete con vista al volcán"
            className={cn("field", fieldError("title") && "border-red-300")}
          />
        </Field>

        <div>
          <span className="label">Operación</span>
          <div className="grid grid-cols-2 gap-2">
            {TRANSACTION_TYPES.map((transaction) => (
              <label key={transaction} className="cursor-pointer">
                <input
                  type="radio"
                  name="transaction_type"
                  value={transaction}
                  defaultChecked={(property?.transaction_type ?? "Venta") === transaction}
                  className="peer sr-only"
                />
                <span className="block rounded-xl border border-line px-3 py-2.5 text-center text-[12.5px] font-semibold text-ink/65 transition peer-checked:border-deep peer-checked:bg-deep peer-checked:text-cream peer-focus-visible:ring-2 peer-focus-visible:ring-gold">
                  {transaction}
                </span>
              </label>
            ))}
          </div>
          {fieldError("transaction_type") && (
            <p className="mt-1.5 text-[11.5px] text-red-700">{fieldError("transaction_type")}</p>
          )}
        </div>

        <Field
          label="Tipo de propiedad"
          htmlFor="property_type"
          required
          error={fieldError("property_type")}
        >
          <select
            id="property_type"
            name="property_type"
            defaultValue={property?.property_type ?? ""}
            className={cn("field", fieldError("property_type") && "border-red-300")}
          >
            <option value="">Selecciona una categoría</option>
            {PROPERTY_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </Field>

        <Field
          label="Precio (USD)"
          htmlFor="price"
          required
          error={fieldError("price")}
          hint={property?.transaction_type === "Alquiler" ? "Precio mensual." : "Precio total de venta."}
        >
          <input
            id="price"
            name="price"
            type="number"
            min={0}
            step="any"
            inputMode="decimal"
            defaultValue={property?.price ?? ""}
            placeholder="250000"
            className={cn("field", fieldError("price") && "border-red-300")}
          />
        </Field>

        <div>
          <span className="label">Moneda</span>
          <div className="flex h-11 items-center rounded-xl border border-line bg-sand/50 px-3.5 text-sm text-muted">
            USD · Dólar estadounidense
          </div>
        </div>

        <Field
          label="Descripción"
          htmlFor="description"
          error={fieldError("description")}
          hint="Separa los párrafos con una línea en blanco."
          className="sm:col-span-2"
        >
          <textarea
            id="description"
            name="description"
            rows={8}
            defaultValue={property?.description ?? ""}
            placeholder="Describe la propiedad, el entorno y lo que la hace especial…"
            className="field-textarea"
          />
        </Field>
      </FormSection>

      <FormSection title="Ubicación" description="Se usa en los filtros y en el mapa de la ficha.">
        <Field
          label="Provincia"
          htmlFor="province"
          required
          error={fieldError("province")}
        >
          <div className="relative">
            <select
              id="province"
              name="province"
              value={province}
              onChange={(event) => {
                setProvince(event.target.value);
                setDistrict("");
              }}
              className="field appearance-none pr-9"
            >
              <option value="">Selecciona una provincia</option>
              {PANAMA_PROVINCES.map((item) => (
                <option key={item.name} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted"
              aria-hidden="true"
            />
          </div>
        </Field>

        <Field label="Distrito" htmlFor="district" required error={fieldError("district")}>
          <div className="relative">
            <select
              id="district"
              name="district"
              value={district}
              onChange={(event) => setDistrict(event.target.value)}
              disabled={!province}
              className="field appearance-none pr-9 disabled:bg-sand/60"
            >
              <option value="">Selecciona un distrito</option>
              {districtOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted"
              aria-hidden="true"
            />
          </div>
        </Field>

        <Field label="Barrio o zona" htmlFor="neighborhood" error={fieldError("neighborhood")}>
          <input
            id="neighborhood"
            name="neighborhood"
            defaultValue={property?.neighborhood ?? ""}
            placeholder="Ej. Jaramillo, Costa del Este…"
            className="field"
          />
        </Field>

        <div className="hidden sm:block" />

        <Field
          label="Latitud"
          htmlFor="latitude"
          error={fieldError("latitude")}
          hint="Opcional. Mejora el mapa de la ficha."
        >
          <input
            id="latitude"
            name="latitude"
            type="number"
            step="any"
            inputMode="decimal"
            defaultValue={property?.latitude ?? ""}
            placeholder="8.7800"
            className="field"
          />
        </Field>

        <Field label="Longitud" htmlFor="longitude" error={fieldError("longitude")}>
          <input
            id="longitude"
            name="longitude"
            type="number"
            step="any"
            inputMode="decimal"
            defaultValue={property?.longitude ?? ""}
            placeholder="-82.4300"
            className="field"
          />
        </Field>
      </FormSection>

      <FormSection title="Detalles" description="Métricas que usan los filtros del buscador.">
        <Field label="Habitaciones" htmlFor="bedrooms" error={fieldError("bedrooms")}>
          <input
            id="bedrooms"
            name="bedrooms"
            type="number"
            min={0}
            max={50}
            inputMode="numeric"
            defaultValue={property?.bedrooms ?? ""}
            placeholder="3"
            className="field"
          />
        </Field>

        <Field label="Baños" htmlFor="bathrooms" error={fieldError("bathrooms")}>
          <input
            id="bathrooms"
            name="bathrooms"
            type="number"
            min={0}
            max={50}
            inputMode="numeric"
            defaultValue={property?.bathrooms ?? ""}
            placeholder="2"
            className="field"
          />
        </Field>

        <Field label="Parqueos" htmlFor="parking_spots" error={fieldError("parking_spots")}>
          <input
            id="parking_spots"
            name="parking_spots"
            type="number"
            min={0}
            max={50}
            inputMode="numeric"
            defaultValue={property?.parking_spots ?? ""}
            placeholder="2"
            className="field"
          />
        </Field>

        <Field
          label="Área (m²)"
          htmlFor="area_m2"
          error={fieldError("area_m2")}
          hint="Para fincas o terrenos grandes escribe el total en m²."
        >
          <input
            id="area_m2"
            name="area_m2"
            type="number"
            min={0}
            step="any"
            inputMode="decimal"
            defaultValue={property?.area_m2 ?? ""}
            placeholder="280"
            className="field"
          />
        </Field>

        <label className="flex items-center gap-2.5 rounded-xl border border-line bg-sand/40 px-4 py-3 text-[13px] font-medium text-ink/80 sm:col-span-2">
          <input
            type="checkbox"
            name="is_furnished"
            defaultChecked={property?.is_furnished ?? false}
            className="size-4 rounded border-line accent-teal"
          />
          La propiedad se entrega amueblada
        </label>
      </FormSection>

      <FormSection
        title="Amenidades"
        description="Marca todo lo que aplica. Aparecen en la ficha y en los filtros."
      >
        <div className="space-y-3 sm:col-span-2">
          {AMENITY_GROUPS.map((group) => {
            const selectedCount = group.items.filter((item) => selectedAmenities.has(item)).length;
            return (
              <details key={group.label} className="group rounded-xl border border-line">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-[12.5px] font-semibold text-ink [&::-webkit-details-marker]:hidden">
                  <span>
                    {group.label}
                    {selectedCount > 0 && (
                      <span className="ml-2 rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal">
                        {selectedCount}
                      </span>
                    )}
                  </span>
                  <ChevronDown
                    className="size-4 text-muted transition-transform group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <div className="grid gap-2 border-t border-line px-4 py-3.5 sm:grid-cols-2">
                  {group.items.map((amenity) => (
                    <label
                      key={amenity}
                      className="flex cursor-pointer items-center gap-2 text-[12.5px] text-ink/75"
                    >
                      <input
                        type="checkbox"
                        name="amenities"
                        value={amenity}
                        defaultChecked={selectedAmenities.has(amenity)}
                        className="size-3.5 rounded border-line accent-teal"
                      />
                      {amenity}
                    </label>
                  ))}
                </div>
              </details>
            );
          })}
        </div>
      </FormSection>

      <FormSection
        title="Imágenes"
        description="La primera imagen se usa como portada en el listado y en las redes sociales."
      >
        <div className="sm:col-span-2">
          <ImageManager initialImages={property?.images ?? []} demo={demo} />
        </div>
      </FormSection>

      <FormSection title="Publicación">
        <Field label="Estado" htmlFor="status" hint={STATUS_META[property?.status ?? "published"].description}>
          <select
            id="status"
            name="status"
            defaultValue={property?.status ?? "published"}
            className="field"
          >
            {PROPERTY_STATUSES.map((status) => (
              <option key={status} value={status}>
                {STATUS_META[status].label}
              </option>
            ))}
          </select>
        </Field>

        <label className="flex items-center gap-2.5 self-end rounded-xl border border-line bg-sand/40 px-4 py-3 text-[13px] font-medium text-ink/80">
          <input
            type="checkbox"
            name="is_featured"
            defaultChecked={property?.is_featured ?? false}
            className="size-4 rounded border-line accent-gold"
          />
          Destacar en la portada
        </label>
      </FormSection>

      <div className="sticky bottom-4 z-20 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-cream/95 px-4 py-3 shadow-soft backdrop-blur">
        <p className="hidden text-[11.5px] text-muted sm:block">
          {mode === "create"
            ? "La propiedad se creará con el estado que elegiste."
            : "Los cambios se publican al guardar."}
        </p>
        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/admin"
            className="inline-flex h-10 items-center justify-center rounded-full px-4 text-[12.5px] font-semibold text-muted transition-colors hover:text-ink"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={pending || demo}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-deep px-5 text-[12.5px] font-semibold text-cream transition-colors hover:bg-deep-800 disabled:opacity-60"
          >
            {pending ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Guardando…
              </>
            ) : (
              <>
                <Save className="size-4" aria-hidden="true" />
                {mode === "create" ? "Crear propiedad" : "Guardar cambios"}
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
