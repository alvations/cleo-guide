# FE-C checkpoint

Session: `session_01SxU3Mdpo1UAQyJQJmnMFtG`. Branch: `claude/peaceful-goodall-i0hsrt` (local name = origin; the old
pre-force-update local history is kept as `backup/pre-force-update-2026-10-11`, never pushed).

## Task

Orchestrator 2026-10-16, in order:
1. i18n of FE-C strings (D-41).
2. W9-1 recognition: the card and detail UI, the filter.
3. W9-9 local favourites lens.

Earlier: W9-4, W9-5 (FE-C part) and W9-7 are done.

## Done

| Item | Feature SHA | Log |
|---|---|---|
| W9-4 trips | ce4c6a7c (+ saved.js hook 3686baa5) | 0498bdc7 |
| W9-5 base | f70222d9f | 65d061aed |
| W9-7 share cards | 0f8598c0b | 9f503f9ff |
| i18n prep: tools/beta/i18n-fec/ (pending-en.json, merge.py, trip-i18n.patch), W9-1 render helper (unwired) | this push | — |

## Next

1. **i18n (blocked on the i18n lane's ja):**
   - when `tools/beta/i18n-fec/pending-ja.json` exists, follow `tools/beta/i18n-fec/README.md`;
   - then convert base.js and share-card.js in the same way: new keys → pending-en.json → ask i18n for ja;
   - add a test-i18n case for trip.html (runtime pseudo swap: 0 English outside data).
2. **W9-1:** `lib/render/recognition-ui.js` is written but not wired. Its strings are in pending-en.json, so wiring it waits for the ja too.
   - Wiring = FE-C W9-1 hook lines:
     - render/city.js card(): `${RU.attr(r)}` in attrs, `${RU.html(r, srcById)}` after `.pl-s`;
     - tray fieldset `RU.trayPills(recs, pill)`, rail tile `RU.railTile(recs)`;
     - city.js: 'rec' in LENS / RAIL / TK, plus a visible() line on data-rec and a lens header;
     - sheet.js: a fact that shows the card's `.pl-rec` (or the hidden closed copy).
   - CSS: a new lib/render/fe-c.css concatenated into fe-a.css (a build.js line, platform).
   - Tell FE-A before pushing hooks into their files.
3. W9-9 local favourites lens after W9-1, on `rec.lf` / `recognition.localFavourites` (rule printed, gap stated).

## In flight

Nothing unpushed. Waiting on: the i18n lane (`session_01HB7igqdcuhrau7mUWSauDL`) for pending-ja.json.

## Notes

- **Gates:** `cd tools && npm run validate && npm test && npm run beta:check`. FE-C's own:
  - `node beta/test-fe-c.js` (in npm test);
  - `NODE_PATH=$(npm root -g) node beta/w9-fe-c-probe.js` (Chromium; writes the shots in `design/beta/eval/w9/fe-c/`).
- **Hooks in other lanes' files are marked `FE-C W9-x hook`** (the orchestrator approved the pattern; ask first if a hook needs more than ~20 lines in an FE-A file):
  - city.js: sort=base and the C.onSheet chain;
  - sheet.js, day.js, saved.js: one line each;
  - render/city.js: info.js versions and the hidden sort pill (its label is now i18n `city.sort.base`);
  - render/saved.js: `#cleo-lazy`.
  - core.js and build.js are platform's (`session_01USPS1inq7bUDfyw89evKMA`): send a heads-up before each push.
- **Store keys:** `mybase` {pageKey: id} (`base` is the map layer, city.js), `trips` [{v, n, t}]. Both go through Cleo.store.
- **Links:**
  - a trip: `trip.html#trip=<day>~<day>~!<left-out>` (Cleo.listCodec per day), `&n=` name, `&d=` day;
  - a trip day on its guide: `#day=<area>&s=<ids>&trip=…&d=N` (day.js shared-day route);
  - a base: `&base=<id>`.
- **Lazy modules:** `Cleo.need(name, cb)` reads versions from `#cleo-city` info.js or `#cleo-lazy`. A module calls `Cleo.need.done(name)` when it runs, so test harnesses can inline it.
- **jsdom harness:** test-fe-c sets `Cleo.root` after core, because inlined scripts have no src.
