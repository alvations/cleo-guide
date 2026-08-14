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

**4a. Every address and map coordinate MUST be fact-checked against a real source — never from
memory or estimation.** This is a hard rule, no exceptions. Verify each place's street address and
its exact lat/lng against the place's **official site**, **Google/Apple/OpenStreetMap**, or
**Wikipedia's published coordinates**, and record `{address, lat, lng, source, verified date}` in the
central registry **`data/geocodes.json`**. That registry is the single source of truth for
coordinates: the build injects lat/lng from it and **refuses to build a place with no sourced entry**;
`node tools/research.js --geocheck <city-key>` audits coverage and must PASS before publishing. A
coordinate you cannot verify does not go on the map — flag it, leave it out. Because every entry
carries its source and date, pins stay auditable and updatable when a place closes or moves. Full
procedure in [docs/SOURCES.md](docs/SOURCES.md#address--coordinate-verification--a-hard-rule-datageocodesjson).

**4b. After building any city, re-verify pin *placement* — a required step, not a one-off.** A sourced
coordinate can still be the wrong point: a batch of pins once landed ~200 m off because they were read
from a Google Maps **viewport** (`/@lat,lng`) instead of the **place pin** (`!3d<lat>!4d<lng>`). So
every city's pins get audited for placement and the wrong ones fixed **before publishing**, and again
whenever a place is added. Read `!3d!4d`/`daddr@`, never `/@`; grade each pin `high`/`med`/`low` and
upgrade every `low`/misplaced pin to an exact place coordinate; never fabricate — mark `UNVERIFIED`
and let the gate drop it. `WebSearch` is the only geocoding channel here and its budget is shared, so
run re-verify agents sequentially, one wave at a time. Full procedure — including how to read a Google
Maps URL — in [docs/SOURCES.md](docs/SOURCES.md#the-re-verify--fix-pass--a-required-step-for-every-city-not-a-one-off-cleanup).

**4c. Every place's OPEN/CLOSED status MUST be verified against a real source — a permanently-closed
place is never presented as a live suggestion.** A pin on a shuttered business is as wrong as a pin on
the wrong street. Record `{status, statusSource, statusChecked}` in `data/geocodes.json` next to the
coordinate; verify via the place's own site/socials, Google/Apple "Permanently closed", a news
closing story, or the official municipal site — never from memory. **Closed places stay, flagged**
(don't delete them): the name carries a closed marker (`— CLOSED`) so it never reads as "go here
today". `node tools/research.js --statuscheck <city-key>` is a required gate alongside `--geocheck`:
it FAILs if any closed place isn't surfaced as closed (or a `closed` status lacks a source), and
reports how many places still have no closure check so coverage can't lapse. Run the closure-check
pass (sequential `WebSearch` waves) until that count is zero before publishing — for every city, and
on every refresh/extension. Full procedure in
[docs/SOURCES.md](docs/SOURCES.md#openclosed-status-verification--a-hard-rule).

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

- **Food discovery centres on what is UNIQUE to the city — every city, no exceptions.** The core of any
  city's food list is the dishes and drinks *unique or signature to that city* — not a generic "best
  restaurants" list. Before searching, name the city-unique canon (Pittsburgh: pierogi, hoagies, the
  Friday fish sandwich, chipped ham, haluski; Cleveland: Polish Boy, Barberton chicken, pierogi, corned
  beef, lake perch; NYC: the slice, bagels, pastrami, dumplings), then find the hidden-gem places that
  serve them. Source each from references that are **genuinely popular, viral, or uniquely meaningful to
  that city** — the local editorial of record, a beloved city food writer/outlet, or
  influencers/TikTokers/YouTubers/travel bloggers **only when the creator is verifiably popular or
  authoritative** (real following, real track record, a findable piece of content); reject anonymous SEO
  listicles and content farms — *popularity you can't verify isn't popularity.* Then the full pipeline as
  always: vet source → fact-check open/closed → geocode + location-verify → re-rank → gate. **Every city
  gets this same treatment.** Full playbook: [docs/SOURCES.md](docs/SOURCES.md#food--drink-discovery--start-with-what-the-city-is-famous-for-every-city-the-opening-move).
- **Tiers are graded within each region, not across the city.** Ranking globally clusters
  everything downtown and makes the filter useless elsewhere.
- **Closed places stay**, flagged. Lolly the Trolley, Sokolowski's, Hot Sauce Williams.
- **Gaps are stated, not filled.** The Middle Eastern card says outright that Cleveland has no
  Persian restaurant meeting the bar. Do not replace that with a mediocre suggestion.
- **Cuisine tags require a named dish**, not a label. "Singapore noodles" disqualifies a place.
- **A cuisine tag names the RESTAURANT's own tradition — never a single dish it happens to serve.**
  Shared dishes cross cuisines: Hainanese chicken rice is served by Singaporean, Malaysian, Hainanese,
  Thai (*khao man kai*) and Taiwanese kitchens; laksa/char kway teow span Singapore & Malaysia. A
  Taiwanese diner (Wenwen) or a Thai *khao man kai* spot is **not** Singaporean/Malaysian just because
  it plates a shared dish. Categorize by the kitchen's actual origin. This mistake was made once
  (Wenwen mis-filed under Singaporean via a dish-keyword heuristic) — do not repeat it: any
  auto-tagging must key on the **cuisine**, not on dish/description keywords.
- **Cross-tagging overlapping cuisines is allowed only between genuinely-overlapping traditions.**
  Malaysian ↔ Singaporean (Nyonya/Peranakan hawker canon) may carry both `SG` and `MY` so either
  filter surfaces a real hybrid (Nyonya, Kopitiam, Taste Good) — but the trigger is the restaurant
  being Malaysian or Singaporean, never a dish. `tools/build-newyork` /
  `data/newyork-research/consolidate.py` encodes this (`_is_sgmy` keys on cuisine labels only).
- **Attribution is honest.** `ADD` / `FADD` mean added from general knowledge. Never relabel
  those as sourced.
- The chess collection is at **325 Superior Ave NE**. News 5 prints 525; that is wrong and the
  card says so.

## Deploy

GitHub Pages, `main` / root. `.nojekyll` is present. No Actions workflow needed.

## Read before large changes

- [docs/PIPELINE.md](docs/PIPELINE.md) — **the audited pipeline contract**: the fixed order (discover
  sources → extract places → fact-check → re-rank → location-verify → build) and the audit artifact
  each stage must leave in `data/<city>-research/AUDIT.md` so any agent can reproduce or continue the
  work. Follow it for every new city and every refresh.
- [docs/RESEARCH-LOG.md](docs/RESEARCH-LOG.md) — every search, fetch, dead end, extension technique
- [docs/DECISIONS.md](docs/DECISIONS.md) — 16 judgement calls with rejected alternatives
- [docs/RECREATE.md](docs/RECREATE.md) — doing this for another city
- [versions/v1-shortlist/RECREATE-NATIVE-MAP.md](versions/v1-shortlist/RECREATE-NATIVE-MAP.md)
