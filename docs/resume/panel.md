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

## Next

Wait for "round 3 ready at `<sha>`" from the front-end lane or the orchestrator. Then:

1. **Pin the head:**
   - `git worktree add ../panel-r3 <sha>`
   - `cd ../panel-r3/tools && npm install --no-audit --no-fund`
2. **Evidence**, run from the main checkout. Push after each step.
   - `NODE_PATH=$(npm root -g) node design/beta/atlas/tools/panel-probe.js --root ../panel-r3 --out design/beta/atlas/panel/R3`
   - `NODE_PATH=$(npm root -g) node design/beta/atlas/tools/views-regress.js --root ../panel-r3 --base ../panel-r2 --out design/beta/atlas/panel/R3/views`
   - `cd ../panel-r3 && NODE_PATH=$(npm root -g) node tools/beta/atlas-ms.js --out <main>/design/beta/atlas/panel/R3/ms`
   - Check that `design/beta/atlas/real/R3/` exists and that its commit's parent is the head
     (`git log --format='%h %p' -1 -- design/beta/atlas/real/R3`).
3. **Write `panel/R3/EVIDENCE.md`** with the measured facts only (use R2's as the template), then push.
4. **Brief:** copy `panel/R2/PANELIST-BRIEF.txt` to `panel/R3/PANELIST-BRIEF.txt` and change R2 to R3 and panel-r2 to
   panel-r3. Each panelist reads its own `panel/R2/panelists/<id>.md` as "Prev".
5. **Run eight Agent panelists** in parallel. Their persona cards are in `PANEL.md` §3 and in the prompts used so far
   (see `PANEL-R*.md`).
6. **As each return arrives,** save it to `panel/R3/panelists/<id>.md` with the rule-6 redaction sed, then push.
7. **Before the report,** run the gates: `cd tools && npm run validate && npm test && npm run beta:check`.
8. **Report and send:** write `PANEL-R3.md`, push, verify with `ls-remote`, then send the results to the three
   sessions above.

## In flight

Nothing. The R2 report is pushed, and the panel is waiting for the R3 head.

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

**Rule 6:** before committing, redact third-party guide, tourism and listing brand names in panelist prose. The sed is
in the commit history for `panel/R2/panelists`.

**Where things live:**
- Panelist agent ids don't survive a session. The briefs and returns are in the repo, under
  `design/beta/atlas/panel/R*/`.
- The scratchpad copies of the briefs (`/tmp/...`) are not durable. Regenerate them from `PANELIST-BRIEF.txt`.
