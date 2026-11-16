"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, Star, Trash2, UploadCloud } from "lucide-react";

import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_BYTES, MAX_IMAGES } from "@/lib/constants";
import { imageUrl } from "@/lib/images";
import { cn } from "@/lib/utils";

type Picked = { file: File; url: string };

export function ImageManager({
  initialImages,
  demo = false,
}: {
  initialImages: string[];
  demo?: boolean;
}) {
  const [existing, setExisting] = useState<string[]>(initialImages);
  const [picked, setPicked] = useState<Picked[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const pickedRef = useRef<Picked[]>([]);

  pickedRef.current = picked;
  const total = existing.length + picked.length;
  const atLimit = total >= MAX_IMAGES;
  const canAdd = !demo && !atLimit;

  useEffect(() => {
    return () => {
      pickedRef.current.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, []);

  function syncInput(files: File[]) {
    if (!inputRef.current) return;
    const transfer = new DataTransfer();
    files.forEach((file) => transfer.items.add(file));
    inputRef.current.files = transfer.files;
  }

  function addFiles(selected: File[]) {
    setError(null);
    if (demo) return;

    const remaining = MAX_IMAGES - total;
    if (remaining <= 0) {
      setError(`Ya tienes ${MAX_IMAGES} imágenes, el máximo permitido.`);
      return;
    }

    const accepted: Picked[] = [];
    for (const file of selected.slice(0, remaining)) {
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        setError(`“${file.name}” no es una imagen válida. Usa JPG, PNG, WebP o AVIF.`);
        continue;
      }
      if (file.size > MAX_IMAGE_BYTES) {
        setError(`“${file.name}” supera los 5 MB.`);
        continue;
      }
      accepted.push({ file, url: URL.createObjectURL(file) });
    }

    if (selected.length > remaining && accepted.length > 0) {
      setError(`Solo puedes agregar ${remaining} imágenes más (máximo ${MAX_IMAGES}).`);
    }

    if (accepted.length === 0) return;
    const next = [...picked, ...accepted];
    setPicked(next);
    syncInput(next.map((item) => item.file));
  }

  function removePicked(index: number) {
    const target = picked[index];
    if (target) URL.revokeObjectURL(target.url);
    const next = picked.filter((_, position) => position !== index);
    setPicked(next);
    syncInput(next.map((item) => item.file));
  }

  function movePickedToCover(index: number) {
    const next = [...picked];
    const [target] = next.splice(index, 1);
    if (!target) return;
    next.unshift(target);
    setPicked(next);
    syncInput(next.map((item) => item.file));
  }

  function moveExistingToCover(index: number) {
    const next = [...existing];
    const [target] = next.splice(index, 1);
    if (!target) return;
    next.unshift(target);
    setExisting(next);
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
          addFiles(Array.from(event.dataTransfer.files));
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
            <UploadCloud className="size-5" aria-hidden="true" />
          </span>
          <span className="text-[13px] font-semibold text-ink">
            {demo
              ? "Las imágenes se activan con Supabase"
              : atLimit
                ? "Límite alcanzado"
                : "Agregar imágenes"}
          </span>
          <span className="text-[11.5px] text-muted">
            {demo
              ? "En modo demostración no se pueden subir fotos."
              : "Arrastra archivos o haz clic aquí · JPG, PNG, WebP o AVIF · máx. 5 MB"}
          </span>
          <input
            ref={inputRef}
            type="file"
            name="new_images"
            accept={ACCEPTED_IMAGE_TYPES.join(",")}
            multiple
            disabled={!canAdd}
            onChange={(event) => {
              addFiles(Array.from(event.target.files ?? []));
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
          {existing.map((source, index) => (
            <li
              key={`existing-${source}`}
              className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-sand ring-1 ring-line"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl(source)} alt="" className="h-full w-full object-cover" />
              {index === 0 && (
                <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-gold px-2 py-0.5 text-[9.5px] font-bold tracking-wide text-[#1c1913] uppercase">
                  <Star className="size-2.5" aria-hidden="true" />
                  Portada
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-gradient-to-t from-ink/80 to-transparent p-2">
                {index > 0 && !demo ? (
                  <button
                    type="button"
                    onClick={() => moveExistingToCover(index)}
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
                    onClick={() => setExisting(existing.filter((_, position) => position !== index))}
                    aria-label="Quitar imagen"
                    className="grid size-7 place-items-center rounded-full bg-red-600/90 text-white transition hover:bg-red-700"
                  >
                    <Trash2 className="size-3.5" aria-hidden="true" />
                  </button>
                )}
              </div>
            </li>
          ))}

          {picked.map((item, index) => (
            <li
              key={item.url}
              className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-sand ring-1 ring-line"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.url} alt="" className="h-full w-full object-cover" />
              {existing.length === 0 && index === 0 && (
                <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-gold px-2 py-0.5 text-[9.5px] font-bold tracking-wide text-[#1c1913] uppercase">
                  <Star className="size-2.5" aria-hidden="true" />
                  Portada
                </span>
              )}
              <span className="absolute top-2 right-2 rounded-full bg-ink/60 px-2 py-0.5 text-[9px] font-semibold text-cream">
                Nueva
              </span>
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-gradient-to-t from-ink/80 to-transparent p-2">
                {existing.length === 0 && index > 0 ? (
                  <button
                    type="button"
                    onClick={() => movePickedToCover(index)}
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
                    onClick={() => removePicked(index)}
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

      <input type="hidden" name="images" value={JSON.stringify(existing)} />

      {total === 0 && (
        <p className="mt-3 flex items-center gap-1.5 text-[11.5px] text-amber-700">
          <ImagePlus className="size-3.5" aria-hidden="true" />
          Sube al menos una foto: las propiedades con imágenes reciben muchas más consultas.
        </p>
      )}
    </div>
  );
}
