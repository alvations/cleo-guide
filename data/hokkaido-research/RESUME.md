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
- Commands: `python3 tools/density.py hokkaido` · `flock -w 3600 .git/cleo-shared.lock python3 tools/rebuild-city.py hokkaido --build`.

## In-flight wave
- none (session 3 closed cleanly at ≈178 searches).

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

## Next-wave plan (session 4)
1. **Restaurant pins (biggest lever: +125 rendered):** run `tools/geocode-helper.html` over the hokkaido UNVERIFIED backlog
   (`docs/GEOCODE-BACKLOG.md`) — addresses are sourced.
2. **Promote held singles** (each needs ONE more outlet; list in AUDIT session-3 "Held" lines): Matsuo Jingisukan Ekimae, Okami Soup,
   Iso-chan, Uni Marukawa, Kitaushi, Fuhdo, Asari sukiyaki, Misuzu coffee, Snaffle's, Uomasa, Ushi no Sato, Toridatsu, Fukuan,
   Niseko Cheese Kōbō, Niseko Gelato, Karafuto Shokudō, Isoyakitei, Kani no Shōya, Shiretoko Shokudō, Tenkin, Hanatokachi, Kitakaro
   Otaru, Koshimizu Natural Flower Garden (pin read), Sapporo City Archives (pin read).
3. **Area order by gap:** SPR (+41: sights via sapporo.travel facility pages + wiki pins; food via GoodLuckTrip/Time Out lists) →
   DONAN (+22) → DHOKU (+21) → NSK (+21; English sources: niseko-ta.jp + Japan Times/Time Out for Niseko dining) → DOTO (+20) →
   OTARU (+17) → IBURI (+16) → TKC (+10) → SOYA (+5).
4. Food share is 47% overall; IBURI 38%, SOYA 33%, NSK 43% → food first there.
5. Anime wave 2: visit-hokkaido.jp/stamprally (film/anime location stamp rally), Sabō Kikuizumi (Saint Snow café, Hakodate),
   Tsukigata Kabato Museum (Golden Kamuy), Animate/Mandarake Sapporo (need editorial source).
6. Re-verify med pins (W60 Nukabira/Noshappu, W61 Hokkaido University campus point) and the merged-attribution caveats (W33, W44, W74).

## Acceptance
- [ ] every area ≥ target · [ ] sourcecheck PASS · [ ] geocheck PASS · [ ] statuscheck CONSISTENT, 0 unchecked
- [ ] buildcheck PASS · [ ] `npm run validate && npm test` green · [ ] Japan hub card live · [ ] CITIES.md row
