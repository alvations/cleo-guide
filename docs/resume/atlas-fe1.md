# Atlas FE-1 checkpoint (layout, pins, chrome, list)

## Task
D-46 (Atlas is the default view) and OV-00 (SPEC-v3 §2.0) for the panel's round 4, in the orchestrator's order:
1. The stamping hold (D-46 DOM ≤ 2,900, INP ≤ 200 ms): local, in the gates. It works by shed() off-page cards → deferred noscript, plus city.js C.forget, plus PER 36.
2. The 52 px phone header. FE-A already set --bar-h 52 on phones (25d4f9ef), so reconcile with mine.
3. OV-00 Atlas (OV-02..07, docs/BETA-OVERLAY-LEDGER.md), through FE-A's Cleo.chrome (compact / idle, html.ov-c):
   - pan compaction;
   - an icon-only stack (Locate + Layers popover);
   - attribution collapsing to ⓘ;
   - label caps (40 % width, count from the area, ≤ 8 % coverage);
   - "Search this area" only after a > 25 % bounds change;
   - chip-row edge fades;
   - landscape.
4. D-46:
   - peek thumbnails (3 × 40 px, names in the aria-label, no "+N more");
   - the phone list-sheet intro (FE-A's .at-intro) with a 3:2 lead card;
   - .pl-lead on a desktop cold load;
   - the no-map fallback: neutral art, no edge ticks, one "Map unavailable".
5. R8:
   - gap 4: 44 px phone map targets, the last-checked date on the first screen, the doors at 1440, B-07 84/84, the D-43 20 px soft halo plus a Key swatch;
   - gap 3 (motion) is FE-2's;
   - FE-A's tokens (atlas.css:41/102/289).
Round 4 is held until D-46 lands. Dark dots are signed off (R4b). FE-2 is green on e0b79e23.

## Done (pushed)
- 96ddfe85 stamping hold (Tokyo Atlas 2,686 nodes, 36-card page) · f2babf91 OV-07/05/02/06 (pan compaction via Cleo.chrome, credit ⓘ, Search-this-area 25 %, chip fades) · (in the gates) OV-03 labels + OV-04 §2.0.3 control stack / Layers popover with the pack host.
- e0b79e23 INP 18.5 s → 0.45 s (.ms-paged), D-46 list at once (predict()), CLS, peek spaces · c8fd0768 INP pass 2 (256 ms).
- ec71a4ad pre-R4: B-20 source chip 44 px (+ ellipsis, title on cut chips), QC-05 in catalogue strings (FE-C hides theirs), rev 5a phone chrome (search via the header icon, 48 px chip row, 56 px peek, "Search this area" at 160 and hidden on the first screen), kit bag/spire with spire for churches only, dark dots 45 % / 80 %. Atlas metrics on 5 pilots: B-20 0, B-03 13–14, B-08 0.
- 03c9fc58 QC-17 · 0e8faff9 phone switcher row + chip order · 4888cd5a desktop header (#5), no rank badges, QC-05 · 0118f115 one ranked list (#2), B-21 · bbe11d60 card text 16/14 (#3) · (this push) QC-13, R7-g4 (d) checked date in the peek, (e) desktop doors; QC-04 met by FE-C.
- d2b6ead3 checkpoint + push script · 66c2a8e1 QC-14 spacing, R7-g4 (b) probe · 45379fbf local/R4 evidence, SHOTS-REQUEST = R4.
- (this push) rev 5 #4 part: no sun on dots/pills, sight 7 px circle @30 % / food 8 px square @72 %, glyph overrides (step 0) + new nouns (bottle, frame, bag) + spire, location dot as a placed box, measured pill gaps ≥ 4 px; FE-B shadows → tokens.
- 7fef2dec: QA-45 (Show all in one list), QA-54, QA-52.
- 40e15601: R2 panel round (PANEL-R1 #2, #4, #6, #15; CLS 1.57 → 0.003).
- 7831b0c5: PERF-08 lens hooks.
- f47945e9: §2.1 desktop chrome (108 px, one bar, 64/36 split, no document scroll), B-08, B-20.
- Rev 4 phone first screen (peek, labelled pills, Key in Filters), Top picks, count line, 8 px dots, noun-first glyphs. Merged with FE-2 slices 1–2: the paged list survives late stamping, a swipe after Back, preview with no media, nearest-edge scroll. See BETA-LOG "SPEC-v3 rev 4" and the merge notes.

## Next
- **Waiting on:** the orchestrator's real re-shoot of 0a4e5751 (requested), the designer's dark-dot re-sign, and FE-2's re-run.
- **Settled:** D-43 declined; the preview says "Approximate pin" (0a4e5751). FE-C's Atlas empty-state hide landed (70ddc1c9e). "Search as I move" stays off on phones (designer agreed).
- **Then:** give FE-2 the SHA, and announce "round 4 ready at <sha>" to the panel with the orchestrator copied.
- **Round 4:** wait for (1) the real/R4 shots (orchestrator runs the workflow), (2) the designer's dots sign-off, (3) FE-2's go or SHA (their #7 108 px shift, R7-g4 c). Then send the panel (session_01EKzwLjqF1Z1gwXWgbrrr2S) exactly "round 4 ready at <sha>", after telling FE-2.
- **Open decisions** (designer / QA): clear map ~74 % with the required switcher row; B-03's ≤ 14 against the spec's 15 phone controls; review of the `bag` and `spire` glyphs.
- **Watch:**
  - FE-C's `.rb` badge hit area (B-20);
  - the DOM budget on Tokyo desktop (3,082 on origin, not Atlas's);
  - FE-A's partial-height phone sheet proposal (R2 #1 deep link).
- Fixed in this push: the selected pin's label stays clear of the phone controls.

## In flight
- The gates (validate, npm test, beta:check, atlas-ms, w2, w7) on the merged head carrying b835889f (OV-03), 0cc26628 (OV-04 §2.0.3) and a2e74bb8 (shed resume). Then push with tools/beta/sync-push.sh and claim OV-03 / OV-04 in docs/BETA-OVERLAY-LEDGER.md. Tell platform (the pack host is live), FE-2 (the labels SHA) and the orchestrator.
- **Next:**
  - OV-41: the Atlas-default case back in qa/offline-pack.js once platform's mount is on the head;
  - OV-03 remainder: landscape 10 labels;
  - landscape: §2.0.7, one 48 px bar and no peek;
  - D-46: peek thumbnails and the phone intro;
  - the no-photo card spec (designer, when it lands);
  - D-43 halo;
  - R8 gap 4;
  - INP 232 → ≤ 200.
- **Gotchas:** never edit a script bash is running (gates.sh). Commit beta/ with each source change (`git add -A`, not just tools/).

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
