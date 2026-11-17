import { ChevronDown, Search } from "lucide-react";

import { PANAMA_PROVINCES } from "@/lib/panama";
import { PROPERTY_CATEGORIES } from "@/lib/types";
import { CategorySelect } from "@/components/search/category-select";

const priceSuggestions = [
  { label: "Hasta US$ 150,000", value: "150000" },
  { label: "Hasta US$ 300,000", value: "300000" },
  { label: "Hasta US$ 500,000", value: "500000" },
  { label: "Hasta US$ 1,000,000", value: "1000000" },
];

export function HeroSearch() {
  return (
    <form
      action="/propiedades"
      method="get"
      className="mt-9 rounded-[1.4rem] border border-white/60 bg-cream/95 p-3 shadow-[0_24px_70px_-30px_rgba(4,20,18,0.65)] backdrop-blur-md sm:p-4"
    >
      <fieldset>
        <legend className="sr-only">Tipo de operación</legend>
        <div className="inline-flex rounded-full bg-sand p-1">
          {(["Venta", "Alquiler"] as const).map((transaction, index) => (
            <label key={transaction} className="cursor-pointer">
              <input
                type="radio"
                name="transaction"
                value={transaction}
                defaultChecked={index === 0}
                className="peer sr-only"
              />
              <span className="block rounded-full px-5 py-2 text-[13px] font-semibold text-ink/60 transition-colors peer-checked:bg-deep peer-checked:text-cream peer-focus-visible:ring-2 peer-focus-visible:ring-gold">
                {transaction === "Venta" ? "Comprar" : "Alquilar"}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-[1.05fr_1.05fr_1.2fr_1fr_auto]">
        <CategorySelect
          id="hero-category"
          selectClassName="h-12"
          className="sm:col-span-2 lg:col-span-1"
        />

        <div className="relative">
          <label htmlFor="hero-province" className="sr-only">
            Provincia
          </label>
          <select
            id="hero-province"
            name="province"
            defaultValue=""
            className="h-12 w-full appearance-none rounded-xl border border-line bg-white px-4 pr-10 text-sm font-medium text-ink outline-none transition focus:border-teal focus:ring-4 focus:ring-teal/10"
          >
            <option value="">Toda la provincia</option>
            {PANAMA_PROVINCES.map((province) => (
              <option key={province.name} value={province.name}>
                {province.name}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-muted"
            aria-hidden="true"
          />
        </div>

        <div className="relative">
          <label htmlFor="hero-type" className="sr-only">
            Tipo de propiedad
          </label>
          <select
            id="hero-type"
            name="type"
            defaultValue=""
            className="h-12 w-full appearance-none rounded-xl border border-line bg-white px-4 pr-10 text-sm font-medium text-ink outline-none transition focus:border-teal focus:ring-4 focus:ring-teal/10"
          >
            <option value="">Todos los tipos</option>
            {PROPERTY_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-muted"
            aria-hidden="true"
          />
        </div>

        <div className="relative">
          <label htmlFor="hero-price" className="sr-only">
            Presupuesto máximo
          </label>
          <select
            id="hero-price"
            name="max_price"
            defaultValue=""
            className="h-12 w-full appearance-none rounded-xl border border-line bg-white px-4 pr-10 text-sm font-medium text-ink outline-none transition focus:border-teal focus:ring-4 focus:ring-teal/10"
          >
            <option value="">Sin límite de precio</option>
            {priceSuggestions.map((price) => (
              <option key={price.value} value={price.value}>
                {price.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-muted"
            aria-hidden="true"
          />
        </div>

        <button
          type="submit"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gold px-7 text-sm font-bold tracking-tight text-ink transition-colors hover:bg-gold-700"
        >
          <Search className="size-4" aria-hidden="true" />
          Buscar
        </button>
      </div>
    </form>
  );
}
