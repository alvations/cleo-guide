# San Francisco & Peninsula — RESUME checkpoint (read first)

Single source of truth for where the SF build is and what to do next. Resume deterministically by
reading, in order: **this file → `AUDIT.md` → `_AGENT_BRIEF.md` → the task list (#29 scaffold, #30 food,
#31 sights)**. Then `cd data/san-francisco-research && python3 consolidate.py` for the live count, and
`cp sf_dataset.json ../sanfrancisco.dataset.json`.

Region: **SF proper + northern Peninsula to San Mateo + SFO corridor.** Bridges the SV guide (which
starts ~Menlo Park/Redwood City). 9 areas — see `_AGENT_BRIEF.md`.

## Acceptance criteria (same rigor as SV & NYC)
- [ ] **NYC/SV-comparable density** across all 9 areas and every cuisine/collection — credible places only.
- [ ] **Every place fact-checked** — open/closed from a real source; closures kept-but-flagged, non-places out.
- [ ] **MULTIPLE SOURCES OF TRUTH** — `node tools/research.js --sourcecheck san-francisco-ca` = PASS
      (≥2 credible, or a lone Michelin/James Beard; Yelp = 0).
- [ ] **Every place location-verified** — sourced place-pin in `data/geocodes.json`; `--geocheck` PASS.
- [ ] **Built + gated** — `tools/build-sanfrancisco.py`; geocheck PASS · statuscheck CONSISTENT ·
      sourcecheck PASS · npm test unaffected · jsdom render-verify (markers>0, 0 JS errors, degrades w/o CDN).
- [ ] **Audit complete** in `AUDIT.md`; `index.html` card relinked & counts finalized.

## State (update every wave)
- **2026-08-14:** region scaffolded — `consolidate.py` (9 areas + SF cuisine/collection taxonomy),
  `tools/build-sanfrancisco.py`, `sources.json` entry (11 credible SF outlets), `_AGENT_BRIEF.md`,
  geocodes.json empty entry, research.js PAGE_FOR/DATASET_FOR, index.html "being built" card. **0 places.**
- **NEXT:** discovery waves — #30 signature-first food (Mission burrito, dim sum, cioppino, Tenderloin
  Vietnamese, Burmese, North Beach Italian, oysters, third-wave coffee, Peninsula dim sum) + #31 sights
  (Golden Gate, Alcatraz, cable cars, GG Park museums, Presidio, Mission murals, Peninsula/SFO). Then
  sourcing → geocode → build, exactly as SV. WebSearch budget is shared & caps ~200/window — wave it.

## Pipeline files
`consolidate.py` → writes `sf_dataset.json` → copy to `../sanfrancisco.dataset.json` → `build-sanfrancisco.py`
→ `cities/sanfrancisco.html`. Research files: any `*.json` in this dir (sights = object w/ sights[]/sources[];
food = array). Gate helpers: `tools/sourcecheck.py`, `research.js --sourcecheck/--geocheck/--statuscheck`.
