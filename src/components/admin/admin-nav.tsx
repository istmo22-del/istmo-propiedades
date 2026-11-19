"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, LogOut, PenLine, Plus, SquareStack } from "lucide-react";

import { logoutAction } from "@/app/admin/login/actions";
import { IstmoMark } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

function AdminMark() {
  return (
    <span className="grid size-10 place-items-center rounded-xl bg-white ring-1 ring-white/20">
      <IstmoMark className="size-7" />
    </span>
  );
}

function useActive() {
  const pathname = usePathname();
  return {
    properties:
      pathname === "/admin" ||
      (pathname.startsWith("/admin/propiedades/") && pathname !== "/admin/propiedades/nueva"),
    create: pathname === "/admin/propiedades/nueva",
    blog: pathname.startsWith("/admin/blog"),
  };
}

export function AdminSidebar({ email, demo }: { email: string; demo: boolean }) {
  const active = useActive();

  return (
    <aside className="hidden bg-deep text-cream lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col">
      <Link href="/admin" className="flex items-center gap-3 px-6 py-6">
        <AdminMark />
        <span className="leading-none">
          <span className="block font-display text-lg">Istmo</span>
          <span className="mt-1 block text-[8.5px] font-semibold tracking-[0.26em] text-cream/50 uppercase">
            Panel
          </span>
        </span>
      </Link>

      <nav className="mt-2 space-y-1 px-3" aria-label="Panel">
        <Link
          href="/admin"
          className={cn(
            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-colors",
            active.properties
              ? "bg-white/10 text-cream ring-1 ring-white/10"
              : "text-cream/60 hover:bg-white/[0.06] hover:text-cream",
          )}
        >
          <SquareStack className="size-4" aria-hidden="true" />
          Propiedades
        </Link>
        <Link
          href="/admin/blog"
          className={cn(
            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-colors",
            active.blog
              ? "bg-white/10 text-cream ring-1 ring-white/10"
              : "text-cream/60 hover:bg-white/[0.06] hover:text-cream",
          )}
        >
          <PenLine className="size-4" aria-hidden="true" />
          Blog
        </Link>
        <Link
          href="/admin/propiedades/nueva"
          className={cn(
            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-colors",
            active.create
              ? "bg-white/10 text-cream ring-1 ring-white/10"
              : "text-cream/60 hover:bg-white/[0.06] hover:text-cream",
          )}
        >
          <Plus className="size-4" aria-hidden="true" />
          Nueva propiedad
        </Link>
      </nav>

      <div className="mt-auto space-y-3 border-t border-white/10 p-4">
        {demo && (
          <span className="inline-flex rounded-full bg-gold/20 px-2.5 py-1 text-[10px] font-bold tracking-wide text-gold uppercase">
            Modo demostración
          </span>
        )}

        <div className="rounded-xl bg-white/[0.04] px-3 py-2.5">
          <p className="text-[10px] font-semibold tracking-[0.14em] text-cream/40 uppercase">
            Sesión
          </p>
          <p className="mt-1 truncate text-[12px] text-cream/80">{email}</p>
        </div>

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-1 text-[12px] text-cream/55 transition-colors hover:text-cream"
        >
          <ExternalLink className="size-3.5" aria-hidden="true" />
          Ver sitio público
        </a>

        <form action={logoutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-[12.5px] font-medium text-cream/55 transition-colors hover:bg-white/[0.06] hover:text-cream"
          >
            <LogOut className="size-4" aria-hidden="true" />
            Cerrar sesión
          </button>
        </form>
      </div>
    </aside>
  );
}

export function AdminMobileBar({ demo }: { email?: string; demo: boolean }) {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-3 border-b border-white/10 bg-deep px-4 text-cream lg:hidden">
      <Link href="/admin" className="flex items-center gap-2.5">
        <AdminMark />
        <span className="font-display text-lg">Istmo</span>
        {demo && (
          <span className="rounded-full bg-gold/20 px-2 py-0.5 text-[9px] font-bold tracking-wide text-gold uppercase">
            Demo
          </span>
        )}
      </Link>

      <div className="flex items-center gap-2">
        <Link
          href="/admin/blog"
          aria-label="Blog"
          className="grid size-9 place-items-center rounded-full bg-white/10 text-cream/80 transition-colors hover:bg-white/15"
        >
          <PenLine className="size-4" aria-hidden="true" />
        </Link>
        <Link
          href="/admin/propiedades/nueva"
          className="inline-flex h-9 items-center gap-1.5 rounded-full bg-gold px-3.5 text-[11.5px] font-bold text-ink"
        >
          <Plus className="size-3.5" aria-hidden="true" />
          Nueva
        </Link>
        <form action={logoutAction}>
          <button
            type="submit"
            aria-label="Cerrar sesión"
            className="grid size-9 place-items-center rounded-full bg-white/10 text-cream/80 transition-colors hover:bg-white/15"
          >
            <LogOut className="size-4" aria-hidden="true" />
          </button>
        </form>
      </div>
    </header>
  );
}
