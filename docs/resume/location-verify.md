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
| orlando-fl | **committed** 270d4f7a: pin 66 · confirm 7 · no-match 71 · ambiguous 4 · conflict 1 (Silver Springs: OSM main-entrance node 1.87 km off) — assist pass 13 · review 2 · hold 59 · reject 75 | — (sent to orchestrator) |
| chicago-il | **committed** 548362d9: pin 87 · confirm 5 · no-match 28 · ambiguous 2 — assist pass 53 · review 8 · hold 31 · reject 30 | — (sent to orchestrator) |
| washington-dc | **committed** 6bfe353b: pin 58 · move 1 · no-match 31 — assist pass 40 · review 1 · hold 18 · reject 31 | — (sent) |
| miami-fl | commit run in flight | — |

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

Tests: `node tools/location-verify.test.js`, 51 tests.

## Next

1. When "Location-verify report: miami-fl" lands, send the orchestrator its assist summary. Helper:
   `next.sh <prev> <next>` waits for prev's report commit, then pushes the next REQUEST (recreate it from this file's Notes
   if the scratchpad is gone).
2. Then erie-pa, philadelphia-pa, singapore (≈3 resumable runs): one REQUEST each, all `commit=true`, `nominatim_max=300`.
   Wait for each report commit before pushing the next REQUEST: concurrency keeps only the latest *pending* run.
4. Remaining large non-US backlogs: singapore (OneMap needs the owner's secrets), saarland, okinawa, rhineland, aachen.
   Phase-2 file URLs are still unconfirmed (see the doc § 2.2).

## In flight

- miami-fl `commit=true` run (REQUEST on the branch); next.sh miami-fl → erie-pa running in this session.
- Nothing unpushed.

## Notes

- **Never re-run a reviewed city without need**: re-runs now CARRY review.* (18d11e6d), but don't review a city while its run is in flight.
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
