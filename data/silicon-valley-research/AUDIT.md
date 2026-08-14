# Silicon Valley — audit trail

Append-only ledger following [docs/PIPELINE.md](../../docs/PIPELINE.md). Every stage records **what,
which source, how verified, and the date** so another agent can reproduce or continue. Newest wave
appends at the bottom of each section; nothing is overwritten.

Registry of record: `data/geocodes.json` → `cities["silicon-valley-ca"]` (coords + status).
Sources of record: `data/sources.json` → `cities["silicon-valley-ca"]`.

---

## Stage 0 — Scope & taxonomy  (2026-08-14)
Region = Santa Clara Valley / South Bay, modelled as a **region guide** (municipalities as areas).
- **Areas:** PA Palo Alto & Stanford · MV Mountain View & Los Altos · SUN Sunnyvale · CU Cupertino &
  Saratoga · SC Santa Clara · SJ San Jose · DAY Day Trips & Coast. Nearby towns fold to nearest:
  Milpitas→SC, Los Altos→MV, Los Gatos/Saratoga→CU or DAY, Menlo Park→PA/DAY.
- **Cuisines:** TWN, CN, CANT, SICH, VN, KR, JP, IN, SEA, MX, US, SEAF, **BOBA**, DES, VIRAL —
  anchored on the region's unique story: immigrant density (best Taiwanese/Vietnamese/South-Indian in
  the US) + the boba scene it invented.
- **Collections (CATS):** **TECH "Big Tech Campuses"** (marquee), ICON, MUS, PARK, **ENT** Sports/
  Music/Entertainment, **SHOP** Shopping & Districts, ARCH, VIEW, FAM, ODD, FREE. The map is
  deliberately not just food.

## Stage 1 — Source ledger  (2026-08-14)
Accepted (registered in `data/sources.json` with `credible`):

| key | what it is | why credible | reachable? |
|---|---|---|---|
| MICHELIN | Michelin Guide California | guide of record; stars + Bib Gourmand cover the South Bay | yes |
| INFATUATION | The Infatuation — Bay Area | widely-followed reviews with Peninsula/South-Bay guides | yes |
| KQED | KQED Bay Area food (Luke Tsai) | award-recognized Bay-Area food writer; genuine named editorial, uniquely regional | yes |
| SFCHRON | SF Chronicle Food | Bay Area paper of record | **blocked to crawler** |
| MERCURY | San Jose Mercury News | the Valley's daily of record — uniquely meaningful to the South Bay | **blocked to crawler** (Mercury articles surface via edition.pagesuite.com) |
| EATERSF | Eater SF | most-read Bay dining news/maps | **blocked to crawler** |
| ATLASOBSCURA | Atlas Obscura | curated, fact-checked oddities | yes |
| OFFICIAL / CASTATEPARKS / SJTOURISM / VISITCA | official site / parks / tourism | primary source for sights, hours, status | yes |
| YELP / TRIPADVISOR | review aggregators | **open-status verification only** — NOT a recommender. Any Yelp-only place is flagged for a creator/editorial upgrade (see `_PENDING_LEADS.md`). | yes |

**Expanded palette (2026-08-14, per repeated user directive "don't rely on Yelp — expand sources").**
Added a South-Bay local-of-record tier so agents stop defaulting to Yelp: **METROSV** (Metro Silicon
Valley + its "Best of Silicon Valley" reader poll — the region's alt-weekly of record), **SJSPOTLIGHT**
(San José Spotlight), **SIXFIFTY** (The Six Fifty), **PALOALTOONLINE**, **MTNVIEWVOICE**, plus reported
TV **NBCBAY**/**ABC7** and the **JAMESBEARD** awards authority. Standing rule, now codified in
`_AGENT_BRIEF.md` and RESUME.md acceptance: **Yelp/TripAdvisor are open-verification ONLY, never the
sole recommender** — exhaust the credible palette + vetted creators first; a place with only Yelp is held
in a needs-credible-source state, not shipped. Waves 1–3 predate the brief and left ~75+ Yelp-only food
entries (`_yelp_only_food.txt`); the **re-sourcing wave** upgrades each to a credible source or prunes it.

**Rejected** ([D1](../../docs/DECISIONS.md)): anonymous SEO listicles and content farms
(e.g. findindianrestaurants.com, generic "10 best…" aggregators) — no byline, unverifiable claims.
**Reachability finding (important, reproducible):** eater.com, sfchronicle.com, mercurynews.com,
thrillist.com, sfgate.com are **blocked to the WebSearch crawler** in this environment. Do not spend
searches on them; source via Michelin / Infatuation / KQED / official sites, and use Yelp/Google only
to confirm open-status + address. **Creators** (YouTube/TikTok/blog) are a first-class Stage-1 source
type but were **not yet discovered** — staged as a dedicated wave (task #24) with the vetting bar in
SOURCES.md §creators; results will register in `sources.json` creators + append here.

## Stage 2 — Extraction ledger
Provenance for every place is carried in its research file (`data/silicon-valley-research/*.json`) as
`sources:[[KEY, url/claim]]` + the `dish`/`w` notability hook. Summary by wave:

- **Wave 1 (2026-08-14) — 110 places** (65 sights + 45 food). Files: SIGHTS_TECH (17), SIGHTS_PARKS
  (19), SIGHTS_BIGTECH (14), SIGHTS_SCENES (20); VIETNAMESE (11), TAIWANESE_BOBA (8), INDIAN (5),
  EASTASIAN (6), FOOD_VIRAL (14 after dedup). Truncated by the 200/200 WebSearch cap mid-wave (several
  cuisines returned well below target — logged in `_PENDING_LEADS.md`).
- **Wave 2 (2026-08-14) — complete, +101 → 211 total** (87 sights + 124 food). Files: SIGHTS_SJ (23),
  INDIAN2 (22), CHINESE2 (20), KRJPSEA (18), CAFES_BOBA (21). Deep dives: South Indian canon,
  Chinese/Taiwanese/Sichuan/hot-pot, Korean/Japanese/Thai/Filipino/Burmese, San Jose + Peninsula
  sights, boba/coffee/bakery/dessert. Not truncated (budget had refreshed).

**Sourcing mix after wave 2 (food, 124 unique):** 48 editorial-sourced (Michelin / Infatuation / KQED)
· **75 YELP/TripAdvisor-only** — open-verified but lacking an editorial/creator *recommender*. This is
structural: the credible editorial domains (Eater/Chronicle/Mercury/Thrillist) are crawler-blocked and
Michelin/Infatuation don't reach most neighbourhood spots. **Remedy = the creator wave (task #24) +
re-sourcing**, targeting the exact list in `_yelp_only_food.txt`. Per user directive, Yelp-only never
stands as the final recommender — it is a placeholder until a vetted creator/editorial source is layered on.

## Stage 3 — Fact-check ledger  (2026-08-14)
Method: open/closed confirmed against a 2025/2026 source — the place's own site/socials, Google/Apple
"Permanently closed", or a news closing story; cuisine tagged to the kitchen's own tradition with a
named dish. **Exclusions found (kept out of the map, with reason):**

| place | reason | as of |
|---|---|---|
| Chez TJ (Mountain View, Michelin) | permanently closed | Apr 2026 |
| Iguanas Taqueria / Burritozilla (SJ) | closed, family retired | Jul 27 2025 |
| Cinnaholic (San Jose) | closed | 2025/26 |
| The Prolific Oven (Palo Alto) | closed | 2019 |
| Hermitage Brewing (San Jose) | out of business (Ch. 7) | 2025/26 |
| Godavari (Sunnyvale) | closed | per Yelp |
| Aachi Aappakadai (Sunnyvale) | closed | per Yelp |
| Orenchi Ramen (Santa Clara) | relocated to Los Altos Hills; used Ramen Nagi instead | 2024 |
| Happy Lemon (Cupertino) | closed | per Yelp |

**Wave-2 exclusions (2026-08-14):** Udupi Palace, Turmeric (Sunnyvale) · Aachi Aappakadai (Santa
Clara + Sunnyvale) · Red Chillies (Milpitas) · Boiling Point Cupertino/Vallco (used open SJ location) ·
Liou's House Milpitas (became Gangnam House) · Shanghai Flavor Shop (Sunnyvale) · Palace BBQ Buffet ·
Kappo Nami Nami (Mountain View, closed May 2026) · Amarin Thai old 174 Castro St (relocated to open 147
Castro St) · OneZo SJ · Tin Pot Creamery (Palo Alto + Los Altos) · Bellano/B2 Coffee · 85°C Milpitas ·
Happy Lemon Cupertino · Kee Wah Bakery Cupertino — all verified permanently closed / relocated, kept
off the map. Out-of-region look-alikes rejected (Class 302, Third Culture, Wushiland, Kevin's Noodle
House, etc.). No coordinates invented anywhere.

Vietnamese closed *branches* steered to the surviving open address (Com Tam Thien Huong Senter Rd;
Bun Bo Hue An Nam Tully Rd; Nem Nuong Nha Trang 1111 Story Rd). **Open-status flag:** the 5 Yelp-only
Vietnamese carry open-verification but not yet an editorial/creator recommender — upgrade pending.
Status is written to `data/geocodes.json` as pins land; `--statuscheck silicon-valley-ca` must stay
CONSISTENT.

## Stage 4 — Ranking ledger  (rubric set 2026-08-14)
Tiers **graded within each area and cuisine**, never globally ([METHODOLOGY](../../docs/METHODOLOGY.md)):
- **t1** unmissable / best-in-class for its area or cuisine (strong source consensus, category-defining,
  or a genuine icon) — e.g. Apple Park Visitor Center, Computer History Museum, Winchester, Stanford
  Dish; Vietnamese Pho Ha Noi; Michelin stars (Adega, Protégé, Plumed Horse).
- **t2** strong, clearly worth a stop, not the single best.
- **t3** notable/niche, single-source, or exterior-only (e.g. NVIDIA/Adobe/eBay campuses are t3 —
  striking but street-view only).
Per-place tier + reason is stored inline in each research file (`t` + `w`); deliberate calls (a
famous-but-exterior-only campus held at t3; a Yelp-only spot capped until upgraded) are noted here so a
future editor can disagree on purpose. Re-rank is re-run when a wave adds peers to an area/cuisine.

## Stage 5 — Location-verify ledger  (status: PENDING)
**0 / 110 geocoded so far.** Coordinates are NOT invented — every place is queued in
`tools/geocode-helper.html` (browser-side; does not use the WebSearch budget). As pins land they are
recorded in `data/geocodes.json` with `source` (the URL/DB read), `confidence` high/med/low, and
`verified` date, reading `!3d!4d`/Apple `coordinate=` place pins — never the `/@` viewport
([METHODOLOGY 4a/4b](../../docs/METHODOLOGY.md)). `--geocheck silicon-valley-ca` must PASS before build.

## Stage 6 — Build & gate  (status: PENDING pins)
`consolidate.py → build-siliconvalley.py → cities/siliconvalley.html`, held until pins exist. Gates
required: geocheck PASS · statuscheck CONSISTENT · validate DATA OK · npm test ALL PASS · headless
render-verify (Leaflet mounts, markers > 0, 0 JS errors).

---
### Refresh protocol (when re-checking a live SV)
Re-run Stage 3 (status) and Stage 5 (location) on the current set, append a dated section here, and
re-pass the gates. These two ledgers are the ones that rot.
