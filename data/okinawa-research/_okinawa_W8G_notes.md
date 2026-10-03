# W8G notes — geocoder, UNVERIFIED backlog (todo 83, 7 anime skipped for W8A), 2026-10-03

Searches: 30/30 (cap reached, no limit error). WebSearch extended, one place per query.
Output: geo/_geoout_okinawa_W8G.json — 14 records (2 med, 12 low), all exact `n` from _okinawa_geo_todo_W8G.json.

## Query log (# · query · outcome)
1. 比屋定バンタ 久米島 wikipedia 座標 — no venue coords (only Kume island centroid; rejected).
2. 高月山展望台 座間味 navitime 緯度 経度 — NAVITIME Travel 02301-t4212 26.230503,127.309271 → med.
3. 湧出展望台 伊江島 緯度 経度 — only Ie island centroid; rejected.
4. 比屋定バンタ navitime 緯度 経度 — NAVITIME poi 02301-pn0003368 exists, no coords in results.
5. 稲崎展望台 座間味 navitime 緯度 経度 — NAVITIME poi 00004-47163800005 26.242037,127.295345 → med.
6. 神の浜展望台 座間味 navitime 緯度 経度 — none (okinawastory.jp/spot/600010647 exists).
7. 阿波連園地 渡嘉敷 展望台 緯度 経度 — none.
8. 中の島ビーチ 下地島 navitime 緯度 経度 — NAVITIME poi 02022-10018870 exists, no coords (a returned 中之島 coord was Ogasawara — rejected).
9. 吉野海岸 宮古島 navitime 緯度 経度 — none; NAVITIME poi 02022-1028421; gltjp gives address 城辺新城15-38.
10. 忠孝酒造 伊良波556-2 緯度 経度 — none.
11. 八重泉酒造 石垣1834 緯度 経度 — 24.365843,124.145982 → low.
12. 高嶺酒造所 川平930-2 緯度 経度 — 24.4602461,124.1410254 → low.
13. たけさん亭 浜崎町2-2-4 — TableCheck 24.3400721,124.1507971 → low.
14. 金牛 美崎町8-8 — HotPepper 24.33902,124.15632 → low (NAVITIME 24.337713,124.154274 ~250 m off; flagged).
15. 久米島の久米仙 宇江城2157 — none.
16. 渡久山酒造 佐和田1500 — none.
17. 崎元酒造所 与那国2329 — 24.462694,123.000284 → low.
18. 伊江島蒸留所 東江前 — tabelog 26.708661,127.812807 → low.
19. Cafe ハコニワ 伊豆味2566 — 26.644149,127.955294 → low.
20. カフェこくう 諸志2031-138 — two listings agree 26.680224,127.941941 → low.
21. 食事処 錦屋 古宇利297 — none.
22. 民謡ステージ歌姫 東町17-11 — confirms relocation (2026-03-11, 東ふくろう館ビル1F); only OLD Kokusai-dōri coord surfaced → not used.
23. 金武鍾乳洞 龍の蔵 金武245 — none.
24. 田舎料理の店 蔵 久貝654-6 — 24.800209,125.269 → low (lng 3 decimals; flagged).
25. 東町17-11 東ふくろう館 歌姫 — tabelog dtlmap 47018767 marked 【移転】 (old point); no new coord → no record.
26. 辺銀食堂 石垣市大川 — tabelog 24.340205,124.158381, NEW address 大川199-1 → low.
27. ブルータートル 伊良部島 — 24.812799,125.181796 → low.
28. 忠孝蔵 豊見城 navitime — none.
29. 渡久山酒造 伊良部 navitime — none.
30. 光楽園 石垣市 — tabelog 24.395777,124.19507, NEW address 平得1535-19 → low (inland; flagged).

## Flags for 4b re-verify
Kingyū (two sources 250 m apart), Kura (coarse lng), Kōrakuen (inland Hirae), Yaesen & Sakimoto & Hakoniwa & Blue Turtle (printing page not isolated).

## New addresses surfaced (merge should update)
Pengin Shokudō → 大川199-1; Kōrakuen → 平得1535-19; Yoshino Beach → 城辺新城15-38 (not pinned); Utahime → 東町17-11 東ふくろう館ビル1F (not pinned).

## Still UNVERIFIED (searched, nothing usable — no record written)
Hiyajō Banta, Wajī lookout, Kaminohama, Aharen-enchi, Nakanoshima Beach, Yoshino Beach, Chuko-gura, Kumejima no Kumesen, Tokuyama Shuzō, Nishikiya, Ryū no Kura, Utahime (new site).
Not reached: all remaining todo entries.

## CLOSURES
None found.
