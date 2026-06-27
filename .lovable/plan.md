## Minimum order: 10 items total

Enforce a minimum of **10 units total** in the cart before a customer can send the WhatsApp order. Mixed products count together (e.g. 3 Apla + 3 Sprite + 4 Hayet = 10 ✓).

### Changes — `src/components/cart-drawer.tsx` only

1. **Constant**: `const MIN_ITEMS = 10;`
2. **Validation**: extend `valid` so it also requires `cartCount(items) >= MIN_ITEMS`.
3. **Cart panel UI**:
   - Under the total, show current count vs. minimum, e.g. *"Quantité: 7 / 10 minimum"*.
   - When below 10, render a clear notice in amber: *"Commande minimum: 10 bouteilles. Ajoutez encore X article(s)."*
   - The "Commander sur WhatsApp" button stays disabled (greyed-out style already in place) until the minimum is reached.
4. **Floating cart FAB** (bottom-right pill): if count < 10, show a small badge/dot or subtle text hint so users notice before opening the drawer. Keep it discreet — the main enforcement happens in the drawer.

### Out of scope
- No per-product minimum, no per-category minimum — just total units.
- No backend change (orders go via WhatsApp, no DB write).
- No change to admin or product pages.

Confirm and I'll implement.
