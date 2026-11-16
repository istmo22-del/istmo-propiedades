import {
  Briefcase,
  Building,
  Building2,
  Car,
  Handshake,
  House,
  Palmtree,
  Sprout,
  Store,
  Trees,
  Waves,
  type LucideIcon,
} from "lucide-react";

import type { PropertyCategory } from "@/lib/types";

const CATEGORY_ICONS: Record<PropertyCategory, LucideIcon> = {
  Apartamentos: Building2,
  Casas: House,
  "Lotes y Terrenos": Trees,
  "Locales comerciales y bodegas": Store,
  Oficinas: Briefcase,
  Fincas: Sprout,
  "Propiedades de playa": Waves,
  Edificios: Building,
  Negocios: Handshake,
  "Estacionamientos y otros": Car,
  "Propiedades de isla": Palmtree,
};

export function CategoryIcon({
  category,
  className,
}: {
  category: PropertyCategory;
  className?: string;
}) {
  const Icon = CATEGORY_ICONS[category] ?? Building2;
  return <Icon className={className} aria-hidden="true" />;
}
