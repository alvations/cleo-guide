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
- **W4 (2026-10-03, PGL+NVN wave-3 relaunch session)** — files FOOD_NOVENA4.json, SIGHTS_NOVENA4.json, SOURCES_NOVENA4.json, geo/_geoout_novena_w5.json. Queries: 2nd-source the W3 held list (domain-restricted), Settlement/Tebing Lane status pass, Sumang/Edgefield/Punggol Field coffeeshops, Waterway Point/Punggol Plaza non-chain, creator pass, Punggol sights; NVN Goodwood Deli/Carousel/Mun Zuk; pin Punggol Coast HC / Settlement / Northshore.

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

## W3 (2026-10-03, PGL+NVN session)
- **Outcome:** NVN 38 food + 9 sights = **47 / 55 → NEED +8** (was 37). Page renders **29** pins (was 23); greyed.
- **Files:** FOOD_NOVENA3.json (9), SIGHTS_NOVENA3.json (1), SOURCES_NOVENA3.json (BUKITBROWN, MND, ANDYHAYLER, THEPEAK, MAKANSUTRA, SGFOODONFOOT, FROMMERS), CREATORS_NOVENA3.json (ieatishootipost attach), geo/_geoout_novena_w4.json.
- **Added:** Bukit Brown Cemetery (Novena planning area per Wikipedia; Wikipedia pin), Min Jiang + Goodwood Coffee Lounge durian desserts (Goodwood pin), Bee Heng Popiah (Newton FC pin), Shang Palace + Origin Grill (Shangri-La, Orange Grove = Newton subzone; Wikipedia pin), AMI Patisserie (27 Scotts), Chef Chan's Private Dine (35 Scotts), Chui Huay Lim Teochew Cuisine (Keng Lee Rd), Smiths Fish & Chips (Balmoral Plaza) — last four UNVERIFIED (no place pin readable).
- **Held:** Mun Zuk (Eatbook only), Thailily / Rochor Thai (Burpple/Seth Lui only), Whitley Rd prawn mee Thomson (Michelin listing is the Old Airport Rd stall), Cafe Gui (Eatbook review lukewarm — mention ≠ merit), Carousel (AsiaOne People's Choice Hall of Fame, but only hotel/OpenTable pages surfaced the award), Daily Affairs, Chui Huay Lim Club as a sight (PA heritage page only), Cairnhill conservation (URA + Roots — next wave).
- **Dropped:** Rolina curry puff (Bib 2018 when at Novena Church; long since moved to Tanjong Pagar).
- **Creator pass:** Mark Wiens / Food Ranger / Best Ever Food Review at Newton → no findable video; ieatishootipost (Dr Leslie Tay) Bee Heng post attached.

### W3 close (2026-10-03)
- **Final:** NVN 42 food + 11 sights = **53 / 55 (NEED +2)**; food share 79%; **35 pinned** on newton-novena.html (was 23).
- **Added late:** Cairnhill Conservation Area (URA + Roots) + Tan Chin Tuan Mansion (Wikipedia + URA + Roots; pin), The Line + Waterfall Ristorante (Shangri-La; pinned), L'Espresso (Goodwood; pinned), Guan Kee Grilled Seafood (Newton; pinned).
- **Checked:** Newton FC "3-month closure" = Nov 2022–Jan 2023 (reopened 1 Feb 2023; Mothership) — not current. Kampong Java Park = Kallang planning area + closed for N–S Corridor works → out of scope. LKY birthplace (92 Kampong Java Rd) = marker only → not added.
- **Next (+2 → go-live):** Goodwood Park Deli (Durian Fiesta since 1983: BK, The Peak, City Nomads, Makansutra — distinct outlet from the Coffee Lounge; decide de-dup), Carousel (find independent coverage of the AsiaOne People's Choice Hall of Fame), Mun Zuk 2nd source; then helper-pin AMI / Chef Chan's / Chui Huay Lim / Smiths / Banelé and add `newton-novena` to LIVE_SLUGS.

## W4 (2026-10-03, PGL+NVN wave-3 relaunch session)
- **Outcome:** NVN 45 food + 11 sights = **56 / 55 — OK (density met)**; page **37 pinned** (P8 F29; was 35).
- **Files:** FOOD_NOVENA4.json (4), geo/_geoout_novena_w5.json.
- **Added:** Soon Wah Fishball Kway Teow Mee (DFD + MTC + Tatler Asia), Newton Tian Xiang Big Prawn Noodle (Seth Lui + DFD + HungryGoWhere), R&B Express (DFD review + HungryGoWhere) — all pinned to the Newton FC building pin (med); Hong Kong Cha Kee, Goldhill (Seth Lui + DFD + HGW; rebranded from Hong Kong Day. Cha Kee; UNVERIFIED pin).
- **Fixed duplicate:** "Bee Heng Popiah (Newton)" (W3, FOOD_NOVENA3) was the same #01-12 stall as W1's "Bee Heng Satay, BBQ Prawn & Otah" — and its popiah was discontinued in 2023 (City Nomads / MTC). Removed the W3 record; the W1 record stands.
- **Decided:** Goodwood Park "The Deli" Durian Fiesta (Time Out + The Peak + City Nomads + Eatbook) is the same durian-dessert programme already carried by the Goodwood Coffee Lounge record → NOT added as a separate place (de-dup).
- **Held:** Carousel (only OpenTable/TripAdvisor surfaced the AsiaOne Hall of Fame claim), Mun Zuk (Eatbook only), Mangiano by CC (MTC + DFD but Novena address not confirmable), Kitchenette Goldhill (Seth Lui 2016 list; status unknown).
- **Go-live:** density OK; still needs the helper to pin AMI / Chef Chan's / Chui Huay Lim / Smiths / Banelé / Hong Kong Cha Kee before relinking (37 pins now).
