-- ============================================================================
--  ISTMO REALTY · Esquema de base de datos para Supabase
--  Ejecutar completo en: Supabase Dashboard → SQL Editor → New query → Run
--  Es idempotente: puedes volver a ejecutarlo sin perder datos.
-- ============================================================================

create extension if not exists pgcrypto;

-- ----------------------------------------------------------------------------
-- 1. ENUMs
-- ----------------------------------------------------------------------------
do $$ begin
  create type public.transaction_type as enum ('Venta', 'Alquiler');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.property_category as enum (
    'Apartamentos',
    'Casas',
    'Lotes y Terrenos',
    'Locales comerciales y bodegas',
    'Oficinas',
    'Fincas',
    'Propiedades de playa',
    'Edificios',
    'Negocios',
    'Estacionamientos y otros',
    'Propiedades de isla'
  );
exception when duplicate_object then null; end $$;

-- Estado editorial: permite guardar borradores antes de publicar.
do $$ begin
  create type public.property_status as enum ('draft', 'published', 'sold', 'rented');
exception when duplicate_object then null; end $$;

-- ----------------------------------------------------------------------------
-- 2. Tabla principal
-- ----------------------------------------------------------------------------
create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  price numeric(14, 2) not null check (price >= 0),
  currency text not null default 'USD' check (currency in ('USD', 'PAB')),

  -- Ubicación jerárquica
  province text not null,
  district text not null,
  neighborhood text,

  -- Clasificación
  transaction_type public.transaction_type not null,
  property_type public.property_category not null,

  -- Métricas
  bedrooms int check (bedrooms >= 0),
  bathrooms int check (bathrooms >= 0),
  parking_spots int check (parking_spots >= 0),
  area_m2 numeric(12, 2) check (area_m2 > 0),

  -- Extras
  amenities text[] not null default '{}',
  is_furnished boolean not null default false,

  -- Multimedia y ubicación exacta (opcional para el mapa)
  images text[] not null default '{}',
  latitude double precision,
  longitude double precision,

  -- Publicación
  slug text,
  status public.property_status not null default 'draft',
  is_featured boolean not null default false,

  -- Auditoría
  seller_id uuid references auth.users (id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint properties_title_length check (char_length(title) between 3 and 160)
);

-- Compatibilidad con instalaciones que crearon la tabla desde un borrador previo.
alter table public.properties add column if not exists slug text;
alter table public.properties add column if not exists status public.property_status not null default 'draft';
alter table public.properties add column if not exists is_featured boolean not null default false;
alter table public.properties add column if not exists latitude double precision;
alter table public.properties add column if not exists longitude double precision;
alter table public.properties add column if not exists currency text not null default 'USD';
alter table public.properties add column if not exists updated_at timestamptz not null default now();

-- ----------------------------------------------------------------------------
-- 3. Índices (búsquedas y filtros)
-- ----------------------------------------------------------------------------
create unique index if not exists properties_slug_key
  on public.properties (slug);

create index if not exists properties_published_idx
  on public.properties (status, created_at desc);

create index if not exists properties_tx_type_idx
  on public.properties (transaction_type, property_type);

create index if not exists properties_location_idx
  on public.properties (province, district);

create index if not exists properties_price_idx
  on public.properties (price);

create index if not exists properties_seller_idx
  on public.properties (seller_id, created_at desc);

create index if not exists properties_amenities_idx
  on public.properties using gin (amenities);

-- Búsqueda por texto libre (título / descripción / barrio).
create extension if not exists pg_trgm;
create index if not exists properties_title_trgm_idx
  on public.properties using gin (title gin_trgm_ops);
create index if not exists properties_description_trgm_idx
  on public.properties using gin (description gin_trgm_ops);

-- ----------------------------------------------------------------------------
-- 4. updated_at automático
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists properties_set_updated_at on public.properties;
create trigger properties_set_updated_at
  before update on public.properties
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- 5. Row Level Security
--    - Cualquiera puede LEER propiedades publicadas.
--    - El vendedor autenticado solo puede crear/editar/borrar SUS propiedades.
-- ----------------------------------------------------------------------------
alter table public.properties enable row level security;

drop policy if exists "Public read access" on public.properties;
drop policy if exists "Auth users can insert" on public.properties;
drop policy if exists "Auth users can update" on public.properties;
drop policy if exists "Auth users can delete" on public.properties;
drop policy if exists "Published properties are public" on public.properties;
drop policy if exists "Sellers can read their own properties" on public.properties;
drop policy if exists "Sellers can insert their own properties" on public.properties;
drop policy if exists "Sellers can update their own properties" on public.properties;
drop policy if exists "Sellers can delete their own properties" on public.properties;

create policy "Published properties are public"
  on public.properties
  for select
  to anon, authenticated
  using (status = 'published');

create policy "Sellers can read their own properties"
  on public.properties
  for select
  to authenticated
  using ((select auth.uid()) = seller_id);

create policy "Sellers can insert their own properties"
  on public.properties
  for insert
  to authenticated
  with check ((select auth.uid()) = seller_id);

create policy "Sellers can update their own properties"
  on public.properties
  for update
  to authenticated
  using ((select auth.uid()) = seller_id)
  with check ((select auth.uid()) = seller_id);

create policy "Sellers can delete their own properties"
  on public.properties
  for delete
  to authenticated
  using ((select auth.uid()) = seller_id);

-- Permisos de tabla (Supabase los suele aplicar por defecto; los dejamos explícitos).
grant select on public.properties to anon;
grant select, insert, update, delete on public.properties to authenticated;

-- ----------------------------------------------------------------------------
-- 6. Storage: bucket público para imágenes
--    Ruta de cada archivo: {seller_id}/{uuid}.{ext}
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'property-images',
  'property-images',
  true,
  5242880, -- 5 MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Property images are publicly readable" on storage.objects;
drop policy if exists "Sellers can upload property images" on storage.objects;
drop policy if exists "Sellers can update their property images" on storage.objects;
drop policy if exists "Sellers can delete their property images" on storage.objects;

create policy "Property images are publicly readable"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'property-images');

create policy "Sellers can upload property images"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'property-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "Sellers can update their property images"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'property-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  )
  with check (
    bucket_id = 'property-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "Sellers can delete their property images"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'property-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

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
--  SIGUIENTE PASO (manual, en el dashboard de Supabase):
--  1. Authentication → Settings: desactiva "Allow new users to sign up"
--     (el registro público). El portal tiene UN solo vendedor.
--  2. Authentication → Users → Add user: crea el usuario del vendedor
--     (email + contraseña) y confírmalo.
--  3. Ejecuta supabase/seed.sql (opcional) para cargar datos de ejemplo.
--  4. Si cargaste artículos del seed (sin autor), asígnalos a tu usuario:
--     update public.posts set author_id = (select id from auth.users limit 1)
--     where author_id is null;
-- ============================================================================
