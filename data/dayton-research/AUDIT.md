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
