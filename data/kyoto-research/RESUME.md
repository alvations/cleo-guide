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
- 2026-10-02 scaffolded; W1 partial (12 places) halted at the shared 200-search cap.
- 2026-10-02 W2 (relaunch) — LIVE at 229 discovered / 216 rendered.
- 2026-10-02 **W3 (relaunch, own budget) — FOOD & DRINK FIRST + ANIME.** Last full build: **370 discovered (183 sights + 187 food
  = 51% food) / 301 rendered (178 + 123)**; sourcecheck / geocheck (high 282 · med 19) / statuscheck / buildcheck PASS;
  `npm run validate` + `npm test` ALL PASS. CARD:kyoto + docs/CITIES.md refreshed. ★ Anime collection: 7 places.
- Discovered per area (target): CTR 93 (95) · HGS 63 (75) · UJI 44 (50) · RKSAI 36 (55) · KITA 38 (50) · SAKYO 34 (60) ·
  FSHMI 27 (45) · KYFU 18 (25) · RKHKU 17 (30). Run `python3 tools/density.py kyoto` for live numbers.
- W3 files: FOOD_KYOTO_W5.json (66 non-Michelin + a few Michelin food & drink), FOOD_KYOTO_MICH5.json (43 Michelin, worker),
  SIGHTS_KYOTO_W3S.json (22 sights), SIGHTS_KYOTO_ANIME1.json (3), SOURCES_KYOTO_W3.json, CREATORS_KYOTO_W3.json,
  geo/_geoout_kyoto_{food_w5,mich5,w3s,anime1}.json, geo/_repin_kyoto_w3.json (72 pins applied by name), notes
  _note_anime1.md / _note_mich5.md / _note_repin_w3.md, lead ledger _kyoto_w3_leads.json, _kyoto_unpinned_w3.json.
- Searches used this session: main ~101 + workers 92 (anime 22, Michelin 40, pins 30) ≈ 193.

- 2026-10-02 **W4 (relaunch, own budget) — food-first fill + pins.** FINAL build: **494 discovered (222 sights + 272 food = 55%) / 339 rendered
  (211 + 128)**; all four gates PASS (high 306 · med 33); `npm run validate` + `npm test` ALL PASS; ★ Anime 9; CARD:kyoto, CITIES.md and the AGENT-PROMPTS run log are refreshed.
  Discovered/target: CTR 96/95 · HGS 75/75 · SAKYO 62/60 · KITA 51/50 · RKSAI 55/55 · UJI 52/50 · FSHMI 46/45 · RKHKU 30/30 · KYFU 27/25 — **all OK**.
  Food share: CTR 76 · HGS 71 · RKHKU 50 · KITA 49 · SAKYO 48 · RKSAI 45 · UJI 44 · KYFU 44 · FSHMI 35 (%).
  Searches this session: main ~98 + workers 53 (sights 25, pins 28) ≈ 151.

## In-flight wave
- none (W4 closed; every batch committed and pushed). See State for counts.

## W4 outcome (2026-10-02)
- Food-first fill of every NEED area: +85 food (FOOD_KYOTO_W6.json), +14 main sights (SIGHTS_KYOTO_W4S.json), +22 worker sights
  (SIGHTS_KYOTO_W4B.json), ANIME +3 (SIGHTS_KYOTO_ANIME2.json). **Every area is at its density target** (`python3 tools/density.py kyoto`).
- Technique that worked (≈1.5 kept/search): JA queries restricted with `allowed_domains` to ja.kyoto.travel, rurubu.jp,
  mapple.net, walkerplus.com, serai.jp, intojapanwaraku.com, leafkyoto.net, kyoto-np.co.jp, keihan.co.jp, plus official DMOs
  (uminokyoto.jp, ine-kankou.jp, narashikanko.or.jp, biwako-visitors.jp, amanohashidate.jp). 3–4 shop names per query.
- Held leads: `_kyoto_w4_held.json` + AUDIT W4 'Held' list (single outlet only).

## Next wave plan (W5) — ordered
1. **Pins (biggest gap):** most W4 food is UNVERIFIED (no place pin). The run's searches surfaced no restaurant `!3d!4d`. Use
   `tools/geocode-helper.html` in a browser on `_kyoto_unpinned_w4.txt` (or the GEOCODE-BACKLOG kyoto list), then rebuild.
2. **Per-area food share (§2b ≥50%):** FSHMI (~35%), KYFU, UJI and RKSAI are still under 50%. Leads: Fushimi Seiwasō / Tsuki no
   Kurabito / Inari Saryō / Nishimura-tei (Inari-yama) / Ugetsu Chaya (Daigo) / Tōji Ohagi Tomoeya; Maizuru Shirane Shokudō, Miyama
   Kitamura (Mori-no-Kyoto); Uji Itōken Byōdō-in; Arashiyama Tsutaya / Saga Tofu Ine. Each needs a 2nd outlet (morinokyoto.jp counts).
3. HGS/SAKYO single-outlet leads: Kiritōshi Shinshindō, Gion Endō, Cafe Fugetsu, Gion Kinana, Jinbadō & Aoi-ya (Kamigamo), Kijiya, Amatō Cannes.
4. Re-verify pins: Daikichiyama (hill coord, med), Pokémon Center (building coord via Chamber of Commerce page, med).

## Acceptance
- [x] every area ≥ target (W4; per-area food ≥50% still open for FSHMI/KYFU/UJI/RKSAI/SAKYO/KITA) · [x] sourcecheck PASS · [x] geocheck PASS · [x] statuscheck CONSISTENT, 0 unchecked
- [x] buildcheck PASS · [x] `npm run validate && npm test` green · [x] Japan hub card live · [x] CITIES.md row

## 2026-10-03 P1 (pins only)
- 59 NAVITIME place pins → **398 / 494 on map**, all 4 gates + validate/test green. 96 held — see AUDIT P1 (incl. the
  Jikkokubune 休業中 status flag to re-check). Next: per-shop single-name NAVITIME queries with the full 住所 for the
  Kibune/Ōhara/Arashiyama holdouts; the geocode-helper for bars (K6, Rocking Chair, L'Escamoteur, Yoramu).
