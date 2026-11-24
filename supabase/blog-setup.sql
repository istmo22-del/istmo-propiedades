-- ============================================================================
--  Istmo Realty: blog completo en un solo paso
--
--  Pega este archivo en el SQL Editor de Supabase y ejecuta.
--  Es seguro ejecutarlo más de una vez (no duplica artículos).
-- ============================================================================

-- Función de updated_at (si ya existe, se reemplaza sin problema).
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ----------------------------------------------------------------------------
-- 7. Blog
--    - Público lee solo artículos publicados.
--    - El autor solo crea/edita/borra SUS artículos (mismo patrón que properties).
-- ----------------------------------------------------------------------------
do $$ begin
  create type public.post_status as enum ('draft', 'published');
exception when duplicate_object then null; end $$;

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  content text not null,
  cover_image text,
  status public.post_status not null default 'draft',
  published_at timestamptz,
  author_id uuid references auth.users (id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint posts_title_length check (char_length(title) between 3 and 160),
  constraint posts_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

create index if not exists posts_published_idx
  on public.posts (status, published_at desc);

create index if not exists posts_author_idx
  on public.posts (author_id, updated_at desc);

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

alter table public.posts enable row level security;

drop policy if exists "Published posts are public" on public.posts;
drop policy if exists "Authors can read their own posts" on public.posts;
drop policy if exists "Authors can insert their own posts" on public.posts;
drop policy if exists "Authors can update their own posts" on public.posts;
drop policy if exists "Authors can delete their own posts" on public.posts;

create policy "Published posts are public"
  on public.posts
  for select
  to anon, authenticated
  using (status = 'published');

create policy "Authors can read their own posts"
  on public.posts
  for select
  to authenticated
  using ((select auth.uid()) = author_id);

create policy "Authors can insert their own posts"
  on public.posts
  for insert
  to authenticated
  with check ((select auth.uid()) = author_id);

create policy "Authors can update their own posts"
  on public.posts
  for update
  to authenticated
  using ((select auth.uid()) = author_id)
  with check ((select auth.uid()) = author_id);

create policy "Authors can delete their own posts"
  on public.posts
  for delete
  to authenticated
  using ((select auth.uid()) = author_id);

grant select on public.posts to anon;
grant select, insert, update, delete on public.posts to authenticated;

-- Storage: portadas del blog (misma estructura que property-images).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'blog-images',
  'blog-images',
  true,
  5242880, -- 5 MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Blog images are publicly readable" on storage.objects;
drop policy if exists "Authors can upload blog images" on storage.objects;
drop policy if exists "Authors can update their blog images" on storage.objects;
drop policy if exists "Authors can delete their blog images" on storage.objects;

create policy "Blog images are publicly readable"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'blog-images');

create policy "Authors can upload blog images"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'blog-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "Authors can update their blog images"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'blog-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  )
  with check (
    bucket_id = 'blog-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "Authors can delete their blog images"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'blog-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

-- ============================================================================
--  Artículos del blog de Istmo Realty
--
--  Cómo usarlo:
--   1. Ejecuta primero supabase/schema.sql (crea la tabla, RLS y el bucket).
--   2. Pega este archivo completo en el SQL Editor de Supabase y ejecútalo.
--
--  Es idempotente: si lo vuelves a ejecutar actualiza el texto de los artículos
--  ya existentes en lugar de duplicarlos.
-- ============================================================================

insert into public.posts (slug, title, excerpt, content, cover_image, status, published_at, author_id)
values
(
  '3-errores-al-comprar-propiedad-en-panama',
  '3 errores silenciosos al comprar una propiedad en Panamá (y cómo evitarlos antes de firmar)',
  'Gravámenes ocultos, uso de suelo y gastos de cierre: los tres puntos que arruinan compras en Panamá y cómo revisarlos antes de pagar el abono.',
  $post$Comprar una casa, un apartamento o un terreno en Panamá puede ser la mejor inversión de tu vida o un problema legal de años. Muchos compradores se enamoran de la vista o del precio y pasan por alto detalles que se revisan antes de firmar. Si estás pensando invertir este año, revisa estas tres trampas.

## 1. Confiar en la promesa sin revisar el Registro Público

Que alguien te muestre una escritura no significa que la propiedad esté libre de gravámenes, hipotecas o anotaciones judiciales. Exige un certificado del Registro Público actualizado, idealmente el mismo día de la negociación, y un estudio de título hecho por un abogado independiente.

## 2. No verificar el uso de suelo

Comprar un lote en una zona de crecimiento pensando en un local comercial o en alquiler turístico, y descubrir después que la zonificación es solo residencial, detiene el proyecto en seco. Antes del abono pide el certificado de uso de suelo y el plano aprobado en la municipalidad correspondiente.

## 3. Subestimar los gastos de cierre

Además del precio acordado existen el impuesto de transferencia (2%), el impuesto de ganancia de capital (3%), los gastos notariales y los honorarios legales. Si ese flujo no está calculado desde el primer día, el cierre financiero se cae a mitad de camino.

## El consejo que importa

Una asesoría inmobiliaria seria antes del primer abono cuesta una fracción de lo que cuesta resolver un problema legal después.$post$,
  null,
  'published',
  now() - interval '5 minutes',
  (select id from auth.users order by created_at asc limit 1)
),
(
  'extranjeros-jubilados-chiriqui-y-playas-de-panama',
  '¿Por qué cada vez más extranjeros están mudando su retiro (y su capital) a Chiriquí y las playas de Panamá?',
  'Boquete, Volcán y la costa del Pacífico concentran la demanda de jubilados y compradores internacionales. Clima, visas y retorno por alquiler.',
  $post$Mientras el costo de vida en Norteamérica y Europa sigue subiendo, Panamá se mantiene entre los destinos favoritos de quienes buscan calidad de vida, seguridad jurídica y una economía dolarizada. El interés ya no se concentra solo en la Ciudad de Panamá.

Hoy los compradores internacionales miran con fuerza el interior del país, sobre todo Boquete, Volcán y la costa del Pacífico. Estas son las tres razones.

## Microclimas y estilo de vida

Vivir en la montaña con clima primaveral todo el año, o a 15 minutos de la playa, con fibra óptica, hospitales privados y aeropuertos cerca, es una combinación difícil de igualar en la región.

## Beneficios fiscales y migratorios

Programas como la Visa de Pensionado y la Visa de Inversionista Calificado ofrecen incentivos que protegen el patrimonio y facilitan la residencia permanente. Conviene revisar los requisitos vigentes con un abogado migratorio antes de iniciar el trámite.

## Plusvalía y retorno por alquiler

Las propiedades bien ubicadas en zonas turísticas o de retiro mantienen demanda de alquileres a mediano y largo plazo, y generan ingresos en dólares.

Para vivir o para diversificar portafolio, el mercado inmobiliario fuera de la capital vive uno de sus momentos más dinámicos.$post$,
  null,
  'published',
  now() - interval '15 minutes',
  (select id from auth.users order by created_at asc limit 1)
),
(
  'por-que-tu-propiedad-no-se-vende-en-panama',
  '¿Tu propiedad lleva meses en venta y nadie hace una oferta? Esta es la verdadera razón',
  'Precio fuera de mercado, fotos que no venden y papeles incompletos: por qué una propiedad lleva meses publicada sin ofertas.',
  $post$En el mercado actual de Panamá las propiedades bien posicionadas se mueven rápido, mientras otras pasan más de un año publicadas sin recibir una oferta seria. Cuando eso pasa, casi siempre es por una combinación de tres factores.

## Precio basado en emociones, no en mercado

Ponerle precio a tu casa según lo que costó remodelarla o lo que necesitas recibir no funciona si el avalúo y las ventas recientes de la zona dicen otra cosa. Un precio inflado desde el inicio solo ayuda a vender las propiedades de tus vecinos.

## Presentación digital deficiente

La primera visita ocurre en el teléfono. Fotos oscuras, desordenadas o tomadas con prisa hacen que el comprador descarte la propiedad en segundos.

## Falta de documentación lista

Cuando aparece un comprador con financiamiento aprobado o pago de contado, no tener paz y salvos al día (IDAAN, mantenimiento, inmueble) ni planos actualizados puede enfriar el trato y mandar al cliente a otra opción.

Vender al mejor precio posible requiere estrategia, datos reales de mercado y exposición frente al comprador correcto. No se trata solo de colgar un letrero.$post$,
  null,
  'published',
  now() - interval '25 minutes',
  (select id from auth.users order by created_at asc limit 1)
)
on conflict (slug) do update
  set title = excluded.title,
      excerpt = excluded.excerpt,
      content = excluded.content,
      cover_image = coalesce(public.posts.cover_image, excluded.cover_image),
      status = excluded.status,
      published_at = coalesce(public.posts.published_at, excluded.published_at),
      author_id = coalesce(public.posts.author_id, excluded.author_id),
      updated_at = now();
