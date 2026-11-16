import Link from "next/link";

import { cn } from "@/lib/utils";

type LogoProps = {
  /** Versión clara para fondos oscuros. */
  light?: boolean;
  className?: string;
  /** Oculta el texto y deja solo el monograma. */
  compact?: boolean;
};

export function Logo({ light = false, className, compact = false }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="Ir al inicio"
      className={cn("group inline-flex items-center gap-3", className)}
    >
      <span
        className={cn(
          "grid size-10 shrink-0 place-items-center rounded-xl transition-colors",
          light ? "bg-white/10 ring-1 ring-white/20" : "bg-deep ring-1 ring-deep/10",
        )}
      >
        <svg viewBox="0 0 64 64" className="size-6" fill="none" aria-hidden="true">
          <path
            d="M15 34.5 32 20l17 14.5"
            stroke="#C8A96A"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M32 30.5V47" stroke="#F6F1E8" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="32" cy="25.5" r="1.8" fill="#C8A96A" />
        </svg>
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
              "mt-1 text-[9px] font-semibold tracking-[0.3em] uppercase",
              light ? "text-cream/60" : "text-muted",
            )}
          >
            Propiedades
          </span>
        </span>
      )}
    </Link>
  );
}
