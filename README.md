# LINÉA — Premium Bedding & Home

A production-ready bedding & home eCommerce storefront with a Supabase-powered
admin, built with **React 19 + TypeScript + Vite + Tailwind CSS** and
**shadcn/ui**-style components. Checkout is **Cash on Delivery only** — no cards,
no Stripe, no PayPal.

> Aesthetic: _quiet-luxury editorial_ — warm ivory & oat palette, espresso ink,
> a muted terracotta accent, Fraunces display serif + Hanken Grotesk body.

---

## ✨ Features

**Storefront**
- Sticky header with **mega-dropdown** navigation, **live search**, cart & account
- Mobile drawer with collapsible accordion categories
- Homepage: hero, category showcase, featured grid, editorial banner, newsletter
- Category page (`/category/:slug`) — sub-category cards + product grid
- Sub-category page (`/category/:slug/:sub`) — **sticky sidebar filters** (sub-sub
  categories), sort, breadcrumbs, responsive 4/2-col grid
- Product detail — image gallery, quantity selector, add to cart, related items
- Cart with quantity update / remove / subtotal (persisted via `localStorage`)
- **COD checkout** — two-column form + sticky order summary → success page with
  real order total and an estimated delivery date

**Admin** (`/admin`, protected)
- Supabase email/password auth, admin-only access via a `user_roles` table
- **First registered user can claim the admin role**
- Stats overview, **product CRUD** (image upload to Supabase Storage, Live/Draft
  toggle, Featured toggle), category add/delete

**Engineering**
- Per-route **code splitting** (`React.lazy` + `Suspense`)
- Lazy-loaded images with graceful fallbacks
- Dependency-free per-page **SEO** (unique title, meta description, OG/Twitter),
  semantic HTML, single `<h1>` per page
- End-to-end **TypeScript** types mirroring the database
- Loading / empty / error states everywhere

---

## 🚀 Getting started

### 1. Install

```bash
npm install
```

### 2. Create a Supabase project

1. Create a project at [supabase.com](https://supabase.com).
2. In **SQL Editor**, run [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql)
   — this creates the `categories`, `products`, and `user_roles` tables, the
   `app_role` enum, the `has_role()` security-definer function, all RLS policies,
   and the public `product-images` storage bucket.
3. (Optional) Run [`supabase/seed.sql`](supabase/seed.sql) to load the full
   category tree and sample products.

### 3. Configure environment

```bash
cp .env.example .env
```

Fill in from **Project Settings → API**:

```ini
VITE_SUPABASE_URL="https://YOUR-REF.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-public-key"
```

### 4. Run

```bash
npm run dev      # start the dev server
npm run build    # type-check + production build
npm run preview  # preview the production build
```

---

## 🔐 Creating the first admin

1. Open `/admin/login` and **Register** with an email + password.
   - For local development, disable email confirmation in
     **Supabase → Authentication → Providers → Email** so you're signed in
     immediately. (Otherwise, confirm via the email link, then sign in.)
2. Once signed in, the login screen detects that no admin exists yet and shows
   **“Claim admin role.”** Click it — the RLS policy only allows the *first*
   admin to be self-assigned, so this works exactly once.
3. You're redirected to the dashboard. Manage products & categories from there.

---

## 🗂️ Project structure

```
src/
├─ components/
│  ├─ ui/                 # shadcn-style primitives (button, dialog, select…)
│  ├─ layout/             # header, mega-menu, mobile-nav, footer, layout
│  ├─ product-card.tsx    # product card + grid
│  ├─ search-command.tsx  # live search overlay
│  └─ seo.tsx, states.tsx, …
├─ context/auth.tsx       # Supabase auth + admin role
├─ hooks/                 # useAsync, useCatalog, useDebounced
├─ integrations/supabase/ # client.ts + types.ts
├─ lib/                   # api.ts (queries), categories.ts, order.ts, utils.ts
├─ routes/                # pages (storefront + admin/)
├─ store/cart.ts          # zustand cart (persisted)
├─ App.tsx                # router + lazy routes
└─ main.tsx               # providers + entry
supabase/
├─ migrations/0001_init.sql
└─ seed.sql
```

## 🧱 Data model

| Table        | Purpose                                                        |
|--------------|----------------------------------------------------------------|
| `categories` | Self-referencing tree: top → sub → sub-sub (`parent_id`)       |
| `products`   | Catalog items; `status` (live/draft), `featured`, `images[]`   |
| `user_roles` | `app_role` enum (`admin` / `customer`); checked by `has_role()` |

**RLS**: public read for categories and *live* products; all writes (and reading
drafts) require the `admin` role. Storage bucket `product-images` is public-read,
admin-write.

> The storefront fetches **all data dynamically from Supabase** — there is no
> static product data. If env vars are missing, the app shows a friendly setup
> banner instead of crashing.

---

## 🛠️ Tech stack

React 19 · TypeScript · Vite 6 · Tailwind CSS 3 · Radix UI / shadcn-style
components · React Router 6 · Zustand · Framer Motion · Supabase (DB + Auth +
Storage) · Sonner (toasts) · Lucide icons.
