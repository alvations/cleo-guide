# QC lane checkpoint

**Lane:** QC (melon-seek-style UI/UX and experience QA/QC). Owns `docs/BETA-QC.md`, the QC-NN rows in
`docs/BETA-ISSUES.md`, `design/beta/eval/qc/**` and `tools/beta/qa/qc*.js`. Audits only: never edits product code and
never weakens a gate.

## Task

- Re-verify QC-01…QC-14 on a pinned SHA as lanes report fixes. Record each in BETA-QC.md and in the register's
  verification column: pinned SHA, probe, result.

## Done

- `4db273ed`: phase 1, the checklist and the harness.
- `129eff6b`: baseline pass on `f2c39d69` + `b5f0afa1` (QC-01…14).
- `bb887a7f`: P-24 probe. `2ed1ddce`: re-verify on `2bfff3fe` (QC-01, 02, 03).
- `48cf146d`, `91fb6634`: checkpoints; harness P-10 `at=` and the place-link selector.
- This push: **pass on `530dc83b`** plus supplementary `639d2b1b` patterns.
  - Verified: QC-06, 07, 08, 09. QC-01, 02, 03 hold. QC-10 is verified on 639d2b1b only.
  - New: QC-15…20.
  - Outputs in `design/beta/eval/qc/{530dc83b,639d2b1b}/`.

## Next

1. QC-10: set it `verified` on the next pinned head that contains 78e4ab74 (patterns P-03, 5 pilots).
2. Re-verify QC-04, 05, 11, 12, 13, 14 and 15…20 as lanes claim fixes, with only the relevant groups:
   - P-xx → `--only patterns`;
   - J-xx → `--only journeys`;
   - S-xx → `--only sweep --vps …`;
   - QC-15…20 → `qc-evidence.js --only qc-15,…` plus the exploration script logic recorded in BETA-QC.md.
3. For each pass: a clean worktree on the pinned SHA, then commit only `qc.json`, `summary.md` and the evidence.

- `f7fa616d`: QC-16 verified; new QC-21 (Low, i18n); QC-18 observed fixed (unclaimed).
- `a498adf5`: QC-21 verified.
- `995e2529`: QC-18 and QC-20 verified; QC-19 still open (2 Cleveland records); new QC-22 (Low).
- `8f21eda9`: QC-10, 15, 17 and 19 verified; QC-22 still open; new QC-23 to QC-26 (W9-1 recognition pass plus the QC-26 regression).
- `9c133152`: QC-23 and QC-24 verified.
- `4aba38b3` (deploy pin): QC-26 and QC-22 verified; new QC-27 (Low, i18n: tier translated as 評価).
- `9fba196e`: QC-27 verified.
- `dev cceabd64` (FE-C heads-ups): QC-05 holds under the single Atlas empty state; S-05 now runs in every view; W9-2 date line is search-safe; new QC-34 (Low, FE-B: Guidebook Contents ignores the lens).
- `r7-b54b3745` (final release pin): PASS. Sweep 4 FAIL = filed QC-30/31; S-16 91/91; leaks 0; m.not.p en/ja; QA-77 badges ≥ 44 px, 0 in-view overlaps, no shift. New QC-33 (Med): Guidebook/Insights deep-link CLS ≈ 0.5 at 1440, pre-existing.
- `r7-33a44d16` (release): QC-29 verified (S-16 91/91); every sweep FAIL accounted for: S-15 and part of S-08/S-01 were probe bugs (fixed in 6a93f81d); new QC-30 (casing ownWords), QC-31 (raw colours/radii), QC-32 (prov sidecar notes). Clean sweep: 4 FAIL, all filed.
- `r7-19af6d81` (release branch pre-check): FE-B leaks PASS; m.not.p en/ja PASS; QC-28 PASS; S-16 FAIL on 4 pages → new QC-29 (ports 9fa622096 + 5d3dc9850 missing).
- `7857f885`: QC-04 verified (D-43 approximate pins).
- `cc127fb1`: QC-28 verified (S-16 91/91; TODO/FIXME now case-sensitive).
- `edf94546`: new sweep check S-16 (internal editorial phrases, incl. deferred cards); QC-28 (Low, data: Erie "Kept flagged").
- `e353df08`: QC-05 verified. P-17 follows D-43 (approximate pins); QC-04 waits on FE-C's SHA.
- `e1503766`: QC-25 verified (city pages). Pending: FE-B's "What changed" pages and how-we-choose D-42 line, to re-check when FE-B sends the SHA.
- `3a0ecfec`: QC-11 and QC-12 verified (S-12 all 91 pages at 390, 768 and 1440).

## In flight

D-46 (owner, 2c44f676: Atlas is the default; switcher Atlas, Gallery, Guidebook, Insights) harness update, committed in this push.
- The probes read the page's declared default (`Cleo.city.info.dv`, else Atlas) instead of assuming Gallery: P-01 checks the label set (the order is P-29's job), and P-04, P-05, P-07, P-09, P-12 and J-06 were updated. P-11 is explicit (`view=gallery&pg=`) and also reports the pre-D-46 `#pg=`/`#all=1` links (WARN if they no longer open the Gallery).
- New probes:
  - P-29: a cold load opens Atlas at the first frame, the switcher is ordered Atlas first, CLS 0;
  - P-30: a stored Gallery choice wins;
  - P-31: with the map library blocked, a place card is on screen within 1.5 s, both cold and with `#view=atlas`.
- Probe fixes: P-13, P-14 and P-15 open the phone Atlas list (`.ms-toggle`) before counting; P-14 accepts subset lines whose denominator is the lens count.
- Tested on Tokyo and Cleveland at 390 and 1440, on dev before D-46 is implemented. P-29 FAILs as expected (dv=gallery); P-30 passes; P-31 `#view=atlas` gives a card in 377–481 ms.
- Tokyo 390 re-test: P-13, P-14 and P-15 PASS with the phone Atlas list opened (reach 488/488, Atlas "Showing all 488 places"); P-30 PASS; P-31 `#view=atlas` card in 396 ms.

- P-32 (platform 22:07Z, desktop switch → Atlas INP 21 s on b61fda89, suspect FE-1 797258c2): at 1440, Gallery → Atlas → Gallery → Atlas, timed from pointerdown `event.timeStamp` to the target view's first card painted; WARN > 500 ms, FAIL > 2 s. P-33: cold `#view=atlas` with the map allowed, time to the first list card; WARN > 1 s, FAIL > 2 s. Baseline on dev 6cfe7b9c (contains 797258c2 and b61fda89), Tokyo 1440, this rig (no CPU throttle, tiles stubbed): P-32 WARN, Gallery → Atlas 1024 / 925 ms, Atlas → Gallery 379 ms (not 21 s here); P-33 PASS, first Atlas card at 801 ms. Fixed in-session: P-32 looked for li.pl in the Gallery, whose rows are .gc cards.

Next: run P-32/P-33 on the head that claims FE-1's fix and send the SHA; re-run patterns once the D-46 implementation lands. Re-verify QC-13, 14, 30, 31, 32, 33 and 34 as lanes claim fixes.

Next harness work:
- Add a Contents-vs-lens count check to the COUNTS probe (QC-34 class) once FE-B fixes it.
- Fold deep-link view CLS (qc-view-cls.js) into S-12 for city pages at 1440.
- P-25 and P-26 must discount entries that carry the D-42 note.
- J-10 and J-11 should also run under `?lang=ja`.

## Notes

- The harness has known artefacts, already handled. Don't re-file:
  - S-06: a label hidden by text-indent;
  - S-11: the sliding switcher indicator, the same as QA-66;
  - S-15: the wrapper ring is now handled in the probe (6a93f81d); a new S-15 FAIL is real;
  - `content-visibility` cards (read `textContent`);
  - smooth scroll during Tab.
- An S-11 FAIL needs a look at a screenshot before it is filed.
- The map view is now in the hash as `at=` (FE-2 closed **PANEL-R1-#13**; P-10 accepts `at=`). Before that it was PANEL-R1-#13, and data-label casing is **OWNER-casing**: reference them, don't re-file.
- `QC-11` extends PERF-06.
- The QA lane (`session_017FLWXa5zgGWvqNo4C3UsvH`) keeps the register: append only QC rows, 7 columns, escape `|`
  as `\|`.
- Reports go to the orchestrator `session_01PCNcUkfa5S1N1BKGzZA4xx`: counts by severity and lane, the top 10, and
  any Blocker or High at once.
