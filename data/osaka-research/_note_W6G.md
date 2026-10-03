# W6G geocode pass — _unrendered_W6.json (101 places)

Searches used: 29 / 30 (WebSearch only; no WebFetch).
Pins written: 0 high, 0 med. `geo/_geoout_osaka_W6G.json` = `[]`. Nothing was fabricated.

## Channels tried
- ja.wikipedia 3-per-query 座標 batches (8 queries): 道具屋筋, 上方浮世絵館, だんじり会館, 鍵屋資料館, 壇上伽藍,
  舞洲SSP, サンタマリア, キララ九条, 利晶の杜, 中座くいだおれビル, 551蓬莱, 自由軒, 夫婦善哉, 天保山渡船場, 鶴橋商店街,
  平尾本通, 灘五郷, ニテコ池, 大仙公園, かに道楽, 金龍, たこ梅, 老祥記, 神戸風月堂, にしむら珈琲店.
  Articles exist for 千日前道具屋筋商店街, 鶴橋商店街, 大阪市の公営渡船, 自由軒, 金龍ラーメン, かに道楽, どうとんぼり神座,
  金久右衛門, 神戸にしむら珈琲店, 灘五郷, 大仙公園 — but none exposed an own-place infobox coordinate in results.
- Single-article 北緯/東経 queries (4): only area/neighbour coords surfaced (千日前 area, 鶴橋町, 道頓堀 area).
- guide.michelin.com (9): no venue lat/lng for Udonya Kisuke, Yoshino(sushi), Usamitei Matsubaya, Mimiu, Kitahama Anagoya, Kobe steak.
- en.wikipedia (3) + openstreetmap.org (1): only parent coords (Mount Kōya, KIX airport) — none usable.

## Rejected (proxy / centroid coordinates — NOT pins)
- Danjō Garan: 34.21250,135.58639 = Mount Kōya article coordinate, not the Garan.
- Maishima Seaside Park: 34.664222,135.395139 = Maishima island coordinate.
- Sky View: 34.43056,135.23028 = KIX airport coordinate.
- Sennichimae Doguyasuji: 34.667444,135.504511 = 千日前 district coordinate.
- Tsuruhashi Market: 鶴橋町 34.66366,135.53516 / 鶴橋駅 34.66535,135.53130 — area/station only.
- Shin-an/Ōbai-an: 大仙公園 34.558639,135.482333 = park coordinate (large park; tea houses in the Japanese garden).
- Meoto Zenzai: 法善寺 34.667861,135.502639 (temple next door) — a neighbour, not the shop.
- Tempozan ferry: 天保山 hill coordinate only.

## Findings for the main session
- **Mashino Ken**: Michelin venue page gives 34.673359,135.517416 — ~1.5–1.6 km SE of 1-3-6 Awajimachi
  (Awajimachi 1-chome is ≈34.688,135.508). Confirms the reported mismatch; do NOT use. Either the Michelin pin is
  wrong or the restaurant moved — needs an address re-check before pinning.
- **Mandarake Grand Chaos**: en.wikipedia (Mandarake) places it in **Amerikamura** (Nishi-Shinsaibashi), not
  "4-12-6 Nipponbashi" as in the dataset — address likely wrong; re-verify.
- Michelin's site did not return a page for "Yoshinosushi"; a "Yoshino" Osaka venue page exists
  (guide.michelin.com/sg/en/osaka-region/osaka/restaurant/yoshino) — lat/lng not surfaced.
- Conclusion: WebSearch summaries don't relay ja.wikipedia infobox coordinates for small venues; remaining 101 need
  the browser geocoder (tools/geocode-helper.html) or a manual Google `!3d!4d` pass.
- Status: no new closure evidence found; existing statuses unchanged.
