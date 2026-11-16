"use client";

import { AlertCircle, RotateCcw } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";

export function ErrorContent({
  title = "Algo no salió como esperábamos",
  message = "No pudimos cargar esta página. Revisa tu conexión e inténtalo de nuevo. Si el problema continúa, escríbenos por WhatsApp.",
  reset,
}: {
  title?: string;
  message?: string;
  reset: () => void;
}) {
  return (
    <div className="container-page flex min-h-[65vh] flex-col items-center justify-center py-20 text-center">
      <span className="grid size-14 place-items-center rounded-full bg-amber-50 text-amber-700">
        <AlertCircle className="size-6" aria-hidden="true" />
      </span>
      <h1 className="mt-5 max-w-xl text-balance font-display text-4xl leading-[1.08]">
        {title}
      </h1>
      <p className="mt-4 max-w-md text-sm leading-6 text-muted">{message}</p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-deep px-5 text-sm font-semibold text-cream transition-colors hover:bg-deep-800"
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          Reintentar
        </button>
        <ButtonLink href="/" variant="outline">
          Ir al inicio
        </ButtonLink>
      </div>
    </div>
  );
}
