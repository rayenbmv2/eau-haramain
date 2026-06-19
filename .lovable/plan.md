## 1. Bigger, colored size headers (Eau section)

In `src/routes/index.tsx`, change the size sub-header (currently small grey uppercase `text-muted-foreground`) to a prominent brand-colored heading:

- Larger font: `text-lg sm:text-xl font-bold`
- Brand blue color: `text-primary`
- Small water-drop emoji or icon prefix (Lucide `Droplet`) in the same blue
- Thin underline border in `border-primary/20` for visual separation
- Keep the same order (2L → 1.5L → 1L → 0.5L)

No change to the Boissons section.

## 2. Clean product illustrations (one per product)

Generate a neutral, consistent illustration for **each product** in the catalog — clean bottle/can renders on a soft gradient background, no real brand labels, all matching the same visual style (same camera angle, lighting, shadow) so the grid looks cohesive.

**Process:**
1. Read all products from the DB (`SELECT id, name, size, category FROM products`).
2. For each product, generate one image with the agent `generate_image` tool:
   - Water bottles → "clean transparent plastic water bottle, [size] format, soft blue gradient background, studio lighting, product photography style, centered, no label text"
   - Sodas/cans → "aluminum soda can, [color hint from name e.g. orange for Fanta-like, dark for cola], soft neutral gradient background, studio lighting, no brand text"
   - Juice bottles → "glass juice bottle, [fruit color hint], soft warm gradient background, studio lighting, no brand text"
   - Punch → "punch drink bottle, red/pink tones, soft gradient background, studio lighting, no brand text"
3. Save to `src/assets/products/{id}.jpg`, upload each via `lovable-assets`, get CDN URL.
4. Bulk-update the `products` table: `UPDATE products SET image_url = '<cdn-url>' WHERE id = '<id>'`.

Since `ProductCard` already prefers `p.image_url` over the category fallback, no component change needed.

**Out of scope:**
- No real brand labels (legal/quality issue — illustrations only)
- No product name corrections (waiting on user's list)
- No layout/design changes outside the size header

## Technical notes

- Image generation runs in a loop (one tool call per product). For ~20–40 products this is a few minutes of generation time.
- All images use the same prompt skeleton so the catalog stays visually consistent.
- If a product is renamed later, the image still fits (it's generic by category + size, not name-specific).
- Existing category fallback images stay as a safety net for any product that fails to generate.
