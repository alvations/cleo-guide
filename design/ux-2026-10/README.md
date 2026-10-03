# Salon — a UX proposal for the field guides (2026-10)

> **Status: proposal for the owner to vet. Nothing here ships.** Every file lives under
> `design/ux-2026-10/`; no live page, engine, builder, dataset or registry was modified.
> The prototypes run on the **real** Tokyo and Chicago datasets, geocode-gated exactly like the live build.

**Brief:** *luxury yet fun* — hospitality-grade polish, a personal concierge voice, a local guide who shares
your interests (landmarks × food × pop culture), with a high-fashion sensibility. Wanderlust; clean yet informative.

---

## Contents

1. [Executive summary](#1-executive-summary)
2. [Audit of the current site — with evidence](#2-audit-of-the-current-site)
3. [Three visual directions](#3-three-directions)
4. [Recommended: Salon & Night out — prototypes](#4-recommended-salon--night-out)
5. [Interaction specs](#5-interaction-specs)
6. [Accessibility & performance](#6-accessibility--performance)
7. [Implementation roadmap](#7-implementation-roadmap)
8. [Decisions the owner needs to make](#8-decisions-for-the-owner)
9. [How to reproduce everything here](#9-reproduce)

---

## 1. Executive summary

The guides' substance is excellent: every place carries its sources, a verified pin and an open/closed
check. The **presentation hides that substance**. On a phone, Tokyo's first place card sits **4.9 screens**
below the top, behind **81 controls** (a 20-chip source filter among them); the page is **175,722 px**
tall; 1,149 of 1,169 controls are under the 44 px tap minimum; the layout overflows to **651 px** on a
390 px phone; and the interface speaks almost entirely in an uppercase monospace that reads "developer tool",
not "concierge".

**Recommendation — Direction A, "Salon & Night out":** ivory paper, ink and a gilt hairline by day; an
aubergine-black "Night out" edition after dark with one neon-plum accent reserved for pop-culture moments.
Newsreader (light, optical size 72) for the guide's voice, Figtree for the interface. It keeps the product's
promise in front — every card says *Recommended by* — while making the guide feel personal.

**Top 5 changes** (all prototyped):

1. **Places first.** Masthead + a single sticky toolbar (Everything / Sights / Eat & drink · area jump ·
   collection · ★ signature collection · For you · Near me). The first card lands at **1.0 screen** on mobile
   (was 4.9) with **14** controls above it (was 81). Source/rank/visited filters move into the collection menu
   and the detail sheet.
2. **"Your guide" concierge.** A 2-tap picker (History & landmarks · Foodie · Pop culture, plus a mood: Hidden
   gems · The icons · Late-night) that **reorders and highlights — never hides**. Stored in try/catch-wrapped
   `localStorage`, degrading to memory.
3. **Butler-voice cards + detail sheet.** Area · tier seal · name (+ native script) · the named dish or
   collection · the *why* line · the guide's note · **Recommended by** chips (institutional authorities get a
   gilt dot). The sheet adds every source with its URL, address with Apple/OSM links, **status with its source
   and check date**, **pin confidence with its source**, and what's close by.
4. **Map that never goes blank.** An offline schematic drawn from the sourced coordinates renders instantly;
   Leaflet + Esri/OSM tiles take over only after a tile actually loads. On mobile, a full-screen map with a
   bottom-sheet carousel.
5. **"A day with your guide."** Six-stop itineraries per area built from the guide's own records, ordered by
   distance, with swap, stated gaps and honest caveats (straight-line distances; opening hours not in data).

---

## 2. Audit of the current site

Rendered with Playwright/Chromium at **390×844 @2x** and **1440×900** (harness: [`tools/shots.js`](tools/shots.js);
metrics: [`tools/audit-metrics.js`](tools/audit-metrics.js) → [`audit-metrics.json`](audit-metrics.json)).
Map tile hosts are blocked by this sandbox's egress policy, so maps show their no-tile state — which is itself
a finding (see 2.6). Fonts load as in production.

| Page (mobile 390px) | Screens to first place | Controls above it | Controls < 44px | Page height | Horizontal overflow | Text samples < AA |
|---|---:|---:|---:|---:|---:|---:|
| `cities/tokyo.html` | **4.9** | 81 | 1,149 / 1,169 | 175,722 px | **651 px** | 294 / 4,000 |
| `cities/chicago.html` | **5.5** | 99 | 1,249 / 1,412 | 141,788 px | **815 px** | 304 / 4,000 |
| `cleveland.html` | 3.1 | 54 | 833 / 840 | 72,473 px | none | 193 / 1,816 |
| `Singapore/toa-payoh.html` | 3.3 | 61 | 164 / 178 | 16,175 px | **469 px** | 192 / 415 |
| `Singapore/index.html` | — | 9 | 2 / 9 | 4,359 px | none | **91 / 115** |

### 2.1 First impression & hierarchy

| Root hub (desktop) | Japan hub (mobile) |
|---|---|
| ![root hub](screenshots/before-root-hub-d.jpg) | ![Japan hub](screenshots/before-japan-hub-m.jpg) |

- The hub's first screen is a headline and a paragraph; countries arrive as emoji-flag cards, cities a scroll
  later. Nothing sells *why* a city is worth it — no signature dishes, no counts at a glance on the country cards.
- **Counts disagree across pages.** The Japan hub card says Tokyo has **441 places (260 sights · 181 food)**;
  the Tokyo page renders **263 sights and 225 food (488)**, which is also what the dataset yields through the
  geocode gate. Hub stats are hand-maintained and drift.
- Tokyo's masthead says **"LAST VERIFIED 2026-08-08"** while its records were status-checked 2026-10-02.
- Tokyo's search placeholder reads **"witchcraft, waterfall, chess, kielbasa…"** — Cleveland's copy, leaking
  through the cloned engine into Tokyo and Toa Payoh.

### 2.2 Density, filters and the long road to the first place

| Tokyo, desktop, first screen | Tokyo, desktop, the filter stack |
|---|---|
| ![Tokyo desktop](screenshots/before-tokyo-d.jpg) | ![Tokyo filters](screenshots/before-tokyo-d-s2.jpg) |

| Tokyo mobile, top | Chicago mobile — 40 source chips before the area list |
|---|---|
| ![Tokyo mobile](screenshots/before-tokyo-m.jpg) | ![Chicago filters](screenshots/before-chicago-m-s1.jpg) |

- Ten stacked control groups (base map, legend, mode, search, **source**, area, collection, rank, sort, been-there,
  quick picks) sit between the map and the first place. Area chips carry the full parenthetical neighbourhood
  list ("SHINJUKU-KU (KABUKICHŌ · GOLDEN GAI · …)"), so on mobile each is a three-line block.
- "Filter by source" is an auditor's tool presented as a primary filter — 20 chips in Tokyo, 40 in Chicago (one per source, plus *All*).
- The ★ anime layer, Tokyo's most distinctive asset, is the second of 14 identical collection chips.

### 2.3 Cards, attribution, closed places and gaps

| Tokyo card, desktop | Tokyo card, mobile |
|---|---|
| ![card desktop](screenshots/before-tokyo-cards-d.jpg) | ![card mobile](screenshots/before-tokyo-cards-m.jpg) |

- **Attribution is honest but reads as raw data**: full URLs in monospace boxes ("GO TOKYO https://www.gotokyo.org/en/story/guide/a-noble-look…"). It's the product's promise and it looks like a log line.
- Checkbox · index number · visited circle stack above the title on mobile, pushing the name down.
- The *Know before* box overflows the viewport on mobile (part of the 651 px overflow).
- **Closed places** are flagged only by "— CLOSED" appended to the name, and still wear their tier badge — e.g.
  *Heinen's Downtown — CLOSED* shows **MUST SEE** in Cleveland. Kept-and-flagged is right; the treatment should
  make "do not go" unmistakable.
- **Stated gaps** (Cleveland's "no Persian restaurant meets the bar") are a great editorial habit but live in
  prose inside a cuisine card; there is no reusable component for them.
- Data note: `k` is a *know-before tip* in Tokyo ("Kaminarimon, Nakamise-dōri, incense cauldron") but bare
  search keywords in Chicago ("aquarium museum family"). Any butler-voice treatment must only voice real tips.

### 2.4 Typography

- Five families on every city page (JetBrains Mono, Archivo Black, Instrument Serif, Newsreader, plus fallback);
  **3,327 text nodes in Tokyo are monospace** — eyebrows, chips, buttons, labels, addresses.
- Uppercase mono at 9–12 px with wide tracking is the dominant UI voice; legibility and tone both suffer.
- **Macron risk (found while prototyping):** the beta re-skin's display face, **Fraunces**, renders `ō`/`ū` as a
  detached bar in our Chromium render ("Shinto¯ shrine", "yokocho¯") — Jost does the same. Newsreader, Figtree,
  Cormorant, Unbounded, DM Sans and Manrope render them correctly. Japan pages are macron-heavy; verify on
  devices before any Fraunces roll-out to Japan.

### 2.5 Accessibility

- **Contrast:** Tokyo has **263** instances of 9 px text at **2.49:1** (`#3E5D53` on `#12171A`) — one per entry.
  The Singapore hub's 9 px pink labels are **3.08:1** (`#C56F73` on `#F3ECF6`); 91 of its 115 sampled text nodes miss AA.
- **Tap targets:** 98% of controls on city pages are under 44 px tall.
- **Overflow:** Tokyo, Chicago and Toa Payoh scroll sideways on a 390 px phone.
- Focus styles exist but the sheer control count makes keyboard traversal to the first place ~80 tab stops.

### 2.6 Map ↔ list and performance perception

| Toa Payoh, desktop — the tile-failure bar | Cleveland, mobile |
|---|---|
| ![SG](screenshots/before-sg-toa-payoh-d-s1.jpg) | ![Cleveland](screenshots/before-cleveland-m-s1.jpg) |

- The map and list are separate stacked blocks: picking a pin doesn't surface its card beside the map, and on
  mobile the map is a box you scroll past. Area labels collide in dense cores.
- When tiles fail the page shows a red-ruled "Map tiles couldn't load from this network" bar with a
  "Try another tile server" button — an apology where a fallback should be.
- The full list renders at once (263 entries in DOM for Tokyo's sights mode alone) — heavy on low-end phones.
  Content-first loading (rule 4) is already right; the cost is DOM size, not network.

**What already works and must be kept:** content without the CDN; no Google/key tiles; try/catch storage; the
trip-builder + export to Google/Apple Maps; *been there*; per-region tiering; honest attribution; closed-kept.

---

## 3. Three directions

All three are original — no third-party hospitality brand's name, logo, colours-as-identity or copy is used.
The references below are for *feel* only: the polish of premium hotel-loyalty apps, the intimacy of
experience marketplaces, and the editorial voice of fashion and travel magazines.

### A · Salon & Night out — **recommended**

![Salon tile](screenshots/tile-a-salon.jpg)

- **Mood:** the grand-hotel writing desk at golden hour; then the same house after dark.
- **Rationale:** warm, quiet luxury that lets *content* be the hero; the guide's voice in serif italics; the
  pop-culture layer gets one playful plum accent so Gundam and Ghibli can wink without cheapening the rest.
- **Palette** (light / night) — all text pairs AA, verified by [`tools/contrast.py`](tools/contrast.py):

  | Token | Light | Night | Use |
  |---|---|---|---|
  | `--paper` / `--card` | `#FBF8F2` / `#FFFFFF` | `#121016` / `#1E1B24` | grounds |
  | `--ink` / `--ink-2` | `#1D1B18` / `#5C564D` (6.9:1) | `#F2ECE2` / `#B9B1A4` (8.9:1) | text |
  | `--gilt` | `#7D5F28` (5.6:1) | `#DDBF84` (10.7:1) | eyebrows, seals, focus ring |
  | `--jade` | `#2E6A58` | `#86CDB5` | dish / collection line, "Open" |
  | `--lacquer` | `#A8321F` | `#FF8A73` | closed, destructive |
  | `--pop` | `#7B3FA0` | `#D9A6F2` | ★ pop-culture moments only |

- **Type:** Newsreader 300–450 (opsz 72 for display, 14–24 for reading; italic = the guide speaking) ·
  Figtree 400–700 for UI. Two families, both with clean macrons. CJK names fall back to Hiragino Mincho /
  Yu Mincho / Noto Serif JP (no web-font cost).
- **Space / radius / shadow / motion:** 4-8-12-16-24-32-48-72 · radius 10 / 16 / 24 / pill · warm two-layer
  shadow · 140 / 260 / 420 ms on `cubic-bezier(.2,.7,.2,1)`, 2 px lift on hover; all off under `prefers-reduced-motion`.
- **Iconography:** 1.5 px line glyphs in gilt; the compass-rose mark; tier seals (✸ must, ◇ detour, ⚷ deep cut).

### B · Midnight Arcade

![Arcade tile](screenshots/tile-b-neon.jpg)

Unbounded + DM Sans; ink-violet `#0E0B1A`, neon magenta `#FF4FB8`, citrus `#D7FF5A`, cyan `#49E0E6`; rotated
"sticker" badges, glow rings, springy motion. **Most fun, best for Tokyo/Osaka at night — but it's nightlife-first,
fights the luxury half of the brief, and ages fast.** Its best idea (one accent reserved for pop culture) is folded into A.

### C · Maison Atelier

![Atelier tile](screenshots/tile-c-atelier.jpg)

Cormorant Garamond caps + Manrope; white, black hairlines, one lacquer-red stitch, oversized numerals, zero
radius, no shadows. **The most "high fashion" — but cold, and Cormorant's light strokes struggle at small sizes
on mid-range Android screens.** Its oversized-numeral idea survives in A's itinerary.

### Why A

It's the only one that is luxurious *and* warm *and* legible at 360 px; it carries a credible dark mode for
"night out" without a second brand; and it leaves room for the content's own colour (each city's real area
palette) instead of competing with it.

---

## 4. Recommended: Salon & Night out

Prototypes (open locally; they need no server and no network): [`prototypes/hub.html`](prototypes/hub.html) ·
[`prototypes/tokyo.html`](prototypes/tokyo.html) · [`prototypes/chicago.html`](prototypes/chicago.html) ·
[`prototypes/itinerary.html`](prototypes/itinerary.html) · [`prototypes/style-tiles.html`](prototypes/style-tiles.html).
Query flags used for the screenshots: `?concierge=1`, `?open=1`, `?view=map`, `?theme=dark`, `?prefs=history,pop&vibe=late`.

### (a) Hub — country → city, wanderlust with real numbers

| Desktop | Mobile |
|---|---|
| ![hub](screenshots/after-hub-d.jpg) | ![hub mobile](screenshots/after-hub-m.jpg) |

![hub cities](screenshots/after-hub-d-s1.jpg)

- Typographic **plates** instead of photos: the city's native name (東京, 京都…) or monogram, the median of its
  real pins as coordinates, and a **colour bar made of the city's actual area palette**.
- **Signature line computed from the data** (canon-first cuisines for US cities, most-populated for the shared
  Japan taxonomy, plus the starred collection): *Tokyo — Ramen · Sushi · Anime*; *Chicago — Pizza · Italian Beef · Architecture*.
- **Counts computed by the same gate as the build**, so the hub can't drift from the page again.
- Three-line promise (Recommended by · Pinned to the door · Open, or honestly closed) on the first screen.
- US tab: ![US](screenshots/after-hub-us-d.jpg)

### (b) Tokyo — concierge, filters, cards, map ↔ list

| Desktop, first screen | Mobile, first screen |
|---|---|
| ![tokyo](screenshots/after-tokyo-d.jpg) | ![tokyo mobile](screenshots/after-tokyo-m.jpg) |

| Concierge (mobile) | Concierge (desktop) |
|---|---|
| ![concierge](screenshots/after-tokyo-concierge-m.jpg) | ![concierge desktop](screenshots/after-tokyo-concierge-d.jpg) |

Curated for *history · pop culture · late-night* — picks lead, all 488 stay listed:

| Desktop | Mobile |
|---|---|
| ![for you](screenshots/after-tokyo-foryou-d.jpg) | ![for you mobile](screenshots/after-tokyo-foryou-m.jpg) |

Night out (dark), curated for *foodie · late-night*:

| Desktop | Mobile |
|---|---|
| ![night](screenshots/after-tokyo-night-d-s1.jpg) | ![night mobile](screenshots/after-tokyo-night-m-s1.jpg) |

Same engine, a US city (Chicago, 367 places):

| Desktop | Mobile |
|---|---|
| ![chicago](screenshots/after-chicago-d-s1.jpg) | ![chicago mobile](screenshots/after-chicago-m.jpg) |

### (c) Place detail sheet

| Desktop drawer | Mobile sheet |
|---|---|
| ![sheet](screenshots/after-place-sheet-d.jpg) | ![sheet mobile](screenshots/after-place-sheet-m.jpg) |

Everything the registry knows, in plain language: every source with its URL; the address with Apple Maps and
OpenStreetMap links; **Status: Open · checked 2026-10-02 · "GO TOKYO spot page (current)"**; **Pin: high confidence ·
"Wikipedia Sensō-ji infobox (35°42′53″N 139°47′48.3″E)"**; close-by places with straight-line distance; *Plan a day here*.

### (d) Mobile map bottom sheet

![map sheet](screenshots/after-map-sheet-m.jpg)

Full-screen map (offline schematic shown; Esri/OSM tiles when reachable), the selected place ringed, a
snap-scrolling carousel of it and its nearest neighbours; edge counters ("↓ 329 further out") instead of
silently cropping.

### (e) A day with your guide

| Desktop | Mobile |
|---|---|
| ![itinerary](screenshots/after-itinerary-d.jpg) | ![itinerary mobile](screenshots/after-itinerary-m-s1.jpg) |

Six slots (Morning landmark → Lunch the city is known for → Afternoon (pop culture if you said so) → Tea →
Golden hour → Dinner & after dark), greedy-nearest within one area, weighted by your picks; **Swap** cycles
the alternatives; empty slots say *"a gap stated, not filled"*; closed places are never scheduled.

### Components carried in the style tile

Closed card (real record: *Unicorn Gundam Statue, DiverCity Tokyo Plaza*, flagged from the registry's status
source) and the **stated-gap card** (verbatim Cleveland text) — see the Salon tile above.

---

## 5. Interaction specs

| Element | Behaviour |
|---|---|
| **Concierge** | Opens from the ribbon / "Your guide". Step 1 multi-select (3 interests), step 2 single-select mood (toggle off allowed). *Curate* saves `{interests, vibe}` to `cleo.prefs` (try/catch → memory). *Just browse* closes without storing. Esc / backdrop closes. Focus moves to the first option; dialog is `aria-modal`. Re-openable via "Change". |
| **Personal ordering** | `score = tier (3/2/1) + 0.25·min(sources,4) + 0.6 if an institutional authority + 2.4 per matched interest + mood bonus (gems: deep cuts up; icons: must-sees up; late: NIGHT/IZAKAYA/SAKE/BAR up) − 6 if closed`. Never filters. "For you" badge on matched cards. Interest tagging keys on **collections/cuisines**, never on description keywords (the Wenwen rule). |
| **Toolbar** | Sticky under the brand bar; one horizontal row, scrolls with a fade edge. Segmented *Everything/Sights/Eat & drink* with counts; area `<select>` (jumps & focuses the map); collection `<select>` (sights collections, cuisines, ♡ Saved); the city's ★ collection as a dedicated chip; *For you* / *By area* sort; *Near me* (geolocation → nearest first; denial → toast, no dead end). |
| **Progressive list** | Renders 30, then +30 when a sentinel nears the viewport; a visible "Show 30 more · N more below · nothing is left out" button for keyboard/AT users; final line states "That's all N". Area headers carry their total so counts never lie mid-scroll. `content-visibility:auto` on cards. |
| **Card** | Whole card opens the sheet (stretched link on the title, so it's one tab stop); Save ♡ (maps to the existing trip set), + Add to a day, ⌖ Show on map. Closed: striped ground, CLOSED tag in place of the tier, explanatory line, "Add to day" disabled. |
| **Detail sheet** | Right drawer ≥1024 px, bottom sheet below; scrim click / Esc / ✕ closes and returns focus; map flies to the pin. |
| **Map** | Schematic SVG first (sourced coordinates, per-area hulls, collision-checked labels, tier-sized dots, closed = hollow lacquer ring, edge counters). Leaflet from cdnjs via an appended `<script>` with `onload`/`onerror`; the tile layer reveals only after the first `tileload`, so a blocked network keeps the schematic with a quiet note — no red error bar. Tiles: Esri World Light/Dark Gray Canvas (no key); OSM as alternative. |
| **Mobile map** | FAB "Map · N" → full-screen dialog; top bar back-to-list + Near me; bottom sheet with snap carousel; tapping a pin re-centres the carousel on it and its neighbours. |
| **Itinerary** | Area select; slots as above; per-slot Swap; straight-line legs with ~minutes at 4.5 km/h, labelled as straight-line; caveat block. |
| **Night out** | Follows `prefers-color-scheme`; manual toggle stored as `cleo.theme`; tile style follows. |

---

## 6. Accessibility & performance

- **Contrast:** every token pair checked in both themes by [`tools/contrast.py`](tools/contrast.py) (exit 1 on any
  miss). Two misses found and fixed during design (gilt on gilt-wash 4.36 → 4.92; white on night lacquer 2.30 →
  ink 8.22).
- **Targets:** chips/buttons 44 px; segmented buttons 38 px inside a 44 px group. Verified by
  [`tools/check-prototypes.js`](tools/check-prototypes.js) (0 undersized in toolbar and cards).
- **360 px:** no horizontal overflow on any prototype (checked).
- **Keyboard / AT:** skip link; one tab stop per card; dialogs `aria-modal` with focus return; `aria-pressed`
  on toggles; live region for the result count; the SVG map is labelled as a schematic and the list is the
  accessible equivalent (488 focusable dots would be hostile).
- **Motion:** all transitions removed under `prefers-reduced-motion`.
- **No-CDN:** with *every* external request blocked (fonts, Leaflet, tiles) all four prototypes render with zero
  page errors — checked. System font fallbacks are metric-close (Georgia/Palatino; system-ui).
- **Weight:** two font families (vs five); first render is 30 cards instead of the whole list; the schematic
  map is one SVG. Tokyo prototype page: 11,090 px tall on mobile at first render vs 175,722 px today.
- **Storage:** every `localStorage` access goes through one try/catch wrapper with an in-memory fallback.

Automated proof (run them yourself):

```
NODE_PATH=$(npm root -g) node design/ux-2026-10/tools/check-prototypes.js
  PASS no document.write in prototypes · PASS no Google / key-required tile hosts
  PASS tokyo.html: renders with all CDNs blocked · PASS no horizontal overflow at 360px
  PASS tokyo.html: every place reachable by paging — 488/488 cards
  PASS chicago.html: every place reachable by paging — 367/367 cards   … all prototype checks passed
python3 design/ux-2026-10/tools/contrast.py   # all pairs AA, light + night
```

---

## 7. Implementation roadmap

The site is ~88 pages built from **one engine** (`cleveland.html`) cloned by `tools/build-*.py`,
`japan_build.py`, `belgium_build.py` and `build-singapore-pages.py`, and rebuilt by `tools/rebuild-city.py`.
That's the leverage: change the engine and the builders' shared chrome once, rebuild every page.
`tools/beta-restyle.py` already proves a chrome-only post-processor can re-skin every page while asserting
byte-identical scripts and P/F counts — Phase 1 reuses that pattern.

| Phase | What changes | Where | Effort | Risk | Gate preservation |
|---|---|---|---|---|---|
| **0 · Fix the audit bugs (now, independent of the redesign)** | Kill Cleveland's search placeholder in clones; derive hub stats and "last verified" from data at build time; stop showing a tier badge on closed places; fix the 3 overflowing card elements; raise the 9 px label contrast | engine + builders + hub generator | S (1–2 days) | Low | `npm run validate` + `npm test` unchanged; add a test asserting hub counts == page counts |
| **1 · Tokens & type (chrome only)** | Salon tokens + Newsreader/Figtree + Night out, applied via a post-processor modelled on `beta-restyle.py` into a parallel tree, then promoted | new `tools/salon-restyle.py`; CSS only | M (3–5 days) | Low — scripts untouched, asserted | reuse beta-restyle's `--check` (script bytes + P/F counts identical); add `contrast.py` to `npm test` |
| **2 · Card, sheet, attribution chips** | New card renderer + detail sheet in the engine's render function; source chips replace URL boxes (URLs move to the sheet); closed + stated-gap components | `cleveland.html` engine JS, cloned by every builder | M–L (1–2 wks) | Medium — `test.js` asserts on DOM | Update `test.js` selectors deliberately; keep the record-count asserts (rule 2) in any script that edits `cleveland.html`; `validate.js` unchanged (data untouched) |
| **3 · Toolbar, progressive list, map** | Single sticky toolbar; source/rank/visited filters move to a "More" sheet (kept, not removed); progressive rendering with the all-reachable guarantee; schematic-first map, tiles on first `tileload`; mobile map sheet | engine | L (2 wks) | Medium — map code; engine_guard must still pass | `check-google.py` + engine_guard unchanged; add "every record reachable" + 360 px + no-CDN checks from `check-prototypes.js` to `npm test` |
| **4 · Concierge, Near me, itinerary** | Prefs + scoring (keys on collections/cuisines), itinerary page generated per city | engine + one new template per city | M (1 wk) | Low–Med — tagging must follow cuisine rules | tests for "personalisation never hides" and "closed never scheduled" |
| **5 · Hubs** | Data-driven country/city hub with computed counts, plates, canon line | hub generator (`index.html`, `Japan/`, `Singapore/` …) | M (3–5 days) | Low | counts asserted against built pages |

**Migration:** build each phase into a parallel tree first (like `beta/`), screenshot-diff all ~88 pages with
`tools/shots.js`, then flip per country (Japan first — it benefits most and is newest), then US, then the
pastel SEA editions (which collapse into Salon light/night rather than staying a third skin). Per-city work is
limited to a one-line lede and choosing the city's ★ collection; everything else is inherited.

**Risks:** engine changes ripple to 88 pages (mitigated by parallel tree + count asserts); concurrent data
sessions keep rebuilding pages (land engine changes between waves, rebuild via `rebuild-city.py`); fonts on
older Android (two families, `display=swap`, metric-close fallbacks); personalisation drifting into
keyword-tagging (spec forbids it; test it).

---

## 8. Decisions for the owner

1. **Direction:** A (Salon & Night out) as recommended — or B/C, or A with more of B's energy on Japan pages?
2. **Brand name:** keep **Cleo** (the beta wordmark, used here) or rename before the roll-out?
3. **Light-first or dark-first?** Proposal: light by day, Night out by system setting/toggle (today's site is dark-first).
4. **Source filter demotion:** OK to move "Filter by source" (and rank / been-there) from the main stack into a
   "More filters" sheet? Nothing is removed.
5. **Concierge default:** prompt on first visit (ribbon only, as prototyped) or open the picker automatically?
6. **Pastel SEA edition:** fold Singapore/Vietnam into Salon, or keep the pastel skin as a deliberate regional variant?
7. **Itineraries:** ship as computed suggestions (as prototyped) or only hand-curated days per city?
8. **Phase 0 fixes:** approve the five audit fixes now, independently of the redesign?

---

## 9. Reproduce

```bash
python3 design/ux-2026-10/tools/extract.py        # real records → prototypes/data/*.js (geocode-gated)
python3 design/ux-2026-10/tools/make-pages.py     # stamp tokyo.html / chicago.html from tools/city-template.html
NODE_PATH=$(npm root -g) node design/ux-2026-10/tools/shots.js before|after|tiles
NODE_PATH=$(npm root -g) node design/ux-2026-10/tools/audit-metrics.js
NODE_PATH=$(npm root -g) node design/ux-2026-10/tools/check-prototypes.js
python3 design/ux-2026-10/tools/contrast.py
```

Sandbox notes: Leaflet is served from `tools/node_modules` and tile hosts are blocked by the egress policy, so
screenshots show the no-tile state; Google Fonts are fetched with curl (which trusts the proxy CA) and handed
to Chromium. Nothing in the prototypes depends on either.
