# W7M note: BAY close-out, round 3 (2026-10-03)

Searches used: 31 / 32. That count includes 1 call rejected with an API 400 because asahi.com isn't allowed in allowed_domains.
WebSearch only: no WebFetch, no git, nothing fabricated. Every URL cited appeared in my own results.

## Written: 3 BAY (1 food, 2 sights). This meets the BAY +3 discovered gap.
- **Minoya** (みのや, Nishikujō horumon, 1973; food t3, WAGYU):
  - Sources: TVTOKYO Adomachi 2024-08-17 "6つの商店街" segment (145170) + TIMEOUT 西九条でしかできない8のこと. Promoted from the W6/W7B hold.
  - Dish (from Time Out): horumon moriawase.
  - Address: ward/locality only, because no street number surfaced. Pin unverified (MapFan returned no matching spot).
  - Caveat: I matched the TV Tokyo "1973 horumon-teppan shop with an elderly owner" to Time Out's "tare kept since founding" みのや by name and locality. Both are in Nishikujō, Konohana.
- **Senbonmatsu Ōhashi / Megane-bashi** (千本松大橋; sight t3): WIKIPEDIA + OSAKACITY (kensetsu 0000023565) + MAPPLE spot 10000140. Pinned **high** from the ja.wiki 座標 (34.6325139, 135.4759194).
- **Namihaya Ōhashi** (なみはや大橋; sight t3): WIKIPEDIA + OSAKACITY (kensetsu 0000023822) + OSAKAMETRO (osakamania bridge_02). Pinned **high** from the ja.wiki 座標 (34.643694, 135.449833).
- Pins: 2 high, 1 unverified.

## Queries run
1. Michelin Minato/Taishō/Konohana (EN). Only Sakamoto (have) and Tonkatsu Minato surfaced.
2. Tonkatsu Minato address: 2-9-26 Shimanouchi, Chūō-ku. It's already in the dataset as MINAM, so not BAY.
3. 九条 ミャンマー カレー 酒と飯: Walkerplus only.
4. 九条 名店 (lmaga/rurubu/mapple): returned Kyoto noise.
5. 大正区 沖縄料理 名店 (editorial domains): found Walkerplus 191650 (same key as 107265), which names Kariyushi, Yunta, Yamaneko, Omoro and Uruma Goten.
6. やまねこ (mapple/rurubu/lmaga/osaka-info/metro): no 2nd key.
7. osaka-info Little Okinawa article: only Sawashi Shoten (have) and a Daily Yamazaki store.
8. Michelin Kujō/Nishi-ku: Daidokoro Kamiya and Oribe, both already CHUO.
9. Michelin JP 港区/大正/此花: nothing in BAY. **The Michelin channel for BAY is exhausted.**
10. みのや 西九条 (editorial domains) → 11. Time Out 西九条 みのや (confirmed) → 12. tv-tokyo みのや (found 145170).
13. MapFan みのや: no match.
14. あたりや (editorial + tv-tokyo): TVTOKYO 145183 only.
15. Rejected call (asahi.com domain).
16. あたりや 洋食焼 (city/timeout/metronine/osaka-info/kobe-np): nothing.
17. Time Out 西九条 8 article mining (names below).
18. tv-tokyo Adomachi Konohana episode: Yasubei, Atariya, Kobayashi Shōten, 6 shopping streets.
19. まえちゃん 西九条: no hit. Surfaced Walkerplus 142389 (a Taishō maguro shop).
20. Walkerplus 142389 shop name: Kaisen Yatai Yūdanmaru.
21. ケニチ ゆうだん丸 creator check: only Walkerplus pages surfaced, no direct video URL.
22. ゆうだん丸 (mapple/rurubu/lmaga/metro/mapfan/timeout): nothing.
23. ja.wiki 座標 batch: 千本松大橋, なみはや大橋, 茨住吉神社 (all 3 returned).
24. 千本松大橋 2nd source (city + mapple).
25. 茨住吉神社 2nd source: the summary confused it with Nishikujō Jinja (Konohana), so I didn't use it.
26. なみはや大橋 2nd source (city + osakamania).
27. 朝食場ながやど (editorial domains): nothing.
28. MapFan 安兵衛 西九条: only namesakes in other cities.
29. MapFan アアベルカレー: no spot page.
30. 弁天町 市岡 老舗 喫茶: osakamania Kissa Coco.
31. 喫茶ココ 2nd source: nothing.

## Held (key it has → what's missing)
- **Kaisen Yatai Yūdanmaru** (海鮮屋台 ゆうだん丸, 1-9-1 Sangen'ya-nishi, Taishō; maguro-katsu, nakaochi sashimi; sembero):
  WALKERPLUS 142389 only. The YouTuber ケニチ found it, but the only evidence I have is the Walkerplus article (no video URL), so I didn't count the creator as a separate key.
- **Kissa Coco** (喫茶ココ, 3-3-27 Namiyoke, Minato-ku; Shōwa kissaten founded 1958, opens 6:30): OSAKAMETRO junkissa_08 only. One more key promotes it.
- **Time Out 西九条8** names (TIMEOUT only). Japanese names are as the search summarizer romanized them, so confirm before reuse:
  - an oden/fresh-fish creative izakaya (煮えこてなんぼ…おでん…)
  - "Maechan", an izakaya run by an ex-tuna seller
  - a 1952 izakaya, "Sengoku Sakagura"(?)
  - kissa "New Mako" (¥400 morning set)
- **Kobayashi Shōten** (小林商店, Konohana liquor shop, founded 1898): TVTOKYO Adomachi 2024-08-17 only. I didn't confirm a dish or kakuuchi service.
- **Atariya**: TVTOKYO 145183 only. Two more queries found nothing.
- **Ibaraki Sumiyoshi Jinja** (茨住吉神社, Kujō, Nishi-ku): WIKIPEDIA only. Pin in hand: 34.675306, 135.478000.
- **Okinawan places with WALKERPLUS only**: Kariyushi (かりゆし, owner is a Noborikawa-ryū min'yō master, sanshin live on Saturdays) and Okinawa Saka Yunta (沖縄酒家 ゆんた). Both are in Walkerplus 191650/107265, which count as one key.
- **No 2nd key surfaced** for: Sake to Meshi, Yamaneko, Chōshokuba Nagayado. Not retried: Dairokudō, Usupare Hōnen, Ichariba, Sōjuen.
- **Yasubei, Aabel Curry**: already written with 2+ keys (W5A). They're unrendered only for lack of a pin, and MapFan had no spot page for either.

## MEASURED & DROPPED
- Tonkatsu Minato, Daidokoro Kamiya, Oribe: Michelin, but not BAY and already in the dataset.

## Creator channel
- 1 query: ケニチ, a sembero YouTuber featured in the Walkerplus series. Nothing was attached: no direct piece by him surfaced and his following isn't verified. No CREATORS file written.
