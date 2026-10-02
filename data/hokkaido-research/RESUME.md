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
- 2026-10-02 scaffolded; W01 (session 1): 12 SPR sights, halted at the shared 200-search cap.
- 2026-10-02 **session 2 (≈188 searches)**: W02–W30 + geocode workers G01/G02/G03 → **192 discovered, 132 rendered
  (128 sights + 4 food), all 4 gates green, validate/test green — LIVE** (Japan hub card, root "3 of 5", CITIES.md row).
- Discovered vs target: SPR 49/130 · OTARU 18/50 · NSK 8/35 · DONAN 30/75 · IBURI 16/40 · DHOKU 22/60 · TKC 16/35 ·
  DOTO 24/55 · SOYA 9/20 (`python3 tools/density.py hokkaido`).
- 60 UNVERIFIED held: 46 restaurants (addresses sourced; no place-pin readable via WebSearch) + 14 sights (Otaru Herring
  Mansion, Kihinkan, Shimamui, Sushiya-dōri, Kitaichi No. 3, Hachimanzaka, Patchwork Road, Himenuma, Momoiwa, Magistrate's
  Office is pinned at the Goryōkaku point (med), W30 gardens ×5).
- Commands: `python3 tools/density.py hokkaido` · `flock -w 3600 .git/cleo-shared.lock python3 tools/rebuild-city.py hokkaido --build`.

## In-flight wave
- session 3 food-first: W31–W33 written (19 food). Next: W34+ Sapporo ramen/sushi/sweets/bars, Otaru sushi, anime wave.

## Search ledger
- session 1: ~14 (cap shared with all agents). session 2: ≈188 (me ~147 + G01 18 + G02 15 + G03 8).

## Next-wave plan (session 3)
1. **Restaurant pins (biggest lever: +46 rendered):** run `tools/geocode-helper.html` (or a Google `!3d!4d` place-pin
   pass) over the 46 food UNVERIFIED — every one already has a sourced address.
2. **Discovery by gap (cheapest first):**
   - Sights via `allowed_domains:["ja.wikipedia.org"]` + 3 Japanese names + 座標, paired with ONE `visit-hokkaido.jp`
     / `sapporo.travel` / `hakodate.travel` / `japan-guide.com` area query (10 URLs) for the 2nd source.
     Leads ready: Esan, Komagatake, Hakodate Park, Tokachidake Bōgakudai, Arishima Memorial Museum, Wakkarium,
     Hakodate Museum of Art, Hongo Shin museum, Fugoppe Cave, Kamui Kotan, Lake Nukabira, Mikuni Pass, Shikabe geyser.
   - Food via `rurubu.jp` + `mapple.net` + city tourism bodies (`otaru.gr.jp`, `hakodate.travel`, `sapporo.travel`
     gourmet/shop pages) — 2nd sources for the held singles listed in AUDIT (Asari sukiyaki, Hakodate Beer Hall, Ippei
     Muroran yakitori, Nonokasa udon, Ichimura soba, Ōkami Soup, Furanoya, Matsuo/Pokke jingisukan, Kinotoya, Aoba).
   - Area order by gap: SPR (+81) → DONAN (+45) → DHOKU (+38) → OTARU (+32) → DOTO (+31) → NSK (+27) → IBURI (+24) → TKC (+19) → SOYA (+11).
3. **Creators:** still 0 vettable — try Japanese creators by name (e.g. `<shop> SUSURU` ramen YouTuber, `<shop> 1分グルメ`)
   with `allowed_domains:["youtube.com"]` and require the channel + a specific video naming the shop.
4. Re-verify med pins (Jigokudani photo geotag, Sakaimachi junction, Ningle Terrace photo geotag, Naitai summit) and
   per-outlet attribution for W16/W28.

## Next actions
1. Discovery waves per area (canon first) → `python3 tools/density.py hokkaido` → iterate on every `NEED +N`.
2. Geocode waves → `geo/_geoout_hokkaido_*.json` → `python3 tools/rebuild-city.py hokkaido --build` (under the shared lock).
3. Re-verify pin placement (CLAUDE.md 4b) + closure pass (4c) until statuscheck reports zero unchecked.

## Acceptance
- [ ] every area ≥ target · [ ] sourcecheck PASS · [ ] geocheck PASS · [ ] statuscheck CONSISTENT, 0 unchecked
- [ ] buildcheck PASS · [ ] `npm run validate && npm test` green · [ ] Japan hub card live · [ ] CITIES.md row
