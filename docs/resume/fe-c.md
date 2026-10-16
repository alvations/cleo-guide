# FE-C checkpoint

Session: `session_01SxU3Mdpo1UAQyJQJmnMFtG`. Branch: `claude/peaceful-goodall-i0hsrt` (local name = origin; the old
pre-force-update local history is kept as `backup/pre-force-update-2026-10-11`, never pushed).

## Task

W9 FE-C lane (`design/beta/eval/W9-BRIEFS.md`, acceptances in `ONE-UP.md` §7):
- **W9-4** Trips: done.
- **W9-5** "Set as my base", FE-C part: done. The Atlas 5/10/15-min ring is Atlas FE-2's, after their round 3.
- **W9-7** Share cards: done.

## Done

| Item | Feature SHA | Log |
|---|---|---|
| W9-4 trips (`beta/trip.html`, `client/trip.js`, `lib/render/trip.js`, `Cleo.geo.walk` in core) | ce4c6a7c | 0498bdc7 |
| W9-4 "Make a trip" hook in saved.js | 3686baa5 | — |
| W9-5 base (`client/base.js`, `Cleo.base` + `Cleo.need` in core, hooks in city.js / render/city.js / render/saved.js) | f70222d9f | 65d061aed |
| W9-7 share cards (`client/share-card.js`, hooks in sheet.js / day.js / saved.js, core delegated tap) | 0f8598c0b | 9f503f9ff |

## Next

1. Wait for the orchestrator's next FE-C item (asked 2026-10-16).
2. i18n (D-41, i18n lane `session_01HB7igqdcuhrau7mUWSauDL`): browser strings in `trip.js`, `base.js` and
   `share-card.js` are English literals. Move them to `Cleo.t('key', 'English', vars)` once `Cleo.t` is on origin
   (it isn't in `tools/beta/client/*.js` as of 2026-10-16 14:20Z). Server strings in `lib/render/trip.js` go to an
   en.json key + `tr()`. test-i18n currently checks only the Tokyo page.
3. When FE-2 builds the ring: check that the ring uses `Cleo.base.from(ll).min` (no second walk formula).

## In flight

Nothing unpushed. No long runs.

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
