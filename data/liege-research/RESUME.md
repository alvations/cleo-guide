# RESUME — Liège (`liege`)

## Targets (read by `tools/density.py liege`)
- `LIE` Liège city … ~85
- `LIER` around Liège … ~60

## State (2026-10-02, end of session 2)
- **Discovered 147** (all ≥2 credible or a lone Michelin/Gault&Millau/UNESCO): LIE 82 (47 food + 35 sights) vs ~85,
  LIER 66 (41 food + 25 sights) vs ~60 → LIER OK, LIE NEED +3.
- **Rendered 99** (57 sights + 42 food; high 51 · med 48); 48 held UNVERIFIED for pins.
- Page `cities/liege.html` LIVE under the 🇧🇪 hub (CARD:liege), in `data/countries.json` belgium pages.
- Gates: sourcecheck / geocheck / statuscheck / buildcheck all PASS; `npm run validate` + `npm test` PASS.
- Session 2 halted by the **session-wide WebSearch cap (200/200, lead + 5 background geocode agents)**.

## Search log
- Session 1: 11 (W1, then cap). Session 2: 200 (lead ≈150, geocode agents ≈50+).

## In-flight wave
- none (W3 closed cleanly).

## Next actions (ordered)
1. **Pin the held restaurants** (`_liege_geo_todo_LIE.txt` + `_liege_geo_todo_LIER.txt` minus what
   `geo/_geoout_liege_w3t.json` resolved). PROVEN technique: ONE place per WebSearch with
   `allowed_domains:["restaurantguru.com","foursquare.com","wanderlog.com"]` and query `<name> <street> Liège coordinates`
   → the summary prints the venue lat/lng (~90 % hit rate, 1 search per pin). Mapcarta/OSM single-place ≈15 %;
   ViaMichelin works for Michelin venues. Or use `tools/geocode-helper.html` in a browser.
   Remaining LIE first: Folies Gourmandes, Walio, Baci, Danieli, Origo, Le Concordia, Moment, Pépin, La Cantina,
   Les cinq étoiles, Sauvage, Le Verre Bouteille, Caffè Internazionale, Beer Lover's, Légia, La Mairie de
   Saint-Pholien, Riva (OSM N6340581085), La Cantinetta, Al Piccolo Mondo, Une Gaufrette Saperlipopette (re-pin:
   old point was Cabale's node), Musée en plein air du Sart-Tilman.
2. LIE +3 discovery: held single-source leads below; Musée Wittert (needs an independent 2nd source); Théâtre de
   Liège / Le Sauvenière cinema (Wikipedia coords known: 50°38′27″N 5°34′29″E / 50°38′36″N 5°34′07″E).
3. Closure re-check pass for restaurants pinned from RestaurantGuru (status = listing live + award year).
4. Re-verify `med` pins (Coteaux, Lac de Warfaaz, Le Carré, Roture are area/street reference points by design).

## Held single-source leads (need a 2nd credible source)
L'Aigle d'Or (Pl. Général Leman 19), Tout Simplement (Rue Hemricourt 8) — Moustique only; Golden Horse, La Villa
des Bégards — Eric Boschman only; Magma (Bib per foodle + Moustique — find the Michelin page); Café Brasil, Café
Randaxhe, Le Vaudrée II, Cupper Café, Chez Bolas Bug, La Diode — one outlet each; Le Notger, L'Escalier, Huggy's —
Culture Trip only; Peak Beer (Sourbrodt), Brasserie de Bellevaux, Brasserie de la Croix, Warsage, Cosse — one
outlet; Epicuriales 2023/24 openings (Green House, At Paps', Liège scales, Boys…); Château de Harzé (events venue,
not a visitor sight); Château de Moha, Montagne Saint-Pierre (Wikipedia only); Stoffels waffles, Pollux (LP +
mapstr). Préhistomuseum/Aigremont/Loncin/Jehay already in.

## Files
- Discovery: `FOOD_LIEGE_{LIE,W2,W3,LIER,LIER_W3}.json`, `SIGHTS_LIEGE_{LIE,W2,W3}.json`, `SOURCES_LIEGE.json`,
  `CREATORS_LIEGE{,_W2}.json` (Darley Newman, Eric Boschman).
- Geocodes: `geo/_geoout_liege_{w1,w2,w2food,w2b,w2c,w3,w3r,w3s,w3t}.json`. Helper: `_liege_add.py` (append+dedup).

## Commands
```bash
python3 tools/density.py liege
LOCK=/home/user/cleo-guide/.git/cleo-shared.lock
flock -w 3600 $LOCK python3 tools/rebuild-city.py liege --build
cd tools && npm run validate && npm test
```
