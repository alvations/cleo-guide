# San Francisco & Peninsula — audit trail

Follows `docs/PIPELINE.md`: discover sources → extract places → fact-check → re-rank → location-verify →
build. Every stage recorded here so any agent can reproduce or continue. Mirrors the SV audit.

## Stage 0 — Scaffold  (status: DONE 2026-08-14)
Region = SF proper + northern Peninsula to San Mateo + SFO corridor (bridges the SV guide at Menlo
Park/Redwood City). Built: `consolidate.py` (9 areas DTN/NECN/NOB/NW/AVE/MIS/HAI/SE/PEN; SF cuisine
taxonomy incl. Cantonese/dim sum, Mission Mexican, Burmese, seafood, North Beach Italian, third-wave
coffee; collections incl. WATER waterfront/piers); `tools/build-sanfrancisco.py` (clone of the SV
build — same GATE 1 sources-of-truth + GATE 2 geocode drops); `data/sources.json` san-francisco-ca
entry with 11 credible SF outlets (Michelin, James Beard, Infatuation, KQED, SF Standard, Hoodline,
Mission Local, 7x7, The Bold Italic, Time Out, Atlas Obscura); `_AGENT_BRIEF.md`; research.js
PAGE_FOR + DATASET_FOR; geocodes.json empty entry; index.html "being built" card.

## Stage 1 — Source discovery  (status: registry seeded)
Credible palette registered (see sources.json). Crawler-BLOCKED (cite only if a title surfaces):
EATERSF, SFCHRON, THRILLIST. Rule (same as SV): Yelp/TripAdvisor = open-verification only, never the
sole recommender; exhaust the credible palette + vetted creators first.

## Stage 2 — Place extraction  (status: IN PROGRESS)
Signature-first food canon + comprehensive sights, each with a full address for geocoding.

**Wave 1 (2026-08-14) — 86 places, `--sourcecheck` PASS 86/86 (0 Yelp-only, 0 single-source).** The
agents followed `_AGENT_BRIEF.md` from the start, so SF sourcing is clean out of the gate (no SV-style
re-sourcing backlog).
- `FOOD_SIGNATURE.json` (18): Mission-burrito belt, old-SF cioppino/crab, Hog Island oysters,
  Boudin/Tartine sourdough, Buena Vista Irish coffee, fortune-cookie factory, It's-It. Closed & flagged:
  The Mill (June 2026 fire).
- `FOOD_ASIAN.json` (22): Cantonese/dim sum (Mister Jiu's ★, Yank Sing Bib, R&G…), Sichuan (Z&Y Bib),
  Vietnamese, Burmese (Mandalay JB), JP/KR/Thai/Filipino (Rintaro Bib, Abacá ★). Excluded closed:
  HK Lounge II (burned 2019) → successor HK Lounge Bistro used; Turtle Tower moved to FiDi.
- `SIGHTS_ICONS.json` (18): Golden Gate, Alcatraz, cable cars, Ferry Building, Coit Tower, Lombard,
  Painted Ladies, Transamerica, Musée Mécanique, Fort Point, Maritime NHP. Caveats: Hyde St Pier
  rebuild, cable-car rehab shuttles.
- `SIGHTS_MUSEUMS_PARKS.json` (28): GG Park museums/gardens, SFMOMA, Exploratorium, Presidio, Mission
  murals, Lands End, Castro Theatre (reopened Feb 2026). Closed & flagged: Contemporary Jewish Museum.
  Excluded closed: Museum of Ice Cream, Cartoon Art Museum.

**Wave 2 (2026-08-14) — +62 → 148 total, `--sourcecheck` PASS 148/148 (5 on lone Michelin/JB).**
- `FOOD_ITALIAN_CALI.json` (25): North Beach Italian (Tony's, Golden Boy, Molinari, Original Joe's,
  Tosca), Cal-cuisine/Michelin (State Bird, Zuni, Nopa, Acquerello, Gary Danko, Californios, Kokkari),
  gap fills Bansang (KR Bib)/Besharam (IN)/Naides (Filipino Bib)/Bi-Rite. Excluded closed: DOSA, Petit
  Crenn, Café Jacqueline, Bistro Aix (the classic French rooms are largely shuttered).
- `FOOD_COFFEE_BARS.json` (17): third-wave coffee (Blue Bottle Ferry Bldg, Ritual, Sightglass, Four
  Barrel, Saint Frank, Andytown), cocktail bars (Trick Dog, Smuggler's Cove, Bourbon & Branch, PCH),
  viral bakeries (Arsicault, b. Patisserie). Excluded closed: Blue Bottle Mint Plaza, Trouble, Whitechapel.
- `PENINSULA_SFO.json` (20 = 9 food + 11 sights): fills the PEN area — The Kitchen (Millbrae dim sum),
  Daly City Filipino (Fil-Am, Chibog, Bread Basket), Wakuriya (San Mateo ★), Ramen Dojo, Rasa; SFO
  Aviation Museum, Sign Hill, San Bruno Mtn, Sweeney Ridge, CuriOdyssey, Pacifica Pier, Devil's Slide,
  Mori Point, Mussel Rock. Kept-flagged closed: Wursthall, PEZ Museum. Excluded closed: HK Flower
  Lounge & Zen Peninsula (the famous Millbrae dim sum halls are gone). Stops at San Mateo (SV seam).

**Full set: 148 places (57 sights + 91 food).** Cuisine spread: Cantonese 11, US/Cal 15, Italian 9,
bars 8, bakery 8, SEAsian 7, seafood 7, coffee 7, Mexican 5, Japanese 4, Vietnamese 4, Burmese 3,
dessert 3, Korean 2, Indian 2. Closed-flagged: PEZ Museum, Contemporary Jewish Museum, The Mill, Wursthall.

## Stage 5 — Location-verify  (status: DONE 2026-08-14)
Geocoded 148 places in 4 WebSearch waves — **141 verified pins (113 high / 27 med / 1 low), 7 UNVERIFIED**
(budget capped at the end: Boudin Bakery, It's-It, Restaurant Naides, Chibog, The Bread Basket, Basque
Cultural Center + closed Wursthall). SF geocoded far cleaner than SV (sights resolve via Wikipedia coords;
restaurants at least to address-level). Pins read from `!3d!4d`/Apple `coordinate=`/Wikipedia, never a
viewport; all sanity-checked to SF (~37.75-37.81) / Peninsula (~37.52-37.69) bounds. The 7 UNVERIFIED are
in `docs/GEOCODE-BACKLOG.md` for the browser-helper pass. Reconciled 2 closures to the `— CLOSED` naming
convention + `closed` registry status (Contemporary Jewish Museum, The Mill).

## Stage 6 — Build & gate  (status: DONE + LIVE 2026-08-14)
`build-sanfrancisco.py` → `cities/sanfrancisco.html`, **141 places (57 sights + 84 food)**. Gates:
**geocheck PASS** (113 high/27 med/1 low) · **statuscheck CONSISTENT** (3 closed flagged: PEZ, Contemporary
Jewish Museum, The Mill) · **sourcecheck PASS** · **jsdom render-verify ALL PASS** (57 markers, 0 JS errors,
degrades w/o CDN). index.html card relinked to live. Deploy branch = repo default → live on next Pages build.
Residual: 7 UNVERIFIED food/Peninsula pins → browser helper (`docs/GEOCODE-BACKLOG.md`).

## Stage 3 — Fact-check (open/closed + notability)  ·  Stage 4 — Re-rank  ·  Stage 5 — Location-verify
·  Stage 6 — Build & gate  — all PENDING. Gates (enforced in code): `--sourcecheck` (≥2 credible or
lone Michelin/JB), `--geocheck`, `--statuscheck`, jsdom render-verify.

---
# 2026-10-02 MODERNISATION RUN (dedicated SF session; WebSearch budget ~200; WebFetch blocked)

## Stage M1 — plumbing (DONE)
`tools/density.py` RDIR += `san-francisco-ca`; `<!-- CARD:san-francisco-ca -->` markers on the hub card; helpers
`_sf_add.py` (dedup-append), `_sf_geo.py` (geoout append; null coords forced UNVERIFIED), `_sf_mich.py` (Michelin-listing
records + status stubs), `_sf_push.sh`, `_sf_counts.sh`; RESUME `## Targets` (sum 500). `rebuild-city.py` already had the key.

## Stage 2-R — credibility & key-hygiene audit of the 148 existing records (offline review + 1 search) — `_sf_fix_m2.py`
Reviewed every record's source keys against: ≥2 credible or lone Michelin/JB award; Yelp/TA/Google/OpenTable = 0;
lone-authority keys only for the award itself. Result — **0 dropped, 8 corrected** (all still pass):
- **San Tung**: `SEVENXSEVEN` pointed at an axios.com URL → relabelled `AXIOS`.
- **Burma Love**: `SFGATE` pointed at sfstation.com → `SFSTATION` (+ Mission Local remains).
- **b. Patisserie**: `JAMESBEARD` cited a bakemag.com trade article → `BAKEMAG` (editorial; Infatuation remains).
- **Abacá**: `JAMESBEARD` cited a vogue.ph feature → `VOGUEPH` (editorial); Michelin listing remains (lone-OK).
- **Foreign Cinema**: `JAMESBEARD` cited the restaurant's own about-page → `OFFICIAL` (self-claim, not an award
  source). Still has Infatuation; flagged for a 2nd independent source in a later wave.
- **Mandalay Restaurant**: `JAMESBEARD` previously cited a Wikipedia URL → verified: **JBF America's Classics 2024**
  (Hoodline 2024-02, KRON4); now JAMESBEARD + HOODLINE + KRON4 + WIKIPEDIA.
- **Restaurant Naides**: **first Michelin star, 2026 guide** (sfist 2026-06-25) → MICHELIN_STAR; superseded Bib removed.
- **Californios**: **three Michelin stars (2026)** noted in the blurb.
Held as weak-but-passing (re-source when budget allows): Chibog (KQED generic URL), Basque Cultural Center
(OFFICIAL + Patch), The Stinking Rose / Boudin / Buena Vista (Wikipedia + official — historic icons, kept).

## Stage 3-R — closure sweep (Aug→Oct 2026)
Searches: "SF restaurant closures September 2026", "… August 2026". Found: **Prelude** (333 Battery St, Michelin-listed,
closed 2026-09-19 — whatnow.com) → NOT added (non-notable, 2-yr run; MEASURED & DROPPED). **Central Kitchen** (closed)
— not in set. **We Be Sushi** (closed Feb 2026) — not in set. **Serpentine** (2495 3rd St) closed; the address is now
**Wolfsbane** (Michelin ★ 2026). **Café Jacqueline**: still has a Michelin page but was already logged closed in wave 2
— proof a Michelin page alone is NOT open-proof; not added. None of the 148 existing records surfaced as closed.

## Stage 6-W3 — FOOD-FIRST discovery, wave W3A/W3B (Michelin channel)
Method: `guide.michelin.com`-restricted searches by SF ZIP code (`"Michelin Guide restaurant San Francisco 941xx"`) —
each returns 4–9 venue pages with the guide's own address + cuisine; Michelin listing/star/Bib = lone institutional
authority (key hygiene: MICHELIN / MICHELIN_BIB / MICHELIN_STAR = the listing/award only). Stars cross-checked against
the 2026 star list (sfist 2026-06-25). Status = current Michelin listing (checked 2026-10-02) + closure sweep above.
- `FOOD_W3A.json` (16): 2026 stars (Atelier Crenn, Benu, Quince ★★★; Saison, Lazy Bear, Birdsong, Kiln, Sons &
  Daughters ★★) + Bibs (Okane, Outerlands, Flores, Good Good Culture Club, Trestle, Dumpling Home, Del Popolo, A16).
- `FOOD_W3B.json` (37 so far): ZIPs 94110/94103/94107/94109/94118/94133/94102/94115/94122/94111/94108/94117/94114.
- Held (no full street address in results): Lord Stanley, La Folie, Fiorella, Lapaba, Lynx, Hinodeya, Waraku, Nari,
  Hai Ky Mi Gia (707 Ellis — single source SF Standard), Udon Mugizo (single source Infatuation), Long Bridge Pizza.
- Pins: restaurant place-pins are rarely in search snippets — Atelier Crenn pinned (latlong.net POI); the rest are
  recorded with address + status and `UNVERIFIED` coords (gate holds them) pending a pin wave / the browser helper.
- W3B cont. (searches 29–58): 94123/94121/94105, Peninsula (San Mateo/Millbrae/Burlingame/San Bruno), cuisine
  sweeps (Thai/Vietnamese, Chinese/Sichuan, Mexican, Bib list) → +16 (FOOD_W3B now 53). Michelin venue pages expose
  **place-pin lat/lng** in search summaries: 4 names/query (`"A; B; C; D San Francisco restaurant latitude longitude"`,
  allowed_domains guide.michelin.com) → Benu, Quince, Saison, Lazy Bear, Wolfsbane pinned (high). Background pin
  agent A (≤18 searches) launched for the remaining 61 Michelin records → `geo/_pinA_raw.json`.
  Held: Mabel's Gone Fishing, Lord Stanley, La Folie, Fiorella, Bird & Buffalo, Palette Tea House, Ngon, Kan Kiin,
  Tasty Place (2025 listing only — status unclear), Dol Ho (808 Pacific — single source), Arizmendi Valencia,
  Jane the Bakery (no address), Crab House at Pier 39 / Cioppino's (only self-published sources — rejected).
- `SIGHTS_W3A.json` (9; 5 pinned via Wikipedia published coords): Oracle Park, Salesforce Park (pin = Transit
  Center, med), Yerba Buena Gardens, Chase Center, Sutro Heights Park, Lyon Street Steps, Tank Hill, Seward Street
  Slides, Blue Heron (Stow) Lake. Sources: SF Travel / NPS / AFAR / Mental Floss + Wikipedia. Held single-source:
  SF Columbarium, Vulcan Stairway (Mental Floss only); City Hall / Old Mint (Wikipedia only so far).
- SE wave (searches 59–62): `SIGHTS_W3A` +4 — Crane Cove Park, Heron's Head Park (pin = 3-decimal Wikipedia coords →
  med), Bayview Opera House, India Basin Shoreline Park (unpinned). Bayview food: **Auntie April's found CLOSED**
  (Infatuation) → not added; Gumbo Social (5176 3rd St), Old Skool Cafe (1429 Mendell St), Limon Rotisserie,
  Bayview Oyster Bar held — only one clearly-attributable credible source each (Infatuation).
- James Beard channel (searches 63–66; axios 2026-01-23 + 2025-01-22 semifinalist lists = award source, lone-OK):
  `FOOD_W3C.json` +5 — Ernest, Dalida (both pinned from Michelin venue pages), Lunette, House of Prime Rib, The
  Valley Club. JB 2026 semifinalist award entries added to existing Foreign Cinema (now properly sourced — replaces
  the self-claim), Smuggler's Cove, PCH, The Progress, The Morris, Nightbird, Sons & Daughters, Mijoté, Quince,
  State Bird Provisions (re-rank evidence). Held: The Happy Crane, The Anchovy Bar (no address found).
- **Pin agent A** (18 searches): 56/61 Michelin pins; +4 San Mateo pins it withheld only because MY bounding box was
  too tight (lng −122.35; San Mateo is −122.32) — addresses matched → accepted high; Nari pin returned twice from its
  venue page without an address echo → med. A16's JOINPEARL (aggregator) source replaced by its Michelin Bib page.

## Stage 6 — BUILD #1 of this run (2026-10-02)
`rebuild-city.py san-francisco-ca --build`: **235 researched → 218 rendered (65 sights + 153 food)** (was 141).
sourcecheck PASS 235/235 (57 on a lone Michelin/JB authority) · geocheck PASS · statuscheck CONSISTENT · buildcheck
PASS · npm validate DATA OK · npm test ALL PASS. 17 held UNVERIFIED (gate drops them). Card + CITIES row refreshed.
- Searches 85–104: Eater SF 38 (May-2024 edition, via a reproduction — EATERSF used only as a 2nd source on
  Michelin-listed places), Chronicle Top 100 (no list surfaced — names only), creator query #1 (Mark Wiens /
  Strictly Dumpling SF — **no findable SF piece surfaced → no creator attached**), old-UNVERIFIED pin retry (Boudin
  coord came only from frankiapp/Airbnb aggregators → REJECTED, stays UNVERIFIED; Basque Cultural Center found on
  KQED Check Please). Michelin lookups of non-Michelin Eater names fail (lesson: the venue-page pin trick only
  works for Michelin-listed names). +Friends Only, Delfina (W3C), Miller & Lux, Via Aurelia, Kan Kiin, La Cigale (W3B).
- Sights wave W3D (SF Travel neighbourhood pages as the 2nd source + Wikipedia coordinate batches): Huntington Park,
  Fairmont, Macondray Lane, Ina Coolbrith Park (unpinned), Haight & Ashbury (district coord → med), Buena Vista Park,
  Corona Heights Park, Fort Mason, Crissy Field, Alta Plaza Park, City Lights, Washington Square, Old St. Mary's;
  bars Tonga Room, Vesuvio (W3C). Held (Wikipedia-only so far): Lafayette Park, Haas-Lilienthal House, Tin How Temple,
  Portsmouth Square, Japan Center, Patricia's Green.
- **Self-audit fix (rule 4a):** street numbers / cross-streets I had typed for 16 sights from memory were replaced
  with descriptive addresses grounded in the search text (pins are Wikipedia's published coords, unaffected).
- Searches 105–119: AVE/MIS sights (SF Travel Richmond-Sunset, Mission murals, Castro, best-hikes pages + Wikipedia
  coords): Ocean Beach (beach midpoint → med), Fort Funston, SF Zoo, Stern Grove, Clarion Alley (unpinned), The
  Women's Building, Harvey Milk Plaza, Mount Davidson, Glen Canyon Park (3-decimal → med). Held Wikipedia-only:
  Holy Virgin Cathedral. Creator query #2 (TikTok/viral SF food) → only influencer-ranking SEO pages
  (sociallypowerful.com — rejected as SEO) and an AFAR chef piece (Brandon Jew's Chinatown picks — AFAR editorial,
  not a creator). **No creator met the bar this run** (no verifiable-following creator with a findable SF piece
  surfaced in 2 queries) — logged, not padded. Food: Good Luck Dim Sum (SF Travel + Michelin inspectors' off-guide
  list), Arizmendi Bakery Valencia (Infatuation + Michelin inspectors + Tasting Table). Held: Rosamunde (SF Standard
  reopen story is 2023 — status too stale), Noe Valley Bakery / Wing Lee / St. Francis Fountain / Fatted Calf (no
  address surfaced), AFAR-Brandon-Jew picks Hon's Wun-Tun, Spicy Shrimp, Hing Lung, Little Swan, Lai Hong Lounge
  (single source / no address), House of Dim Sum (SF Travel only).

## Stage 5-R — location re-verify of the OLD pins (CLAUDE.md 4b)
Michelin venue-page place pins for the old address-level ("med") Michelin restaurants → upgraded to high:
Mister Jiu's (shift 8 m), **Yank Sing (shift 176 m — misplaced, fixed)**, Nightbird (24 m), Aziza (16 m), Abacá
(49 m), **HK Lounge Bistro (96 m — fixed)**, Restaurant Naides (was UNVERIFIED → pinned high). `geo/_geoout_fixold.json`.
Still med (non-Michelin, no better pin found this run): Lers Ros, Great Eastern, House of Nanking, Turtle Tower,
Marufuku, Um.ma, Trick Dog, Tosca, Il Casaro, Sodini's, Swensen's, Blue Bottle Ferry Bldg + 9 sights; 1 low (SFO
Aviation Museum — interior of the International Terminal, inherently approximate). Old UNVERIFIED still held:
Boudin (aggregator-only coords rejected), It's-It, Chibog, The Bread Basket, Basque Cultural Center, Wursthall.

## Stage 6 — BUILD #2 (2026-10-02)
**267 researched → 242 rendered (sights 92 researched; food 175 = 65.5%)**; sourcecheck PASS 267/267 · geocheck
PASS · statuscheck CONSISTENT · buildcheck PASS · validate + test green. 25 held UNVERIFIED.
- Searches 120–128 (W3E): DTN sights City Hall, Union Square, Maiden Lane, Lotta's Fountain (SF Travel + Wikipedia
  pins). SE food: 3rd Cousin (Michelin), Piccino (Infatuation + SF Standard 2025), Marcella's Lasagneria (Time Out +
  Infatuation), Gumbo Social (Infatuation + Eater SF 38). Bars: Specs' (Time Out + SF Standard dive-bar panel 2024 +
  Wikipedia pin), Li Po (Atlas Obscura + SF Standard 2024). **MEASURED & DROPPED (status unconfirmed):** Sichuan
  Home, Sichuan Chong Qing, Yummy Szechuan — only legacy-format Michelin pages (2024-or-earlier listings) surfaced;
  removed from FOOD_W3B + their orphan UNVERIFIED registry rows. Held: Long Bridge Pizza, Zeitgeist, Toronado,
  Elixir (no full street address surfaced), Tsubasa (2019 Bib only), Lord Stanley (the Bleases moved to Wolfsbane).
- Searches 129–157: Mitchell's Ice Cream (SF Standard Legacy-Business story + Infatuation); Palace Hotel, Old Mint
  (SF Travel + Wikipedia pins); Wild Parrots of Telegraph Hill (Atlas Obscura + SF Travel); Noodle in a Haystack
  (Michelin); Hang Ah Tea Room (Atlas Obscura + Tasting Table + SF Chronicle — status from 2020–23-era coverage,
  re-check next wave); pins for Miller & Lux, Via Aurelia, La Cigale (Michelin venue pages). Held: St. Francis
  Fountain (no address), Rincon Annex murals (single source), Portsmouth Square (SF Travel only); Hyde Street Pier is
  closed for its rebuild (NPS) — already a caveat on the Maritime NHP record.

## Stage 4-R — RE-RANK (2026-10-02) — `_sf_rerank.py` (deterministic, idempotent)
Problem: ~60% of food was tier 1 in every area (wave-1/2 agents graded generously) → the must-see filter was useless.
Fix: FOOD tiers re-graded **within each area** by measured merit — award weight (MICHELIN_STAR 3 · JAMESBEARD 2.5 ·
MICHELIN_BIB 2 · MICHELIN listing 1) + 0.75 per extra distinct credible source (cap 3) + 1.5 for the brief's SF-canon
icons (La Taqueria, El Farolito, Swan, Tadich, Buena Vista, Boudin, Tartine, Hog Island, It's-It, Mandalay, Burma
Superstar, Yank Sing, Mister Jiu's, House of Prime Rib, Zuni, Hang Ah, Thanh Long, Sotto Mare, Saigon Sandwich,
Tonga Room, Vesuvio, the 3 third-wave roasters, Fortune Cookie Factory) + the curator's original tier as a signal
(kept in `t0`). Positional cut per area: top 35% → t1, next 45% → t2, rest → t3; closed places keep their tier.
Result: every area keeps ≥3 food tier-1s (SE 3 … DTN/NECN/MIS 11–12); sights untouched (already area-graded, each
area ≥3 sight tier-1s). Ratings were not used.

## Stage 6 — BUILD #3 (2026-10-02)
**280 researched → 252 rendered (91 sights + 161 food on the map); food = 181/280 = 64.6%.** sourcecheck PASS
280/280 · geocheck PASS · statuscheck CONSISTENT · buildcheck PASS · validate DATA OK · npm test ALL PASS.
28 UNVERIFIED held (geocode backlog). data/sources.json: 25 auto-registered SF keys given real `credible`
rationales (13 older wave-1/2 keys still carry the AUTO note — next wave).
- Searches 158–168 (W3F): Japan Center (3-decimal → med), The Fillmore, Haas-Lilienthal House, SF Columbarium,
  Bison Paddock (unpinned), Beach Chalet WPA murals, John McLaren Park, Candlestick Point SRA, Tenderloin Museum
  (unpinned); Michelin pins for 3rd Cousin + Noodle in a Haystack. Held: St. Mary's Cathedral, Glide Memorial,
  Holy Virgin Cathedral, Portsmouth Square, Tin How Temple (single source so far).

## Stage 6 — BUILD #4 / FINAL of this session (2026-10-02)
**289 researched → 261 on the map (98 sights + 163 food); food 181/289 = 62.6%.** All 4 gates PASS/CONSISTENT ·
validate DATA OK · npm test ALL PASS. 28 UNVERIFIED held. Card + CITIES row refreshed by `_sf_counts.sh`.
- Searches 169–170 (pin pass for unpinned sights): Chase Center (Wikipedia), Blue Heron/Stow Lake → Strawberry Hill
  island coords (Wikipedia), Seward Street Slides (Atlas Obscura place coords). India Basin Shoreline Park NOT pinned
  — the only coordinate found is the India Basin *neighbourhood* centroid (rule: never centroids).
- Searches 171–173: Tin How Temple (Time Out + Wikipedia pin) added; Holy Virgin / St. Mary's / Lafayette Park
  second-source query returned only other cities → still held.
- **FINAL (build #5): 290 researched → 265 on the map (102 sights + 163 food); food 62.4%.** Registry for SF:
  236 high / 28 med / 1 low / 25 UNVERIFIED. All 4 gates + validate + test green.
