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
- R3 #9/#14 one focus ring per card stop (atlas-nav.css; probe tools/beta/fe2/rings.js in atlas-nav-ms; designer signed
  off) and R7-g4 (c) deep-link ancestor scroll check: 1e8b23ad.
- QA-76 (pre-fit "Show all" transient): 4aba38b3, re-gated green on the pushed head.
- QC-26 (cold lens deep link "1 of 488"; bisected to PERF-08 1538974d): sheet.js shortcut only with no lens on, 3929ad4b.
  Platform switched PERF-08 off (aff53656) and runs qc26.js + the QA-76 block in tools/beta/qa/perf08-regress.sh. Probe tools/beta/fe2/qc26.js (in atlas-nav-ms).
- PANEL-R3 #7 (108 px layout shift): e7986460 (full gates green on the pushed head).
- W9-5 walking ring from your base: 417da6aa. Phone 58vh detail above the QC-09 cap: ecae30b3.
- QA-71 (swipe after Back): fd54b823; hardening (carousel holds only against the restore's own scroll): a3da0b4b.
- QA-70 (map opens ~1.5 s slower; four `:has()` over `<main>` rules from 7e746d9b rekeyed to attributes set by
  views.js): a3da0b4b.

## Next
1. Round 4: FE-1 declares it on a head that carries everything below (66c2a8e1 does; atlas-nav-ms PASS there) once the
   designer signs off the dots. If the SHA moves, re-run `node tools/beta/atlas-nav-ms.js` on it first.
2. R3 #8: the guards pass; the phone pill after a zoom reads "351 places here" with 43 in view. That's FE-1's copy, raised
   with them. Tighten the check once FE-1 picks a wording or a live count.
3. QA-70 flake ruling is QA's (FE-B's switcher probe races the sheet's view transition).
## In flight
- Nothing unpushed. QA-70 flake counts were sent to the orchestrator (feb-switcher Tokyo, 10 runs per head):
  be74c82f 0/10, 530dc83b 10/10 (195/260 expected there; 390 click 2/10), a3da0b4b 4/10 (390 click). The probe races
  the sheet's view transition at a fixed 600 ms; QA rules.

## Notes
- Hooks this lane exports (all optional): C.placeOpen, C.atView, C.freshPlace (city.js); C.navHold, C.navScrollHold,
  C.navKeep, C.navPrivate, C.onLocate (atlas.js); C.ringKeep (city.js visible()). FE-1 agreed; FE-A told.
- The view key is `at=lat,lng,z`; `c=` is the category lens.
- Pushing: `tools/beta/fe2/fast-sync.sh` (resume rule 8). Timing probe for the map open: `tools/beta/fe2/first-pin.js`.
- FE-1 owns pins, chrome, list and atlas.css. The map-before-list DOM order is atlas-nav.js `order()` (FE-1 dropped theirs).
- Known red on origin, not this lane's: atlas-ms "cleveland phone: independent B-08 … list scrolled" sees 0 titles
  (FE-1's check; red with and without this lane's CSS, 16 Oct 18:40Z).
