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
- **Wave 3 (2026-08-14) — food+sights complete, +74 → 285 total** (110 sights + 175 food). Files:
  MEXICAN (19; LUNA=Michelin Bib, 4 Infatuation), AMERICAN (16), PERSIAN_VN2 (16; Shalizaar=Michelin,
  Rose Market=KQED), SIGHTS_DEEP (23; PA/MV/SUN/CU/SC gardens+museums + 10 day trips: Pigeon Point,
  Natural Bridges, Mystery Spot, Wilder Ranch, Roaring Camp, Mount Umunhum, Mavericks, Pinnacles).
  Creator pass still running. **Launched pre-`_AGENT_BRIEF`, so the food is Yelp-heavy → re-sourcing
  wave (task #26).** Wave-3 exclusions (verified closed): Pampas, Fiesta del Mar, Tu Mero Mole, El Faro
  (SF not SB), Armadillo Willy's (SCC locations), Uncle Frank's, Salang Pass, Little Kabul Market,
  Vung Tau II.
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

## Stage 6 — Build & gate  (status: PENDING pins + re-sourcing)
`consolidate.py → build-siliconvalley.py → cities/siliconvalley.html`, held until pins exist AND the
sourcing gate passes. Gates required — **enforced in code, verifiable, not asserted**:
- **`node tools/research.js --sourcecheck silicon-valley-ca`** — multiple sources of truth. Rule (in code,
  all three checkers agree): a place PASSES with **≥2 credible sources**, OR a single **institutional
  authority** (Michelin / James Beard) — a vetted listing that is ground truth on its own; a lone
  *editorial* source (Infatuation/KQED/local paper) still needs a 2nd. Yelp/TripAdvisor = 0.
  - Baseline 2026-08-14: 106 PASS / 60 single / 119 Yelp-only.
  - After re-sourcing waves 1+2 (+139 source rows, 4+2 agents): **170 PASS / 48 single-editorial /
    67 Yelp-only** — 43 distinct credible outlets now in use (was 3). Still FAIL by 115; the held places
    stay in research (not deleted) for future 2nd-sourcing, and the build gate drops them meanwhile.
    Confirmed diminishing returns: ~74 places (chains/boba) have no credible coverage that exists.
- `build-siliconvalley.py` **GATE 1** drops-and-logs any place with <2 credible sources, **GATE 2** drops
  any place without a sourced pin — so the published page provably contains only corroborated, located places.
- geocheck PASS · statuscheck CONSISTENT · validate DATA OK · npm test ALL PASS · headless render-verify.

---
### Refresh protocol (when re-checking a live SV)
Re-run Stage 3 (status) and Stage 5 (location) on the current set, append a dated section here, and
re-pass the gates. These two ledgers are the ones that rot.

---
## 2026-10-17 — QC: Yelp-only records (orchestrator: "Yelp shown as a recommender")

**The gate is correct.** `--sourcecheck silicon-valley-ca` counts YELP/TRIPADVISOR as 0. `build-siliconvalley.py` GATE 1 drops every record with fewer than 2 credible sources, so **none of the 67 Yelp-only records were on the live page**. The Yelp mentions the beta showed sit on records that already pass on two or more credible sources, where Yelp appears as a measurement. FE-B handles that rendering.

**Re-sourcing wave 3.** This was 25 sequential WebSearches on 2026-10-17: the tier-1 Yelp-only records first, then category round-ups (Vietnamese, Indian, boba, Chinese, tacos). The evidence lives in `_resourced_qc20261017.json` (gitignored, like earlier waves) and is merged into the research files.

| place | added | URL | result |
|---|---|---|---|
| Roy's Station Coffee & Tea | SJPL + RAFU | sjpl.org pre-war service stations blog; Rafu Shimpo obituary of Roy Murotsune (2021) | **PASS**, 2 credible. Held only by GATE 2 (no pin yet); queued for location-verify. |
| The Table | FOODGAL | foodgal.com/?p=27729 (Carolyn Jung) | 1 editorial; held by GATE 1 |
| Anjappar Chettinad (Milpitas) | SFCHRON | sfchronicle.com "Silicon Valley's Chettinad food is as fragrant…" | 1 editorial; held |
| Hokkaido Ramen Santouka | SJTOURISM | sanjose.org listing | 1; held |
| Seorai Korean BBQ | DISCOVERSC | discoversantaclara.org Korean Food Trail | 1; held |

**No credible recommender found (18)**, now in `_prune_candidates.json`: LB Steak, Red Rock Coffee, Coffee & Water Lab, Icing on the Cake, Saravanaa Bhavan, UlavacharU, SGD Tofu House, Kaita, Taqueria El Grullense, Inka's, Banh Cuon Tay Ho, Com Tam Thien Huong, Rene-Rose Island Cuisine, Haidilao, Hunan Impression, Xian Kitchen, Shanghai Delight, Cheung Hing.
- What turned up was only listings, aggregators, forums and student papers.
- The Infatuation reviews of a *different* El Grullense (Palo Alto) and a *different* So Gong Dong were not counted.

**Counts after the wave:** 171 PASS / 52 single-editorial / **62 Yelp-only** (was 67). That is a third wave of diminishing returns, after the 2026-08-14 waves found the same.

**Remaining Yelp-only: 62.** They are not shown, since GATE 1 drops them, and they stay in research marked as not meeting the source bar. Most are chains or boba shops: 85C, Boba Guys, Meet Fresh, Sharetea, Paris Baguette, Haidilao, Saravanaa Bhavan, Paradise Biryani and others. The merit bar treats a chain with no editorial coverage as a drop.

**Recommendation:** formally prune these 62 from the research set, or leave them held. That's the orchestrator's or owner's call. Further density should come from places credible lists already name (Michelin, Infatuation, KQED, Metro Best-of), per RESUME.md, not from re-sourcing Yelp finds again.

### Rejected — no credible recommender after 3 waves (2026-08-14, 2026-08-14, 2026-10-17)

Orchestrator decision, 2026-10-17: prune these from research with an audit trail.
- They were **never on the live page**, because GATE 1 dropped them, so the guide does not change.
- They are removed from the dataset through `_rejected_no_credible.json`, which `consolidate.py` skips. The research records stay in place, so they can be found again.
- To re-admit one: add a credible source (URL) to its research record, remove its name from `_rejected_no_credible.json`, and re-run consolidate and the gates.

| place | area | tier | address | reason |
|---|---|---|---|---|
| LB Steak | SJ | t1 | 334 Santana Row #1000, San Jose, CA 95128 | wave-3 targeted search found only listings/aggregators/forums |
| Pacific Catch | SJ | t3 | 1875 S Bascom Ave #550, Campbell, CA 95008 | chain/franchise outlet with no local editorial coverage; no credible coverage found in waves 1-2 (2026-08-14) or the wave-3 category round-ups (2026-10-17) |
| Stacks | SJ | t2 | 139 E Campbell Ave, Campbell, CA 95008 | chain/franchise outlet with no local editorial coverage; no credible coverage found in waves 1-2 (2026-08-14) or the wave-3 category round-ups (2026-10-17) |
| Los Gatos Cafe | SJ | t2 | 340 N Santa Cruz Ave, Los Gatos, CA 95030 | no credible coverage found in waves 1-2 (2026-08-14) or the wave-3 category round-ups (2026-10-17) |
| Crepevine | PA | t2 | 367 University Ave, Palo Alto, CA 94301 | chain/franchise outlet with no local editorial coverage; no credible coverage found in waves 1-2 (2026-08-14) or the wave-3 category round-ups (2026-10-17) |
| Barbara's Fishtrap | DAY | t2 | 281 Capistrano Rd, Half Moon Bay, CA 94019 | no credible coverage found in waves 1-2 (2026-08-14) or the wave-3 category round-ups (2026-10-17) |
| Boba Guys | PA | t1 | 855 El Camino Real #120, Palo Alto, CA 94301 | chain/franchise outlet with no local editorial coverage; no credible coverage found in waves 1-2 (2026-08-14) or the wave-3 category round-ups (2026-10-17) |
| 85C Bakery Cafe | CU | t1 | 19459 Stevens Creek Blvd #100, Cupertino, CA 95014 | chain/franchise outlet with no local editorial coverage; no credible coverage found in waves 1-2 (2026-08-14) or the wave-3 category round-ups (2026-10-17) |
| Meet Fresh | CU | t1 | 19449 Stevens Creek Blvd Ste 120, Cupertino, CA 95014 | chain/franchise outlet with no local editorial coverage; no credible coverage found in waves 1-2 (2026-08-14) or the wave-3 category round-ups (2026-10-17) |
| Ume Tea | SJ | t2 | 4750 Almaden Expy Ste 136, San Jose, CA 95118 | chain/franchise outlet with no local editorial coverage; no credible coverage found in waves 1-2 (2026-08-14) or the wave-3 category round-ups (2026-10-17) |
| Tea Top | SJ | t3 | 6158 Bollinger Rd, San Jose, CA 95129 | chain/franchise outlet with no local editorial coverage; no credible coverage found in waves 1-2 (2026-08-14) or the wave-3 category round-ups (2026-10-17) |
| iTea | SJ | t3 | 2936 Aborn Square Rd, San Jose, CA 95121 | chain/franchise outlet with no local editorial coverage; no credible coverage found in waves 1-2 (2026-08-14) or the wave-3 category round-ups (2026-10-17) |
| Sharetea | SJ | t3 | 1728 Hostetter Rd Ste 30, San Jose, CA 95131 | chain/franchise outlet with no local editorial coverage; no credible coverage found in waves 1-2 (2026-08-14) or the wave-3 category round-ups (2026-10-17) |
| Red Rock Coffee | MV | t1 | 201 Castro St, Mountain View, CA 94041 | wave-3 targeted search found only listings/aggregators/forums |
| Coffee & Water Lab | SJ | t1 | 603 Saratoga Ave #40, San Jose, CA 95129 | wave-3 targeted search found only listings/aggregators/forums |
| Icing on the Cake | DAY | t1 | 50 W Main St, Los Gatos, CA 95030 | wave-3 targeted search found only listings/aggregators/forums |
| Cocola Bakery | SJ | t2 | 333 Santana Row #1045, San Jose, CA 95128 | chain/franchise outlet with no local editorial coverage; no credible coverage found in waves 1-2 (2026-08-14) or the wave-3 category round-ups (2026-10-17) |
| Sheng Kee Bakery | CU | t2 | 10961 N Wolfe Rd, Cupertino, CA 95014 | chain/franchise outlet with no local editorial coverage; no credible coverage found in waves 1-2 (2026-08-14) or the wave-3 category round-ups (2026-10-17) |
| Paris Baguette | SC | t2 | 3159 Mission College Blvd, Santa Clara, CA 95054 | chain/franchise outlet with no local editorial coverage; no credible coverage found in waves 1-2 (2026-08-14) or the wave-3 category round-ups (2026-10-17) |
| Matcha Cafe Maiko | SC | t2 | 2855 Stevens Creek Blvd Ste 9254, Santa Clara, CA 95050 | chain/franchise outlet with no local editorial coverage; no credible coverage found in waves 1-2 (2026-08-14) or the wave-3 category round-ups (2026-10-17) |
| Boiling Point | SJ | t2 | 1698 Hostetter Rd, Ste E, San Jose, CA 95131 | chain/franchise outlet with no local editorial coverage; no credible coverage found in waves 1-2 (2026-08-14) or the wave-3 category round-ups (2026-10-17) |
| Happy Lamb Hot Pot | CU | t2 | 19062 Stevens Creek Blvd, Cupertino, CA 95014 | chain/franchise outlet with no local editorial coverage; no credible coverage found in waves 1-2 (2026-08-14) or the wave-3 category round-ups (2026-10-17) |
| Yummy Kitchen (Wen Xiang Ju) | SJ | t2 | 1711 Branham Ln, San Jose, CA 95118 | no credible coverage found in waves 1-2 (2026-08-14) or the wave-3 category round-ups (2026-10-17) |
| Shanghai Delight | SC | t2 | 218 Barber Ct, Milpitas, CA 95035 | wave-3 targeted search found only listings/aggregators/forums |
| Mr. Bao Kitchen | MV | t2 | 357 Castro St, Mountain View, CA 94041 | no credible coverage found in waves 1-2 (2026-08-14) or the wave-3 category round-ups (2026-10-17) |
| Shang Cafe | SJ | t2 | 6154 Bollinger Rd, San Jose, CA 95129 | no credible coverage found in waves 1-2 (2026-08-14) or the wave-3 category round-ups (2026-10-17) |
| Xian Kitchen | SC | t2 | 300 Barber Ct, Milpitas, CA 95035 | wave-3 targeted search found only listings/aggregators/forums |
| Xiang Xiang Noodle | SUN | t2 | 1115 Tasman Dr, Ste 2228, Sunnyvale, CA 94089 | no credible coverage found in waves 1-2 (2026-08-14) or the wave-3 category round-ups (2026-10-17) |
| Hunan Impression | SJ | t2 | 5152 Moorpark Ave, Ste 30, San Jose, CA 95129 | wave-3 targeted search found only listings/aggregators/forums |
| Haidilao Hot Pot | CU | t1 | 19409 Stevens Creek Blvd, Ste 100, Cupertino, CA 95014 | chain/franchise outlet with no local editorial coverage; wave-3 targeted search found only listings/aggregators/forums |
| Tasty Pot | SC | t3 | 222 Barber Ct, Milpitas, CA 95035 | chain/franchise outlet with no local editorial coverage; no credible coverage found in waves 1-2 (2026-08-14) or the wave-3 category round-ups (2026-10-17) |
| Cheung Hing (Milpitas) | SC | t2 | 1235 E Calaveras Blvd, Milpitas, CA 95035 | wave-3 targeted search found only listings/aggregators/forums |
| Hunan House | SUN | t3 | 122 S Sunnyvale Ave, Sunnyvale, CA 94086 | no credible coverage found in waves 1-2 (2026-08-14) or the wave-3 category round-ups (2026-10-17) |
| Saravanaa Bhavan | SUN | t1 | 1305 S Mary Ave, Sunnyvale, CA 94087 | chain/franchise outlet with no local editorial coverage; wave-3 targeted search found only listings/aggregators/forums |
| UlavacharU | SUN | t1 | 685 E El Camino Real, Sunnyvale, CA 94087 | chain/franchise outlet with no local editorial coverage; wave-3 targeted search found only listings/aggregators/forums |
| Sri Ananda Bhavan (Sunnyvale) | SUN | t2 | 920 E Arques Ave, Sunnyvale, CA 94085 | chain/franchise outlet with no local editorial coverage; no credible coverage found in waves 1-2 (2026-08-14) or the wave-3 category round-ups (2026-10-17) |
| Bagara's | SUN | t2 | 594 E El Camino Real, Sunnyvale, CA 94087 | no credible coverage found in waves 1-2 (2026-08-14) or the wave-3 category round-ups (2026-10-17) |
| Kovai Cafe | SJ | t2 | 1136 S De Anza Blvd, Ste B, San Jose, CA 95129 | no credible coverage found in waves 1-2 (2026-08-14) or the wave-3 category round-ups (2026-10-17) |
| Paradise Biryani Pointe (Santa Clara) | SC | t2 | 2961 El Camino Real, Santa Clara, CA 95051 | chain/franchise outlet with no local editorial coverage; no credible coverage found in waves 1-2 (2026-08-14) or the wave-3 category round-ups (2026-10-17) |
| Surya Darshini Dosa Cafe | SC | t2 | 691 S Milpitas Blvd, Ste 131, Milpitas, CA 95035 | no credible coverage found in waves 1-2 (2026-08-14) or the wave-3 category round-ups (2026-10-17) |
| Inchin's Bamboo Garden (Sunnyvale) | SUN | t2 | 151 W Washington Ave, Sunnyvale, CA 94086 | chain/franchise outlet with no local editorial coverage; no credible coverage found in waves 1-2 (2026-08-14) or the wave-3 category round-ups (2026-10-17) |
| Avachi Biryani House | CU | t2 | 10251 S De Anza Blvd, Cupertino, CA 95014 | no credible coverage found in waves 1-2 (2026-08-14) or the wave-3 category round-ups (2026-10-17) |
| Delhiwala Chaat | SUN | t2 | 590 Old San Francisco Rd, Sunnyvale, CA 94086 | no credible coverage found in waves 1-2 (2026-08-14) or the wave-3 category round-ups (2026-10-17) |
| SGD Tofu House (So Gong Dong) | SC | t1 | 3450 El Camino Real #105, Santa Clara, CA 95051 | wave-3 targeted search found only listings/aggregators/forums |
| Tapsilog Bistro | SJ | t2 | 819 W Hamilton Ave, Campbell, CA 95008 | no credible coverage found in waves 1-2 (2026-08-14) or the wave-3 category round-ups (2026-10-17) |
| Thaibodia Bistro | SJ | t2 | 2200 S Bascom Ave, Campbell, CA 95008 | no credible coverage found in waves 1-2 (2026-08-14) or the wave-3 category round-ups (2026-10-17) |
| Kunjip | SC | t2 | 1066 Kiely Blvd, Santa Clara, CA 95051 | chain/franchise outlet with no local editorial coverage; no credible coverage found in waves 1-2 (2026-08-14) or the wave-3 category round-ups (2026-10-17) |
| Rene-Rose Island Cuisine | SUN | t1 | 621 Caliente Dr, Sunnyvale, CA 94085 | wave-3 targeted search found only listings/aggregators/forums |
| Gen Korean BBQ House | SJ | t2 | 1554 Saratoga Ave, San Jose, CA 95129 | chain/franchise outlet with no local editorial coverage; no credible coverage found in waves 1-2 (2026-08-14) or the wave-3 category round-ups (2026-10-17) |
| Kaita Restaurant | SJ | t1 | 215 Jackson St, San Jose, CA 95112 | wave-3 targeted search found only listings/aggregators/forums |
| Taqueria El Grullense | SJ | t1 | 1175 E Julian St Ste 5, San Jose, CA 95116 | wave-3 targeted search found only listings/aggregators/forums |
| Jalisco Taqueria | SJ | t2 | 401 S King Rd, San Jose, CA 95116 | no credible coverage found in waves 1-2 (2026-08-14) or the wave-3 category round-ups (2026-10-17) |
| El Camaron de Sinaloa | SJ | t2 | 245 Willow St, San Jose, CA 95110 | no credible coverage found in waves 1-2 (2026-08-14) or the wave-3 category round-ups (2026-10-17) |
| Inka's Restaurant | SJ | t1 | 700 S Winchester Blvd Ste 25, San Jose, CA 95128 | wave-3 targeted search found only listings/aggregators/forums |
| Pupuseria Delmy | SJ | t2 | 3039 Monterey Rd, San Jose, CA 95111 | no credible coverage found in waves 1-2 (2026-08-14) or the wave-3 category round-ups (2026-10-17) |
| Falafel STOP | SUN | t2 | 1325 Sunnyvale Saratoga Rd, Sunnyvale, CA 94087 | no credible coverage found in waves 1-2 (2026-08-14) or the wave-3 category round-ups (2026-10-17) |
| Banh Cuon Tay Ho | SC | t1 | 2047 El Camino Real, Santa Clara, CA 95050 | wave-3 targeted search found only listings/aggregators/forums |
| Bambu Dessert & Drinks | SC | t3 | 89 S Park Victoria Dr, Milpitas, CA 95035 | chain/franchise outlet with no local editorial coverage; no credible coverage found in waves 1-2 (2026-08-14) or the wave-3 category round-ups (2026-10-17) |
| Cam Hung Sandwich and Coffee | SUN | t2 | 903 Reed Ave, Sunnyvale, CA 94086 | no credible coverage found in waves 1-2 (2026-08-14) or the wave-3 category round-ups (2026-10-17) |
| Com Tam Thien Huong | SJ | t1 | 909 Story Rd, Unit 100, San Jose, CA 95122 | wave-3 targeted search found only listings/aggregators/forums |
| Anh Hong | SJ | t2 | 1818 Tully Rd, Ste 150, San Jose, CA 95122 | no credible coverage found in waves 1-2 (2026-08-14) or the wave-3 category round-ups (2026-10-17) |
| Nem Nuong Nha Trang | SJ | t3 | 919 Story Rd, Ste 1100, San Jose, CA 95122 | no credible coverage found in waves 1-2 (2026-08-14) or the wave-3 category round-ups (2026-10-17) |
