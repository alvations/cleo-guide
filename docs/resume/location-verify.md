# Checkpoint — location-verify lane

_Overwrite, don't append. Protocol: [README.md](README.md). Design + owner decisions: [../LOCATION-VERIFY-ACTIONS.md](../LOCATION-VERIFY-ACTIONS.md)._

**Updated:** 2026-10-17

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
| singapore | re-run 2 committed 18d04250 (2026-10-17, 300 Nominatim): pin 64 · confirm 29 · move 2 · conflict 10 · ambiguous 14 · no-match 175 · status 2 · **skipped 407** (was 527) — assist pass 9 · review 2 · hold 68 · no-change 24 · reject 598. ≈4 more daily runs | — (batch accept after the final run) |

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

Tests: `node tools/location-verify.test.js`, 62 tests. Also: adfb052d `--names` re-check mode · f29ae0f1 `--duplicates` → docs/geoverify/DUPLICATES.md (42 pairs). Latest tool SHAs: b4ef10ed (generic unofficial-geo signals, no brand names), 855a21bc (Wikipedia≠independent, moved-place guard, extended/closed rules, --reassist).

## Next

1. **Nominatim pace is per UTC day (≤ 300 across ALL runs).**
   - It was breached on 2026-10-16 (~1,570), and the ledger was added in c59aca30. Check
     docs/geoverify/NOMINATIM-LEDGER.json before any REQUEST.
   - The workflow now commits the ledger in every mode.
2. **Daily queue (D-43, orchestrator 2026-10-16).** Each 03:17 UTC wake pushes exactly one REQUEST for the queue head,
   with `nominatim_max` ≤ the ledger's remaining allowance for the day:
   1. `city=singapore`, scope `unverified,low,status`, until 0 skipped. Then send the final SHA for the batch accept.
   2. `city=okinawa`, **scope `low`**: 195 low pins of 425, which the beta labels "Approximate pin".
   3. The other low pins, scope `low`, one city per REQUEST, in this order:
      youngstown-oh 5, dayton-oh 5, cincinnati-oh 4, orlando-fl 4, indianapolis-in 3, columbus-oh 2, ghent 2,
      bruges 2, miami-fl 2, cleveland-oh 1, pittsburgh-pa 1, washington-dc 1, state-college-pa 1, antwerp 1, brussels 1.
      These are registry `confidence: low` counts from 2026-10-16. Singapore's 4 are covered by step 1.
   4. Then saarland, rhineland, aachen, with scope `unverified,low,status`.
   5. **After Singapore's REQUEST on the next wake:** the D-44 status follow-ups. Use WebSearch only, one search each:
      - Oriental Delight (Antwerp): keep it closed. Rewrite statusSource as "Listings show it closed (Foursquare 'Now Closed'; TripAdvisor closed); no permanent-closure report found", and drop the worklist wording. No search needed.
      - De Vagant: search once for a reopening. Flip it to open only on news or the bar's own site or socials; an aggregator comment doesn't count.
      - PA Military Museum: search once for a reopening date.
      - Thurman, The Mill, Schiffchen: re-check on the next refresh.
   - Accept rules are unchanged:
     - upgrade a pin only to an exact place coordinate;
     - never fabricate;
     - when nothing better exists, the low label stays.
   - Tell the orchestrator when the queue is empty, so it can disable the daily trigger.
   - **This checkpoint queue is authoritative.** The scheduled-task prompt (trig_01P2RWA4kn9SKwApTwLdtSrm) was updated on
     2026-10-17, at the user's "make sure the agents continue", to match the D-43 order and the chaining rule.
   - **Step 3 is chained within one wake** (orchestrator, 2026-10-16):
     - push one REQUEST at a time and wait for each report;
     - stop when the day's remaining allowance can't cover the next city.
   - Big cities stay at one REQUEST per wake. Send the orchestrator each report's SHA; it accepts in batches.
3. **Done today:**
   - re-check (4573ae25) and the Hotel Utah settle: OSM wins, Census 13 m vs 58 m;
   - duplicates and orphans (DUPLICATES.md, ORPHANS.md; (d) decided, b8926d86);
   - page ∪ dataset scope (385f6189).

## QC-25 closure-URL job (orchestrator) — done 2026-10-16

55 of the 60 rows in docs/qc25-closed-no-source-url.txt now carry a closure URL. Commits:

| batch | content | head |
|---|---|---|
| 1 | ff3ce0bf | c2bcdf62 |
| 2 | 278c8ace | a66e72ea |
| 3 | 3415c063 | e2f86c03 |
| 4 | ad151e8e | b49e5d13 |

**No URL found (5), left unchanged:**
- Uncle Liu's Hot Pot;
- Frituur De Gouden Saté: its closed status may be stale;
- Wheeling Brewing Company;
- Old Market House Inn;
- Oriental Delight: no permanent-closure evidence.

**Flags for the orchestrator:**
- Hot Sauce Williams (Lee Rd): the only source is a map listing.
- Sokolowski's: the page says "closed 2023", but sources say Oct 2020.
- The RainForest has been replaced by the Primate Forest, which has opened.
- De Vagant: an unconfirmed report says it reopened.
- These are temporary closures to re-check: Thurman, The Mill, the PA Military Museum and Schiffchen.

## In flight

- Nothing. The Nominatim allowance for 2026-10-17 is spent (300, Singapore). Next: the 2026-10-18 03:17 UTC wake → Singapore again.
- D-44 follow-ups are done (35a3d2d8): Oriental Delight evidence-class text; De Vagant and PA Military Museum re-checked, both stay closed.

## Closed-without-statusSource job (orchestrator, W9 audit) — 2026-10-16

A WebSearch-only job, using no Nominatim. All 11 registry rows with `status: closed` and an empty `statusSource` were handled:
- **Sourced (8):** statusSource and statusChecked=2026-10-16 recorded, with `researchedVia` in the note:
  - aachen: Zum Goldenen Einhorn;
  - rhineland: Kaspars, and Brauerei zum Schiffchen (closed for renovation, reopening targeted 2027, re-check then);
  - singapore: Canopy Garden Dining, Denzy Gelato (Bishan), Grub (the 510 unit; the brand reopened at 1380 AMK Ave 1, which is unpinned), Amber Ember;
  - erie-pa: 1201 Kitchen.
- Orchestrator: Enrique's stays a stale orphan (no further research); Schiffchen kept closed with a re-check note; build-erie fixed by the orchestrator; the Grub park lead is logged in ../geoverify/LEADS.md.
- **UNVERIFIED-status (3):** noted, no source invented, statusChecked left as it was:
  - Cu Chi Wildlife Rescue Station: only a booking listing says closed;
  - Take One (Aachen);
  - Enrique's (22 N Park Row, a stale orphan): the news found points to it moving *into* the food hall there, so the closed status may be wrong.
- Rebuilt aachen, rhineland and singapore-pages. Pushed as bfa2be2c (head 2eee2d25).

## Notes

- **Never re-run a reviewed city without need**: re-runs now CARRY review.* (18d11e6d), but don't review a city while its run is in flight.
- **Re-score without network:** `node tools/location-verify.js --reassist docs/geoverify/<city>.json` (assist column only; reviews untouched). Never on a city whose run is in flight.
- **Never run queue scripts in the main checkout**: a background script once committed REQUEST inside a manual merge. Use `scratchpad/q.sh` (own worktree, detached at origin, only REQUEST).
- **Beta merge conflicts**: take theirs for beta/*, rebuild (`npm run beta`), then gates. Never hand-merge generated files.
- **Scope (385f6189):** default is page ∪ dataset. The ~2,000 "orphans" are almost all (b), dataset rows held for a
  pin. `--orphans` → ORPHANS.md; `--duplicates` → DUPLICATES.md. Both keep a Decisions log.
- **Re-check (4573ae25):** 3 corroborated, Hotel Utah moved 71 m. The orchestrator applied it in f9e717dc.
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
