-- =============================================================================
-- LINÉA — schema, roles, RLS, and storage
-- Run this in the Supabase SQL editor (or via the Supabase CLI) once per project.
-- =============================================================================

-- Needed for gen_random_uuid()
create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- Roles
-- ----------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'app_role') then
    create type public.app_role as enum ('admin', 'customer');
  end if;
end $$;

create table if not exists public.user_roles (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  role        public.app_role not null,
  created_at  timestamptz not null default now(),
  unique (user_id, role)
);

-- SECURITY DEFINER function so RLS policies can check roles without recursion.
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  );
$$;

-- ----------------------------------------------------------------------------
-- Categories (self-referencing tree: top → sub → sub-sub)
-- ----------------------------------------------------------------------------
create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  parent_id   uuid references public.categories (id) on delete restrict,
  description text,
  image_url   text,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

create index if not exists categories_parent_idx on public.categories (parent_id);

-- ----------------------------------------------------------------------------
-- Products
-- ----------------------------------------------------------------------------
create table if not exists public.products (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  slug             text not null unique,
  description      text,
  price            numeric(10, 2) not null default 0,
  compare_at_price numeric(10, 2),
  category_id      uuid references public.categories (id) on delete set null,
  images           text[] not null default '{}',
  status           text not null default 'draft' check (status in ('live', 'draft')),
  featured         boolean not null default false,
  stock            integer not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists products_category_idx on public.products (category_id);
create index if not exists products_status_idx on public.products (status);
create index if not exists products_featured_idx on public.products (featured);

-- keep updated_at fresh
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists products_touch_updated_at on public.products;
create trigger products_touch_updated_at
  before update on public.products
  for each row execute function public.touch_updated_at();

-- ----------------------------------------------------------------------------
-- Row Level Security
-- ----------------------------------------------------------------------------
alter table public.user_roles enable row level security;
alter table public.categories enable row level security;
alter table public.products   enable row level security;

-- user_roles ---------------------------------------------------------------
-- A user may read their own roles; admins may read all.
drop policy if exists "read own or admin roles" on public.user_roles;
create policy "read own or admin roles" on public.user_roles
  for select to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));

-- The "claim admin" flow: an authenticated user may insert the FIRST admin
-- row for themselves only while no admin exists yet. Admins can also insert.
drop policy if exists "claim first admin or admin writes" on public.user_roles;
create policy "claim first admin or admin writes" on public.user_roles
  for insert to authenticated
  with check (
    public.has_role(auth.uid(), 'admin')
    or (
      user_id = auth.uid()
      and role = 'admin'
      and not exists (select 1 from public.user_roles where role = 'admin')
    )
  );

drop policy if exists "admins delete roles" on public.user_roles;
create policy "admins delete roles" on public.user_roles
  for delete to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- categories ----------------------------------------------------------------
drop policy if exists "public read categories" on public.categories;
create policy "public read categories" on public.categories
  for select to anon, authenticated using (true);

drop policy if exists "admins write categories" on public.categories;
create policy "admins write categories" on public.categories
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- products ------------------------------------------------------------------
-- Public can read live products; admins can read everything.
drop policy if exists "public read live products" on public.products;
create policy "public read live products" on public.products
  for select to anon, authenticated
  using (status = 'live' or public.has_role(auth.uid(), 'admin'));

drop policy if exists "admins write products" on public.products;
create policy "admins write products" on public.products
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- ----------------------------------------------------------------------------
-- Storage bucket: product-images (public read, admin write)
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "public read product images" on storage.objects;
create policy "public read product images" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'product-images');

drop policy if exists "admins upload product images" on storage.objects;
create policy "admins upload product images" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'product-images' and public.has_role(auth.uid(), 'admin')
  );

drop policy if exists "admins update product images" on storage.objects;
create policy "admins update product images" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'product-images' and public.has_role(auth.uid(), 'admin')
  );

drop policy if exists "admins delete product images" on storage.objects;
create policy "admins delete product images" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'product-images' and public.has_role(auth.uid(), 'admin')
  );
