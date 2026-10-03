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
- 2026-10-02 session 2 (≈188 searches): W02–W30 + G01–G03 → 192 discovered, 132 rendered (128 sights + 4 food), LIVE.
- 2026-10-02 **session 3 (≈178 searches; food-first per RUN §2b, anime layer per §2c)**: W31–W79 (+ background agents W40 anime,
  W60 sights) → **334 discovered, 189 rendered** (161 sights + 28 food), all 4 gates PASS, validate DATA OK, npm test ALL PASS.
  **Food share 26% → 46%** (154/334). ANIME collection 0 → 7 (Pokémon Center Sapporo, Hokuchin museum, Hakodate Arena, Snow Miku
  Sky Town + Golden Kamuy overlay on Abashiri Prison Museum, Upopoy, Noboribetsu Jigokudani).
- Discovered vs target (`python3 tools/density.py hokkaido`) — food/total:
  SPR 47/89 (130) · OTARU 18/33 (50) · DONAN 24/53 (75) · DHOKU 17/39 (60) · DOTO 16/35 (55) · TKC 11/27 (35) · IBURI 10/27 (40) ·
  NSK 6/16 (35) · SOYA 5/15 (20). Every area still NEED.
- 145 UNVERIFIED held for `tools/geocode-helper.html`: ~125 restaurants (every one has a sourced address/landmark; Hokkaido has no
  Michelin venue pages and `<shop> 緯度経度` returns only centroids) + ~18 sights without infobox coords.
- 2026-10-02 **session 4** (≈141 searches; local clone reset to origin — backup branch `backup-stale-local`): W80 pins, W81 anime,
  W82–W84 discovery, W85–W87 (sights + promotions), G04 pin → **435 discovered (50% food), 252 rendered** (194 sights + 58 food), ANIME 18,
  all 4 gates + validate + test green (build B2). 183 UNVERIFIED held (restaurants).
  Discovered vs target: SPR 114/130 · OTARU 45/50 · DONAN 66/75 · DHOKU 50/60 · DOTO 47/55 · TKC 32/35 · IBURI 36/40 · NSK 25/35 · SOYA 20/20 OK.
- 2026-10-03 **session 5** (≈178 searches; 5 bg discovery agents W88–W92 + G05 pins + W93 promotions) → **509 discovered (54% food), 274 rendered**
  (212 sights + 62 food), ANIME/pop 30, all 4 gates + validate + test green. Discovered vs target: SPR 128/130 · OTARU 51/50 · DONAN 78/75 ·
  DHOKU 65/60 · DOTO 56/55 · TKC 37/35 · IBURI 41/40 · NSK 34/35 · SOYA 20/20. 235 UNVERIFIED held (restaurants).
- Commands: `python3 tools/density.py hokkaido` · `flock -w 3600 .git/cleo-shared.lock python3 tools/rebuild-city.py hokkaido --build`.

## In-flight wave
- **Session 6 (2026-10-03)**: W94 (SPR +2 / NSK +1, ≥5 new incl. anime where possible → `_w94_spr_nsk.py`) then G06 restaurant pins via the Liège-proven RestaurantGuru/Foursquare/Wanderlog single-place search (`geo/_geoout_hokkaido_g06.json`, `_g06_pins.py`). Rebuild + 4 gates.

## Search ledger
- session 1: ~14 · session 2: ≈188 · session 3: ≈178 (me ~151 + W40 agent 15 + W60 agent 12) · session 4 ≈141 · session 5 ≈178.

## What works (session 3 lessons — reuse)
- **Pinned food & drink = michi-no-eki + breweries/markets with ja.wikipedia infoboxes**: `"<A> 座標; <B> 座標; <C> 座標"`
  (allowed_domains ja.wikipedia.org) → then ONE rurubu/MAPPLE/visit-hokkaido query for the signature dish. Only add a roadside
  station when a source names its dish (Date, Tōya, Asahikawa, Monbetsu, Swan 44, Biei Oka-no-kura pins read but NOT added).
- **Restaurants**: query 3–4 shop names restricted to `rurubu.jp` + `mapple.net` → spot pages of both outlets = 2 sources in 1 search.
  City tourism bodies with shop DBs: sapporo.travel, hakodate.travel, otaru.gr.jp, kushiro-lakeakan.com, obikan.jp, laketoya.com,
  jozankei.jp, niseko-ta.jp, rishiri-plus.jp. List articles as ONE source for many: Time Out "50 things to do in Sapporo",
  GoodLuckTrip "21 Must-Try Restaurants in Susukino" / "12 Jingisukan", Ramen Adventures "Hokkaido best ramen 2024" (top 100).
- **Sights**: same 3-name wiki-coord query + one sapporo.travel / visit-hokkaido / japan-guide query → ~2 pinned sights per search.
- **Overlay waves**: same-name record with only new sources + `"anime"` (no geo) — merged by `japan_consolidate._overlay()`.
- Dead ends: guide.michelin.com (no Hokkaido venue pages), Michelin 2017 Bib list, Tabelog 百名店 lists, Time Out "10 things to eat",
  SAVOR JAPAN (Gurunavi), visit-hokkaido dish pages (no shop names), corporate plants' wiki coords.

## Next-wave plan (session 6)
1. **Close the last two:** SPR +2 (promote one of: hirihiri 2-gō — needs a mapple/sapporo.travel *spot* page; Pokke / Ramu no Ie / Bunjūrō — need a
   non-rurubu outlet; Shirakaba Sansō / Yoshiyama Shōten — confirm the same branch in both outlets) · NSK +1 (Graubünden, Restaurant Yukiniwa —
   need niseko-ta.jp / visit-hokkaido spot page; Hirafu restaurants held in `_note_W89.md`).
2. **Restaurant pins (biggest lever, 235 UNVERIFIED):** confirmed again in G05 — WebSearch cannot surface shop coords. Run `tools/geocode-helper.html`
   over `docs/GEOCODE-BACKLOG.md` (hokkaido) in a browser. Re-verify MnE Otofuke (moved 2022) pin.
3. **Second anime tie-in sources** for single-sourced overlays (Morning Market, Kanemori — DIME only; Beer Museum — WARAKU only); leads: Ghost of
   Yōtei × niseko-ta.jp official page (video game — pop-culture overlay on Mt Yōtei), Gokoku Shrine (Golden Kamuy), Animate/Mandarake Sapporo.
4. **Creators:** every s5 creator query dead-ended; try named channels directly (Paolo fromTOKYO Hokkaido, Abroad in Japan Hokkaido, Only in Japan
   Sapporo, Sapporo-based Japanese YouTubers) and attach to existing places.
5. Keep food ≥50% (now 54%).

## Acceptance
- [ ] every area ≥ target (SPR 128/130, NSK 34/35) · [x] sourcecheck PASS · [x] geocheck PASS · [x] statuscheck CONSISTENT, 0 unchecked
- [x] buildcheck PASS · [x] `npm run validate && npm test` green · [x] Japan hub card live · [x] CITIES.md row
