-- =============================================================================
-- Bedding World — multi-category products + order archiving
--   • product_categories : many-to-many pivot (a product in many categories)
--   • orders.archived     : Delivered/Cancelled orders move to History
--   • set_order_status()  : auto-archives on delivered/cancelled
--   • set_order_archived(): archive / restore an order manually
-- Run in the Supabase SQL editor AFTER 0004. Idempotent.
-- =============================================================================

-- ----------------------------------------------------------------------------
-- 1. Product ↔ Category pivot (many-to-many)
-- ----------------------------------------------------------------------------
create table if not exists public.product_categories (
  product_id  uuid not null references public.products (id) on delete cascade,
  category_id uuid not null references public.categories (id) on delete cascade,
  primary key (product_id, category_id)
);
create index if not exists product_categories_category_idx
  on public.product_categories (category_id);

alter table public.product_categories enable row level security;

drop policy if exists "public read product_categories" on public.product_categories;
create policy "public read product_categories" on public.product_categories
  for select to anon, authenticated using (true);

drop policy if exists "admins write product_categories" on public.product_categories;
create policy "admins write product_categories" on public.product_categories
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- Backfill from the existing single category_id so nothing disappears.
insert into public.product_categories (product_id, category_id)
select id, category_id from public.products where category_id is not null
on conflict do nothing;

-- ----------------------------------------------------------------------------
-- 2. Order archiving
-- ----------------------------------------------------------------------------
alter table public.orders
  add column if not exists archived boolean not null default false;
create index if not exists orders_archived_idx on public.orders (archived);

-- Existing delivered/cancelled orders move to history immediately.
update public.orders set archived = true
where status in ('delivered', 'cancelled') and archived = false;

-- set_order_status(): now also archives delivered/cancelled orders (and
-- un-archives when moved back to an active status).
create or replace function public.set_order_status(_order_id uuid, _status text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  _old text;
  _it  record;
begin
  if not public.has_role(auth.uid(), 'admin') then
    raise exception 'Only admins can change order status.';
  end if;
  if _status not in ('received','confirmed','packed','shipped','out_for_delivery','delivered','cancelled') then
    raise exception 'Invalid status.';
  end if;

  select status into _old from public.orders where id = _order_id for update;
  if not found then raise exception 'Order not found.'; end if;

  if _status = 'cancelled' and _old <> 'cancelled' then
    for _it in select * from public.order_items where order_id = _order_id loop
      if _it.variant_id is not null then
        update public.product_variants set stock = stock + _it.quantity where id = _it.variant_id;
      elsif _it.product_id is not null then
        update public.products set stock = stock + _it.quantity where id = _it.product_id;
      end if;
    end loop;
  elsif _old = 'cancelled' and _status <> 'cancelled' then
    for _it in select * from public.order_items where order_id = _order_id loop
      if _it.variant_id is not null then
        update public.product_variants set stock = greatest(0, stock - _it.quantity) where id = _it.variant_id;
      elsif _it.product_id is not null then
        update public.products set stock = greatest(0, stock - _it.quantity) where id = _it.product_id;
      end if;
    end loop;
  end if;

  update public.orders
  set status = _status,
      archived = (_status in ('delivered', 'cancelled')),
      updated_at = now()
  where id = _order_id;
end;
$$;

grant execute on function public.set_order_status(uuid, text) to authenticated;

-- Manually archive or restore an order (restore keeps its status).
create or replace function public.set_order_archived(_order_id uuid, _archived boolean)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.has_role(auth.uid(), 'admin') then
    raise exception 'Only admins can archive orders.';
  end if;
  update public.orders set archived = _archived, updated_at = now()
  where id = _order_id;
  if not found then raise exception 'Order not found.'; end if;
end;
$$;

grant execute on function public.set_order_archived(uuid, boolean) to authenticated;
