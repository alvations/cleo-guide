# FE-A checkpoint (city pages, cards, Gallery, place detail, day plans)

Session: session_0192s7fEFwRUZrw5ocAEJn9G (this lane). Orchestrator: session_01PCNcUkfa5S1N1BKGzZA4xx.
Branch: `claude/peaceful-goodall-i0hsrt`. Push: `tools/beta/sync-push.sh` (merge only; verifies ls-remote == HEAD).

## Task
Fix the R7 QA and QC rows routed to FE-A, then the designer's follow-ups, in the orchestrator's order.

## Done (on origin, verified)
- **D-49 §v2.7b no-photo card:** d6bb8367a. **D-46 desktop lead (.pl-lead, build-marked MP #1 with photo; html.cleo-lensed gate):** adeabcd63. **QA-82 + landscape rail not sticky:** 975e2bfe4. **OV-106/115–117 fold <1024 + QC-06 768 switch:** c13cc79fa (head c45c0aa94).
- **Open:** w8 day-summary row red on base — designer's cleo.css cut bbaf111a8 dropped .day/.daysum/.stop rules; asked designer to restore. Next: T1 chrome 11.8→11 %, fe-a.css −30 KB on designer's corrected coverage (design/beta/eval/css-coverage.json, tools design/beta/tools/css-trim.py + css-parity.*), FE-1 landscape filters slot, phone sheet CLS.
- **W8:**
  - "Start with" = the lead card: bae1b624
  - day plans: 16720bd1
  - place detail: 9b514f1a
  - R7 gap 2: 16255149
  - gap 5: 7c70e821
  - gap 3: e4db2ca7
- **Owner:** casing helper `tools/beta/lib/casing.js` and `test-casing.js`: 6733a233
- **QA:**
  - QA-47 / QA-48 / QA-51 / QA-55 / QA-59b–d: b244f104
  - QA-50 and QA-60 (B-04, bar above the lead card): dbd6d87d
  - QA-59a (clamped name, third line): 2454c6fd
  - QA-69 (map pill visible at load): 69ca3690
  - QA-67 (detail media fits its photo; frame for narrow copies, awaiting the designer's sign-off): f08f892d
- **QC:**
  - QC-07 (Esc → opener): c54e55d1
  - QC-06 (switcher 44 px; FE-B now owns the switcher): a5900fbc
  - QC-08 (area chips in the Gallery toolbar; the lead card hides under a lens): 5b1074f9
- **Food covers (designer sign-off a/b/c):** `--cover-food` token, word capped at `--fs-d2`, word from `tools/beta/lib/dish.js` (never a source or award; area fallback), the grid kind line drops the duplicate dish; test in test-fe-a. SHA: see the commit titled "food covers per the designer's sign-off"
- **Copy:** dropped "— numbered to match the map" in client/city.js: 99e78046

- **Bundle (16:00Z/16:17Z/16:43Z orders):** QA-72, QC-22, QA-73, QA-59b (confirmed), QA-55 Guidebook, R7-g6 tracking + shadows, D-40 (a) Gallery sizes. SHA: the commit titled "QA-72 …". Probe rows in w8-fe-a-probe.js.

- **QA-75 (PERF-08 re-land prep):** root cause in city.js cleo:stamped adoption (not views.js); fixed; perf08-regress.sh PASS with selective forced on locally. Commit "QA-75 …". Platform owns flipping the flag.

- **QC-30** casing rule (designer-approved; generic list in allowlist.json) + W7 card chip fit: commit "QC-30 …".
- **Next:** QC-31 — fe-a.css raw colours/radii → designer tokens (--surface/--paper without fallbacks, --mask, --shade-text-strong, --r-xxs) once the designer's tokens.css lands.

- **D-46 part 1 (pushed, commit "D-46 prep …"):** Atlas list-column city intro (`.at-intro`, server-rendered, desktop Atlas only, 79 px), lead-card CSS (`.pl-lead`, inert until the Atlas lane sets the class), legacy `#pg=`/`#all=1` imply Gallery, search route = source of truth (FE-B finding; test-fe-a cases).
- **D-46 part 2 — DONE** (commit "QA-80 … D-46 …"). Was blocked on the DOM budget until platform 257e0b0f. Old notes: the default flip (core.js DEFAULT/VIEWS marked edits, render DV/VIEWS order, views.js avail order, test-fe-a/test-beta/test-views default checks). Saved as `docs/resume/fe-a-d46-flip.patch` (taken before the `.dek` class fix; re-apply with `git apply --3way`, keep `class="at-dek dek"`).
  - Blocker: `w2 --only dom` with Atlas default = Tokyo 3,587 / 3,543 nodes (> 3,000): Atlas stamps 59 cards at ~42 nodes. Asked FE-1/FE-2/platform to hold Atlas's initial stamping to its first page (≤ 36 cards). Platform OK for core.js edits was requested.
  - Lead card: asked FE-1 to add `.pl-lead` on the first card of their order on a cold unfiltered load (before .ms-ready).

- **OV-01 FE-A part** (commit "OV-01 …"): Cleo.chrome / html.ov-c (views.js), header 52/56/48, compact CSS for .cbar + rail, landscape one bar, desktop only-header sticky; probe rows. Waiting: FE-1 wires pan → Cleo.chrome.compact(true,'pan') + idle(1200) and hides .ms-bar / peek under html.ov-c; landscape chip row + peek.

- **2026-10-17 status:** QA-80 + D-46 flip eba39fb6; OV-101/113/114 db7e574b; one-search slot 276fc6f2; R8 #7 line-height tokens + UI face < 24 px (commit "R8 #7 …").
- **Open:** food-cover placement (imagery c16f50e8 API: foodStyle/foodGlyphs); fe-a.css −60 KB trim with the designer; card-meta 3 lines (asked designer to rule, FE-C owns the lines).
- **Lesson (3rd time):** never append `// comment` mid-line before existing code — it swallowed Cleo.need('empty') (caught by test-fe-c).

## Next (in order)
0. ~~W9-2 card part~~ built by FE-C through hooks (fresh.js, 38228322b) — nothing for FE-A.
   - ~~QC-25, colophon, R3 #9/#14 one ring~~ DONE (commit "QC-25 …"). Leak left on FE-B's changes/ pages ("Status source: <note>", lib/changes.js) — reported.
   - ~~PANEL-R2 #1~~ already met on the merged head (phone-Atlas sheet top at y=354 on Cleveland/Tokyo/NY 390×844, pin in the band above); told FE-1/FE-2.
   - ~~Designer nit~~ DONE (commit "detail focus: the dialog on a tap …"): tap/deep link focuses the ringless dialog, keyboard open focuses ✕; C.trap wraps Shift+Tab from the container.
1. ~~**Food covers**~~ DONE (this push; see Done) (designer sign-off, docs/resume/designer.md "Food-cover review", DESIGN-SYSTEM §v2.11):
   - (a) `background: var(--cover-food)` for food and `var(--cover-sight)` for sights; drop the literal sun mix and its `!important`;
   - (b) word `font-size: clamp(var(--fs-ui), 9cqi, var(--fs-d2))`;
   - (c) the cover word is the dish or cuisine, never a source or award ("Michelin" → the next cuisine, e.g. Kaiseki or French). When it equals the card's kind line, the kind line shows the area. Fallback: the area.
   - Code: `client/city.js` `dishOf`, `client/gallery.js` gcard `.dish`, `lib/gallery.js` `dishOf` (slim `d`), fe-a.css section 17.
2. ~~**B-20, 9 pages**~~ DONE ("Must see" sticker 44 px tap box; commit "B-20 …") (FE-B sweep 78e4ab74, design/beta/eval/w8/metrics-all/REPORT.md): the card tier link `a.tier.t1` "Must see" is 91×28 at 390.
   - Fix: a 44 px tap area via vertical padding and a negative margin (`render/city.js` `tier()`, fe-a.css card eyebrow).
   - Re-measure: `tools/beta/feb-metrics-batch.sh 1 '<page-regex>'`.
3. ~~**Dark-mode contrast**~~ RESOLVED by the --cover-food tint (dark: all cover words/plates ≥ 4.5 on Tokyo 390/1440) (Atlas FE-1 report): the cover plate's Japanese line `.food … > .v.plate[lang=ja]` is 4.14 (#a69e97 on #463b2a, 13 px). Use `--ink-2` or lighter in dark mode.
4. ~~**Copy**~~ DONE (en.json + ja.json city.how.order) (designer, PANEL-R3 #2): drop "Numbers on the cards match the pins on the map" in the render/city.js "How we choose" paragraph.
5. ~~DONE~~ (designer confirmed 2026-10-16; commit "one visible number in the detail") **PANEL-R2 #11 / SPEC-v3 rev 4 §3.6, "one numbering in the detail"** (FE-2 report):
   - drop " · pin N" from the badges line;
   - the nav row becomes plain previous/next, keeping the neighbours' names as labels;
   - keep "No. k of n in {area}".
   - The W7 probe asserts "… of 488" in `[data-sh-pos]`. Confirm with the designer/orchestrator, then update that check in w7-fe-a-probe.js and log it in BETA-LOG (a spec change, not a weakened test).
6. ~~**QC-11:**~~ NO CODE NEEDED — qc.js S-12 = 0 at 390/768, light+dark, on Tokyo, Cleveland, New York, Chinatown, Wheeling, Ho Chi Minh City after PERF-06 (reported). CLS on phone and tablet, after platform's PERF-06 lands. Fix only what remains (the rail and toolbar at 768).
7. ~~**QC-14 snap-spacing:**~~ DONE (commit "QC-14 …"; FE-B's .views lines untouched; the .pl-s .src chip went to line-height 28 to keep 44 px)
   - run `python3 design/beta/tools/snap-spacing.py tools/beta/lib/render/fe-a.css`;
   - **leave the `.views[data-cleo-views]` lines (FE-B QC-09 / QC-10) alone** until FE-B lands its 200 % fix;
   - check Gallery and the detail at 390 and 1440.

8. ~~DONE (commit "deep link keeps its card in view")~~ **FE-B finding: fresh `#view=gallery&p=senso-ji` at 195×422** lands scrollY past main's end (card off-screen). Investigate the deep-link scrollIntoView vs deferred chunks growing (client/city.js onRoute).
9. Designer: QA-67 narrow-photo fit + cover-word fallback done in 8427064e — confirm sign-off.

## In flight
Nothing unpushed. No long runs.
- Lesson (again): never end a line of client JS with a // comment followed by code — it swallowed `C.onSheet(c)` once (caught by test-fe-c before push). Don't run builds while a background `npm test` is reading beta/.

## Notes
- **Gates:** `cd tools && npm run validate && npm test && npm run beta:check`, plus the FE-A probes:
  - `npm run -s beta:probe:fe-a` (W7);
  - `npm run -s beta:probe:fe-a:w8` (W8 + QA/QC rows; output in design/beta/eval/w8/fe-a/probe.txt).
- **Shots:** `NODE_PATH=$(npm root -g) node tools/beta/w8-shots.js --out design/beta/eval/w8/fe-a/after [--only id,…]`.
- **QA metrics:** `cd tools && node beta/metrics.js` (pilots) writes qa/beta-metrics.*. **`git checkout qa/` afterwards**, because QA owns qa/. A `--all` run takes over 45 min: use FE-B's batch script instead.
- **Other lanes' marked hooks in FE-A files.** Keep them when editing:
  - `FE-B D-39 (QA-65)`: data-pq and the price/rating sentence;
  - `FE-B QC-09` / `QC-10`: the switcher markup, views.js and fe-a.css switcher rules — **FE-B owns these lines**;
  - `FE-C W9-x hook`: base, share cards, trips; W9-1 and W9-9 are FE-C's now;
  - `i18n D-41`: `tr()` server-side and `tt()` client-side. New UI strings need an en.json key, or test-i18n fails;
  - Atlas FE-2: `C.placeOpen` / `C.atView` / `C.freshPlace` / `C.ringKeep`.
- **Atlas files are off-limits:** atlas.js, atlas.css, atlas-nav.*. QA-61 was fixed there (skipped here).
- **Push rule:** a green, verified push every 20–30 min, and this file updated in the same push.
