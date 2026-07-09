## Changes

### 1. Add MyTunisia 2L to promotions
In `src/lib/promotions.ts`, add a 4th entry: MyTunisia 2L, pack of 3 at 12.000 TND instead of 12.900 TND (same shape as Vivian/Melina/Pristine). It will render automatically in the promo grid on the home page.

### 2. Pack quantity counts toward the 10-bottle minimum
Right now adding a promo pack adds 1 line to the cart, so the minimum-order check sees it as 1 unit. Fix so the pack of 3 counts as 3 units:

- In `src/components/promo-card.tsx`, when clicking "Ajouter au panier", add the pack with `quantity: p.packQty` (3) instead of 1 — call `addItem(...)` with quantity 3, or call it 3 times, matching whichever API the existing cart exposes.
- Verify the cart total / minimum-order gate reads `sum(item.quantity)` (not `items.length`); if it currently counts lines, switch it to sum quantities so packs contribute their real bottle count everywhere (header badge, cart drawer minimum warning, WhatsApp message).

Files touched: `src/lib/promotions.ts`, `src/components/promo-card.tsx`, and (only if needed) the cart store / drawer / min-order check.

### 3. Quiet fix: promo countdown hydration mismatch
`PromoCountdown` computes the remaining time during SSR and again on the client, so the first paint shows two different values (e.g. `09` vs `04`). Render a stable placeholder (e.g. `--:--:--`) on the server and only compute the live time after mount via `useEffect` + a `mounted` flag. No visual change once hydrated.
