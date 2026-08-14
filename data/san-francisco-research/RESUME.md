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
- **2026-08-14 scaffold:** `consolidate.py`, `build-sanfrancisco.py`, `sources.json` (11 SF outlets),
  `_AGENT_BRIEF.md`, geocodes entry, research.js + geocode-status.py registration, index "being built" card.
- **2026-08-14 discovery wave 1: 86 places, `--sourcecheck` PASS 86/86** (46 sights + 40 food). Files:
  FOOD_SIGNATURE(18), FOOD_ASIAN(22), SIGHTS_ICONS(18), SIGHTS_MUSEUMS_PARKS(28). Clean sourcing from
  the start (agents used the brief). See AUDIT.md Stage 2 for the ledger + closures.
- **2026-08-14 discovery wave 2 (running):** Italian/Cal-cuisine fine dining, coffee/cocktail bars/viral,
  Peninsula/SFO corridor (fills PEN + Italian/coffee/bars gaps).
- **NEXT after wave 2:** consolidate → any re-sourcing needed (should be minimal) → **geocode + status
  waves** (WebSearch place-pins for sights/landmarks work well; restaurant pins may need the browser
  helper — track in `docs/GEOCODE-BACKLOG.md`) → `build-sanfrancisco.py` → gates → render-verify →
  relink index card. Budget caps ~200/window — wave it; this file + AUDIT.md keep it resumable.

## Pipeline files
`consolidate.py` → writes `sf_dataset.json` → copy to `../sanfrancisco.dataset.json` → `build-sanfrancisco.py`
→ `cities/sanfrancisco.html`. Research files: any `*.json` in this dir (sights = object w/ sights[]/sources[];
food = array). Gate helpers: `tools/sourcecheck.py`, `research.js --sourcecheck/--geocheck/--statuscheck`.
