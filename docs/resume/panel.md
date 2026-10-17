# Checkpoint: Atlas review panel (panel lead)

The owner's standing rule: push small, push often, keep this file current. The protocol is in
[README.md](README.md). Overwrite this file; don't append to it.

## Task

Lead the eight-persona Atlas map review panel. The charter is `design/beta/atlas/PANEL.md`. For each head the front-end
lane or the orchestrator names:
1. Build the evidence pack.
2. Run eight independent panelists.
3. Write `design/beta/atlas/PANEL-R<n>.md`.
4. Send the results to the orchestrator (`session_01PCNcUkfa5S1N1BKGzZA4xx`), the designer
   (`session_011YjA2jku166RJrUyCiQV6B`) and the front-end engineer (`session_01Cuvo7DWhwbWjLpFicvaF5E`).

The panel scores only and never changes product code.

## Done

| Round | Head | Panel score | Report commit | Notes |
|---|---|---|---|---|
| R0 | `965b7a5c` | 56.1 | `8e06aeb2`, `a70cc645` | |
| R1 | `d8b26516` | 63.8 | `cadff6f4` | |
| R2 | `40e15601` | 70.9 | `71e078f4` (merged `605d5596`) | Erratum issued mid-round; the pre-erratum mean was 70.1 |
| R3 | `537cfb8c` | 80.7 | see `git log -- design/beta/atlas/PANEL-R3.md` | Erratum issued mid-round (108 px layout shift); the mean was 80.7 before and after |

## Next

Wait for "round 4 ready at `<sha>`" from the front-end lane, the orchestrator or session_011SQNDyJMGzR5K32A4y9Udd. Then:

1. **Pin the head:**
   - `git worktree add ../panel-r4 <sha>` (remove `../panel-r2` first; keep `../panel-r3` as the views base)
   - `cd ../panel-r4/tools && npm install --no-audit --no-fund`
2. **Evidence**, run from the main checkout. Push after each step.
   - `NODE_PATH=$(npm root -g) node design/beta/atlas/tools/panel-probe.js --root ../panel-r4 --out design/beta/atlas/panel/R4`
   - `NODE_PATH=$(npm root -g) node design/beta/atlas/tools/views-regress.js --root ../panel-r4 --base ../panel-r3 --out design/beta/atlas/panel/R4/views`
   - `cd ../panel-r4 && NODE_PATH=$(npm root -g) node tools/beta/atlas-ms.js --out <main>/design/beta/atlas/panel/R4/ms`
   - Check `design/beta/atlas/real/R4/SHOT-SHA.txt` equals the head.
   - Also check the desktop header with a DOM probe at 1024 / 1280 / 1440 (view-switch button rects, "How we choose"
     line count, breadcrumb text), and read the new `layoutKept` in every `*-roundtrip`.
3. **Write `panel/R4/EVIDENCE.md`** with the measured facts only (use R3's as the template), then push.
4. **Brief:** copy `panel/R3/PANELIST-BRIEF.txt` to `panel/R4/PANELIST-BRIEF.txt`; change R3 to R4 and panel-r3 to
   panel-r4. Each panelist reads the LAST section of its own `panel/R3/panelists/<id>.md` as "Prev".
5. **Run eight Agent panelists** in parallel (persona cards: `PANEL.md` §3 and the R3 prompts).
6. **As each return arrives,** save it with `TASKS_DIR=<agent output dir> python3 design/beta/atlas/tools/save-return.py 4 <ID> <agentId>` (it reads assistant output only, so the
   previous round's files a panelist reads are not captured, and it applies the rule-6 redactions), then push.
7. **Gates:** `cd tools && npm run validate && npm test && npm run beta:check`.
8. **Report and send:** write `PANEL-R4.md`, push, verify with `ls-remote`, then send the results to the orchestrator,
   the designer, the front-end engineer and the round-4 sender.

## In flight

**Round 4 on head `7a21f2f60bffb22ce5b7c558e92b9cafba88a7fe`.** The orchestrator announced it at 13:49Z ("announced by FE-1 and
FE-2; the designer signed off").

Done this round (pushed):
- **Worktree** `../panel-r4`.
- **Evidence** in `panel/R4/`: the probe (rerun after fixing three phone-task artefacts; 136 shots), `views/` (no
  regressions) and `ms/` (the front-end lane's probe: PASS, 394 checks).
- **`EVIDENCE.md`**, which lists every probe change.
- **`PANELIST-BRIEF.txt`**, which points at `real/R4/` (re-shot on exactly `7a21f2f6`: 172 shots).

**Panelists** launched at about 15:05Z, with prompts in the scratchpad `r4prompts.json`. Agent ids (lost if the session
stops): UX a49e3a50d97d7d7f7, FE a165071778f44ebd6, Z1 ab24ba082a21691f2, Z2 a48ad59d152f3bc0d, X1 abf35cbb60079002e,
X2 a1e12c33f6bd86f1c, B1 a9a64c7f2da0d3a38, B2 a523b25d3a8b07481.

Returns saved so far: none.

**If the session stops**, re-run each missing panelist with `panel/R4/PANELIST-BRIEF.txt` (copied to the scratchpad as
`common-r4.txt`), its persona card (the same as R3's prompts, with R2 → R3 and panel-r3 → panel-r4), and its
`panel/R3/panelists/<id>.md` as Prev.

**Next:**
1. Save each return with `TASKS_DIR=<tasks dir> python3 design/beta/atlas/tools/save-return.py 4 <ID> <agentId>`, then
   push.
2. Write `PANEL-R4.md`.
3. Send it to the orchestrator (`session_01PCNcUkfa5S1N1BKGzZA4xx`), the designer (`session_011YjA2jku166RJrUyCiQV6B`),
   FE-1 (`session_01Cuvo7DWhwbWjLpFicvaF5E`) and FE-2 (`session_011SQNDyJMGzR5K32A4y9Udd`).

## Notes

**Before the evidence goes out:**
- Sanity-check every probe number against the source or a screenshot.
- In R2, the keyboard scan stopped too early and the search-ring check missed the wrapper. The probe is fixed: it now
  scans the full Tab order and counts a wrapper's `:focus-within` ring.
- If a fact turns out wrong mid-round, send the same erratum to all eight panelists and record it in `EVIDENCE.md`
  and the report.

**Fairness:**
- Panelists never see `PANEL.md`, any target score or another panelist's scores.
- Only the lead reads `PANEL.md`.

**Rule 6:** before committing, redact third-party guide, tourism and listing brand names in panelist prose. The
redaction list is in `design/beta/atlas/tools/save-return.py`; grep the returns for brand names before every
commit.

**Where things live:**
- Panelist agent ids don't survive a session. The briefs and returns are in the repo, under
  `design/beta/atlas/panel/R*/`.
- The scratchpad copies of the briefs (`/tmp/...`) are not durable. Regenerate them from `PANELIST-BRIEF.txt`.
