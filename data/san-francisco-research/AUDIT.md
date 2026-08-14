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
