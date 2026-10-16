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
| i18n batch 1 merged (79 keys, en + ja); trip.js on Cleo.t; test-i18n trip.html case | d1d476cbc | — |
| designer (e)–(i) trip.html + (j) base pressed state | 17e24c738 | — |
| designer (a)–(d) share cards | 4f4fc8b67 | — |
| QC-15 base focus in the sheet; QC-17 base line wraps; probe + shots refreshed | 70060b332 | — |
| i18n batch 3 (page.trip.*), cleo:locale redraw on trip.html | 0aa56b33f | — |
| W9-1 recognition: badges (client/recognition.js from card attributes), Recognised lens + tray + rail door, detail row | 4cf7d7ebd | — |
| W9-9 local favourites: parked patch + 7 pending en strings | b20bc4a32 | — |
| W9-1 gap: badges on Gallery rows + Guidebook entries | this push | — |

## Next

Orchestrator order (2026-10-16 14:52Z):
1. **i18n: done.** All FE-C strings are in en + ja (see tools/beta/i18n-fec/README.md for new ones).
2. **Designer findings (a)–(j): SIGNED OFF by the designer at 70060b332.** (designer `session_011YjA2jku166RJrUyCiQV6B`), BEFORE W9-1:
   - DONE (this push): trip.html hairline cards, accent stop numbers and route, an --area dot, no h1 focus ring, "Sight · Must see", a Closed chip, the caveat on --sand, spacing snapped (CSS now in lib/render/fe-c-trip.css); base sort pressed state.
   - DONE (4f4fc8b67): the share-card items. Re-shot; designer re-review asked.
   - (was) share-card: the calm glyph cover (`--cover-sight` / `--cover-food`, glyph 120 px in `--ink-3`), no initial on teal; the dark overlay only over a photo;
   - share-card: "Must see" as a `--sun-wash` / `--on-sun-wash` pill; the palette read from tokens with the light values forced; no #C23A1C, `--accent` only for day-route numbers;
   - share-card: the lowercase "cleo" wordmark with its star, and the real URL;
   - trip.html: hairline cards (drop the 4 px area border); stop numbers and the route in `--accent`; an 8 px `--area` dot before the eyebrow;
   - trip.html: no focus ring on the h1 at load (`[tabindex="-1"]:focus{outline:none}`);
   - trip.html: "Sight · Must see" (sentence case); the closed name without "— CLOSED", plus a Closed chip;
   - trip.html: the caveat on `--sand` with `--ink-2`, not sun-wash;
   - trip.html: spacing tokens (`python3 design/beta/tools/snap-spacing.py`);
   - base: the pressed state on "Nearest to my base" (`--ink` fill), and the distance format as Atlas §3.4.
   - Then re-shoot (`w9-fe-c-probe.js`) and send the designer the SHA.
3. **W9-1: done (this push).**
   - Badges come from platform rec data only. The server writes data-rec / data-rec0 / data-ra / data-rv; client/recognition.js draws them (the page-weight budget rules out server-side markup).
   - The "Recognised" lens (`#rec=any|award|video|cited`), a tray fieldset, a rail door and the detail row.
   - Gaps:
     - CLOSED (this push): the Gallery row cards (li.gc, text badges inside the card link) and the Guidebook entries (li.ge, links) now carry badges from the page dataset;
     - video = 0 everywhere (platform's stated data gap).
4. **W9-9: built and tested, parked until its ja.**
   - The code is in `tools/beta/i18n-fec/w9-9-lf.patch`:
     - render/city.js: data-lf (only where the page has the lens), a tray fieldset with a pill or the stated gap, a rail door;
     - city.js: the lf lens, plus a header printing the rule;
     - recognition-ui.js lf* helpers, fe-c.css, and the test-fe-c LF section.
   - Its 7 strings are in `pending-en.json`.
   - When the i18n lane writes `pending-ja.json`: `merge.py`, `git apply tools/beta/i18n-fec/w9-9-lf.patch`, `npm run beta`, the gates, push.
   - Verified locally with a throwaway ja: 4 guides show the lens (128 places, all meeting the rule), 80 state the gap. Cleveland #lf=1 is exact. test-i18n passes.

5. **W9 audit (orchestrator 16:40Z):**
   - write design/beta/eval/w9/AUDIT.md, one row per W9-1…10: pass or fail against ONE-UP.md §7, the evidence command, the SHA;
   - build gaps in FE-A card code in FE-C modules, with hooks (tell FE-A); send other lanes' gaps to the orchestrator;
   - then send QA (session_017FLWXa5zgGWvqNo4C3UsvH) the SHA.

## In flight

Nothing unpushed. Waiting on:
- the i18n lane: pending-ja.json for W9-9's 7 keys;
- Atlas FE-1: the carousel SHA for QC-17 (agreed: the line wraps).

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
