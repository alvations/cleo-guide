# beta/assets/img/photos/ — licensed photographs (owner drop-in)

Empty on purpose. Wikimedia hosts are blocked by this environment's network policy, so no photo has been fetched.

To add one: save a standard-width copy (≈960 px wide, ≤ 120 KB, `.webp`/`.jpg`/`.png`) here, add a complete row to
`../CREDITS.json`, then `cd tools && npm run beta && npm test`. Files without a complete credit row make the build
and `npm test` fail. Candidates are in `../manifest.json`. Full procedure: `design/beta/IMAGERY.md` → "Dropping in photos".
