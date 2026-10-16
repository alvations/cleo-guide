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
| i18n prep, batch 1 + W9-1 render helper (unwired) | f15de9b4e | — |
| i18n prep, batch 2: base.js, share-card.js, core walk; one combined patch | 339a0e68f | — |
| i18n batch 1 merged (79 keys, en + ja); trip.js on Cleo.t; test-i18n trip.html case | this push | — |

## Next

Orchestrator order (2026-10-16 14:52Z):
1. **i18n batch 2:**
   - the i18n lane writes `tools/beta/i18n-fec/pending-ja.json` for the 46 keys of pending-en.json;
   - then: `merge.py`, `git apply fec-i18n.patch`, convert lib/render/trip.js to `t('trip.page.title' / '.desc' / '.nojs')`, `npm run beta`, the gates, push.
2. **Designer findings (a)–(j)** (designer `session_011YjA2jku166RJrUyCiQV6B`), BEFORE W9-1:
   - share-card: the calm glyph cover (`--cover-sight` / `--cover-food`, glyph 120 px in `--ink-3`), no initial on teal; the dark overlay only over a photo;
   - share-card: "Must see" as a `--sun-wash` / `--on-sun-wash` pill; the palette read from tokens with the light values forced; no #C23A1C, `--accent` only for day-route numbers;
   - share-card: the lowercase "cleo" wordmark with its star, and the real URL;
   - trip.html: hairline cards (drop the 4 px area border); stop numbers and the route in `--accent`; an 8 px `--area` dot before the eyebrow;
   - trip.html: no focus ring on the h1 at load (`[tabindex="-1"]:focus{outline:none}`);
   - trip.html: "Sight · Must see" (sentence case); the closed name without "— CLOSED", plus a Closed chip;
   - trip.html: the caveat on `--sand` with `--ink-2`, not sun-wash;
   - trip.html: spacing tokens (`python3 design/beta/tools/snap-spacing.py`);
   - base: the pressed state on "Nearest to my base" (`--ink` fill), and the distance format as Atlas §3.4.
   - Then re-shoot (`w9-fe-c-probe.js`) and send the designer the SHA.
3. W9-1 (wire recognition-ui.js; hooks listed in the README of the i18n prep), then W9-9.

## In flight

Nothing unpushed. Waiting on: the i18n lane for the en + ja of 122 keys.

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
