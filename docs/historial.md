# Historial del proyecto

Este archivo resume **qué se hizo, en qué orden y por qué**. El código dice cómo está
el sitio hoy; esto explica cómo llegó ahí y qué se decidió por el camino.

Si empiezas una conversación nueva sobre este repositorio, lee en este orden:

1. `README.md` — instalación, variables y uso.
2. `AGENTS.md` — reglas del Next.js de este proyecto.
3. `docs/historial.md` — este archivo.
4. `git log --oneline` — detalle exacto de cada cambio.

---

## Resumen

Sitio inmobiliario para Panamá con panel de administración propio.

- **Stack:** Next.js 16 (App Router, Turbopack) + React 19 + Tailwind 4 + Supabase
  (Postgres, Auth y Storage). Editor de blog con TipTap, guardando Markdown.
- **Hosting:** Vercel, proyecto `jorge-44ac/istmo-propiedades`.
- **Dominio:** `istmo-propiedades.vercel.app`. `istmorealty.com` **no** está conectado
  (muestra una página "Coming Soon" ajena).
- **Node:** `>=22.12.0`.
- **Sin** servicio de email ni pagos: el contacto es WhatsApp, teléfono y `mailto:`.

---

## Línea de tiempo

| Commit | Qué cambió |
|---|---|
| `3f35bad` | Sitio público y panel de administración inicial: propiedades, búsqueda, fichas, login con Supabase y RLS. |
| `359c87e` | Rebranding a **Istmo Realty**: logo, colecciones en portada y categorías en el buscador. |
| `4dc179f` | Copy sin lenguaje de plantilla: datos verificables, nombres propios, categorías y provincias. |
| `9e5b103` | Blog: listado público, artículo en Markdown, RSS y panel de publicación. |
| `f76bf8a` | El blog no rompe el sitio si la tabla `posts` todavía no existe. |
| `2081dd5` | Tres artículos reales y SQL para cargarlos. |
| `7bd9ed3` | Instalación del blog en un solo archivo (`supabase/blog-setup.sql`). |
| `970887e` | Incluye `set_updated_at` en el SQL de instalación. |
| `2fa77ed` | Unifica la instalación en un único SQL y corrige referencias. |
| `4667eed` | Editor visual tipo WordPress (TipTap) con pestañas Visual/Markdown; se guarda Markdown. |
| `526897c` | Optimización de imágenes en el navegador antes de subir (WebP 1600 px). |
| `2d5bd17` | Subida foto por foto y normalización en el servidor con `sharp`. |

---

## Decisiones y por qué

### Imágenes

El plan de hosting es limitado, así que el peso de las fotos es el punto crítico. La
solución tiene **tres capas**, y cada una cubre lo que la anterior no puede:

1. **Navegador (rápido):** al elegir la foto se reduce a 1600 px, se pasa a WebP
   (calidad 82) y se le quitan los metadatos. Evita subir 5 MB por datos móviles.
   Código: `src/lib/optimize-image.ts`.
2. **Servidor (garantía):** `sharp` normaliza de nuevo lo que llegue. Así funciona
   igual con un iPhone viejo, un Android raro o una foto enorme.
   Código: `src/lib/normalize-image.ts`.
3. **Subida foto por foto:** cada imagen se sube al instante en su propia petición.
   El formulario solo guarda rutas. Código:
   `src/app/admin/(panel)/propiedades/upload-action.ts` y
   `src/app/admin/(panel)/blog/upload-action.ts`.

Por qué foto por foto y no todo junto:

- Vercel rechaza cuerpos de más de **4,5 MB** por petición, y `bodySizeLimit` no puede
  superar ese techo. Con una foto por envío (~200 KB) el problema desaparece.
- Si una foto falla, se reintenta esa y las demás quedan guardadas.
- Aguanta red móvil inestable y muestra progreso real.

Detalles:

- Si el navegador ya entregó un WebP de ≤ 400 KB, el servidor **no lo re-comprime**
  (evita perder calidad y ahorra CPU).
- Las imágenes se guardan en Supabase Storage (buckets `property-images` y
  `blog-images`, públicos, 5 MB por archivo), **no** en Vercel. Por eso
  `next.config.ts` usa `images: { unoptimized: true }`.
- Las fotos que ya estaban subidas **no se reprocesan**.
- Si se quita una foto nueva antes de guardar, se borra del bucket. Si se cancela el
  formulario completo, las ya subidas quedan huérfanas (~200 KB cada una).
- **HEIC no se puede convertir:** `sharp` no trae decodificador HEVC. Esas fotos se
  rechazan con un mensaje claro y no afectan al resto del lote.

### Blog

- El contenido se guarda en **Markdown**, aunque el editor sea visual. Así el texto
  es portable y se puede editar a mano.
- La portada es opcional; si no hay, se usa una portada con la marca.
- El blog tolera que la tabla `posts` no exista (modo demo), para no tumbar el sitio.

### Acceso de brokers

- **No hay roles.** Cualquier usuario autenticado puede crear propiedades y, por RLS,
  solo ve y edita las suyas.
- Para varios brokers: crear una cuenta por persona en Supabase Auth. Decidir antes si
  cada uno trabaja aislado (comportamiento actual) o si hace falta que un
  administrador lo vea todo (eso sí requiere roles).
- Se descartó exigir "sube desde la computadora" o "usa tal navegador": en iPhone
  todos los navegadores usan el mismo motor, así que no arregla nada y añade fricción.
  La solución es que el servidor garantice el procesamiento.

### Hosting

- Se evaluó migrar a cPanel/VPS: es posible con `output: "standalone"` y build
  externo. El export estático **no** sirve por el panel y la autenticación.
- De momento se mantiene Vercel. Las imágenes no consumen su ancho de banda.

---

## Estado actual

```
src/app/(site)/          Sitio público: inicio, propiedades, blog, nosotros, contacto
src/app/admin/(panel)/   Panel: propiedades, blog, ajustes
src/app/admin/login/     Acceso con Supabase Auth
src/proxy.ts             Redirección de /admin sin sesión (la autorización real está en el layout y las actions)
src/lib/                 Constantes, tipos, validación, Supabase, imágenes
supabase/schema.sql      Esquema completo (tablas, RLS, buckets)
supabase/seed.sql        Datos de ejemplo
supabase/blog-setup.sql  Instalación del blog en un paso
supabase/blog-posts.sql  Artículos iniciales
```

- Sin Supabase configurado, el sitio funciona en **modo demostración** con datos
  locales (`demo-data.ts`, `demo-posts.ts`); no se puede guardar nada.
- Variables necesarias: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
  `NEXT_PUBLIC_SITE_URL`. Las `NEXT_PUBLIC_*` se fijan en tiempo de build.

---

## Pendientes

1. **Decodificador HEIC en el navegador** (opcional): cubriría fotos HEIC de Android.
2. **Roles** si varios brokers deben compartir visibilidad o si solo el dueño publica.
3. **Limpieza de huérfanos**: script que borre fotos subidas y nunca asociadas.
4. **Miniaturas para listados** (p. ej. 400 px): menos peso en las páginas de catálogo.
5. **Conectar `istmorealty.com`** o confirmar el dominio definitivo.
6. Revisar si conviene migrar de Vercel a VPS/cPanel según el uso real.

---

## Lo que no está en el repo

- La conversación donde se tomaron estas decisiones.
- Variables de entorno reales, usuarios de Supabase Auth y configuración de Vercel.
- Datos de producción (propiedades, artículos, imágenes ya subidas).
- DNS y configuración de Cloudflare (los archivos existen, pero no se usan).

Para reconstruir el detalle de un cambio:

```bash
git log --oneline
git show <commit>
git log -p -- "src/lib/normalize-image.ts"
```
