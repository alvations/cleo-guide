# Cities & regions — master index

The single entry point to every guide in this repo: what exists, where its artifacts live, and the
exact commands to verify or continue it. **A different agent should be able to read this file and
reproduce or extend any city's pipeline.** Pair it with [PIPELINE.md](PIPELINE.md) (the fixed stage
order + audit contract), [RECREATE.md](RECREATE.md) (doing it for a brand-new city), and
[AGENT-PROMPTS.md](AGENT-PROMPTS.md) (the reusable agent prompt library, run log & lessons — read before
launching any expansion agent).

_Counts are as of 2026-08-18; re-derive anytime with the commands below — never trust a stale number._

| City / region | Page | Built dataset | Research dir (audit trail) | Places on page | State |
|---|---|---|---|---|---|
| Cleveland OH | `cleveland.html` (the engine) | inline in page | `data/cleveland-research/` | 194 | live · Lakewood/West-Side + Heights + Bay Village expansion spliced (6 geocoded: Beck Center, Market Garden, Huntington, Cain Park, Cedar Lee, Fort Hill Stairs); 17 UNVERIFIED held for helper; Melt + Deagan's flagged CLOSED |
| Pittsburgh PA | `cities/pittsburgh.html` | inline | `data/pittsburgh-research/` | 212 | live · 1 low pin to re-verify |
| Youngstown OH | `cities/youngstown.html` | inline | — | 62 | live (shortlist) |
| New York NY | `cities/newyork.html` | `data/newyork.dataset.json` | `data/newyork-research/` | 508 | live · 1 place to geocode |
| Silicon Valley CA | `cities/siliconvalley.html` | `data/siliconvalley.dataset.json` | `data/silicon-valley-research/` | 152 | live · 19 UNVERIFIED pins pending helper |
| San Francisco & Peninsula CA | `cities/sanfrancisco.html` | `data/sanfrancisco.dataset.json` | `data/san-francisco-research/` | 141 | live · 7 UNVERIFIED pins pending helper |
| Cincinnati OH (+ NKY) | `cities/cincinnati.html` | `data/cincinnati.dataset.json` | `data/cincinnati-research/` | 109 | live · 23 UNVERIFIED pins pending helper |
| Columbus OH | `cities/columbus.html` | `data/columbus.dataset.json` | `data/columbus-research/` | 86 | live · metro+MADISON-corridor expansion (127 candidates, 52 sources); 41 UNVERIFIED pins pending helper; 3 closed flagged |
| Dayton OH (+ Miami Valley) | `cities/dayton.html` | `data/dayton.dataset.json` | `data/dayton-research/` | 74 | live · Beavercreek/Miami-Valley + SPRINGFIELD corridor expansion (Westcott House, Hartman Rock Garden pinned); 23 UNVERIFIED pins pending helper (14 restaurants + 9 parks); Aullwood + Third Perk (1-source) held by GATE 1 |
| Washington DC (+ Arlington + Dulles corridor) | `cities/washingtondc.html` | `data/washingtondc.dataset.json` | `data/washington-dc-research/` | 134 | live · 222 candidates (12 areas, deep non-American food + Mama Chang), UNVERIFIED restaurant pins pending helper; closed rooms held |
| Singapore &amp; Vietnam (+ archived SEA) (int'l · **pastel light/dark** · **one page per place**) | **Country-structured** (see [docs/COUNTRIES.md](COUNTRIES.md)): root `index.html` = country hub (US default + 🇸🇬 Singapore + 🇻🇳 Vietnam); `Singapore/index.html` = Singapore towns hub; `Vietnam/index.html` = Vietnam cities hub (`Vietnam/ho-chi-minh-city.html` = HCMC); `Singapore/singapore-old.html` = archived all-SEA index (not thrown away) | `data/singapore.dataset.json` | `data/singapore-research/` | 253 | live · per-country pages built by `tools/build-singapore-pages.py` from `data/countries.json` (region→folder; only Vietnam has its own folder, rest share `Singapore/`). **2 live/clickable:** Toa Payoh (56) + Ho Chi Minh City (142 pins: 76 sights + 66 food) — rest greyed while populated (`LIVE_SLUGS`). ~204 UNVERIFIED VN pins pending the browser geocode-helper (regenerate the worklist with `python3 tools/gen-helper-backlog.py singapore --region-substr Vietnam --out data/singapore-research/_vn_helper_backlog.json`); closed flagged; per-city sources kept separate (shared institutional labels pinned generic in `consolidate.py`). **geo-merge never downgrades a verified pin** — a stale/failed geoout can no longer null out a fresh coordinate on a full re-merge (guarded by `tools/test-geo-merge.py` in `npm test`). **City vs town tier + NYC-style metro districts/outskirts are data-driven in [`data/metros.json`](../data/metros.json) — see [docs/METROS.md](METROS.md) to give the next city the same treatment.** Rebuild: `python3 tools/rebuild-city.py singapore --build`. |
| State College / Penn State (Happy Valley PA + Altoona) | `cities/statecollege.html` | `data/statecollege.dataset.json` | `data/state-college-research/` | 48 | live · 6 areas (Downtown/PSU campus/Bellefonte-Boalsburg/Happy Valley + **Altoona & Blair** + **Alleghenies**); 80 candidates, ~30 UNVERIFIED restaurant pins pending helper; closed flagged (PA Military Museum reno, Ye Olde College Diner, Indian Caverns). Rebuild: `python3 tools/rebuild-city.py state-college-pa --build`. |
| Wheeling WV + National Road corridor | `cities/wheeling.html` | `data/wheeling.dataset.json` | `data/wheeling-research/` | 35 | live · 5 areas (Wheeling/Washington PA/Ohio Valley/Cambridge/Zanesville → Columbus edge); 57 candidates, all 4 gates green; ~22 UNVERIFIED restaurant pins pending helper; closed flagged (Wheeling Brewing, Old Market House Inn). Figaretti's = 2026 James Beard America's Classics. Rebuild: `python3 tools/rebuild-city.py wheeling-wv --build`. |
| Saarbrücken & the Greater Region (SaarLorLux · DE/FR/LU) | `cities/saarland.html` (linked from the country hub as 🇩🇪 Germany & the Greater Region) | `data/saarland.dataset.json` | `data/saarland-research/` | 287 | live · cross-border, 5 areas: **SAAR** (Saarbrücken + Saarland), **MOSELLE** (Metz + Nancy), **LUX** (whole Grand Duchy), **MOSEL** (Trier + Mosel), **ALSACE** (Strasbourg). **404 discovered, all ≥2-credible or a lone institutional authority; 287 rendered** (183 sights + 104 food — food by area: LUX 39 · SAAR 22 · ALSACE 17 · MOSELLE 13 · MOSEL 13). Sourced in DE/FR/LU (Saarbrücker Zeitung, SR, Le Républicain Lorrain, DNA, Luxemburger Wort, Tageblatt, Inspire Metz, Michelin/UNESCO/Gault&amp;Millau) + reused US/Europe outlets (Rick Steves, Atlas Obscura). Botanischer Garten Uni Saarland flagged CLOSED. **Now wired into `rebuild-city.py` + `research.js` (all gates) + `geocode-status.py`** — the documented rebuild command runs end-to-end. `consolidate.py` now collapses near-duplicate names (e.g. "Brasserie Excelsior"/"Brasserie L'Excelsior", "Villa Majorelle (Nancy)") — sources union, shorter name wins. **Food geocoding is the wall**: this session's WebSearch summariser strips POI decimals from most European venue pages, so only Wikidata heritage anchors + Michelin/directory flukes resolve; ~116 restaurants remain UNVERIFIED, held for the browser geocode-helper, never town-centroid faked. 18 pre-existing pins share a landmark/square anchor (`data/saarland-research/geo/_placement_fix_food.json`) and need a helper placement pass to distinct venue coords. Rebuild: `python3 tools/rebuild-city.py saarland --build`. |
| Erie PA + Lake Erie / I-79 corridor | `cities/erie.html` | `data/erie.dataset.json` | `data/erie-research/` | 35 | live · 5 live areas (Erie/North East wine belt/Meadville/Grove City/corridor; Edinboro empty this pass); 40 candidates, geocheck/statuscheck/buildcheck green (35/40 geocoded — US addresses geocode well); 5 pins + more pending helper; closed flagged (Riverside Inn 2017 fire, 1201 Kitchen). Canon: Greek dogs, Stanganelli's pepperoni balls, sponge candy, Lake Erie wine belt. Rebuild: `python3 tools/rebuild-city.py erie-pa --build`. |
| Aachen & the Dreiländereck (Euregio Maas-Rhein · DE/NL/BE) | `cities/aachen.html` (linked from the country hub as 🇩🇪 Aachen & the Dreiländereck) | `data/aachen.dataset.json` | `data/aachen-research/` | 148 | live · tri-border, 5 areas: **AACHEN** (city — UNESCO cathedral, thermal springs, RWTH/Pontviertel), **STADT** (StädteRegion — Monschau, Kornelimünster, Stolberg), **EIFEL** (National Park + Düren/Jülich), **NL** (Maastricht + Dutch South Limburg), **BE** (Ostbelgien — Eupen, Kelmis, Hautes Fagnes). **178 discovered, all ≥2-credible or a lone institutional authority; 148 rendered** (113 sights + 35 food — food by area: NL 13 · EIFEL 7 · STADT 7 · AACHEN 4 · BE 4). **All 113 sights geocoded** (Wikidata landmarks — 74/74 DE + 39/39 NL/BE, 0 unverified). Sourced in DE/NL/FR (Aachener Zeitung/Nachrichten, WDR, Route Aachen, Eifel Tourismus, Visit Maastricht, De Limburger, Grenz-Echo, BRF, Michelin/UNESCO/Gault&amp;Millau). 4 closures flagged (Chocolaterie Jacques museum, Thermenmuseum Heerlen, Felsenkeller, Take One). ~30 restaurants held UNVERIFIED for the browser geocode-helper (WebSearch can't surface their venue decimals) — never town-centroid faked. Rebuild: `python3 tools/rebuild-city.py aachen --build`. |

**Washington DC region scope:** DC proper + **Arlington** + the Northern Virginia corridor between
**Dulles (IAD) and DC** — Rosslyn/Clarendon/Ballston, National Landing, Falls Church & Annandale (Eden
Center), Tysons, McLean, Vienna, Reston, Herndon — **plus Old Town Alexandria** as the near southern edge.
The spine is the Silver Line / Dulles Toll Road axis. Out of scope: past Dulles (Ashburn/Leesburg) and
the Maryland suburbs (Bethesda/Silver Spring). DC has a full Michelin guide, so institutional authority is
deep; every place is merit-measured before it earns a pin.

**San Francisco region scope:** SF proper + the northern Peninsula down to **San Mateo** and the **SFO
corridor** (Daly City, Brisbane, South SF, San Bruno, Millbrae, Burlingame, San Mateo) — deliberately
bridging where the Silicon Valley guide edges out (~Menlo Park/Redwood City). The San Mateo line is the
seam; don't double-cover south of it.

## Central registries (shared by all cities)
- **`data/sources.json`** — the sources registry. **Expand it per city** with that city's credible
  outlets + a `credible` rationale for each; add vetted `creators`. Yelp/TripAdvisor are never a
  recommender. Every city's `_AGENT_BRIEF.md` names its own ranked palette.
- **`data/geocodes.json`** — every coordinate + `source` + `confidence` + open/closed `status` + dates.
- **[`GEOCODE-BACKLOG.md`](GEOCODE-BACKLOG.md)** — auto-generated cross-city geocode to-do list
  (`python3 tools/geocode-status.py`). Re-run after every geocode wave; it's the queue for the browser
  helper pass.

## Per-city audit trail (the replication contract)
Each `data/<city>-research/` carries, per [PIPELINE.md](PIPELINE.md):
- **`AUDIT.md`** — append-only ledger, one section per stage (sources → places → fact-check → re-rank →
  location-verify → build). How each stage was done, with source + date.
- **`RESUME.md`** — current state + next actions + acceptance checklist. Read this first to continue.
- **`_AGENT_BRIEF.md`** — the standing brief every research agent for that city follows (ranked source
  palette, the ≥2-sources-of-truth rule, area ids, the food-canon opening move).
- **`consolidate.py`** — merges the dir's research JSONs into `<city>.dataset.json` (areas, cuisines,
  collections, `P`/`F`, source tables).

## The gates — same for every city, enforced in code
```bash
node tools/research.js --sourcecheck <city-key>   # ≥2 credible sources (or lone Michelin/JB); Yelp=0
node tools/research.js --geocheck    <city-key>   # every pin fact-checked + sourced
node tools/research.js --statuscheck <city-key>   # every open/closed status sourced & consistent
node tools/research.js --buildcheck  <city-key>   # map centre + labels match THIS city's pins (no wrong-city page)
python3 tools/sourcecheck.py data/<city>.dataset.json   # same sources gate, standalone
python3 tools/geocode-status.py                    # refresh the cross-city geocode backlog
cd tools && npm run validate && npm test           # data integrity + no-CDN behaviour
```
The dataset-built `tools/build-<city>.py` enforces the same rules at build time: **GATE 1** drops any
place with <2 credible sources (Yelp=0), **GATE 2** drops any place without a sourced pin — so a
published page provably cannot contain an under-sourced or un-located place.

## Adding a new city / region (what was done for San Francisco)
1. `data/<city>-research/` with `consolidate.py` (areas + cuisine/collection taxonomy), `_AGENT_BRIEF.md`,
   `AUDIT.md`, `RESUME.md`.
2. `tools/build-<city>.py` (clone an existing dataset build; swap the page/key/dataset paths). **The
   map centre + on-map labels are DERIVED from the geocoded pins — do NOT hardcode coordinates.** The
   only per-city text to write by hand is the prose (eyebrow, H1, standfirst, meta, search placeholders,
   footer, cuisine appendix); after building, run `--buildcheck` — it FAILs if the map geography still
   points at the city you cloned from. (This is why SF once shipped centred on San Jose; it can't now.)
3. `data/sources.json` entry (credible outlets + rationale); empty `data/geocodes.json` city entry.
4. Register the key in `tools/research.js` `PAGE_FOR` + `DATASET_FOR`, and in `DATASETS` in
   `tools/geocode-status.py`.
5. `index.html` "being built" card (relink to a live card only after the page builds + gates pass).
6. Then run the pipeline in order (PIPELINE.md): discovery waves → sourcing → fact-check →
   location-verify → build & gate → render-verify. Append to `AUDIT.md` every wave.
