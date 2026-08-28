# Metros — giving a city the full "NYC + outskirts" treatment

Some entries in the Singapore/SEA guide are **towns** (a single neighbourhood — Toa Payoh, Tiong Bahru)
and some are **cities** (a whole metropolis with districts *and* outskirts — Ho Chi Minh City, like NYC
with its boroughs and the commuter/day-trip ring around them). That difference is **data, not code**: it
lives in [`data/metros.json`](../data/metros.json) and is consumed by `tools/build-singapore-pages.py`.

This is the reuse mechanism. To give the **next** city the same treatment you do **not** edit the build —
you add one entry to `data/metros.json`.

## What a city entry controls

```jsonc
"ho-chi-minh-city": {
  "tier": "city",              // 'city' → CITY badge on the hub + district colour-coding + city framing.
                               //           (absent / 'town' → a single-area town/neighbourhood page.)
  "zoom": 11,                  // optional map-zoom override — lower = wider, so the outskirts fit.
  "page_keywords": [           // extra address keywords that pull OUTER/day-trip records onto this page,
    "Biên Hòa","Đồng Nai",     //   on top of the core identity keywords in PLACES (build-singapore-pages).
    "Bình Dương","Cần Thơ", …  //   Needed because a place in "Biên Hòa, Đồng Nai" has no "Ho Chi Minh City"
  ],                           //   in its address, so only these keywords assign it to the HCMC page.
  "districts": [               // ORDERED colour-coded sub-areas — the "boroughs". First match wins.
    {"id":"D1","name":"District 1 (Bến Nghé · Bến Thành)","keywords":["district 1","quan 1", …]},
    { … core districts → inner ring → Thủ Đức/outer districts → adjacent cities → day-trip ring … }
  ]
}
```

- **`id`** must be alphanumeric (it becomes a bare JS object key in `const AC = {…}` — a hyphen blanks the
  page). **`name`** is what shows in the map legend and the area filter. **`keywords`** are lowercased
  substrings matched against each record's `name + address`; a record matching none lands in the page's
  `OTHER` bucket (named for the city). Only districts that actually contain a rendered pin appear.
- Marker colours come from `PASTELS` in the build (extend it if a city has more districts than colours).
- Cities listed with `"districts": []` are **city-tier placeholders** (they get the CITY badge now; fill
  in their districts when that city is populated).

## The order to list districts (metro shape)

Mirror how NYC reads — **core → inner ring → outer boroughs → adjacent cities → day-trip ring** — so the
legend tells the story of the metro:

1. **Core** downtown districts (HCMC: D1, D3, D4, Chợ Lớn, D10/11).
2. **Inner ring** (Phú Nhuận, Bình Thạnh · Gò Vấp, Tân Bình · Airport).
3. **Outer city** (Thủ Đức City, District 7 · Nhà Bè).
4. **Adjacent provincial cities** the metro spills into (Biên Hòa/Đồng Nai, Bình Dương/Đại Nam) — NYC's
   NJ/Westchester/Long Island equivalent.
5. **Directional route corridors** (see below) — not one flat "day trips" bucket.

## Corridors — the in-between stops, not just the endpoints

A far day-trip point is the *end* of a route, and the stops **between** the centre and that point are real
places a traveller passes (and eats at). Don't collapse them into a single "Day trips" bucket — that hides
everything between the city and the edge. Instead split the far ring into **directional route corridors**,
each a district bucket whose keywords include the **in-between towns along that route**:

- **HCMC** → `NW route · Củ Chi → Trảng Bàng → Tây Ninh` · `SW route · Long An → Mekong Delta` ·
  `SE route · Long Thành → Bà Rịa → Vũng Tàu` · `S route · Nhà Bè → Cần Giờ`.

So Trảng Bàng (bánh canh, on the way to Tây Ninh), Bến Lức / Tân An (Long An, on the way to the Mekong),
and Long Thành / Bà Rịa (bánh khọt, on the way to Vũng Tàu) each get a coloured pin in the corridor they
belong to — the map shows the *route*, not just its endpoint.

**To discover a corridor** (reusable for any metro): name the routes from the centre to each far point, then
run one discovery pass per route for the notable **food, drinks and things-to-do at the towns along it** —
same bar as everything else (≥2 credible / lone-institutional, fact-checked, ranked within the corridor). Add
the corridor's in-between town names to the page's `page_keywords` (so records there assign to the page) and to
the corridor bucket's `keywords` (so they colour into the right route). No build-code change — it's all the
`data/metros.json` entry.

## Full procedure for a new metro city

1. **Discover** its places through the normal flow (`docs/PIPELINE.md`, `docs/SOURCES.md`) — signature-first
   food + sights, ≥2 credible sources or a lone institutional authority, fact-checked, **addresses that name
   the district/province** so the binning works. Keep the city's sources namespaced (`docs/CITIES.md`).
2. **Add its `data/metros.json` entry** — `tier:"city"`, the ordered `districts`, and any `page_keywords`
   for outskirts/day-trip provinces that don't carry the city name in their address. Extend `PASTELS` if it
   has more districts than the palette.
3. **Add it to `LIVE_SLUGS`** in `tools/build-singapore-pages.py` when it's ready to go live on the hub.
4. **Geocode + status-check** the new places (sequential WebSearch waves — the budget is shared, so do not
   fan out; see CLAUDE.md rule 4b), `tools/geo-merge.py singapore`, then rebuild.
5. `python3 tools/rebuild-city.py singapore --build` → `node tools/test-singapore.js` → `check-escapes.py`.
   The build asserts a valid map (centre within pins) and that **no Google base-map surface** survives; the
   test asserts every page renders with markers in both leaflet-on/off scenarios.

Nothing in `build-singapore-pages.py` needs editing for a new metro city except `LIVE_SLUGS` (go-live) and,
rarely, `PASTELS` (more districts than colours). Everything else is the `data/metros.json` entry.
