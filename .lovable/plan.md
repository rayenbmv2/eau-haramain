## Reorder soft drinks (Gazouz) smallest → largest, group by size

Sort all `soft_drinks` products into 4 size blocks, ascending by volume. Also normalize the 3 Punch "0.30L" products to `33cl` so they merge cleanly with the canettes block.

### New order

**25cl block (sort_order 10–13)**
1. Delio menthe
2. Delio Peach
3. Delio pomme
4. Delio poire

**33cl block (sort_order 20–32)** — includes the 3 Punch items relabeled from 0.30L to 33cl
5. Coca Canette
6. Coca Zero Canette
7. Fanta Canette
8. Sprite Canette
9. Boga Bitha Canette
10. Boga Cidre Canette
11. Schweppes Tonic Canette
12. Schweppes Ananas Canette
13. Orangina Canette
14. Punch Cidre (size updated to 33cl)
15. Punch Apple (size updated to 33cl)
16. Punch Orange 33cl (size updated to 33cl)

**0.5L block (sort_order 40–45)**
17. coca
18. sprite
19. fanta
20. apla
21. boga lim
22. boga cidre

**1L block (sort_order 50–57)**
23. Coca
24. Fanta
25. Sprite
26. Schweppes citron
27. Boga lim
28. Boga Cidre
29. Punch Pomme
30. Punch Orange

**1.5L block (sort_order 60–68)**
31. Coca
32. Fanta
33. Sprite
34. Apla
35. Viva
36. Schweppes Mangue
37. Schweppes Citron
38. Punch Orange
39. Boga cidre

### How

One `UPDATE` per product on `products` setting the new `sort_order` (and `size='33cl'` for the 3 Punch rows). Only the `soft_drinks` category is touched. No schema or code changes.

Note: you mentioned you'd fix the Delio size label yourself — it's already `25cl` in the DB for all 4 Delio products, so nothing to change there.