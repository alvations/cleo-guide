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

## In-flight wave
- **W4 (2026-10-02, relaunch, own budget)** — food-first fill of NEED areas: SAKYO +26, RKSAI +19, FSHMI +18, RKHKU +13,
  HGS +12, KITA +12, KYFU +7, UJI +6, CTR +2. Files: FOOD_KYOTO_W6.json, SIGHTS_KYOTO_W4S.json, SOURCES_KYOTO_W4.json,
  CREATORS_KYOTO_W4.json, geo/_geoout_kyoto_w6.json. Searches counted in `_kyoto_w4_searchlog.txt`.

## Next wave plan (W4) — ordered, cheapest proven techniques first
1. **Michelin pins + new names (best yield: ~3 pinned/search):** allowed_domains guide.michelin.com, "<A>; <B>; <C>; <D> Kyoto MICHELIN
   cuisine address latitude longitude" — the search tool fans out sub-queries and returns venue lat/lng. Unadded names seen:
   YOKOI ★ (pin 34.99764,135.76235 known; no dish), TAKAYAMA ★ (Italian), Wagokoro Izumi ★, Tokuo, Kappo Takohachi, ristorante DONO,
   en, Shichiku Kiko, Hirosawa (creative Chinese), Asperge Blanche (Bib), L'aparté, Kiyamachi Ran, Gion Kajisho, middle, Nakazen
   (pin 35.02874,135.79052), Shimogamo Saryo (pin 35.034174,135.773982) — each still needs a NAMED dish from Michelin text (else hold).
2. **Inside Kyoto category lists × Leaf/KT/Time Out pairing** (≈1–1.5 places/search): IK pages not yet mined — best kissaten,
   best cafés, best tea & sweet shops (Kasagiya, Umezono), best affordable sushi (Azuma Sushi, Sushisei, Den Shichi), cheap eats,
   best soba/udon (Yamamoto Menzou), restaurants near Ginkaku-ji / Fushimi Inari (Nezameya), best shōjin (Yoshūji). Pair with
   ja.kyoto.travel (京都観光Navi) listings or Leaf store pages.
3. **Held single-source leads** (see AUDIT W3 'HELD'): Smart Coffee, Tenkaippin Sōhonten, Tentenyu Honten, Bee's Knees, Kyoto Beer
   Lab, BEFORE9, Nishijin Beer, Akagakiya, Gion Tokuya, Umezono, Yoshūji, Nezameya, Imobō Hiranoya Honke (KT), Nishiri (KT),
   Ugenta / Hyōe (Kibune, Leaf), Momiji-ya (Takao, KT), Honke Tsuruki Soba (Ōtsu, Biwako Visitors), Restaurant Funaya (Ine).
4. **Sights fill** in SAKYO/RKSAI/FSHMI/RKHKU via ja.wikipedia 座標 batches (6 names → 6 coords per search) + one JG/KT/LP query for
   the 2nd source. Held: Hōkyō-in, Akishino-dera, Hokke-ji, Kameoka (Yunohana onsen), Amanohashidate View Land, Takiguchi-dera.
5. **ANIME:** Pokémon Center Kyoto (SUINA Muromachi 2F since 2019) and Nintendo KYOTO (Takashimaya S.C. T8) need one credible
   outlet beyond the official pages; Daikichiyama deck (Euphonium) needs ja.wikipedia URL + 仏徳山 coords; Animate Kyoto (Avanti).
6. **Pins:** 66 UNVERIFIED (mostly non-Michelin food) — `tools/geocode-helper.html` in a browser, or a Google `!3d!4d` pass.
7. Re-verify flagged pins: Torisaki / shiro / Muromachi Yui (~30 m apart, Takoyakushi block).
Commands: `python3 tools/density.py kyoto`; `flock -w 3600 .git/cleo-shared.lock python3 tools/rebuild-city.py kyoto --build`;
`node tools/research.js --{sourcecheck,geocheck,statuscheck,buildcheck} kyoto`; `cd tools && npm run validate && npm test`;
push via `flock … bash data/kyoto-research/_kyoto_push.sh`. Refresh CARD:kyoto counts + the CITIES.md row after each build.

## Acceptance
- [ ] every area ≥ target · [x] sourcecheck PASS · [x] geocheck PASS · [x] statuscheck CONSISTENT, 0 unchecked
- [x] buildcheck PASS · [x] `npm run validate && npm test` green · [x] Japan hub card live · [x] CITIES.md row
