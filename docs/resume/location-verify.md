# Checkpoint — location-verify lane

_Overwrite, don't append. Protocol: [README.md](README.md). Design + owner decisions: [../LOCATION-VERIFY-ACTIONS.md](../LOCATION-VERIFY-ACTIONS.md)._

**Updated:** 2026-10-16

## Task

The runner proposes pins and closure flags; this lane never edits `data/geocodes.json`. Its jobs:

- Run `tools/location-verify.js`, the Actions workflow `location-verify`, city by city.
- Produce **proposal reports** in `docs/geoverify/<city>.{json,md}`, with `commit=true` on every city REQUEST.
- Keep the script, the review-assist column and the phase-2 adapters improving.

The orchestrator does the review, `--accept`, rebuild and gates (§ Owner decisions, recorded first-hand).

## Done

| city | report | accepted (by orchestrator) |
|---|---|---|
| wheeling-wv | committed (run #9) | **7** (c727e196) |
| san-francisco-ca | committed (run #12) | **112** (pass rows); 29 hold remain |
| orlando-fl | **committed** 270d4f7a: pin 66 · confirm 7 · no-match 71 · ambiguous 4 · conflict 1 (Silver Springs: OSM main-entrance node 1.87 km off) — assist pass 13 · review 2 · hold 59 · reject 75 | **7** (78c2fc29) |
| chicago-il | **committed** 548362d9: pin 87 · confirm 5 · no-match 28 · ambiguous 2 — assist pass 53 · review 8 · hold 31 · reject 30 | **48** (49c26d50) |
| washington-dc | **committed** 6bfe353b: pin 58 · move 1 · no-match 31 — assist pass 40 · review 1 · hold 18 · reject 31 | **38** (orchestrator) |
| miami-fl | **committed** 4f73fb2a (re-scored 855a21bc → pass 2): registry duplicate Fillmore open + CLOSED | **2** (orchestrator) |
| erie-pa | **committed** 0929302d (re-scored): pin 39 · confirm 17 · move 1 · ambiguous 2 · shared 6 (registry dups Tandoori Hut ×2, Enrique's open+CLOSED) · no-match 14 — assist pass 27 · review 9 · hold 5 · no-change 12 · reject 26 | — (sent) |
| philadelphia-pa | **committed** e590eeb2 (re-scored 094f5550): pin 27 · confirm 15 · move 1 · ambiguous 2 · shared 2 (dup Manakeesh open+CLOSED) · no-match 31 — assist pass 25 · review 10 · hold 5 · no-change 3 · reject 35 | — (sent) |
| singapore | committed 3a513510 but **invalid**: 682/712 no-match (single anchor for an SE-Asia key + Nominatim cap reported as no-match). Fixed 3490e42a. **Re-run needed** (≈3 runs). | — |

Tool SHAs:

| SHA | change |
|---|---|
| 1f337866 | initial |
| b31303b4 | interpolation ways count as street-level |
| 3ce1696a | review assist |
| 59c0144b | phase-2 adapters |
| abd3f061 | lifecycle tags on repurposed buildings |
| b3e47158 | Census second source; Wikidata closure only from the place itself |
| b462f8ba | only core sources can fail a run |
| ac737c14 | Overpass 120 s timeout |
| c2306ba1 | name-only Nominatim fallback |
| (git log: "circuit breaker") | per-host circuit breaker; 502 handled as a back-off |

Tests: `node tools/location-verify.test.js`, 60 tests. Also: adfb052d `--names` re-check mode · f29ae0f1 `--duplicates` → docs/geoverify/DUPLICATES.md (42 pairs). Latest tool SHAs: b4ef10ed (generic unofficial-geo signals, no brand names), 855a21bc (Wikipedia≠independent, moved-place guard, extended/closed rules, --reassist).

## Next

1. Re-check chain (`q.sh` from the separate worktree `scratchpad/qwt`, never the main checkout):
   - The SF names re-check is in flight; Orlando (ABC Commissary) is pushed automatically when SF's recheck file lands.
   - Then combine `docs/geoverify/recheck/*.md` into **docs/geoverify/recheck-wikidata-2026-10-16.md**.
2. Singapore re-run: REQUEST `city=singapore … commit=true`, repeated until no `skipped` rows remain.
3. Duplicates:
   - Pittsburgh and Youngstown are done (18aaf4b8).
   - Waiting on the orchestrator: an orphan-registry cleanup vs per-twin research (all other pairs are registry-only).
   - Aachen "- CLOSED" hyphen record still to fix.
4. Location-verify page-scope filter (on-page rows first), pending the orchestrator.
5. Then saarland, okinawa, rhineland, aachen.

## In flight

- SF names re-check run; q.sh chain (bb9l…) waiting to push Orlando. Nothing unpushed.

## Notes

- **Never re-run a reviewed city without need**: re-runs now CARRY review.* (18d11e6d), but don't review a city while its run is in flight.
- **Re-score without network:** `node tools/location-verify.js --reassist docs/geoverify/<city>.json` (assist column only; reviews untouched). Never on a city whose run is in flight.
- **Never run queue scripts in the main checkout**: a background script once committed REQUEST inside a manual merge. Use `scratchpad/q.sh` (own worktree, detached at origin, only REQUEST).
- **Beta merge conflicts**: take theirs for beta/*, rebuild (`npm run beta`), then gates. Never hand-merge generated files.
- **Queue step:** fetch until `git log origin/<branch>` shows "Location-verify report: <prev>", pull, write REQUEST
  (`city=<next>` with scope `unverified,low,status`, limit 0, nominatim_max 300, `commit=true`), commit, push, verify
  with ls-remote.

- **Read reports from the run log**: `mcp__github__get_job_logs`, run → job id. Big logs spill to a file; parse it.
- **The runner never writes the registry.** `--accept` refuses on CI, and refuses low, shared-object and conflict
  rows.
- **Known false-positive classes, all fixed and tested:**
  - addr:interpolation ways graded as address points;
  - a repurposed building's `was:` tag read as a closure;
  - a same-name Wikidata item's P576 read as a closure;
  - official JSON-LD that names the venue, not the place.
- **Overpass is often overloaded.** A gap only leaves OSM closure evidence incomplete; coordinates are unaffected.
- **NRW Hauskoordinaten are ZSHH-licensed, not open.** The open product is the Gebäudereferenzen, which have no
  postcode.
