# Atlas FE-2 checkpoint (session_011SQNDyJMGzR5K32A4y9Udd)

Lane: the Atlas map's interaction state. Source: `tools/beta/client/atlas-nav.js` (ships inside assets/js/atlas.js),
`tools/beta/lib/render/atlas-nav.css` (after atlas.css), probes `tools/beta/atlas-nav-ms.js` (run by `atlas-ms.js`).

## Task
SPEC-v3 rev 5 items from PANEL-R3 (80.7):
- **R3 #7** (High 5/8): the 108 px desktop layout shift after card focus, card → detail → Escape/Back, or Share. Every
  ancestor of the map must keep scrollTop 0, the map top must stay put, and the search input top must be ≥ 56 px.
- **R3 #8**: stale counts and cards. After a zoom, the pill and count line must equal the places in view (or read
  stale until "Search this area"); on a fresh `#view=atlas&at=…,15` load the first carousel card and every list card
  must be in bounds.
- **R3 #2 / #9 / #14** (shared): one rank line in the detail (sheet.js, FE-A's: reported 16 Oct), focus rings and card
  Tab order.

## Done
- PANEL-R1 #1, #13, #11, #3 + probe honesty: 537cfb8c (round 3 head), BETA-LOG 03678da1.
- W9-5 walking ring from your base: 417da6aa. Phone 58vh detail above the QC-09 cap: ecae30b3.
- QA-71 (swipe after Back): fd54b823; hardening (carousel holds only against the restore's own scroll): a3da0b4b.
- QA-70 (map opens ~1.5 s slower; four `:has()` over `<main>` rules from 7e746d9b rekeyed to attributes set by
  views.js): a3da0b4b.

## Next
1. R3 #7: reproduce on desktop Tokyo (focus a card, card → detail → Esc/Back, Share), then record map top, the search
   top and scrollTop of every ancestor of #cleo-map. Fix: no scroll on any map ancestor in Atlas desktop (focus with
   preventScroll; reset a non-list ancestor's scroll), and scroll only `.listpane`. Add an ancestor-scrollTop + map-top
   check to atlas-nav-ms.js.
2. R3 #8: a fresh `at=` load must re-run the map-area pass after the URL view is applied; then check the pill/count
   after a zoom.
3. Declare the next round with FE-1 (one round per head; FE-1 sends "round N ready" for combined heads).

## In flight
- Nothing unpushed. A feb-switcher flake count (be74c82f / 530dc83b / a3da0b4b, 10 runs each) is running in the
  scratchpad worktree for the QA-70 ruling. be74c82f: 0/10.

## Notes
- Hooks this lane exports (all optional): C.placeOpen, C.atView, C.freshPlace (city.js); C.navHold, C.navScrollHold,
  C.navKeep, C.navPrivate, C.onLocate (atlas.js); C.ringKeep (city.js visible()). FE-1 agreed; FE-A told.
- The view key is `at=lat,lng,z`; `c=` is the category lens.
- Pushing: `tools/beta/fe2/fast-sync.sh` (resume rule 8). Timing probe for the map open: `tools/beta/fe2/first-pin.js`.
- FE-1 owns pins, chrome, list and atlas.css, and parks `.mappane` before `.listpane` on desktop; atlas-nav.js
  `order()` does the same idempotently (both kept).
- Known red on origin, not this lane's: atlas-ms "cleveland phone: two zoom steps → ≥ 4 named pins" (FE-1).
