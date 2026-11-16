import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";

import { whatsappLink } from "@/config/site";
import { ButtonLink } from "@/components/ui/button";

export function NotFoundContent() {
  return (
    <div className="container-page flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-display text-[88px] leading-none text-gold/30 sm:text-[120px]">404</p>
      <h1 className="mt-2 max-w-xl text-balance font-display text-4xl leading-[1.08] sm:text-5xl">
        Esta página se mudó (o nunca existió).
      </h1>
      <p className="mt-4 max-w-md text-sm leading-6 text-muted">
        Puede que el enlace esté desactualizado o que la propiedad ya no esté disponible.
        Explora el portafolio o escríbenos y te ayudamos a encontrarla.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <ButtonLink href="/propiedades" size="lg">
          Ver propiedades
          <ArrowRight className="size-4" aria-hidden="true" />
        </ButtonLink>
        <ButtonLink
          href={whatsappLink({ message: "Hola, busco una propiedad que vi en el sitio." })}
          external
          variant="whatsapp"
          size="lg"
        >
          <MessageCircle className="size-4" aria-hidden="true" />
          Escribir por WhatsApp
        </ButtonLink>
      </div>

      <Link href="/" className="mt-8 text-[12.5px] font-semibold text-teal hover:underline">
        Volver al inicio
      </Link>
    </div>
  );
}
