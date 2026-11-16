"use client";

import { useState } from "react";
import { Check, Trash2, X } from "lucide-react";

import { deletePropertyAction } from "@/app/admin/(panel)/propiedades/actions";

export function DeletePropertyButton({
  id,
  title,
  demo = false,
}: {
  id: string;
  title: string;
  demo?: boolean;
}) {
  const [confirming, setConfirming] = useState(false);

  if (demo) {
    return (
      <button
        type="button"
        disabled
        title="Configura Supabase para eliminar propiedades"
        className="grid size-9 place-items-center rounded-full border border-line text-muted/40"
      >
        <Trash2 className="size-4" aria-hidden="true" />
      </button>
    );
  }

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        aria-label={`Eliminar ${title}`}
        className="grid size-9 place-items-center rounded-full border border-line text-muted transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
      >
        <Trash2 className="size-4" aria-hidden="true" />
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1 rounded-full bg-red-50 p-1 ring-1 ring-red-200">
      <form action={deletePropertyAction}>
        <input type="hidden" name="id" value={id} />
        <button
          type="submit"
          className="inline-flex h-7 items-center gap-1 rounded-full bg-red-600 px-2.5 text-[10.5px] font-bold text-white transition-colors hover:bg-red-700"
        >
          <Check className="size-3" aria-hidden="true" />
          Eliminar
        </button>
      </form>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        aria-label="Cancelar"
        className="grid size-7 place-items-center rounded-full text-red-700 transition-colors hover:bg-red-100"
      >
        <X className="size-3.5" aria-hidden="true" />
      </button>
    </div>
  );
}
