# W9G notes: geocoder for the UNVERIFIED backlog (todo 74), 2026-10-03

I used all 25 of 25 searches and hit no limit error. I skipped the 7 anime records (W9A has them) and the 5 records marked CLOSED.
Output is geo/_geoout_okinawa_W9G.json, with 6 records. All 6 are `low` and each uses the exact `n` from _okinawa_geo_todo_W9G.json.

## Apple Maps channel: measured yield 0 hits in 6 tries
- In this run, WebSearch with `allowed_domains:["maps.apple.com"]` returned only `maps.apple.com/place?place-id=…` or `?auid=…` URLs.
- None of those URLs carried `coordinate=` or `ll=`, so even a name match gives no point to pin.
- Most results were also unrelated places, and Japanese queries returned soba shops elsewhere in Japan.
- Because of this, I don't recommend the Apple channel for Okinawa as it behaves now.
- NAVITIME (1 try) and MapFan (1 try) returned no spot page with coordinates.

## Query log (# · query · outcome)
1. [apple] Tamanaha Shuzosho Ishigaki Okinawa: only Ishigaki POIs, no coordinates. 0.
2. [apple, ext] 今帰仁そば 諸志: unrelated soba shops. 0.
3. [apple] Zhyvago Coffee Works Chatan Mihama coordinate: "Zhyvago Coffee Roastery" place-id ID43A27F8298A2ADD, which is a different branch (美浜34-1 LeQu). It also had no coordinates. 0.
4. [apple] いまいパン 真地 那覇: no match. 0.
5. [apple] Player's Cafe Okinawa City Chuo Park Avenue: no match. 0.
6. [apple] Uezu House Kumejima Nishime: no match. 0. I stopped the Apple channel here.
7. [navitime] 玉那覇酒造所 石垣市石垣47: only a category list. 0.
8. 玉那覇酒造所 石垣市石垣47 緯度 経度: the address was confirmed but no coordinates came back.
9. 国泉泡盛 与那国町与那国2087 緯度 経度: no venue coordinates. The company was renamed どなん酒造 (welcome-yonaguni.jp/guide/508), and the dataset name already says Donan. A Yahoo map place aqfsDwYjB02 exists.
10. [ja.wiki] 国泉泡盛 本社所在地 北緯 東経: the ja.wiki article has no coordinates.
11. 今帰仁そば 今帰仁村諸志181 緯度 経度: three listings agree within about 12 m, at 26.696494,127.941469. Pinned as low.
12. いまいパン 真地本店 那覇市真地12-4 緯度 経度: no coordinates (Yahoo place aoIWCOd3B6Q exists).
13. パーラーみなと 北谷町港10-7 緯度 経度: no coordinates.
14. プレイヤーズカフェ 沖縄市中央2-6-47: tabelog 47030033 gave 26.33886,127.800243, and a second listing is about 5 m away. Pinned as low.
15. ぼくの店 おじさん 座間味13: 26.227133,127.303781. Pinned as low.
16. やっぱりステーキ 1st 松山1-34-3: tabelog dtlmap 47015276 gave 26.220311,127.676814, and the other listings agree. Pinned as low.
17. ジバゴコーヒーワークス 美浜9-46: 26.315833,127.753745. Pinned as low.
18. マリンボックス 渡嘉敷1779-2: no coordinates (tokashiki.info/shop/01301 and Yahoo place znVulqscoa2 exist).
19. 島ぐるめ ROCO 上原58: 24.433393,123.771792. Pinned as low.
20. 魂魄の塔 糸満市米須 北緯 東経: no coordinates (Yahoo place J4CKyo0SDSo exists).
21. 立神岩 与那国 展望台: no coordinates. jalan gives the lookout's address as 与那国町帆安上原.
22. [mapfan] 中の島ビーチ 伊良部佐和田: only address-index pages. 0.
23. 波照間酒造所 住所 緯度 経度: found the address 竹富町字波照間156, but no coordinates.
24. シンリ浜 久米島 navitime: found the address 久米島町字大原, but no coordinates.
25. 波照間酒造所 波照間156 緯度 経度: no coordinates (tabelog 47014924 exists).

## Pinned: all low
Nakijin Soba, Player's Cafe, Boku no Mise Ojisan, Yappari Steak 1st, Zhyvago Coffee Works and Shima Gourmet ROCO.

Flags for the 4b re-verify:
- For Ojisan, Zhyvago and ROCO, I couldn't tell which listing printed the coordinate.
- ROCO is in Uehara on Iriomote and should be checked against the 上原58 building.

## Address facts surfaced (the merge should update these)
- Hateruma Shuzōsho is at 竹富町字波照間156 (〒907-1751). The dataset address is island-level only.
- Shinri-hama is at 久米島町字大原.
- The Tachigami-iwa lookout is at 与那国町帆安上原.
- Kokusen Awamori is now どなん酒造 (formerly 国泉泡盛合名会社), at the same address, 与那国2087.

## Still UNVERIFIED (searched this wave, nothing usable; no record written)
Tamanaha Shuzōsho, Donan/Kokusen, Imai Pan, Parlor Minato, Marine Box, Konpaku-no-tō, Tachigami-iwa, Nakanoshima Beach, Hateruma Shuzōsho, Shinri-hama and Uezu House.

## Not reached
All the remaining todo entries (mostly records with only a town-level address).

## Closures
None found.
