# Remove the promotions section

Right now all four promo packs (Vivian, Melina, Pristine, My Tunisia 2 L) are already flagged as "sold out", but they are still switched on, so the orange Promotions block keeps showing with "Terminée" cards. That's why it looks like nothing changed.

## What I'll do

- Switch all four promotions off and mark them out of stock, so the whole orange Promotions block, the countdown, and the promo cards disappear from the home page.
- Leave the promo entries stored in the background, so they can be turned back on later without re-creating them.
- Check the home page afterwards to confirm the section is gone and the water/drinks sections move up to the top.

## Technical notes

- Data update on `public.promotions`: `active = false`, `available = false` for all rows.
- No code change needed: `src/routes/index.tsx` already filters on `active` and hides the section when the list is empty.
