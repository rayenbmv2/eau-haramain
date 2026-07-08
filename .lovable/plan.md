## Updates: location, WhatsApp number, free delivery banner, promotions section

### 1. Update WhatsApp number
- Change `SITE.whatsappRaw` in `src/lib/site.ts` from `21652243555` → `21699185506`
- Update `SITE.phoneDisplay` → `+216 99 185 506`
- This propagates everywhere: header CTA, cart drawer, contact page, WhatsApp button, tel: links, JSON-LD.

### 2. Free delivery top banner (site-wide)
- Add a thin colored strip at the very top of `src/components/site-header.tsx` (above the existing header row), visible on every page and every viewport.
- Content: 🚚 **توصيل مجاني** · Livraison gratuite
- Style: gradient using existing brand tokens (whatsapp green / ocean primary), white text, small padding, RTL-friendly, sticky-safe (stays above header).

### 3. Google Maps location card
- Add a **"Nous trouver"** section on `src/routes/contact.tsx` (below the WhatsApp / phone / hours cards) with:
  - A card containing a MapPin icon, address label, and a big button "Ouvrir dans Google Maps" linking to https://maps.app.goo.gl/9ZU1fBLyiJ1TQCkh8 (target `_blank`, rel noopener).
  - Below the button, an embedded Google Maps `<iframe>` preview (using the same shared URL via `?output=embed`) with rounded corners.
- Also add a small "📍 Localisation" link in the site header / footer area of the contact page for quick access. (Kept minimal — the main entry point is the Contact page card, matching the pizza-restaurant pattern.)

### 4. Promotions section (first section on home page)
Replace the current "Eau → 2 L" being the visual first block by inserting a new **Promotions** section ABOVE Eau and Boissons on `src/routes/index.tsx`.

**Data source:** hard-coded promo array in a new file `src/lib/promotions.ts` (not DB, so it's easy to edit/remove later):
```
[
  { id: 'promo-vivian-2l',  name: 'Vivian 2L',   packQty: 3, priceTnd: 12.000, oldPriceTnd: 12.900, image: <vivian img> },
  { id: 'promo-melina-2l',  name: 'Melina 2L',   packQty: 3, priceTnd: 12.000, oldPriceTnd: 12.900, image: <melina img> },
  { id: 'promo-pristine-2l',name: 'Pristine 2L', packQty: 3, priceTnd: 12.000, oldPriceTnd: 12.900, image: <pristine img> },
]
```
(Images reuse existing water assets where available; Vivian/Pristine 2L have no dedicated asset yet — fall back to the generic water product image already in `CATEGORY_IMAGE.water`.)

**Section design:**
- Distinct visual treatment: gradient background card, "🔥 PROMOTIONS" heading in bold, RTL Arabic sub-label "عروض حصرية".
- 3 promo cards in a grid (2 cols mobile, 3 cols desktop). Each card shows: image, product name, "Pack de 3", NEW price large + OLD price struck-through in muted red, an "Économisez X" chip, and an "Ajouter au panier" WhatsApp button that pre-fills the promo pack message.
- The Promotions section is always first, above Eau. Not affected by the category filter chips (or shown regardless of filter, since it's a fixed promo).

### 5. Countdown timer (resets daily at midnight Tunis time)
- New client component `src/components/promo-countdown.tsx`:
  - Computes remaining time until next 00:00 Africa/Tunis (using `Intl.DateTimeFormat` with `timeZone: 'Africa/Tunis'` to get current Tunis time regardless of visitor timezone).
  - Displays HH : MM : SS in a bold monospace-style badge, updates every 1 second via `setInterval`.
  - When it hits 0 it automatically recomputes for the next midnight → loops every 24h with no manual work.
  - Label: "⏰ Offre valable encore" + Arabic "ينتهي بعد".
- Placed inside the Promotions section header.

### 6. Head metadata for contact page
- Add the Google Maps URL info to the contact page description so the location is discoverable.

### Files changed
- `src/lib/site.ts` — phone/WhatsApp number
- `src/components/site-header.tsx` — top free-delivery strip
- `src/routes/contact.tsx` — location card + embedded map
- `src/lib/promotions.ts` — NEW, promo data
- `src/components/promo-countdown.tsx` — NEW, live countdown
- `src/components/promo-card.tsx` — NEW, promo card UI
- `src/routes/index.tsx` — insert Promotions section above Eau

### Not doing
- No DB changes — promos are hard-coded so they can be edited/removed without a migration. When you want to swap products or end the promo, just edit `src/lib/promotions.ts`.
