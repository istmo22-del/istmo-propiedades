# Istmo Realty

Portal inmobiliario para Panamá construido con **Next.js (App Router)**, **Supabase** y **Cloudflare Workers**. Incluye un sitio público con buscador tradicional avanzado y un panel privado para que un único vendedor administre todo el portafolio.

> **Modo demostración:** si aún no hay credenciales de Supabase, el sitio y el panel funcionan con 14 propiedades de ejemplo en modo solo lectura. Sirve para revisar el diseño y el flujo completo antes de conectar la base de datos.

---

## Contenido

- [Qué incluye](#qué-incluye)
- [Stack y costos](#stack-y-costos)
- [Requisitos](#requisitos)
- [Inicio rápido (modo demostración)](#inicio-rápido-modo-demostración)
- [Configurar Supabase](#configurar-supabase)
- [Usar el panel](#usar-el-panel)
- [Variables de entorno](#variables-de-entorno)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Scripts](#scripts)
- [Desplegar en Cloudflare (GitHub → Workers)](#desplegar-en-cloudflare-github--workers)
- [Personalizar el sitio](#personalizar-el-sitio)
- [Mantenimiento y respaldos](#mantenimiento-y-respaldos)
- [Solución de problemas](#solución-de-problemas)
- [Licencias y créditos](#licencias-y-créditos)

---

## Qué incluye

### Sitio público

- Portada con búsqueda rápida, propiedades destacadas, categorías y provincias.
- Colecciones rápidas: **Alquileres en Chiriquí**, **Casas en venta en David** y **Propiedades recientes**, con enlaces a búsquedas filtradas.
- Buscador `/propiedades` con filtros tradicionales combinables:
  - operación (venta/alquiler), tipo de propiedad, provincia, distrito y barrio;
  - rango de precio, habitaciones, baños, parqueos y área;
  - amenidades (selección múltiple) y amueblado;
  - orden por recientes, precio o área; paginación y chips de filtros activos.
- Ficha de propiedad con galería, detalles, amenidades, mapa, propiedades similares, botón de compartir y JSON-LD para SEO.
- Blog público `/blog`: artículos en Markdown, portada con imagen, tiempo de lectura, artículos relacionados, RSS (`/blog/rss.xml`) y JSON-LD `BlogPosting`.
- WhatsApp, formulario de contacto, páginas de nosotros y privacidad.
- SEO técnico: metadatos, sitemap, robots, manifest, Open Graph y datos estructurados.
- Diseño responsive con Tailwind CSS v4 y componentes accesibles.

### Panel privado (`/admin`)

- Acceso con Supabase Auth (email + contraseña). Un solo vendedor administra todas las propiedades.
- Listado con búsqueda, filtro por estado, conteos y acciones rápidas.
- Crear, editar y eliminar propiedades.
- Estados editoriales: **Borrador**, **Publicada**, **Vendida** y **Alquilada**.
- Hasta 10 imágenes por propiedad (5 MB cada una), con portada, reordenamiento y borrado.
- Slug automático y estable para URLs limpias.
- Al eliminar una propiedad también se eliminan sus imágenes del Storage.
- Blog: crear, editar, publicar y despublicar artículos con editor Markdown, vista previa y portada opcional.
- RLS: el público solo lee propiedades y artículos publicados; el vendedor solo puede modificar sus propias filas.

---

## Stack y costos

| Pieza | Servicio | Plan |
| --- | --- | --- |
| Framework | Next.js 16 + React 19 | Open source |
| Estilos | Tailwind CSS v4 | Open source |
| Base de datos, Auth y Storage | Supabase | Free tier |
| Hosting | Cloudflare Workers + OpenNext | Free tier |
| Repositorio y CI/CD | GitHub + Cloudflare Workers Builds | Gratis |
| Imágenes de ejemplo | Unsplash | Licencia libre |

Los planes gratuitos de Supabase y Cloudflare permiten uso comercial y son suficientes para un portafolio de ~20 propiedades con crecimiento normal. Revisa los límites vigentes antes de lanzar:

- <https://supabase.com/pricing>
- <https://developers.cloudflare.com/workers/platform/limits/>

> **Nota sobre Cloudflare Pages:** el adaptador `@cloudflare/next-on-pages` para Next.js está archivado y ya no es la vía recomendada. Este proyecto usa **OpenNext (`@opennextjs/cloudflare`) + Cloudflare Workers**, que sigue soportado y se mantiene dentro del plan gratuito. El despliegue se automatiza igual desde GitHub.
>
> Cloudflare también promueve **vinext** para proyectos nuevos. Este proyecto se quedó con OpenNext porque ya está configurado, es estable y cubre las funciones de Next.js que usa el portal; no hace falta migrar para desplegar.

---

## Requisitos

- **Node.js 22.12 o superior** (el proyecto fija `>=22.12.0`).
- npm 10+.
- Una cuenta gratuita de [Supabase](https://supabase.com).
- Una cuenta gratuita de [Cloudflare](https://cloudflare.com) y un repositorio en GitHub para producción.

---

## Inicio rápido (modo demostración)

```bash
npm install
npm run dev
```

Abre <http://localhost:3000>. También puedes entrar a <http://localhost:3000/admin> para recorrer el panel con datos de ejemplo. Los cambios no se guardan hasta configurar Supabase.

Para probar el build de producción:

```bash
npm run build
npm start
```

Para previsualizar en el runtime real de Cloudflare Workers (requiere Wrangler):

```bash
npm run preview
```

---

## Configurar Supabase

### 1. Crear el proyecto

1. Entra a <https://supabase.com/dashboard> y crea un proyecto nuevo.
2. Elige una región cercana a Panamá (por ejemplo, `us-east-1`).
3. Guarda la contraseña de la base de datos en un lugar seguro.

### 2. Crear el esquema

1. Abre **SQL Editor → New query**.
2. Copia y pega **todo** el contenido de [`supabase/schema.sql`](supabase/schema.sql).
3. Ejecuta. El script es idempotente: puedes volver a ejecutarlo sin perder datos.

El script crea:

- los ENUM de operación, categoría y estado;
- la tabla `public.properties` con índices y trigger de `updated_at`;
- las políticas RLS (lectura pública solo de `status = 'published'`);
- el bucket público `property-images` con límite de 5 MB y políticas por carpeta `{user_id}/`.

### 3. Configurar el acceso del vendedor

1. Ve a **Authentication → Providers → Email** y verifica que el proveedor esté activo. Luego desactiva el registro público (**Allow new users to sign up**); según la versión del dashboard aparece en **Authentication → Settings** o dentro del proveedor Email. El portal tiene un solo vendedor; las cuentas se crean a mano.
2. Ve a **Authentication → Users → Add user**:
   - escribe el email y la contraseña del vendedor;
   - marca **Auto Confirm User** para que pueda entrar de inmediato.
3. Guarda esas credenciales; son las que se usan en `/admin/login`.

### 4. Conectar la app

Crea `.env.local` en la raíz del proyecto:

```bash
cp .env.example .env.local
```

Completa los valores desde **Project Settings → API**:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-o-publishable-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Reinicia `npm run dev`. La app deja el modo demostración automáticamente cuando detecta una URL `https://` y una llave válida.

> **Seguridad:** la `anon`/`publishable key` es pública por diseño. La protección real está en las políticas RLS. **Nunca** pongas la `service_role key` en el frontend ni en variables `NEXT_PUBLIC_*`.

### 5. Datos de ejemplo (opcional)

Puedes ejecutar [`supabase/seed.sql`](supabase/seed.sql) para cargar 14 propiedades de demostración con fotos de Unsplash.

Para el blog, ejecuta [`supabase/blog-setup.sql`](supabase/blog-setup.sql): crea la tabla `posts`, sus políticas RLS y el bucket `blog-images`, y carga tres artículos publicados ya asignados a tu usuario si existe. Es idempotente, así que puedes volver a ejecutarlo para actualizar el texto sin duplicar filas.

Esas filas se insertan con `seller_id = null`, así que **se ven en el sitio público pero no en el panel del vendedor**. Para administrarlas, asígnalas a tu usuario:

```sql
update public.properties
set seller_id = (select id from auth.users where email = 'tu-correo@ejemplo.com')
where seller_id is null;
```

O bórralas cuando ya no las necesites:

```sql
delete from public.properties where seller_id is null;
```

---

## Usar el panel

1. Entra a `/admin/login` con el usuario creado en Supabase.
2. En **Propiedades** verás el listado, los conteos por estado y el buscador.
3. **Nueva propiedad** abre el formulario completo.
4. Completa título, operación, tipo, precio, ubicación, habitaciones y amenidades.
5. En **Fotos**, sube hasta 10 imágenes JPG/PNG/WebP de máximo 5 MB cada una. La primera será la portada; puedes reordenarlas o cambiarla con **Hacer portada**.
6. Elige el estado y guarda:
   - **Borrador:** solo visible en el panel.
   - **Publicada:** visible en el sitio, el buscador y el sitemap.
   - **Vendida / Alquilada:** se conserva el historial, pero no aparece como disponible.
7. **Eliminar** pide confirmación y borra la fila y sus imágenes del Storage.

Consejos:

- El slug se genera desde el título la primera vez y luego se mantiene, para no romper enlaces compartidos.
- Si cambias el título, la URL pública no cambia.
- Las imágenes se sirven sin optimización de Cloudflare, así que conviene subirlas ya comprimidas (JPG/WebP, ~1600 px de ancho).
- El formulario acepta latitud y longitud opcionales para mejorar el mapa de la ficha.

---

## Usar el blog

La primera vez necesitas un solo paso en Supabase: ejecutar `supabase/blog-setup.sql` en el SQL Editor. Ese archivo crea la tabla `posts`, las políticas RLS y el bucket `blog-images`, y deja tres artículos publicados de ejemplo. Puedes ejecutarlo otra vez sin duplicar nada.

1. Entra a **Blog** en el panel (`/admin/blog`).
2. **Nuevo artículo** abre el editor.
3. Escribe el título: el enlace (`/blog/...`) se genera solo y puedes ajustarlo.
4. El **extracto** (máx. 300 caracteres) aparece en el listado y en Google.
5. El contenido va en **Markdown** con pestaña de **Vista previa**:

   ```markdown
   ## Un subtítulo
   Un párrafo normal con **negrita** y un [enlace](https://ejemplo.com).

   - Punto uno
   - Punto dos

   > Una cita o aviso destacado.
   ```

6. La **portada** es opcional (JPG/PNG/WebP/AVIF, máx. 5 MB). Si no subes una, el artículo usa una portada con la marca.
7. **Guardar borrador** deja el artículo solo en el panel. **Publicar** lo hace visible en el sitio, el sitemap y el RSS.

Detalles:

- El tiempo de lectura se calcula solo (200 palabras por minuto).
- Los borradores no son accesibles públicamente gracias a RLS.
- El artículo termina con un bloque de contacto y tres artículos relacionados automáticos.
- Si cargaste los artículos del seed (sin autor), asígnalos a tu usuario con el SQL que está al final de `schema.sql`.

---

## Variables de entorno

| Variable | Obligatoria | Descripción |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Sí | URL del proyecto Supabase, con `https://`. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Sí | Llave pública (`anon` o `publishable`). |
| `NEXT_PUBLIC_SITE_URL` | Recomendada | URL pública sin slash final. Se usa en SEO, sitemap, Open Graph y WhatsApp. |

Sin las dos primeras, la app funciona en modo demostración.

---

## Estructura del proyecto

```text
istmo-propiedades/
├── public/                     # Imágenes estáticas, placeholder, _headers
├── src/
│   ├── app/
│   │   ├── (site)/             # Sitio público
│   │   │   ├── page.tsx        # Portada
│   │   │   ├── propiedades/    # Listado y ficha [slug]
│   │   │   ├── blog/           # Listado y artículo [slug]
│   │   │   ├── nosotros/
│   │   │   ├── contacto/
│   │   │   └── privacidad/
│   │   ├── admin/
│   │   │   ├── login/          # Acceso y server actions de auth
│   │   │   └── (panel)/        # Panel protegido
│   │   │       ├── page.tsx    # Listado de propiedades
│   │   │       ├── blog/       # Listado, editor y actions del blog
│   │   │       └── propiedades/
│   │   │           ├── nueva/
│   │   │           ├── [id]/
│   │   │           └── actions.ts
│   │   ├── layout.tsx          # Layout raíz, fuentes y metadatos
│   │   ├── globals.css         # Tokens y utilidades de Tailwind v4
│   │   ├── sitemap.ts
│   │   ├── robots.ts
│   │   └── manifest.ts
│   ├── components/
│   │   ├── admin/              # Formulario, imágenes, navegación
│   │   ├── blog/               # Tarjeta y render de Markdown
│   │   ├── layout/             # Header, footer, WhatsApp
│   │   ├── properties/         # Tarjeta, galería, mapa
│   │   ├── search/             # Filtros, orden, paginación
│   │   └── ui/                 # Botones, badges, logo, iconos
│   ├── config/site.ts          # Datos del negocio (EDITAR)
│   ├── proxy.ts                # Refresco de sesión de Supabase en /admin
│   └── lib/
│       ├── properties.ts       # Consultas públicas y del panel
│       ├── posts.ts            # Consultas del blog
│       ├── validation.ts       # Esquema Zod del formulario
│       ├── filters.ts          # Parseo de filtros desde la URL
│       ├── demo-data.ts        # Datos del modo demostración
│       ├── demo-posts.ts       # Artículos del modo demostración
│       ├── supabase/           # Clientes de Supabase
│       └── types.ts            # Tipos de dominio
├── supabase/
│   ├── schema.sql              # Tabla, RLS, índices y Storage
│   └── seed.sql                # Datos de ejemplo opcionales
├── wrangler.jsonc              # Configuración del Worker
├── open-next.config.ts         # Configuración de OpenNext
└── next.config.ts
```

---

## Scripts

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo en `localhost:3000`. |
| `npm run build` | Build de producción de Next.js. |
| `npm start` | Sirve el build de Next.js en Node. |
| `npm run typecheck` | Verifica TypeScript sin emitir archivos. |
| `npm run preview` | Build de OpenNext y vista previa en el runtime de Workers. |
| `npm run deploy` | Build de OpenNext y despliegue a Cloudflare. |
| `npm run upload` | Sube una versión del Worker sin promoverla. |
| `npm run cf-typegen` | Genera tipos de bindings de Cloudflare. |

---

## Desplegar en Cloudflare (GitHub → Workers)

> **Nota:** el proyecto puede publicarse en Vercel (conexión directa a GitHub, sin pasos extra). Los pasos de Cloudflare de esta sección son una alternativa para usar el plan gratuito de Workers.

El despliegue recomendado es con **Workers Builds**: conectas el repositorio y Cloudflare reconstruye y publica en cada push a la rama de producción.

### 1. Subir el proyecto a GitHub

Desde la carpeta del proyecto:

```bash
git init
git add .
git commit -m "Istmo Realty: sitio público y panel"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/istmo-propiedades.git
git push -u origin main
```

> El `.gitignore` ya excluye `node_modules`, `.next`, `.open-next`, `.env*.local` y archivos de build. No subas `.env.local`.

### 2. Crear el Worker en Cloudflare

1. Entra a **Cloudflare Dashboard → Workers & Pages**.
2. Elige **Create → Workers → Import a repository** (o **Connect to Git**).
3. Autoriza GitHub y selecciona el repositorio.
4. Configura el build:

| Campo | Valor |
| --- | --- |
| **Git branch** | `main` |
| **Root directory** | Déjalo vacío si el repo es esta carpeta. Si el repo contiene una carpeta padre, escribe `istmo-propiedades`. |
| **Build command** | `npx opennextjs-cloudflare build` |
| **Deploy command** | `npx wrangler deploy` |
| **Preview command** | Déjalo por defecto o usa `npx wrangler versions upload`. |

El `wrangler.jsonc` ya define el entrypoint `.open-next/worker.js`, los assets y la compatibilidad con Node.js. No cambies esos valores.

### 3. Variables de build

En **Settings → Build → Build variables and secrets**, agrega:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_SITE_URL
```

Son necesarias en el build porque Next.js inserta las variables `NEXT_PUBLIC_*` en el bundle del navegador.

Opcionalmente agrega `NODE_VERSION=22` si el build no toma la versión correcta de Node.

### 4. Variables de runtime

En **Settings → Variables & Secrets**, agrega las mismas tres variables para el Worker en producción. El código del servidor (Supabase Auth, cliente de servidor y datos) las lee en tiempo de ejecución.

- `NEXT_PUBLIC_SUPABASE_URL`: texto normal.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: texto normal (es pública; no la marques como secreta).
- `NEXT_PUBLIC_SITE_URL`: la URL final del sitio, por ejemplo `https://istmorealty.com`.

### 5. Desplegar

Guarda la configuración y lanza el primer build. Cloudflare instalará dependencias, ejecutará OpenNext y publicará el Worker. Al terminar tendrás una URL `https://istmo-propiedades.<subdominio>.workers.dev`.

Cada push a `main` reconstruye y publica automáticamente.

### 6. Dominio propio (opcional)

1. En el Worker ve a **Settings → Domains & Routes → Add custom domain**.
2. Agrega tu dominio (puedes comprarlo o transferir el DNS a Cloudflare).
3. Actualiza `NEXT_PUBLIC_SITE_URL` con el dominio final, tanto en build como en runtime.
4. Vuelve a desplegar para regenerar sitemap, canonical y Open Graph con la URL correcta.

### Alternativa por CLI

Si prefieres desplegar desde tu computadora:

```bash
npx wrangler login
npm run deploy
```

La primera vez Wrangler pedirá autorización en el navegador.

### Comprobar el despliegue

- Abre `/`, `/propiedades` y una ficha.
- Entra a `/admin/login` con el usuario de Supabase.
- Crea una propiedad de prueba y confirma que aparece en el sitio.
- Revisa **Workers & Pages → tu Worker → Logs** si algo falla.

---

## Personalizar el sitio

1. **Datos del negocio:** edita [`src/config/site.ts`](src/config/site.ts): nombre, teléfono, WhatsApp, email, dirección, horario y redes. Es el único archivo necesario para cambiar la identidad comercial.
2. **Imágenes principales:** reemplaza `public/hero.jpg`, `public/about.jpg` y `public/og.jpg` por fotos propias.
3. **Colores y tipografía:** ajusta los tokens en [`src/app/globals.css`](src/app/globals.css).
4. **Textos:** las páginas de inicio, nosotros, contacto y privacidad están en `src/app/(site)/`.
5. **Categorías:** se definen en `src/lib/types.ts` y en el ENUM de `supabase/schema.sql`. Si agregas una categoría nueva, actualiza ambos y ejecuta un `ALTER TYPE ... ADD VALUE` en Supabase.
6. **Amenidades:** se administran en `src/lib/constants.ts`; no requieren cambios en la base de datos.
7. **Dominio y SEO:** configura `NEXT_PUBLIC_SITE_URL` y reemplaza los datos de contacto de ejemplo antes de lanzar.

Checklist antes de publicar:

- [ ] Reemplazar teléfono, WhatsApp, email y dirección en `src/config/site.ts`.
- [ ] Confirmar que el WhatsApp abre con el número correcto.
- [ ] Subir fotos reales y eliminar las de ejemplo.
- [ ] Configurar el dominio y `NEXT_PUBLIC_SITE_URL`.
- [ ] Desactivar el registro público en Supabase.
- [ ] Verificar que el usuario vendedor puede entrar y crear/editar/eliminar.
- [ ] Revisar `/privacidad` y adaptarla a tu operación.
- [ ] Probar el sitio en móvil.

---

## Mantenimiento y respaldos

- **Respaldos:** en el plan gratuito de Supabase no hay backups automáticos diarios. Exporta periódicamente con `pg_dump` o desde **Database → Backups** si tu plan lo incluye. También puedes descargar las tablas como CSV desde el Table Editor.
- **Imágenes:** viven en el bucket `property-images`. Un respaldo de la base de datos no incluye los archivos; descárgalos desde **Storage** si necesitas una copia.
- **Actualizaciones:** ejecuta `npm outdated` y actualiza con cuidado. Prueba `npm run typecheck` y `npm run build` antes de desplegar.
- **Inactividad de Supabase:** los proyectos gratuitos se pausan tras un periodo de inactividad. Si el sitio va a estar quieto, programa una visita o considera el plan pago.
- **Escalabilidad:** el panel no requiere cambios de código al crecer. Los filtros e índices están preparados para miles de propiedades; si el volumen crece mucho, revisa los índices y la paginación.

---

## Solución de problemas

**El sitio sigue en modo demostración**

- Verifica que `.env.local` exista y tenga valores reales.
- La URL debe empezar con `https://` y la llave debe tener más de 20 caracteres.
- Reinicia `npm run dev` después de cambiar variables.

**No puedo entrar al panel**

- Confirma que el usuario esté creado y con email confirmado en **Authentication → Users**.
- Revisa la contraseña; si es necesario, restablécala desde el dashboard.
- Asegúrate de haber desactivado el registro público, pero no el proveedor Email.

**Una propiedad publicada no aparece**

- Revisa que el estado sea **Publicada**.
- Confirma que la fecha y el slug se guardaron.
- Si acabas de guardar, recarga la página; el sitio usa datos dinámicos.
- Revisa la consola del navegador y los logs del Worker.

**Las imágenes no cargan**

- El bucket `property-images` debe ser público.
- La ruta guardada debe ser `{user_id}/{archivo}.ext` o una URL `https://`.
- Verifica las políticas de Storage en Supabase.
- Si usas imágenes externas, confirma que la URL sea accesible.

**El build de Cloudflare falla**

- Usa Node 22 (`NODE_VERSION=22`).
- Confirma el build command `npx opennextjs-cloudflare build` y el deploy command `npx wrangler deploy`.
- Verifica que las tres variables estén en **Build variables and secrets**.
- Revisa el log del build: casi siempre falta una variable o hay un error de TypeScript.

**Error 404 al editar una propiedad**

- La propiedad debe pertenecer al usuario autenticado (`seller_id = auth.uid()`).
- Las propiedades del `seed.sql` tienen `seller_id = null`; asígnalas a tu usuario o vuelve a crearlas desde el panel.

---

## Licencias y créditos

- Código del proyecto: úsalo y modifícalo libremente para tu negocio.
- [Next.js](https://nextjs.org), [React](https://react.dev), [Tailwind CSS](https://tailwindcss.com), [Lucide](https://lucide.dev) y [Supabase](https://supabase.com): licencias open source.
- Fotos de ejemplo: [Unsplash](https://unsplash.com/license), uso comercial permitido sin atribución obligatoria.
- Tipografías: Fraunces y Manrope, disponibles en Google Fonts bajo SIL Open Font License.

---

Hecho para operar un portafolio inmobiliario real en Panamá, sin costos de infraestructura y sin depender de un CMS externo.
