# Casing audit (owner rule, W7): no superfluous capitals

- **Rule:** [`DESIGN-SYSTEM.md` §v2.6](DESIGN-SYSTEM.md). In short:
  - sentence case everywhere;
  - no uppercase transforms;
  - no drop caps or decorative initials;
  - proper nouns, acronyms and publishers' own names keep their capitals.
- **Executable spec:** [`casing/`](casing/).
  - `allowlist.json`: the phrase and word allowlist.
  - `sentence_case.py`: the reference implementation. `--check` mode keeps `labels.md` in sync.
  - [`labels.md`](casing/labels.md): all 368 data labels with their 259 changes.

**The shared helper.** FE-A builds one shared `sentenceCase(label)` for both the build (Node) and the client. It ports `sentence_case.py` and reads `design/beta/casing/allowlist.json`. It is copied into the build output or inlined as a small JSON, so the client never fetches anything new. Every surface below calls it on **data labels only**, never on place names, source names or prose.

## A. Data labels (display-time helper; data untouched)

Collection labels (`collections[].n`) and cuisine labels (`cuisines[].n`) from `beta/data/places/*.json`.

| Surface | Where it renders | Owner |
|---|---|---|
| Collection rail tiles (`.rail-i .t`) and the category bar | city pages: Gallery and Atlas | FE-A (category bar: Atlas lane in Atlas) |
| Collection row headings (`.row-h h2`, "★ Anime, Manga & Pop Culture") and "See all N" context | Gallery rows | FE-A |
| Card kind/meta lines that name a collection or cuisine | Gallery, Atlas list, carousel | FE-A / Atlas lane |
| Place detail "Part of" chips and cuisine line | detail sheet / page | FE-A |
| Lens intro titles (`.lens`) | city pages | FE-A |
| Filters tray: collections, cuisines and area labels if title-cased | city pages | FE-A / Atlas lane |
| Hub "Collections across the guides" theme rail, signature tiles ("Iconic & Must-See", "… classics") | landing, country hubs | FE-B |
| Guidebook chapter collection marks ("★ … marked through the chapters") | Guidebook | FE-B |
| Insights charts: collection and cuisine axis labels, legends and tables | Insights | FE-B |
| "What changed" pages: collection or cuisine names in change rows | changes/*.html | FE-B |
| Search suggestions: the "Collections" group | site search | FE-A |
| For-you picker interests (`.interest` titles from collections) | For you | FE-A |

Build-time renderers that read these labels: `tools/beta/lib/render/city.js`, `hub.js`, `landing.js`, `lib/gallery.js`, `lib/guide.js`, `lib/stats.js` and `lib/views.js`. On the client: `client/foryou.js` and `client/insights.js`.

## B. Uppercase transforms and tracked caps (CSS)

| File | Rule | Status |
|---|---|---|
| `beta/assets/constellation.css` `.eyebrow` | `text-transform: uppercase` | **Done** (designer): `none` |
| `design/beta/css/views.css` `.eyebrow` (views) | uppercase + `.06em` tracking | **Done** (designer): none, 0 tracking |
| `tools/beta/lib/render/fe-a.css` `.g-lead-k` ("START WITH") | uppercase + tracking | **FE-A**: remove (the V2.18 base rule loses on specificity) |
| `tools/beta/lib/render/fe-b.css` `.lhero .kicker` ("SOURCED CITY GUIDES") | uppercase + tracking | **FE-B**: remove |
| Any other `text-transform: capitalize` or `font-variant: small-caps` | none found in beta/assets on 2026-10-11 | designer re-checks after each lane push |

## C. Decorative initials and drop caps

| File | What | Status |
|---|---|---|
| `design/beta/css/contract.css` `.lens > p:first-of-type::first-letter` | lens intro drop cap | **Done** (designer): removed |
| `design/beta/css/views.css` `.ch-intro::first-letter` | Guidebook chapter drop cap | **Done** (designer): removed |
| `.plate.i`, `.pl-ini`, `.ini` (cover initials) | decorative Didone initials on covers | **Done** (designer, V2.18): hidden everywhere. FE-A's `gcard()` in `client/gallery.js` still emits `<span class="plate i" data-i=…>`, so FE-A should stop emitting it. |
| `fe-a.css` `::first-letter` neutralisers | already neutral | FE-A can delete them once the sources are clean |

## D. Hard-coded UI strings (templates, `tools/beta/i18n/en.json`)

The catalogue is already almost entirely sentence case. Two exceptions:
- `beta/data/sources.json` has the source label "Official Site". It is a generic label, not a publisher's name, so it should display as **"Official site"** (FE-A, in the source-chip renderer).
- Any new string goes through review against §v2.6. The i18n pseudo-locale test keeps catching hard-coded strings.

## E. Keep as is (not superfluous)

- Place names: "Imperial Palace East Gardens", "Kanda Myōjin".
- Area names: "Chiyoda-ku".
- City and country names, and source names: Time Out, Wikimedia Commons, The Japan Times, Atlas Obscura, Michelin Bib.
- Acronyms: UNESCO, NPS, BBQ.
- The wordmark "cleo", which stays lowercase.

## Verification (for each lane's push)

- `python3 design/beta/casing/sentence_case.py --check` passes. A new label in the data means re-running the script and reviewing `labels.md`.
- Grep the built pages: no Title Case collection label renders. A probe can compare each rendered rail and chip label with `sentenceCase()` of its data label.
- Grep `beta/assets/*.css`: zero `text-transform: uppercase|capitalize`, and zero `::first-letter` with `float`.
