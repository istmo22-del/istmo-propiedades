"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, Loader2, Star, Trash2, UploadCloud } from "lucide-react";

import {
  deletePropertyImageAction,
  uploadPropertyImageAction,
} from "@/app/admin/(panel)/propiedades/upload-action";
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_IMAGES,
  MAX_SOURCE_IMAGE_BYTES,
  MAX_UPLOAD_BYTES,
} from "@/lib/constants";
import { imageUrl } from "@/lib/images";
import { optimizeImage } from "@/lib/optimize-image";
import { cn } from "@/lib/utils";

type Item = {
  id: string;
  path: string;
  preview: string;
  isNew: boolean;
};

export function ImageManager({
  initialImages,
  demo = false,
  onBusyChange,
}: {
  initialImages: string[];
  demo?: boolean;
  onBusyChange?: (busy: boolean) => void;
}) {
  const [items, setItems] = useState<Item[]>(() =>
    initialImages.map((path) => ({ id: path, path, preview: imageUrl(path), isNew: false })),
  );
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const itemsRef = useRef<Item[]>(items);
  const objectUrls = useRef<string[]>([]);

  itemsRef.current = items;

  const total = items.length;
  const atLimit = total >= MAX_IMAGES;
  const canAdd = !demo && !atLimit && !busy;

  useEffect(() => {
    return () => {
      objectUrls.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  async function addFiles(selected: File[]) {
    setError(null);
    if (demo || busy) return;

    const remaining = MAX_IMAGES - itemsRef.current.length;
    if (remaining <= 0) {
      setError(`Ya tienes ${MAX_IMAGES} imágenes, el máximo permitido.`);
      return;
    }

    const candidates = selected.slice(0, remaining);
    const problems: string[] = [];

    setBusy(true);
    onBusyChange?.(true);

    try {
      for (let index = 0; index < candidates.length; index += 1) {
        const file = candidates[index];
        const position = `${index + 1} de ${candidates.length}`;

        if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
          problems.push(`“${file.name}” no es una imagen válida.`);
          continue;
        }
        if (file.size > MAX_SOURCE_IMAGE_BYTES) {
          problems.push(`“${file.name}” supera los 20 MB.`);
          continue;
        }

        setStatus(`Optimizando ${position}…`);
        const optimized = await optimizeImage(file);

        if (optimized.size > MAX_UPLOAD_BYTES) {
          problems.push(
            `“${file.name}” quedó demasiado pesada para subirla. Prueba con otra foto.`,
          );
          continue;
        }

        // Se sube al instante: cada petición lleva una sola foto (~200 KB).
        setStatus(`Subiendo ${position}…`);
        const formData = new FormData();
        formData.append("file", optimized);
        const result = await uploadPropertyImageAction(formData);

        if ("error" in result) {
          problems.push(result.error);
          continue;
        }

        const preview = URL.createObjectURL(optimized);
        objectUrls.current.push(preview);

        setItems((current) => [
          ...current,
          { id: result.path, path: result.path, preview, isNew: true },
        ]);
      }
    } finally {
      setBusy(false);
      setStatus(null);
      onBusyChange?.(false);
    }

    if (selected.length > remaining) {
      problems.push(`Solo puedes agregar ${remaining} imágenes más (máximo ${MAX_IMAGES}).`);
    }
    if (problems.length > 0) setError(problems.join(" "));
  }

  function removeItem(index: number) {
    const target = itemsRef.current[index];
    if (!target) return;

    if (target.isNew) {
      void deletePropertyImageAction(target.path);
      URL.revokeObjectURL(target.preview);
      objectUrls.current = objectUrls.current.filter((url) => url !== target.preview);
    }

    setItems((current) => current.filter((_, position) => position !== index));
  }

  function moveToCover(index: number) {
    setItems((current) => {
      const next = [...current];
      const [target] = next.splice(index, 1);
      if (!target) return current;
      return [target, ...next];
    });
  }

  return (
    <div>
      <div
        onDragOver={(event) => {
          if (!canAdd) return;
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          if (!canAdd) return;
          event.preventDefault();
          setDragging(false);
          void addFiles(Array.from(event.dataTransfer.files));
        }}
        className={cn(
          "rounded-xl border border-dashed p-5 text-center transition-colors",
          dragging ? "border-teal bg-teal-50" : "border-line bg-sand/40",
          !canAdd && "opacity-60",
        )}
      >
        <label
          className={cn(
            "flex flex-col items-center gap-2",
            canAdd ? "cursor-pointer" : "cursor-not-allowed",
          )}
        >
          <span className="grid size-11 place-items-center rounded-full bg-white text-teal ring-1 ring-line">
            {busy ? (
              <Loader2 className="size-5 animate-spin" aria-hidden="true" />
            ) : (
              <UploadCloud className="size-5" aria-hidden="true" />
            )}
          </span>
          <span className="text-[13px] font-semibold text-ink">
            {busy
              ? "Subiendo imágenes…"
              : demo
                ? "Las imágenes se activan con Supabase"
                : atLimit
                  ? "Límite alcanzado"
                  : "Agregar imágenes"}
          </span>
          <span className="text-[11.5px] text-muted">
            {busy
              ? (status ?? "Preparando…")
              : demo
                ? "En modo demostración no se pueden subir fotos."
                : "Arrastra archivos o haz clic aquí · se optimizan y se suben al instante"}
          </span>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_IMAGE_TYPES.join(",")}
            multiple
            disabled={!canAdd}
            onChange={(event) => {
              const input = event.currentTarget;
              const files = Array.from(input.files ?? []);
              input.value = "";
              void addFiles(files);
            }}
            className="sr-only"
          />
        </label>
      </div>

      <div className="mt-2 flex items-center justify-between text-[11.5px] text-muted">
        <span>
          {total} de {MAX_IMAGES} imágenes
        </span>
        <span className="inline-flex items-center gap-1">
          <Star className="size-3 text-gold" aria-hidden="true" />
          La primera imagen es la portada
        </span>
      </div>

      {error && (
        <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-[11.5px] text-red-700">{error}</p>
      )}

      {total > 0 && (
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item, index) => (
            <li
              key={item.id}
              className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-sand ring-1 ring-line"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.preview} alt="" className="h-full w-full object-cover" />
              {index === 0 && (
                <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-gold px-2 py-0.5 text-[9.5px] font-bold tracking-wide text-ink uppercase">
                  <Star className="size-2.5" aria-hidden="true" />
                  Portada
                </span>
              )}
              {item.isNew && index !== 0 && (
                <span className="absolute top-2 right-2 rounded-full bg-ink/60 px-2 py-0.5 text-[9px] font-semibold text-cream">
                  Nueva
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-gradient-to-t from-ink/80 to-transparent p-2">
                {index > 0 && !demo ? (
                  <button
                    type="button"
                    onClick={() => moveToCover(index)}
                    className="rounded-full bg-white/15 px-2 py-1 text-[10px] font-semibold text-cream backdrop-blur-sm transition hover:bg-white/25"
                  >
                    Hacer portada
                  </button>
                ) : (
                  <span />
                )}
                {!demo && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    aria-label="Quitar imagen"
                    className="grid size-7 place-items-center rounded-full bg-red-600/90 text-white transition hover:bg-red-700"
                  >
                    <Trash2 className="size-3.5" aria-hidden="true" />
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <input type="hidden" name="images" value={JSON.stringify(items.map((item) => item.path))} />

      {total === 0 && (
        <p className="mt-3 flex items-center gap-1.5 text-[11.5px] text-amber-700">
          <ImagePlus className="size-3.5" aria-hidden="true" />
          Sube al menos una foto: las propiedades con imágenes reciben muchas más consultas.
        </p>
      )}
    </div>
  );
}
