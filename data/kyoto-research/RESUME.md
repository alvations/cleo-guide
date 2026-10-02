# Kyoto (京都) — RESUME checkpoint (read first)

Map: `cities/kyoto.html` · dataset `data/kyoto.dataset.json` · key `kyoto` · built by `tools/build-kyoto.py`
(thin wrapper over `tools/japan_build.py`; consolidated by `consolidate.py` → `tools/japan_consolidate.py`).
Standing briefs: `data/japan-research/_AGENT_BRIEF.md` (shared Japan rules) + `_AGENT_BRIEF.md` here.

## Density targets (iterate until met — do NOT compromise; benchmark = NYC ~500)
Measured by `python3 tools/density.py kyoto` on the DISCOVERED set. Total ≈ 485.
- `HGS` Higashiyama-ku (Gion · Kiyomizu-dera · Sannenzaka · Kennin-ji · Yasaka · Tōfuku-ji) — target ~75
- `SAKYO` Sakyō-ku (Ginkaku-ji · Philosopher's Path · Nanzen-ji · Okazaki · Demachiyanagi · Shimogamo) — target ~60
- `CTR` Central — Nakagyō & Shimogyō (Nishiki · Pontochō · Kawaramachi · Karasuma · Nijō Castle · Kyoto Station) — target ~95
- `KITA` Kita & Kamigyō (Kinkaku-ji · Daitoku-ji · Imperial Palace · Nishijin · Kamigamo) — target ~50
- `RKSAI` Rakusai — Ukyō & Nishikyō (Arashiyama · Sagano · Ryōan-ji · Katsura · Koke-dera) — target ~55
- `FSHMI` Fushimi & Minami (Fushimi Inari · Tō-ji · Fushimi sake district · Daigo-ji) — target ~45
- `RKHKU` Rakuhoku mountains (Ōhara · Kurama · Kibune · Takao · Miyama) — target ~30
- `UJI` Uji & Nara (Byōdō-in · Uji tea · Tōdai-ji · Kasuga Taisha · Nara Park) — target ~50
- `KYFU` Kyoto Prefecture & Lake Biwa (Amanohashidate · Ine no Funaya · Kameoka · Ōtsu · Hiei-zan) — target ~25

## Regioning
Kyoto city's 11 **wards (-ku)** grouped as locals do (Rakuchū centre, Rakutō east, Rakusai west, Rakuhoku north, Rakunan south), plus Uji/Nara and the wider prefecture as the day-trip ring.

## State
- 2026-10-02 scaffolded; W1 partial (12 places) halted at the shared 200-search cap.
- 2026-10-02 **W2 (relaunch, own budget) — LIVE.** Page `cities/kyoto.html`, linked from the Japan hub (CARD:kyoto),
  root CARD:japan "4 of 5 maps live", docs/CITIES.md row. Last full build: **208 discovered / 198 rendered (136 sights + 62 food)**;
  sourcecheck / geocheck / statuscheck / buildcheck PASS; `npm run validate` + `npm test` ALL PASS. Later batches (UJI +5, FSHMI +3)
  are in the files — the next `rebuild-city.py kyoto --build` picks them up.
- Rendered per area at last build (target): HGS 39 (75) · CTR 38 (95) · SAKYO 24 (60) · RKSAI 24 (55) · KITA 22 (50) · UJI 21 (50)
  · RKHKU 11 (30) · FSHMI 10 (45) · KYFU 9 (25).
- Files: SIGHTS_KYOTO_{HGS1,HGS2,UNESCO,CTR1,SAKYO1,RKSAI1,KITA1,FSHMI1,UJI1,RKHKU1,KYFU1}.json; FOOD_KYOTO_{HGS1,W2,W3,W4}.json;
  SOURCES_KYOTO_{W1,W2}.json; geo/_geoout_kyoto_*.json (incl. `_mpins` from the Michelin pin worker). Helpers: `_kyoto_add.py`
  (append/dedup), `_kyoto_rows.py` (sight rows → SIGHTS + geoout), `_kyoto_food.py` (food rows → FOOD + geoout), `_kyoto_push.sh`
  (pull, regenerate a conflicted GEOCODE-BACKLOG, push; run under the lock).
- Search budget used this session: ~170 (main ~152 + pin worker 18). Per-batch counts are in AUDIT.md.

## In-flight wave
- none (W2 closed cleanly at each batch).

## Next wave plan (W3) — ordered, with the cheapest proven techniques
1. **Held leads first (1 search each, or fewer):** Shōkoku-ji, Rozan-ji, Daihōon-ji, Honnō-ji, Shinsen-en, Tōji-in, Seigan-ji, Goō Shrine,
   Funaoka Onsen, Kurama Onsen, Ōmi Jingū, Ukimidō, Fukuchiyama Castle, Gokō-no-miya, Bishamon-dō (all have Wikipedia/ja coords and need a
   2nd source). Use kyoto.travel / japan-guide domain-filtered OR-queries of ≤5 names.
2. **Michelin food by ward** (FSHMI, RKHKU, KYFU, UJI thinnest): `allowed_domains=["guide.michelin.com"]` "Kyoto <ward> Bib Gourmand
   restaurant cuisine address" → then a pin query "<A>; <B>; <C> Kyoto address latitude longitude". Held for a dish/cuisine: Oito, Tan,
   Eitaroya, Muromachi Kaji, Nishijin Hashimoto, Shimogamo Saryo/Ichima, middle, Kenya, Nakazen, MOKO, KOKAGE, TOKI, Kyoboshi,
   Bistro Yanagihara, BOCCA del VINO, Menya Inoichi, Ike Edoyakiunagi Asahitei (Nara). UNVERIFIED pins: Okakita, Shutei Bankara.
3. **Non-Michelin canon (needs ≥2 editorial):** Demachi Futaba (mame-mochi), Kazariya/Ichiwa (aburi-mochi), Kagizen Yoshifusa, Inoda Coffee,
   Smart Coffee, Rokuyōsha, Okutan / Junsei (yudofu), Honke Owariya, Matsuba (nishin soba), Ippodō, Taihōan, Kizakura Kappa Country,
   Fushimi Yume Hyakushu, Torisei. Pair kyoto.travel feature pages with japan-guide / ja.wikipedia (many old shops have ja articles with coords).
4. **Sights fill** per area via ja.wikipedia 座標 batches (5–6 names known to have articles) + JG/KT second source.
5. **Creators (§2a):** still 0 vetted. Try named creators directly (e.g. "Paolo fromTOKYO Kyoto", "Abroad in Japan Kyoto", "Kyoto
   Foodie" (local English site), "Inside Kyoto" (Ruth Kenny, guidebook author)); attach only with a findable place-specific piece.
6. Re-verify med pins (Pontochō, Togetsukyō, Kamishichiken, Nara Park, Mount Wakakusa, Botanical Gardens, Enryaku-ji, Heijō, Shimabara,
   Philosopher's Path, Gion & Hanamikoji, Higashiyama District) and run `node tools/research.js --statuscheck kyoto`.
Commands: `python3 tools/density.py kyoto`; `flock -w 3600 .git/cleo-shared.lock python3 tools/rebuild-city.py kyoto --build`;
`cd tools && npm run validate && npm test`; push via `flock … data/kyoto-research/_kyoto_push.sh`. Refresh CARD:kyoto counts + CITIES.md row.

## Acceptance
- [ ] every area ≥ target · [ ] sourcecheck PASS · [ ] geocheck PASS · [ ] statuscheck CONSISTENT, 0 unchecked
- [x] buildcheck PASS · [x] `npm run validate && npm test` green · [x] Japan hub card live · [x] CITIES.md row
