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
