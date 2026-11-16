import { defineCloudflareConfig } from "@opennextjs/cloudflare";

/**
 * Configuración mínima de OpenNext para Cloudflare.
 *
 * Todas las páginas que leen de Supabase son dinámicas (`force-dynamic`),
 * por lo que no necesitamos caché incremental (R2) para empezar.
 * Si más adelante quieres ISR / `revalidate`, añade el bucket R2:
 *
 *   import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";
 *   export default defineCloudflareConfig({ incrementalCache: r2IncrementalCache });
 */
export default defineCloudflareConfig({});
