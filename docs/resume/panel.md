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
| R4 | `7a21f2f6` | 85.31 | see `git log -- design/beta/atlas/PANEL-R4.md` | Erratum issued mid-round (screen-reader-only count read as visible); the mean was 85.25 before |

## Next

Wait for "round 5 ready at `<sha>`". Then follow the same steps as round 4:
1. **Pin the head:** `git worktree add ../panel-r5 <sha>`, then npm install in `tools`. Keep `../panel-r4` as the views base
   and remove `../panel-r3`.
2. **Evidence:** run the probe, then views-regress (`--base ../panel-r4`), then atlas-ms, one at a time.
   - Dry-run the probe first if the Atlas DOM changed. It now handles the list sheet, Top picks, the Near me door and
     `#at=`.
   - Check `real/R5/SHOT-SHA.txt` equals the head (or the set named in the announcement).
   - **New for R5 (the orchestrator asked, 17 Oct 16:07Z):** `NODE_PATH=$(npm root -g) node design/beta/atlas/tools/density-probe.js --root ../panel-r5 --out design/beta/atlas/panel/R5/density`.
3. **`EVIDENCE.md`:** measured facts only. Check every "visible" claim against a shot or computed visibility, because
   `innerText` includes screen-reader-only text (round 4's erratum).
4. **Brief:** copy `panel/R4/PANELIST-BRIEF.txt` and change R4 → R5. Then append `design/beta/atlas/tools/brief-s1.txt`:
   the supplementary criterion S1 (information density), scored /10 and reported separately from the 100-point total. The
   charter fixes the rubric. The orchestrator approved this at 16:20Z: S1 sits outside the 100, with no charter change. Build the prompts from `design/beta/atlas/tools/panel-prompts-r4.json` (a durable copy of the scratchpad
   `r4prompts.json`) (common-r4 → common-r5, R3 → R4, panel-r4 → panel-r5).
5. **Eight panelists**, then `save-return.py 5 <ID> <agentId>`. Push as returns arrive.
6. **Gates:** `npm run validate && npm test && npm run beta:check`, chained with `&&`. Never commit on a red gate; rerun a
   suspected flake first.
7. **Report and send:** write `PANEL-R5.md` (add an S1 table: per-panelist S1, its mean, and findings), push, verify with ls-remote, then send it to the orchestrator, the designer,
   FE-1 and FE-2.

## In flight

Nothing. Round 4 is reported (85.31) and sent. Waiting for round 5. The orchestrator notes that FE-1 and FE-B have successor
sessions, so the timing may shift.

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
