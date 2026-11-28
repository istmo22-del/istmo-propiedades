import type { CSSProperties } from "react";

/**
 * Retraso escalonado para elementos con `data-reveal`.
 *
 * La animación es por tiempo (850 ms), así que el retraso también: cada
 * tarjeta de una fila empieza 90 ms después de la anterior. Se limita el
 * máximo para que la última no tarde demasiado.
 */
export function revealDelay(index: number, step = 90, max = 5): CSSProperties {
  const safeIndex = Number.isFinite(index) ? Math.max(0, Math.min(index, max)) : 0;
  return { "--reveal-delay": `${safeIndex * step}ms` } as CSSProperties;
}
