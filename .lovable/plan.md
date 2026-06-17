# شركة الحرمين — Water Delivery Website

A fast, mobile-first website for **شركة الحرمين** (Tunisian water & beverages delivery in Ben Arous). Customers browse products and place orders via WhatsApp to **+216 52 243 555**. Admin can log in to manage products and prices.

## Pages & routes

- `/` — Home (hero, why-choose-us, delivery area, featured products, WhatsApp CTA)
- `/products` — All products with search bar + category filters (Bottled Water, Sparkling, Soft Drinks, Packs)
- `/delivery` — Delivery info (areas, same-day, bulk, home/business)
- `/contact` — WhatsApp, phone, working hours
- `/auth` — Admin login
- `/admin` (protected) — Manage products: add/edit/delete name, size, price, category, image, featured flag

Floating WhatsApp button on every page. Header nav + Arabic-friendly typography (site in English with Arabic brand name displayed prominently).

## WhatsApp ordering

Every product card and detail has an **"Order on WhatsApp"** button that opens:
`https://wa.me/21652243555?text=<prefilled>` with:
```
Hello شركة الحرمين, I want to order:
- Product: [Name — Size]
- Price: [X.XXX TND]
- Quantity: 
- Delivery address: 
- Phone number: 
```
Hero/floating buttons use a generic version without product.

## Design

- Modern, clean **blue water theme**. Primary deep ocean blue `oklch(0.45 0.15 230)` + soft aqua accent `oklch(0.75 0.12 210)`; whites and light blue-grays for surfaces.
- Typography: Outfit (display) + Inter (body), via @fontsource.
- Subtle water-drop/wave SVG accents, soft shadows, rounded cards.
- Mobile-first layout: sticky bottom WhatsApp CTA on mobile, 2-col product grid on mobile / 3–4 col desktop.
- Trust signals: "Fast delivery", "Best prices", "Trusted supplier", "Bulk orders".

## Backend (Lovable Cloud)

Enable Lovable Cloud. Schema:

- `products` table: `id`, `name`, `name_ar` (optional), `category` (enum: water, sparkling, soft_drinks, packs), `size`, `price_tnd` (numeric), `image_url`, `featured` (bool), `sort_order`, timestamps.
  - RLS: public `SELECT` for anon (catalog is public); `INSERT/UPDATE/DELETE` restricted to admin role.
- `user_roles` table + `app_role` enum (`admin`) + `has_role()` security-definer function (per platform guidelines).
- Storage bucket `product-images` (public read) for uploaded product images.

Seed the 18 products listed in the brief via migration.

### Admin
- `/auth` — email/password login (no signup UI; admin account seeded or first-user-becomes-admin script).
- `/admin` — list/create/edit/delete products with image upload, gated by `_authenticated` layout + `has_role(uid, 'admin')` check.

## Product images

Generate clean studio-style product photos (bottle on white/blue gradient) for each catalog item using imagegen, stored in `src/assets/` and referenced as initial `image_url` in seed data. Admin can replace via upload later.

## Tech notes

- TanStack Start routes under `src/routes/`.
- Public catalog read via server publishable client in a `createServerFn` (no admin key on Data API).
- Admin mutations via `requireSupabaseAuth` server fns + `has_role` check.
- SEO: per-route `head()` with title/description; OG tags on home.
- Floating WhatsApp + sticky mobile CTA implemented as a shared component in `__root.tsx`.

## Out of scope

No cart, no checkout, no payments, no user accounts for customers — ordering is WhatsApp-only by design.
