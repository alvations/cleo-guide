# RFC — Beta architecture (Wave 0)

**Lane:** tech lead / platform · **Status:** accepted for Wave 1 (decisions are recorded here, per the
charter, and can be superseded by a later RFC revision) · **Date:** 2026-10-10 · **Backlog:** M0-02, M0-03,
and the platform parts of M1-06, M1-20, M2-01, M2-04, M2-07–M2-09, M3-01, M3-06.

**Read with:** [`docs/BETA-PROGRAM.md`](../../docs/BETA-PROGRAM.md) (charter),
[`docs/BETA-BACKLOG.md`](../../docs/BETA-BACKLOG.md), [`docs/BETA-DECISIONS.md`](../../docs/BETA-DECISIONS.md),
[`docs/BETA-BENCHMARK.md`](../../docs/BETA-BENCHMARK.md) and `CLAUDE.md` (rules 1–5, 4-ai, 4a–4c).

---

## 0. Summary

Beta is a **new, static, data-driven site** under `beta/`. One generator,
[`tools/beta/build.js`](../../tools/beta/build.js) (`npm run beta`), does five things:

1. It reads the records each **live page actually renders**.
2. It normalises them into a place model with **stable ids**.
3. It emits:
   - server-rendered pages;
   - per-page JSON;
   - a site-wide search index;
   - a PWA shell.
4. It **refuses to write anything** unless every generated page carries exactly its live page's places, by count *and* by name.
5. Output is deterministic, so `npm run beta:check` proves beta is reproducible from data.

Pages not yet migrated stay on the legacy re-skin (`tools/beta-restyle.py`), which now skips anything the
new generator owns.

Wave 0 ships the skeleton end to end:

| Item | Detail |
|---|---|
| `beta/index.html` | A new landing page. |
| `beta/cities/tokyo.html` | A new city page with all 488 places. |
| `beta/saved.html` | Saved places. |
| `beta/data/places/*.json` | 84 per-page datasets holding 8,458 places. |
| `beta/data/search.json` | The site-wide search index. |
| `beta/sw.js` and `beta/manifest.webmanifest` | The PWA shell. |
| Vendored Leaflet | The map library, served from beta itself. |
| `tools/beta/test-beta.js` | Wired into `npm test`. |

### Decisions at a glance

| # | Decision | Section |
|---|---|---|
| R-01 | **Source of truth = the records embedded in each built live page** (`const P/F/S/FS/AREAS/CATS/CUISINES/AC`), not the datasets. `data/geocodes.json` adds provenance only. | §2 |
| R-02 | The generator is **Node, no dependencies**. It extracts each literal by bracket-matching and evaluates that literal alone in an empty `vm` context. No page code runs. | §3.1 |
| R-03 | **Stable place id** = a slug of the name with the closed marker removed, de-duplicated per page. Ids are never array indices. | §3.2 |
| R-04 | **Every place is server-rendered** into the HTML, so the page is complete with no JS and no network. JS adds lenses: filters, map, saved lists. | §4, §5 |
| R-05 | **Build in memory, gate, then write.** Any count, name, JSON-LD or guard failure aborts the whole build, and nothing is written. | §7.1 |
| R-06 | **Deterministic output** (no timestamps, content-hashed asset URLs). `--check` is a reproducibility test and runs in `npm test`. | §3.3 |
| R-07 | **Ownership manifest** `beta/data/manifest.json` (`generated[]`). `beta-restyle.py` skips those pages, so the two systems coexist page by page. | §3.4 |
| R-08 | **Leaflet 1.9.4 is vendored** into `beta/assets/vendor/leaflet/` from the pinned npm package and lazy-loaded after first paint. Tiles come from OSM and Esri only. | §5.4 |
| R-09 | **Hash routes, not paths:** `#p=<id>`, `#c=`, `#cz=`, `#mode=`, `#q=`, `#list=`, `#day=`. Every `href="#…"` in markup must be a real element id. JS-only actions are `<button>`s. | §4.2 |
| R-10 | **JSON-LD `ItemList`** of `TouristAttraction`/`Restaurant` covers **open** places only, per D-21. It carries no rating, review, price or hours fields. | §6.4 |
| R-11 | **Service worker:** precache the shell; navigations are network-first; data is stale-while-revalidate; cross-origin requests, tiles included, are never intercepted. | §6.3 |
| R-12 | **Per-page JSON ships as an app asset** with no licence claim (D-24), alongside a lazy site-wide index with a budget of ≤ 250 KB gzip. | §6.1–6.2 |
| R-13 | **Imagery is a gated registry** (LP-02), modelled on `geocodes.json`. Beta only *reads* committed thumbnails and credits. No photo is fetched at build time. | §6.7 |
| R-14 | **Map-surface guard lists are read from `tools/engine_guard.py`**, not re-typed, so the beta build gate cannot drift from rule 4-ai. | §7.2 |

---

## 1. Constraints this design answers

The constraints come from the charter and `CLAUDE.md`:

- **Keep every place.** Beta == live per page, asserted at build and in `npm test`.
- **Never write live data.** Beta reads `index.html`, `cleveland.html`, `cities/`, `Singapore/`, `Vietnam/`, the country hubs, and `data/{countries,geocodes}.json`. It never writes them.
- **No server.** All platform work happens at build time or in the client.
- **No CDN dependency.** All CSS and JS are same-origin, Leaflet included. Fonts fall back to system faces. There is no `document.write`. Every `localStorage` call is wrapped.
- **OSM and Esri tiles only.** No Google and no key-required host.
- **Reproducible.** No hand-edited beta pages. Every generated file says so in a header (M0-03).

## 2. Source of truth (R-01)

### 2.1 Options considered

| Option | Pro | Con | Verdict |
|---|---|---|---|
| A. `data/<city>.dataset.json` | Structured, already JSON | **Not what live shows.** Builders drop places that fail GATE 1 (≥ 2 credible sources) and GATE 2 (verified pin), and they inject coordinates from `geocodes.json`. Tokyo's dataset has **552** records against **488** on the page, and Chicago's has 510 against 367. Cleveland, Pittsburgh, Youngstown and the Singapore and Vietnam pages are not one-to-one with a dataset. Re-running the gates in beta would duplicate live logic and drift. | Rejected |
| B. Re-run the live builders into a temp dir | Exact | Builders write live paths and depend on Python-side config, which risks touching live. Slow. | Rejected |
| **C. The literals in the built live page** | **Exactly what live renders, by construction.** It is uniform across all 84 place pages, because all of them are Cleveland-engine clones with the same `const` names. Beta inherits every gate decision live made. | Couples to the engine's literal names. Mitigated by a tolerant extractor and a test that runs over every page. | **Chosen** |

Supporting reads:
- **`data/geocodes.json`** is joined by `(geoKey, name)` and adds only `pv.status`, `pv.checked` (status-check date) and `pv.pin` (confidence). A miss adds nothing, and nothing is guessed.
- **`data/countries.json`** and the **live hub links** define country membership and order.
- **Method notes** come from the live page, including the stated gaps (`GAPS`). They are the engine's `srcrow` string literals and are carried verbatim. The engine's own "BASE MAPS" row is dropped, because it names a tile host beta does not use.
- **Prose** comes from the live page: `<title>`, description, H1 main and thin, eyebrow and standfirst.

### 2.2 Page map

There are 91 live pages:
- 84 place pages;
- 5 country hubs (Japan, Germany, Belgium, Singapore, Vietnam);
- the Singapore archive hub;
- the root.

The full table is in **Appendix A**, regenerated by `node tools/beta/build.js --list` and stored machine-readably in `beta/data/manifest.json`.

| Kind | Live pages | Beta source | Generator today |
|---|---|---|---|
| Landing | `index.html` | `countries.json`, the live hub links, and the counts of every place page | **new** |
| City (engine) | `cleveland.html` and 33 `cities/*.html` | the live page's records | **new** for Tokyo; mirror for the rest |
| City (pastel) | 47 `Singapore/*.html` and 3 `Vietnam/*.html` place pages | the live page's records (same engine literals) | mirror |
| Country hub | `Japan/`, `Germany/`, `Belgium/`, `Singapore/` and `Vietnam/` index pages | `countries.json`, hub links and counts | mirror; **Japan is not in beta yet** |
| Archive hub | `Singapore/singapore-old.html` | hub links and counts | mirror |
| Saved | none (new) | client, plus `search.json` | **new** |

Two notes on membership:
- **Pages a live hub does not link.** Twenty-one Singapore towns are reachable on live only via town-to-town links or the archive. The beta landing lists each of them under "More in {country}", so every place page in a live country is reachable from the landing (tested).
- **Non-live countries.** SEA pages of countries marked `live:false` (Malaysia, Thailand and others) stay reachable only through the archive, as on live.

## 3. Generation pipeline

```
live pages ──extract.js──▶ literals (P,F,S,FS,AREAS,CATS,CUISINES,AC) + meta + notes
                │
geocodes.json ──┤ registry.js: one row per live page {live, beta, key, kind, gen, country, geoKey}
countries.json ─┘
                ▼
           model.js: normalise → stable ids, closed flag, provenance        ← assert |model| == |live|
                ▼
   render/*.js (landing, city, saved; hub/method next) + jsonld + data indexes
                ▼
           guards.js: counts · name multiset · ids unique · JSON-LD == open · no document.write
                      · no third-party <script>/<link> · engine_guard lists                ← refuse on any error
                ▼
           write (or --check: diff against disk)
```

| File | Owner | Role |
|---|---|---|
| `tools/beta/build.js` | Platform | Entry point. Its flags are `--list`, `--check` and the self-test env var `CLEO_BETA_SELFTEST_DROP`. |
| `tools/beta/pages.json` | Shared (one line per migration) | The live pages owned by the new generator. |
| `tools/beta/lib/extract.js` | Platform | Reads the live page: bracket-matched literals, evaluated in an empty `vm`, plus meta and notes. |
| `tools/beta/lib/registry.js` | Platform | Builds the page inventory, country membership and geocode key. |
| `tools/beta/lib/model.js` | Platform | Holds the place model, stable ids and source labels. |
| `tools/beta/lib/guards.js`, `lib/forbidden.js` | Platform | The write gate. |
| `tools/beta/lib/html.js` | Platform | Escaping, a prose allow-list (`br/b/strong/i/em/a`), and safe inline JSON. |
| `tools/beta/lib/sw.js` | Platform | The service worker template. |
| `tools/beta/lib/render/common.js` | Platform | `<head>`: meta, canonical, OG, manifest, styles, JSON-LD, core script. |
| `tools/beta/lib/render/shell.js` | **FE-B** | Skip link, site bar, footer. |
| `tools/beta/lib/render/landing.js` | **FE-B** | Landing page. |
| `tools/beta/lib/render/city.js` | **FE-A** | City page. |
| `tools/beta/lib/render/saved.js` | **FE-A** | Saved page. |
| `tools/beta/client/*.js` | per lane, §9 | Client JS, copied to `beta/assets/js/` with a header and content-hashed `?v=` URLs. |
| `tools/beta/test-beta.js` | Platform (QA extends) | The gate in `npm test`. |

### 3.1 Extraction (R-02)

The extractor works in three steps:
1. Find the inline `<script>` that declares `const P = [`.
2. For each name, bracket-match the literal. The matcher is string-, comment- and template-aware.
3. Evaluate the literal alone with `vm.runInNewContext('(' + literal + ')', {})` and a 5 s timeout.

No page code runs, there is no DOM, and there is no network. The survey over all 84 place pages is clean. `pageNotes()` evaluates each note body as the single-quoted JS string it is, so `—` and similar escapes decode correctly.

### 3.2 Place model and stable ids (R-03)

```js
{ id, kind: 'sight'|'food', t, a, n, ad, la, ln, w, k, g[], cz[], s[[sourceKey, url]],
  closed?: true, warn?, pv?: { status, checked, pin } }
```

**Ids.**
- The id is `slugify(name without "— CLOSED")`:
  - ASCII-folded;
  - native-script asides such as "(東京駅)" dropped;
  - at most 60 characters.
- On a collision, the area id is appended, then a counter.
- If the slug comes out empty (an all-CJK name), the id is `p-<fnv1a(name)>`.
- Ids are unique per page. A global reference is `<pageKey>/<id>`, where pageKey is, for example, `tokyo` or `singapore/toa-payoh`.

**Why name-based.**
- Live ids (`s12`, `f3`) shift whenever a city is rebuilt.
- A place that closes keeps its id, its links and its saves.

**Known limit.** A live rename changes the id. The Wave 2 mitigation (platform) is this:
- `--check` diffs ids against the previous `beta/data/places/*.json`;
- it emits an alias map `beta/data/aliases.json` (`old → new`) when a place disappears and a near-identical name appears in the same area;
- the router resolves aliases.

**Closed places.**
- A place is closed when:
  - the live record has `closed:1`; or
  - its name has the marker; or
  - `geocodes.json` says `closed`.
- Closed places are kept and sorted last in their area.
- The card says "Closed — kept for the record" and **never shows a tier label**.
- They are excluded from JSON-LD (D-21) and will be excluded from day plans (M2-06).

**Source labels.**
- Labels are taken verbatim from the page's `S`/`FS` registry. Case is left to CSS, because folding would mangle UNESCO, JNTO and similar.
- `ADD`/`FADD` render as "Added by the guide (general knowledge)", which is honest attribution.

### 3.3 Determinism (R-06)

- The generator writes no timestamps.
- Iteration order is stable.
- Assets are content-hashed (`?v=<sha1:10>`), and the service-worker cache name is derived from those hashes.

Two consequences:
- `npm run beta` run twice gives byte-identical output.
- `npm run beta:check` builds in memory and fails on any difference from disk. This covers a live rebuild that changed a city without regenerating beta.

Out of scope for `--check`: binary renders that need Chromium (OG PNGs, §6.5) and committed image thumbnails (§6.7). They are read if present and never regenerated during `--check`.

### 3.4 Coexistence with the legacy re-skin (R-07)

**Rule:** a beta path has exactly one writer.

1. `tools/beta/pages.json` lists the pages the new generator owns.
2. The generator writes `beta/data/manifest.json`, whose `generated[]` holds those pages plus `saved.html`.
3. `tools/beta-restyle.py` reads that manifest and **skips** every page in it, for both write and `--check`. It still rewrites links on mirror pages to point at the same beta paths, so a mirror page links straight into a new page.
4. **To migrate a page:** add it to `pages.json` (plus a renderer, if it is a new kind) and run `npm run beta`. No other step is needed. When every page is migrated, `beta-restyle.py` and its mirror outputs are deleted in one commit.

New pages keep the **same URL path** as the mirror page they replace, so links, bookmarks and the deploy branch layout do not change.

## 4. Page model

### 4.1 Pages

| Page | Path | Lane | Content (all server-rendered unless noted) | Status |
|---|---|---|---|---|
| Landing | `beta/index.html` | FE-B | Masthead with computed totals. Country sections (live countries in `countries.json` order), each with destination cards: name, dek, computed counts. A "More in {country}" list. Site search results (client). Archive link. | **Wave 0 skeleton** |
| Country hub | `beta/<Country>/index.html` | FE-B | The country intro and its destination cards. Same component as the landing section. | Wave 1 |
| City | `beta/cities/<x>.html`, `beta/Singapore/<x>.html`, `beta/Vietnam/<x>.html` | FE-A | Masthead with computed counts and last status check. Collection rail (JS-revealed). Toolbar (JS). Area nav. **Every place card, grouped by area.** Map pane. About. Method notes, including stated gaps. JSON-LD. | **Wave 0 skeleton (Tokyo)** |
| Place deep link | `…/<city>.html#p=<id>` (or `#p-<id>`) | FE-A | Not a separate file. The card is the anchor, and the detail sheet opens on top (M1-12). | Wave 0 anchor; sheet in Wave 1 |
| Source view | `…/<city>.html#src=<KEY>` | FE-A | "Everything {source} recommends here (n)" (M1-10). | Wave 1 |
| Saved | `beta/saved.html` | FE-A | "Your list", grouped by guide, with share links (`#list=`). Client-rendered by nature. | **Wave 0 skeleton** |
| Day plan | `…/<city>.html#day=<area>[:ids]` | FE-A | A computed 4–6 stop plan (M2-06) on the city page. | Wave 2 |
| Method | `beta/how-we-choose.html` | FE-B | Merit bar, tiers and gates, with stats computed by the generator (M1-09). | Wave 1 |
| Accessibility | `beta/accessibility.html` | FE-B | M2-12. | Wave 2 |

**Why no per-place HTML files.**
- 8,458 extra files would be needed, and every one would have to stay in count parity with its city.
- The anchor plus JSON-LD `url` gives each place an addressable, shareable URL without that.
- If SEO evidence later justifies per-place pages, they can be generated from the same model with the same gate.

### 4.2 URLs and routes (R-09)

| Route | Meaning | Where |
|---|---|---|
| `#p=<id>` | Open or highlight a place. Filters yield if the place is hidden. This is the canonical share form. | city |
| `#p-<id>` | The real element anchor (card title link). Works with no JS. JS treats it as `#p=`. | city |
| `#c=<CAT>` / `#cz=<CUISINE>` | Collection or cuisine lens | city |
| `#mode=sights\|food` | Sights or Eat & drink | city |
| `#q=<text>` | Text lens inside a city | city |
| `#src=<KEY>` | Source view (M1-10) | city (Wave 1) |
| `#day=<AREA>[:<id>,<id>…]` | Day plan (M2-06) | city (Wave 2) |
| `#area-<AREA>` | Plain in-page anchor to an area section | city |
| `?q=<text>` | Site-wide search | landing |
| `#list=<page>:<id>,<id>;<page>:<id>` | A shared list. The grammar lives in `Cleo.listCodec`. A 50-place list is about 1.3 k characters, which meets M2-04's ≤ 2,000. | saved |

Route parameters combine with `&`, for example `#mode=food&p=isegen`. **Markup contract:** QA's link checker reads every `href="#x"` as an anchor that must exist. So JS-only actions (rail tiles, mode buttons, "All") are `<button>`s, and the only hash links in markup are real ids. Wave 0 hit exactly this: QA FAILed the Tokyo skeleton on `#c=` links until they became buttons.

## 5. Client architecture

### 5.1 Principles

- **Vanilla ES2017 classic scripts**, with no modules (they break on `file://`), no framework and no runtime build.
- One global, `window.Cleo`, is defined by `core.js`, which loads in `<head>` with `defer`. Each page script (`city.js`, `landing.js`, `saved.js`) is `defer`red at the end of `<body>`.
- **The content is the HTML.** Scripts only enhance it. A script error costs a feature, never a place.
- **Lenses, not gates.** Filters set `hidden` on cards and never remove them. "All N" is always one tap away. A deep link to a hidden place makes the filters yield.

### 5.2 Modules

| File | Lane | Provides |
|---|---|---|
| `core.js` | Platform | `Cleo.root`, `Cleo.store` (try/catch with an in-memory fallback), `Cleo.saved`, `Cleo.listCodec`, `Cleo.route` (parse, href, go), `Cleo.share` (Web Share, else clipboard), `Cleo.searchIndex()` (lazy fetch), `Cleo.search()` (accent-folded, all matches, never truncated), `Cleo.emit`, the saved-count badge, and SW registration on http(s) only. |
| `city.js` | FE-A | Toolbar (modes and text lens), rail, routing, saved toggles, map mount and marker sync. Wave 1 adds the sheet, tray, source view and split-view sync. |
| `landing.js` | FE-B | Search results for `?q=` and typing. |
| `saved.js` | FE-A | "Your list", share, save-all from a shared link. |
| *planned* `search.js` | FE-B | The header search dropdown on every page (M2-09). |
| *planned* `sheet.js`, `tray.js`, `day.js` | FE-A | M1-12, M1-07, M2-06. Split out once `city.js` passes about 15 KB. |

Storage keys use the versioned `cleo:v1:` prefix:

| Key | Holds |
|---|---|
| `cleo:v1:saved` | `{ "<page>/<id>": {t} }` |
| `cleo:v1:lists` | Named lists (Wave 1) |
| `cleo:v1:days` | Day plans (Wave 2) |
| `cleo:v1:interests` | Interests (M2-05) |

Any schema change bumps the version, with a one-shot migration in `core.js`.

### 5.3 Progressive rendering, with every place reachable

- **Wave 0** server-renders every card. Each `section.area` carries `content-visibility:auto` with an intrinsic size, so off-screen areas cost no layout or paint. Tokyo then has **6,610 elements** (live Tokyo: about 7,400), 639 KB raw and 121 KB gzip.
- **M3-06, as built in Wave 2 (R-24, supersedes the `<template>` + `?all` plan).** A static host cannot serve a `?all`
  variant, and `<template>` content is invisible with JS off. So [`lib/chunk.js`](../../tools/beta/lib/chunk.js) keeps the
  first **32 cards** live and wraps every later card, inside its own `ol.pls`, in
  `<noscript data-cleo-defer data-n="k" style="display:contents">` chunks of ≤ 40:
  - **JS on:** the parser reads `<noscript>` as raw text (one node per chunk). `Cleo.defer` (core.js) stamps a chunk when the
    card before it nears the viewport (IntersectionObserver, 1,200 px margin; a spacer holds the estimated height), and
    stamps **everything** first on any route/deep link/area anchor on load, hashchange, `cleo:route`, lens or tray or
    source-chip or map-toggle click, focus in the filter box, Ctrl/⌘-F, and `beforeprint`. No IntersectionObserver (old
    browsers, jsdom) → everything at once. Each stamp emits `cleo:stamped {cards}` synchronously; `city.js` adopts them.
  - **JS off:** `<noscript>` renders, so every card shows as before.
  - **Map:** every pin is drawn at mount — unstamped places from `Cleo.defer.peek()` (attribute stubs parsed from the
    chunk's start tags); clicking such a pin stamps its chunk (`Cleo.defer.stampFor(id)`).
  - **Safety:** the build chunks only when `client/city.js` carries the `cleo:stamped` hook, and `chunk()` throws if the
    card-id multiset changes. The count gate reads the same `li.pl` start tags either way.
  - **Measured** (Chromium, off-origin blocked, after load): Tokyo 1,730 nodes mobile / 2,747 desktop with all 488 pins
    (was 11,650); NYC 1,634 / 2,695 (was 12,669); after FE-A W2 merged. Scroll-to-end, every deep link, the filter box, pin clicks, Ctrl-F and
    JS-off all reach 488/488 and 508/508.
- **Reachability gate.** `test-beta.js` and `beta:metrics` (M0-04) assert that every live record is reachable through "All", scroll, filter, search and deep link. Templates count only once stamped.

### 5.4 Map (R-08)

- **Loading.** Leaflet 1.9.4 is vendored from `tools/node_modules/leaflet` and version-pinned by the generator. It loads **after first paint** (`requestIdleCallback`) by appending `<link>` and `<script>` elements with `onload`/`onerror` (never `document.write`). `Cleo.mountMap()` is idempotent.
- **No-network fallback.** With no Leaflet or no network, the map pane keeps "The map appears when it can load. Every place is listed here either way." In Wave 1, FE-A replaces this with the data-drawn schematic of verified pins required by M1-06.
- **Tiles.** Street comes from `tile.openstreetmap.org`. Light comes from Esri World Light Gray (`maxNativeZoom 16`). Satellite comes from Esri World Imagery. No key, nothing from CARTO, and no tile prefetch.
- **Markers.** One `circleMarker` per pinned place, coloured by area. Closed places are muted grey, and tier 1 gets a larger radius. A marker click routes to `#p=`. Markers follow the lenses.
- **Attribution.** The Leaflet control is shown, plus "© OpenStreetMap contributors; Esri" in the footer.

### 5.5 Markup contract (for FE lanes, QA and the stylesheet)

| Element | Contract |
|---|---|
| `<html data-cleo-page="landing\|city\|saved\|hub">` | Page kind |
| `main#main[data-city=<pageKey>]` | City key, used for saved refs |
| `li.pl#p-<id>` | One per place. Attributes: `data-k="s\|f"`, `data-t`, `data-a`, `data-g`, `data-cz`, `data-src` (publisher ids, W1), `data-ll="lat,lng"`, `data-checked`, `data-closed`. |
| `.pl-e / .pl-n / .pl-w / .pl-k / .pl-ad / .pl-s / .pl-x` | Eyebrow, name, write-up, note, address, "Recommended by", actions. |
| `section.area#area-<ID>[data-area]` | Area chapter |
| `[data-cleo-rail]`, `[data-cleo-toolbar]` | Rendered `hidden`, revealed by JS. |
| `#cleo-map[data-art][data-art-alt]`, `.map-fallback` | Map mount. Its server-rendered content is `figure.map-art.map-fallback` (the verified-pin schematic, `assets/art/<page>/map.svg`) + the no-network line; `Cleo.mapFallback()` restores it when tiles fail (W1, M1-06). |
| `script#cleo-city[type=application/json]` | `{v, key, name, center:[lat,lng,z], areas:{ID:{n,c}}, src:{id:[name, n, numbered, authority]}}` (`src` W1, M1-10) |
| `li.dest[data-page]` › `.dest-c` | Hub/landing card; its leading "N places" is gated against the page's computed total (W1, M1-20) |
| `.method .note` | The live page's method notes, including stated gaps, verbatim |

These ids are not stable public API. The designer may restyle everything, but renames go through the platform lane, because the tests and the metrics harness key on them.

## 6. Static "backend"

### 6.1 Per-page JSON — `beta/data/places/<pageKey>.json` (R-12)

Each file is `{_generated, v, key, live, beta, country, name, counts, areas, collections, cuisines, sources:{sights, food}, notes, places[]}`. There is one per place page (84 files, 6.0 MB raw in total; Tokyo is about 230 KB). Uses:
- the dataset behind offline packs;
- source views;
- future per-place pages and Atom feeds.

The files make **no open-licence claim** (D-24). Full pin and status provenance stays in `data/geocodes.json`, so beta carries only `pv.{status, checked, pin}`.

### 6.2 Site-wide search index — `beta/data/search.json`

```json
{ "v":1, "pages":[[key, name, href, country, deepLinks]], "items":[[page, id, name, kind, tier, closed, area]] }
```

| Property | Value |
|---|---|
| Coverage | 8,458 items, which equals the live total (asserted). |
| Size | 738 KB raw, **206 KB gzip**. **Budget: ≤ 250 KB gzip.** |
| Loading | Loaded lazily on first search, never on first paint. |
| Matching | Accent-folded. "senso-ji" matches "Sensō-ji". |

Mirror pages link without `#p=` (`deepLinks:0`) until they migrate.

**Growth plan.** If the budget is exceeded, shard by country (`search-<country>.json`) behind a two-level page table. M2-09 asks to also index native-script names, collections and cuisines; those go into extra columns, ids only, to keep the size down.

### 6.3 Service worker and PWA (R-11)

`beta/sw.js` is generated, scoped to `beta/`, and registered only on http(s).

| Request | Strategy |
|---|---|
| Install | Precache the shell: landing, saved, CSS, JS, icon, manifest. |
| Navigations | Network-first, then the cached copy, then the cached landing. |
| `data/*.json` | Stale-while-revalidate. |
| Versioned assets | Cache-first. |
| Cross-origin (tiles, source sites) | **Never intercepted.** |

- **Cache name.** It is `cleo-<hash of asset versions + generated pages>`, so a new build retires old caches on `activate`.
- **Offline city packs (M3-01).** A visited city page is cached on visit. "Save this city for offline" will add the page and its `data/places/<key>.json` explicitly.
- **Tiles.** The OSM tile policy forbids bulk prefetch, so tile caching is restricted to tiles the user already viewed, behind a capped runtime cache. That arrives in M3 and is off in Wave 0.
- **Content works without the SW** (tested: jsdom has no SW).
- **Manifest.** `beta/manifest.webmanifest` holds name, `start_url`, `scope` and an SVG icon. The designer owns the icon art in `tools/beta/static/icon.svg`.

### 6.4 Structured data (R-10)

| Page | JSON-LD |
|---|---|
| City | `ItemList`, with `numberOfItems` equal to the count of **open** places. Each `ListItem` holds a `TouristAttraction` (sights) or `Restaurant` (food) with `name`, `address`, `geo` (`GeoCoordinates`) and `url` (canonical page `#p=<id>`). |
| Landing | `WebSite` with a `SearchAction` (`?q=`). |

**Never emitted:** `aggregateRating`, `review`, `priceRange` or `openingHours` (M2-07, G5).

**Gate:** JSON-LD item count == open place count, per page. A schema-shape validation script joins `beta:check` in Wave 1.

### 6.5 Share cards (OG)

- **Current state.** Every page carries `og:title`, `og:description` (with computed counts), `og:url` (canonical, absolute) and `og:image`, plus the Twitter equivalents and `<link rel=canonical>`.
- **Per-city image.** `og:image` uses `beta/assets/og/<pageKey>.png` when that file exists, else the shared `assets/og-cover.png`.
- **Rendering.** `npm run beta:og` (Wave 1, platform) will render 1200×630 PNGs (≤ 300 KB) with the pre-installed Chromium. The source is an HTML template built from the design tokens plus page data: name, native script, counts, and a pin scatter drawn from verified coordinates. The images are typographic and map-art, with no photos.
- **Why it is separate from `npm run beta`.** Chromium may be absent in CI, and PNG bytes are not deterministic across renderers.

### 6.6 Saved lists and day plans (client-side)

- **Saved lists** are `Cleo.saved`, keyed by `<page>/<id>`. They work with storage throwing, in memory only, and the M1-19 notice comes from VOICE.md. Share uses `#list=` (§4.2). A shared link offers "Save all". Unknown ids are shown as "no longer listed", never dropped silently.
- **Named lists, "Been there", and KML/JSON/Google export and import** are Wave 1 (M2-03), built on `cleo:v1:lists`.
- **Day plans** are computed in the client from the page's own records (M2-06):
  - open, pinned places of one area only;
  - seeded by the top tier-1 place;
  - extended greedily by nearest neighbour, using the haversine distance from `data-ll`;
  - 4–6 stops;
  - legs labelled "{x} km straight-line";
  - encoded as `#day=<AREA>:<id>,…`;
  - stored in `cleo:v1:days`.
  No server and no routing API are involved. The plan is labelled exactly as D-14 says.

### 6.7 Imagery pipeline (R-13), coordinated with the designer's `design/beta/IMAGERY.md`

- **M1 (no photos, D-13).**
  - The designer owns typographic covers and original collection glyphs in `beta/assets/`.
  - Platform provides **build-time SVG map art from verified pins only**: area silhouettes (a convex hull or dot field of the area's `la/ln`) and a locator inset per place. These are emitted inline or as `beta/assets/art/<page>/<area>.svg` by a `lib/art.js` module.
  - No OSM geometry is drawn, so no OSM credit is needed beside the art.
- **M3-04 (Commons landmarks, blocked on LP-02).** The registry `data/images.json` (live pipeline) holds:
  ```
  {placeKey: {file, author, license, licenseUrl, sourceUrl, depicts, fopCountryOk, verified}}
  ```
  1. A gate (live pipeline) accepts only CC0, PD, CC BY and CC BY-SA, and **none in Vietnam**.
  2. A separate step, `npm run beta:images`, which needs network, downloads standard-width thumbnails into `beta/assets/img/<sha>.jpg` and commits them.
  3. `build.js` then only **reads** committed thumbnails and the registry, and renders `<figure>` with a TASL `<figcaption>`.
  4. The build **refuses** an image with any missing TASL field, or one whose `depicts` place id is not on the page.
  5. Images are decorative to the layout. Cards read fully without them, with no CLS (explicit `width`/`height`).

## 7. Guards

### 7.1 Record-count assert (R-05), per page, before any write

`guards.assertCityPage` checks the following. Any error makes the whole build exit 1 with **nothing written**:

| Check | Compared with |
|---|---|
| Model length | Live `P.length + F.length` |
| Rendered cards (`li.pl#p-…`) | Live count |
| Sights and food separately (`data-k`) | Live `P` and `F` |
| Ids | Unique |
| **Multiset of rendered names** | Live names. This is the same places, not just the same number (G1, M0-03). |
| JSON-LD items | Open places |
| Search index total | Live total across all 84 pages |

A self-test (`CLEO_BETA_SELFTEST_DROP=1`) drops one Tokyo record. `test-beta.js` asserts that the build refuses, citing the count, the sight/food split and the missing name.

### 7.2 Map-surface and escape guards (R-14)

- **At build.** `lib/forbidden.js` parses `FORBIDDEN` and `TILE_FORBIDDEN` **out of `tools/engine_guard.py`**, the single source per rule 4-ai. Every generated page is checked against them. The build also rejects `document.write`, any third-party `<script src>`, and any third-party stylesheet.
- **At test.** `test-beta.js` scans **every** beta page, mirrors included, for the same lists, plus `document.write`. On generated pages it also checks for third-party scripts and for literal `\uXXXX`/`\xNN`/`<\/` in visible text (the `check-escapes.py` rule).
- **Caveat.** The repository's own `check-google.py` and `check-escapes.py` do not scan `beta/`. We don't edit them (live tooling); `test-beta.js` covers beta instead and runs in the same `npm test`.

### 7.3 No-CDN render test (jsdom, in `npm test`)

The test loads `beta/cities/tokyo.html` with every network request impossible. Same-origin scripts are inlined exactly as a browser would fetch them. It runs these checks:

- **Content, with storage throwing:**
  - all 488 places render and are visible;
  - every card has a non-empty "Recommended by";
  - every closed place is present, flagged, and shows no tier;
  - the stated gaps ("What is thin, and why") are present;
  - the toolbar is enhanced;
  - the map fallback is kept;
  - Save works in memory;
  - there are 0 JS errors.
- **Lenses:**
  - food mode shows exactly F;
  - a collection shows exactly its places;
  - "All" restores N;
  - a deep link to a hidden place makes the filters yield;
  - a `#p-<id>` anchor acts as a deep link;
  - a rail tile's count equals its result count.
- **With vendored Leaflet:**
  - the map mounts;
  - there is one marker per pinned place;
  - the client's tile hosts are OSM and Esri only;
  - there are 0 errors.

Each migrated city joins this test through a fixture list (Wave 1: the D-27 pilot set).

### 7.4 QA harness on beta

- **Current harness.** `npm run qa` (`tools/qa-site.js`) already walks `beta/` on mobile offline, desktop offline and desktop with the map.
- **How new pages are classified.** It recognises engine pages by `#list` and `#modeFood`. New beta pages deliberately don't use those ids, so the harness runs only the generic checks on them: errors, 404s, "API key" text, overflow, type size, tap targets, links and performance.
- **Wave 0 result on `--only beta/`:**
  - The first run FAILed Tokyo on hash-route links. They were fixed (they are now buttons), and the re-run is recorded in `docs/BETA-LOG.md`.
  - Remaining WARNs are mostly on legacy mirror pages: small type and small targets, which are design-level.
- **Extension (QA lane, M0-04).** `tools/beta/metrics.js` adds beta interaction checks keyed on the §5.5 contract: screens-to-first-card, controls above the first card, reachability, sheet and tray behaviour. It runs as `npm run beta:metrics`. Platform's part is to keep the markup contract stable.

### 7.5 Performance budgets (enforced in `test-beta.js` unless noted)

| Budget | Limit | Tokyo, Wave 0 |
|---|---|---|
| City page, raw | ≤ 800 KB | 639 KB |
| City page, gzip | ≤ 160 KB | 121 KB (live: 91 KB; beta adds JSON-LD of about 160 KB raw) |
| Landing | ≤ 24 KB gzip, ≤ 120 KB raw (W2; W0 was 80 KB raw) | 19 KB (W2: 16 KB gzip / 81 KB raw) |
| Client JS loaded by any one page (excluding Leaflet) | ≤ 32 KB gzip (FE-A's W2 per-page rule, ratified by platform; W0 was 40 KB raw site-wide, W1 64 KB raw) | 20 KB |
| Search index, gzip, lazy | ≤ 250 KB | 206 KB |
| Initial DOM, largest page (M3-06; QA metrics) | ≤ 3,000 nodes | W2: Tokyo 1,730 mobile / 2,747 desktop with all 488 pins (was 11,650); NYC 1,634 / 2,695 (was 12,669). §5.3. |
| Render-blocking third-party in `<head>` | 0 | 0 (system fonts; Leaflet CSS loads with the map) |
| First card painted, NYC, 4× CPU (QA) | ≤ 1.0 s | measured in Wave 1 |

Real-browser spot check (Chromium, off-origin blocked):
- Tokyo shows 0 JS errors and 0 horizontal overflow at 390 and 1440.
- The first card's top is at 714 px on mobile (M1-01: ≤ 844) and 559 px on desktop.
- The map mounts from the vendored copy.

## 8. Risks and open items

| Risk | Mitigation | Owner |
|---|---|---|
| A live builder renames an engine `const` | The extractor fails loudly. The counts test runs over all 84 pages in `npm test`. | Platform |
| A live rename changes a place id and breaks saved or shared links | Alias map (§3.2), Wave 2 | Platform |
| A live rebuild without a beta regeneration fails `npm test` for other lanes | Intended (beta == live). The fix is `cd tools && npm run beta`, and the failure message says so. | All |
| Per-page JSON adds 6 MB to the repo | Accepted (the Pages limit is 1 GB). The files are also the offline-pack payload. Shard or trim if needed. | Platform |
| The SW serves a stale page after a deploy | Network-first navigations, plus a cache name tied to content hashes | Platform |
| Geocode join misses (name drift) | Provenance is optional. A miss shows no status date and never a guess. Coverage is reported in Wave 1 metrics. | Platform |

## 9. Wave plan and file ownership

### 9.1 Ownership (each file has exactly one writing lane; shared files change in small coordinated commits)

| Path | Lane |
|---|---|
| `tools/beta/build.js`, `tools/beta/lib/{extract,registry,model,guards,forbidden,html,sw}.js`, `tools/beta/lib/render/common.js`, `tools/beta/client/core.js`, `tools/beta/test-beta.js`, `tools/beta/static/` (except icon art), `beta/data/**`, `beta/sw.js`, `beta/manifest.webmanifest`, `beta/assets/vendor/**`, `beta/assets/og/**` (render step), `beta/assets/art/**` (map art) | **Platform** |
| `tools/beta/lib/render/city.js`, `tools/beta/lib/render/saved.js`, `tools/beta/client/{city,saved}.js`, and new `client/{sheet,tray,day}.js` | **FE-A** |
| `tools/beta/lib/render/{landing,shell}.js`, new `render/{hub,method,accessibility}.js`, `tools/beta/client/landing.js`, new `client/search.js` | **FE-B** |
| `beta/assets/*.css` (`cleo.css`, `tokens.css`), `design/beta/**` (except this RFC), `tools/beta/static/icon.svg` art | **Designer** |
| `docs/BETA-QA.md`, `tools/beta/metrics.js`, new `tools/beta/qa/**`, `qa/beta-*` | **QA** |
| `docs/BETA-BACKLOG.md`, `docs/BETA-DECISIONS.md`, `docs/BETA-BENCHMARK.md` | **PM** |
| **Shared, coordinated:** `tools/beta/pages.json` (one line per migration), `tools/package.json` (scripts only), `tools/beta-restyle.py` (skip logic only; deleted at the end), `docs/BETA-LOG.md` (append-only) | each lane edits only its own line or row |

**Collision rules.**
- Generated files under `beta/` (pages, `assets/js/`, `data/`, `sw.js`) are **never committed by hand**. A lane changes its *source* in `tools/beta/`, then runs `npm run beta` and commits the regenerated output with it.
- On a merge conflict in a generated file, take either side, re-run `npm run beta`, and commit the result.

### 9.2 Waves

| Wave | Platform | FE-A (city) | FE-B (hubs, nav, search) |
|---|---|---|---|
| **0** (this RFC) | Generator, gate, data indexes, search index, PWA shell, JSON-LD, vendored map, tests | — (skeleton city page and `city.js` provided) | — (skeleton landing and `landing.js` provided) |
| **1** | Hub renderer data (country stats), `beta:og` per-city cards, map-art module (`lib/art.js`), schema validation in `beta:check`, pilot pages added to `pages.json` and the jsdom fixture list, `?all` variant groundwork | M1-01–M1-08, M1-10–M1-12 on Tokyo, then the D-27 pilots: Cleveland, NYC, Chinatown SG, Wheeling | M1-17 landing to spec, M1-18 shell and breadcrumb, `beta/<Country>/index.html` renderer (including **Japan**, missing today), M1-09 method page, M2-09 header search |
| **2** | Alias map, offline packs (M3-01), template chunking for M3-06, the remaining pages into `pages.json` (M1-22) | M2-01–M2-06 (sheet share, lists, interests, day plans), M2-10/11 | M2-02 share UI, M1-19 empty and error states, M2-12 |
| **3** | Commons pipeline (after LP-02), i18n catalogue plumbing (M3-03), Atom feeds (M3-07), delete `beta-restyle.py` | M3-02 near me, M3-05 delight | Locale switcher (hidden until reviewed) |

## 10. Commands

```bash
cd tools
npm install            # first time (jsdom, leaflet — Leaflet is the vendored source)
npm run beta           # regenerate everything the new generator owns
npm run beta:check     # reproducibility: fresh build == beta/ on disk
npm run test:beta      # the beta gate alone (also part of `npm test`)
node beta/build.js --list   # live → beta page map
npm run validate && npm test   # before every commit (rule 1)
```

---

## 11. Wave 1 revision (platform, 2026-10-10)

| # | Decision | Why |
|---|---|---|
| R-15 | **Every count and date is computed** in `lib/stats.js` (`row.stats`, `country.stats`, `reg.stats`); renderers never count. `lastChecked` = max(`statusChecked`) of the page's records, else absent. Live prose's engine count phrase ("N sights and M places to eat") is **rewritten** from the computed numbers before rendering; the test fails if any generated page prints a phrase that disagrees. | Live prose drifts: Cleveland's standfirst says 143 + 40 while the page holds 148 + 46; the live SEA archive says Toa Payoh 14 + 42 for a 14 + 41 page (M1-20). |
| R-16 | **A source = a publisher per page** (`k` of the live registry entry), id = slug of `k`, `ADD`/`FADD` → `guide`. `n` = records citing it (each once); `numbered` = distinct `#n` entries for numbered lists. Name = shortest live label `l` (≤ 48 chars), else `k` in sentence case with acronyms kept. Card labels use the same short label, never an article title (`t`). | Registry entries are per article (Cleveland has 12 Atlas Obscura entries). Cleveland's News 5 list has **100** numbered entries cited by **103** records (some entries name two places), so both numbers are carried: the source view shows n, the validator invariant (News 5 = 100, There She Goes = 23) is asserted on `numbered` (M1-10). |
| R-17 | **Map art is drawn from verified pins only** = coordinates present and `data/geocodes.json` confidence `high`/`med` (8,220 of 8,458 places; Okinawa's 195 `low` pins are not drawn). No OSM geometry, so no credit is needed beside it. City schematic frame = 4th–96th percentile box (padded), outliers drawn as edge ticks and counted in `<desc>`. | M1-13, M1-06; honest about what we know, and day-trip rings don't collapse the city to a dot. |
| R-18 | **"Recommended by" hrefs are always absolute http(s)** (`model.sourceHref`): live refs that are numbered entries, bare domains, wiki slugs or prose notes link to `https://<domain>` or the registry entry's URL, with the prose kept as a `title`. The build refuses any other href. | The first all-pages QA run FAILed 7 pages on exactly these (M1-22). |
| R-19 | **Rollout = every live page in `pages.json`.** Country hubs and the SEA archive render through `render/hub.js` (platform skeleton, FE-B owns it). Every hub and the landing are gated: each expected page carded once, count == page. Beta HTML set == live page set + `saved.html` (test). | M1-22; fixes QA D7 lag; Japan's hub was missing from beta. |

New platform modules: `lib/stats.js`, `lib/sources.js`, `lib/art.js`, `render/hub.js` (→ FE-B). New outputs:
`beta/assets/art/<page>/{map,<AREA>}.svg`, `beta/data/sources.json`, and per-page JSON fields `stats`,
`sourceIndex`, `art`, `colors`, `nat`, plus `nat`/`src` on every place. Client: `Cleo.pageData`, `Cleo.art.xy`,
`Cleo.watchTiles`, `Cleo.mapFallback`. Clustering (M1-06) stays FE-A's client work; the density threshold is
theirs to state.

## 12. Wave 2 revision (platform, 2026-10-10) — data the FE lanes render

All of this is computed at build time by [`tools/beta/lib/guide.js`](../../tools/beta/lib/guide.js) from the page's own
records, gated in `test-beta.js` ("GUIDE DATA"), and exposed three ways: `row.guide` (renderers, build time),
`data/places/<page>.json` → `guide` (client, via `Cleo.guide(key)`), and `data/guide.json` (one row per place page, for
hubs and the landing).

| # | Decision | Why |
|---|---|---|
| R-20 | **★ signature = the city's unique food canon or its pop culture, never a publisher.** Preference: (1) a ★ collection in the page data (Japan: Anime, Manga & Pop Culture); (2) the food canon from the editorial `CANON` table (cuisine ids per page, or per country for town pages); (3) a pop-culture collection (`POP`); (4) none → the FE falls back to Must see. | ROUND-1 gap #10; CLAUDE.md "food discovery centres on what is UNIQUE to the city". |
| R-21 | **Canon keys on cuisine/collection ids only.** Dish words (`dishes`) are display copy, printed only when a canon record's own name/write-up/note names the dish (synonyms after `\|`); each dish carries the `ids` that name it. The match chooses words to print — it never files or tags a place. | Wenwen rule; no claim the data can't back. |
| R-22 | **Day plans (D-14, M2-06)**: per area, open places with a verified pin (high/med) only. Seed = best open sight (tier, then most publishers). Greedy nearest neighbour over tier ≤ 2 (all tiers if too few), each leg ≤ 3 km, total ≤ 12 km, ≤ 5 sights; then one food stop inserted where it adds least (never first). < 4 stops → no plan, with the reason in `skipped`. Legs are haversine km to 0.1, always labelled straight-line. | Honest, deterministic, no routing API. |
| R-23 | **Recently closed (M2-10)**: every closed record, newest status check first. Pin provenance joins the per-page JSON: `pv.src` (pin source), `pv.verified`, and `pv.ss` (status source, closed records only). | FE-A W1 request; freshness. |

`guide` fields (per page):

```js
{
  signature: { kind: 'food'|'collection', title, line /* "Polish Boy · corned beef · Barberton chicken" | null */, n, ids: [placeId],
               cz?: [cuisineId], c?: [collectionId], dishes?: [{t, n, ids}], why } | null,
  canon:     { title, cz: [id], n, open, ids, dishes: [{t, n, ids}] } | null,  // the food canon, also on Japan pages
  popCulture:{ c: [id], labels: [name], n } | null,
  foodOrder: [cuisineId],                       // rail order: canon first, then by count, 0-count ids last (a permutation)
  tileLine:  { text, parts, landmark: placeId } | null,   // up to 2 canon dishes + top open tier-1 landmark
  days: { label /* D-14 copy incl. "straight-line" */, rules: {maxStops, minStops, maxSights, maxLeg, maxTotal},
          plans: { AREA: { ids: [placeId], legs: [km], km, sights, food } }, skipped: { AREA: reason } },
  closed: [{ id, checked }]                    // "Recently closed" collection, newest check first
}
```

Client helpers in `core.js`: `Cleo.guide(key)` (promise of the above), `Cleo.geo.km(a, b)` (haversine; `{la,ln}` or
`[lat,lng]`), `Cleo.geo.fmt(km)` ("0.4 km straight-line"; under 0.1 → "next door"), `Cleo.geo.ll(card)` (reads
`data-ll`). Near me (M3-02) needs nothing else: every card carries `data-ll`, and the position never leaves the client.
A plan's ids encode with `Cleo.listCodec` exactly like a list (`#day=<AREA>:<id>,…`).

## Appendix A — Live → beta page map (generated by `node tools/beta/build.js --list`, 2026-10-10)

> **Superseded by R-19 (Wave 1):** every row below is now **new generator**; `--list` prints the current map.

| Live page | Kind | Country | Places (sights + food) | Beta source | Beta generator |
|---|---|---|---|---|---|
| `index.html` | landing | — | — | countries.json + live hub links + page counts | **new generator** |
| `cleveland.html` | city | us | 148 + 46 | live page records | legacy mirror |
| `Japan/index.html` | country-hub | japan | — | countries.json + live hub links + page counts | not in beta yet |
| `Germany/index.html` | country-hub | germany | — | countries.json + live hub links + page counts | legacy mirror |
| `Belgium/index.html` | country-hub | belgium | — | countries.json + live hub links + page counts | legacy mirror |
| `cities/aachen.html` | city | germany | 113 + 90 | live page records | legacy mirror |
| `cities/akron.html` | city | us | 68 + 82 | live page records | legacy mirror |
| `cities/antwerp.html` | city | belgium | 59 + 78 | live page records | legacy mirror |
| `cities/bruges.html` | city | belgium | 63 + 60 | live page records | legacy mirror |
| `cities/brussels.html` | city | belgium | 71 + 68 | live page records | legacy mirror |
| `cities/chicago.html` | city | us | 206 + 161 | live page records | legacy mirror |
| `cities/cincinnati.html` | city | us | 68 + 41 | live page records | legacy mirror |
| `cities/columbus.html` | city | us | 62 + 24 | live page records | legacy mirror |
| `cities/dayton.html` | city | us | 55 + 19 | live page records | legacy mirror |
| `cities/erie.html` | city | us | 41 + 18 | live page records | legacy mirror |
| `cities/ghent.html` | city | belgium | 53 + 55 | live page records | legacy mirror |
| `cities/harrisburg.html` | city | us | 77 + 94 | live page records | legacy mirror |
| `cities/hokkaido.html` | city | japan | 228 + 184 | live page records | legacy mirror |
| `cities/indianapolis.html` | city | us | 70 + 86 | live page records | legacy mirror |
| `cities/kyoto.html` | city | japan | 215 + 183 | live page records | legacy mirror |
| `cities/liege.html` | city | belgium | 59 + 85 | live page records | legacy mirror |
| `cities/madison.html` | city | us | 66 + 90 | live page records | legacy mirror |
| `cities/miami.html` | city | us | 124 + 201 | live page records | legacy mirror |
| `cities/newyork.html` | city | us | 219 + 289 | live page records | legacy mirror |
| `cities/okinawa.html` | city | japan | 191 + 234 | live page records | legacy mirror |
| `cities/orlando.html` | city | us | 208 + 179 | live page records | legacy mirror |
| `cities/osaka.html` | city | japan | 159 + 210 | live page records | legacy mirror |
| `cities/philadelphia.html` | city | us | 165 + 198 | live page records | legacy mirror |
| `cities/pittsburgh.html` | city | us | 111 + 101 | live page records | legacy mirror |
| `cities/rhineland.html` | city | germany | 155 + 106 | live page records | legacy mirror |
| `cities/saarland.html` | city | germany | 183 + 104 | live page records | legacy mirror |
| `cities/sanfrancisco.html` | city | us | 204 + 192 | live page records | legacy mirror |
| `cities/siliconvalley.html` | city | us | 108 + 44 | live page records | legacy mirror |
| `cities/statecollege.html` | city | us | 34 + 14 | live page records | legacy mirror |
| `cities/tokyo.html` | city | japan | 263 + 225 | live page records | **new generator** |
| `cities/washingtondc.html` | city | us | 75 + 59 | live page records | legacy mirror |
| `cities/wheeling.html` | city | us | 28 + 7 | live page records | legacy mirror |
| `cities/youngstown.html` | city | us | 40 + 22 | live page records | legacy mirror |
| `Singapore/ang-mo-kio.html` | city | singapore | 20 + 67 | live page records | legacy mirror |
| `Singapore/bagan.html` | city | indochina | 1 + 0 | live page records | legacy mirror |
| `Singapore/balestier.html` | city | singapore | 12 + 37 | live page records | legacy mirror |
| `Singapore/bali.html` | city | indonesia | 3 + 0 | live page records | legacy mirror |
| `Singapore/bangkok.html` | city | thailand | 4 + 2 | live page records | legacy mirror |
| `Singapore/bedok.html` | city | singapore | 0 + 1 | live page records | legacy mirror |
| `Singapore/bishan.html` | city | singapore | 10 + 33 | live page records | legacy mirror |
| `Singapore/bukit-timah.html` | city | singapore | 2 + 1 | live page records | legacy mirror |
| `Singapore/cebu.html` | city | philippines | 1 + 1 | live page records | legacy mirror |
| `Singapore/changi.html` | city | singapore | 2 + 0 | live page records | legacy mirror |
| `Singapore/chiang-mai.html` | city | thailand | 2 + 1 | live page records | legacy mirror |
| `Singapore/chinatown.html` | city | singapore | 4 + 12 | live page records | legacy mirror |
| `Singapore/civic-district.html` | city | singapore | 5 + 1 | live page records | legacy mirror |
| `Singapore/dempsey-hill.html` | city | singapore | 0 + 2 | live page records | legacy mirror |
| `Singapore/geylang.html` | city | singapore | 1 + 1 | live page records | legacy mirror |
| `Singapore/hanoi.html` | city | vietnam | 2 + 2 | live page records | legacy mirror |
| `Singapore/hoi-an.html` | city | vietnam | 1 + 1 | live page records | legacy mirror |
| `Singapore/holland-village.html` | city | singapore | 3 + 30 | live page records | legacy mirror |
| `Singapore/index.html` | country-hub | singapore | — | countries.json + live hub links + page counts | legacy mirror |
| `Singapore/ipoh.html` | city | malaysia | 0 + 1 | live page records | legacy mirror |
| `Singapore/jakarta.html` | city | indonesia | 1 + 0 | live page records | legacy mirror |
| `Singapore/jalan-besar.html` | city | singapore | 0 + 6 | live page records | legacy mirror |
| `Singapore/jurong.html` | city | singapore | 0 + 3 | live page records | legacy mirror |
| `Singapore/kampong-glam.html` | city | singapore | 1 + 2 | live page records | legacy mirror |
| `Singapore/katong-joo-chiat.html` | city | singapore | 1 + 6 | live page records | legacy mirror |
| `Singapore/kuala-lumpur.html` | city | malaysia | 2 + 1 | live page records | legacy mirror |
| `Singapore/little-india.html` | city | singapore | 2 + 3 | live page records | legacy mirror |
| `Singapore/luang-prabang.html` | city | indochina | 2 + 0 | live page records | legacy mirror |
| `Singapore/malacca.html` | city | malaysia | 1 + 1 | live page records | legacy mirror |
| `Singapore/mandai.html` | city | singapore | 3 + 0 | live page records | legacy mirror |
| `Singapore/manila.html` | city | philippines | 3 + 0 | live page records | legacy mirror |
| `Singapore/marina-bay.html` | city | singapore | 6 + 0 | live page records | legacy mirror |
| `Singapore/marine-parade.html` | city | singapore | 1 + 1 | live page records | legacy mirror |
| `Singapore/newton-novena.html` | city | singapore | 8 + 34 | live page records | legacy mirror |
| `Singapore/old-airport-road.html` | city | singapore | 0 + 4 | live page records | legacy mirror |
| `Singapore/penang.html` | city | malaysia | 3 + 3 | live page records | legacy mirror |
| `Singapore/phnom-penh.html` | city | indochina | 1 + 0 | live page records | legacy mirror |
| `Singapore/potong-pasir-macpherson.html` | city | singapore | 15 + 45 | live page records | legacy mirror |
| `Singapore/punggol.html` | city | singapore | 15 + 33 | live page records | legacy mirror |
| `Singapore/queenstown.html` | city | singapore | 0 + 4 | live page records | legacy mirror |
| `Singapore/siem-reap.html` | city | indochina | 2 + 0 | live page records | legacy mirror |
| `Singapore/singapore-old.html` | archive-hub | singapore | — | countries.json + live hub links + page counts | legacy mirror |
| `Singapore/southern-ridges.html` | city | singapore | 2 + 0 | live page records | legacy mirror |
| `Singapore/tiong-bahru.html` | city | singapore | 0 + 3 | live page records | legacy mirror |
| `Singapore/toa-payoh.html` | city | singapore | 14 + 41 | live page records | legacy mirror |
| `Singapore/upper-serangoon.html` | city | singapore | 18 + 81 | live page records | legacy mirror |
| `Singapore/upper-thomson.html` | city | singapore | 1 + 1 | live page records | legacy mirror |
| `Singapore/yangon.html` | city | indochina | 1 + 0 | live page records | legacy mirror |
| `Singapore/yogyakarta.html` | city | indonesia | 2 + 0 | live page records | legacy mirror |
| `Vietnam/hanoi.html` | city | vietnam | 2 + 2 | live page records | legacy mirror |
| `Vietnam/ho-chi-minh-city.html` | city | vietnam | 105 + 66 | live page records | legacy mirror |
| `Vietnam/hoi-an.html` | city | vietnam | 1 + 1 | live page records | legacy mirror |
| `Vietnam/index.html` | country-hub | vietnam | — | countries.json + live hub links + page counts | legacy mirror |
