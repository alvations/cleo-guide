# Tools & local-agent library — the reproducible reference

Everything a **different agent, or a local (non-Claude) setup**, needs to run this repo's whole
pipeline: every tool, what it does, its inputs/outputs, the exact command, where it is enforced
(build-time vs CLI), and how the pieces fit end to end. Pair it with the process docs it links:

- [PIPELINE.md](PIPELINE.md) — the fixed stage order + the audit-artifact contract.
- [CITIES.md](CITIES.md) — the master index of every city, its state, and per-city commands.
- [SOURCES.md](SOURCES.md) — the sourcing / fact-check / geocode / status playbook (the rules the gates enforce).
- [GEOCODE-BACKLOG.md](GEOCODE-BACKLOG.md) — the auto-generated cross-city geocode to-do queue.

> The repo's promise is **every place is traceable to the source that recommended it**. The tools
> below are how that promise is *enforced in code*, not merely asserted.

---

## 0. How the pieces fit (end to end)

Two build styles produce the same kind of page:

- **Engine city (inline data):** `cleveland.html` *is* the engine and its own dataset (data literals
  `const P/F/S/FS/AREAS/...` near the top of the final `<script>`). `cities/pittsburgh.html` and
  `cities/youngstown.html` are built inline the same way (`tools/build-pittsburgh.py`,
  `tools/build-youngstown.py`). `validate.js` and `test.js` read **`cleveland.html`**.
- **Dataset-built city:** research JSON → one normalized dataset → a page cloned from the Cleveland
  engine with the map centre/labels **derived from the pins**.

The dataset-built flow, which is the reproducible path for any new city:

```
data/<city>-research/*.json          (agent/LLM research, one file per wave; the provenance spine)
      │  consolidate.py               normalize → areas, cuisines, cats, P/F, source tables
      ▼
data/<city>.dataset.json             (the machine-checkable dataset the gates read)
      │  tools/build-<city>.py        GATE 1 (sourcing) + GATE 2 (geocode) drop-and-log,
      │                               inject verified coords from data/geocodes.json,
      ▼                               DERIVE map centre + area labels from the pins
cities/<city>.html                   (the published page)
      │
      ▼  GATES (all required, enforced in code)
   node tools/research.js --sourcecheck  <key>   ≥2 credible sources (Yelp=0; lone Michelin/JB/NPS ok)
   node tools/research.js --geocheck     <key>   every pin fact-checked + sourced
   node tools/research.js --statuscheck  <key>   every open/closed status sourced & consistent
   node tools/research.js --buildcheck   <key>   map centre + labels inside THIS city's pins
   python3 tools/sourcecheck.py data/<city>.dataset.json   (standalone mirror of --sourcecheck)
   python3 tools/geocode-status.py                          (refresh docs/GEOCODE-BACKLOG.md)
   cd tools && npm run validate && npm test                 (cleveland.html integrity + no-CDN behaviour)
      │
      ▼  render-verify (real Leaflet mounts, markers present, 0 JS errors)
```

The two central registries every city shares:
- **`data/sources.json`** — ranked, fact-checked sources + creators, per city, with a `credible` rationale.
- **`data/geocodes.json`** — every coordinate + `source` + `confidence` + open/closed `status` + dates.
  This is the single source of truth for coordinates; the build injects lat/lng from it and refuses to
  build a place with no sourced entry.

---

## 1. Prerequisites (what must be installed)

| Need | Version used here | Install | Used by |
|---|---|---|---|
| **Node.js** | v22 (any ≥16) | system pkg | `research.js`, `validate.js`, `test.js` |
| npm deps for tests | — | `cd tools && npm install` | `test.js` needs `jsdom` + `leaflet` (in `tools/package.json`) |
| **Python** | 3.11 (any ≥3.9; 3.11+ for stdlib `tomllib`) | system pkg | `sourcecheck.py`, `geocode-status.py`, `build-*.py`, `consolidate.py`, guidekit |
| A browser | any | — | `tools/geocode-helper.html` (place-pin geocoding WebSearch can't resolve here) |
| A web-search tool | — | operator-provided (`WebSearch`) **or** guidekit's OSS search | Stage 1/2 discovery |

`tools/package.json` pins the two Node deps:

```
cd tools && npm install     # jsdom + leaflet, first time only
npm run validate            # → node validate.js   (data integrity of cleveland.html)
npm test                    # → node test.js       (behaviour, Leaflet available AND blocked)
```

guidekit needs **nothing** to import (all third-party imports are lazy). Backends install only when
used — see [§7 replicability checklist](#7-replicability-checklist).

---

## 2. Tool-by-tool reference

### `tools/research.js` — the research + gate CLI (Node)
The reusable research planner **and** the four page-level gates. It does **not** call the web; it emits
the canonical search queries and validates recorded results. City keys look like `cincinnati-oh`.

| Command | What it does | Reads | Writes / exit |
|---|---|---|---|
| `node research.js "<City>" "<ST>"` | Mode A: print a new-city research plan (discovery + authoritative + creator searches, ranking rubric, JSON skeleton) | `data/sources.json`, `data/local-media.json` | stdout only |
| `node research.js --refresh <key>` | Mode B: re-verification plan (re-verify anchors, closure sweep, what's new) | `data/sources.json` | stdout only |
| `node research.js --seed "<Place>" <key>` | Mode C: source a named place, mine its sources for more, fact-check | `data/sources.json`, media | stdout only |
| `node research.js --validate <key>` | Audit `sources.json` coverage (required source types, ≥1 rank-1, ≥1 creator, verified count) | `data/sources.json` | exit 1 on required gaps |
| `node research.js --sourcecheck <key>` | **GATE:** every place ≥2 credible sources; Yelp/TripAdvisor/OpenTable/Google = 0; lone Michelin/JB/NPS ok | `data/<city>.dataset.json` | exit 1 on FAIL |
| `node research.js --geocheck <key>` | **GATE:** every place on the page has address + lat/lng + source in `geocodes.json`; reports placement confidence + re-verify queue | page + `data/geocodes.json` | exit 1 on FAIL |
| `node research.js --statuscheck <key>` | **GATE:** every open/closed status sourced; closed↔name-flag consistency | page + `data/geocodes.json` | exit 1 on inconsistency |
| `node research.js --buildcheck <key>` | **GATE:** map `setView` centre + every on-map `LABELS` entry sit inside the bounding box of the city's own pins (catches a wrong-city clone) | page + `data/geocodes.json` | exit 1 on FAIL |
| `node research.js --media <key>` | List a city's local news outlets & TV | `data/local-media.json` | stdout only |
| `node research.js --list` | List cities in the registry + last-updated | `data/sources.json` | stdout only |

Two registries wire city keys to files inside `research.js`: `PAGE_FOR` (key → page html) and
`DATASET_FOR` (key → dataset json). **A new city must be registered in both** (and in
`geocode-status.py`'s `DATASETS` and `guidekit/pipeline.py`'s `CITY_MAP`).

The sourcing sets are defined identically in five places and **must stay in lockstep**:
`OPEN_CHECK_ONLY = {YELP, TRIPADVISOR, OPENTABLE, GOOGLE, GOOGLEMAPS}` (count as 0) and
`ELITE_SOLO = {MICHELIN, MICHELIN_BIB, MICHELIN_STAR, MICHELIN_GREEN, JAMESBEARD, NPS}` (lone authority
is sufficient). The five: `research.js`, `tools/sourcecheck.py`, `tools/geocode-status.py`, every
`tools/build-<city>.py` GATE 1, and `guidekit/schemas.py`.

### `tools/sourcecheck.py` — standalone sourcing gate (Python)
The multiple-sources-of-truth gate as a standalone script (mirror of `--sourcecheck`).

```
python3 tools/sourcecheck.py data/<city>.dataset.json [--list]
```
- **Reads:** the dataset's `P` + `F`, each record's `s` (source list `[[KEY, note], ...]`).
- **Writes:** a re-sourcing worklist. **Known quirk:** the worklist path is hardcoded to
  `data/silicon-valley-research/_needs_sources.json` regardless of which dataset you check, and only if
  that directory exists — so on non-SV cities it either writes there or silently skips. The **PASS/FAIL
  exit code and report are always correct for the dataset you pass**; only the side-file is misnamed.
  (Left as-is under the "don't change tool behaviour" rule; documented here so nobody trusts that
  side-file's name.)
- **Exit:** 0 PASS / 1 FAIL.

### `tools/geocode-status.py` — cross-city geocode ledger (Python)
Scans `data/geocodes.json` + every dataset and (re)writes [`docs/GEOCODE-BACKLOG.md`](GEOCODE-BACKLOG.md).

```
python3 tools/geocode-status.py            # print + rewrite docs/GEOCODE-BACKLOG.md
python3 tools/geocode-status.py --print    # print only, don't write
```
Per city it reports: verified pins by confidence (high/med/low/ungraded), `UNVERIFIED` pins (held by
the gate), `low`-confidence pins to re-verify, and — for dataset-built cities — ship-worthy places not
yet geocoded at all. Run it after **every** geocode wave. `DATASETS` here must list every
dataset-built city (parallel to `research.js`'s `DATASET_FOR`).

### `tools/build-<city>.py` — dataset → page (Python)
One per dataset-built city (`build-cincinnati`, `-columbus`, `-dayton`, `-newyork`, `-sanfrancisco`,
`-siliconvalley`; `-pittsburgh` and `-youngstown` are the older inline-data builders). Clones
`cleveland.html` and splices in the city's data. Run from the repo root:

```
python3 tools/build-cincinnati.py     # writes cities/cincinnati.html
```
Four things every dataset builder does, in order:
1. **GATE 1 — sourcing.** Drops-and-logs any place with <2 credible sources (Yelp=0; lone
   Michelin/JB/NPS ok). Mirror of `sourcecheck.py`.
2. **GATE 2 — geocode.** Drops-and-logs any place lacking a sourced, non-`UNVERIFIED` pin in
   `data/geocodes.json`; then **injects** the verified lat/lng into the records and **asserts** none is
   missing (the build hard-fails otherwise).
3. **Derived map geography.** Computes the initial `setView` centre from the **median** of the city's
   pins and one on-map `LABELS` entry per area at its pin **centroid** — never hardcoded — so a build
   cloned from another city cannot land on the wrong map. (`--buildcheck` guards against regressions.)
4. **JSON-quoted source keys + record emit.** Every record is emitted as a JS literal; source pairs are
   `[json.dumps(KEY), json.dumps(note)]` so keys/notes are safely quoted. Prose (title, eyebrow, H1,
   standfirst, meta, placeholders, footer, cuisine appendix) is the only per-city hand-written text.
   The builder also asserts "Cleveland" did not leak into the data block and that each area keeps ≥1
   tier-1 must-see.

> **Do not hardcode a map centre.** The whole point of the derived centre/labels is that a forgotten
> coordinate swap fails `--buildcheck` instead of shipping (SF once shipped centred on San Jose).

### `tools/validate.js` — data integrity (Node) — **reads `cleveland.html`**
```
cd tools && node validate.js        # or: npm run validate
```
Checks structure (P/F/AREAS/CUISINES parse and are non-empty), per-record fields (name, address,
numeric coords, tier ∈ {1,2,3}, known area, ≥1 source with a known key, food cuisine tags known,
description length), the Cleveland bounding box, **no duplicate names across P and F**, numbered-source
coverage (**News 5 all 100, There She Goes all 23**), ≥1 tier-1 per area, and **no `document.write`**.
Exit 1 on any problem.

### `tools/test.js` — behaviour, with and without the CDN (Node) — **reads `cleveland.html`**
```
cd tools && npm install && npm test     # → node test.js
```
Boots the real page in **jsdom** with the real **Leaflet** under two scenarios — **Leaflet available**
(map, ≥50 markers, base layers) and **Leaflet blocked** (page renders, map degrades to a notice) — plus
interaction, exports/persistence, and a "no JS errors" assertion. Scenario 2 is the exact CDN-blocked
failure the guide is built to survive; **do not weaken it**. Exit 1 on any failure.

### `tools/geocode-helper.html` — browser place-pin geocoder
A self-contained page opened in a browser to resolve the **exact place pin** (`!3d!4d`) for
restaurants/POIs that `WebSearch` cannot surface here (direct fetches are blocked in this sandbox). It
reaches the map servers the sandbox cannot; its output feeds the geo-merge scripts below. It is the
queue-clearing tool for `UNVERIFIED` pins listed in [GEOCODE-BACKLOG.md](GEOCODE-BACKLOG.md).

### `data/<city>-research/consolidate.py` — research JSON → dataset (Python)
Per city. Merges every research `*.json` in the dir (sights files = `{sights, food, sources}` objects;
food files = bare JSON lists) into one normalized `data/<city>.dataset.json`. It: defines `AREAS`/`AC`
(marker colours), `CUISINES` + a dish→cuisine `CMAP`, sight `CATS` + keyword→collection rules;
canonicalizes source-key aliases; de-dupes by name; and emits `P`/`F` plus the `S`/`FS` source-label
tables. Run it from the repo root or the dir:

```
python3 data/dayton-research/consolidate.py    # writes day_dataset.json (+ a worklist) in that dir
```
(Each city names its output slightly differently, e.g. `day_dataset.json`; the maintained dataset the
gates read is `data/<city>.dataset.json`.)

### `data/<city>-research/geo/_merge_geo.py` (+ `_merge_resourced.py`) — merge helper output
Merge scripts that fold geocode-helper / re-sourcing agent output (`_geoout_*.json`, `_resourced_*.json`)
back into the central registries. `_merge_geo.py` writes each pin into `data/geocodes.json` under the
city key in the exact registry schema; **null/UNVERIFIED coordinates are recorded with `source:
"UNVERIFIED"`** so the build's GATE 2 drops them (never a pin from memory). `_merge_resourced.py` folds
corroborating sources back into the research JSON so `sourcecheck` can re-pass. These are per-wave
worklist scripts, not long-lived tools.

---

## 3. Where each rule is enforced (build-time vs CLI)

| Rule | Build-time (`build-<city>.py`) | CLI gate | Also in |
|---|---|---|---|
| ≥2 credible sources (Yelp=0; lone Michelin/JB/NPS) | GATE 1 drops-and-logs | `--sourcecheck` / `sourcecheck.py` | `geocode-status.py`, `schemas.passes_sourcing` |
| Every pin fact-checked + sourced | GATE 2 drops-and-logs + injects + asserts | `--geocheck` | `geocode-status.py` |
| Open/closed sourced & consistent | (status flows from registry) | `--statuscheck` | — |
| Map centre/labels match the city | derived from pins (not hardcoded) | `--buildcheck` | — |
| cleveland.html data integrity | — | `validate.js` | — |
| Renders with the CDN blocked | — | `test.js` | CLAUDE.md rule 4 |

A published dataset-built page **provably cannot** contain an under-sourced or un-located place: the two
that would are dropped at build, and the four CLI gates re-check the result.

---

## 4. Runbook — run the whole pipeline for a city

Using `<city>` = dataset-built city (e.g. `dayton`), `<key>` = its research.js key (e.g. `dayton-oh`).

```bash
# one-time
cd tools && npm install && cd ..

# 0-2. RESEARCH (agent/LLM + web search) — see PIPELINE.md stages 0-2, SOURCES.md for the rules.
node tools/research.js "Dayton" "OH"                 # print the discovery plan (Mode A)
#   → run the searches, vet sources, extract the places they name,
#     drop research JSON into data/dayton-research/*.json, append to AUDIT.md each wave.

# 3-5. FACT-CHECK → RE-RANK → LOCATION-VERIFY  (append to AUDIT.md)
#   record {status,statusSource,statusChecked} and {address,lat,lng,source,confidence,verified}
#   into data/geocodes.json (place pin !3d!4d, never a /@ viewport). Use tools/geocode-helper.html
#   for restaurant pins WebSearch can't resolve, then data/dayton-research/geo/_merge_geo.py.

# 6. CONSOLIDATE → BUILD
python3 data/dayton-research/consolidate.py          # research JSON → dataset
#   (copy/confirm the maintained dataset at data/dayton.dataset.json)
python3 tools/build-dayton.py                        # dataset → cities/dayton.html (GATE 1 + GATE 2)

# 6. GATE (all must pass)
node tools/research.js --sourcecheck dayton-oh
node tools/research.js --geocheck    dayton-oh
node tools/research.js --statuscheck dayton-oh
node tools/research.js --buildcheck  dayton-oh
python3 tools/sourcecheck.py data/dayton.dataset.json
python3 tools/geocode-status.py                      # refresh docs/GEOCODE-BACKLOG.md
cd tools && npm run validate && npm test && cd ..    # cleveland.html integrity + no-CDN behaviour

# 6. RENDER-VERIFY: open cities/dayton.html, confirm Leaflet mounts, markers present, 0 JS errors.
```

For an **existing** city refresh: `node tools/research.js --refresh <key>` and re-run stages 3
(status) and 5 (location), then re-gate. For a **new** city, also do the registration steps in
[CITIES.md](CITIES.md) ("Adding a new city") — register the key in `research.js` (`PAGE_FOR` +
`DATASET_FOR`), `geocode-status.py` (`DATASETS`), and `guidekit/pipeline.py` (`CITY_MAP`).

---

## 5. Runbook — run it with a local LLM via guidekit (no Claude)

`guidekit/` wraps the pipeline so a **local open-source model** replaces Claude and open tools replace
hosted search/geocode. It **never modifies** the tools above — it drives them via `subprocess`. See
[`guidekit/CAPABILITY-MAP.md`](../guidekit/CAPABILITY-MAP.md) for the full capability→library table.

```bash
# 0. deps for the fully-offline OSS stack (install only what you use)
pip install ollama ddgs geopy            # + pydantic for hard schema validation (optional)
ollama pull llama3.1                      # or any local model

# 1. prove the wiring + the REAL gate end-to-end (deterministic stubs; no network/model needed)
python3 guidekit/examples/run_discovery.py --offline
#   → fans out discovery workers, normalizes to the dataset shape, and runs the UNCHANGED
#     tools/sourcecheck.py, which correctly FAILS the intentional Yelp-only demo place.

# 2. run it against the real local backends (auto-falls-back to stubs if a backend is missing)
python3 guidekit/examples/run_discovery.py            # auto
python3 guidekit/examples/run_discovery.py --live     # require the real backends

# 3. drive the repo's deterministic gates from Python (they run byte-for-byte unchanged)
python3 - <<'PY'
from guidekit import Pipeline
pipe = Pipeline()
print(pipe.sourcecheck("data/cincinnati.dataset.json"))     # tools/sourcecheck.py
print(pipe.gate("buildcheck", "cincinnati-oh"))             # node tools/research.js --buildcheck
# pipe.consolidate("dayton-oh"); pipe.build("dayton-oh"); pipe.gate_stack("dayton-oh")
PY
```

Swap providers with env vars (see [§7](#7-replicability-checklist)); e.g. `GUIDEKIT_LLM=ollama:llama3.1`,
`GUIDEKIT_SEARCH=searxng SEARXNG_URL=…`, or `GUIDEKIT_LLM=claude:claude-opus-4-8` for hosted parity.

**guidekit unit tests** (offline; no network, no Ollama, no keys):
```bash
python3 -m unittest discover -s guidekit/tests -v     # 42 tests
```

---

## 6. guidekit module map

| Module | Capability | Open-source default | Swap-in |
|---|---|---|---|
| `llm.py` | LLM that discovers places & emits JSON | Ollama (`LocalBackend`) | llama.cpp, vLLM/TGI via LiteLLM, transformers; `ClaudeBackend` for parity |
| `search.py` | Web search (Stage 1/2) | DuckDuckGo (`DDGSSearchBackend`) | SearXNG (self-host), Tavily, `HostedSearchBackend` (wrap WebSearch/Brave/Serper) |
| `geocode.py` | Geocode to the exact place pin | Nominatim/OSM (`NominatimGeocoder`) | Photon, Pelias, any Places API (same ABC) |
| `orchestrator.py` | Sub-agent fan-out (waves) | stdlib `concurrent.futures`, concurrency-capped | LangChain/CrewAI/AutoGen map onto the `Worker` shape |
| `pipeline.py` | The deterministic gates | **the repo's own scripts, unchanged** (shelled out) | n/a |
| `config.py` | Provider selection | `tomllib` + env vars; args > env > toml > OSS defaults | — |
| `schemas.py` | Data contracts + gate preview | pydantic (degrades to dataclasses) | — |

`geocode.py` enforces CLAUDE.md rule 4a/4b: it **rejects** administrative/boundary/viewport matches and
**grades** each kept pin `high`/`med`/`low` from the OSM `class`/`addresstype`/house-number — the
open-source equivalent of reading Google's `!3d!4d` place pin.

---

## 7. Replicability checklist

**Must be installed** (only what you use):
- Node ≥16 + `cd tools && npm install` (jsdom, leaflet) — required for `research.js` gates, `validate.js`, `test.js`.
- Python ≥3.9 (≥3.11 for stdlib `tomllib`, else `pip install tomli`) — required for `*.py` tools + guidekit.
- guidekit OSS stack (optional): `pip install ollama ddgs geopy` (+ `pydantic`), and a local model via `ollama pull …`.
- A browser for `tools/geocode-helper.html`.

**Environment variables** (all optional; **nothing is required**, defaults are fully open-source):

| Var | Purpose | Default |
|---|---|---|
| `GUIDEKIT_LLM` | `<backend>:<model>` — `ollama:llama3.1`, `litellm:ollama/llama3.1`, `llamacpp:/path.gguf`, `transformers:Org/Model`, `claude:claude-opus-4-8` | `ollama:llama3.1` |
| `GUIDEKIT_SEARCH` | `ddgs` \| `searxng` \| `tavily` \| `hosted` | `ddgs` |
| `GUIDEKIT_GEOCODE` | `nominatim` (photon/pelias documented) | `nominatim` |
| `OLLAMA_HOST` | Ollama server URL | client default |
| `ANTHROPIC_API_KEY` | `ClaudeBackend` only (parity) | unset (SDK env) |
| `TAVILY_API_KEY` | Tavily search only | unset |
| `SEARXNG_URL` | SearXNG instance `.../search` | unset |
| `GUIDEKIT_GEOCODE_USER_AGENT` / `GUIDEKIT_GEOCODE_URL` | OSM policy UA / self-hosted Nominatim | packaged UA / public endpoint |
| `RESEARCH_YEAR` | override the year in `research.js` search queries | current year |

**No secrets are hardcoded anywhere.** Every key is read from an env var or an option bag and defaults
to `None`/unset (verified across `tools/` and `guidekit/`). `guidekit.toml` ships only non-secret
defaults and commented placeholders. Do not commit keys; pass them via env.

**Swap Claude for a local model:** set `GUIDEKIT_LLM=ollama:llama3.1` (or any transport above) — that is
the only change; search and geocode already default to OSS. To keep using a hosted search tool
(e.g. the operator's WebSearch) behind the OSS wiring, use `GUIDEKIT_SEARCH=hosted` and supply a
`call(query, max_results)` hook to `HostedSearchBackend`. The deterministic gates are identical either
way — guidekit only *invokes* them.

**OSS library map** (capability → library): LLM → Ollama / llama.cpp / vLLM / Transformers via LiteLLM;
search → DuckDuckGo (`ddgs`) / SearXNG / Tavily; geocode → Nominatim/OSM via `geopy` (Photon, Pelias);
orchestration → stdlib `concurrent.futures` (or LangChain/CrewAI/AutoGen); gates → the repo's own
scripts, unchanged. Full detail and maturity notes in
[`guidekit/CAPABILITY-MAP.md`](../guidekit/CAPABILITY-MAP.md).

---

## 8. Audit-trail status

Per [PIPELINE.md](PIPELINE.md), each `data/<city>-research/` should carry `AUDIT.md` (append-only stage
ledger), `RESUME.md`, `_AGENT_BRIEF.md`, and `consolidate.py`. Status as of 2026-08-18 (re-derive with
`ls data/*-research/`):

| City / dir | AUDIT.md | RESUME.md | _AGENT_BRIEF.md | consolidate.py | Notes |
|---|---|---|---|---|---|
| `cincinnati-research` | ✅ | ✅ | ✅ | ✅ | complete |
| `columbus-research` | ✅ | ✅ | ✅ | ✅ | complete |
| `dayton-research` | ✅ | ✅ | ✅ | ✅ | complete |
| `san-francisco-research` | ✅ | ✅ | ✅ | ✅ | complete |
| `silicon-valley-research` | ✅ | ✅ | ✅ | ✅ | complete |
| `newyork-research` | ❌ | ❌ | ❌ | ✅ | **gap:** dataset + research JSON + `consolidate.py` present, but no `AUDIT.md`/`RESUME.md`/`_AGENT_BRIEF.md` ledger. |
| `pittsburgh-research` | ❌ | ❌ | ❌ | ❌ | inline build (`build-pittsburgh.py`); only `classics/mined/seeds.json`. Predates the audit-trail contract. |
| `cleveland-research` | ❌ | ❌ | ❌ | ❌ | the engine itself (inline data in `cleveland.html`); only two food-seed JSONs. Predates the contract. |

The three ❌ rows are the **oldest** builds (Cleveland is the hand-authored engine; Pittsburgh/NYC came
before the ledger was standardized). Their pages are live and pass the gates; what's missing is the
**prose ledger**, not the data. This table is a status note, **not a fix** — the task scope forbids
editing `data/`. Bringing NYC up to contract would mean back-filling `AUDIT.md`/`RESUME.md`/`_AGENT_BRIEF.md`
from its existing research JSONs; Cleveland/Pittsburgh would need a retrospective ledger reconstruction.

---

## 9. Bugs fixed (guidekit only; tools left unchanged per scope)

- **`guidekit/llm.py` — LiteLLM model id kept the `litellm:` prefix.** `from_config("litellm:ollama/llama3.1")`
  produced `model="litellm:ollama/llama3.1"` (an invalid provider id LiteLLM would reject) instead of
  `"ollama/llama3.1"`. Root cause: the factory used `spec` (the full `GUIDEKIT_LLM` string) where it
  meant the part after the prefix. Fixed to use `model`. Regression test:
  `test_from_config_litellm_keeps_provider_qualified_model`.
- **`guidekit/schemas.py` — `ELITE_SOLO` was missing `NPS`.** The in-process sourcing preview
  (`passes_sourcing`) would wrongly fail a lone-NPS place (e.g. Alcatraz, Golden Gate NRA) that the real
  gate (`tools/sourcecheck.py`, `research.js`, `geocode-status.py`, every `build-*.py`) **passes** — so a
  discovery worker's self-filter could drop a place the gate keeps. Added `NPS` to match the five
  authoritative definitions. Regression tests: `test_lone_nps_passes`,
  `test_elite_solo_matches_real_gate` (asserts the set equals `sourcecheck.py`'s).

**Documented-not-fixed** (scope: no behaviour change to `tools/*.py`):
`tools/sourcecheck.py` hardcodes its re-sourcing worklist side-file to
`data/silicon-valley-research/_needs_sources.json` for any dataset. The gate's PASS/FAIL result is always
correct; only that side-file's name/location is wrong. See §2.

---

## 10. Tests added

`guidekit/tests/` (run: `python3 -m unittest discover -s guidekit/tests`) — 42 offline tests, no
network / Ollama / API keys:
- **config** — OSS defaults; args > env > toml precedence; env→option-bag overlay; lazy provider wiring.
- **llm** — `extract_json` (fences, bare object/array, braces-in-strings, garbage→None); `from_config`
  routing (Claude vs local transports; the LiteLLM prefix regression).
- **schemas** — the sourcing preview (≥2 credible, lone Michelin/JB/NPS, Yelp=0, one-credible-plus-Yelp
  fails); schema shapes; parity with the real gate's `ELITE_SOLO`.
- **search** — `search_many` URL de-dup; `HostedSearchBackend` raises without a hook / maps rows with one;
  `from_config` default + searxng-needs-URL error.
- **geocode** — Nominatim place-pin grading via a fake result: POI/house-number→high, road→med,
  boundary/city→rejected; registry-entry shape.
- **orchestrator** — worker sourcing self-filter; sequential + concurrent order preservation; `merge_places`
  de-dup; per-worker error capture (one failure ≠ wave failure).
- **pipeline** — `repo_root` locates `tools/research.js`; `CITY_MAP`/`VALID_GATES`; invalid-gate and
  unknown-city errors; and one test that drives the **real** `tools/sourcecheck.py` through the wrapper on
  a temp dataset (no network) and asserts it flags a Yelp-only place.
