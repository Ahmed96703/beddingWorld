-- =============================================================================
-- LINÉA — store settings, team (admin) management, and catalog cleanup
-- Run this AFTER 0001_init.sql in the Supabase SQL editor.
-- =============================================================================

-- ----------------------------------------------------------------------------
-- 1. Store settings (single-row config table)
-- ----------------------------------------------------------------------------
create table if not exists public.store_settings (
  id                     integer primary key default 1,
  store_name             text not null default 'LINÉA',
  base_currency          text not null default 'USD',
  auto_detect_currency   boolean not null default true,
  free_shipping_threshold numeric(10, 2) not null default 120,
  shipping_flat          numeric(10, 2) not null default 9,
  updated_at             timestamptz not null default now(),
  constraint store_settings_single_row check (id = 1)
);

insert into public.store_settings (id) values (1) on conflict (id) do nothing;

alter table public.store_settings enable row level security;

drop policy if exists "public read settings" on public.store_settings;
create policy "public read settings" on public.store_settings
  for select to anon, authenticated using (true);

drop policy if exists "admins write settings" on public.store_settings;
create policy "admins write settings" on public.store_settings
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- ----------------------------------------------------------------------------
-- 2. Team management — grant / revoke / list admins by email
--    SECURITY DEFINER so they can read auth.users, but each one re-checks that
--    the caller is an admin.
-- ----------------------------------------------------------------------------
create or replace function public.list_admins()
returns table (user_id uuid, email text, created_at timestamptz)
language sql
stable
security definer
set search_path = public
as $$
  select ur.user_id, u.email::text, ur.created_at
  from public.user_roles ur
  join auth.users u on u.id = ur.user_id
  where ur.role = 'admin'
    and public.has_role(auth.uid(), 'admin')
  order by ur.created_at;
$$;

create or replace function public.grant_admin(_email text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  _uid uuid;
begin
  if not public.has_role(auth.uid(), 'admin') then
    raise exception 'Only admins can grant admin access';
  end if;

  select id into _uid from auth.users where lower(email) = lower(trim(_email)) limit 1;

  if _uid is null then
    raise exception 'No registered user found with that email. Ask them to register first.';
  end if;

  insert into public.user_roles (user_id, role)
  values (_uid, 'admin')
  on conflict (user_id, role) do nothing;
end;
$$;

create or replace function public.revoke_admin(_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.has_role(auth.uid(), 'admin') then
    raise exception 'Only admins can revoke admin access';
  end if;

  if _user_id = auth.uid() then
    raise exception 'You cannot remove your own admin access';
  end if;

  if (select count(*) from public.user_roles where role = 'admin') <= 1 then
    raise exception 'Cannot remove the last remaining admin';
  end if;

  delete from public.user_roles where user_id = _user_id and role = 'admin';
end;
$$;

-- ----------------------------------------------------------------------------
-- 3. Remove the "Home & Kitchen" category (not sold) + its sub-categories
--    and any products that lived under it.
-- ----------------------------------------------------------------------------
do $$
declare
  _root uuid;
begin
  select id into _root from public.categories where slug = 'home-kitchen';
  if _root is not null then
    -- products in the sub-categories (and the root itself, if any)
    delete from public.products
    where category_id in (
      select id from public.categories
      where id = _root or parent_id = _root
    );
    -- sub-categories, then the root
    delete from public.categories where parent_id = _root;
    delete from public.categories where id = _root;
  end if;
end $$;
