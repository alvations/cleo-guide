# Beta: how to resume (orchestrator checkpoint)

This file is the single place to restart the beta program after a stop: a usage limit, a lost container or a new
session. The orchestrator rewrites it at every check-in, at least every 30–45 min. Each lane keeps its own
checkpoint in `docs/resume/<lane>.md` (see [docs/resume/README.md](resume/README.md)). The full history is in
`docs/BETA-LOG.md`, the session table is `docs/AGENT-LEDGER.md`, and the issue register is `docs/BETA-ISSUES.md`.

**Last updated:** 2026-10-17 00:08Z by the orchestrator (session_01PCNcUkfa5S1N1BKGzZA4xx).

## Resume in five steps

1. `git pull --no-rebase origin claude/peaceful-goodall-i0hsrt`, then read this file and `docs/resume/*.md`.
2. Run `cd tools && npm install && npm run validate && npm test && npm run beta:check`. If anything is red, fix it
   first; a red head blocks every lane.
3. Check what landed while stopped:
   - `git log --since=<last update> --no-merges`;
   - the Actions runs (beta-fetch-unsplash, location-verify, beta-atlas-real-shots);
   - for every claimed SHA, `git merge-base --is-ancestor <sha> origin/claude/peaceful-goodall-i0hsrt`.
4. Wake each lane with one message: "resume from docs/resume/<lane>.md". Lane sessions are in the table below.
5. Re-arm the check-in trigger `trig_01UKDExPpCFXupkoice8CwHo` (run_once_at about 30–45 min ahead).

## Goals (owner)

- The overall independent review ≥ 98. Last measured: **R8 90.7** on the live r7 b54b3745 (R7 88.5). R8's gaps #1–#7 are routed (imagery, FE-1/FE-2, FE-A, FE-B, FE-C, the designer, platform; QA files R8-g rows).
- The Atlas map panel ≥ 95. R0 56.1 → R1 63.8 → R2 70.9 → **R3 80.7** (at 537cfb8c).
- Fix all issues, with the melon-seek-style UX QA/QC and the optimization audit, keeping the audit trail
  (`docs/BETA-ISSUES.md`, `docs/BETA-QC.md`, `docs/BETA-PERF-AUDIT.md`).
- The owner delegated decisions: "You decide; if you're asking for permissions then I say just yes".
- Push and compile often, so a limit stop loses little.

## Deploy gate (now)

- **r7 is DEPLOYED (21:33Z).** PR alvations/cleo-guide#9 merged `b54b3745` into `claude/cleveland-page-creation-pant4l` (merge `4382a187`), and the Pages build started at 21:33Z. QA YES at 943d1ce8 under D-45 (QA-79 waived); QC PASS at 7c5ea616. beta-deploy-r7 was merged back into the dev branch with `-s ours` (beef84ec), since every ported change is already on dev. The changelog entry is in docs/BETA-CHANGELOG.md.
- **Next:**
  1. **The R8 independent evaluator is running:** session_01KmzDV95S6cTa7gLfep3bsq, launched 21:36Z. It measures b54b3745 against R7 badcc20d with the r8 kit, writes design/beta/eval/ROUND-8.md and reports to the orchestrator. Never tell it a target.
  2. **PERF-08 flip: GO sent to platform at 21:37Z** (beta:perf before, the flip, perf08-regress.sh, beta:perf after). The SHA goes to QA.
  3. The next release pin from the dev head once Atlas rev 5 reaches panel R4. QA verifies QA-79's fix there.
- **History:**
  - 530dc83b NO;
  - 3ba696e8 NO;
  - 4aba38b3 NO (QA-77, QA-78);
  - b54b3745 NO (QA-79), then YES under D-45, **deployed**.

## In flight

| What | State | Next |
|---|---|---|
| Check-in 00:08Z | Dev head 77b960fa is gated green, and **eager JS reads 39.28 KB on Cleveland** (≈ 0.7 KB headroom, after the platform and FE-A trims). FE-A's chrome pass 853ea52c (OV-09/10/11/32/33/34 claimed; P2 at rest 16 %). **Compaction decision:** city pages key on `html.ov-c` (FE-A's Cleo.chrome); shell pages keep FE-B's small controller; nothing moves into core.js. QA's B-25 gate is in; QC is adding Severity to the ledger | D-46 flip after FE-1's stamping hold; FE-1 OV-00 Atlas; the r8 pin when the conditions hold |
| Check-in 23:20Z | Dev head fb730533 is gated green (validate, npm test alone, beta:check, w2 dom 12/12). **INP:** FE-1's e0b79e23 takes the desktop switch → Atlas from 18.5 s to 0.45 s at 4× CPU, against a ≤ 200 ms target; FE-1 continues on the forced layouts. **Overlay ledger:** 19 OV rows; OV-00 is set (bb2af873); the one-search rule (98a39437); FE-C OV-08 claimed; FE-B OV-30/31 claimed; FE-A OV-01, its header part, landed (1d652d65); QC's S-17 is graded against OV-00 (92094c78), and the r7 audit is running. **R8 axe fix:** FE-C is landing `.btn .lbl` inherit. **D-46:** waits on platform's Atlas initial-stamp budget, after which FE-A flips | r8 pin needs: D-46 flipped, INP ≤ 200 ms, no open High/Med OV rows, panel R4 scored |
| **Owner directive: overlay and chrome audit (22:45Z)** | The owner's live Punggol Atlas phone screenshot shows fixed layers that don't move with the map and take up most of the space. The ledger is **docs/BETA-OVERLAY-LEDGER.md** (d880d025), seeded OV-01..07. Routed: the designer (OV-00 budgets and auto-compact rules, first); QC (the S-17 probe, a full-site audit of live and dev, keeping the ledger); FE-1/FE-2 (OV-02..07 on the Atlas map); FE-A (OV-01 header, switch and chips, Gallery sticky bars, landscape); FE-B (Guidebook and Insights); FE-C (sheet, trip, saved, toasts, pack banner); QA (B-25 gate on pins) | OV-00, then the S-17 audit, then fixes claimed per row. r8 ships only with no open High/Med OV rows |
| Check-in 22:37Z | Dev head d8369d2f is gated green (validate, npm test alone, beta:check, w2 dom 12/12). **PERF-08 re-landed** at 447d97c5 (selective = true, perf08-regress green); platform reports INP before and after. FE-2 is coalescing the round-trip scroll snapshots (5491ea13) as a first INP step. QC P-32 (unthrottled): Gallery→Atlas ~1 s. QA's B-01a (52245d25) reads phone clear map 74 %; FE-1 lands the 52 px header. The R8 evaluator's metrics sweep is at 54/180 | INP fix head → QC P-32/P-33 plus the platform guard. Then FE-A's D-46 flip, the R4 re-shoot, and the r8 pin |
| **INP regression on dev (22:07Z, top priority)** | Platform's beta:perf on b61fda89 (PERF-08 OFF): desktop switch → Atlas **21,016 ms** (was 672–792), desktop filter 1,344 (was ~824), phone filter 1,136 (was ~544); the phone switch is fine (296). Suspect 797258c2 (Atlas §2.3, one list ranked by map priority), or 648aa9c3 / 82f3d199. **Not in the live r7.** | FE-1/FE-2 fix (target ≤ 200 ms). Platform bisects and adds an INP guard to perf08-regress.sh or npm test. The PERF-08 flip lands only if it doesn't worsen INP. Blocks the r8 pin and D-46 |
| Atlas panel R4 | Real shots R4b on ffbb225a committed (3b50e631) for the designer's dark-dot re-sign. FE-1's pre-R4 items are done (B-20 0 on 5 pilots, QC-05 one state, chip overflow), and the preview says "Approximate pin" (0a4e5751). The designer declined a third dot state | **Hold "round 4 ready"** until the dark-dot re-sign and D-46 (FE-A's default flip plus FE-1's first-screen points). Then the final R4 re-shoot on that head, then the panel (session_01EKzwLjqF1Z1gwXWgbrrr2S) with the focus-ring method note |
| **D-46 Atlas default (owner, 21:45Z)** | Owner: "make atlas the default view then the list". The order is Atlas, Gallery, Guidebook, Insights; precedence stays hash → stored → default. Assigned: FE-A leads (core.js DEFAULT, city.js VIEWS and viewHead, hero preload, test-fe-a); platform (atlas.js boot and budgets, before/after perf); FE-1/FE-2 (the list never waits on the map, the phone first screen, CLS 0); QA and QC (re-point their default-view harnesses, an Atlas first-screen criterion); designer (SPEC, first impression, switcher sign-off) | Ships in the next release with Atlas rev 5. Panel R4 then scores Atlas as the default |
| Imagery | All 32 run #48 refusals applied. Run #52 (`all`) yield collapsed to about 4%, so no more plain `all` runs (orchestrator, 15:27Z). Candidate wave 1 (cb5dfd79): 20 vetted titles for 10 empty leads and first-row slots, and 6 stated gaps. Push run #54 is running. D-40a: the 720w leads are capped at 45 KB; Tokyo phone@3× is 607 KB | Imagery contact-sheets #54 and sends only the "?" rows. Wave 2 is about 40 targets from the guides with the lowest tier-1 share |
| Location verification | Accepted today: Wheeling 7, SF 112, Orlando 7, Chicago 48, DC 38, Miami 2, Erie 27, Philadelphia 25. Beta is at 8,704 places. The assist rules now treat Wikipedia as not independent of Wikidata, add a moved-place guard, hold extended features, and send closed places to review. Singapore (run 22) is in flight. QC-25 closure sources are done: 55 of 60 closed rows have a URL (batches 1–5, last 9338a4ce). D-44 settles the evidence classes. Sokolowski's corrected to closed 2020 (04026e9d). Decisions sent: Hot Sauce Williams Lee Rd gets one more search to replace a map-listing URL; Uncle Liu's goes UNVERIFIED-status (review sites alone fail 4c) | Batches 3–4 (31 rows). Review Singapore when it commits. Then the 4-row Wikidata re-check (the workflow's re-check mode, a74735f4: SF then Orlando), then `--duplicates` (open plus CLOSED pairs in 4 cities), then Saarland, Okinawa, Rhineland, Aachen |
| Atlas panel | **R3 80.7** (min 74.0, SD 2.86) at 537cfb8c; R0 56.1 → R1 63.8 → R2 70.9 → R3 80.7. SPEC-v3 rev 5 (46f4abe3). Rev 5 work landing: FE-1 R3 #4 dots and glyphs (f51bb0a4); FE-2 #7, the 108 px shift (in progress) | FE-1 and FE-2 finish rev 5, plus R7-g4. The designer signs off the dots on real shots before "round 4 ready". **With the R4 announcement, the orchestrator sends the panel one method note:** the card focus ring is drawn on the parent card (`.pl:has(.pl-n a:focus-visible)`), so a probe that reads only the focused link's own outline will report "no ring". |
| QC | 29 rows: verified 26 (QC-04 verified on 7857f885, 5d2ffb27); open 2 Low (QC-13 FE-1, QC-14 designer); QC-29 (the Orlando/DC prose on the release) was fixed by the port to 33a44d16; Med 0, High 0 | QC runs S-16 and the FE-B leak checks on the release SHA |
| Perf | PERF-06 landed (bcf94510). QA-70 is the `:has()` cause; PERF-16 is the designer's cleo.css selectors | Platform: re-measure QA-70, the `:has()` lint, then the PERF-08 FE parts, PERF-14, and the "1 closed places" plural |

## Lanes

| Lane | Session | Current task | Checkpoint file |
|---|---|---|---|
| QA, register keeper | session_017FLWXa5zgGWvqNo4C3UsvH | waiting for the QA-70/71 pin; the delta re-sign | docs/resume/qa.md |
| QC | session_01MYsz5PHtY39stLxc8rMmqj | re-verify on the next pin | docs/resume/qc.md |
| FE-A | session_0192s7fEFwRUZrw5ocAEJn9G | §3.6 one numbering (with the designer), QC-11 (768 CLS), QC-14 snap-spacing on fe-a.css | docs/resume/fe-a.md |
| FE-B | session_01BpzJesL1sQZFU5ZfBQtcNG | D-42 (QC-19/20: quoted.js hours and ratings, the note, the sheet line), QC-18 | docs/resume/fe-b.md |
| FE-C | session_01SxU3Mdpo1UAQyJQJmnMFtG | QC-15 (base focus/Esc), the designer's (a)–(j), then W9-1, W9-9 | docs/resume/fe-c.md |
| Platform | session_01USPS1inq7bUDfyw89evKMA | QA-70 re-measure, the `:has()` lint, PERF-08 FE parts, PERF-14 | docs/resume/platform.md |
| Atlas FE-1 | session_01Cuvo7DWhwbWjLpFicvaF5E | SPEC-v3 rev 5 (#1–#6), QC-17, the .ms-bar switcher, QC-04/05/13, atlas.css snap | docs/resume/atlas-fe1.md |
| Atlas FE-2 | session_011SQNDyJMGzR5K32A4y9Udd | **QA-70 + QA-71 (deploy blockers)**, then rev 5 #7 (the 108 px shift) and #8 (stale counts) | docs/resume/atlas-fe2.md |
| Designer | session_011YjA2jku166RJrUyCiQV6B | dot sign-off on R4 real shots, FE-C re-review, FE-A frame sign-off, PERF-16 | docs/resume/designer.md |
| R8 evaluator (independent; never tell it a target) | session_01KmzDV95S6cTa7gLfep3bsq | scoring the r7 deploy b54b3745 against R7 badcc20d | design/beta/eval/ROUND-8.md |
| Panel (scores only; never tell it a target) | session_01EKzwLjqF1Z1gwXWgbrrr2S | waiting for "round 4 ready at <sha>" | docs/resume/panel.md |
| Imagery | session_011rg9RMooGaKrmENvBZ7MvX | vetted-candidate waves (WebSearch, about 40 per wave); run #54 review | docs/resume/imagery.md |
| i18n | session_01HB7igqdcuhrau7mUWSauDL | all lanes catalogued; review rounds on new keys; QC-16 | docs/resume/i18n.md |
| Location verify (woken daily 03:17 UTC by trig_01P2RWA4kn9SKwApTwLdtSrm; disable when the queue is empty) | session_012FeQJjTmiN2MXYQWwe55J2 | Singapore, the Wikidata re-check, `--duplicates` | docs/resume/location-verify.md |

## Standing rules

All of CLAUDE.md applies, plus rule 6 (no third-party travel, booking, review or fashion brand names), sentence case, no
CDN for content, OSM/Esri tiles only, and localStorage in try/catch. Never force-push or rewrite history. Push loops
gate on the npm test exit code and verify the push with ls-remote. Never run two `npm test` at once in one container: each
runs 4 jobs, and the contention fails test-honesty and test-views spuriously (seen 15:00Z; each passed alone). The orchestrator owns `.github/workflows/*`.
