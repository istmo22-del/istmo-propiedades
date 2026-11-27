import sharp from "sharp";

/**
 * Normalización de imágenes en el servidor.
 *
 * Es la red de seguridad del flujo: el navegador ya intenta optimizar antes de
 * subir, pero no todos los móviles pueden (Safari antiguo, canvas sin memoria,
 * archivos raros). Aquí se garantiza que lo que llega a Supabase Storage sea
 * siempre WebP, con el lado mayor a 1600 px y sin metadatos.
 *
 * Solo se ejecuta en el servidor.
 */
const MAX_EDGE = 1600;
const QUALITY = 82;
const SKIP_BELOW_BYTES = 400 * 1024;

export type NormalizedImage = {
  data: Buffer;
  contentType: "image/webp";
  extension: "webp";
};

export async function normalizeImage(file: File): Promise<NormalizedImage | null> {
  const original = Buffer.from(await file.arrayBuffer());

  // Si el navegador ya entregó un WebP liviano, no lo re-comprimimos: evita
  // perder calidad y ahorra tiempo de CPU.
  if (file.type === "image/webp" && original.byteLength <= SKIP_BELOW_BYTES) {
    return { data: original, contentType: "image/webp", extension: "webp" };
  }

  try {
    const output = await sharp(original, { failOn: "none" })
      .rotate()
      .resize({
        width: MAX_EDGE,
        height: MAX_EDGE,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: QUALITY })
      .toBuffer();

    return { data: output, contentType: "image/webp", extension: "webp" };
  } catch (error) {
    console.error(
      "[images] no se pudo normalizar:",
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}
