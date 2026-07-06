## Update 1L bottle images

Replace the placeholder/wrong images on the six 1L water products with the photos you uploaded.

### Mapping

| Product (row in DB) | New image |
|---|---|
| Delice 1L | `eau-minerale.jpg` |
| Garci 1L | `garci.webp` |
| Garci Bleu 1L | `garci_blue.webp` |
| Hayet 1L | `hayet.webp` |
| Mira 1L | `mira.jpg` (replaces the 2L-looking picture currently shown) |
| Pristine 1L | `pristine.jpg` |

Mira 2L is left as-is (still uses the 2L bottle image, which is correct for it).

### Steps

1. Upload each of the 6 files to the Lovable CDN via `lovable-assets create`, storing pointer JSONs under `src/assets/`.
2. Run a single SQL update to set `products.image_url` for each of the 6 rows above to its new CDN URL.
3. Verify on the home page that each 1L card shows the correct bottle.

No code, schema, or pricing changes.