## Update store location to the new Google Maps pin

Replace the current Ben Arous placeholder with the real store location from https://maps.app.goo.gl/Eujewh9NhAmQzVqB7 on the Contact page.

### Changes

1. **`src/lib/site.ts`** — update `SITE.mapsUrl` to `https://maps.app.goo.gl/Eujewh9NhAmQzVqB7` (the short link the user just sent, so the "Open in Google Maps" button opens exactly that pin).

2. **`src/routes/contact.tsx`** — replace the embedded iframe `src` (currently `https://www.google.com/maps?q=Ben+Arous,Tunisia&output=embed`) with an embed URL pointing at the same coordinates as the shared pin, so the map preview shown at the bottom matches the button destination. I'll resolve the short link to its actual lat/lng and use `https://www.google.com/maps?q=<lat>,<lng>&output=embed` (no API key needed, same pattern as before). Tapping the map/button still opens Google Maps with the store location, just like on the restaurant site.

No other pages reference the map, so nothing else changes.
