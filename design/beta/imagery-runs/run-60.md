# Imagery run (dispatch ~17:05Z, all, budget 600) — review

Committed 6c007a0d (2026-10-16), on 5ac6d8d5. It covered Washington DC (wave 2, which the budget-400 run had not reached), candidate wave 3 (Bruges, Youngstown) and retries. Reviewed from a contact sheet of the committed 500 w files.

**31 new rows: 24 kept, 6 refused by imagery, 1 '?'.** The Mattress Factory row from run #58 was also refused (orchestrator) and is now a stated gap: every other Commons photo of it is 400 px.

```
KEPT
  bruges: begijnhof-ten-wijngaerde, belfort-van-brugge, damme (town hall façade), de-burg (from the belfry), onze-lieve-vrouwekerk, rozenhoedkaai, sint-janshospitaal, stadhuis-van-brugge
  pittsburgh#duquesne-incline ← Pittsburgh duqesne incline.jpg (the car on its track; second candidate)
  singapore/cebu#basilica-minore-… ← Basilica Minore del Santo Niño in Cebu City 02.jpg (second candidate)
  tokyo#gotoku-ji ← Gotokuji.jpg (the main hall)
  washingtondc: arlington-national-cemetery, library-of-congress, lincoln-memorial, national-gallery-of-art, NMAAHC, national-museum-of-american-history, the-phillips-collection, the-white-house, united-states-capitol, washington-monument
  youngstown: butler-institute-of-american-art, lantermans-mill, national-mckinley-birthplace-memorial
  bruges#zwin-natuurpark ← Zwin 32.jpg  ⚠ ? a plain beach with dunes; the reserve's salt marsh is not shown (orchestrator's call)
REFUSED (imagery)
  bruges#basiliek-van-het-heilig-bloed ← Brugge - Basiliek van het Heilig Bloed 1504.jpg — a painted triptych inside (artwork)
  bruges#groeningemuseum ← Groeningemuseum.001 - Brugge.jpg — a lake view, no museum (wrong subject)
  washingtondc#great-falls-park ← Great Falls Park Potomac River 02.jpg — a bronze plaque (signage)
  washingtondc#national-museum-of-natural-history ← … IMG 1966.JPG — an exhibit interior (wrong subject)
  washingtondc#smithsonian-american-art-museum-… ← Smithsonian American Art Museum exterior.jpg — a lettering sign (signage)
  washingtondc#thomas-jefferson-memorial ← Thomas Jefferson Memorial front.jpg — a close-up of the statue inside (close-up)
REFUSED (orchestrator): pittsburgh#mattress-factory ← Mattress Factory Museum.jpg — then a stated gap
```

After the review: **leads 25/25, first row 51/51**, tier-1 503/1003; 254 targets left to try. `beta:qa:w8p` passes (Tokyo phone@3× ≈618 KB).
