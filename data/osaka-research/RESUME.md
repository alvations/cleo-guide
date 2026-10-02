# Osaka (大阪) — RESUME checkpoint (read first)

Map: `cities/osaka.html` · dataset `data/osaka.dataset.json` · key `osaka` · built by `tools/build-osaka.py`
(thin wrapper over `tools/japan_build.py`; consolidated by `consolidate.py` → `tools/japan_consolidate.py`).
Standing briefs: `data/japan-research/_AGENT_BRIEF.md` (shared Japan rules) + `_AGENT_BRIEF.md` here.

## Density targets (iterate until met — do NOT compromise; benchmark = NYC ~500)
Measured by `python3 tools/density.py osaka` on the DISCOVERED set. Total ≈ 460.
- `KITA` Kita (Umeda · Nakazakichō · Tenma · Tenjinbashi-suji · Nakanoshima · Fukushima) — target ~80
- `MINAM` Minami (Namba · Dōtonbori · Shinsaibashi · Amerikamura · Kuromon · Sennichimae · Ura-Namba) — target ~95
- `CHUO` Chūō & the Castle (Osaka Castle · Honmachi · Kitahama · Tanimachi · Karahori) — target ~45
- `TNJ` Tennōji & Shinsekai (Tsūtenkaku · Shinsekai · Abeno Harukas · Shitennō-ji · Nishinari) — target ~55
- `EAST` East Osaka (Tsuruhashi · Ikuno Koreatown · Kyōbashi · Higashi-Ōsaka) — target ~35
- `BAY` Bay Area (Universal Studios · Kaiyūkan · Tempozan · Taishō Little Okinawa · Sakishima) — target ~35
- `SOUTH` Southern Osaka (Sumiyoshi Taisha · Sakai kofun & knives · Kishiwada · Kansai Airport) — target ~40
- `NORTH` Hokusetsu & Kawachi (Minoo · Expo '70 Park · Ikeda Cupnoodles Museum · Takatsuki · Hirakata) — target ~35
- `KNSAI` Kansai day trips (Kobe · Himeji · Arima Onsen · Kōya-san · Wakayama) — target ~40

## Regioning
Osaka's own **Kita (north) / Minami (south)** downtown split plus its **wards (-ku)**, then the Hokusetsu/Kawachi/Senshū suburbs and the Kansai day-trip ring. Nara belongs to the Kyoto map — don't duplicate it here.

## State
- 2026-10-02 scaffolded (areas, taxonomy, wrappers, registry keys).
- 2026-10-02 **W1 truncated**: the session-wide WebSearch cap (200/200, shared by ~16 agents) was exhausted ~22
  searches into W1. Discovered **28** (24 Michelin food + 4 sights; KITA 17, CHUO 7, MINAM 2, TNJ 1, EAST 1, rest 0);
  geocoded 4 high + 1 UNVERIFIED. Held: `_held_W1.json` (3 Bib pending address, 9 single-source sights incl. Shitennō-ji
  with its verified coord). Page NOT built, card NOT live, Japan NOT flipped. Needs a fresh session / raised
  `CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION` to continue.

### Proven channels (use first next session)
- `allowed_domains:["guide.michelin.com"]` + "Osaka Bib Gourmand <cuisine> address" → 3–6 venue pages with
  addresses per call; "<name> <street> latitude longitude" on the same domain returns the venue-page lat/lng (a real
  place pin). Hyōgo/Kobe: same with "hyogo-region". Expect ~150+ Osaka-region Michelin places.
- `allowed_domains:["en.wikipedia.org"]` "<A> coordinates; <B> coordinates" → 2 sight coords per call.
- `allowed_domains:["japan-guide.com"]` / `["osaka-info.jp"]` area queries → sight lists (source 1).

## In-flight wave
- W2 (2026-10-02, session 2): files `FOOD_OSAKA_W2.json`, `SIGHTS_OSAKA_W2.json`, `SOURCES_OSAKA_W2.json`,
  `CREATORS_OSAKA_W2.json`, `geo/_geoout_osaka_W2*.json`. Plan: resolve held Bibs; Michelin Osaka-region lists by
  genre; konamon/kushikatsu/horumon canon via editorial + creators; sights via japan-guide/OSAKA-INFO + Wikipedia
  coords (3/query); geocode Michelin pins (2-3 names/query). Search count this session tracked in `## Search log`.

## Search log
- session 2 searches used: main 54 + G1 13 + S1 29 + M1 45 = 141 (M2 worker running, ≤25)

## Next actions
0. Geocode the 23 W1 Michelin restaurants (Michelin-domain lat/lng) + resolve the 3 held Bib addresses.
1. Discovery waves per area (canon first: takoyaki/okonomiyaki/kushikatsu/kitsune udon/horumon via Time Out, Inside Osaka, Lonely Planet, Tabelog Hyakumeiten, dancyu, creators) → `python3 tools/density.py osaka` → iterate on every `NEED +N`.
2. Geocode waves → `geo/_geoout_osaka_*.json` → `python3 tools/rebuild-city.py osaka --build` (under the shared lock).
3. Re-verify pin placement (CLAUDE.md 4b) + closure pass (4c) until statuscheck reports zero unchecked.

## Acceptance
- [ ] every area ≥ target · [ ] sourcecheck PASS · [ ] geocheck PASS · [ ] statuscheck CONSISTENT, 0 unchecked
- [ ] buildcheck PASS · [ ] `npm run validate && npm test` green · [ ] Japan hub card live · [ ] CITIES.md row
