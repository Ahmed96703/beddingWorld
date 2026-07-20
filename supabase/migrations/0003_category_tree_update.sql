-- =============================================================================
-- Bedding World — category tree update (client's "ISSUES" list, points 1–6)
-- Run this in the Supabase SQL editor AFTER 0001 (and 0002 if used).
-- Idempotent: safe to run more than once. Matches src/lib/demo-data.ts.
-- =============================================================================

-- ----------------------------------------------------------------------------
-- 1. Top-level categories — ensure all exist (adds Winter & Wedding, restores
--    Home & Kitchen) and fix their display order. Only sort_order is updated on
--    existing rows, so your admin edits to names/images are preserved.
-- ----------------------------------------------------------------------------
insert into public.categories (name, slug, sort_order, description, image_url) values
  ('Bedding', 'bedding', 1, 'Sheets, quilts, duvets and more for the heart of a good night''s rest.', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80'),
  ('Winter', 'winter', 2, 'Warm layers for cold nights, from blankets to razai sets.', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'),
  ('Home & Kitchen', 'home-kitchen', 3, 'Practical linens and soft furnishings for everyday living.', 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80'),
  ('Wedding', 'wedding', 4, 'Celebration-ready bridal sets and gift-worthy packages.', 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'),
  ('Bed Accessories', 'bed-accessories', 5, 'Everything that finishes a considered bed, from protectors to covers.', 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=800&q=80'),
  ('Summer', 'summer', 6, 'Breathable, lightweight bedding for warmer nights.', 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e6?auto=format&fit=crop&w=800&q=80'),
  ('Kids', 'kids', 7, 'Soft, playful textiles made for little dreamers.', 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80'),
  ('Bath', 'bath', 8, 'Plush towels, mats and robes for the everyday spa.', 'https://images.unsplash.com/photo-1620331317314-6ad6b9b3d6f1?auto=format&fit=crop&w=800&q=80')
on conflict (slug) do update set sort_order = excluded.sort_order;

-- ----------------------------------------------------------------------------
-- 2. Sub-categories (parent resolved by slug)
-- ----------------------------------------------------------------------------
insert into public.categories (name, slug, parent_id, sort_order, image_url)
select v.name, v.slug, p.id, v.ord, v.img
from (values
  -- Bedding → add Fitted Sheet (bed-sheets/comforters/duvets/pillows already exist)
  ('Bed Sheets', 'bed-sheets', 'bedding', 1, 'https://images.unsplash.com/photo-1629949009765-40fc74c9ec21?auto=format&fit=crop&w=800&q=80'),
  ('Fitted Sheet', 'fitted-sheet', 'bedding', 2, 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80'),
  ('Quilts', 'quilts', 'bedding', 3, 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80'),
  ('Comforters', 'comforters', 'bedding', 4, 'https://images.unsplash.com/photo-1583845112203-29329902332e?auto=format&fit=crop&w=800&q=80'),
  ('Duvets', 'duvets', 'bedding', 5, 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80'),
  ('Pillows', 'pillows', 'bedding', 6, 'https://images.unsplash.com/photo-1592789705501-f9ae4287c4cf?auto=format&fit=crop&w=800&q=80'),
  -- Winter subs
  ('Blanket', 'blanket', 'winter', 1, 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=800&q=80'),
  ('Razai', 'razai', 'winter', 2, 'https://images.unsplash.com/photo-1455587734955-081b22074882?auto=format&fit=crop&w=800&q=80'),
  ('Razai Cover', 'razai-cover', 'winter', 3, 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'),
  -- Home & Kitchen subs
  ('Sofa Cover', 'sofa-cover', 'home-kitchen', 1, 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80'),
  ('Kitchen Accessory', 'kitchen-accessory', 'home-kitchen', 2, 'https://images.unsplash.com/photo-1583947581924-860bda6a26df?auto=format&fit=crop&w=800&q=80'),
  ('Curtains', 'curtains', 'home-kitchen', 3, 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80'),
  ('Bean Bags', 'bean-bags', 'home-kitchen', 4, 'https://images.unsplash.com/photo-1595428779223-43f2bfc0d6f4?auto=format&fit=crop&w=800&q=80'),
  ('Storage Organizer', 'storage-organizer', 'home-kitchen', 5, 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=800&q=80'),
  -- Wedding subs
  ('Bridal Set', 'bridal-set', 'wedding', 1, 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'),
  ('Bridal Bedsheet', 'bridal-bedsheet', 'wedding', 2, 'https://images.unsplash.com/photo-1523419409543-a5e549c1d8b1?auto=format&fit=crop&w=800&q=80'),
  ('Bridal Packages', 'bridal-packages', 'wedding', 3, 'https://images.unsplash.com/photo-1529634896649-4f9284de7ff0?auto=format&fit=crop&w=800&q=80'),
  -- Bed Accessories → ensure Mattress Protectors exists (for its leaves below)
  ('Mattress Protectors', 'mattress-protectors', 'bed-accessories', 2, 'https://images.unsplash.com/photo-1631049421450-348ccd7f8949?auto=format&fit=crop&w=800&q=80')
) as v(name, slug, parent_slug, ord, img)
join public.categories p on p.slug = v.parent_slug
on conflict (slug) do nothing;

-- ----------------------------------------------------------------------------
-- 3. Leaf categories (sub-sub)
-- ----------------------------------------------------------------------------
insert into public.categories (name, slug, parent_id, sort_order)
select v.name, v.slug, p.id, v.ord
from (values
  -- Bed Sheets leaves (Plain / Printed / Embroidered)
  ('Plain', 'bed-sheets-plain', 'bed-sheets', 1),
  ('Printed', 'bed-sheets-printed', 'bed-sheets', 2),
  ('Embroidered', 'bed-sheets-embroidered', 'bed-sheets', 3),
  -- Fitted Sheet leaves (Plain / Printed)
  ('Plain', 'fitted-sheet-plain', 'fitted-sheet', 1),
  ('Printed', 'fitted-sheet-printed', 'fitted-sheet', 2),
  -- Quilts leaves (Single / Double)
  ('Single', 'quilts-single', 'quilts', 1),
  ('Double', 'quilts-double', 'quilts', 2),
  -- Blanket leaves (Single / Double)
  ('Single', 'blanket-single', 'blanket', 1),
  ('Double', 'blanket-double', 'blanket', 2),
  -- Razai leaves (Single / Double)
  ('Single', 'razai-single', 'razai', 1),
  ('Double', 'razai-double', 'razai', 2),
  -- Razai Cover leaves (Printed / Embroidered)
  ('Printed', 'razai-cover-printed', 'razai-cover', 1),
  ('Embroidered', 'razai-cover-embroidered', 'razai-cover', 2),
  -- Mattress Protector leaves (Water Proof / Printed / Quilted)
  ('Water Proof Cover', 'water-proof-cover', 'mattress-protectors', 1),
  ('Printed Cover', 'printed-cover', 'mattress-protectors', 2),
  ('Quilted Cover', 'quilted-cover', 'mattress-protectors', 3)
) as v(name, slug, parent_slug, ord)
join public.categories p on p.slug = v.parent_slug
on conflict (slug) do nothing;

-- ----------------------------------------------------------------------------
-- 4. Remove the OLD Home & Kitchen sub-categories that are no longer sold
--    (the client redefined them). Deletes their products first.
-- ----------------------------------------------------------------------------
delete from public.products
where category_id in (
  select id from public.categories
  where slug in ('table-linen', 'kitchen-towels', 'aprons')
);
delete from public.categories
where slug in ('table-linen', 'kitchen-towels', 'aprons');
