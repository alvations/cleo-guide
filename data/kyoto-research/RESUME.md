# Kyoto (京都) — RESUME checkpoint (read first)

Map: `cities/kyoto.html` · dataset `data/kyoto.dataset.json` · key `kyoto` · built by `tools/build-kyoto.py`
(thin wrapper over `tools/japan_build.py`; consolidated by `consolidate.py` → `tools/japan_consolidate.py`).
Standing briefs: `data/japan-research/_AGENT_BRIEF.md` (shared Japan rules) + `_AGENT_BRIEF.md` here.

## Density targets (iterate until met — do NOT compromise; benchmark = NYC ~500)
Measured by `python3 tools/density.py kyoto` on the DISCOVERED set. Total ≈ 485.
- `HGS` Higashiyama-ku (Gion · Kiyomizu-dera · Sannenzaka · Kennin-ji · Yasaka · Tōfuku-ji) — target ~75
- `SAKYO` Sakyō-ku (Ginkaku-ji · Philosopher's Path · Nanzen-ji · Okazaki · Demachiyanagi · Shimogamo) — target ~60
- `CTR` Central — Nakagyō & Shimogyō (Nishiki · Pontochō · Kawaramachi · Karasuma · Nijō Castle · Kyoto Station) — target ~95
- `KITA` Kita & Kamigyō (Kinkaku-ji · Daitoku-ji · Imperial Palace · Nishijin · Kamigamo) — target ~50
- `RKSAI` Rakusai — Ukyō & Nishikyō (Arashiyama · Sagano · Ryōan-ji · Katsura · Koke-dera) — target ~55
- `FSHMI` Fushimi & Minami (Fushimi Inari · Tō-ji · Fushimi sake district · Daigo-ji) — target ~45
- `RKHKU` Rakuhoku mountains (Ōhara · Kurama · Kibune · Takao · Miyama) — target ~30
- `UJI` Uji & Nara (Byōdō-in · Uji tea · Tōdai-ji · Kasuga Taisha · Nara Park) — target ~50
- `KYFU` Kyoto Prefecture & Lake Biwa (Amanohashidate · Ine no Funaya · Kameoka · Ōtsu · Hiei-zan) — target ~25

## Regioning
Kyoto city's 11 **wards (-ku)** grouped as locals do (Rakuchū centre, Rakutō east, Rakusai west, Rakuhoku north, Rakunan south), plus Uji/Nara and the wider prefecture as the day-trip ring.

## State
- 2026-10-02 scaffolded (areas, taxonomy, wrappers, registry keys).
- 2026-10-02 W1 partial (12 places) — halted at the shared 200-search cap (see AUDIT).
- 2026-10-02 **W2 (relaunch, own budget)** — in progress. ~130 discovered (101 sights + 29 food). First build GREEN:
  `cities/kyoto.html` 88 pins, sourcecheck/geocheck/statuscheck/buildcheck PASS (not yet linked live).
  Files: SIGHTS_KYOTO_{HGS1,HGS2,UNESCO,CTR1,SAKYO1,RKSAI1,KITA1,FSHMI1,UJI1,RKHKU1,KYFU1}.json,
  FOOD_KYOTO_{HGS1,W2}.json, SOURCES_KYOTO_{W1,W2}.json, geo/_geoout_kyoto_*.json.
  Helpers: `_kyoto_add.py` (append/dedup), `_kyoto_rows.py` (sight rows → SIGHTS + geoout), `_kyoto_food.py`
  (food rows → FOOD + UNVERIFIED geoout).
- Search budget: 86 used this session (counted in AUDIT per batch).

## In-flight wave
- W2 continues: sights fill per area (Wikipedia-coordinate batches of ≤6 names that surely have enwiki articles + a
  japan-guide / kyoto.travel domain-filtered second-source query), then Michelin food by ward+genre.
  Held single-source leads with coords are listed in AUDIT batch 2/4 — corroborate first (cheap wins).

## Next actions
1. Discovery waves per area (canon first) → `python3 tools/density.py kyoto` → iterate on every `NEED +N`.
2. Geocode waves → `geo/_geoout_kyoto_*.json` → `python3 tools/rebuild-city.py kyoto --build` (under the shared lock).
3. Re-verify pin placement (CLAUDE.md 4b) + closure pass (4c) until statuscheck reports zero unchecked.

## Acceptance
- [ ] every area ≥ target · [ ] sourcecheck PASS · [ ] geocheck PASS · [ ] statuscheck CONSISTENT, 0 unchecked
- [ ] buildcheck PASS · [ ] `npm run validate && npm test` green · [ ] Japan hub card live · [ ] CITIES.md row
