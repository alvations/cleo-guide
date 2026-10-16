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
| orlando-fl | dry runs #11/#13/#14 clean: pass 12, review 2, hold 14, reject 121 | — (commit run queued, c2306ba1) |
| chicago-il | dry run in flight (ac737c14) | — |

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

Tests: `node tools/location-verify.test.js`, 47 tests.

## Next

1. When Orlando's commit run lands ("Location-verify report: orlando-fl" on origin), send the orchestrator its assist
   summary.
2. Push REQUEST `city=chicago-il … commit=true` (cache warm, ~2 min). Send its summary when it lands.
3. Then washington-dc, miami-fl, erie-pa, philadelphia-pa: one REQUEST each, all `commit=true`, `nominatim_max=300`.
   Wait for each report commit before pushing the next REQUEST: concurrency keeps only the latest *pending* run.
4. Remaining large non-US backlogs: singapore (OneMap needs the owner's secrets), saarland, okinawa, rhineland, aachen.
   Phase-2 file URLs are still unconfirmed (see the doc § 2.2).

## In flight

- Chicago dry run (from ac737c14).
- Orlando `commit=true` run (from c2306ba1), queued behind Chicago.
- Nothing unpushed.

## Notes

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
