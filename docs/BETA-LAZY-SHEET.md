# Proposal: load the place sheet on demand (lazy `sheet.js`)

Status: **proposal, not scheduled.** The orchestrator's rule (2026-10-17): do not implement it before the r8 pin unless
the eager-JS headroom on the heaviest page drops below 0.3 KB. Owners: **FE-A** (sheet.js) and **FE-1** (atlas-nav.js),
with platform doing the loader and the tests' harness. Author: platform.

## Why

`assets/js/sheet.js` is the second-largest eager file on a city page: about 7.1 KB gzip of the 40 KB eager budget
(Cleveland, the heaviest page, is at 39.14 KB after PERF-22). Nothing on the first screen needs it. It is needed only
when a reader opens a place (a tap, a pin, a search hit, a step to the next or previous place) or when the page loads
with a deep link (`#p=` / `#p-`). Loading it on demand gives back about 7 KB of eager JS with no change in what a reader
sees once it is loaded. It must follow D-48: the same path for every reader, whatever opened the sheet.

## The shape

1. **Loader in core.js (platform).** `Cleo.sheet` starts as a small shim with the same API:
   `isOpen()` returns `false`, `close()` is a no-op, and `open(c)` calls `Cleo.need('sheet', () => Cleo.sheet.open(c))`.
   The real module replaces the shim's methods **on the same object** (`Object.assign(Cleo.sheet, api)`), so code that
   holds a reference keeps working.
2. **When it loads.**
   - On the first open (above).
   - At boot, when the URL carries `#p=` or `#p-` (the cold deep link: the sheet IS the first screen, so it is fetched
     at once, in parallel with the other deferred scripts).
   - On idle after load (`requestIdleCallback`, as `pack.js` already does), so a reader who taps a card after the first
     second meets an already-loaded module. Idle loading keeps it off the critical path; it is still the same path for
     everyone.
3. **The click capture in sheet.js** (it records the tapped control and its media for focus return and the grow
   transition) moves into core.js's shim as a 3-line capture-phase listener that stores `[el, time, keyboard]`. The real
   module reads it on load. No behaviour branches on the input's origin (D-48): it is the same record the module keeps
   today.
4. **Offline.** sheet.js is already in the worker's shell and in every city pack; nothing changes there.

## What changes for FE-1 (atlas-nav.js)

atlas-nav wraps `Cleo.sheet.open` and `Cleo.sheet.close` once, at load (`wrap()`, guarded by `wrapped`). With the shim,
that wrap would capture the shim's methods, and `Object.assign` would then overwrite the wrapper. Two options:

- **(a) Hooks instead of a wrap (preferred).** sheet.js emits `cleo:sheet-open` / `cleo:sheet-close` (or calls
  `C.onSheetOpen` / `C.onSheetClose` lists, as `C.onSheet` works today). atlas-nav subscribes and restores its map
  snapshot in the close hook. This removes the monkey-patch altogether. One subtlety: close0 runs after the map restore
  today, so the close hook must fire **before** the sheet's own focus return, which sheet.js can guarantee.
- **(b) Keep the wrap, re-run it after load.** sheet.js emits `cleo:sheet-ready`, and atlas-nav calls `wrap()` on it
  (and drops `wrapped` when the object's methods change). This is smaller but keeps the fragile monkey-patch.

## What changes for the tests

- **jsdom suites that drive the sheet synchronously** (test-fe-a.js, about 13 uses; test-fe-c.js, about 14) boot a city
  page and call or expect `Cleo.sheet` at once. The harness `boot()` gets a `sheet: true` option that evaluates
  `assets/js/sheet.js` right after the page's own scripts, as `test-beta.js` already does for `gallery.js` (PERF-18
  block). No assertion changes: the tests keep checking the same behaviour, the harness just loads the module the browser
  would load.
- **Browser probes** (`metrics.js` B-17, `w7.js`, `views.js` links, `sheet-photo.js`) need nothing: they tap, and the
  first open loads the module. Their timings gain the module fetch on a first tap before idle; `sheet-photo.js` reports it.
- **New guard (platform):** `test-eager-budget.js` keeps its 40 KB cap; add a row that a cold `#p=` deep link opens the
  sheet (tap → dialog) within the existing B-17 and QC-26 checks, in both viewports.

## Risks

- A first tap in the first second after load (before the idle load) waits for the module's fetch: one request of about
  7 KB gzip, served by the worker after the first visit. `sheet-photo.js` and `perf.js --only inp` ("open a place")
  measure it; the target stays INP ≤ 200 ms.
- Anything else that patches `Cleo.sheet` at load has the same issue as atlas-nav. Today that is only atlas-nav (grep:
  `Cleo.sheet.open =` / `S.open =`); `sheetbar.js` and FE-C's hooks go through `C.onSheet`.

## Measure before and after

`node beta/qa/test-eager-budget.js` (expect about −7 KB on every city page), `npm run beta:perf -- --only inp` ("open a
place", phone and desktop), `node beta/qa/sheet-photo.js`, `node beta/qa/first-pin.sh` (unchanged), and B-17 in
`metrics.js` on Tokyo.
