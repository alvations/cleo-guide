# The audited pipeline — reproducible, for every city

This is the **contract** every guide follows, new build or refresh: a fixed sequence of stages,
each of which **must leave an audit artifact** so a *different* agent (or a future you) can verify
the work, reproduce it, or continue it without guessing. It ties the rules in
[METHODOLOGY.md](METHODOLOGY.md), the sourcing playbook in [SOURCES.md](SOURCES.md) and the tooling
(`tools/research.js`) into one traceable order.

> The promise of this repo is that **every place is traceable to the source that recommended it**.
> An audit trail is how that promise stays true at 500 places instead of 50.

## The order is fixed

```
0 Scope & taxonomy → 1 Discover SOURCES → 2 Extract PLACES from sources →
3 Fact-check → 4 Re-rank → 5 Location-verify → 6 Build & gate
```

Never invert 1 and 2: you find *sources* first, then extract the *places* they name. Searching for
places directly is what pulls in unattributable SEO filler. Fact-checking (3) happens **after**
extraction and **before** ranking; location-verify (5) is **last** before the build because a pin
you can't verify does not ship.

## Where the audit lives

- **Per city:** `data/<city>-research/AUDIT.md` — an **append-only** ledger, one section per stage
  below. Each research wave appends; nothing is overwritten. This is the file another agent reads to
  replicate or continue.
- **Cross-city rules & judgement calls:** [METHODOLOGY.md](METHODOLOGY.md) (the rules),
  [DECISIONS.md](DECISIONS.md) (judgement calls with the rejected alternative).
- **Machine-checkable state:** `data/sources.json` (sources + `credible` rationale),
  `data/geocodes.json` (coords + status + `confidence` + `source` + dates). The Markdown audit
  explains *how*; these JSON files are the *result* the gates read.

Each ledger row records **what, which source, how verified, and the date** — enough that the claim
can be re-checked from scratch.

---

## Stage 0 — Scope & taxonomy
Define the region, its `AREAS` (municipalities/boroughs/neighbourhoods), the cuisine set, and the
sight `CATS` (collections). **Audit:** record the taxonomy and *why* it fits this place — e.g. for
Silicon Valley the areas are municipalities and the marquee collection is "Big Tech Campuses".

## Stage 1 — Discover the SOURCES (not the places)
Find the outlets and creators that carry weight *for this place*, and vet each **before** trusting it.
The bar (from SOURCES.md): a source must be **popular, viral, or uniquely meaningful to the region**,
and **credible** — the local paper/desk of record, a beloved city food writer, a guide of record
(Michelin), a curated oddities catalogue (Atlas Obscura), or a **creator** (YouTuber/TikToker/blogger)
who is *verifiably popular and honest* with a *findable piece of content at the actual place*.

**Audit — Source ledger.** One row per source: `key · what it is · why credible (the specific basis)
· scope (city/region/national) · reachability notes · verified date`. **Also log every source
REJECTED and why** (anonymous listicle, content farm, unverifiable popularity, pay-for-play). Reject
by [D1](DECISIONS.md). Register accepted sources in `data/sources.json` with the `credible` field.

## Stage 2 — Extract the PLACES the sources name
Read each source's own index/article and pull the places it actually names — with the **specific
claim** (the dish, the reason, the "viral/popular/notable" hook). Prefer mining a source's index over
re-searching ([D2](DECISIONS.md)).

**Audit — Extraction ledger.** `place · area · source(s) that named it · the specific claim/dish ·
the notability basis (viral / popular / authentic / notable / iconic)`. This is the provenance spine;
tiers and pins attach to it later.

## Stage 3 — Fact-check
For every extracted place confirm, **from a real source, never memory**:
1. **Open/closed** — the place's own site/socials, Google/Apple "Permanently closed", a news closing
   story, or the official municipal site. Closed places are **kept but flagged** (`— CLOSED`), never
   silently dropped; a place that never existed or isn't visitable is excluded.
2. **The notability claim holds** — that it really is viral/popular/authentic/notable/credible per a
   source that carries weight (Stage 1), and that the cuisine tag names the **kitchen's own
   tradition**, with a **named dish** (METHODOLOGY). Downgrade or drop hype you can't source —
   *popularity you can't verify isn't popularity.*

**Audit — Fact-check ledger.** `place · status (open/closed) · status source + date · notability
basis confirmed (which source, what it said) · method`. **List every EXCLUSION with its reason**
(permanently closed + date, relocated, unverifiable, dish-mislabel). Record status into
`data/geocodes.json` (`status`, `statusSource`, `statusChecked`); `node tools/research.js
--statuscheck <city>` must pass.

## Stage 4 — Re-rank
Assign tiers **graded within each area (and within each cuisine), never globally** (METHODOLOGY —
global ranking clusters everything downtown). Rubric:
- **t1 — unmissable / best-in-class** for its area or cuisine: strongest source consensus, defining
  example of the thing, or a genuine icon.
- **t2 — strong**: well-sourced, clearly worth a stop, not the single best.
- **t3 — notable / niche**: real and sourced, narrower appeal, exterior-only, or one-source.

**Audit — Ranking ledger.** State the rubric, then **per place: its tier and the one-line reason**
(source consensus, category-defining, icon, single-source-so-t3…), grouped by area/cuisine so the
"graded within region" rule is visible. Note every deliberate call (e.g. a famous-but-mediocre place
held at t3) so a future editor can disagree on purpose, not by accident.

## Stage 5 — Location-verify
Geocode every place to its **exact place pin**, never a viewport, never memory (METHODOLOGY 4a/4b).
Read `!3d<lat>!4d<lng>` / Apple `coordinate=` / a business-DB that names the exact place — **not** the
Google `/@` viewport. Grade each `high` / `med` / `low`; upgrade every low/misplaced pin; a pin you
cannot verify is marked `UNVERIFIED` and the build gate drops it (queue it in
`tools/geocode-helper.html`).

**Audit — Geocode ledger.** `place · lat,lng · source (what URL/DB was read) · pin-type (place-pin /
DB / viewport-rejected) · confidence · verified date`. This is `data/geocodes.json` plus a prose note
on method and on anything re-verified after a misplacement. `node tools/research.js --geocheck
<city>` must PASS.

## Stage 6 — Build & gate
`consolidate → build-<city>.py → cities/<city>.html`. Gates, all required and enforced **in code**
(not asserted): `--geocheck` PASS, `--statuscheck` CONSISTENT, **`--sourcecheck` PASS** (every place
≥2 credible sources; Yelp/TripAdvisor count as 0), `npm run validate` DATA OK, `npm test` ALL PASS, and
a headless **render-verify** (real Leaflet mounts, markers present, 0 JS errors). The dataset-built
`build-<city>.py` additionally **drops-and-logs** any place failing the sources-of-truth or geocode
gate, so the published page provably cannot contain an under-sourced or un-located place.

---

## Iterating to scale (toward NYC's ~500)
Scale is **waves**, not one pass: per-cuisine and per-subregion deep dives, each running the full
1→5 sequence and **appending** to `AUDIT.md`. The WebSearch budget is shared and capped per session
(~200) — expect a wave to truncate; log where it stopped and the vetted-but-unfinished leads
(`_PENDING_LEADS.md`) so the next wave resumes cleanly. Never fabricate to hit a number.

## Reusing this for refreshes & new cities
- **New city:** run stages 0→6 in order; `AUDIT.md` is born with the source ledger.
- **Refresh an existing city:** re-run **Stage 3** (status) and **Stage 5** (location) on the current
  set — these are the ledgers that rot — then append a dated refresh section to `AUDIT.md`. The
  `--statuscheck`/`--geocheck` gates make staleness visible; the ledgers say when each was last checked.
- Because every stage's *method* is written down (not just its result), a different agent can pick up
  any city at any stage and reproduce or extend the work.
