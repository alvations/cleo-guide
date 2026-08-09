# Field Guides — Cleveland &amp; Youngstown

Offline-capable travel guides where every place is **traceable to the source that recommended it**,
on interactive maps with filters, trip builders and exports to Google and Apple Maps. Cleveland is
the complete edition (143 sights + 40 places to eat); Youngstown is a web-researched, fact-checked
shortlist. `index.html` is now a **city chooser** with a box to suggest the next city.

No build step. No framework. No backend. Plain HTML — a chooser at `index.html`, one self-contained
page per city (`cleveland.html`, `cities/youngstown.html`).

## Documentation

| Doc | Read it for |
|---|---|
| **[docs/RESEARCH-LOG.md](docs/RESEARCH-LOG.md)** | Every search, fetch, dead end and extension technique — **start here to repeat the process** |
| **[docs/DECISIONS.md](docs/DECISIONS.md)** | All 16 judgement calls with reasoning and rejected alternatives |
| **[docs/METHODOLOGY.md](docs/METHODOLOGY.md)** | The rules that governed sourcing, ranking and licensing |
| **[docs/RECREATE.md](docs/RECREATE.md)** | 10-step sequence for a different city |
| **[docs/AI-WORKFLOW.md](docs/AI-WORKFLOW.md)** | Prompts and constraints for doing the research with an assistant |
| **[versions/v1-shortlist/RECREATE-NATIVE-MAP.md](versions/v1-shortlist/RECREATE-NATIVE-MAP.md)** | Rebuilding the routed map that worked first, with a replay-ready payload |
| **[docs/DATA-SCHEMA.md](docs/DATA-SCHEMA.md)** | The record format |
| **[docs/TESTING.md](docs/TESTING.md)** | Testing a page with no build system |

## Start here

- **[Choose a city](index.html)** — the landing page: pick Cleveland or Youngstown, or suggest the next city.

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

- **[Youngstown, Ohio](cities/youngstown.html)** — 28 sights and 22 places to eat, drink, shop &amp; pick across
  the Mahoning Valley (Wick Avenue's museums, all of Mill Creek Park, the downtown halls, breweries, Brier Hill
  pizza, Warren's Dave Grohl Alley, a strictly-curated **Markets** category — the Youngstown Flea, Rogers flea
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
- **Three filter axes** — area, source, and rank — plus full-text search.
- **Cuisine sub-filters** in food mode: Vietnamese, Singaporean, Southeast Asian, Chinese,
  Unique American, European, Latin American, Middle Eastern, desserts, and on-TV.
- **Trip builder.** Tick anything, or use presets (top 10, top 20, top 5 per area, top 10 to eat).
  Export to Google Maps directions, `.kml` for Google My Maps, or `.json`.
- **Visited tracking.** Mark places off; they dim, the pin greys, and presets skip them.
- **Eight base layers.** Five free (dark, streets, light, satellite, terrain) plus three Google
  layers if you add your own API key.
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

## Attribution

Place descriptions are original prose. Every entry links to the source that recommended it;
none are copied. Map data © OpenStreetMap contributors. Imagery © Esri. Basemaps © CARTO.
Business details come from Google Places and change without notice — the guide says so.
