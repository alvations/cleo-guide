# Atlas FE-1 checkpoint (layout, pins, chrome, list)

## Task
SPEC-v3 rev 5 for panel round 4 (R3 scored 80.7), plus QC / QA items. In order:
1. The `atlas-ms` check "cleveland phone: two zoom steps in → ≥ 4 named pins" is red on origin (reads 3). Find the commit that turned it red; fix the band or the label density. Never loosen the check without the designer's sign-off.
2. QC-17: the phone carousel card clips FE-C's base line. FE-C wraps it (70060b332); the carousel card must allow the extra line.
3. Rev 5 (`design/beta/atlas/SPEC-v3.md`, 46f4abe3), in this order:
   - #1 phone first screen: Area chip, no counts on chips, search icon always visible, two labelled pills, Key in Filters;
   - #2 counts: no rank badges, one Must-see indicator, no "Filters 1" echo for Top picks;
   - #4 dots: no sun colour; sight 7 px at `--ink` 30 %, food 8 px square at 72 %; glyph overrides JSON plus new nouns; the locate dot counts as a placed box; real pill widths with a 4 px gap;
   - #5 desktop header: a 40 px switch inside the 56 px header; "How we choose" in the overflow below 1280; breadcrumb in full at ≥ 1280;
   - #6 no-photo preview: no media;
   - #3 text: ≥ 14 px, and 16 px for name, why and sources.
4. R7-g4:
   - (a) phone pin hit area ≥ 44 px tall;
   - (b) a pin click brings an out-of-page card into the list and into view;
   - (c) desktop `#p=` deep link: scrollY 0 (with FE-2);
   - (d) "last checked" on the first phone screen;
   - (e) desktop For you / Your day / Near me reachable without horizontal scroll.
5. QC-04: the no-pin badge. QC-05: an empty state for a search with no match. QC-13: the count line under a lens.
6. FE-B:
   - three raw shadows to tokens (`.pp .pp-h`, `.kd`, `.pp-1.sel`);
   - the phone switcher parked last in `.ms-bar` goes off-screen (QC-09). Make it its own full-width 52 px row.
7. QC-14: run `python3 design/beta/tools/snap-spacing.py tools/beta/lib/render/atlas.css`, then check 390 and 1440.

## Done (pushed)
- 7fef2dec: QA-45 (Show all in one list), QA-54, QA-52.
- 40e15601: R2 panel round (PANEL-R1 #2, #4, #6, #15; CLS 1.57 → 0.003).
- 7831b0c5: PERF-08 lens hooks.
- f47945e9: §2.1 desktop chrome (108 px, one bar, 64/36 split, no document scroll), B-08, B-20.
- Rev 4 phone first screen (peek, labelled pills, Key in Filters), Top picks, count line, 8 px dots, noun-first glyphs. Merged with FE-2 slices 1–2: the paged list survives late stamping, a swipe after Back, preview with no media, nearest-edge scroll. See BETA-LOG "SPEC-v3 rev 4" and the merge notes.

## Next
- After this push: drop my `park(mp, split, lp)` in `msIn`. FE-2 owns the map-first DOM order in atlas-nav.js, and two movers must not both restore it.
- Then items 1 → 7 above. Push every 20–30 min, verified with ls-remote.

## In flight
- Nothing unpushed except what the current commit carries.

## Notes
- **Ownership:**
  - FE-2 (atlas-nav.js): round-trip, near me, view in the URL, keyboard (skip links, arrows, map-first DOM order), QA-71 (the swipe hold, `C.navScrollHold`).
  - Mine: atlas.js and atlas.css (layout, pins, chrome, list, carousel).
  - The sheet is FE-A's: I've proposed a partial-height phone sheet in Atlas.
- **Rounds:** one per head. Agree the N and the SHA with FE-2 before messaging the panel (session_01EKzwLjqF1Z1gwXWgbrrr2S) with exactly "round N ready at <sha>". R3 was FE-2's (537cfb8c). R4 is next and needs the designer's dots sign-off first.
- **Gates:**
  - `cd tools && npm run validate && npm test && npm run beta:check`;
  - `NODE_PATH=$(npm root -g) node tools/beta/atlas-ms.js` (it also runs atlas-nav-ms);
  - `node tools/beta/qa/w7.js --only atlasd,atlasm`;
  - `node tools/beta/qa/w2.js`.
  - After probes run `git checkout -- qa/ design/beta/eval`; never commit QA's evidence.
- **Pending QA ratification:**
  - w7 atlasd looks for "more outside" (removed by §2.3);
  - metrics B-01 on the phone, which has no card on the first screen (peek).
- **Not mine, red on origin:** w2 a11y Tokyo desktop dark contrast on FE-A's cover plate.
