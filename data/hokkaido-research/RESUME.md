# Hokkaido (北海道) — RESUME checkpoint (read first)

Map: `cities/hokkaido.html` · dataset `data/hokkaido.dataset.json` · key `hokkaido` · built by `tools/build-hokkaido.py`
(thin wrapper over `tools/japan_build.py`; consolidated by `consolidate.py` → `tools/japan_consolidate.py`).
Standing briefs: `data/japan-research/_AGENT_BRIEF.md` (shared Japan rules) + `_AGENT_BRIEF.md` here.

## Density targets (iterate until met — do NOT compromise; benchmark = NYC ~500)
Measured by `python3 tools/density.py hokkaido` on the DISCOVERED set. Total ≈ 500.
- `SPR` Sapporo (Ōdōri · Susukino · Nijō Market · Maruyama · Moiwa · Jōzankei) — target ~130
- `OTARU` Otaru & Shakotan (canal · Sushi-ya Dōri · Yoichi Nikka · Shakotan uni) — target ~50
- `NSK` Niseko & Yōtei (Niseko · Kutchan · Rusutsu · Makkari · Kyōgoku) — target ~35
- `DONAN` Hakodate & Dōnan (Morning Market · Goryōkaku · Mt Hakodate · Motomachi · Ōnuma · Matsumae) — target ~75
- `IBURI` Shikotsu-Tōya & Iburi (Noboribetsu Jigokudani · Lake Tōya · Upopoy · Shiraoi · Tomakomai) — target ~40
- `DHOKU` Dōhoku — Central Hokkaido (Asahikawa · Biei · Furano · Daisetsuzan · Sōunkyō) — target ~60
- `TKC` Tokachi (Obihiro · Tokachi Plain · Nakasatsunai · Ikeda) — target ~35
- `DOTO` Dōtō — Eastern Hokkaido (Kushiro · Akan · Mashū · Shiretoko · Abashiri · Nemuro) — target ~55
- `SOYA` Far North (Wakkanai · Cape Sōya · Rishiri · Rebun) — target ~20

## Regioning
Hokkaido's own **subprefectural regions** — Dō-ō (Sapporo/Otaru/Niseko/Iburi), Dō-nan (Hakodate), Dō-hoku (Asahikawa/Furano/Biei/Wakkanai), Dō-tō (Tokachi/Kushiro/Shiretoko/Abashiri) — with Sapporo as its own area.

## State
- 2026-10-02 scaffolded (areas, taxonomy, wrappers, registry keys). Discovery not started.

## In-flight wave
- **W01 — Sapporo (SPR) sights + food canon.** Files: `_w01_spr.py` (compact ledger) → `python3 _w01_spr.py` emits
  `SIGHTS_HOKKAIDO_W01.json`, `FOOD_HOKKAIDO_W01.json`, `geo/_geoout_hokkaido_w01.json`. Method: batched WebSearch
  "Wikipedia coordinates A; B; C" (returns Wikipedia + japan-guide/sapporo.travel/visit-hokkaido URLs + published
  coords in one query); food via Tabelog Hyakumeiten/Michelin 2017/press + creators. Remaining: Sapporo sights
  (Jozankei, Art Park, Hokkaido Museum, Hitsujigaoka, Botanic Garden…), food canon (miso ramen, soup curry,
  jingisukan, kaisendon, sweets, beer).
- Helper: `_hk.py` (S()/F()/emit()) — every wave script is re-runnable and deterministic.

## Next actions
1. Discovery waves per area (canon first) → `python3 tools/density.py hokkaido` → iterate on every `NEED +N`.
2. Geocode waves → `geo/_geoout_hokkaido_*.json` → `python3 tools/rebuild-city.py hokkaido --build` (under the shared lock).
3. Re-verify pin placement (CLAUDE.md 4b) + closure pass (4c) until statuscheck reports zero unchecked.

## Acceptance
- [ ] every area ≥ target · [ ] sourcecheck PASS · [ ] geocheck PASS · [ ] statuscheck CONSISTENT, 0 unchecked
- [ ] buildcheck PASS · [ ] `npm run validate && npm test` green · [ ] Japan hub card live · [ ] CITIES.md row
