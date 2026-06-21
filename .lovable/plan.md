## 1. Real product photos (you'll upload)

**How to send them:** Drop the photos into chat (up to 10 per message — send in batches). Name each file so I can match it to the right product+size, e.g.:
- `pristine-2l.jpg`, `pristine-1.5l.jpg`, `pristine-0.5l.jpg`
- `safia-1l.jpg`, `marwa-2l.jpg`, `boga-cola-can.jpg`, etc.

For each photo I'll:
- Upload to the CDN (lovable-assets) and set it as that product's `image_url` in the database.
- Match by filename → product name + size. If a filename doesn't match exactly, I'll ask you before assigning.
- Fix typos on the matched product name based on what's actually printed on the bottle (e.g. current "Bristine" → "Pristine"). Any other wrong names I spot from the labels, I'll correct the same way.

Send the 2L batch first; we iterate per batch.

## 2. Stock status (in stock / out of stock)

**Database:** add an `in_stock boolean not null default true` column on `products` (migration).

**Admin page (`/admin`):** for each product row, a toggle switch with a colored label
- ON → green pill "En stock"
- OFF → red pill "Rupture de stock"
- Click flips it instantly (optimistic update + server fn).

**Shop (home page):** out-of-stock products stay visible but are
- greyed out (image + text at ~40% opacity, grayscale)
- show a red "Rupture de stock" badge over the image
- "Ajouter" button is disabled
- Cart drawer / qty controls also disabled for that item

## 3. Real WhatsApp logo on the floating button

Replace the current generic chat icon on the bottom-right floating WhatsApp button with the official WhatsApp glyph (clean white WhatsApp mark on the green circle, matching WhatsApp brand green `#25D366`). I'll generate it as a transparent SVG-style PNG so it stays crisp.

## Technical notes
- Migration: `ALTER TABLE public.products ADD COLUMN in_stock boolean not null default true;` (RLS/GRANTs already in place).
- New server fn `setProductStock({ id, in_stock })` protected by `requireSupabaseAuth` + admin role check, called from the admin toggle.
- `ProductCard` reads `p.in_stock`; when false → disabled state + red badge + grayscale.
- Photo workflow per batch: I download the uploaded files, run `lovable-assets create` per file, `UPDATE public.products SET image_url=... WHERE name ILIKE ... AND size=...`. I'll show you the matches before committing.
- WhatsApp button: swap icon source in the floating button component (likely in `cart-drawer.tsx` or a dedicated component — I'll find it).

Out of scope: payment/checkout changes, layout changes, new pages.