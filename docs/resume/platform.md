# Platform checkpoint

Lane: accessibility + performance + the client platform (tools/beta/client/core.js, tools/beta/build.js, lib/sw.js,
lib/recognition.js, lib/views.js, imagery/photos.js `sizes`, the perf probes under tools/beta/qa/ and tools/beta/metrics.js,
css-dead.py, run-tests.js). Report to the orchestrator (session_01PCNcUkfa5S1N1BKGzZA4xx) with issue ids + SHAs after
each push. Audit trail: docs/BETA-PERF-AUDIT.md (PERF-NN) + PERF rows in docs/BETA-ISSUES.md.

## Task

QA-70 verification + the anchored-`:has()` CSS lint; PERF-08 (lens builds only what it shows); the "1 closed places"
plural (i18n).

## Done

- PERF-06 (Gallery CLS; marked blocks in FE-A's render/city.js + fe-a.css): bcf94510, merged and pushed df4382d2.
  beta:perf Gallery CLS phone 0.19–0.32 → 0–0.007, desktop 0.10 → 0.001. G1 `w7 --only lens,reach` 21/21.
- QA-70 bisect: first bad 7e746d9b (FE-B's switcher CSS). Mechanism: `main[data-city]:has(…)` rules in fe-a.css are
  re-checked on every DOM change in <main>. Tip addeb1f7 has a second pair (`main[data-city]:has(>.overlay…)>.cbar`):
  removing lines 197–198 alone leaves Tokyo at 2,485 ms; removing 201–202 too gives 1,666 ms (be74c82f: 1,654).
  Fix is FE-2's (`main[data-views-on]`); reported to the orchestrator for FE-2.
- D-40a `cardSizes()` (600–799 w copy → 240px on 3× phones): 3a0ecfec. w8p Tokyo phone 651 KB, Atlas 567 KB.
- QC-12 (1440 top-bar CLS) and QC-11 (768): VERIFIED by QC on 3a0ecfec (db9824aa) — closed by PERF-06.
- Lint tools/beta/test-css-has.js committed unwired (7110b59b); no allowlist (designer eddbb7b0 removed theirs).
- sync-push.sh: a clean merge's rebuilt beta/ is committed; dirty beta/ never pushes (exit 6); test-sync-push.js: a9ed1e0f.
- W9-9 acc1 typing: 1,814 → 2,183 of 2,552 publishers typed (registry key/host/domain agreement, guide OFFICIAL key, explicit
  host rules); 369 untyped listed in beta/data/recognition-untyped.json (stated gap). W9-8: offline-pack.js in npm test.
- Build scripts: guards before the write (22 + belgium_build), tools/test-builds.js in npm test: 967d43a3.
- R8 measurement kit: design/beta/eval/r8/README.md (+ r8/tools/pair.py).
- PERF-19b (R8 gap #6, Tokyo session ≤ 4 MB; D-48): 7,773 → 3,679 KB. Every sheet open starts on the 500 w file, full srcset
  after 250 ms open (cold first deep link exempt). Probe: tools/beta/qa/sheet-photo.js. NEVER branch on human vs scripted input
  (QA-81 guard in npm test). PERF-20: city template −50 KB raw. PERF-21: filter INP ≈ 105/128 ms with lensPage ON (QA accepted 2026-10-17;
  lenspage-accept.js in perf08-regress.sh; test-beta (a)/(b) restated). PERF-22: eager 39.30 KB (geo/codec are build-time
  LEADS of their lazy users, build.js). QC-26 now = "1 of N" + full reach by paging (QA).
- PERF-23 CSS: build minifies fe-a/fe-b (test-css-min.js proves rules identical); city CSS 338.9 KB; cuts for designer/FE-A in
  design/beta/eval/perf/css-gap6.md (probe: tools/beta/qa/css-coverage.js --all). Lazy sheet.js proposal: docs/BETA-LAZY-SHEET.md
  (do NOT implement before the r8 pin unless eager headroom < 0.3 KB).
- PERF-24 (c5205b60): Atlas round-trip INP 1,072/2,576 → 448/680 ms (msIn + map mount after the switch's first paint, views.js);
  perf.js starts in the Gallery (filter row was silently skipped since D-46). Filter 144/160 ✅; switches 250–310, open a place
  352/512 still > 200 → next INP items. OV-41 platform half: pack hidden in Atlas only while the map is live (popover holds it).
  OV-41 closed with FE-1 (8984b094): offline-pack's Atlas-default case (real tap, cover named) is in npm test.
- CSS coverage: probe blocks the SW (designer's blind spot not ours); added hover / 844×390 / landing query / saved reader →
  re-run and correct design/beta/eval/perf/css-gap6.md before anyone cuts.
- OV-38: `Cleo.pack.mount(host)` in FE-1's Layers popover `.m-layers-pop .m-pack`: verified (phone + desktop, keep syncs,
  overlay + pack probes PASS). Desktop also shows the page's own section (FE-1/designer's call).
- Probe: tools/beta/qa/first-pin.sh (time to first pin after the map-pill tap, clean worktree per SHA, bisect mode).

## Handoff (2026-10-17, end of session; last platform push 9cd09473)

State: everything pushed, gate green, eager 38.6 / 40. Open items, in order:
1. **Guidebook paging prototype** (orchestrator asked): measured on dev — a switch to Guidebook adds ≈ 1,029 elements
   (its own lazy chapters) to a 2,633-element Atlas page; list cards stay at 36 (+452 stubs). The switch cost is one style
   recalc of the whole DOM when html[data-view] flips, so paging must cut the GUIDEBOOK's own nodes (chapter bodies / their
   place rows), not the list cards. Not started.
2. **Switch INP:** FE-1 is doing the "yield before show()" change in views.js under my conditions (boot unchanged,
   same path for every input, tests get waits not looser asserts, perf08-regress). After it lands: batch the later-frame
   forced restyles (late(), late(1)+fonts.ready, loadMap callback, invalidateSize) into one measured read.
3. **D-55 interim pin:** r7 vs dev INP pairs (perf.js --input cdp, same box, back to back) — dev better on every row; sent.
   r8 proper still needs ≤ 200 on the switches and the round trip.
4. **CSS gap #6:** design/beta/eval/perf/css-gap6.md (3rd run, cleo.css 160.2 KB, fe-a 159.8 KB; city page ≈ 332.6 KB vs 250).
   The designer re-cuts only when my list and their widened sweep agree; re-run `css-coverage.js --all` on request.
5. **test-count-lines:** waits for each line's final form; Atlas lens asserts both forms (QC-36). When FE-1 makes the Atlas
   wording stable from first paint, tighten to one phrasing. QA-88 proposed the same wait (no conflict).
6. **Lazy sheet.js:** docs/BETA-LAZY-SHEET.md, after the r8 pin.
7. **Verify FE-1's PERF-24c (72ec46eb)** (orchestrator): the round trip reported at ~50 ms desktop / 50–100 ms phone. Add a
   "view complete" column to perf.js mark() (tap → the new view's first card/heading painted, no [data-cleo-pending]); run
   r7 (b54b3745 worktree) vs dev back to back with --input cdp; accept if view-complete ≤ ~300 ms phone / ≤ ~400 ms desktop.

## Next

0. Pushing: `cd tools && npm run checkpoint -- -m "<msg + trailers>" <paths…>` then `npm run checkpoint -- --verify`
   (tools/checkpoint.sh: full gate → commit explicit paths → FE-A's tools/beta/sync-push.sh for merge / beta/
   regeneration / push / ls-remote check).

1. QA-70: FE-2's fix a7b4a980; first-pin on 3ba696e8 = be74c82f level (Tokyo 1,653 vs 1,564; NY 1,807 vs 1,760 ms). With QA.
2. `:has()` lint wired into npm test (test:serial); no allowlist.
3. PERF-08 OFF (afb09e74; pin 4aba38b3). Re-land AFTER the deploy, only when tools/beta/qa/perf08-regress.sh passes with
   selective on: views.js links (QA-75), w7 lens (QA-76), my sheet check + FE-2's fe2/qc26.js first/second area (QC-26).
   QA-75 root cause (FE-A): city.js's cleo:stamped adopted cards later stamped by Cleo.defer.all()/allNow without applying
   the lens; FE-A's marked block fixes it (links 140/140 with the flag forced on; SHA pending). On re-land add a jsdom check:
   selective on → lens → Cleo.defer.all() → shown == lens count: in test-beta ("QA-75 guard"), fails without 752a77fc. No product pushes until QA rules on 4aba38b3. PERF-14 re-checked (w8p 608/651 KB).

## In flight

- R8 gap #6 CSS ≤ 250 KB (R6 layers out): cleo.css 194 (constellation.css 41 KB R6 art) + fe-a 169 + fe-b 31 + tokens 13
  = 427 KB; css-dead finds 0.1 KB. Cuts are the designer's and FE-A's — proposal sent to the orchestrator.

- Nothing unpushed. Hold product-code pushes until QA rules on the QA-70 pin (orchestrator).
- views.js honesty: 1 FAIL left (Cleveland Guidebook, Birdietown) → FE-B.

## Notes

- Evidence goes under design/beta/eval/perf/ (platform's path), never design/beta/eval/qc/ (QC-only; QC asked).

- `Cleo.defer.selective` (core.js; OFF since QA-75/76 — when on): a lens-only route stamps only its matches (+ its #p= place + view chunks);
  the lazy observer waits and list spacers fold while a lens is on, and resume when it clears. Consumers of stubs read
  them through `Cleo.defer.peek({lens})` / `Cleo.lens.shows(c)` (city.js counts/sections/pins/fitLens, views.js pager,
  atlas.js by FE-1 at 7831b0c5).
- Never two `npm test` runs at once in the container; long probes (beta:perf ≈ 10 min, w7 ≈ 20 min) need no `timeout`
  shorter than their run, or the browser is killed mid-run ("probe crashed").
- PERF-06 reserves in fe-a.css are keyed on the template's data-lead / data-rows; the phone `#cleo-rail[hidden]` box is
  kept (visibility:hidden) while JS is on. If FE-A changes the lead height or rail placement, re-measure.
