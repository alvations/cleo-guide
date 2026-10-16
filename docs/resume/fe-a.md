# FE-A checkpoint (city pages, cards, Gallery, place detail, day plans)

Session: session_0192s7fEFwRUZrw5ocAEJn9G (this lane). Orchestrator: session_01PCNcUkfa5S1N1BKGzZA4xx.
Branch: `claude/peaceful-goodall-i0hsrt`. Push: `tools/beta/sync-push.sh` (merge only; verifies ls-remote == HEAD).

## Task
Fix the R7 QA and QC rows routed to FE-A, then the designer's follow-ups, in the orchestrator's order.

## Done (on origin, verified)
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

## Next (in order)
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
5. **(NEXT — waiting on the designer's answer)** **PANEL-R2 #11 / SPEC-v3 rev 4 §3.6, "one numbering in the detail"** (FE-2 report):
   - drop " · pin N" from the badges line;
   - the nav row becomes plain previous/next, keeping the neighbours' names as labels;
   - keep "No. k of n in {area}".
   - The W7 probe asserts "… of 488" in `[data-sh-pos]`. Confirm with the designer/orchestrator, then update that check in w7-fe-a-probe.js and log it in BETA-LOG (a spec change, not a weakened test).
6. ~~**QC-11:**~~ NO CODE NEEDED — qc.js S-12 = 0 at 390/768, light+dark, on Tokyo, Cleveland, New York, Chinatown, Wheeling, Ho Chi Minh City after PERF-06 (reported). CLS on phone and tablet, after platform's PERF-06 lands. Fix only what remains (the rail and toolbar at 768).
7. ~~**QC-14 snap-spacing:**~~ DONE (commit "QC-14 …"; FE-B's .views lines untouched; the .pl-s .src chip went to line-height 28 to keep 44 px)
   - run `python3 design/beta/tools/snap-spacing.py tools/beta/lib/render/fe-a.css`;
   - **leave the `.views[data-cleo-views]` lines (FE-B QC-09 / QC-10) alone** until FE-B lands its 200 % fix;
   - check Gallery and the detail at 390 and 1440.

## In flight
Nothing unpushed. No long runs.

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
