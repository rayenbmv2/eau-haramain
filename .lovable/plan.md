## Reorder soft drinks (Gazouz) from biggest to smallest

Currently the soft_drinks category is sorted 1L → 1.5L → 33cl → Delio 1L → 0.30L. You want the same treatment as water: largest volume first, descending down to the smallest.

### New order (all soft_drinks, sort_order rewritten)

**1.5L block (sort_order 10–18)**
Coca, Fanta, Sprite, Apla, Viva, Schweppes Mangue, Schweppes Citron, Punch Orange, Boga Cidre

**1L block (sort_order 20–31)**
Coca, Fanta, Sprite, Schweppes, Boga Lim, Boga Cidre, Punch Pomme, Punch Orange, Delio, Delio Mint, Delio Peach, Delio Apple, Delio Pear

**33cl / 0.33L block (sort_order 40–48)**
Coca Canette, Coca Zero Canette, Fanta Canette, Sprite Canette, Boga Bitha Canette, Boga Cidre Canette, Schweppes Tonic Canette, Schweppes Ananas Canette, Orangina Canette

**0.30L block (sort_order 60–62)**
Punch Cidre, Punch Apple, Punch Orange

### How

One `UPDATE` per product on the `products` table setting the new `sort_order` (only the soft_drinks category is touched; water is left alone). No schema or code changes.
