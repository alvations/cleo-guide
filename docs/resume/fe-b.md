# FE-B checkpoint

Lane: landing, country hubs, static pages, Guidebook, Insights, "What changed" (tools/beta/lib/render/{landing,hub,
method,shell}.js, lib/render/fe-b.css, client/{guidebook,insights,interests,landing,search}.js, test-hubs.js,
test-views-b.js). Report to the orchestrator (session_01PCNcUkfa5S1N1BKGzZA4xx) with issue ids + SHAs after each push.

## Task

R7 evaluator gaps on today's head (orchestrator, 2026-10-16): (1) R7-g6 palette / token residue — pushed, shadows 13 → 10
waits on FE-A / Atlas snaps; (2) R7-g2 (g) no single-word last line (dek, masthead stat line, hub Known for) at 390 + 1440
and (h) phone "Start with" card = desktop "Start with …" link, as tests over 84 city pages + hubs + landing; (3) R7-g5
B-02/B-04/B-05/B-08/B-20 at 0 failing hub + landing pages (metrics-all sweep).

## Done

- W9-6 acc1 + acc4 (paste a link): build.js writes data/source-hosts.json v2 from each source's domains AND every cited
  URL's host (2,227 hosts; gotokyo.org → GO Tokyo), plus 32 lazily-loaded shards data/source-urls/<djb2 % 32>.json keyed
  by the normalised URL (host without www. + path, no query/hash/index.html/trailing slash) for an exact "Recommended on
  this page" match. Wording "Everything {source} recommends, in {N guides}"; no match = "No guide cites {host} yet." +
  "Suggest this source" (issues/new?labels=source-suggestion). Tests in test-hubs (gotokyo, 20 sampled cited URLs, own-JSON
  only fetches).
- W9-2 acc2 + acc5: "This month in Cleo" + retiring count (lib/changes.js RETIRING); HOURS adds "Open 24h" / "open later"
  (6ef26636d → a44d836fb).
- R7-g6 closed: after FE-A (8b06f542) + Atlas (7c280435) snaps, 0 raw letter-spacings and 7 raw shadows (all per-element
  or the pill focus ring); test-views-b pins ls == 0, sh <= 7.
- QC-19 rest: lib/quoted.js POPULARITY adds top-/highest-/best-/well-/most-/five-star-rated (cain-park, tita-floras).
- QA-55 (FE-B): hub .theme-w and landing .archive at --fs-body (16 px).
- feb-switcher.js waits for running animations (2 s cap) instead of 600 ms; + a reduced-motion control run.
- R7-g6 letter-spacing: the 6 distinct raw values left are all in fe-a.css (sent to FE-A with token mappings); QA's
  count of 11 is from another method — asked QA which.
- R7-g2 (g) + (h): tools/beta/feb-g2.js — 0 single-word last lines on 91 pages (84 city + 6 hubs + landing) at 390 and
  1440; 84/84 phone "Start with" = desktop link (also a static test in test-views-b). All FE-B browser probes: `npm run
  beta:probe:fe-b` (tools/beta/feb-probes.js starts its own server).
- R7-g5 hubs + landing: B-02 343–416 px (<= 506; hub hero now data-cleo-masthead so it is measured), B-05 2, B-08 0,
  B-20 0 on all 6; B-04 n/a there (the rail follows the cards, B-05). JSONs re-measured in metrics-all/.
- R7-g6 (FE-B part): Insights area marks muted through v2 (--area-mix toward --area-mute; series stay --series-*);
  tabular figures 100 % on Guidebook facts + Insights numbers (tools/beta/feb-tabular.js); contrast.py 0 below minimum;
  letter-spacing 6 distinct raw (<= 6); shadows 13 (target 10: FE-A .pl-cover .g-ring + li.pl.is-target>.pl-cover,
  Atlas .pp .pp-h + .m-legend .kd + .pp-1.sel>span — sent to owners). Pinned in test-views-b (ceiling 13 until then).
- QA harness views.js Q-04 honesty: longest-first data strip (f21538c81) — 20/20.
- D-42 = QC-19 + QC-20: eb231ff0a (merged 6583673c2). lib/quoted.js adds POPULARITY + HOURS to PRICE_RATING; pq on 510
  records; note "Prices, ratings and times are quoted…"; sheet gap line "We don’t track opening hours or prices" (one
  string in FE-A's sheet.js; en + ja catalogue); both honesty greps allow exactly the new sentences.
- QC-18: the switcher thumb (.v-ind) sat 114 px off on desktop Atlas (parked in the header, outside <main>, where the
  thumb CSS did not apply and offsetLeft measured against another box) and the fonts.ready re-measure had been commented
  out by an i18n edit. city.js now places it from bounding rects against its own containing block and re-measures on
  fonts.ready, cleo:locale, resize (ResizeObserver) and re-parenting (MutationObserver); fe-a.css thumb rules unscoped.
  Probe tools/beta/feb-ind.js (fonts held back 1.2 s; fresh loads into each view; en + ja): 0 px everywhere.
- QC-09 at 200 % (designer's corrected §v2.11): < 300 px is a 2 x 2 glyph-only grid (61 x 44 at 195 px DPR 2), --cbar-h
  98 px there; on phones with a sheet open the switcher row is pinned under the header (a deep link can land past
  <main>, where the sticky bar had left). Probes: tools/beta/feb-switcher.js (incl. 195 px + fresh #p=senso-ji),
  tools/beta/feb-p03.js (focus to the h1 after each switch).
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
- FE-A follow-up: a fresh Tokyo deep link #p=senso-ji at 195 px leaves the page scrolled past <main> (scrollY 13018,
  card off-screen) — reported to FE-A.
- Tabular probe: `tools/beta/feb-tabular.js`.
- Thumb probe: `tools/beta/feb-ind.js [page]`.
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
