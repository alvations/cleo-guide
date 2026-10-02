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
- 2026-10-02 scaffolded (areas, taxonomy, wrappers, registry keys).
- 2026-10-02 W01 (SPR sights): 12 discovered (all ≥2 credible), 9 geocoded high + 3 UNVERIFIED; built & all gates
  green (9 pins). **Blocked:** session WebSearch budget exhausted (200/200) after ~14 queries by this agent — raise
  `CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION` (or relaunch in a fresh session) to continue. NOT live.
- Counts vs target: SPR 12/130 · OTARU 0/50 · NSK 0/35 · DONAN 0/75 · IBURI 0/40 · DHOKU 0/60 · TKC 0/35 · DOTO 0/55 · SOYA 0/20.
- Commands: `python3 tools/density.py hokkaido` · `flock -w 3600 .git/cleo-shared.lock python3 tools/rebuild-city.py hokkaido --build`.

## In-flight wave
- **Session 2 (2026-10-02, fresh WebSearch budget)** — W02 SPR food canon (miso ramen, soup curry, jingisukan, Nijō
  kaisendon, sweets) → W03 SPR sights b2 → W04 OTARU → W05 DONAN → W06 IBURI → W07 DHOKU → W08 TKC → W09 DOTO → W10 SOYA/NSK.
  Ledgers `_w<NN>_<area>.py` (re-runnable). Search count this session tracked in `## Search ledger` below.

## Search ledger
- session 2: 111 used (me 93 + geocode agent G01 18)

## Next actions
1. Discovery waves per area (canon first) → `python3 tools/density.py hokkaido` → iterate on every `NEED +N`.
2. Geocode waves → `geo/_geoout_hokkaido_*.json` → `python3 tools/rebuild-city.py hokkaido --build` (under the shared lock).
3. Re-verify pin placement (CLAUDE.md 4b) + closure pass (4c) until statuscheck reports zero unchecked.

## Acceptance
- [ ] every area ≥ target · [ ] sourcecheck PASS · [ ] geocheck PASS · [ ] statuscheck CONSISTENT, 0 unchecked
- [ ] buildcheck PASS · [ ] `npm run validate && npm test` green · [ ] Japan hub card live · [ ] CITIES.md row
