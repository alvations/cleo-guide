# G05 — pin unpinned restaurants (2026-10-03)

Output: `geo/_geoout_hokkaido_g05.json` via `_g05_pins.py` — **5 pins (4 high, 1 med), all S rows; 0 food rows pinned.**
Searches used: 22 / 30.

## Pinned
| name | coord | conf | source |
|---|---|---|---|
| Pokémon Center Sapporo | 43.067583,141.349306 | med | ja.wiki 大丸札幌店 infobox (shop on Daimaru 8F) |
| Wakkanai Fukukō Market | 45.40861,141.67667 | high | ja.wiki 稚内副港市場 (own article) |
| Ikeda Wine Castle | 42.919167,143.457778 | high | ja.wiki 池田町ブドウ・ブドウ酒研究所 ("ワイン城") |
| Tokachi Hills | 42.863333,143.243333 | high | ja.wiki 十勝ヒルズ (own article, 幕別町) |
| Ueno Farm | 43.808333,142.48575 | high | ja.wiki 上野ファーム (own article) |
Status/statusSource kept from w30/w40/w84.

## Queries (WebSearch; ja.wikipedia unless noted)
1. 北海道ワイン; 花畑牧場; 日本清酒(千歳鶴) 座標 → company articles, addresses only, no coords.
2. 横山家 江差; 池田ワイン城; ふらのワイン工場 → HIT 池田ワイン城. 横山家 only Esashi town-hall coord (not used).
3. (open web) すみれ 札幌すすきの店 google maps "!3d" → no place pin.
4. (open web) Lucky Pierrot Bay Area google.com/maps/place → no place pin. **Google `!3d!4d` line stopped after 2 fails.**
5. 上川大雪酒造; 二世古酒造; ニセコ蒸溜所 → articles exist, no coords.
6. 大丸札幌店; ぷらっとみなと市場; 稚内副港市場 → HIT 大丸札幌店, 稚内副港市場. Platto: only 苫小牧市公設地方卸売市場 article, Platto described as *adjacent* → not used.
7. 雪印パーラー; 大雪地ビール館; 小樽出抜小路 → no coords (地ビール館 address only; 出抜小路 only Otaru Canal generic coord — not used).
8–9. (open web) Okushiba / Hokuren building lot check — see below.
10. 白金温泉; 八幡坂; カムイワッカ湯の滝 → no coords surfaced.
11. カムイワッカ湯の滝 北緯 → only national-park coord (not used).
12. 姫沼; オタトマリ沼; 島武意海岸 → no coords surfaced (島武意海岸 article exists).
13. 島武意海岸 北緯 → no coord surfaced.
14. (open web) 花畑牧場 GPS 緯度経度 → dead end (address only).
15. 小樽市鰊御殿; 旧青山別邸; 阿寒国際ツルセンター → articles, no coords surfaced.
16. 阿寒国際ツルセンター 北緯 → only Akan-chō town coord (not used).
17. 太陽生命札幌ビル; 大丸藤井セントラル; ホクレンビル → re-confirmed Hokuren 43.06694,141.35417; surfaced 北農ビル.
18. 北農ビル → 43.066361,141.354361; article says JA共済ビル and **ホクレンビル are adjacent** buildings.
19. 新富良野プリンスホテル; 星野リゾート トマム; 十勝ヒルズ → HIT 十勝ヒルズ. Tomamu resort coord not used for Unkai Terrace (mountaintop, km away).
20. 新富良野プリンスホテル 風のガーデン → the 43°20'25" coord is attributed to 富良野プリンスホテル ("別施設"), so **not** used for Kaze no Garden (ambiguous host).
21. 上野ファーム; 紫竹ガーデン; 大湯沼 → HIT 上野ファーム. 大湯沼 coord came without its own article (likely 登別温泉 page) and the footbath is downstream on 大湯沼川 → not used. 紫竹ガーデン: no coord.
22. 余市ワイナリー; オチガビ; 富良野チーズ工房 → town coord only (not used).

## Okushiba / Ichiryūan — W80 flag re-verify
- Shops (mapple, open web): 北4条西1-1 ホクレンビル B1F. Hokuren HQ (ja.wiki + houjin.jp): 北四条西1丁目3, coord 43.06694,141.35417.
- 北農ビル (北4西1, 43.066361,141.354361) is a *different, adjacent* building; ホクレンビル is its neighbour on the same 北4西1 block. The two points are ~65 m apart.
- Verdict: the shops name ホクレンビル as host, and the HQ article's coordinate is for that building; the 1-1 vs 1-3 lot difference is a postal-vs-registered lot on one block. **Keep W80 pins at `med`** (block-level ≤~70 m error), no change needed; could only become `high` with an own-building coordinate for ホクレンビル, which no search surfaced.

## Why no food pinned
Remaining unpinned food are mostly street-front shops in unnamed buildings; the hosts that have ja.wiki articles (company articles: 北海道ワイン, 花畑牧場, 日本清酒, 上川大雪酒造, 二世古酒造, 大雪地ビール, 雪印) carry **no infobox coords**. The Google `!3d!4d` channel never surfaces place pins in WebSearch. Rejected-as-too-coarse remain rejected (ROYCE' at airport, Hekiun-gura on the Obihiro Univ. campus, Platto adjacent to the wholesale market). Next channel worth trying: official sites that embed lat/lng in text (rare), or a browser geocoding pass (tools/geocode-helper.html) by a human.
