# Tokyo (東京) — RESUME checkpoint (read first)

Map: `cities/tokyo.html` · dataset `data/tokyo.dataset.json` · key `tokyo` · built by `tools/build-tokyo.py`
(thin wrapper over `tools/japan_build.py`; consolidated by `consolidate.py` → `tools/japan_consolidate.py`).
Standing briefs: `data/japan-research/_AGENT_BRIEF.md` (shared Japan rules) + `_AGENT_BRIEF.md` here.

## Density targets (iterate until met — do NOT compromise; benchmark = NYC ~500)
Measured by `python3 tools/density.py tokyo` on the DISCOVERED set. Total ≈ 530.
- `CYD` Chiyoda-ku (Imperial Palace · Marunouchi · Akihabara · Kanda · Jimbōchō) — target ~45
- `CHUO` Chūō-ku (Ginza · Nihonbashi · Tsukiji · Tsukishima · Ningyōchō) — target ~50
- `MNT` Minato-ku (Roppongi · Azabu-Jūban · Akasaka · Shimbashi · Shiba · Odaiba) — target ~50
- `SJK` Shinjuku-ku (Kabukichō · Golden Gai · Omoide Yokochō · Shinjuku Gyoen · Kagurazaka · Shin-Ōkubo) — target ~50
- `SBY` Shibuya-ku (Shibuya · Harajuku · Omotesandō · Ebisu · Yoyogi · Daikanyama) — target ~50
- `TAITO` Taitō-ku (Asakusa · Ueno · Yanaka · Kappabashi · Okachimachi) — target ~50
- `SMKT` Sumida-ku & Kōtō-ku (Skytree · Ryōgoku · Kiyosumi-Shirakawa · Monzen-Nakachō · Toyosu) — target ~40
- `JONAN` Jōnan — Shinagawa · Meguro · Ōta (Nakameguro · Togoshi-Ginza · Kamata · Haneda) — target ~35
- `JOSAI` Jōsai — Setagaya · Nakano · Suginami (Shimokitazawa · Sangenjaya · Gōtokuji · Nakano Broadway · Kōenji · Ogikubo) — target ~40
- `JHOKU` Jōhoku — Toshima · Bunkyō · Kita · Arakawa · Itabashi · Nerima (Ikebukuro · Sugamo · Nezu · Akabane · Nippori) — target ~35
- `JOTO` Jōtō — Katsushika · Edogawa · Adachi (Shibamata · Kameari · Kita-Senju · Kasai) — target ~20
- `TAMA` Tama area (Kichijōji · Mitaka & Ghibli · Takao-san · Okutama · Hachiōji · Chōfu) — target ~30
- `KANTO` Kantō day trips (Yokohama · Kamakura · Hakone · Nikkō · Kawagoe · Fuji Five Lakes) — target ~35

## Regioning
Tokyo's 23 **special wards (tokubetsu-ku, 特別区)** are the borough-equivalent. The densest wards are their own areas (Chiyoda, Chūō, Minato, Shinjuku, Shibuya, Taitō, Sumida+Kōtō); the rest are grouped by the long-standing Tokyo compass terms **Jōnan (城南, south), Jōsai (城西, west), Jōhoku (城北, north) and Jōtō (城東, east)**; beyond the wards is the **Tama area (多摩地域)** of the Metropolis, and the Kantō day-trip ring (NYC's 'Day Trips' equivalent). Assign each place by its actual ward (the address names the -ku).

## State
- 2026-10-02 scaffolded (areas, taxonomy, wrappers, registry keys).
- 2026-10-02 W1 batch 1: 9 CYD sights in `SIGHTS_TOKYO_W1.json`, all 9 geocoded (7 high / 2 med district points) in
  `geo/_geoout_tokyo_w1.json`. Not yet merged/built (page not built; Japan NOT flipped live — far below density).
  Append helper: `_add.py` (stdin JSON → discovery record + geoout record, dedup by name).

## In-flight wave
**W2 (relaunch 2026-10-02, own ~200-search budget)** — food canon (Michelin Bib/star lists, Tabelog Hyakumeiten,
Time Out/Eater lists) in CHUO/TAITO/SJK/SBY/MNT, then sights backbone per area via batched Wikipedia-coords queries.
Files: `FOOD_TOKYO_W2.json`, `SIGHTS_TOKYO_W2.json`, `geo/_geoout_tokyo_w2.json`, `CREATORS_TOKYO_W2.json` (via `_add.py`).
Search count this run: 40 (after batch 12; see AUDIT for the per-batch log). Discovered 63 (58 rendered, 5 UNVERIFIED). Per area: CHUO 5 · CYD 10 · JHOKU 4 · JONAN 4 · JOSAI 2 · JOTO 0 · KANTO 0 · MNT 7 · SBY 5 · SJK 9 · SMKT 4 · TAITO 13 · TAMA 0.
Held sights: `_pending_w2.json`. Methods: see AUDIT W2 section (3-name Michelin pin queries; 4-name Wikipedia coord queries + one japan-guide corroboration query).

## Next actions
1. Discovery waves per area (canon first) → `python3 tools/density.py tokyo` → iterate on every `NEED +N`.
2. Geocode waves → `geo/_geoout_tokyo_*.json` → `python3 tools/rebuild-city.py tokyo --build` (under the shared lock).
3. Re-verify pin placement (CLAUDE.md 4b) + closure pass (4c) until statuscheck reports zero unchecked.

## Acceptance
- [ ] every area ≥ target · [ ] sourcecheck PASS · [ ] geocheck PASS · [ ] statuscheck CONSISTENT, 0 unchecked
- [ ] buildcheck PASS · [ ] `npm run validate && npm test` green · [ ] Japan hub card live · [ ] CITIES.md row
