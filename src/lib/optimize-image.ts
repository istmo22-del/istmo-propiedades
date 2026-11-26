/**
 * Optimiza una imagen en el navegador antes de subirla:
 * - corrige la orientación EXIF al dibujarla,
 * - limita el lado mayor a 1600 px,
 * - convierte a WebP con calidad 82 (sin metadatos),
 * - si el resultado no mejora el original, devuelve el original.
 *
 * Se ejecuta solo en el cliente. No depende de Vercel, Cloudflare ni del
 * plan de Supabase, así que funciona igual en cualquier hosting.
 */
const MAX_EDGE = 1600;
const QUALITY = 0.82;
const SKIP_BELOW_BYTES = 400 * 1024;

export async function optimizeImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) return file;
  if (file.size <= SKIP_BELOW_BYTES) return file;

  let objectUrl: string | null = null;

  try {
    objectUrl = URL.createObjectURL(file);

    const image = new Image();
    image.decoding = "async";

    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("No se pudo leer la imagen"));
      image.src = objectUrl as string;
    });

    const sourceWidth = image.naturalWidth;
    const sourceHeight = image.naturalHeight;
    if (!sourceWidth || !sourceHeight) return file;

    const scale = Math.min(1, MAX_EDGE / Math.max(sourceWidth, sourceHeight));
    const width = Math.max(1, Math.round(sourceWidth * scale));
    const height = Math.max(1, Math.round(sourceHeight * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    if (!context) return file;

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.drawImage(image, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/webp", QUALITY);
    });

    if (!blob || blob.size >= file.size) return file;

    const extension =
      blob.type === "image/webp" ? "webp" : blob.type === "image/png" ? "png" : "jpg";
    const baseName = file.name.replace(/\.[^.]+$/, "") || "imagen";

    return new File([blob], `${baseName}.${extension}`, {
      type: blob.type || "image/jpeg",
      lastModified: Date.now(),
    });
  } catch {
    return file;
  } finally {
    if (objectUrl) URL.revokeObjectURL(objectUrl);
  }
}
