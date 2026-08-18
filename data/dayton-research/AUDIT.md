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
