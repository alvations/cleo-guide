# NOVENA (NVN) — Novena & Newton — agent note + checkpoint

Page: `Singapore/newton-novena.html` (slug `newton-novena`, area code `NVN`, SG_POP 50 → target 55 NVN-coded).
Files (NOVENA tag only): `FOOD_NOVENA*.json`, `SIGHTS_NOVENA*.json`, `CREATORS_NOVENA*.json`, `SOURCES_NOVENA*.json`,
`geo/_geoout_novena_*.json`, this note.
Pre-existing records that keyword-assign to the page (kept, deduped against): Wee Nam Kee Chicken Rice (United Sq),
Hup Kee Fried Oyster Omelette, Song Kee Teochew Fish Porridge, Alliance Seafood (all SGC-coded, Newton FC / Novena).

Scope: Novena + Newton planning areas (subzones Moulmein, Malcolm, Dunearn, Mount Pleasant; Newton Circus, Cairnhill,
Goodwood Park, Orange Grove, Monk's Hill, Istana Negara) — Newton Food Centre, Novena Church, Thomson Rd / Novena Sq /
Velocity / United Sq / Goldhill, Chancery Lane, Cairnhill/Scotts edge. Balestier Road = BLS agent (excluded).

## In-flight wave
- none (W1 closed early — see State).

## State (2026-10-02)
- **W1 DONE (partial — halted by the session WebSearch cap: 200/200 used across the shared run after ~14 NOVENA queries).**
  `FOOD_NOVENA.json` 5 · `SIGHTS_NOVENA.json` 1 · `CREATORS_NOVENA.json` (2 creators, 3 attach, rejects) ·
  `SOURCES_NOVENA.json` · `geo/_geoout_novena_w1.json` (6 pins: 1 high building pin, 5 med stall-in-building).
- Density: `python3 tools/density.py singapore --area NVN` → **6 NVN-coded (5 food + 1 sight) / target 55 → NEED +49**.
  Rendered on `Singapore/newton-novena.html`: **10** (6 new + 4 pre-existing SGC-coded keyword-assigned).
- Gates after `rebuild-city.py singapore --build`: geocheck PASS · statuscheck CONSISTENT · buildcheck PASS ·
  sourcecheck FAIL only on 46 pre-existing single-source places elsewhere (GATE 1 drops them; none are NVN).
- **NOT live** (far below density). Go-live = add `"newton-novena"` to LIVE_SLUGS once ≥55 + gated.

### Channel mix W1 (§2a)
- Institutional: MICHELIN Bib → 3 places (Heng, Kwee Heng, Kwang Kee). Heritage: Roots.gov.sg (NHB) → 1 sight.
- Editorial: Eatbook 5, Seth Lui 2, Women's Weekly 2, Miss Tam Chiak 1.
- Creators: ieatishootipost (Dr Leslie Tay, FB ~399K) 2 attach; The Ordinary Patrons blog 1 attach.
- Viral (TikTok/YouTube) searches: not reached before the cap.

### HELD (single credible source seen — need a 2nd before adding; re-verify open/closed, lists are 2018-era)
- TKR Satay (#01-33 Newton FC) — Eatbook only confirmed naming it.
- Whitley Road Big Prawn Noodle (273 Thomson Rd) — Seth Lui Novena/Thomson list.
- Chye Kee Goldhill Roasted Chicken Rice; Baan Ying (Royal Square, Thai) — ladyironchef 2018 Novena list.
- Da Luca Italian (Goldhill Plaza); ThaiLily (165 Thomson Rd, Goldhill Centre); La Ristrettos (Novena Medical Centre); Tomi (1 Goldhill Plaza #01-11) — Seth Lui list.
- Velocity@Novena Sq: Song Fa Bak Kut Teh (chain outlet — Bib is the New Bridge Rd shop, not this one), Lao Beijing, Mun Zuk by Li Fang Congee, Once Upon A Thyme (Square 2) — Eatbook Velocity guide only.
- Craftsmen Specialty Coffee, The Clueless Goat (Thomson) — single round-up.
- MEASURED & DROPPED: 328 Katong Laksa (ladyironchef: "a few minutes from Novena" — outside scope).

## NEXT (ordered; resume here)
1. When WebSearch budget is available: corroborate the HELD list (2nd credible + 2025/26 open check).
2. Food canon still to search: chicken rice (Thomson Rd), Hokkien/Teochew porridge, bak kut teh, prata/nasi padang,
   kaya toast; Scotts/Cairnhill/Orange Grove hotels (Goodwood Park — Min Jiang/Coffee Lounge durian; Shangri-La — Shang
   Palace; Royal Plaza on Scotts — Carousel); Far East Plaza (Hainanese Delicacy, Bib) — confirm Scotts-edge scope.
3. Sights: Novena Church (St Alphonsus), Goodwood Park Hotel (national monument), Tan Tock Seng Hospital heritage,
   Moulmein Rise (WOHA), former Police Academy / Mount Pleasant, Kampong Java Park, Istana-edge, Chancery Lane, Newton Circus.
4. Viral/creator queries (§2a): "novena food tiktok", "newton food centre youtube", Mark Wiens/Nex Carlos Newton episodes.
5. Geocode (OneMap/Wikidata/Google !3d!4d via WebSearch), `geo/_geoout_novena_w2.json`, then under the lock:
   `flock -w 3600 .git/cleo-shared.lock bash -c 'python3 tools/geo-merge.py singapore --only "_geoout_novena_*.json" && python3 tools/rebuild-city.py singapore --build'`.

## W2 (2026-10-02 relaunch, 4-town session)
- **Outcome:** NVN 27 food + 8 sights = **35 / target 55 -> NEED +20** (true count after the density.py fix); page renders ~23 pins; greyed (not live).
- **Files:** FOOD_NOVENA2.json (22), SIGHTS_NOVENA2.json (7), SOURCES_NOVENA2.json, geo/_geoout_novena_w2.json, _w3.json, geo/_geoout_sg4_w2d.json.
- **Sights:** Novena Church (Wikipedia+URA+Roots), Goodwood Park Hotel Tower Wing (National Monument; Wikipedia pin), Old Police Academy
  — CLOSED (defunct 2005; conserved blocks), TTSH Heritage Museum, No. 1 Moulmein Rise (WOHA, Aga Khan 2007), Singapore Polo Club, The Istana.
- **Food:** Newton FC (XO Minced Meat, 88 San Ren, 31 Heng Heng BBQ, Hajah Monah, Indian Kitchen, TKR Satay, Hai Yan BBQ); Scotts Rd
  (Alma *, Gordon Grill, Iru Den, Buona Terra *, INDOCAFE The White House, The Song of India); Novena (Da Luca, Chye Kee Goldhill, Craftsmen,
  El Cocinero, Sinn Ji); Hawkers' Street @ Square 2 (545 Whampoa Prawn Noodles, Tai Seng Fish Soup, Hill Street Hainanese Curry Rice); Waffletown.
- **MEASURED & DROPPED:** Velocity/United Square/Square 2 mall chains (Song Fa outlet, Tomi Sushi, Gyu-Kaku, Fish & Co, Genki, Saizeriya…)
  = padding; Mademoiselle Tang Noodle (Eatbook review lukewarm: overcooked) — mention is not merit; LONGJING (chain).
- **Held:** Whitley Road prawn mee (main stall is Old Airport Rd), ThaiLily, Baan Ying, Mun Zuk, Cafe Gui, Ami Patisserie, The Big Bird,
  Smiths, Chef Chan's, Guan Kee Grilled Seafood, Bee Heng Popiah, Banele, Alley Bar, Peranakan Place (Wikipedia-only), Mangiano by CC.
- **Next (+12):** domain-filtered 2nd-sourcing of the held list; Newton Circus/Cairnhill/Emerald Hill edge (confirm planning-area scope);
  geocode Scotts Rd restaurants (27/29/33/35 Scotts Rd) + Goldhill/Square 2 buildings via the helper.

> **COUNT CORRECTION (2026-10-02, later the same session):** `tools/density.py` was fixed by another session (commit 4f706d7) to stop
> counting `sg_worklist.json` as food — the earlier W2 figures in this file were inflated by that double-count. **True counts after the
> fix: HLV 56/55 OK (live) · BLS 55/55 OK (go-live held for pins) · NVN 35/55 (NEED +20) · PGL 35/93 (NEED +58).**

- **FINAL (end of session): HLV 57/55 OK (LIVE) · BLS 56/55 OK (go-live held for pins) · NVN 37/55 (NEED +18) · PGL 35/93 (NEED +58).** Late adds: NVN Baan Ying, Banelé; BLS Niu Dian (VIIO @ Balestier); HLV Niu Dian (HV).
