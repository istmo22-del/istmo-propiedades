"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, MessageCircle, Phone, X } from "lucide-react";

import { site, siteNav, whatsappLink } from "@/config/site";
import { cn } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const isHome = pathname === "/";
  const transparent = isHome && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          transparent
            ? "bg-transparent"
            : "border-b border-line/70 bg-cream/95 shadow-[0_1px_0_rgba(16,42,67,0.03)] backdrop-blur-md",
        )}
      >
        <div className="container-page flex h-20 items-center justify-between gap-6">
          <Logo light={transparent} />

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Principal">
            {siteNav.map((item) => {
              const base = item.href.split("?")[0];
              const active = item.href.includes("?")
                ? false
                : pathname === base || (base !== "/" && pathname.startsWith(base));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative text-[13.5px] font-semibold tracking-tight transition-colors",
                    transparent
                      ? "text-cream/85 hover:text-cream"
                      : "text-ink/75 hover:text-ink",
                    active && (transparent ? "text-cream" : "text-ink"),
                  )}
                >
                  {item.label}
                  {active && (
                    <span className="absolute -bottom-2 left-0 h-px w-full bg-gold" aria-hidden="true" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2.5">
            <a
              href={site.phoneHref}
              className={cn(
                "hidden items-center gap-2 text-[13px] font-semibold tracking-tight transition-colors xl:flex",
                transparent ? "text-cream/85 hover:text-cream" : "text-ink/75 hover:text-ink",
              )}
            >
              <Phone className="size-4" aria-hidden="true" />
              {site.phone}
            </a>

            <ButtonLink
              href={whatsappLink()}
              external
              size="sm"
              variant={transparent ? "gold" : "primary"}
              className="hidden sm:inline-flex"
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              WhatsApp
            </ButtonLink>

            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Abrir menú"
              aria-expanded={open}
              className={cn(
                "grid size-10 place-items-center rounded-full transition-colors lg:hidden",
                transparent
                  ? "bg-white/10 text-cream ring-1 ring-white/20 hover:bg-white/15"
                  : "bg-ink/[0.05] text-ink hover:bg-ink/10",
              )}
            >
              <Menu className="size-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-[70] flex flex-col bg-deep text-cream lg:hidden" role="dialog" aria-modal="true">
          <div className="container-page flex h-20 shrink-0 items-center justify-between">
            <Logo light />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Cerrar menú"
              className="grid size-10 place-items-center rounded-full bg-white/10 ring-1 ring-white/20 transition hover:bg-white/15"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>

          <nav className="container-page flex flex-1 flex-col justify-center gap-1 pb-10" aria-label="Menú móvil">
            {siteNav.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-baseline justify-between border-b border-white/10 py-4 font-display text-3xl tracking-tight text-cream/90 transition-colors hover:text-gold"
              >
                <span>{item.label}</span>
                <span className="text-[11px] font-sans font-semibold tracking-[0.2em] text-cream/30">
                  0{index + 1}
                </span>
              </Link>
            ))}

            <div className="mt-8 grid gap-3">
              <ButtonLink href={whatsappLink()} external variant="gold" size="lg">
                <MessageCircle className="size-4" aria-hidden="true" />
                Escríbenos por WhatsApp
              </ButtonLink>
              <a
                href={site.phoneHref}
                className="flex items-center justify-center gap-2 rounded-full border border-white/15 py-3 text-sm font-semibold text-cream/80"
              >
                <Phone className="size-4" aria-hidden="true" />
                {site.phone}
              </a>
            </div>
            <p className="mt-8 text-center text-xs text-cream/45">{site.hours}</p>
          </nav>
        </div>
      )}
    </>
  );
}
