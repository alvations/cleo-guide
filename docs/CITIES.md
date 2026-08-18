# Cities & regions — master index

The single entry point to every guide in this repo: what exists, where its artifacts live, and the
exact commands to verify or continue it. **A different agent should be able to read this file and
reproduce or extend any city's pipeline.** Pair it with [PIPELINE.md](PIPELINE.md) (the fixed stage
order + audit contract) and [RECREATE.md](RECREATE.md) (doing it for a brand-new city).

_Counts are as of 2026-08-18; re-derive anytime with the commands below — never trust a stale number._

| City / region | Page | Built dataset | Research dir (audit trail) | Places on page | State |
|---|---|---|---|---|---|
| Cleveland OH | `cleveland.html` (the engine) | inline in page | `data/cleveland-research/` | 188 | live |
| Pittsburgh PA | `cities/pittsburgh.html` | inline | `data/pittsburgh-research/` | 212 | live · 1 low pin to re-verify |
| Youngstown OH | `cities/youngstown.html` | inline | — | 62 | live (shortlist) |
| New York NY | `cities/newyork.html` | `data/newyork.dataset.json` | `data/newyork-research/` | 508 | live · 1 place to geocode |
| Silicon Valley CA | `cities/siliconvalley.html` | `data/siliconvalley.dataset.json` | `data/silicon-valley-research/` | 152 | live · 19 UNVERIFIED pins pending helper |
| San Francisco & Peninsula CA | `cities/sanfrancisco.html` | `data/sanfrancisco.dataset.json` | `data/san-francisco-research/` | 141 | live · 7 UNVERIFIED pins pending helper |
| Cincinnati OH (+ NKY) | `cities/cincinnati.html` | `data/cincinnati.dataset.json` | `data/cincinnati-research/` | 109 | live · 23 UNVERIFIED pins pending helper |
| Columbus OH | `cities/columbus.html` | `data/columbus.dataset.json` | `data/columbus-research/` | 62 | live · 23 UNVERIFIED pins pending helper (8 food un-geocoded) |
| Dayton OH (+ Miami Valley) | `cities/dayton.html` | `data/dayton.dataset.json` | `data/dayton-research/` | 56 | live · +4 merit-vetted Asian (Wat Da Pho pinned; China Cottage/Little Saigon/Kabuki pending helper) · 22 UNVERIFIED pins; Aullwood + Third Perk (1-source) held |

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
