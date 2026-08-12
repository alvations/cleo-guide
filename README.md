# Field Guides — New York City, Cleveland, Pittsburgh &amp; Youngstown

Offline-capable travel guides where every place is **traceable to the source that recommended it**,
on interactive maps with filters, trip builders and exports to Google and Apple Maps. **New York City**
is the largest edition (500+ places across the five boroughs + day trips); **Cleveland** is the origin
engine; **Pittsburgh** is a full parity edition; **Youngstown** is a fact-checked shortlist.
`index.html` is a **city chooser** with a box to suggest the next city.

No build step for the reader. No framework. No backend. Plain HTML — a chooser at `index.html`, one
self-contained page per city (`cleveland.html`, `cities/newyork.html`, `cities/pittsburgh.html`,
`cities/youngstown.html`). Behind the scenes, a small **research + verification pipeline**
(`tools/research.js`, per-city build scripts, `data/geocodes.json`, `data/sources.json`) makes every
pin auditable and every extension repeatable — see **[Reproduce this](#reproduce-this--add-or-expand-a-city)**.

**Hard rules that keep it honest** (enforced by gates, not vibes): every place's **address + coordinate**
is fact-checked into `data/geocodes.json` and the build refuses an unsourced pin (`--geocheck`); every
place's **open/closed status** is verified and closed places are flagged, never shown as live
(`--statuscheck`); a cuisine tag names the **kitchen's cuisine, not a dish it serves**. Full rules in
[CLAUDE.md](CLAUDE.md) and [docs/SOURCES.md](docs/SOURCES.md).

## Documentation

| Doc | Read it for |
|---|---|
| **[CLAUDE.md](CLAUDE.md)** | **The ground rules** — the hard rules (geocode, status, categorization), invariants, and where the data lives. Read first. |
| **[docs/SOURCES.md](docs/SOURCES.md)** | **The pipeline** — the fixed order (source → fact-check → geocode → build → re-verify → status), the address/coordinate + open/closed hard rules, the food discovery playbook, Mode C seed-expansion, and how to run each gate |
| **[docs/RECREATE.md](docs/RECREATE.md)** | Step-by-step to stand up a **new city** |
| **[docs/RESEARCH-LOG.md](docs/RESEARCH-LOG.md)** | Every search, fetch, dead end and extension technique |
| **[docs/DECISIONS.md](docs/DECISIONS.md)** | All 16 judgement calls with reasoning and rejected alternatives |
| **[docs/METHODOLOGY.md](docs/METHODOLOGY.md)** | The rules that governed sourcing, ranking and licensing |
| **[docs/RECREATE.md](docs/RECREATE.md)** | 10-step sequence for a different city |
| **[docs/AI-WORKFLOW.md](docs/AI-WORKFLOW.md)** | Prompts and constraints for doing the research with an assistant |
| **[versions/v1-shortlist/RECREATE-NATIVE-MAP.md](versions/v1-shortlist/RECREATE-NATIVE-MAP.md)** | Rebuilding the routed map that worked first, with a replay-ready payload |
| **[docs/DATA-SCHEMA.md](docs/DATA-SCHEMA.md)** | The record format |
| **[docs/TESTING.md](docs/TESTING.md)** | Testing a page with no build system |

## Start here

- **[Choose a city](index.html)** — the landing page: pick New York, Cleveland, Pittsburgh or Youngstown, or suggest the next city.

## Cleveland editions

- **[The full guide](cleveland.html)** — the complete guide, 183 places, every source transcribed in full.
- **[The shortlist](versions/v1-shortlist/guide.html)** — the original 19-stop, 3-day shortlist with a routed
  Google My Maps import. Better for a first visit; kept deliberately, not superseded.
- **[The shortlist on Google Maps](versions/v1-shortlist/google-map.html)** — the same 19 stops rendered as a
  routed Google map per day, in the browser. Keyless by default; paste a Google Maps Embed API key for the
  officially supported embed.

## Other cities

Extending the guide to a new city starts with a shortlist page, exactly as Cleveland did — see
[docs/RECREATE.md](docs/RECREATE.md). Sourcing for new cities is centralised and repeatable:
sources live in [`data/sources.json`](data/sources.json) and the search-and-vet flow is codified in
[`tools/research.js`](tools/research.js) — full guide in [docs/SOURCES.md](docs/SOURCES.md).

```bash
cd tools
node research.js "Akron" "OH"          # print the research plan for a new city
node research.js --validate akron-oh   # audit its sources before building a page
```

- **[New York City](cities/newyork.html)** — the largest edition: **500+ places across all five boroughs
  (Manhattan, Brooklyn, Queens, The Bronx, Staten Island) plus regional day trips** (Hudson Valley, Long
  Island, Westchester, NJ). Sourced from **Michelin (stars + Bib Gourmand)**, Eater, The Infatuation, NYT,
  Time Out, Atlas Obscura, Untapped New York, NYC Parks/Tourism and verified local creators. Adds a
  cross-cutting **Collections** filter (Museums, Parks, Iconic Landmarks, Markets & Food Halls, **Pop
  Culture & Screen** — Ghostbusters firehouse, Sanctum Sanctorum, Nintendo/LEGO — Rooftop & Views,
  Speakeasies, Oddities, Free, Family, Arts, Architecture) on top of the borough and cuisine filters, with
  deep food coverage (Singaporean/Malaysian, Cantonese/dim sum, Thai, Vietnamese, Persian, viral spots,
  boba/coffee/dessert, Hainanese chicken rice + wonton noodles). Built by splicing the NYC dataset
  (`data/newyork.dataset.json`) into the Cleveland engine via `tools/build-newyork.py`.
- **[Pittsburgh, Pennsylvania](cities/pittsburgh.html)** — 111 sights and 68 places to eat, drink, shop &amp; pick
  (179 in all, Cleveland-parity), across six regions including **South Hills & the Southwest** and the **Eastern
  Suburbs & River Valleys**: the inclines and the Mount Washington view, the Warhol and Mattress Factory, the
  Carnegie Museums, Zoo and National Aviary, Heinz Chapel and the Cathedral of Learning, the **Carrie Blast
  Furnaces** and the Pump House, the **Pennsylvania Trolley Museum** and Carnegie's Civil War Room, Monroeville
  Mall's *Dawn of the Dead* legacy, Fallingwater and Kennywood, the Strip District, Primanti's, soup dumplings,
  Oakmont Bakery and the burnt almond torte — plus **Triple B Farms** and more in the u-pick **Farms** category.
  Every place is traceable to a credible source — aggregator and guidebook rankings, the official institutions,
  university visitor guides and regional heritage bodies. Same interactive engine as Cleveland; web-researched and
  fact-checked.
- **[Youngstown, Ohio](cities/youngstown.html)** — 40 sights and 22 places to eat, drink, shop &amp; pick across
  the Mahoning Valley (Wick Avenue's museums, all of Mill Creek Park, the downtown halls, breweries, Brier Hill
  pizza, Warren's Dave Grohl Alley, the **Past Times Arcade** pinball museum, the National Packard Museum and the
  restored Robins Theatre, a strictly-curated **Markets** category — the Youngstown Flea, Rogers flea
  market, Amish Market, Northside Farmers Market — and a **Farms** category of visitable u-pick / petting
  farms). Uses the
  **same interactive engine as Cleveland** — one map, area/source/rank filters, cuisine sub-filters, a trip
  builder, visited tracking and Google/Apple/KML/JSON exports — web-researched and fact-checked.
  A [Google-Maps rendering](cities/youngstown-beta.html) of the same shortlist is kept as a **beta** for review.

---

## What it does

- **Two separate maps.** Sights and food never clutter each other; a toggle switches between them.
- **Source attribution on every entry.** Tap a tag to open the original article, with the item
  number where the source numbered its list.
- **Filter axes** — area/borough, source, rank, and (where a city defines them) a cross-cutting
  **Collections** theme filter — plus full-text search.
- **Cuisine sub-filters** in food mode (per city; New York carries the widest set — Singaporean,
  Malaysian, Cantonese & dim sum, Sichuan, Vietnamese, Thai, Korean, Middle Eastern & Persian,
  Jewish deli, desserts, a *Viral* tag, and more).
- **Collections** (New York): a theme axis that cuts across all boroughs — Museums, Parks, Iconic
  Landmarks, Markets & Food Halls, Pop Culture & Screen, Rooftop & Views, Speakeasies, Oddities, Free,
  Family, Arts, Architecture. Backward-compatible: hidden for cities that don't define it.
- **Trip builder.** Tick anything, or use presets (top 10, top 20, top 5 per area, top 10 to eat).
  Export to Google Maps directions, `.kml` for Google My Maps, or `.json`.
- **Visited tracking.** Mark places off; they dim, the pin greys, and presets skip them.
- **Eight base layers.** Five free (dark, streets, light, satellite, terrain) plus three Google
  layers if you add your own API key.
- **Show my location.** A tap drops a "you are here" marker so you can see what's around you. Privacy by
  design: it's a one-time snapshot held only in memory — never stored, never sent anywhere — it persists while
  you filter and zoom, and is gone the moment you refresh.
- **Degrades honestly.** If the map library is blocked, the guide still renders in full and says so.

## Run it

Open `index.html` in a browser. That is the whole procedure.

## Deploy to GitHub Pages

```bash
git init && git add -A && git commit -m "Field guide"
git branch -M main
git remote add origin git@github.com:USER/REPO.git
git push -u origin main
```

Then **Settings → Pages → Source: Deploy from a branch → `main` / `(root)`**.

The site appears at `https://USER.github.io/REPO/`. The `.nojekyll` file is already present so
Pages serves the directory as-is rather than running it through Jekyll.

Nothing else is required — no Actions workflow, no build.

## Develop

```bash
cd tools
npm install
npm run validate   # data integrity — run before every commit
npm test           # behaviour, both with and without the map library
```

Both must pass before pushing. `validate.js` exists because a careless find-and-replace once
silently deleted 143 records while leaving the file syntactically valid.

## Reproduce this — add or expand a city

Everything here is reproducible from a fresh clone with the committed tooling and data. The pipeline
order is fixed (do not reorder):

```
search → rank sources → FACT-CHECK (incl. open/closed) → geocode → build → RE-VERIFY pins + status → publish
```

**Central, auditable data (the single sources of truth):**
- `data/sources.json` — ranked, credibility-vetted sources + creators per city, and reusable source
  types (incl. `michelin_guide`, `james_beard`, `food_media`, `screen_location`, `municipal_gov`).
- `data/geocodes.json` — every place → `{address, lat, lng, source, verified, confidence, status,
  statusSource, statusChecked}`. The build injects lat/lng from here and **refuses to place a pin with
  no sourced entry.** Closed places carry `status:"closed"` and are flagged, never dropped.

**The gates (run before publishing; all must pass):**
```bash
cd tools && npm install
node research.js --validate  <city-key>   # sources: required types present, a rank-1 primary, fact-checked
node research.js --geocheck  <city-key>   # every place has a sourced address+coordinate; lists low/ungraded pins
node research.js --statuscheck <city-key> # every open/closed status is sourced; closed places surfaced
npm run validate && npm test              # content integrity + behaviour (with and without the map CDN)
```

**Add a NEW city (Mode A):** `node research.js "City" "ST"` prints the research plan → run the searches,
rank + fact-check sources into `data/sources.json` → fact-check every place's address, coordinate and
open/closed status into `data/geocodes.json` → build the page from the Cleveland engine → run the gates.
Full checklist in [docs/SOURCES.md](docs/SOURCES.md) and [docs/RECREATE.md](docs/RECREATE.md).

**EXPAND a city (always the full flow — never just add names):**
`source (vet credibility) → fact-check open/closed → add → geocode + location-verify every new pin →
re-rank tiers within region → rebuild → gate.`
- **Seed-place / Mode C:** `node research.js --seed "<Place>" <city-key>` — you name places; the flow
  finds the credible sources that list them, mines those sources for more, fact-checks, geocodes, re-ranks.
- **Food-heavy cities** additionally run a targeted-cuisine deep-dive and a viral/pop-up pass (see the
  food playbook in docs/SOURCES.md). **Categorize by the kitchen's cuisine, never by a dish it serves.**

**Geocoding in a locked-down environment:** map/tile hosts may be blocked; the coordinate is read from
published sources via search — Wikipedia infobox coords for landmarks, Google Maps **place pins**
(`!3d<lat>!4d<lng>` / `daddr=…@lat,lng`, never the `/@` viewport), or Apple Maps `coordinate=` for
restaurants. Anything that won't resolve goes into `tools/geocode-helper.html` — a browser page that
geocodes the leftovers against OSM/Nominatim; paste its JSON back and merge into `data/geocodes.json`.

**Per-city build scripts** (regenerate a page from the engine + data; portable, repo-relative paths):
```bash
python3 tools/build-newyork.py       # New York  (reads data/newyork.dataset.json + data/geocodes.json)
python3 tools/build-pittsburgh.py    # Pittsburgh
python3 tools/build-youngstown.py    # Youngstown
```
New York's dataset is assembled from per-topic research files by
`data/newyork-research/consolidate.py` (normalizes cuisines, assigns Collections, cross-tags
Malaysian↔Singaporean by cuisine — the reference for correct categorization). Cleveland is the base
engine (`cleveland.html`); the validator and behaviour tests read it.

## Attribution

Place descriptions are original prose. Every entry links to the source that recommended it;
none are copied. Map data © OpenStreetMap contributors. Imagery © Esri. Basemaps © CARTO.
Business details come from Google Places and change without notice — the guide says so.
