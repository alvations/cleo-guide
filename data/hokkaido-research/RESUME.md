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
- Commands: `python3 tools/density.py hokkaido` · `flock -w 3600 .git/cleo-shared.lock python3 tools/rebuild-city.py hokkaido --build`.

## In-flight wave
- **session 5 (2026-10-03)** — background subagents (brief `_hk_s5_brief.md`, ≤30 searches each): W88 SPR food · W89 NSK+OTARU ·
  W90 DHOKU+TKC · W91 DONAN+DOTO+IBURI · W92 anime (Golden Kamuy, Silver Spoon, Love Live! Sunshine!!, Pokémon, Animate/Mandarake) ·
  G05 restaurant pins (`_hk_unpinned.txt`). Each writes `_w<NN>_*.py` + `_note_W<NN>.md`; a relaunched orchestrator re-runs any
  finished script, reviews the notes, then builds (B1 s5). Unfinished agents → re-launch with the same wave tag.

## Search ledger
- session 1: ~14 · session 2: ≈188 · session 3: ≈178 (me ~151 + W40 agent 15 + W60 agent 12).

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

## Next-wave plan (session 5)
1. **Restaurant pins (biggest lever, 183 UNVERIFIED → map):** WebSearch cannot surface shop coordinates (re-confirmed s4: mapion/OSM/
   `!3d`/緯度経度 all fail). Run `tools/geocode-helper.html` over `docs/GEOCODE-BACKLOG.md` (hokkaido) in a browser — addresses are sourced.
   Remaining WebSearch-reachable pins: host-landmark coords only (see `_note_W80.md` for what was tried; re-verify Okushiba/Ichiryūan lot 1-1 vs 1-3).
2. **Gaps by area (discovered):** SPR +16 · NSK +10 · DHOKU +10 · DONAN +9 · DOTO +8 · OTARU +5 · IBURI +4 · TKC +3. Pinnable-first:
   ja.wikipedia 3-name coord queries for sights + michi-no-eki/breweries/wineries; restaurants via rurubu+mapple 2-in-1 queries.
3. **Promote held singles** (one more exact outlet page each): W82 held 4 (Hotei, nano.femto, Kakizaki, Shakotan Blue), Misuzu coffee
   Daimon, Snaffle's, Tenkin (branch), Katsuyamadate, Snow Crystal Museum, Sapporo Science Center, Hoshioki Falls, Salmon Museum,
   Makkarina, Kumagera, Shiraoi-beef shops, Kyōdō Gakusha, Tokachino Fromage, Wakoto, Sumikai (see `_note_W8x.md`).
4. **Anime wave 3:** Animate/Mandarake Sapporo (need editorial), Kitami 'Dosanko Gal', Hokkaido Gokoku Shrine (Golden Kamuy), Snow Miku events;
   give Sabō Kikuizumi a pin (host: Motomachi building).
5. Keep food ≥50% (now 50.1%): every new sight should be matched by a food place in the same area.

## Acceptance
- [ ] every area ≥ target · [ ] sourcecheck PASS · [ ] geocheck PASS · [ ] statuscheck CONSISTENT, 0 unchecked
- [ ] buildcheck PASS · [ ] `npm run validate && npm test` green · [ ] Japan hub card live · [ ] CITIES.md row
