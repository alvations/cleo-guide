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
- 2026-10-02 W01 (session 1): 12 SPR sights, 9 pinned — halted at the shared 200-search cap.
- 2026-10-02 **session 2**: W02–W15 discovery + G01/G02 geocode workers + builds #1/#2 → **140 discovered, 104 rendered
  (100 sights + 4 food), all 4 gates green, validate/test green — LIVE** (Japan hub card + root "3 of 5" + CITIES.md row).
- Counts vs target (discovered): see `python3 tools/density.py hokkaido` — SPR 41/130 · OTARU 16/50 · NSK 4/35 ·
  DONAN 20/75 · IBURI 15/40 · DHOKU 17/60 · TKC 11/35 · DOTO 18/55 · SOYA 8/20 (approx. at go-live).
- 36 UNVERIFIED held (mostly restaurants — Sapporo/Hakodate/Asahikawa/Obihiro/Otaru/Kushiro food has addresses but no
  readable place-pin) → `tools/geocode-helper.html` or a Google `!3d!4d` pass. Sights still unpinned: Otaru Herring
  Mansion, Otaru Kihinkan, Shimamui Coast, Sushiya-dōri, Hachimanzaka, Patchwork Road, Sōya Hills, Sukoton, Momoiwa, Himenuma.
- Commands: `python3 tools/density.py hokkaido` · `flock -w 3600 .git/cleo-shared.lock python3 tools/rebuild-city.py hokkaido --build`.

## In-flight wave
- **W16+ (session 2, continuing until the search budget runs out):** SPR food/sights b4, NSK food, DONAN extras.
  Files: `_w16_*.py` → FOOD/SIGHTS_HOKKAIDO_W16.json. If interrupted: re-run any `_w*.py` ledger, rebuild, commit.

## Search ledger` below.

## Search ledger
- session 2: ≈161 used (me ~128 + G01 18 + G02 15)

## Next actions
1. Discovery waves per area (canon first) → `python3 tools/density.py hokkaido` → iterate on every `NEED +N`.
2. Geocode waves → `geo/_geoout_hokkaido_*.json` → `python3 tools/rebuild-city.py hokkaido --build` (under the shared lock).
3. Re-verify pin placement (CLAUDE.md 4b) + closure pass (4c) until statuscheck reports zero unchecked.

## Acceptance
- [ ] every area ≥ target · [ ] sourcecheck PASS · [ ] geocheck PASS · [ ] statuscheck CONSISTENT, 0 unchecked
- [ ] buildcheck PASS · [ ] `npm run validate && npm test` green · [ ] Japan hub card live · [ ] CITIES.md row
