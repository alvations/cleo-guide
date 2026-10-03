# RESUME — Liège (`liege`)

## Targets (read by `tools/density.py liege`)
- `LIE` Liège city … ~85
- `LIER` around Liège … ~60

## State (2026-10-03, end of session 3 — W4)
- **Discovered 153** (all ≥2 credible or a lone Michelin/Gault&Millau/UNESCO): LIE 87 (51 food + 36 sights) vs ~85 OK,
  LIER 66 (41 food + 25 sights) vs ~60 OK → **every area OK**. Food share 60 %.
- **Rendered 144** (59 sights + 85 food); 1 closed flagged (Qualia, Verviers — Aug 2024); 8 held UNVERIFIED (below).
- Gates: sourcecheck / geocheck / statuscheck / buildcheck all PASS; `npm run validate` + `npm test` PASS.

## Search log
- Session 3: ~95 (W4: ~48 pin searches, ~17 discovery/verification).
- Session 1: 11 (W1, then cap). Session 2: 200 (lead ≈150, geocode agents ≈50+).

## In-flight wave
- none (W4 closed cleanly).

## Next actions (ordered)
1. Pin the last 8 UNVERIFIED: Origo (Rue Thier del Dague 72), Beer Lover's Café & Shop (first settle open/closed —
   Foursquare 'Fermé maintenant' vs Schlouk Map), Musée en plein air du Sart-Tilman (pin the museum office/main campus
   sculpture route start, not the Wikidata city-centre point), Badjawe (Av. de l'Expansion 4, Alleur), Fromagerie du Vieux
   Moulin (Clermont-sur-Berwinne), Galler (Rue de la Station 39, Vaux-sous-Chèvremont), Siroperie Meurens (Rue de la Kan 2,
   Aubel — NOT the Siroperie Artisanale d'Aubel), The Owl Distillery (Hameau de Goreux 7). Try `tools/geocode-helper.html`.
2. Closure re-check pass for restaurants pinned from RestaurantGuru (status = listing live + award year).
3. Re-verify `med` pins (all W4 pins are `med`; upgrade via Michelin/OSM place pages where possible).
4. Optional depth: held leads below (Volga, La Caféière, Torrefactory need a 2nd source).

## Held single-source leads (need a 2nd credible source)
W4: Volga bar d'atmosphère (Le Fooding), La Caféière (RTBF), Torrefactory (Paris Match), Eggenols waffles (blog).
Promoted in W4: Magma (Michelin Bib), Théâtre de Liège.
L'Aigle d'Or (Pl. Général Leman 19), Tout Simplement (Rue Hemricourt 8) — Moustique only; Golden Horse, La Villa
des Bégards — Eric Boschman only; Magma (Bib per foodle + Moustique — find the Michelin page); Café Brasil, Café
Randaxhe, Le Vaudrée II, Cupper Café, Chez Bolas Bug, La Diode — one outlet each; Le Notger, L'Escalier, Huggy's —
Culture Trip only; Peak Beer (Sourbrodt), Brasserie de Bellevaux, Brasserie de la Croix, Warsage, Cosse — one
outlet; Epicuriales 2023/24 openings (Green House, At Paps', Liège scales, Boys…); Château de Harzé (events venue,
not a visitor sight); Château de Moha, Montagne Saint-Pierre (Wikipedia only); Stoffels waffles, Pollux (LP +
mapstr). Préhistomuseum/Aigremont/Loncin/Jehay already in.

## Files
- Discovery: `FOOD_LIEGE_{LIE,W2,W3,LIER,LIER_W3}.json`, `SIGHTS_LIEGE_{LIE,W2,W3,W4}.json`, `FOOD_LIEGE_W4.json`, `SOURCES_LIEGE_W4.json`, `SOURCES_LIEGE.json`,
  `CREATORS_LIEGE{,_W2}.json` (Darley Newman, Eric Boschman).
- Geocodes: `geo/_geoout_liege_{w1,w2,w2food,w2b,w2c,w3,w3r,w3s,w3t,w4}.json`. Helpers: `_liege_add.py` (append+dedup), `_liege_w4geo.py` (pipe-format pin append + address fill).

## Commands
```bash
python3 tools/density.py liege
LOCK=/home/user/cleo-guide/.git/cleo-shared.lock
flock -w 3600 $LOCK python3 tools/rebuild-city.py liege --build
cd tools && npm run validate && npm test
```
