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
| W9-1 gap: badges on Gallery rows + Guidebook entries | e1540ffd | — |
| W9-1 Atlas preview badges | bdafa7a46 | — |
| w8p fix: Gallery/Guidebook/preview badges read the place's own card (stamped or `Cleo.defer.peek()` stub), never `Cleo.pageData` — Tokyo phone first load 762 → 656 KB | b8a3a6ae2 | — |
| W9 audit (AUDIT.md + tools/beta/qa/w9-audit/) | 78065c843 | — |
| W9-2 card line "Status checked <d Mon>" (client/fresh.js, lazy; text in a CSS attr() so search never matches it) + "Follow changes" line (lib/render/fresh-ui.js, OFF until fresh.feed's ja lands; key in pending-en.json) | 38228322b | — |
| batch 4 ja merged: W9-9 local favourites LIVE (patch applied, removed), "Follow changes" LIVE on 84 pages; QC-23 closed "Before it closed" row visible in the detail (CSS-hidden on the card; city.js onSheet hook for deep links); QC-24 rec/lf chips named | 9c1331525 (QC verified at f96a1e94) | — |
| QC-05 empty state: client/empty.js (lazy, city.js hook after the mode-chip line) — names the search, Clear search + Show all N, in the lens slot and on the Atlas map (phone; desktop states it in the list), no mode chip pressed; batch 5 ja merged; probe `empty` (5 pilots × Gallery/Atlas × 390/1440) + test-fe-c EMPTY | e353df08e | — |
| QC-04 (D-43): fresh.js "Approximate pin" card tag; sheet.js hook (detail fact); views.js hook (badge counts low pins); fe-c.css gives `.nopin` its missing base position (it sat below the map, unseen); test-fe-c APPROX. Batch 6 ja merged | 7857f8855 | — |
| QA-77 (deploy blocker, B-20): `a.rb` badge links are 44 px targets (−6 px block margins, pill painted by an inset ::before at 32 px; wrapped rows 12 px apart); metrics B-20 = 0 on the pilots, Gallery + Atlas, mobile; probe `rec-tap`; probe base-keys waits for `.ms-ready` on desktop Atlas | d2cc5400a (only fe-c.css needed for the beta-deploy-r7 port) | — |
| trip.html: a closed place's status source (pv.ss, now a URL from FE-B's model) is a link named by its host (`trip.why.source`, translate=no); test-fe-c + test-i18n trip case | 539e07d5a | — |
| W9-2 (a): "Status checked <d Mon>" also on Gallery row cards (li.gc) and the Atlas preview (a.ms-pv), dated from the place's card/stub (fresh.js views()); test-fe-c FRESH (Cleveland 71/71 rows) + probe rec-pv. Next (b2): when platform lands `data-nosearch` in Cleo.lens.text, switch .pl-chk lines to real text with data-nosearch, drop attr(); test "oct" / 10月 matches no card by the line | 1074d90c1 | — |
| W9-2 (b2): the line is real text with `data-nosearch` (platform f03b03cf) on li.pl, li.gc, a.ms-pv; attr() rendering dropped; test-fe-c: Cleveland #q=aug shows only cards matching by their own text (181 lines read "… Aug"), #q=8月 none; eager JS unchanged (39.97/40 KB, fresh.js lazy) | 86b7558e4 | — |
| QC-05 one state per view: Atlas uses FE-1's list-head state (ec71a4ad, my city.empty.* keys), so `html[data-view=atlas] [data-cleo-empty]{display:none}`; probe `empty` checks FE-1's head in Atlas (opens the phone list) | this push | — |

## Next

W9 audit: design/beta/eval/w9/AUDIT.md (scripts in tools/beta/qa/w9-audit/) is written and was sent to QA session_017FLWXa5zgGWvqNo4C3UsvH. W9-2 card line + "Follow changes" and W9-9 are live; pending-*.json are empty. QC-17: FE-1 done at 03c9fc58d (phone carousel wraps p.pl-base). Next: QC-04 per D-43 (orchestrator): low pins (`pv.pin === 'low'`, info.prov 'l…') stay on the map; card "Approximate pin", detail "Approximate map pin: the coordinate we hold is not yet verified to the door" in place of "Pinned to the door: low confidence", Atlas badge "N approximate pins" next to the no-coordinate count; no marker change (FE-1 rev 5). Strings → i18n batch 6. Test: every low card carries the label and nothing else does. Tell QC P-17 should accept "Approximate pin" per D-43.


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
- nothing (QC-17 closed by FE-1 at 03c9fc58d).

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
