# Agent prompts, flow & lessons — the replication playbook

**Why this file exists.** Every expansion in this repo is run by a launched sub-agent. If the prompts live only
in chat scrollback, the next maintainer re-improvises them — that is the ad-hoc trap. This file is the
**auditable, reusable library** of the agent prompt *templates*, how each pass works, the artifact conventions
they must emit, the run log of what was actually run, and the lessons (successes + failures) that shaped the
flow. Read this with [SOURCES.md](SOURCES.md) (source discovery + the post-discovery tool pipeline),
[PIPELINE.md](PIPELINE.md) (stage contract) and [CITIES.md](CITIES.md) (per-city state).

**Golden rule:** discovery (WebSearch) is the only manual stage; *everything after it is codified in tools*
(`tools/rebuild-city.py` and its sub-tools). Never hand-script the merge/register/area/geocode steps.

---

## The shared HARD-RULES block (every discovery prompt embeds this verbatim)

> - **ONLY add credible / authentic / viral / famous-creator-or-major-press-cited places — NOT everything a
>   source lists.** A directory/listicle mention is not merit.
> - **≥2 credible sources per place**, OR one lone institutional authority (Michelin / James Beard / NPS /
>   Smithsonian). **Yelp / TripAdvisor / OpenTable / Google = ZERO** toward the two (fact-check / measure only).
> - **MERIT BAR — measure before adding, then re-rank within region.** Qualify via institutional authority, a
>   real award/vote (Washingtonian 100 Very Best, a RAMMY-type, "Best of <City>"), a verifiable famous-creator
>   or major-press or viral rave, **or** a genuinely high rating with real volume cross-checked on ≥2 platforms.
>   **No padding** — don't stack near-identical spots; record what was MEASURED & DROPPED and why.
> - **Fact-check OPEN/CLOSED** (2025/2026). Notable closed → `"closed": true` (kept, flagged); non-notable
>   closed → drop.
> - **NO coordinates** in discovery — geocoding is a separate stage; never invent lat/lng.
> - **No duplicates** — read the built dataset's `F`/`P` array first and skip what's already there.
> - **Vet every creator** — real, sizable following + a real city/cuisine beat + a *findable* piece of content
>   about the place. A creator is ONE corroborating source, never an institutional authority. Reject anonymous
>   accounts, unverifiable followings, SEO farms.
> - **Do NOT edit shared files** (`data/sources.json`, `data/geocodes.json`, `tools/*`, the dataset, or — for
>   concurrent runs — `AUDIT.md`). Write ONLY the named artifacts in `data/<city>-research/`. Under concurrency,
>   put the pass summary in `_note_<tag>.md`, not `AUDIT.md`.

Run `python3 tools/find-sources.py "<City>, <ST>" [--cuisine|--seed|--creators] --key <city-key>` first — it
prints the credible source TYPES + the canonical query set for the pass, and what's already registered.

---

## Pass templates (what to launch, per pass type)

Each pass writes standard artifacts that `tools/rebuild-city.py <key> [--build]` then consumes deterministically.

### 1. Food discovery — signature canon / cuisine deep-dive / non-American
- **Goal:** the city's signature/unique canon first, then fill thin cuisines (esp. non-American / immigrant).
- **Seed the sources:** local critic of record, city-magazine cuisine best-of, Eater/Infatuation, the
  **"Where the Ambassador of <country> eats"** series, diaspora/community media, awards, vetted creators.
- **Emit:** `FOOD_<tag>.json` (array; `{t,a,cz,dish,n,address,w,closed,sources}`), `CREATORS_<tag>.json`,
  optional `SOURCES_<tag>.json`. No coords.
- **Report:** counts by area+cuisine; creators vetted vs rejected (with follower scale); MEASURED & DROPPED;
  closed found; new outlets.

### 2. Sights discovery — things to visit/see (NOT food)
- **Goal:** monuments/museums/parks/landmarks/oddities the map is missing; every area keeps ≥1 tier-1.
- **Sources:** NPS/Smithsonian/official museum & park sites (lone institutional authority OK), CVBs, city
  magazine, Atlas Obscura, Wikipedia (published coords + notability), historical societies.
- **Emit:** `SIGHTS_<tag>.json` (object `{"sights":[{t,a,n,address,w,k?,sources}], "sources":[{key,name,url}]}`).
- **Report:** counts by area; confirm each area's tier-1; access/closed issues; MEASURED & DROPPED.

### 3. Creator / viral pass
- **Goal:** widen the credible base into verified creators + surface the viral places they made popular.
- **Emit:** `CREATORS_<tag>.json` (`{creators:[…], attach:[{place,creatorKey,url}], rejected:[…]}`) + a
  `VIRAL_<tag>.json` / normal food file for the new places. Repeatable: name later passes `CREATORS_<tag>.json`
  so `merge-creators.py` accumulates them without clobbering.

### 4. Seed-place pass (`--seed`)
- **Goal:** the user names a place (e.g. Mama Chang); reverse-find WHO credibly cites it + merit-worthy siblings.
- **Emit:** `CREATORS_<seed>.json` + `FOOD_<seed>.json`. Same downstream flow.

### 5. Corridor / between-cities pass
- **Goal:** places between two mapped cities; assign each to the nearer map. If a needed area doesn't exist,
  write records with `{"a":"<NEWID>","_newarea":"<Human Name>"}` — `tools/apply-newareas.py` adds it centrally.
- **Emit:** `FOOD_MIDCORRIDOR.json` / `SIGHTS_MIDCORRIDOR.json` (+ `CREATORS_*`) in the appropriate city dir.
- **Note:** a new area needs a **geocodable tier-1** or the build asserts fail — pair a corridor *sights* pass
  (Wikipedia-documented landmarks geocode high) with the food pass so the new area has an anchor.

### 6. Geocode pass
- **Goal:** turn addresses into place-pins. Read Wikipedia coords / Google `!3d!4d` / Apple `coordinate=`;
  **never** a `/@` viewport; **never** fabricate — unresolvable = null + `"unverified"` (the gate holds it for
  the browser `geocode-helper.html`). Grade high/med/low. Confirm status. Emit `geo/_geoout_<tag>_*.json`.

### 7. Engine (Cleveland) splice
- Cleveland is the engine (`cleveland.html`, inline data + validator invariants), not a dataset build. Agents
  only research into `data/cleveland-research/`; the orchestrator geocodes then splices with a **record-count
  assert** (CLAUDE.md rule 2) via `tools/add-to-cleveland.py`, then runs `npm run validate && npm test`.

---

## Run log (append one row per launched agent; keep updated after each run completes)

| Date | Map | Pass | Focus | Kept | Notable drops / closed | Artifacts |
|---|---|---|---|---|---|---|
| 2026-08-20 | DC | sights | Mall/Smithsonian/NoVA | 61 | Smithsonian Castle (reno) omitted | SIGHTS.json |
| 2026-08-20 | DC | food canon | half-smoke/Ethiopian/Salvadoran/Eden | 26 | pupuseria Yelp-only dropped | FOOD_CANON.json |
| 2026-08-20 | DC | fine dining | Michelin/JB/Washingtonian | 31 | Reverie (closed); Métier/Little Pearl padding | FOOD_FINE.json |
| 2026-08-20 | DC | NoVA suburbs | ARL/TYSONS/RESTON/FCITY/FAIRFAX | 30 | Mokomandy/Water&Wall closed | FOOD_NOVA.json |
| 2026-08-20 | DC | creator/viral | NoVA | 4 | @dcspot rejected | CREATORS.json/VIRAL_NOVA.json |
| 2026-08-20 | DC | NoVA sights | Mosaic/Reston/Great Falls | 15 | — | SIGHTS_NOVA.json |
| 2026-08-21 | DC | Eden+corridor food | Eden Center + inner-NoVA | 18 | Uncle Liu's closed; Banh Mi Oi held | FOOD_EDEN/FOOD_CORRIDOR.json |
| 2026-08-21 | DC | non-American | ambassador/where-X-eats | 36 | Makan/Yeshi/Jiwa closed; Maharani 1-src | FOOD_GLOBAL_DC/NOVA.json |
| 2026-08-21 | DC | seed-place | Mama Chang | 1 | 3 creators rejected | CREATORS_MAMACHANG/FOOD_MAMACHANG.json |
| 2026-08-24 | Dayton | food (Beavercreek) | EAST Asian/Vietnamese | 8 | Dak Joy closed; North China padding | FOOD_BEAVERCREEK_ASIAN.json |
| 2026-08-24 | Dayton | nearby sights | EAST/SOUTH/NORTH/YS | 17 | Brandeberry Yelp-only | SIGHTS_NEARBY.json |
| 2026-08-24 | Dayton+Columbus | corridor food | Springfield/Madison Co | 8 | Fountain on Main closed | FOOD_MIDCORRIDOR.json (both) |
| 2026-08-24 | Columbus | metro sights | theaters/parks/museums | 15 | Palace Theatre padding; Santa Maria gone | SIGHTS_EXPAND2.json |
| 2026-08-24 | Columbus | metro food | immigrant/non-American | 14 | Kamil's Uyghur closed; Thai gap stated | FOOD_COLUMBUS_EXPAND2.json |
| 2026-08-24 | Dayton+Columbus | corridor sights | Springfield/Madison | 13 | — | SIGHTS_MIDCORRIDOR.json (both) |
| 2026-08-24 | Cleveland | region food+sights | Lakewood/West Side | 23 (6 spliced, 17 helper) | Melt + Deagan's closed (flagged); El Carnicero/Nighttown/Balaton dropped | FOOD/SIGHTS_LAKEWOOD.json |
| 2026-08-24 | Cleveland | geocode wave | 23 Lakewood/Heights/Bay | 6 pinned | Capitol Theatre viewport-trap → UNVERIFIED; Deagan's new closure catch | geo/_geoout_lakewood_*.json |
| 2026-08-24 | Columbus | geocode wave | 42 metro+corridor | 24 pinned | Mikey's/Chuan Jiang bad-pin rejected → UNVERIFIED | geo/_geoout_wave_*.json |
| 2026-08-24 | Dayton | geocode wave | 41 metro+corridor | 18 pinned | 14 restaurants + 9 parks UNVERIFIED (helper) | geo/_geoout_wave_*.json |

**Builds landed 2026-08-24:** Columbus → **86 pins** (62 sights + 24 food), all 4 gates green, 41 UNVERIFIED queued.
Dayton → **74 pins** (55 sights + 19 food), geocheck/statuscheck/buildcheck green; sourcecheck FAIL = 2 single-source
places (Aullwood, Third Perk) that build GATE 1 drops, so the page is clean. Cleveland (engine) → Lakewood/West-Side +
Heights + Bay Village spliced via `add-to-cleveland.py`: **+6 geocoded** (P 143→148, F 45→46 = **194 on page**),
17 UNVERIFIED held for the helper, Melt + Deagan's flagged CLOSED; `npm run validate && npm test` green.

_Update the last rows' counts/outcomes when those agents complete and after the builds land._

---

## Lessons learned (successes, failures, and the code fix each produced)

- **Restaurant place-pins rarely surface via WebSearch here** (only place-id/CID/viewport links). → Honest
  `UNVERIFIED` + the browser `geocode-helper.html`; never fabricate. Sights (Wikipedia coords) geocode high.
- **A cloned build once shipped centred on the wrong city (SF on San Jose).** → Map centre/labels are DERIVED
  from pins + the `--buildcheck` gate. Structural, not a one-off.
- **A find-and-replace once deleted 143 records from cleveland.html and still parsed.** → Any script touching
  the engine must assert record counts before/after (CLAUDE.md rule 2); the Cleveland splicer enforces it.
- **"Mention is not merit."** Adding on a single listing produced padding. → The merit bar (measure acclaim)
  is codified in SOURCES.md + CLAUDE.md and embedded in every prompt; agents now report MEASURED & DROPPED.
- **Institutional authorities were missing from the gate** (Smithsonian; earlier NPS). → Added to `ELITE_SOLO`
  across sourcecheck.py / research.js / geocode-status.py / build-*.py / guidekit — kept in sync, tested.
- **A creator pass clobbered the previous CREATORS.json.** → `merge-creators.py` globs `CREATORS*.json`
  (repeatable, non-clobbering); passes are named `CREATORS_<tag>.json`.
- **`merge-creators.py` mis-resolved multi-part keys** (`washington-dc` → `washington`). → Prefer the full-key
  dir, fall back to the state-stripped slug.
- **Source discovery was improvised.** → `tools/find-sources.py` emits the canonical query plan (city / cuisine
  / seed / creators) + the source-type checklist; a DC-ism leak in its template was fixed to stay generic.
- **35 source keys were used in Columbus but never registered.** → `register-sources.py` auto-catches any
  used-but-unregistered key (excluding creators + open-check) and flags it for a rationale — the registry can
  no longer silently miss a discovered source. **Cleaning up the flow must never drop a discovered source.**
- **Closed-place flagging was hand-done inconsistently** (name vs registry key mismatch → statuscheck FAIL). →
  `geo-merge.py` renames both the registry key and the research record when a geocode pass finds a closure.
- **New corridor areas need a geocodable tier-1** or the build asserts. → Pair a corridor sights pass; verify
  each area has a surviving tier-1 before `--build` (promote a within-region standout if needed, as for Columbus WEST).
- **Concurrency corrupts shared appends.** → Parallel agents write distinct filenames + `_note_<tag>.md`, never
  a shared `AUDIT.md`; the orchestrator folds notes into AUDIT.md centrally after the run.
- **`rebuild-city.py` derived the wrong build-script name** (`os.path.splitext("columbus.dataset.json")` →
  `columbus.dataset` → `build-columbus.dataset.py`, which doesn't exist). → Derive the stem before the FIRST dot
  (`dataset.split('.',1)[0]`); the per-city `BUILD` override map is now only for genuinely irregular names.
- **The engine-leak guard was a bare `"Cleveland" not in …` substring test** and tripped on legitimate local
  addresses (Columbus has a *Cleveland Ave*). → All nine `build-*.py` now strip `Cleveland Ave(nue)` before the
  check, so it fires only on a real template-data leak (a Cleveland place name or a "Cleveland, OH" address city).
- **`sourcecheck.py` wrote its `_needs_sources.json` to a hardcoded `silicon-valley-research/`** for every city,
  clobbering that dir with other cities' data. → It now writes a per-city `data/<stem>_needs_sources.json` next to
  the dataset. Auditable, no cross-city clobber.
- **Geocode agents emit two output shapes** — a list of `{n, …}` records, or a dict keyed by place name. A prompt
  that asked for the keyed-dict form crashed `geo-merge.py` (which assumed a list) with `'str' object has no
  attribute 'get'`. → `geo-merge.py` now normalizes both shapes and accepts `source` as an alias for `geoSource`,
  so neither agent convention breaks the merge. (Pass-6 template still standardizes on the list form.)
