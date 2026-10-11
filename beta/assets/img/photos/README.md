# beta/assets/img/photos/ — licensed photographs (owner drop-in)

Empty on purpose. Wikimedia hosts are blocked by this environment's network policy, so no photo has been fetched.

To add one: save a standard-width copy (≈960 px wide, ≤ 120 KB, `.webp`/`.jpg`/`.png`) here, add a complete row to
`../CREDITS.json`, then `cd tools && npm run beta && npm test`. Files without a complete credit row make the build
and `npm test` fail. Candidates are in `../manifest.json`. Full procedure: `design/beta/IMAGERY.md` → "Dropping in photos".

Unsplash photos: `node tools/beta/imagery/fetch-unsplash.js --go` (once the owner allows `api.unsplash.com` and
`images.unsplash.com` and sets `UNSPLASH_ACCESS_KEY`) stores files here as `<page>--<id>-960.webp`,
`hero--<key>-960.webp` or `cover--<key>-960.webp` and writes their credit rows. Candidates:
`../unsplash-candidates.json`. Procedure: `design/beta/IMAGERY.md` → "Unsplash candidates".
