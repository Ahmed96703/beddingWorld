-- =============================================================================
-- LINÉA — sample catalog (categories + products)
-- Safe to run after 0001_init.sql. Re-runnable: conflicts on slug are ignored.
-- Run as the service role (Supabase SQL editor bypasses RLS).
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Top-level categories
-- ---------------------------------------------------------------------------
insert into public.categories (name, slug, sort_order, description, image_url) values
  ('Summer', 'summer', 1, 'Breathable, lightweight bedding for warmer nights.', 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e6?auto=format&fit=crop&w=800&q=80'),
  ('Kids', 'kids', 2, 'Soft, playful textiles made for little dreamers.', 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80'),
  ('Bedding', 'bedding', 3, 'Sheets, comforters, duvets and more — the heart of a good night.', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80'),
  ('Bath', 'bath', 4, 'Plush towels, mats and robes for the everyday spa.', 'https://images.unsplash.com/photo-1620331317314-6ad6b9b3d6f1?auto=format&fit=crop&w=800&q=80'),
  ('Home & Kitchen', 'home-kitchen', 5, 'Linens that bring warmth to every gathering.', 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80'),
  ('Bed Accessories', 'bed-accessories', 6, 'The finishing touches for a considered bed.', 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=800&q=80')
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- Sub-categories (parent resolved by slug)
-- ---------------------------------------------------------------------------
insert into public.categories (name, slug, parent_id, sort_order, image_url)
select v.name, v.slug, p.id, v.sort_order, v.image_url
from (values
  -- Summer
  ('Summer Bed Spread', 'summer-bed-spread', 'summer', 1, 'https://images.unsplash.com/photo-1631049552240-59c37f38802b?auto=format&fit=crop&w=800&q=80'),
  ('Plush', 'summer-plush', 'summer', 2, 'https://images.unsplash.com/photo-1616627561950-9f746e330187?auto=format&fit=crop&w=800&q=80'),
  ('Quilts', 'summer-quilts', 'summer', 3, 'https://images.unsplash.com/photo-1629949009765-40fc74c9ec21?auto=format&fit=crop&w=800&q=80'),
  -- Kids
  ('Kids Bedsheets', 'kids-bedsheets', 'kids', 1, 'https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&w=800&q=80'),
  ('Kids Quilts', 'kids-quilts', 'kids', 2, 'https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?auto=format&fit=crop&w=800&q=80'),
  ('Kids Pillows', 'kids-pillows', 'kids', 3, 'https://images.unsplash.com/photo-1629949009710-f7bae3a4a4f0?auto=format&fit=crop&w=800&q=80'),
  -- Bedding
  ('Bed Sheets', 'bed-sheets', 'bedding', 1, 'https://images.unsplash.com/photo-1629949009765-40fc74c9ec21?auto=format&fit=crop&w=800&q=80'),
  ('Comforters', 'comforters', 'bedding', 2, 'https://images.unsplash.com/photo-1583845112203-29329902332e?auto=format&fit=crop&w=800&q=80'),
  ('Duvets', 'duvets', 'bedding', 3, 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80'),
  ('Pillows', 'pillows', 'bedding', 4, 'https://images.unsplash.com/photo-1592789705501-f9ae4287c4cf?auto=format&fit=crop&w=800&q=80'),
  ('Quilts', 'quilts', 'bedding', 5, 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80'),
  -- Bath
  ('Towels', 'towels', 'bath', 1, 'https://images.unsplash.com/photo-1620331317314-6ad6b9b3d6f1?auto=format&fit=crop&w=800&q=80'),
  ('Bath Mats', 'bath-mats', 'bath', 2, 'https://images.unsplash.com/photo-1604709177225-055f99402ea3?auto=format&fit=crop&w=800&q=80'),
  ('Bathrobes', 'bathrobes', 'bath', 3, 'https://images.unsplash.com/photo-1607006677169-3d1e8a1f1f3a?auto=format&fit=crop&w=800&q=80'),
  -- Home & Kitchen
  ('Table Linen', 'table-linen', 'home-kitchen', 1, 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80'),
  ('Kitchen Towels', 'kitchen-towels', 'home-kitchen', 2, 'https://images.unsplash.com/photo-1583947581924-860bda6a26df?auto=format&fit=crop&w=800&q=80'),
  ('Aprons', 'aprons', 'home-kitchen', 3, 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?auto=format&fit=crop&w=800&q=80'),
  -- Bed Accessories
  ('Pillow Covers', 'pillow-covers', 'bed-accessories', 1, 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e6?auto=format&fit=crop&w=800&q=80'),
  ('Mattress Protectors', 'mattress-protectors', 'bed-accessories', 2, 'https://images.unsplash.com/photo-1631049421450-348ccd7f8949?auto=format&fit=crop&w=800&q=80'),
  ('Cushions', 'cushions', 'bed-accessories', 3, 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=800&q=80')
) as v(name, slug, parent_slug, sort_order, image_url)
join public.categories p on p.slug = v.parent_slug
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- Sub-sub categories (Bed Sheets → Printed / Plain / Embroidered)
-- ---------------------------------------------------------------------------
insert into public.categories (name, slug, parent_id, sort_order)
select v.name, v.slug, p.id, v.sort_order
from (values
  ('Printed', 'bed-sheets-printed', 'bed-sheets', 1),
  ('Plain', 'bed-sheets-plain', 'bed-sheets', 2),
  ('Embroidered', 'bed-sheets-embroidered', 'bed-sheets', 3)
) as v(name, slug, parent_slug, sort_order)
join public.categories p on p.slug = v.parent_slug
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- Products (category resolved by slug)
-- ---------------------------------------------------------------------------
insert into public.products
  (name, slug, description, price, compare_at_price, category_id, images, status, featured, stock)
select
  v.name, v.slug, v.description, v.price, v.compare_at_price,
  c.id, array[v.image], 'live', v.featured, v.stock
from (values
  ('Stonewashed Linen Duvet Cover', 'stonewashed-linen-duvet-cover',
   'Woven from 100% European flax and garment-washed for a lived-in softness from the very first night. Breathable in summer, cozy in winter.',
   149.00, 189.00, 'duvets',
   'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=900&q=80', true, 24),

  ('Brushed Cotton Sheet Set', 'brushed-cotton-sheet-set',
   'A four-piece set in long-staple cotton with a soft brushed finish. Deep pockets fit mattresses up to 16 inches.',
   89.00, null, 'bed-sheets-plain',
   'https://images.unsplash.com/photo-1629949009765-40fc74c9ec21?auto=format&fit=crop&w=900&q=80', true, 40),

  ('Hand-Block Printed Sheet Set', 'hand-block-printed-sheet-set',
   'Artisan block-printed percale in a soft botanical motif. Crisp, cool, and beautifully imperfect.',
   119.00, null, 'bed-sheets-printed',
   'https://images.unsplash.com/photo-1616627561950-9f746e330187?auto=format&fit=crop&w=900&q=80', false, 18),

  ('Vine Embroidered Sheet Set', 'vine-embroidered-sheet-set',
   'Delicate tonal embroidery along a sateen border. Quietly luxurious, endlessly washable.',
   139.00, 169.00, 'bed-sheets-embroidered',
   'https://images.unsplash.com/photo-1522771930-fbb46f78624c?auto=format&fit=crop&w=900&q=80', false, 12),

  ('Cloud Down Comforter', 'cloud-down-comforter',
   'All-season responsibly sourced down, baffle-box construction keeps the loft even, edge to edge.',
   199.00, 249.00, 'comforters',
   'https://images.unsplash.com/photo-1583845112203-29329902332e?auto=format&fit=crop&w=900&q=80', true, 16),

  ('Lofted Goose Pillow', 'lofted-goose-pillow',
   'A medium-firm pillow with a cotton sateen shell. Cradles the neck without going flat.',
   59.00, null, 'pillows',
   'https://images.unsplash.com/photo-1592789705501-f9ae4287c4cf?auto=format&fit=crop&w=900&q=80', false, 60),

  ('Waffle Cotton Quilt', 'waffle-cotton-quilt',
   'A lightweight waffle-weave quilt that layers beautifully year-round. Pre-washed for instant softness.',
   129.00, null, 'quilts',
   'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=900&q=80', true, 22),

  ('Summer Cotton Bed Spread', 'summer-cotton-bed-spread',
   'An airy, breathable spread in a sun-washed neutral. The lightest layer for warm nights.',
   99.00, null, 'summer-bed-spread',
   'https://images.unsplash.com/photo-1631049552240-59c37f38802b?auto=format&fit=crop&w=900&q=80', true, 30),

  ('Turkish Cotton Bath Towel Set', 'turkish-cotton-bath-towel-set',
   'Long-loop Turkish cotton, exceptionally absorbent and quick to dry. Set of four.',
   79.00, 99.00, 'towels',
   'https://images.unsplash.com/photo-1620331317314-6ad6b9b3d6f1?auto=format&fit=crop&w=900&q=80', true, 35),

  ('Waffle Cotton Bathrobe', 'waffle-cotton-bathrobe',
   'A lightweight unisex robe in breathable waffle cotton. Two deep pockets, a generous wrap.',
   89.00, null, 'bathrobes',
   'https://images.unsplash.com/photo-1607006677169-3d1e8a1f1f3a?auto=format&fit=crop&w=900&q=80', false, 20),

  ('Linen Table Runner', 'linen-table-runner',
   'A softly textured pure-linen runner with a hand-finished edge. Sets a quiet, considered table.',
   45.00, null, 'table-linen',
   'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=900&q=80', false, 50),

  ('Kids Cloud Bedsheet Set', 'kids-cloud-bedsheet-set',
   'Soft brushed cotton in a gentle cloud print. Made for restless little sleepers.',
   59.00, 75.00, 'kids-bedsheets',
   'https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&w=900&q=80', true, 28),

  ('Velvet Lumbar Cushion', 'velvet-lumbar-cushion',
   'A plush cotton-velvet cushion with a feather-down insert. The finishing touch for any bed.',
   49.00, null, 'cushions',
   'https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=900&q=80', false, 44),

  ('Quilted Mattress Protector', 'quilted-mattress-protector',
   'A breathable quilted protector with a waterproof membrane and deep elasticated skirt.',
   55.00, null, 'mattress-protectors',
   'https://images.unsplash.com/photo-1631049421450-348ccd7f8949?auto=format&fit=crop&w=900&q=80', false, 33)
) as v(name, slug, description, price, compare_at_price, category_slug, image, featured, stock)
join public.categories c on c.slug = v.category_slug
on conflict (slug) do nothing;
