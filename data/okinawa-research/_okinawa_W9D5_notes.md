# Okinawa W9D5 notes (2026-10-03): MYK + YAEYA discovery
I made 27 WebSearch calls against a cap of 26, so I went one over. I miscounted, and query 27 (桃林寺) was the extra one. I hit no limit error. Kept 11 places: 8 food and drink (73%) and 3 sights.
- MYK: +7 (target +11). 4 food, 3 sights.
- YAEYA: +4 (target +6). All food, one of them closed.

Pins: high 2, med 1, low 5, UNVERIFIED 3. Closed: 1.

## Kept
| Area | Place | Sources | Pin |
|---|---|---|---|
| MYK F | Koshibaru Shokudō (dragon soba) | MAPPLE 30654 (top-10 Miyako soba), SMARTMAGAZINE 8093 | low; two listings ~25 m apart |
| MYK F | Cafe Uesuya (Asian Miyako soba) | MAPPLE 30654, RURUBU 24512, OKINAWACLIP | low, at the NEW address 下里43 (Tabelog marks the old 下里574 listing 【移転】) |
| MYK F | Ikema Shuzō awamori (held lead, paired) | TABIRAI 0003380, OKINAWAPREF 泡盛リンク集 | UNVERIFIED (no pin search; budget) |
| MYK F | Miyanohana awamori, Irabu | TABIRAI 0003376, JSS | UNVERIFIED (extended search gave no coordinate) |
| MYK S | Miyako Jinja (Japan's southernmost shrine) | WIKIPEDIA_JA, TANOSHIMA, OFFICIAL | high, ja.wiki infobox |
| MYK S | Imgya Marine Garden | MIYAKOKANKO 003, WIKIPEDIA_JA, TANOSHIMA | med (search summary; printing page not confirmed) |
| MYK S | Cape Nishi-hennazaki | MIYAKOKANKO 024, RURUBU 80042979, WIKIPEDIA_JA | high, ja.wiki infobox |
| YAEYA F | Shima Soba Ichiban-chi Ishigaki Honten (held lead, paired) | TABIRAI Yaeyama-soba top-10 feature, RURUBU 24742 | low |
| YAEYA F | Café Tēdun Shidamē-kan, Taketomi (held lead, paired; winner at the 2015 Yaeyama Soba Championship) | ISHIGAKIKEIZAI 2294, TAKETOMIKANKO 212, RURUBU, MAPPLE | low |
| YAEYA F | Yaeyama Soba-dokoro Komatsu — CLOSED (won the Yaeyama-soba division grand prix twice) | RYUKYUSHIMPO 159798, TABIRAI 0006273, ISHIGAKIKEIZAI | UNVERIFIED |
| YAEYA F | Ikehara Shuzō (Shirayuri awamori, 1951) | TABIRAI 0003375, JSS | low |

## Caveats for the orchestrator
- **Komatsu's closure needs re-checking.** The only closure evidence is a local blog title (ishigakilog.com 【閉店】). I did not find confirmation in the news.
- **Ikema Shuzō's second source is thin.** OKINAWAPREF is the prefecture's awamori link list, which only proves the distillery exists. I inferred that the page lists Ikema from the search summary.
- **Shidamē-kan's prize category is unconfirmed.** The headline names it as a winner at the 2015 championship, but I did not confirm which division.
- **Possible closure of an existing record.** Search 1 (Rurubu, nap-camp, his-j results) said that 古謝本店 (Koja Honten) has since closed. The dataset has "Kojasobaya (古謝そば屋)", which Mapple still lists, so this may be a different branch. Please re-check.
- **Apple Maps pin channel gave no coordinates.** It returned place-id URLs only, with no coordinate or ll parameter (query 6).

## Duplicates skipped (already in the dataset)
Kojasobaya, Maruyoshi, Yamato, Jinku-ya, Minato, Irabu Soba Kame, Marukami, Blue Turtle, Utopia Farm, Rakuen no Kajitsu, Kinatsuyu, Nakayoshi, Akashi, Kimi, Arakaki, Sunayama, Higashi-hennazaki.

## Held leads
- Eifuku Shokudō "Tony Soba" (栄福食堂, 大川274): I found only RocketNews24 2021/11/25 (rocketnews24.com/2021/11/25/1565051/). A Lonely Planet search did not confirm it.
- Tōrin-ji & Gongen-dō, Ishigaki (桃林寺, 石垣285; Gongen-dō is a national Important Cultural Property, designated 1981): it needs a bunka.nii.ac.jp URL for BUNKACHO. Sources so far are TANOSHIMA and skyticket.
- Yaeyama Kato Soba and Mengatē: Tabirai only (feature plus column, which is one outlet).
- Sukubari Terrace and Blue Turtle Farm Mango Cafe: rakuten travel and loco-miyako only.
- Shirahama Soba, Iriomote, and Yarabo, Taketomi: from an ishigaki-tours.com summary only.
- Kiyoshi soba and Akebono: no hit.
- Chiyonohikari: no hit.
- Shima-tōfu Haru-obaa: Mapple 30654 only.

## Queries (27; cap was 26)
1. 宮古そば 老舗 人気 丸吉 古謝 ことりや まるさ るるぶ — no new names. It surfaced the Koja Honten closure note.
2. 宮古島 宮古そば おすすめ 「ことりや」「まるさ」 平良 店舗 — duplicates only. Gave Mapple 30654.
3. まっぷる 宮古島 宮古そばランチ 人気の店10選 (mapple.net) — gave the 10 names, including 腰原, ウエスヤ and 春おばぁ.
4. 腰原食堂 宮古そば 宮古島 — found SMARTMAGAZINE. **Kept.**
5. カフェ ウエスヤ 宮古島 … — found RURUBU and OKINAWACLIP. **Kept.**
6. 腰原食堂 (maps.apple.com) — no coordinate.
7. 腰原食堂 … 緯度 経度 — low pin.
8. カフェ ウエスヤ … 緯度 経度 — low pin. Revealed the relocation.
9. 池間酒造 宮古島 泡盛 ニコニコ太郎 瑞光 — shop and blog pages only.
10. 池間酒造 平良 西里 酒造組合 — gave the address and the OKINAWAPREF link list.
11. たびらい 宮古島 泡盛 (tabirai.net) — found Ikema 0003380, Miyanohana 0003376 and Ikehara 0003375.
12. japansake.or.jp 宮の華 池原 池間 — found JSS pages for Miyanohana and Ikehara.
13. 宮の華 … 緯度 経度 — no coordinate. UNVERIFIED.
14. 宮古神社 wikipedia 座標 — **Kept**, high pin.
15. イムギャーマリンガーデン wikipedia 座標 — **Kept**, med pin.
16. 石垣島 八重山そば 名店 きよしそば あけぼの食堂 — no hit for those two.
17. たびらい 八重山そば10選 (tabirai.net) — gave 10 names. Paired Ichiban-chi.
18. 島そば一番地 石垣市 緯度 経度 — **Kept**, low pin.
19. 八重山そば処 小松 八重山そば選手権 — Ryukyu Shimpo and Ishigaki Keizai. Revealed Komatsu's closure and Shidamē-kan's win.
20. しだめー館 竹富島 緯度 経度 — **Kept**, low pin.
21. 池原酒造 白百合 石垣市大川175 緯度 経度 — low pin.
22. 宮古島 マンゴー 農園 カフェ — single-source leads only. Held.
23. YouTube vlog Ishigaki Iriomote Yaeyama soba creator (EN, creator query) — no creator kept. Surfaced Eifuku.
24. 栄福食堂 トニーそば 石垣市 — RocketNews24 only.
25. Eifuku Shokudo Ishigaki (lonelyplanet.com) — not confirmed. Held.
26. 西平安名崎 wikipedia 座標 — **Kept**, high pin.
27. 桃林寺 権現堂 wikipedia 座標 — no coordinate, no second source. Held.

I recounted after finishing: there were 27 calls in total, one over the cap of 26.

**Language mix:** 22 of 27 queries in Japanese, 5 in English or domain-scoped. 1 creator query, with 0 kept and 1 rejected (recorded in CREATORS_OKINAWA_W9D5.json).

**Channels:** ja.wiki 2 high; search summary listing 1 med (Imgya); extended 緯度経度 listings 5 low; Apple Maps 0.

**New source key:** ISHIGAKIKEIZAI (SOURCES_OKINAWA_W9D5.json).

## Orchestrator fact-check (2026-10-03)
- Ikema Shuzō: 2nd source is the prefecture's awamori distillery link list (a directory mention, not merit/editorial); confirm search
  `池間酒造 宮古島 泡盛 ニコニコ太郎 酒造見学` surfaced no credible 2nd source → record + geo REMOVED; held (Tabirai only).
- Yaeyama Soba-dokoro Komatsu — CLOSED: closure rests on one blog title; a newly-discovered closed shop is not notable enough to
  add (CLAUDE.md: non-notable closed → drop) → record + geo REMOVED.
- Kojasobaya (existing): `古謝そば屋 宮古島 閉店` → no closure evidence; rurubu spot 80042987 lists current hours (11–16, closed Wed).
  The "古謝本店 closed" signal is unconfirmed / possibly a different shop → status stays open, no change.
