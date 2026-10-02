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

## In-flight wave
- none (W2 closed and committed).

## Next actions (W3 plan, ordered)
0. **Geocode the 45 UNVERIFIED** (list: `grep -B2 unverified geo/_geoout_okinawa_W*.json`) — mostly Naha/Miyako/Ishigaki
   restaurants with street addresses (Yūnangi, Mikasa, Jack's, Shuri Soba, Mie, Suunumee, Kojasobaya, Kinatsuyu…) and
   island sights (Sunayama, Higashi-hennazaki, Irabu Bridge, Aharen, Hate-no-hama, Emerald Beach, Shikinaen ×4 tries).
   Use `tools/geocode-helper.html` (browser) or one-place-per-query Wikipedia/Atlas Obscura. Re-verify Ikema (low).
1. **Food (only 27)**: mine the remaining Okinawa Times 2023 poll names (held, need a 2nd source): Miyazato Soba,
   Sachichan, Oshiro, Nakamura (Onna), Yae Shokudo, Yonabaru-ya, Kikuya, Nanbu Soba, Yuunami, EIBUN, Takaesu, Kai soba,
   3-chome Shima Soba-ya, Agariya+, Akashi/Kimi Shokudo (Ishigaki), Irabu Soba Kame → pair each with a Mapple spot page
   (`allowed_domains=["mapple.net"]`, 3–4 names per query) or KozaWeb. Canon gaps: Blue Seal Makiminato, A&W Makiminato
   (Mapple only so far), Arakaki Zenzai, sata andagi, Tomari Iyumachi / Awase Payao / Itoman fish markets (Visit
   Okinawa only), Ishigaki-beef yakiniku, Kume kuruma-ebi (Washima), awamori bars.
2. **Sights still held for a 2nd source / coords** (see notes): Kakazu Ridge, Sugar Loaf, Urasoe Castle/Yōdore, Nirai
   Kanai Bridge, Giza Banta, Odo beach, Chibichiri Gama, Gesashi mangroves, Orion Happy Park, Neo Park, Todoroki Falls,
   Minna Island, Busena Marine Park, Okinawa Karate Kaikan (JG e7130), Kudaka Island, Kondoi Beach, Urauchi River, Cape
   Hirakubo, Yonehara Beach, Hateruma Nishihama, Kuroshima, Kohama, Sawada-no-hama, 17END.
3. Creators: no vetted creator surfaced a place-specific Okinawa video in 4 queries — try Japanese creators
   (`沖縄 そば YouTuber 名店`), PBS "Family Ingredients — Okinawa soki soba" (name the shops it visits).
4. After each ~50: `flock -w 3600 /home/user/cleo-guide/.git/cleo-shared.lock python3 tools/rebuild-city.py okinawa --build`
   → 4 gates → `cd tools && npm run validate && npm test` → commit+push. Go live when rendered depth is real
   (suggest ≥150 pins with every area ≥10).

## Map-view caveat (RESOLVED 2026-10-02 — VIEW override; keep checking after island pins land)
The centre/zoom is derived from the 5–95 % pin percentiles over ALL Okinawa pins. Once Miyako/Yaeyama hold >5 % of
pins the box spans ~400 km and the derived view lands in the sea at zoom ~7–8. After the first `--build` run
`node tools/research.js --buildcheck okinawa` and eyeball the view; if the main island isn't framed, add a
documented CFG override (e.g. `VIEW`) in tools/belgium_build.py under the lock rather than hardcoding.

## Acceptance
- [ ] every area ≥ target · [ ] sourcecheck PASS · [ ] geocheck PASS · [ ] statuscheck CONSISTENT, 0 unchecked
- [x] buildcheck PASS · [x] `npm run validate && npm test` green · [ ] Japan hub card live · [ ] CITIES.md row
