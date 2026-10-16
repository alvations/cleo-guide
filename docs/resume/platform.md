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
- Probe: tools/beta/qa/first-pin.sh (time to first pin after the map-pill tap, clean worktree per SHA, bisect mode).

## Next

1. When FE-2's QA-70 fix lands: `tools/beta/qa/first-pin.sh <sha> cities/tokyo.html` and `… cities/newyork.html` for
   be74c82f and the fix SHA; send the numbers to the orchestrator.
2. Land tools/beta/test-css-has.js (already in `test:serial`) once the four fe-a.css anchored `:has()` rules are gone;
   it must pass on the merged head. Its KNOWN list (7 cleo.css selectors) is PERF-16 for the designer: shrink only.
3. PERF-08: send QA the pushed SHA (they re-run metrics G1 Gallery + Atlas, `w7.js --only lens,reach`, views.js);
   record before/after `beta:perf --only inp` in BETA-PERF-AUDIT and the register.
4. Re-check PERF-14 numbers on the tip with `npm run beta:qa:w8p`.

## In flight

- PERF-08 (1538974d, merged 455b8b05) and the plural fix: pushed with this file unless noted in the log.
- views.js has 5 pre-existing honesty FAILs ("Prices and ratings are quoted…", same on f47945e9): not platform's.

## Notes

- `Cleo.defer.selective = true` (core.js): a lens-only route stamps only its matches (+ its #p= place + view chunks);
  the lazy observer waits and list spacers fold while a lens is on, and resume when it clears. Consumers of stubs read
  them through `Cleo.defer.peek({lens})` / `Cleo.lens.shows(c)` (city.js counts/sections/pins/fitLens, views.js pager,
  atlas.js by FE-1 at 7831b0c5).
- Never two `npm test` runs at once in the container; long probes (beta:perf ≈ 10 min, w7 ≈ 20 min) need no `timeout`
  shorter than their run, or the browser is killed mid-run ("probe crashed").
- PERF-06 reserves in fe-a.css are keyed on the template's data-lead / data-rows; the phone `#cleo-rail[hidden]` box is
  kept (visibility:hidden) while JS is on. If FE-A changes the lead height or rail placement, re-measure.
