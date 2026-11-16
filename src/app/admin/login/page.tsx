import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Info } from "lucide-react";

import { site } from "@/config/site";
import { getCurrentUser } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { LoginForm } from "@/components/admin/login-form";
import { Logo } from "@/components/ui/logo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Acceso agentes",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  const configured = isSupabaseConfigured();
  const user = configured ? await getCurrentUser() : null;
  if (user) redirect("/admin");

  return (
    <div className="grid min-h-dvh lg:grid-cols-[1.05fr_1fr]">
      <div className="relative hidden overflow-hidden bg-deep lg:block">
        <img
          src="/hero.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-deep via-deep/50 to-deep/20" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Logo light />
          <div>
            <p className="eyebrow text-gold">Panel privado</p>
            <p className="mt-4 max-w-md font-display text-4xl leading-[1.1] text-cream">
              Tú te encargas de las propiedades. Nosotros de que se vean bien.
            </p>
            <p className="mt-4 max-w-sm text-[13px] leading-6 text-cream/60">
              Publica, edita y organiza tu portafolio desde un solo lugar. Los cambios se
              reflejan en el sitio al instante.
            </p>
          </div>
          <p className="text-[11px] text-cream/40">
            © {new Date().getFullYear()} {site.name}
          </p>
        </div>
      </div>

      <div className="flex flex-col bg-cream">
        <div className="flex items-center justify-between border-b border-line px-6 py-5 lg:justify-end lg:border-0 lg:px-10">
          <div className="lg:hidden">
            <Logo />
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-muted transition-colors hover:text-ink"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            Volver al sitio
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 py-12 sm:px-10">
          <div className="w-full max-w-sm">
            <p className="eyebrow text-gold">Acceso agentes</p>
            <h1 className="mt-3 font-display text-4xl leading-tight">Bienvenido de vuelta.</h1>
            <p className="mt-3 text-[13px] leading-6 text-muted">
              Ingresa con la cuenta del vendedor para administrar las propiedades.
            </p>

            {configured ? (
              <LoginForm />
            ) : (
              <div className="mt-7 space-y-4">
                <div className="flex gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[12.5px] leading-5 text-amber-900">
                  <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  <span>
                    <strong className="font-semibold">Modo demostración.</strong> El proyecto aún
                    no tiene credenciales de Supabase. Puedes recorrer el panel con datos de
                    ejemplo, pero los cambios no se guardan.
                  </span>
                </div>
                <Link
                  href="/admin"
                  className="inline-flex h-11 w-full items-center justify-center rounded-full bg-deep text-sm font-semibold text-cream transition-colors hover:bg-deep-800"
                >
                  Ver panel de demostración
                </Link>
                <p className="text-center text-[11.5px] leading-5 text-muted">
                  Configura <code className="rounded bg-sand px-1 py-0.5">.env.local</code> con las
                  claves de Supabase y ejecuta el SQL para activar el acceso real.
                </p>
              </div>
            )}

            <p className="mt-8 text-center text-[11px] leading-5 text-muted/80">
              ¿Olvidaste tu contraseña? Restablécela desde el dashboard de Supabase
              (Authentication → Users).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
