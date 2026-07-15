import type { CategoryRow, ProductRow } from "@/integrations/supabase/types";

/**
 * In-memory demo catalog used ONLY when Supabase env vars are absent, so the
 * storefront can be previewed end-to-end (nav, mega-menu, category pages,
 * product detail) without a backend. Mirrors `supabase/seed.sql`.
 *
 * When Supabase is configured this file is never used — all data is live.
 */

const now = "2026-01-01T00:00:00.000Z";

interface CatSeed {
  slug: string;
  name: string;
  parent: string | null;
  order: number;
  image?: string;
  description?: string;
}

const CATEGORY_SEED: CatSeed[] = [
  // top level
  {
    slug: "bedding",
    name: "Bedding",
    parent: null,
    order: 1,
    description: "Sheets, quilts, duvets and more for the heart of a good night's rest.",
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "winter",
    name: "Winter",
    parent: null,
    order: 2,
    description: "Warm layers for cold nights, from blankets to razai sets.",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "home-kitchen",
    name: "Home & Kitchen",
    parent: null,
    order: 3,
    description: "Practical linens and soft furnishings for everyday living.",
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "wedding",
    name: "Wedding",
    parent: null,
    order: 4,
    description: "Celebration-ready bridal sets and gift-worthy packages.",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "bed-accessories",
    name: "Bed Accessories",
    parent: null,
    order: 5,
    description: "Everything that finishes a considered bed, from protectors to covers.",
    image: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "summer",
    name: "Summer",
    parent: null,
    order: 6,
    description: "Breathable, lightweight bedding for warmer nights.",
    image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e6?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "kids",
    name: "Kids",
    parent: null,
    order: 7,
    description: "Soft, playful textiles made for little dreamers.",
    image: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "bath",
    name: "Bath",
    parent: null,
    order: 8,
    description: "Plush towels, mats and robes for the everyday spa.",
    image: "https://images.unsplash.com/photo-1620331317314-6ad6b9b3d6f1?auto=format&fit=crop&w=800&q=80",
  },
  // bedding subs
  { slug: "bed-sheets", name: "Bed Sheets", parent: "bedding", order: 1, image: "https://images.unsplash.com/photo-1629949009765-40fc74c9ec21?auto=format&fit=crop&w=800&q=80" },
  { slug: "fitted-sheet", name: "Fitted Sheet", parent: "bedding", order: 2, image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80" },
  { slug: "quilts", name: "Quilts", parent: "bedding", order: 3, image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80" },
  { slug: "comforters", name: "Comforters", parent: "bedding", order: 4, image: "https://images.unsplash.com/photo-1583845112203-29329902332e?auto=format&fit=crop&w=800&q=80" },
  { slug: "duvets", name: "Duvets", parent: "bedding", order: 5, image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80" },
  { slug: "pillows", name: "Pillows", parent: "bedding", order: 6, image: "https://images.unsplash.com/photo-1592789705501-f9ae4287c4cf?auto=format&fit=crop&w=800&q=80" },
  // bedding leaf categories
  { slug: "bed-sheets-plain", name: "Plain", parent: "bed-sheets", order: 1 },
  { slug: "bed-sheets-printed", name: "Printed", parent: "bed-sheets", order: 2 },
  { slug: "bed-sheets-embroidered", name: "Embroidered", parent: "bed-sheets", order: 3 },
  { slug: "fitted-sheet-plain", name: "Plain", parent: "fitted-sheet", order: 1 },
  { slug: "fitted-sheet-printed", name: "Printed", parent: "fitted-sheet", order: 2 },
  { slug: "quilts-single", name: "Single", parent: "quilts", order: 1 },
  { slug: "quilts-double", name: "Double", parent: "quilts", order: 2 },
  // winter subs
  { slug: "blanket", name: "Blanket", parent: "winter", order: 1, image: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=800&q=80" },
  { slug: "razai", name: "Razai", parent: "winter", order: 2, image: "https://images.unsplash.com/photo-1455587734955-081b22074882?auto=format&fit=crop&w=800&q=80" },
  { slug: "razai-cover", name: "Razai Cover", parent: "winter", order: 3, image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80" },
  { slug: "blanket-single", name: "Single", parent: "blanket", order: 1 },
  { slug: "blanket-double", name: "Double", parent: "blanket", order: 2 },
  { slug: "razai-single", name: "Single", parent: "razai", order: 1 },
  { slug: "razai-double", name: "Double", parent: "razai", order: 2 },
  { slug: "razai-cover-printed", name: "Printed", parent: "razai-cover", order: 1 },
  { slug: "razai-cover-embroidered", name: "Embroidered", parent: "razai-cover", order: 2 },
  // home & kitchen subs
  { slug: "sofa-cover", name: "Sofa Cover", parent: "home-kitchen", order: 1, image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80" },
  { slug: "kitchen-accessory", name: "Kitchen Accessory", parent: "home-kitchen", order: 2, image: "https://images.unsplash.com/photo-1583947581924-860bda6a26df?auto=format&fit=crop&w=800&q=80" },
  { slug: "curtains", name: "Curtains", parent: "home-kitchen", order: 3, image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80" },
  { slug: "bean-bags", name: "Bean Bags", parent: "home-kitchen", order: 4, image: "https://images.unsplash.com/photo-1595428779223-43f2bfc0d6f4?auto=format&fit=crop&w=800&q=80" },
  { slug: "storage-organizer", name: "Storage Organizer", parent: "home-kitchen", order: 5, image: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=800&q=80" },
  // wedding subs
  { slug: "bridal-set", name: "Bridal Set", parent: "wedding", order: 1, image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80" },
  { slug: "bridal-bedsheet", name: "Bridal Bedsheet", parent: "wedding", order: 2, image: "https://images.unsplash.com/photo-1523419409543-a5e549c1d8b1?auto=format&fit=crop&w=800&q=80" },
  { slug: "bridal-packages", name: "Bridal Packages", parent: "wedding", order: 3, image: "https://images.unsplash.com/photo-1529634896649-4f9284de7ff0?auto=format&fit=crop&w=800&q=80" },
  // bed accessories subs
  { slug: "pillow-covers", name: "Pillow Covers", parent: "bed-accessories", order: 1, image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e6?auto=format&fit=crop&w=800&q=80" },
  { slug: "mattress-protectors", name: "Mattress Protectors", parent: "bed-accessories", order: 2, image: "https://images.unsplash.com/photo-1631049421450-348ccd7f8949?auto=format&fit=crop&w=800&q=80" },
  { slug: "cushions", name: "Cushions", parent: "bed-accessories", order: 3, image: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=800&q=80" },
  { slug: "water-proof-cover", name: "Water Proof Cover", parent: "mattress-protectors", order: 1 },
  { slug: "printed-cover", name: "Printed Cover", parent: "mattress-protectors", order: 2 },
  { slug: "quilted-cover", name: "Quilted Cover", parent: "mattress-protectors", order: 3 },
  // summer subs
  { slug: "summer-bed-spread", name: "Summer Bed Spread", parent: "summer", order: 1, image: "https://images.unsplash.com/photo-1631049552240-59c37f38802b?auto=format&fit=crop&w=800&q=80" },
  { slug: "summer-plush", name: "Plush", parent: "summer", order: 2, image: "https://images.unsplash.com/photo-1616627561950-9f746e330187?auto=format&fit=crop&w=800&q=80" },
  { slug: "summer-quilts", name: "Quilts", parent: "summer", order: 3, image: "https://images.unsplash.com/photo-1629949009765-40fc74c9ec21?auto=format&fit=crop&w=800&q=80" },
  // kids subs
  { slug: "kids-bedsheets", name: "Kids Bedsheets", parent: "kids", order: 1, image: "https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&w=800&q=80" },
  { slug: "kids-quilts", name: "Kids Quilts", parent: "kids", order: 2, image: "https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?auto=format&fit=crop&w=800&q=80" },
  { slug: "kids-pillows", name: "Kids Pillows", parent: "kids", order: 3, image: "https://images.unsplash.com/photo-1629949009710-f7bae3a4a4f0?auto=format&fit=crop&w=800&q=80" },
  // bath subs
  { slug: "towels", name: "Towels", parent: "bath", order: 1, image: "https://images.unsplash.com/photo-1620331317314-6ad6b9b3d6f1?auto=format&fit=crop&w=800&q=80" },
  { slug: "bath-mats", name: "Bath Mats", parent: "bath", order: 2, image: "https://images.unsplash.com/photo-1604709177225-055f99402ea3?auto=format&fit=crop&w=800&q=80" },
  { slug: "bathrobes", name: "Bathrobes", parent: "bath", order: 3, image: "https://images.unsplash.com/photo-1607006677169-3d1e8a1f1f3a?auto=format&fit=crop&w=800&q=80" },
];

const catId = (slug: string) => `demo-cat-${slug}`;

export const DEMO_CATEGORIES: CategoryRow[] = CATEGORY_SEED.map((c) => ({
  id: catId(c.slug),
  name: c.name,
  slug: c.slug,
  parent_id: c.parent ? catId(c.parent) : null,
  description: c.description ?? null,
  image_url: c.image ?? null,
  sort_order: c.order,
  created_at: now,
}));

interface ProdSeed {
  slug: string;
  name: string;
  desc: string;
  price: number;
  compareAt: number | null;
  category: string;
  image: string;
  featured: boolean;
  stock: number;
}

const PRODUCT_SEED: ProdSeed[] = [
  { slug: "stonewashed-linen-duvet-cover", name: "Stonewashed Linen Duvet Cover", desc: "Woven from 100% European flax and garment-washed for a lived-in softness from the very first night. Breathable in summer, cozy in winter.", price: 149, compareAt: 189, category: "duvets", image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=900&q=80", featured: true, stock: 24 },
  { slug: "brushed-cotton-sheet-set", name: "Brushed Cotton Sheet Set", desc: "A four-piece set in long-staple cotton with a soft brushed finish. Deep pockets fit mattresses up to 16 inches.", price: 89, compareAt: null, category: "bed-sheets-plain", image: "https://images.unsplash.com/photo-1629949009765-40fc74c9ec21?auto=format&fit=crop&w=900&q=80", featured: true, stock: 40 },
  { slug: "hand-block-printed-sheet-set", name: "Hand-Block Printed Sheet Set", desc: "Artisan block-printed percale in a soft botanical motif. Crisp, cool, and beautifully imperfect.", price: 119, compareAt: null, category: "bed-sheets-printed", image: "https://images.unsplash.com/photo-1616627561950-9f746e330187?auto=format&fit=crop&w=900&q=80", featured: false, stock: 18 },
  { slug: "vine-embroidered-sheet-set", name: "Vine Embroidered Sheet Set", desc: "Delicate tonal embroidery along a sateen border. Quietly luxurious, endlessly washable.", price: 139, compareAt: 169, category: "bed-sheets-embroidered", image: "https://images.unsplash.com/photo-1522771930-fbb46f78624c?auto=format&fit=crop&w=900&q=80", featured: false, stock: 12 },
  { slug: "fitted-sheet-plain-cotton", name: "Plain Fitted Sheet", desc: "A smooth fitted sheet with deep elasticated corners and a soft hand feel.", price: 74, compareAt: null, category: "fitted-sheet-plain", image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=900&q=80", featured: true, stock: 28 },
  { slug: "fitted-sheet-printed-cotton", name: "Printed Fitted Sheet", desc: "Playful patterning on breathable cotton percale, finished with a secure mattress fit.", price: 82, compareAt: null, category: "fitted-sheet-printed", image: "https://images.unsplash.com/photo-1616627561950-9f746e330187?auto=format&fit=crop&w=900&q=80", featured: false, stock: 18 },
  { slug: "cloud-down-comforter", name: "Cloud Down Comforter", desc: "All-season responsibly sourced down, baffle-box construction keeps the loft even, edge to edge.", price: 199, compareAt: 249, category: "comforters", image: "https://images.unsplash.com/photo-1583845112203-29329902332e?auto=format&fit=crop&w=900&q=80", featured: true, stock: 16 },
  { slug: "lofted-goose-pillow", name: "Lofted Goose Pillow", desc: "A medium-firm pillow with a cotton sateen shell. Cradles the neck without going flat.", price: 59, compareAt: null, category: "pillows", image: "https://images.unsplash.com/photo-1592789705501-f9ae4287c4cf?auto=format&fit=crop&w=900&q=80", featured: false, stock: 60 },
  { slug: "waffle-cotton-quilt", name: "Waffle Cotton Quilt", desc: "A lightweight waffle-weave quilt that layers beautifully year-round. Pre-washed for instant softness.", price: 129, compareAt: null, category: "quilts-single", image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=900&q=80", featured: true, stock: 22 },
  { slug: "winter-loft-quilt", name: "Winter Loft Quilt", desc: "A denser quilt built for cooler nights, with a plush brushed finish.", price: 149, compareAt: 179, category: "quilts-double", image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80", featured: false, stock: 14 },
  { slug: "summer-cotton-bed-spread", name: "Summer Cotton Bed Spread", desc: "An airy, breathable spread in a sun-washed neutral. The lightest layer for warm nights.", price: 99, compareAt: null, category: "summer-bed-spread", image: "https://images.unsplash.com/photo-1631049552240-59c37f38802b?auto=format&fit=crop&w=900&q=80", featured: true, stock: 30 },
  { slug: "winter-fleece-blanket", name: "Winter Fleece Blanket", desc: "A soft, insulating blanket for extra warmth and comfort.", price: 69, compareAt: null, category: "blanket-double", image: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=900&q=80", featured: true, stock: 26 },
  { slug: "razai-premium-set", name: "Premium Razai", desc: "A generously filled razai with a lightweight shell and cloud-soft loft.", price: 189, compareAt: 219, category: "razai-double", image: "https://images.unsplash.com/photo-1455587734955-081b22074882?auto=format&fit=crop&w=900&q=80", featured: true, stock: 19 },
  { slug: "razai-cover-printed", name: "Printed Razai Cover", desc: "A crisp cotton razai cover with vibrant print and easy-care finishing.", price: 96, compareAt: null, category: "razai-cover-printed", image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80", featured: false, stock: 24 },
  { slug: "mattress-protector-quilted", name: "Quilted Mattress Protector", desc: "A breathable quilted protector with a waterproof membrane and deep elasticated skirt.", price: 55, compareAt: null, category: "quilted-cover", image: "https://images.unsplash.com/photo-1631049421450-348ccd7f8949?auto=format&fit=crop&w=900&q=80", featured: false, stock: 33 },
  { slug: "mattress-protector-waterproof", name: "Water Proof Mattress Protector", desc: "A fully waterproof cover with a soft touch surface and a secure fit.", price: 49, compareAt: null, category: "water-proof-cover", image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=900&q=80", featured: false, stock: 36 },
  { slug: "mattress-protector-printed", name: "Printed Mattress Protector", desc: "A patterned mattress protector that keeps things practical without losing the finish.", price: 52, compareAt: null, category: "printed-cover", image: "https://images.unsplash.com/photo-1616627561950-9f746e330187?auto=format&fit=crop&w=900&q=80", featured: false, stock: 21 },
  { slug: "sofa-cover-set", name: "Sofa Cover Set", desc: "A tailored sofa cover set that refreshes the room in one simple step.", price: 109, compareAt: null, category: "sofa-cover", image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=900&q=80", featured: false, stock: 16 },
  { slug: "bridal-luxury-set", name: "Bridal Luxury Set", desc: "A celebration-ready bridal set with rich finishing and a layered presentation.", price: 249, compareAt: 299, category: "bridal-set", image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80", featured: true, stock: 9 },
  { slug: "bridal-bedsheet-deluxe", name: "Bridal Bedsheet Deluxe", desc: "An ornate bridal bedsheet with a polished finish for special occasions.", price: 169, compareAt: null, category: "bridal-bedsheet", image: "https://images.unsplash.com/photo-1523419409543-a5e549c1d8b1?auto=format&fit=crop&w=900&q=80", featured: false, stock: 11 },
  { slug: "bridal-package-collection", name: "Bridal Package Collection", desc: "A complete gifting package with coordinated pieces for wedding trousseaus.", price: 329, compareAt: null, category: "bridal-packages", image: "https://images.unsplash.com/photo-1529634896649-4f9284de7ff0?auto=format&fit=crop&w=900&q=80", featured: true, stock: 7 },
  { slug: "turkish-cotton-bath-towel-set", name: "Turkish Cotton Bath Towel Set", desc: "Long-loop Turkish cotton, exceptionally absorbent and quick to dry. Set of four.", price: 79, compareAt: 99, category: "towels", image: "https://images.unsplash.com/photo-1620331317314-6ad6b9b3d6f1?auto=format&fit=crop&w=900&q=80", featured: true, stock: 35 },
  { slug: "waffle-cotton-bathrobe", name: "Waffle Cotton Bathrobe", desc: "A lightweight unisex robe in breathable waffle cotton. Two deep pockets, a generous wrap.", price: 89, compareAt: null, category: "bathrobes", image: "https://images.unsplash.com/photo-1607006677169-3d1e8a1f1f3a?auto=format&fit=crop&w=900&q=80", featured: false, stock: 20 },
  { slug: "linen-table-runner", name: "Linen Table Runner", desc: "A softly textured pure-linen runner with a hand-finished edge. Sets a quiet, considered table.", price: 45, compareAt: null, category: "kitchen-accessory", image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=900&q=80", featured: false, stock: 50 },
  { slug: "kids-cloud-bedsheet-set", name: "Kids Cloud Bedsheet Set", desc: "Soft brushed cotton in a gentle cloud print. Made for restless little sleepers.", price: 59, compareAt: 75, category: "kids-bedsheets", image: "https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&w=900&q=80", featured: true, stock: 28 },
  { slug: "velvet-lumbar-cushion", name: "Velvet Lumbar Cushion", desc: "A plush cotton-velvet cushion with a feather-down insert. The finishing touch for any bed.", price: 49, compareAt: null, category: "cushions", image: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=900&q=80", featured: false, stock: 44 },
];

export const DEMO_PRODUCTS: ProductRow[] = PRODUCT_SEED.map((p, i) => ({
  id: `demo-prod-${p.slug}`,
  name: p.name,
  slug: p.slug,
  description: p.desc,
  price: p.price,
  compare_at_price: p.compareAt,
  category_id: catId(p.category),
  images: [p.image],
  status: "live",
  featured: p.featured,
  stock: p.stock,
  // stagger created_at so "newest" sorting is stable & meaningful
  created_at: new Date(Date.parse(now) - i * 86_400_000).toISOString(),
  updated_at: now,
}));
