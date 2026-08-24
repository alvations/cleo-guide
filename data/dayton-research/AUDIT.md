# Dayton — audit trail
Follows docs/PIPELINE.md. Mirrors the SF/Cincinnati audits.
## Stage 0 — Scaffold (DONE 2026-08-14)
Region = Dayton OH + inner suburbs. consolidate.py (6 areas DTN/WD/SOUTH/NORTH/EAST/YS; Dayton
taxonomy incl. AFRICAN Somali/East-African + Dayton-Style pizza), tools/build-dayton.py (clone of SF
build — derives map centre/labels; **per-city prose rewrite DEFERRED to build time, see RESUME.md**),
sources.json (James Beard + Dayton Dispatch/Monthly/Underground/Alive + NBC4 + Experience Dayton +
Atlas Obscura), _AGENT_BRIEF.md, research.js/geocode-status.py registered, geocodes entry.
## Stage 1 — Sources: registry seeded. No Michelin/Eater in market -> James Beard lone authority; local press backbone.
## Stage 2 — Extraction: IN PROGRESS (discovery agent: FOOD.json + SIGHTS.json). Log counts here.
## Stage 3-6 PENDING. Gates: --sourcecheck/--geocheck/--statuscheck/--buildcheck + render-verify.

## Stage 7 — Expansion + creator merge (2026-08-18)
FOOD_EXPAND(16) + SIGHTS_EXPAND(14) landed (≥2-credible, open-verified, no invented coords). Creator pass:
`tools/merge-creators.py dayton-oh` registered 6 creators into `sources.json` + applied 2 attachments
(Dayton Arcade ← DAYTONVISTAS, Wheat Penny ← GIRLABOUTDAYTON). VIRAL_EXPAND(4: Val's Bakery, Koji Burger,
CULTURE by Chef Dane, Tender Mercy). consolidate.py → **74 candidates** (P38/F36). `sourcecheck.py` FAIL at
dataset level = 2 single-source (Aullwood [OFFICIAL] held for a 2nd source; Third Perk [DAYTONDAILY] new) +
3 lone-institutional (NPS Wright sites, pass via ELITE_SOLO). Build GATE 1 drops the 2 single-source, so the
page stays clean — accepted pattern. NEXT (needs WebSearch): geocode new candidates → --geocheck/--statuscheck
→ rebuild → --buildcheck → render-verify → bump CITIES.md count. Page currently live at 39 verified pins.

## Stage 8 — Location-verify + build (2026-08-18)
Geocode agent worked all 35 new candidates: 16 resolved (6 high · 10 med), 19 UNVERIFIED (null, held —
mostly restaurants/breweries). Closed found: Third Perk Coffeehouse (146 E 3rd, closed Dec 2023) — flagged,
null coords → gate-dropped. Data trap recorded: Dayton Beer Co = 41 Madison (open), not the closed Kettering
location. Read Wikipedia/Apple/Google place pins only; nulls never fabricated. Merged (new-only) → 74 registry
entries. Rebuild: **page 55 pins**. Gates: sourcecheck FAIL at dataset (2 single-source — Aullwood, Third Perk;
build GATE 1 drops both, page clean) · geocheck exit 0 (5 low) · statuscheck CONSISTENT · **buildcheck PASS**
(centre 39.76,-84.18 inside Dayton pins). 19 UNVERIFIED → backlog.

## Stage 9 — Asian food deep-dive (2026-08-18)
Request: add What the Pho (= **Wat Da Pho**) + authentic/credible/notable Asian food. Discovery via
Dayton937 "Quest for the Best Pho" + Dayton Local (GEMCITY) + Destination Dayton (CVB) + Best of Dayton
(dayton.com). Added **7 places** (`FOOD_ASIAN.json`), each ≥2 credible sources, fact-checked OPEN 2026,
cuisine-tagged by the kitchen's own tradition (Vietnamese/Chinese/Thai/Sushi/Korean → ASIAN filter):
- Wat Da Pho (EAST, Beavercreek, t1) — DAYTON937+GEMCITY+OFFICIAL
- Little Saigon (EAST, 30-yr institution, t1) — DAYTON937+OFFICIAL
- Pho District (EAST, Beavercreek/The Greene, t2) — DAYTON937+GEMCITY
- Pho Mi (SOUTH, Washington Twp, t2) — DAYTON937+GEMCITY
- China Cottage (SOUTH, Centerville, since 1987, multi-yr Best of Dayton, t1) — DESTDAYTON+DAYTONDAILY
- Ginger and Spice Asian Bistro (DTN, Brown St, t2) — GEMCITY+DESTDAYTON
- Kabuki Restaurant & Sushi Bar (SOUTH, Centerville, Korean/Japanese, t2) — GEMCITY+OFFICIAL
Sources registry expanded: added **DAYTON937, DESTDAYTON, OFFICIAL** to `sources.json` dayton-oh (with
credible rationale). **Excluded (found permanently CLOSED, WDTN + Dayton Daily News June 2026): Get The
Pho Out** (Kettering) — not presented as a live pick, per the expansion-of-live-picks precedent (Christopher's).
Geocode: only **Wat Da Pho** resolved (39.77159,-84.06033, med — aggregator place point); the other 6
returned only Apple place-id links (restaurant place-pins unreadable via WebSearch), left UNVERIFIED →
gate-held for `geocode-helper.html`. Merged (asian-only) → 81 registry entries. Rebuild: **page 56 pins**
(food 18→19). Gates: sourcecheck (my 7 all ≥2 credible; the 2 single-source FAILs are the unrelated
Aullwood+Third Perk, build-dropped) · geocheck exit 0 · statuscheck CONSISTENT · **buildcheck PASS**.

## Stage 10 — Merit re-audit (2026-08-18): measure acclaim, prune padding
Per the merit bar (docs/SOURCES.md "Merit bar — MEASURE acclaim before adding"), re-measured the 7 Stage-9
Asian adds on rating + volume + award/rave and kept only standouts:
KEEP (4): Wat Da Pho (Google 4.7 / ~1,986 reviews; Dayton937 top pho) · China Cottage (multi-yr Best of
Dayton Best-Chinese; ~1,360 reviews; est. 1987) · Kabuki (Google 4.6; TripAdvisor #8/71 Centerville; 650+
reviews) · Little Saigon (Google 4.5 / RestaurantGuru 4.8 across 750+; 30-yr institution + Dayton937 rave).
DROP (3, padding — respectable but not standout): Pho District (4.4) & Pho Mi (4.3) — 3rd/4th pho, Pho Mi's
only nod was faint ("mildest broth"); Ginger and Spice (4.3–4.5, reviews flag "Americanized"). Removed from
FOOD_ASIAN.json + geocodes.json + geoout. Dataset food 43→40; page stays 56 (Wat Da Pho pinned; the other 3
keeps UNVERIFIED → helper). Gates: geocheck exit 0 · statuscheck CONSISTENT · buildcheck PASS. Rule codified
repo-wide (all categories/cities) in docs/SOURCES.md.

## Stage 11 — Asian/Vietnamese food + creator/viral pass, weighted to Beavercreek/EAST (2026-08-24)
Ran the creator/viral + food-discovery pass (docs/SOURCES.md) via WebSearch (~35 queries): Dayton937 'Quest
for the Best Pho', Dayton Daily News food desk, WDTN/Dayton Local, plus verified-creator vetting. Every add
carries **≥2 credible sources** (a creator = ONE corroborator, never the institutional authority),
fact-checked OPEN 2025/2026, cuisine tagged by the kitchen's own tradition, NO coordinates.

Wrote `FOOD_BEAVERCREEK_ASIAN.json` (**8 NEW places**, none duplicating Wat Da Pho / Little Saigon /
China Cottage / Kabuki / Thai 9 / Tender Mercy) — weighted to EAST/Beavercreek (5 of 8):
- **EAST (5):** House of Thai (Beavercreek, t1 Thai — DAYTONDAILY 'pink building… best Thai in Dayton' +
  GEMCITY) · Linh's Bistro (Riverside/near WPAFB, t2 Vietnamese/Chinese — DAYTON937 Quest-for-Pho + OFFICIAL) ·
  Bleu Wave Seafood Boil & Pho (Fairfield Commons, t2 Viet-Cajun/pho — DAYTONDAILY + DAYTON937) · Yumi Boba
  Tea (The Greene, t2 Taiwanese boba + Vietnamese deli — DAYTONDAILY + OFFICIAL) · Kawa Revolving Sushi
  (Centre Dr, t2 conveyor-belt sushi, viral — DAYTONDAILY + WDTN, CityBeat review).
- **SOUTH (2):** Five Grains Noodle House (Kettering, t1 Chinese fish-noodle soup, Google 4.7 — DAYTON937
  dedicated feature + OFFICIAL) · Sky Asian Cuisine (Kettering, t2 upscale sushi — DAYTONDAILY 'First Look
  impresses' + DAYTON937 'a gem').
- **DTN (1):** Nood Bar (The Silos, t2 Asian/Lao ramen+bao, Chef Dane Shipp's 2nd concept — WDTN Living
  Dayton + DAYTONDAILY + creator CUTIE).

`CREATORS_DAYTONASIAN.json` — **2 new vetted creators** (merge-creators.py globs CREATORS*.json):
- **CUTIE** — Dejea Jasmeen / @foodieswithacutie, ~51.7K TikTok (461.5K likes), Cincy/Dayton beat + 'Cutie's
  Foodie Finder' directory; findable content at Nood Bar (video 7488154756066725166). famous_creator/region.
- **BIGRAGU** — Steve Milano 'The Big Ragu' / Food Adventures Dayton (@dayton_foodies), ~8K FB, Dayton food
  blog since 2008; covered Little Saigon + North China. local_creator/city. Attached to Little Saigon.
- Attach: Nood Bar←CUTIE, Little Saigon←BIGRAGU. Rejected 5 (small/unverifiable @ohiofoodie_,
  @daytonfooddiaries; restaurant account @daytonstreeteats; out-of-area iPho; SEO listicles).

**MEASURED & DROPPED (merit bar / no-padding / gate):**
- **Yung's Cafe (ex-Myong's Cafe, Fairborn/EAST, Korean)** — authentic bulgogi, but only ratings-platform
  coverage (TripAdvisor/Yelp = ZERO credible); FAILS ≥2-credible gate. **Korean is a stated EAST gap**, not
  filled. (Note: the old 'Myong's' name shows CLOSED; live under Yung's Cafe, 1328 Kauffman Ave.)
- **Izakaya (Beavercreek/EAST)** — DDN+WDTN covered it, but it's an anime-themed *pizza/bar* (Yelp category
  'Pizza'; pizza, wagyu burgers, Korean corn dogs) — not an authentic Asian kitchen. Notable/viral but fails
  the honest-cuisine test; dropped from an Asian-food list.
- **North China (Washington Twp/SOUTH, est 1987)** — 2 credible (DAYTON937 10-course + DESTDAYTON) but a
  3rd SOUTH Chinese behind China Cottage + Five Grains → padding; dropped, Five Grains is the distinctive pick.
- **Tsao's Cuisine (Beavercreek)** — 4.1/151, buffet; not standout → drop. **Sakura Sushi & Korean
  (Beavercreek)** — 4.5–4.6 but low volume (~45–114) and no credible editorial → fails gate. **Asia Gourmet
  / King Garden / Royal Wok** — generic pan-Asian, no editorial → drop. **Pho District / Pho Mi** — already
  merit-dropped Stage 10 as pho padding; not re-added. **Dak Joy Korean Fried Chicken (Huber Heights)** —
  **permanently CLOSED (Yelp, June 2026)**, non-notable → dropped. **iPho** — Cincinnati, out of scope.
- **NORTH (Vandalia/Huber Heights/Troy):** no Asian place clearing the ≥2-credible bar surfaced (Dragon
  China, Fu Ying, Asian Star, Wat Da Pho Express spinoff — ratings only). **Stated NORTH gap**, not padded.

Gate note: WDTN is named credible in the brief/source palette but is **not yet a key in sources.json**
(only WHIO is). Nood Bar and Kawa each still have a registered-credible source (DAYTONDAILY) + WDTN; the
maintainer should register a `WDTN` source key before `--sourcecheck` so both count cleanly. Did NOT edit
shared files (sources.json, geocodes.json, research.js, dataset) — geocoding/build is a later stage.
