# Cincinnati — audit trail

Follows `docs/PIPELINE.md`: discover sources → extract places → fact-check → re-rank → location-verify →
build. Every stage recorded here so any agent can reproduce or continue. Mirrors the SF/SV audits.

## Stage 0 — Scaffold  (status: DONE 2026-08-14)
Region = Cincinnati OH + NKY riverfront. Built: `consolidate.py` (7 areas DTN/OTR/UPT/EAST/WEST/BURB/NKY;
Cincinnati cuisine taxonomy incl. CHILI/GERMAN/BBQ/PIZZA/BREW/ICE; collections incl. RIVER riverfront);
`tools/build-cincinnati.py` (clone of the SF build — **derives map centre/labels from pins**, so no
wrong-city risk; the per-city prose — eyebrow, H1, standfirst, meta, placeholders, footer, cuisine
appendix — was hand-rewritten for Cincinnati); `data/sources.json` cincinnati-oh entry with 9 credible
outlets (James Beard, Cincinnati Enquirer, Cincinnati Magazine, CityBeat, WCPO/WLWT/WKRC, Cincinnati
Refined, Soapbox, Atlas Obscura); `_AGENT_BRIEF.md`; research.js PAGE_FOR + DATASET_FOR; geocode-status.py
DATASETS; geocodes.json empty entry; index.html "being built" card.

## Stage 1 — Source discovery  (status: registry seeded)
Credible palette registered (see sources.json). **This market has no Michelin Guide and no Eater
edition**, so James Beard is the lone institutional authority and the local press (Enquirer, Cincinnati
Magazine, CityBeat + Best Of) is the backbone. Rule (same as every city): Yelp/TripAdvisor = open-check
only, never the sole recommender.

## Stage 2 — Place extraction  (status: PENDING — discovery waves)
Signature-first food canon (Cincinnati chili, goetta, ribs, Findlay Market, Graeter's, German/OTR, craft
beer, fine dining, NKY) + comprehensive sights (Union Terminal, Zoo/Fiona, Music Hall, Roebling, Art
Museum, Eden Park, American Sign Museum, Freedom Center, riverfront). Log counts + exclusions per wave here.

## Stage 3 Fact-check · 4 Re-rank · 5 Location-verify · 6 Build & gate  — PENDING
Gates (enforced in code): `--sourcecheck` (≥2 credible or lone James Beard), `--geocheck`, `--statuscheck`,
`--buildcheck` (map centre+labels within Cincinnati's pins), jsdom render-verify.

## Stage 5/6 — Location-verify + Build & LIVE (DONE 2026-08-14)
Geocoded 91 in 3 waves → **81 verified pins (60 high / 17 med / 1 low), 10 UNVERIFIED** (restaurant
place-pins that didn't surface: Gold Star Mt. Washington, Montgomery Inn Original, Holtman's, Fireside,
Salazar, Gomez Salsa, Mazunte, Quatman, Just Q'in, Kiki → docs/GEOCODE-BACKLOG.md for the browser
helper). Data corrections captured: Salazar → 101 W 5th St (reopened Nov 2025), Kiki → 358 Ludlow Ave.
Built cities/cincinnati.html (50 sights + 31 food). Gates: geocheck PASS · statuscheck CONSISTENT (2
closed flagged: Carew Tower deck, EnterTRAINment Junction) · sourcecheck PASS · **buildcheck PASS**
(centre 39.11,-84.51) · render-verify ALL PASS. index card relinked → LIVE.

## Creator / viral / social-source pass (DONE 2026-08-18) — WebSearch only
Ran per docs/SOURCES.md "Creator, viral & social-source pass" + `_AGENT_BRIEF.md`. Artifacts:
`CREATORS.json` (9 vetted creators + 2 attachments), `VIRAL_EXPAND.json` (4 new viral places). All
verified via WebSearch; no fabricated followings or coordinates.

**9 creators vetted** — famous: DAVEPORTNOY (Barstool One Bite, ~4M+; Nov 2025 Cincinnati pizza tour,
St. Francis Apizza 8.2 = highest in Ohio; via FOX19), STEFANJOHNSON (@s_johnson_voiceovers, ~8M TikTok;
dedicated Cincinnati chili-parlor content — Cleveland-based but city-scoped). Local: KAITLOTT
(@kaitskravings ~38K IG, CincyMag profile), DIONEWU (@drinkingdiningdione ~41K IG, CincyMag profile,
#5 Cincy food IG per infludata), CINCYEATS (@cincyeats ~30K IG since 2014), CINCYFOODIES
(@cincinnatifoodies ~32K IG). Authority-basis (kept honestly, not on follower count): RONNYSALERNO
(Queen City Discovery, author 'Fading Ads of Cincinnati', weird-history/urbex — ~3K social, kept on
authority), JULIENIESEN ('Wine Me Dine Me'/WVXU veteran food writer), CHRISTIANGILL (Feast Mode 513;
Food Network champion chef — YouTube following unverifiable, kept on chef authority).

**2 attachments** to existing places (findable video AT the place): STEFANJOHNSON → Camp Washington
Chili (tiktok 7429443957513293102); STEFANJOHNSON → Skyline Chili (Downtown) (tiktok 7419405277805432107).

**4 new viral places** (each ≥2 credible, fact-checked OPEN Aug 2026, full address, no invented coords),
all surfaced by Portnoy's viral One Bite tour — none duplicate the existing dataset: St. Francis Apizza
(3392 Erie Ave 45208, EAST; PORTNOY 8.2 + FOX19), Adriatico's (113 W McMillan St 45219, UPT; 30-slice
Bearcat; CINCYMAG Top-25 + PORTNOY), Guardia Pizza & Bar (3200 Linwood Ave 45226, EAST; CINCYMAG +
WKRC/Local12), Taglio (3531 Columbia Pkwy 45226, EAST; PORTNOY + FOX19).

**Rejected / held** — 513_finds (~6.7K TikTok, too small); @lenasyed 'Lena' & @mariathewild 'Maria'
(Ohio/region scope, unverifiable counts); 'Matty' (no verifiable handle/count); Joshua Weissman (huge,
but Skyline was one segment of a 50-state video — no Cincinnati track record); Tim Laielli (single
Skyline recreation, not a Cincy beat); Quinton Reviews (big YouTuber but commentary, one 'underrated
city' one-off — not a food/travel beat); @cinful_eats_ (~1.5K, and a venue not a creator). **Roji
omakase** (31 E Court St, DTN) HELD from VIRAL_EXPAND: real + open, and Dione Wu has a reel there, but no
2nd credible editorial source found (only Yelp/personal blog) — fails the ≥2-credible gate, so excluded
pending an ENQUIRER/CINCYMAG/CITYBEAT source.

## Stage 7 — Expansion + creator merge (2026-08-18)
FOOD_EXPAND(16) + SIGHTS_EXPAND(21) landed (≥2-credible, open-verified, no invented coords). Creator pass:
`tools/merge-creators.py cincinnati-oh` registered 9 creators into `sources.json` + applied 2 attachments
(Stefan Johnson → Camp Washington Chili, Skyline Chili). VIRAL_EXPAND(4 pizza: St. Francis Apizza,
Adriatico's, Guardia, Taglio). consolidate.py → **132 candidates** (P71/F61). `sourcecheck.py` PASS (132/132).
NEXT (needs WebSearch): geocode the new candidates into `geocodes.json`, then --geocheck/--statuscheck →
rebuild → --buildcheck → render-verify → bump CITIES.md count. Page currently live at 81 verified pins.

## Stage 8 — Location-verify + build (2026-08-18)
Geocode agent worked the 41 new candidates (`geo/_worklist_new.json`): 28 resolved (16 high · 12 med),
13 UNVERIFIED (null coords, held — restaurant place-pins unreadable via WebSearch here). 0 closed.
Read Wikipedia coords / Apple `coordinate=` / Google `!3d!4d` place pins; never `/@` viewports; nulls
never fabricated. Merged (new-only) into `geocodes.json` → 132 registry entries. Rebuild: **page 109 pins**.
Gates: sourcecheck PASS · geocheck exit 0 (4 low to upgrade) · statuscheck CONSISTENT · **buildcheck PASS**
(map centre 39.11,-84.51 inside Cincinnati pins). 23 UNVERIFIED → `docs/GEOCODE-BACKLOG.md` for the helper.
