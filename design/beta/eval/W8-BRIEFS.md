# Wave 8 briefs

## Part 1: fan-out started before the R7 results (owner, 2026-10-11 18:40Z)

The owner: *"Meanwhile autonomously continue to work and Fanout on the other agents lane and iteratively work until completion!!"*

The Atlas map is being redesigned in its own loop (design/beta/atlas/PANEL.md). R7 QA and the evaluator are measuring `badcc20d`. While they run, the idle lanes take the gaps that R6 named and W7 did not close. **R7 QA findings routed to a lane take priority over this list.** Every lane keeps the hard rules (CLAUDE.md, rule 6, no CDN for content, OSM/Esri only, localStorage try/catch, every place kept, closures flagged, attribution visible) and runs validate + npm test + beta:check before each push.

Atlas files (`atlas.js`, `atlas.css`, the Atlas parts of the view JS) belong to the Atlas loop. Other lanes don't edit them.

### Lane FE-A (city pages, Gallery, place detail, day plans)

1. **"Start with" matches the lead card** (R6 gap #8, carried from R5 #5).
   - Acceptance: on every city page, the "Start with" button names the place shown on the lead card.
   - A test over all 84 place pages.
2. **"Your guide" and day plans** (R6 D: 77). Walk the flow at 390 and 1440, light and dark: build a day from saved places, see it, reorder or remove, share it (the link reopens it), and print or save.
   - Fix rough edges outside atlas.js.
   - The day summary (stops, distance) is visible without hunting.
   - Every step is reachable by keyboard.
   - A probe test covers build → share → reopen.
3. **Place detail and Gallery polish against D12/D13.**
   - Section rhythm, sticky action bar, sources always visible, closures loud.
   - Category bar behaviour on scroll.
   - Grid density at 1024 / 1280 / 1440 (no orphan columns).
   - Self-review with before/after shots in design/beta/eval/w8/fe-a/ and a list of what changed and why.

### Lane FE-B (landing, hubs, Guidebook, Insights, "What changed")

1. **Guidebook and Insights under design system v2.** Audit both at 390/1440 in light and dark. Then:
   - **Guidebook:** chapters lead with a credited photo where one exists (never on food places, venues, closed places or Vietnam; credit under the media).
   - **Insights:** charts use the v2 palette and tabular figures.
   - **Both:** v2 tokens only. Shots go to design/beta/eval/w8/fe-b/.
2. **Price/rating wording in record prose** (pending since W3; R6 owner-blocked ≈ +0.2). 269 places' record prose (live data) carries price or rating wording, shown verbatim in the Guidebook.
   - The beta will **label rather than strip**: where a record's prose contains price or rating wording, the Guidebook and detail show a quiet note, "Prices and ratings are quoted from the source at the time of research (<date>)".
   - The data stays untouched (live pipeline, out of scope).
   - Record it as **D-39 (proposed; the owner may veto: the alternative is stripping)** in docs/BETA-DECISIONS.md.
   - A test checks that every such record shows the note and that no record without such wording does.
3. **Type rebuild residue** (R6 gap #3), on the landing, hubs, Guidebook and Insights:
   - only the shipped weights render;
   - ≤ 5 rendered steps between 12 and 17 px;
   - no single-word last lines in deks, stat lines or rail subtitles at 390 and 1440 (`text-wrap: balance/pretty` or copy);
   - hero sizes ≥ 40 px use the higher optical size;
   - your CSS has ≤ 12 distinct raw font sizes and ≤ 4 raw radii (tokens instead).
4. **`design/beta/DESIGN-SYSTEM.md` documents what ships** (R6 D7 ◐): the v2 palette (D-37), Bricolage Grotesque + Inter, the type scale, radii, the 3-step elevation, motion tokens (`--dur-grow`), the card anatomy and the credit rules. Remove what no longer ships.
5. **"What changed" pages** (R6 gap #4): bottom-bar labels ≥ 4.5:1 in light and targets ≥ 44 px on all 84 pages (`beta:metrics:all` B-23/B-20). Confirm, and fix if still open.

### Lane imagery (Wikimedia Commons via GitHub Actions)

1. **Coverage.** Credited photos for the places a visitor sees first.
   - In priority order: for every city guide (not Vietnam), the lead card, then the first rail row, then the remaining tier-1 open sights.
   - Never food places, venues or closed places.
   - High-confidence Commons matches only, with the same refusals (signage, close-ups, equipment, winter/overcast heroes) and one file per row.
   - Aim for every non-Vietnam city's first screen to be photographic where an honest match exists. A stated gap is fine.
   - Report coverage per city before and after.
2. **Weight.** New files go through recompress on the runner. Report the Tokyo, Cleveland and New York first-load transfer (desktop and phone@3×) after the run, and keep it ≤ 2.0 MB.
3. After each Actions run, tell the orchestrator. The orchestrator reviews a contact sheet of every new photo.

## Owner request (2026-10-11 18:50Z): retire superfluous capitals across the UI

> "And those capital initials everywhere in the UI I don't think we need them they are superfluous and don't serve any purpose! Have the UI and front end engineer revise that too!!!"

**The rule** (the designer writes it into `design/beta/DESIGN-SYSTEM.md` and audits every surface in `design/beta/CASING-AUDIT.md`):
- **Sentence case for every UI label:** category and rail names, section titles, buttons, chips, eyebrows, chart titles and table headers. For example "Iconic & Must-See" → "Iconic & must-see", "Free to Visit" → "Free to visit".
- **No `text-transform: uppercase` or `capitalize`.**
- **No decorative initials:** no `::first-letter` drop caps in Guidebook chapter or collection intros, and no cover initial plates (`.pl-ini`, `.cover .plate.i`).
- **Capitals that carry meaning stay:**
  - the first word;
  - proper nouns and place names (from the page's own data, plus a small curated list);
  - acronyms (UNESCO, JNTO, NPS);
  - source names exactly as their publishers write them.
- Native scripts and diacritics are untouched.
- Data is not edited. Casing happens at display time through one shared helper, `tools/beta/lib/casing.js` (`sentence(label)`).

**Owners:**
- FE-A: the helper; city pages, cards, Gallery, detail; the casing test wired into `npm test` (no uppercase/capitalize transforms, no styled `::first-letter`, no Title Case UI labels outside the allowlist).
- FE-B: landing, hubs, Guidebook, Insights, "What changed", how-we-choose.
- Atlas lane: Atlas surfaces, in its next SPEC-v3 slice.

## Part 2: from ROUND-7 (R7 = 88.5; A 83 · B 91 · C 96 · D 89)

The evaluator's gaps and acceptances are in `design/beta/eval/ROUND-7.md` § "Top gaps". Every lane builds to those acceptances exactly; each one is a test. Some items already landed after `badcc20d`:
- the carousel credit (Atlas f5efbc66);
- Cleveland's "Start with" (FE-A bae1b624);
- the price/rating note (D-39, FE-B ba5d7e23).

Those still need their acceptance test to pass on the new head. **The Atlas map review loop (PANEL.md) stays top priority** for the designer and the Atlas lane. Owner-blocked: ≈ +0.6 (a reviewed second locale, the D-39 confirmation, the Unsplash top-up).

### Imagery: R7 gap 1, photo coverage (+1.15)
- (a) A credited hero on ≥ 78 of 84 place pages, or a stated per-guide reason in the manifest. Most missing heroes are Singapore towns and smaller US guides.
- (b) ≥ 60 % of eligible tier-1 sights photographed. Use the agreed per-class widths: heroes, leads and first rows at 500+960; other tier-1 at 500w only. Scope order: `pilots`, then `all`, each after the orchestrator's contact-sheet review.
- (b) On every guide with eligible sights, the first phone screen shows ≥ 1 photo.
- (c) The credit gate is unchanged.
- **R7 gap 7, imagery half:** every 960w JPEG ≤ 120 KB, done by recompress.

### FE-A: R7 gap 2 (+0.52), gap 3 (+0.46), gap 5 (+0.19, its pages)
- **Gap 2 polish:**
  - (a) No credit overflows its box (test).
  - (b) Top bar and tab bar backgrounds fully opaque.
  - (c) The phone search placeholder is unclipped ("Search Cleveland").
  - (d) The desktop place sheet gets a scrim, is centred or docked flush, and its close button never overlaps the switcher.
  - (e) No photo is upscaled past its source width.
  - (f) "No. N of M in <area>" uses the area's full count, with N ≤ M on all 8,458 sheets (test).
  - (g) No single-token last line in the dek or the masthead stat line ("· 1 closed", "Edo-/Tokyo Museum") at 390 and 1440.
  - (h) The "Start with" test is already landed.
  - Also: a closed place never offers Directions as its primary action (closure honesty).
- **Gap 3, two more delight moments** (each ≤ 300 ms, none under reduced motion, test):
  1. Photos fade in from a dominant-colour placeholder. The colour is computed at build time and stored per photo; coordinate with imagery.
  2. A view-switch transition: the switcher's selection slides and the content cross-fades.
  The Atlas lane owns pin → preview grow inside the map.
- **Gap 5, FE-A's pages:**
  - B-02: the phone hero strip is short enough that the masthead stays ≤ 0.6 of the screen.
  - B-08: the floating "Show map" pill never covers a card title in the default view.
  - B-04 and B-20 on the 9 failing pages each.
  - The blank band left of the desktop hero.
  - Category-bar labels must not truncate: two lines or shorter labels, with the casing helper.
- **Food covers** (K1 and Luxury, "blank sand boxes read as not loaded"). Food places never get photos (honesty rule), so the no-photo cover must read as intentional:
  - the dish or cuisine name set in display type on the kind tint;
  - plus the kind glyph;
  - the designer reviews the shots before merge.

### FE-B: R7 gap 5 (hubs), gap 6 (+0.17), type residue
- **Gap 5 B-05:** on all 7 failing hubs, the city grid starts in the first phone screen.
- **Gap 6:**
  - Insights bars on the designer's v2 series tokens (K8);
  - ≤ 6 distinct raw letter-spacings and ≤ 10 raw shadows across the beta CSS (`probe-css.py`; coordinate with platform for shared files);
  - tabular figures on Guidebook facts and Insights axes (≥ 90 %).
- **S2 widows on your surfaces:** the hub "Known for" (e.g. "· jingisukan"), deks and stat lines.
- **Strays:** the 3 px and 6 px radii on the landing page; the lone filter-button row in phone Guidebook and Insights.
- **Moderate axe:** `aria-allowed-role` (56 runs) and `heading-order` (24 runs). Fix them on your pages; platform takes the shared shell.

### Platform (reopened): R7 gap 7 (+0.16), axe moderates, harness support
- A phone @3× never fetches a 960w photo for a slot under 200 CSS px: correct `sizes` per slot, Atlas thumbnails and carousel included.
- Tokyo phone @3× first load ≤ 700 KB transfer.
- `cleo.css` ≤ 200 KB raw with the dead R6 layers removed. Coverage-guided; every gate green; shots before and after on the pilots.
- `aria-allowed-role` and `heading-order` in the shared shell.
- Once R7 QA ratifies the B-06/07/09 re-pointing, implement it in metrics.js.
