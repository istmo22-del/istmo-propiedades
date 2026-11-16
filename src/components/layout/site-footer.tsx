import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

import { site, siteNav } from "@/config/site";
import { Logo } from "@/components/ui/logo";

const popularCategories = [
  { label: "Casas", href: "/propiedades?type=Casas" },
  { label: "Apartamentos", href: "/propiedades?type=Apartamentos" },
  { label: "Propiedades de playa", href: "/propiedades?type=Propiedades+de+playa" },
  { label: "Fincas", href: "/propiedades?type=Fincas" },
  { label: "Lotes y terrenos", href: "/propiedades?type=Lotes+y+Terrenos" },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 bg-deep text-cream/70">
      <div className="container-page py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Logo light />
            <p className="mt-6 max-w-xs text-sm leading-6 text-cream/55">{site.description}</p>
            <p className="mt-6 text-[13px] leading-6 text-cream/45">
              Atención directa, sin intermediarios.
              <br />
              {site.address}
            </p>
          </div>

          <div>
            <h3 className="font-sans text-[11px] font-semibold tracking-[0.22em] text-gold uppercase">
              Explorar
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              {siteNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition-colors hover:text-cream">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-sans text-[11px] font-semibold tracking-[0.22em] text-gold uppercase">
              Categorías
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              {popularCategories.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition-colors hover:text-cream">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-sans text-[11px] font-semibold tracking-[0.22em] text-gold uppercase">
              Contacto
            </h3>
            <ul className="mt-5 space-y-3.5 text-sm">
              <li>
                <a
                  href={site.phoneHref}
                  className="flex items-center gap-2.5 transition-colors hover:text-cream"
                >
                  <Phone className="size-4 text-gold" aria-hidden="true" />
                  {site.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="flex items-center gap-2.5 transition-colors hover:text-cream"
                >
                  <Mail className="size-4 text-gold" aria-hidden="true" />
                  {site.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" />
                {site.address}
              </li>
              <li className="flex items-start gap-2.5 text-cream/50">
                <Clock className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" />
                {site.hours}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-cream/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}. Todos los derechos reservados.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/privacidad" className="transition-colors hover:text-cream/80">
              Privacidad
            </Link>
            <Link href="/propiedades" className="transition-colors hover:text-cream/80">
              Propiedades
            </Link>
            <Link href="/admin" className="transition-colors hover:text-cream/80">
              Acceso agentes
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
