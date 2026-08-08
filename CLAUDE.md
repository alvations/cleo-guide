# Project context for Claude Code

Travel field guides where every place is traceable to the source that recommended it, on interactive
maps. No build step, no framework, no backend.

## Repository layout (multi-city)

- `index.html` — the **city chooser** hub + "suggest a city" feedback box (files GitHub issues).
- `cleveland.html` — the complete **Cleveland** guide (143 sights + 40 food). **The validator and
  tests read this file**, not `index.html`.
- `cities/youngstown.html` — the **Youngstown** shortlist, rendered on Google Maps.
- `data/sources.json` — central, reusable **sources registry** (source types + per-city ranked,
  fact-checked sources and creators + a national creators catalogue).
- `tools/research.js` — the **research pipeline** (`node research.js "City" "ST"`, `--validate`,
  `--list`). Order is fixed: search → rank → fact-check → build. See `docs/SOURCES.md`.
- Web access here: **`WebSearch` works; `WebFetch`/direct fetches are blocked by the org egress
  policy** — do not try to route around it. Research via search results; record `researchedVia`.

---

## Ground rules

**1. Run both checks before every commit. Not one — both.**

```bash
cd tools && npm install    # first time only
npm run validate           # content integrity
npm test                   # behaviour, with and without the map library
```

**2. Assert on record counts inside any script that edits `cleveland.html`.**

A find-and-replace once deleted 143 records from this file and the result was still *valid
JavaScript that parsed cleanly*. Syntax checks cannot catch content loss. Any script that
rewrites the file must count records before and after, and refuse to write on a mismatch:

```python
n0 = h.count('Soldiers')
# ...edits...
assert h.count('Soldiers') == n0, "records lost"
open('cleveland.html','w').write(h)
```

**3. Never use `document.write` for a script fallback.** Malformed escaping produced
`<\/script>` here once and silently swallowed the entire page whenever the CDN was blocked.
Append a script element and use `onload` / `onerror`.

**4. Content must never depend on a CDN.** The guide renders immediately; the map mounts
separately via `mountMap()` if Leaflet arrives. A blocked CDN costs a map, not a page.
`npm test` covers this explicitly — do not weaken it.

**5. Wrap every `localStorage` call in try/catch.** The guide is expected to run in sandboxes
where storage throws. It degrades to in-memory; keep it that way.

---

## Where things live

Everything is in `cleveland.html`. Data is plain JS literals near the top of the final `<script>`.

| What | Identifier |
|---|---|
| Sight records | `const P` |
| Food records | `const F` (adds a `cz` cuisine array) |
| Sight sources | `const S` · Food sources | `const FS` |
| Areas / marker colours | `const AREAS` / `const AC` |
| Cuisines | `const CUISINES` |
| Ranking | `score()`, `cites()`, `PRESETS` |
| Base layers | `const BASES`, `setBase()` |

Full field reference: [docs/DATA-SCHEMA.md](docs/DATA-SCHEMA.md)

## Invariants the validator enforces

- Every numbered source entry present — **News 5 all 100, There She Goes all 23**. Losing one
  breaks the guide's central promise.
- No duplicate names across `P` and `F`.
- Every coordinate inside the bounding box in `tools/validate.js`.
- At least one tier-1 must-see per area, or the must-see filter yields an empty region.
- No `document.write` anywhere.

## Editorial rules — do not quietly change these

- **Tiers are graded within each region, not across the city.** Ranking globally clusters
  everything downtown and makes the filter useless elsewhere.
- **Closed places stay**, flagged. Lolly the Trolley, Sokolowski's, Hot Sauce Williams.
- **Gaps are stated, not filled.** The Middle Eastern card says outright that Cleveland has no
  Persian restaurant meeting the bar. Do not replace that with a mediocre suggestion.
- **Cuisine tags require a named dish**, not a label. "Singapore noodles" disqualifies a place.
- **Attribution is honest.** `ADD` / `FADD` mean added from general knowledge. Never relabel
  those as sourced.
- The chess collection is at **325 Superior Ave NE**. News 5 prints 525; that is wrong and the
  card says so.

## Deploy

GitHub Pages, `main` / root. `.nojekyll` is present. No Actions workflow needed.

## Read before large changes

- [docs/RESEARCH-LOG.md](docs/RESEARCH-LOG.md) — every search, fetch, dead end, extension technique
- [docs/DECISIONS.md](docs/DECISIONS.md) — 16 judgement calls with rejected alternatives
- [docs/RECREATE.md](docs/RECREATE.md) — doing this for another city
- [versions/v1-shortlist/RECREATE-NATIVE-MAP.md](versions/v1-shortlist/RECREATE-NATIVE-MAP.md)
