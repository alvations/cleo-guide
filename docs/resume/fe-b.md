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

- QC S-17 rows (live r7): OV-107..110, 121, 122 claimed (dev S-17 in budget; T1 at rest 11.8 % = header + FE-A city bar);
  OV-123 + FE-B half of OV-106/115/116/117 in ffb7881f8 (§3a: scoped header search name, city field is the search, "Search
  all guides for q" into FE-A's [data-cleo-all-slot] on cleo:city-search, tab bar drops Search + Your list, landing header
  search hidden, opaque shell bar). Open on FE-A: header search not drawn >= 1024 on city pages, the slot, the phone row.
- Desktop Atlas switch: 113x36 box, its ::after does not extend the hit band (feb-switcher now hit-tests a 44 px band) —
  FE-1's (atlas.css a6073c1f), sent.
- Eager JS on the merged head 39.97 / 40 KB (others' bytes): no eager bytes from FE-B until platform's headroom fix.
- One compact state site-wide: compact.js is gone; the shell tab bar and the Guidebook Contents strip style on FE-A's
  html.ov-c (Cleo.chrome, core.js) with :focus-within to return. Shell pages 48/48 within §v2.12 budgets.
- R8 gap #7 (FE-B half): fe-b.css line-heights on --lh tokens; the 16 px titles (.card-t, editorial rail .t, .theme-t,
  .ccard .card-t) use the UI face (display face >= 24 px only).
- feb-switcher.js follows OV-10/11: below 1024 outside Atlas the open sheet owns the screen; its Close must be a reachable
  44 px control. Found: desktop Atlas switch segments 113x36 (< 44) — sent to FE-A / FE-1.
- §3a one search per screen: proposal sent to FE-A (search.js routes header / "/" to the city field; "Search all guides
  for q" row into a FE-A slot; tab bar loses its duplicate Search). Waiting on FE-A's yes.
- R8 gap #5b (B-20): What changed "Status source" links are a.chg-src 44 px controls (beat `.chg a` 24 px); metrics.js
  B-20 = 0 on all 31 pages that carry one (sweep in scratch, 31/31). test-hubs guards the class + rule.
- R8 gap #2d: landing + hub "Recommended by" use lib/model.js recommender(): research parentheticals dropped
  ("Wikipedia (published facts/coords)" → "Wikipedia"), a place's own site ("Official … site") never named; W9-6 source
  index uses publicName(). Left on 4 city pages (FE-A's render/city.js): siliconvalley, statecollege, madison, cincinnati.
- Overlay audit (owner directive, docs/BETA-OVERLAY-LEDGER.md; FE-B scope Guidebook / Insights / What changed / method):
  probe tools/beta/feb-ov.js (7 pages x 6 viewports x 2 themes; OV_ONLY=<regex>). Rows OV-30..OV-35. Fixed OV-30
  (Contents strip under the city bar) + OV-31 (strip scrolls away < 500 px tall). Open: OV-32/33/34 FE-A; OV-35 FE-B shell
  (header + tab bar 33 % in landscape). OV-00 applied (c84fe342c): Cleo.compact in search.js (tab bar, Contents strip),
  landscape shell = one 48 px bar; OV-35/36 claimed; OV-37 (64/72 px header vs 52/56) is designer + FE-A.
- QC-34: Guidebook Contents follow the lens — syncLens (client/guidebook.js) recounts each chapter's Contents entry from
  the model's visible set on every lens change and drops chapters with 0 (as the chapters do). test-views-b: mode=food,
  q=, a= on 3 guides (counts == visible entries, total == "s of all N", a= keeps 1 chapter; cleared → full). Note for
  FE-A: clearing the hash keeps the city's search (city.js S.q stays unless the route carries q=).
- QC-33 (Med): deep-linked Guidebook / Insights load CLS 0.42–0.58 at 1440 → 0 (all 24 runs < 0.006; 390 stays 0). One
  marked FE-B rule in fe-a.css: under html[data-view=guidebook|insights], #cleo-view:is([hidden],:empty) holds 100vh, so
  the method section + footer first paint below the fold. Gate: tools/beta/feb-cls.js (wraps QC's qa/qc-view-cls.js,
  exits 1 on CLS >= 0.1), in `npm run beta:probe:fe-b` and qa/perf08-regress.sh (platform told).
- QC-32: lib/model.js pinSource() — a geocodes `source` carrying research notes (worklist, "verify before publish",
  UNVERIFIED, NOTE, ADDRESS CORRECTED) ships only its first URL or the publisher/method clause (21 of 8,702; the rest
  unchanged); the full note stays in data/geocodes.json. test-hubs scans all 466 shipped JSON files for the markers.
- QC-31: no FE-B lines in fe-a.css (FE-A by blame) or constellation.css (designer). Sent the mapping to the orchestrator
  (for the designer) and FE-A: drop var(--surface/--paper,#fff) fallbacks (7), mask #000 → var(--ink) (4), new tokens
  --shade-text, --on-night-hover, --on-night-line, --on-photo, --scrim-photo, --r-xxs. FE-A landed the fe-a.css half
  (ca5a8a88, --mask); the rest is Atlas (atlas.css) + designer (constellation.css). Nothing left for FE-B. client/search.js is catalogued (i18n a46f6ec7): any new or changed string goes through
  tt('srch.x', 'English') with the English exactly as in en.json; send the key to i18n for ja.
- QC-25 leftovers (from FE-A): closure statusSource notes no longer ship anywhere — What changed pages, Atom feeds and
  data/places/*.json carry only the note's first URL (pv.ss / changes src; "Status source" link). The note stays
  build-side (non-enumerable) for the retiring count; test-hubs recounts it from data/geocodes.json and checks no note
  ships. lib/model.js edit is small and marked (statusUrl, same rule as render/city.js). Method page line is the
  D-42 form via the catalogue (m.not.p, en + ja; ja sent to i18n); honesty allowlists (qa/test-honesty, views, w4) allow
  exactly that sentence; test-hubs asserts no note text on any changes page.
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
- Switcher probe: `tools/beta/feb-switcher.js [page] [view]` (same static server; view defaults to gallery). Atlas
  (FE-1 0e8faff9a) passes all 8 rows.
- B-05 probe: `tools/beta/feb-b05.js` (needs `python3 -m http.server 8765 -d <repo>`; ≥ 2 on landing + every hub).
- Push with `tools/beta/feb-push.sh` (merges origin, regenerates beta/ on generated conflicts, stops on any source
  conflict or leftover conflict marker, verifies the ref moved). Re-run the gates on the merged head afterwards.
- Edits in other lanes' files are small, marked and announced: views.css / v2.css (designer), city.js + sheet.js
  (FE-A: `data-fy`, `data-pq`, the `interests` export, the `// FE-B D-39 (QA-65)` sheet block).
- Insights link rule: `exact(uid)(lens, n)` in client/insights.js — a mark links only if lensMatch over the lensed set
  equals its count; otherwise it is a plain bar and the card prints why (WHY table). Keep test-views-b's independent
  MATCH in step with core.js `Cleo.lens.match`.
- Closure notes are not repeated in the Guidebook (some quote money; the views carry no prices — honesty gate).
