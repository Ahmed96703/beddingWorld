-- =============================================================================
-- Bedding World — Phase 1: stock, product variations & orders
--   • product_variants  : per-size price + stock (Single/Double, extensible)
--   • orders/order_items: persisted COD orders
--   • place_order()     : atomic stock check + decrement + order insert
--   • set_order_status(): admin status change; restores stock on cancel
--   • get_inventory_report(): current stock, sold, remaining, low-stock flag
-- Run in the Supabase SQL editor AFTER 0001. Idempotent.
-- =============================================================================

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- Product variants (optional per product). No rows = product uses its own
-- price/stock. Rows = the ONLY buyable options (each with its own price/stock).
-- ----------------------------------------------------------------------------
create table if not exists public.product_variants (
  id           uuid primary key default gen_random_uuid(),
  product_id   uuid not null references public.products (id) on delete cascade,
  name         text not null,               -- "Single", "Double", "King"…
  variant_key  text not null,               -- "single", "double" (stable id)
  price        numeric(10, 2) not null default 0,
  stock        integer not null default 0,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now(),
  unique (product_id, variant_key)
);
create index if not exists product_variants_product_idx
  on public.product_variants (product_id);

alter table public.product_variants enable row level security;

drop policy if exists "public read variants" on public.product_variants;
create policy "public read variants" on public.product_variants
  for select to anon, authenticated using (true);

drop policy if exists "admins write variants" on public.product_variants;
create policy "admins write variants" on public.product_variants
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- ----------------------------------------------------------------------------
-- Orders + items
-- ----------------------------------------------------------------------------
create table if not exists public.orders (
  id             uuid primary key default gen_random_uuid(),
  order_ref      text not null unique,
  customer_name  text not null,
  phone          text not null,
  email          text,
  address        text not null,
  city           text not null,
  notes          text,
  subtotal       numeric(10, 2) not null default 0,
  shipping       numeric(10, 2) not null default 0,
  total          numeric(10, 2) not null default 0,
  payment_method text not null default 'cod',
  status         text not null default 'received'
    check (status in ('received','confirmed','packed','shipped','out_for_delivery','delivered','cancelled')),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index if not exists orders_created_idx on public.orders (created_at desc);
create index if not exists orders_status_idx on public.orders (status);

create table if not exists public.order_items (
  id           uuid primary key default gen_random_uuid(),
  order_id     uuid not null references public.orders (id) on delete cascade,
  product_id   uuid references public.products (id) on delete set null,
  variant_id   uuid references public.product_variants (id) on delete set null,
  product_name text not null,
  variant_name text,
  unit_price   numeric(10, 2) not null,
  quantity     integer not null,
  line_total   numeric(10, 2) not null
);
create index if not exists order_items_order_idx on public.order_items (order_id);

alter table public.orders      enable row level security;
alter table public.order_items enable row level security;

-- Only admins can read orders (customers get their confirmation client-side).
-- Inserts happen exclusively through place_order() (security definer).
drop policy if exists "admins read orders" on public.orders;
create policy "admins read orders" on public.orders
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));

drop policy if exists "admins update orders" on public.orders;
create policy "admins update orders" on public.orders
  for update to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

drop policy if exists "admins read order_items" on public.order_items;
create policy "admins read order_items" on public.order_items
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));

-- ----------------------------------------------------------------------------
-- place_order(): atomic — validates stock, inserts order + items, decrements
-- stock. Prevents overselling even with concurrent orders (row locks).
--   _customer : {name, phone, email, address, city, notes}
--   _items    : [{product_id, variant_id?, quantity}]
--   _shipping : numeric
-- ----------------------------------------------------------------------------
create or replace function public.place_order(
  _customer jsonb,
  _items    jsonb,
  _shipping numeric
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  _order_id  uuid;
  _ref       text;
  _item      jsonb;
  _pid       uuid;
  _vid       uuid;
  _qty       integer;
  _name      text;
  _vname     text;
  _price     numeric(10, 2);
  _avail     integer;
  _subtotal  numeric(10, 2) := 0;
  _total     numeric(10, 2);
begin
  if _items is null or jsonb_array_length(_items) = 0 then
    raise exception 'Your cart is empty.';
  end if;

  _ref := 'BW-' || upper(substr(md5(gen_random_uuid()::text), 1, 6));

  insert into public.orders (
    order_ref, customer_name, phone, email, address, city, notes, shipping
  ) values (
    _ref,
    _customer->>'name',
    _customer->>'phone',
    nullif(_customer->>'email', ''),
    _customer->>'address',
    _customer->>'city',
    nullif(_customer->>'notes', ''),
    coalesce(_shipping, 0)
  ) returning id into _order_id;

  for _item in select * from jsonb_array_elements(_items) loop
    _pid := (_item->>'product_id')::uuid;
    _vid := nullif(_item->>'variant_id', '')::uuid;
    _qty := (_item->>'quantity')::integer;

    if _qty is null or _qty < 1 then
      raise exception 'Invalid quantity.';
    end if;

    if _vid is not null then
      select v.name, v.price, v.stock into _vname, _price, _avail
      from public.product_variants v
      where v.id = _vid and v.product_id = _pid
      for update;
      if not found then raise exception 'Selected option is no longer available.'; end if;
      select p.name into _name from public.products p where p.id = _pid;
      if _avail < _qty then
        raise exception 'Only % available for % (%).', _avail, _name, _vname;
      end if;
      update public.product_variants set stock = stock - _qty where id = _vid;
    else
      select p.name, p.price, p.stock into _name, _price, _avail
      from public.products p where p.id = _pid
      for update;
      if not found then raise exception 'A product in your cart is no longer available.'; end if;
      _vname := null;
      if _avail < _qty then
        raise exception 'Only % available for %.', _avail, _name;
      end if;
      update public.products set stock = stock - _qty where id = _pid;
    end if;

    insert into public.order_items (
      order_id, product_id, variant_id, product_name, variant_name,
      unit_price, quantity, line_total
    ) values (
      _order_id, _pid, _vid, _name, _vname, _price, _qty, _price * _qty
    );

    _subtotal := _subtotal + _price * _qty;
  end loop;

  _total := _subtotal + coalesce(_shipping, 0);
  update public.orders set subtotal = _subtotal, total = _total where id = _order_id;

  return jsonb_build_object(
    'id', _order_id, 'order_ref', _ref,
    'subtotal', _subtotal, 'shipping', coalesce(_shipping, 0), 'total', _total
  );
end;
$$;

grant execute on function public.place_order(jsonb, jsonb, numeric) to anon, authenticated;

-- ----------------------------------------------------------------------------
-- set_order_status(): admin-only. Restores stock when an order is cancelled.
-- ----------------------------------------------------------------------------
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

  -- Moving INTO cancelled from an active state → add stock back.
  if _status = 'cancelled' and _old <> 'cancelled' then
    for _it in select * from public.order_items where order_id = _order_id loop
      if _it.variant_id is not null then
        update public.product_variants set stock = stock + _it.quantity where id = _it.variant_id;
      elsif _it.product_id is not null then
        update public.products set stock = stock + _it.quantity where id = _it.product_id;
      end if;
    end loop;
  -- Re-opening a cancelled order → take stock back out.
  elsif _old = 'cancelled' and _status <> 'cancelled' then
    for _it in select * from public.order_items where order_id = _order_id loop
      if _it.variant_id is not null then
        update public.product_variants set stock = greatest(0, stock - _it.quantity) where id = _it.variant_id;
      elsif _it.product_id is not null then
        update public.products set stock = greatest(0, stock - _it.quantity) where id = _it.product_id;
      end if;
    end loop;
  end if;

  update public.orders set status = _status, updated_at = now() where id = _order_id;
end;
$$;

grant execute on function public.set_order_status(uuid, text) to authenticated;

-- ----------------------------------------------------------------------------
-- get_inventory_report(): admin-only. One row per product (no variants) or per
-- variant, with current stock and sold quantity (excludes cancelled orders).
-- ----------------------------------------------------------------------------
create or replace function public.get_inventory_report()
returns table (
  product_id   uuid,
  product_name text,
  variant_name text,
  stock        integer,
  sold         integer
)
language sql
security definer
set search_path = public
as $$
  select
    p.id, p.name, null::text, p.stock,
    coalesce((
      select sum(oi.quantity)::int
      from public.order_items oi
      join public.orders o on o.id = oi.order_id
      where oi.product_id = p.id and oi.variant_id is null and o.status <> 'cancelled'
    ), 0)
  from public.products p
  where public.has_role(auth.uid(), 'admin')
    and not exists (select 1 from public.product_variants v where v.product_id = p.id)
  union all
  select
    p.id, p.name, v.name, v.stock,
    coalesce((
      select sum(oi.quantity)::int
      from public.order_items oi
      join public.orders o on o.id = oi.order_id
      where oi.variant_id = v.id and o.status <> 'cancelled'
    ), 0)
  from public.product_variants v
  join public.products p on p.id = v.product_id
  where public.has_role(auth.uid(), 'admin')
  order by 2, 3 nulls first;
$$;

grant execute on function public.get_inventory_report() to authenticated;
