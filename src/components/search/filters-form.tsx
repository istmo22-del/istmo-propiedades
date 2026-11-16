"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, RotateCcw, Search } from "lucide-react";

import { AMENITY_GROUPS, BATHROOM_OPTIONS, BEDROOM_OPTIONS } from "@/lib/constants";
import { districtsOf, PANAMA_PROVINCES } from "@/lib/panama";
import { PROPERTY_CATEGORIES, type PropertyFilters } from "@/lib/types";
import { cn } from "@/lib/utils";

export function FiltersForm({
  filters,
  idPrefix = "f",
}: {
  filters: PropertyFilters;
  idPrefix?: string;
}) {
  const [province, setProvince] = useState(filters.province ?? "");
  const [district, setDistrict] = useState(filters.district ?? "");
  const districts = districtsOf(province);
  const selectedAmenities = new Set(filters.amenities);

  return (
    <form action="/propiedades" method="get" className="space-y-6">
      {filters.sort !== "recent" && <input type="hidden" name="sort" value={filters.sort} />}

      <div>
        <label htmlFor={`${idPrefix}-q`} className="label">
          Buscar
        </label>
        <div className="relative">
          <Search
            className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted/70"
            aria-hidden="true"
          />
          <input
            id={`${idPrefix}-q`}
            name="q"
            type="search"
            defaultValue={filters.q ?? ""}
            placeholder="Boquete, vista al mar, finca…"
            className="field pl-10"
          />
        </div>
      </div>

      <fieldset>
        <legend className="label">Operación</legend>
        <div className="grid grid-cols-3 gap-1 rounded-xl bg-sand p-1">
          {[
            { value: "", label: "Todas" },
            { value: "Venta", label: "Venta" },
            { value: "Alquiler", label: "Alquiler" },
          ].map((option) => (
            <label key={option.label} className="cursor-pointer">
              <input
                type="radio"
                name="transaction"
                value={option.value}
                defaultChecked={(filters.transaction ?? "") === option.value}
                className="peer sr-only"
              />
              <span className="block rounded-lg px-2 py-2 text-center text-[12.5px] font-semibold text-ink/60 transition peer-checked:bg-white peer-checked:text-ink peer-checked:shadow-sm peer-focus-visible:ring-2 peer-focus-visible:ring-gold">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="label">Tipo de propiedad</legend>
        <div className="flex flex-wrap gap-1.5">
          {PROPERTY_CATEGORIES.map((category) => (
            <label key={category} className="cursor-pointer">
              <input
                type="checkbox"
                name="type"
                value={category}
                defaultChecked={filters.types.includes(category)}
                className="peer sr-only"
              />
              <span className="inline-flex rounded-full border border-line bg-white px-3 py-1.5 text-[12px] font-medium text-ink/70 transition peer-checked:border-deep peer-checked:bg-deep peer-checked:text-cream peer-focus-visible:ring-2 peer-focus-visible:ring-gold">
                {category}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="label">Ubicación</legend>

        <div className="relative">
          <label htmlFor={`${idPrefix}-province`} className="sr-only">
            Provincia
          </label>
          <select
            id={`${idPrefix}-province`}
            name="province"
            value={province}
            onChange={(event) => {
              setProvince(event.target.value);
              setDistrict("");
            }}
            className="field appearance-none pr-9"
          >
            <option value="">Todas las provincias</option>
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

        <div className="relative">
          <label htmlFor={`${idPrefix}-district`} className="sr-only">
            Distrito
          </label>
          <select
            id={`${idPrefix}-district`}
            name="district"
            value={district}
            onChange={(event) => setDistrict(event.target.value)}
            disabled={!province}
            className="field appearance-none pr-9 disabled:cursor-not-allowed disabled:bg-sand/60 disabled:text-muted"
          >
            <option value="">Todos los distritos</option>
            {districts.map((item) => (
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

        <div>
          <label htmlFor={`${idPrefix}-neighborhood`} className="sr-only">
            Barrio o zona
          </label>
          <input
            id={`${idPrefix}-neighborhood`}
            name="neighborhood"
            type="text"
            defaultValue={filters.neighborhood ?? ""}
            placeholder="Barrio o zona (opcional)"
            className="field"
          />
        </div>
      </fieldset>

      <fieldset>
        <legend className="label">Precio (US$)</legend>
        <div className="grid grid-cols-2 gap-2">
          <input
            aria-label="Precio mínimo"
            name="min_price"
            type="number"
            min={0}
            step={500}
            inputMode="numeric"
            defaultValue={filters.minPrice ?? ""}
            placeholder="Mínimo"
            className="field"
          />
          <input
            aria-label="Precio máximo"
            name="max_price"
            type="number"
            min={0}
            step={500}
            inputMode="numeric"
            defaultValue={filters.maxPrice ?? ""}
            placeholder="Máximo"
            className="field"
          />
        </div>
        <p className="mt-1.5 text-[11.5px] text-muted/80">
          En alquileres, el precio es mensual.
        </p>
      </fieldset>

      <fieldset className="grid grid-cols-2 gap-3">
        <legend className="label col-span-2">Distribución</legend>

        <div>
          <label htmlFor={`${idPrefix}-bedrooms`} className="mb-1 block text-[12px] text-muted">
            Habitaciones
          </label>
          <select
            id={`${idPrefix}-bedrooms`}
            name="bedrooms"
            defaultValue={filters.minBedrooms ?? ""}
            className="field"
          >
            <option value="">Cualquiera</option>
            {BEDROOM_OPTIONS.map((value) => (
              <option key={value} value={value}>
                {value}+
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor={`${idPrefix}-bathrooms`} className="mb-1 block text-[12px] text-muted">
            Baños
          </label>
          <select
            id={`${idPrefix}-bathrooms`}
            name="bathrooms"
            defaultValue={filters.minBathrooms ?? ""}
            className="field"
          >
            <option value="">Cualquiera</option>
            {BATHROOM_OPTIONS.map((value) => (
              <option key={value} value={value}>
                {value}+
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor={`${idPrefix}-parking`} className="mb-1 block text-[12px] text-muted">
            Parqueos
          </label>
          <select
            id={`${idPrefix}-parking`}
            name="parking"
            defaultValue={filters.minParking ?? ""}
            className="field"
          >
            <option value="">Cualquiera</option>
            {BEDROOM_OPTIONS.map((value) => (
              <option key={value} value={value}>
                {value}+
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label htmlFor={`${idPrefix}-min-area`} className="mb-1 block text-[12px] text-muted">
              Área mín.
            </label>
            <input
              id={`${idPrefix}-min-area`}
              name="min_area"
              type="number"
              min={0}
              inputMode="numeric"
              defaultValue={filters.minArea ?? ""}
              placeholder="m²"
              className="field px-2.5"
            />
          </div>
          <div>
            <label htmlFor={`${idPrefix}-max-area`} className="mb-1 block text-[12px] text-muted">
              Área máx.
            </label>
            <input
              id={`${idPrefix}-max-area`}
              name="max_area"
              type="number"
              min={0}
              inputMode="numeric"
              defaultValue={filters.maxArea ?? ""}
              placeholder="m²"
              className="field px-2.5"
            />
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend className="label">Amenidades</legend>
        <div className="max-h-64 space-y-4 overflow-y-auto rounded-xl border border-line bg-white p-3.5">
          {AMENITY_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="mb-2 text-[10.5px] font-semibold tracking-[0.12em] text-muted uppercase">
                {group.label}
              </p>
              <div className="space-y-1.5">
                {group.items.map((amenity) => (
                  <label
                    key={amenity}
                    className={cn(
                      "flex cursor-pointer items-center gap-2 text-[12.5px] transition-colors",
                      selectedAmenities.has(amenity) ? "text-ink" : "text-ink/70",
                    )}
                  >
                    <input
                      type="checkbox"
                      name="amenity"
                      value={amenity}
                      defaultChecked={selectedAmenities.has(amenity)}
                      className="size-3.5 rounded border-line text-teal accent-teal"
                    />
                    {amenity}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </fieldset>

      <label className="flex cursor-pointer items-center gap-2.5 text-[13px] font-medium text-ink/80">
        <input
          type="checkbox"
          name="furnished"
          value="1"
          defaultChecked={filters.furnished ?? false}
          className="size-4 rounded border-line accent-teal"
        />
        Solo propiedades amuebladas
      </label>

      <div className="space-y-2 border-t border-line pt-5">
        <button
          type="submit"
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-deep px-5 text-sm font-semibold text-cream transition-colors hover:bg-deep-800"
        >
          Aplicar filtros
        </button>
        <Link
          href="/propiedades"
          className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-full text-[12.5px] font-semibold text-muted transition-colors hover:text-ink"
        >
          <RotateCcw className="size-3.5" aria-hidden="true" />
          Limpiar todo
        </Link>
      </div>
    </form>
  );
}
