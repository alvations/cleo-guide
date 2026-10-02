# Okinawa (沖縄) — RESUME checkpoint (read first)

Map: `cities/okinawa.html` · dataset `data/okinawa.dataset.json` · key `okinawa` · built by `tools/build-okinawa.py`
(thin wrapper over `tools/japan_build.py`; consolidated by `consolidate.py` → `tools/japan_consolidate.py`).
Standing briefs: `data/japan-research/_AGENT_BRIEF.md` (shared Japan rules) + `_AGENT_BRIEF.md` here.

## Density targets (iterate until met — do NOT compromise; benchmark = NYC ~500)
Measured by `python3 tools/density.py okinawa` on the DISCOVERED set. Total ≈ 510.
- `NAHA` Naha (Kokusai-dōri · Makishi Public Market · Tsuboya · Shuri Castle · Naminoue · Sakaemachi) — target ~120
- `CHUBU` Chūbu — Central Okinawa (Chatan & American Village · Okinawa City/Koza · Ginowan · Urasoe · Yomitan) — target ~95
- `NANBU` Nanbu — Southern Okinawa (Itoman · Nanjō & Sēfa-utaki · Peace Memorial Park · Tomigusuku) — target ~65
- `HOKBU` Hokubu — Northern Okinawa (Nago · Motobu & Churaumi · Kouri Island · Onna · Yanbaru) — target ~90
- `KRM` Kerama & nearby islands (Tokashiki · Zamami · Aka · Kume-jima · Iheya) — target ~30
- `MYK` Miyako Islands (Miyako-jima · Irabu · Ikema · Kurima) — target ~50
- `YAEYA` Yaeyama Islands (Ishigaki · Iriomote · Taketomi · Hateruma · Yonaguni) — target ~60

## Regioning
Okinawa Prefecture's own regional division: the main island's **Hokubu / Chūbu / Nanbu** (north/central/south) with **Naha** as its own area, then the outlying island groups — **Kerama**, **Miyako** and **Yaeyama**.

## State
- 2026-10-02 scaffolded (areas, taxonomy, wrappers, registry keys).
- 2026-10-02 **W1** (truncated by the shared cap): 13 discovered (`*_W1.json`).
- 2026-10-02 **W2 done** (relaunch, ~174 WebSearch calls): +106 → **119 discovered (92 sights + 27 food), 74 pinned**,
  45 UNVERIFIED (helper queue). Gates: sourcecheck / geocheck / statuscheck / buildcheck **PASS**; `npm run validate`
  + `npm test` **ALL PASS**. Files: `SIGHTS/FOOD/SOURCES/CREATORS_OKINAWA_W2.json`, `geo/_geoout_okinawa_W2.json`,
  raw per-search log `_okinawa_w2_notes.md` (every surfaced GPS and held lead, numbered — read before searching).
- View: opt-in `CFG["VIEW"]=(26.45,127.85,9)` in `tools/build-okinawa.py` (shared `tools/belgium_build.py` gained the
  backwards-compatible key) — frames the main island; Kerama/Miyako/Yaeyama by pan/zoom.
- **Not live**: hub card stat updated ("119 researched · 74 pinned · still being built"); CITIES.md row refreshed.

### Density (python3 tools/density.py okinawa, discovered set)
| area | have | target | need |
|---|---|---|---|
| NAHA | 21 | 120 | +99 |
| CHUBU | 22 | 95 | +73 |
| HOKBU | 23 | 90 | +67 |
| NANBU | 18 | 65 | +47 |
| YAEYA | 14 | 60 | +46 |
| MYK | 14 | 50 | +36 |
| KRM | 7 | 30 | +23 |

- 2026-10-02 **W3 done** (food & drink first + ANIME; WebSearch budget fully spent — 200/200 incl. two background
  geocoders): +95 → **214 discovered (107 sights + 107 food & drink = 50 % food, was 22 %), 89 pinned**; ANIME 4
  (Nirai Kanai, Azama, Pokémon Center Okinawa, Sugar Road/Chura-san); 2 notable closures flagged (Ayagu, Ichigin). 4 gates PASS, `npm run
  validate` + `npm test` ALL PASS. Files `FOOD/SIGHTS/SOURCES_OKINAWA_W3.json`, `geo/_geoout_okinawa_W3.json` (discovery
  pins), `_W3G` (held-sight geocoder: 7 kept, 5 rejected), `_W3R` (restaurant geocoder: 1/50), raw log `_okinawa_w3_notes.md`
  (120 numbered entries — every held lead and its source; read before searching).

### Density after W3 (python3 tools/density.py okinawa)
| area | food | sights | have | target | need |
|---|---|---|---|---|---|
| NAHA | 25 | 17 | 42 | 120 | +78 |
| CHUBU | 18 | 18 | 36 | 95 | +59 |
| HOKBU | 20 | 18 | 38 | 90 | +52 |
| NANBU | 15 | 17 | 32 | 65 | +33 |
| YAEYA | 13 | 15 | 28 | 60 | +32 |
| MYK | 12 | 12 | 24 | 50 | +26 |
| KRM | 4 | 10 | 14 | 30 | +16 |

## In-flight wave
- **W4 (2026-10-02, fresh session budget)** — pin-first + discovery + anime. Background subagents, each writing ONLY its
  tagged file: geocoders `W4G1` sights (31), `W4G2` NAHA+CHUBU food (39), `W4G3` NANBU+HOKBU+KRM food (30), `W4G4` MYK+YAEYA
  food (25) → `geo/_geoout_okinawa_W4G*.json` (worklists `_okinawa_geo_todo_W4G*.json`); discovery `W4D1` Naha food & drink,
  `W4D2` Chūbu+Nanbu, `W4D3` Hokubu+islands, `W4A` anime → `FOOD/SIGHTS/SOURCES/CREATORS_OKINAWA_W4D*.json` + `geo/_geoout_okinawa_W4D*.json`.
  If cut off: whatever is in those files is valid; re-run `python3 tools/rebuild-city.py okinawa --build` and continue.

## Next actions (W4 plan, ordered)
0. **Pins are the bottleneck (89 of 186 render).** ~95 places (≈70 restaurants) are UNVERIFIED: run
   `tools/geocode-helper.html` in a browser on `docs/GEOCODE-BACKLOG.md` → okinawa. Stripes article URLs that print GPS
   for held restaurants are listed in `_okinawa_w3_notes.md` (Mikasa, Yagiya/noodles-nanjo, Jack's, Charlie's, Tacoloco,
   Curcuma). Sights still unpinned: Shikinaen, Sakaemachi, Sunayama, Irabu Bridge, Gangala, Hate-no-hama, Yaedake,
   Tamatorizaki, Kume beaches, Aharen, Araha, Emerald, Yoshino, Aragusuku, Pokémon Center (Aeon Rycom), Ama, Takatsukiyama,
   Ryūtan, Karate Kaikan. Go live at ≥150 pins with every area ≥10 pins.
1. **Food (keep ≥50 % per area):** the Rurubu ↔ Mapple pairing works (1 list search → 4–8 names; 1 confirm search →
   2–4 kept). Held single-source leads to pair next (see notes #): Miyazato Soba, Mutsumibashi Kadoya, Shuri Soba
   Nakada, Teshiraji, George Restaurant, Ishimine Shokudō, Tsubame (Makishi 2F), Adachiya, Sangoza Kitchen, Koshuya,
   COFFEE potohoto, HUU'S, ippe coppe, Cafe Kokuu, CASA SOL, Kissa Agachi-mori, Jef Yonabaru, Seaside Drive-In, Cafe
   Ocean, Kitauchi Bokujō, Hitoshi, Gen, Yaesen/Seifuku distilleries, Kihachi & Yan-kō (Kume), Marumi-ya (Zamami), Kanifu
   & Shidamē-kan (Taketomi), Iriomote cafés, Yukishio Museum, KOURI SHRIMP, Makabe Chinā, Kaiyō Shokudō, Maeda Shokudō.
   Unmined/half-mined lists: Mapple tourism/okinawa/02 (Kokusai 19 — Pork Tamago Onigiri Honten, Okinawa Daiichi Hotel
   breakfast, C&C Breakfast, Ball Donut Park, Sekka no Sato need a 2nd source), rurubu 14269 (cafés 31), KozaWeb bakeries
   280 / senbero 283, Okinawa Traveler 0003 ranking, Hateruma/Kohama/Iriomote food (Mapple-only names in notes #104-108).
2. **Sights for Naha/Chūbu** (largest gaps): Tomari International Cemetery, Mekaru tombs, Shuri Kannondō, Naminoue Beach,
   Urasoe Castle/Yōdore, Kakazu Ridge, Sugar Loaf, Minatogawa Stateside Town (Stripes GPS), Kadena michi-no-eki lookout,
   Okinawa Zoo, Plaza House, Rycom; Ishigaki Limestone Cave & Cape Hirakubo (GLTJP + Stripes '20 things').
3. **ANIME (3 so far):** Okitsura (Uruma — pilgrimage map RS 3833039, manholes RS 4174266), Poké Lids (16 in 12 cities —
   need per-lid sites), One Piece Card Game shop (San-A Naha Main Place), Chura-san (NHK drama, Kohama Island).
4. **Creators:** still 0 vetted attachments (SUSURU TV, Rachel & Jun, LWIF, Tokyo Lens checked). Try Japanese Okinawa
   YouTubers with ≥100k subs naming specific shops.
5. After each ~50: `flock -w 3600 /home/user/cleo-guide/.git/cleo-shared.lock python3 tools/rebuild-city.py okinawa --build`
   → 4 gates → `cd tools && npm run validate && npm test` → commit+push.

## Map-view caveat (RESOLVED 2026-10-02 — VIEW override; keep checking after island pins land)
The centre/zoom is derived from the 5–95 % pin percentiles over ALL Okinawa pins. Once Miyako/Yaeyama hold >5 % of
pins the box spans ~400 km and the derived view lands in the sea at zoom ~7–8. After the first `--build` run
`node tools/research.js --buildcheck okinawa` and eyeball the view; if the main island isn't framed, add a
documented CFG override (e.g. `VIEW`) in tools/belgium_build.py under the lock rather than hardcoding.

## Acceptance
- [ ] every area ≥ target · [ ] sourcecheck PASS · [ ] geocheck PASS · [ ] statuscheck CONSISTENT, 0 unchecked
- [x] buildcheck PASS · [x] `npm run validate && npm test` green · [ ] Japan hub card live · [ ] CITIES.md row
