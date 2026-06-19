## Changes

### 1. Catalogue layout (`src/routes/index.tsx` + `src/lib/site.ts`)

**Top sections — 2 only:**
- **Eau** (all waters)
- **Boissons** (sodas + cans + juice + punch combined)

Update `GROUPS` to `[{ key: "water", label: "Eau" }, { key: "drinks", label: "Boissons" }]` and adjust `productGroup()` so anything not `category === "water"` returns `"drinks"`. Filter chips reflect the same 2 groups + "Tout".

**Eau sub-sections by size:**
Inside the Eau section, group products into four sub-blocks with size sub-headers, in this order:
1. **2L**
2. **1,5L**
3. **1L**
4. **0,5L**

Within each sub-block, sort products by `price_tnd` ascending (cheapest first).

Parsing rule: derive size in liters from `p.size` (handles "2L", "1.5L", "0.5L", "1,5 L", etc. → normalize commas/spaces, parse float). Any water that doesn't match one of the 4 buckets falls into an "Autres formats" sub-block at the bottom.

**Boissons section:** single grid, sorted by name then price ascending (no sub-headers).

### 2. Cart — one-tap WhatsApp (`src/components/cart-drawer.tsx`)

- Remove the **Copier** button and the `copied` / `copy()` logic entirely.
- Footer becomes a single full-width green button **"Commander sur WhatsApp"** that:
  - validates name / phone / address,
  - if invalid: shows the existing inline error (no navigation),
  - if valid: opens `waUrl(message)` in a new tab — message is auto-prefilled, user just taps Send in WhatsApp.
- Keep the small hint text "Frais de livraison à confirmer sur WhatsApp." and the "Vider le panier" link.
- Remove unused imports (`Copy`, `Check`, `useState` for copied).

### 3. Out of scope (for now)

- **Product name corrections** — the user said they'll send the corrected list separately. No name edits in this round; once they send the list I'll do a single DB update.
- No design / color / typography changes.
- No changes to admin, auth, contact, delivery pages.

## Technical notes

- `productGroup` simplification means juice items (Delio / Punch) move into "Boissons" alongside sodas — matches the user's request to keep "water alone, other drinks together".
- Size parsing kept in `src/lib/site.ts` as a `waterSizeBucket(sizeStr): "2L" | "1.5L" | "1L" | "0.5L" | "other"` helper so it's reusable and testable.
- Sub-header order is fixed (descending size as the user specified: 2L → 0.5L), not data-driven.
- No DB migration, no schema change, no new dependencies.
