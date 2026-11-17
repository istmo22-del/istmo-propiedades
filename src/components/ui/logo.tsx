import Link from "next/link";

import { cn } from "@/lib/utils";

type LogoProps = {
  /** Versión clara para fondos oscuros. */
  light?: boolean;
  className?: string;
  /** Oculta el texto y deja solo el monograma. */
  compact?: boolean;
};

/** Marca de Istmo Realty: pin azul con casa amarilla, techo coral y hoja verde. */
export function IstmoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden="true">
      <path
        d="M32 61S11 40.7 11 25.8a21 21 0 1 1 42 0C53 40.7 32 61 32 61Z"
        fill="#1B74C6"
      />
      <circle cx="32" cy="25.8" r="14.7" fill="#FBFCFE" />
      <path
        d="M19.4 26.1 32 15.3l12.6 10.8"
        stroke="#E0523D"
        strokeWidth="3.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M23 25.6h18v11.2H23z" fill="#F2C94C" />
      <path d="M29.2 25.6v11.2M23 31.2h18" stroke="#D9A93A" strokeWidth="1.15" />
      <path
        d="M39.6 29.7c3.9-2.2 6.5-.9 7.9 1.9-3.6 1.8-6.3 1.1-7.9-1.9Z"
        fill="#6E9B36"
      />
      <rect x="30.2" y="31" width="3.6" height="5.8" rx="0.7" fill="#FBFCFE" opacity="0.9" />
    </svg>
  );
}

export function Logo({ light = false, className, compact = false }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="Ir al inicio"
      className={cn("group inline-flex items-center gap-3", className)}
    >
      <span
        className={cn(
          "grid size-11 shrink-0 place-items-center rounded-2xl bg-white transition-shadow",
          light ? "ring-1 ring-white/40" : "ring-1 ring-line shadow-sm",
        )}
      >
        <IstmoMark className="size-8" />
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              "font-display text-[22px] font-medium tracking-tight",
              light ? "text-cream" : "text-ink",
            )}
          >
            Istmo
          </span>
          <span
            className={cn(
              "mt-1 text-[9px] font-bold tracking-[0.3em] uppercase",
              light ? "text-cream/65" : "text-teal/80",
            )}
          >
            Realty
          </span>
        </span>
      )}
    </Link>
  );
}
