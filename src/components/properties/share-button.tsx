"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";

export function ShareButton({ title, text }: { title: string; text?: string }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch {
        // El usuario canceló o el navegador no lo permitió: probamos copiar.
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.prompt("Copia el enlace de la propiedad:", url);
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-full border border-line bg-white text-[12.5px] font-semibold text-ink transition-colors hover:bg-sand"
    >
      {copied ? (
        <>
          <Check className="size-4 text-teal" aria-hidden="true" />
          Enlace copiado
        </>
      ) : (
        <>
          <Share2 className="size-4" aria-hidden="true" />
          Compartir propiedad
        </>
      )}
    </button>
  );
}
