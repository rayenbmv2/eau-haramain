# 1.5L photos, name fixes & Garci restructure

Scope: only 1.5L products + Vivian 2L photo copy + Garci change. Stock/admin/0.5L deferred to next batches.

## 1. Upload 1.5L photos to CDN
Upload all 10 uploaded files via `lovable-assets create` from `/mnt/user-uploads/`.

## 2. Map photos to products (with name corrections based on labels)

| File | DB product (current) | Action |
|---|---|---|
| Bargou_1.5_L.webp | Bargo 1.5L | rename → **Bargou**, set image |
| Caristalin_1.5.webp | Caristalin 1.5L | rename → **Cristaline**, set image |
| Delice_1.5.webp | Delice 1.5L | set image |
| eau-minerale.webp (Melina) | Melina 1.5L | set image |
| hayet_1.5.webp | 7ayet 1.5L | rename → **Hayet**, set image |
| MY_TUNISIA_1.5.jpg | My Tunisia 1.5L | set image |
| sabrine_1.5.webp | Sabrine 1.5L | set image |
| Safia_1.5.webp | Safia 1.5L | set image |
| Ttiba_1.5.jpg | Tiba 1.5L | set image (label = Tiba, keep name) |
| tijen_1.5.png | — (not in DB) | **insert new** product `Tijen` 1.5L, eau category, price TBD |

Question: **Tijen** isn't in the DB — what price should I use? I'll default to 3.800 TND unless you say otherwise.

## 3. Vivian photo on 2L
Copy current `Vivian 1.5L` `image_url` to `Vivian 2L` (price 4.300 stays).

## 4. Garci restructure (1.5L)
- Rename existing `Garci Zarga` 1.5L → **Garci Bleu**, price 4.200 (keep image).
- Insert new `Garci` 1.5L at 4.200 TND (no image yet).

## 5. Out of scope (will do after you confirm)
- Stock badge visibility on cards (already implemented backend in last turn; will verify it shows on the shop)
- Admin page polish
- 0.5L photos & products
- 2L name corrections

Confirm and I'll execute, defaulting Tijen price to 3.800 TND unless you specify another.
