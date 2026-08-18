# Columbus — audit trail
Follows docs/PIPELINE.md. Mirrors the SF/Cincinnati audits.
## Stage 0 — Scaffold (DONE 2026-08-14)
Region = Columbus OH + inner suburbs. consolidate.py (7 areas DTN/SN/GV/OSU/EAST/WEST/BURB; Columbus
taxonomy incl. AFRICAN Somali/East-African + Columbus-Style pizza), tools/build-columbus.py (clone of SF
build — derives map centre/labels; **per-city prose rewrite DEFERRED to build time, see RESUME.md**),
sources.json (James Beard + Columbus Dispatch/Monthly/Underground/Alive + NBC4 + Experience Columbus +
Atlas Obscura), _AGENT_BRIEF.md, research.js/geocode-status.py registered, geocodes entry.
## Stage 1 — Sources: registry seeded. No Michelin/Eater in market -> James Beard lone authority; local press backbone.
## Stage 2 — Extraction: IN PROGRESS (discovery agent: FOOD.json + SIGHTS.json). Log counts here.
## Stage 2b — Creator/viral/social-source pass (DONE 2026-08-18, WebSearch only). CREATORS.json + VIRAL_EXPAND.json.
Vetted 7 creators (all verified follower counts + Columbus city scope + findable content): BWNICK (Nick Dekker,
IG 32K, blog since 2007, Columbus Monthly/Dispatch bylines), CFA (Columbus Food Adventures/alt.eats, @cbusadventures
62K, USA Today best food tour), FEAST614 (Anthony O'Connell @614feast 34K + podcast), OHF614 (Dan Wyatt 31K),
TASTECBUS (Alina & Kate 31K), CBUSFOODIE (columbus_foodie ~50K), EATIN614 (Hollen Campbell 23K). All local_creator.
Attach (3, all findable BWNICK blog posts at the named place): Fox in the Snow Cafe, Katalina's, Schmidt's Sausage Haus.
New viral places (4, each >=2 credible + open 2026 + full address, coords deferred to geocode stage): Los Guachos
Taqueria (BURB; BWNICK+CFA), Mikey's Late Night Slice (SN; COLUMBUSUNDERGROUND+ABC6), Buckeye Donuts (OSU;
COLUMBUSUNDERGROUND+614MAG), Preston's: A Burger Joint (OSU; COLUMBUSUNDERGROUND+COLUMBUSMONTHLY).
REJECTED (6): exploreohiofood (follower count unverifiable), laneyintheland (Akron/statewide region-only, no Columbus
food), upperfeast (NYC scope — kept his Columbus @614feast instead), CbusFoodie614 (2.6K too small), foodieofcolumbus
(9.5K below bar), Yeahh Mike @rightideawrongchef (unverifiable Columbus scope). NEXT: geocode the 4 new places
(geo/ + geocodes.json), then --sourcecheck/--geocheck/--statuscheck before build.
## Stage 3-6 PENDING. Gates: --sourcecheck/--geocheck/--statuscheck/--buildcheck + render-verify.

## Stage 7 — Expansion + creator merge (2026-08-18)
FOOD_EXPAND(21) + SIGHTS_EXPAND(25) landed (≥2-credible, open-verified, no invented coords). Creator pass:
`tools/merge-creators.py columbus-oh` registered 7 creators into `sources.json` + applied 3 attachments
(Fox in the Snow, Katalina's, Schmidt's). VIRAL_EXPAND(4: Los Guachos, Mikey's Late Night Slice, Buckeye
Donuts, Preston's). consolidate.py → **93 candidates** (P47/F46). `sourcecheck.py` PASS (93/93).
NEXT (needs WebSearch): geocode the new candidates into `geocodes.json`, then --geocheck/--statuscheck →
rebuild → --buildcheck → render-verify → bump CITIES.md count. Page currently live at 37 verified pins.
