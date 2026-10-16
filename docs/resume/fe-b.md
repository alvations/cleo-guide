# FE-B checkpoint

Lane: landing, country hubs, static pages, Guidebook, Insights, "What changed" (tools/beta/lib/render/{landing,hub,
method,shell}.js, lib/render/fe-b.css, client/{guidebook,insights,interests,landing,search}.js, test-hubs.js,
test-views-b.js). Report to the orchestrator (session_01PCNcUkfa5S1N1BKGzZA4xx) with issue ids + SHAs after each push.

## Task

Idle after QC-10 (reopened by QC) and the B-04 / B-20 sweep. Waiting for QC re-verification of QC-09 / QC-10.

## Done

- QC-10 (reopened): a user switch to Guidebook / Insights focuses a placeholder h1 named for the view at once (views.js),
  then the module's own h1 once drawn (ctx.user, used once). Probe: H1 at 700 ms on all 4 switches, cold load untouched.
- B-04 / B-20 sweep (R7 gap 5): all 180 pages, design/beta/eval/w8/metrics-all/ + REPORT.md. B-04: 0 of 84 place pages
  fail. B-20: 9 pages, one node only: the card tier link a.tier.t1 "Must see" 91x28 (FE-A's render/city.js tier()).
- QC-09 + QC-06 (switcher): see the commit "beta QC-09 + QC-06 (FE-B for FE-A)". div.views[role=group][aria-label=View]
  with 4 pressed toggles at every width (city.js), no phone collapse (views.js; a tap with a sheet open closes it and
  switches; focus to the view's h1), fe-a.css `.views[data-cleo-views]` rules (sand track, surface thumb, >= 44 px,
  52 px phone row, glyph + tooltip < 300 px), phone overlays (#cleo-sheet/#cleo-fy/#cleo-tray) start below the row.
  Probe: tools/beta/feb-switcher.js (390/768/1440/260). Static guard in test-views-b.js.
- QC-14 (FE-B half): fe-b.css spacing snapped with design/beta/tools/snap-spacing.py (40 snapped, 110 tokenised);
  also the hub "Known for" separator spacing (" · "). SHA in the commit titled "beta QC-14 (FE-B)".
- QC-01 (High), QC-02, QC-03, QC-10: 68b442c0 (merged 2bfff3fe). Insights marks link only when the lens they open
  shows exactly their count; lensed Insights ("43 of all 488"); focus to the view's h1 after a switch.
- QA-65 (D-39 note in the place detail): 20e9a8e7. OWNER-casing on FE-B surfaces: 6b48078d, f0706b4d, 5361b121.
- W9-1 Insights recognition chart: 5fb34343. W9-10 dated edition: d4995581. W9-3 For you rail: 660483aa.
  W9-6 paste a link: 273190b6. W9-2 landing month module + RSS: 087a88ab. R7-g2b opaque tab bar: 39a5e3e0.

## Next

1. Pull, read this file, run the gates; read notifications.
2. Follow up: FE-A has the a.tier B-20 finding (all 9 pages); Atlas FE-1 has the phone-Atlas switcher placement.
3. Re-run one page after either fix: `tools/beta/feb-metrics-batch.sh 1 <page-regex>` (delete that page's JSON first).

## In flight

Nothing unpushed.

## Notes

- Gates before every push, fail-fast: `cd tools && npm run validate && npm test && npm run beta:check`, plus
  `node beta/test-beta.js`, `node beta/qa/test-honesty.js`, `node beta/imagery/test-imagery.js`.
- Switcher probe: `tools/beta/feb-switcher.js [page]` (same static server).
- B-05 probe: `tools/beta/feb-b05.js` (needs `python3 -m http.server 8765 -d <repo>`; ≥ 2 on landing + every hub).
- Push with `tools/beta/feb-push.sh` (merges origin, regenerates beta/ on generated conflicts, stops on any source
  conflict or leftover conflict marker, verifies the ref moved). Re-run the gates on the merged head afterwards.
- Edits in other lanes' files are small, marked and announced: views.css / v2.css (designer), city.js + sheet.js
  (FE-A: `data-fy`, `data-pq`, the `interests` export, the `// FE-B D-39 (QA-65)` sheet block).
- Insights link rule: `exact(uid)(lens, n)` in client/insights.js — a mark links only if lensMatch over the lensed set
  equals its count; otherwise it is a plain bar and the card prints why (WHY table). Keep test-views-b's independent
  MATCH in step with core.js `Cleo.lens.match`.
- Closure notes are not repeated in the Guidebook (some quote money; the views carry no prices — honesty gate).
