# Okinawa W10D5 notes (2026-10-03): MYK + YAEYA + KRM (food)
I made 27 WebSearch calls against a cap of 26, so I went one over (miscount). There was no limit error.

Kept 9 places: 8 food and drink, 1 sight.
- MYK: +5 food (need +5, target +6). Sumubari, AOSORA PARLOR, Kaimiru, Haru-obaa (held lead, paired), Ōbanmai.
- YAEYA: +2 (need +3, target +4), 1 food and 1 sight. **Short by 1.** Taira Shōten (food) and Tōrin-ji & Gongen-dō (sight, held lead, closed with BUNKACHO).
- KRM: +1 food (need +1, target +2). YUNAMI FACTORY (held W9D4 lead, paired).

Pins: 6 low, 0 med, 0 high. UNVERIFIED 3 (Ōbanmai, YUNAMI, AOSORA), all for lack of budget. Closures 0.
New source key: ISHIGAKICITY (SOURCES_OKINAWA_W10D5.json).

## Kept
| Area | Place | Sources | Pin |
|---|---|---|---|
| YAEYA F | Taira Shōten (Yaeyama-soba grand prix, 3rd championship 2017) | TABIRAI col 0008194, OKINAWATIMES 1474812 (FamilyMart cup noodle it supervised), MAPPLE spot 47013341, OTV 81369 | low (two listings 9 m apart) |
| YAEYA S | Tōrin-ji & Gongen-dō (national Important Cultural Property, 1981) | BUNKACHO bunka.nii.ac.jp 158195, ISHIGAKICITY list 573, YAEYAMAVB | low (one listing) |
| MYK F | Oshokujidokoro Sumubari, Karimata (octopus soba) | TABIRAI article-49320, SMARTMAGAZINE 10882 | low |
| MYK F | AOSORA PARLOR, Kurima (mango smoothie) | TABIRAI col 0007961, MAPPLE spot 47012962 | UNVERIFIED |
| MYK F | Kaimiru, Ikema (sazae soba) | TABIRAI 49320, TANOSHIMA kaimiru | low |
| MYK F | Shima Tōfu Haru-obaa Shokudō (yushi-dōfu soba) | TABIRAI 49320, MAPPLE 30654 | low |
| MYK F | Ōbanmai Shokudō, Irabu (fishing co-op bonito bowl) | TABIRAI 49320, RURUBU 8870 | UNVERIFIED |
| KRM F | YUNAMI FACTORY, Kume (garlic kuruma prawns) | SMARTMAGAZINE 26076, TABIRAI col 0009043 | UNVERIFIED |

## Caveats for the orchestrator
- **Ōbanmai's Rurubu 8870 attribution was not pinpointed.** An exact-phrase query "おーばんまい食堂" restricted to Rurubu, OCVB, Mapple and other outlets returned Rurubu 8870 as the only non-jalan hit, and the summary described the menu. I did not see the article text.
- **Ōbanmai has no street number.** Its address is given at port level only.
- **The Tōrin-ji pin rests on one aggregator listing** (fashion-press / omairi).
- **AOSORA PARLOR's merit is modest.** It rests on travel-media features only. I graded it t3.
- **TABIRAI 49320 (the nine Miyako soba shops locals vouch for) supports 4 of the 5 MYK places.** The second source differs for each place.

## Held / dropped
- **Eifuku "Tony Soba":** query 3 found no 2nd source. Still held (RocketNews24 only).
- **Kato Soba:** this is 八重山 嘉とそば, Tabirai col 0008549 only (and Tabirai again). Still held.
- **Mengatē:** no hit.
- **Ikema Shuzō:** only directory mentions (OCVB awamori distillery list, a Miyako Mainichi event listing). There is no editorial or merit source. Still held.
- **Kihachi (Kume):** Rurubu spot 80043426 only. Tabirai feature10 was not confirmed to name it. Still held.
- **Kutsurogi-ya Nanbika (Kume):** Tabirai col 0009049 only. Held.
- **Māsā no Mise:** I did not spend a search on it. Still held.
- Gyoichiba Ichiwa, Sarahama (Irabu): only aggregator and PR sources (Ryukyu Shimpo prentry is PR). Held.
- Kikuei Shokudō and Izakaya Kurobē (Miyako): Tabirai only. Held.
- Kanifu (Taketomi): Rurubu spot 80043575 plus a Mapple region directory list. The confirm search missed. Held.
- Seaside (Kohama): Tabirai only. Held.
- Yarabo (Taketomi): Tabirai col 0003138 only. Held.
- Shimayumebito (Kohama) and HaaYa nagomi-cafe (Taketomi): Mapple list or jalan only. Held.
- Yakiniku Kinjō (Ishigaki): jalan only. No editorial confirmation. Held.

## Queries (27; cap was 26, one over)
I miscounted during the run, and call 27 (the かにふ confirm) was the extra one. I hit no limit error.
1. 桃林寺権現堂 重要文化財 石垣 (bunka domains): miss.
2. 権現堂 沖縄県石垣市 文化遺産オンライン (bunka + city domains): found bunka.nii 158195 and the city list. **Gongen-dō kept.**
3. 栄福食堂 トニーそば: miss. Held.
4. 「かとうそば」「めんがーてー」: miss. Surfaced Taira Shōten.
5. 平良商店 選手権 優勝: confirmed the grand prix.
6. 平良商店 登野城 (editorial domains): found TABIRAI, OKINAWATIMES and MAPPLE. **Kept.** Revealed Kato Soba = 嘉とそば.
7. 池間酒造 (editorial domains): directory only. Held.
8. 宮古島 スイーツ マンゴー 雪塩 カフェ: found the AOSORA, irayoi and Terrace OHAMA leads.
9. AOSORA / irayoi (open web): aggregators.
10. AOSORA PARLOR (editorial domains): found TABIRAI and MAPPLE. **Kept.**
11. Tabirai Miyako gourmet 19選: duplicates plus Kurobē.
12. Tabirai Miyako soba 名店9選: got the 9 names.
13. すむばり 海美来 菊栄 おーばんまい (editorial domains): found SMARTMAGAZINE (Sumubari) and TANOSHIMA (Kaimiru). **Both kept.**
14. Sumubari pin (extended): low.
15. Kaimiru pin (extended): low.
16. Haru-obaa pin (extended): low.
17. 魚市場いちわ: aggregator and PR only. Held.
18. おーばんまい食堂 (editorial domains): found Tabirai col 0008683 and Rurubu 8870.
19. "おーばんまい食堂" exact phrase: Rurubu 8870 the only editorial hit. **Kept.**
20. Kume gourmet 喜八 車えび: Kihachi rurubu only; YUNAMI and Nanbika leads.
21. 喜八 YUNAMI 南美花 (editorial domains): found SMARTMAGAZINE and TABIRAI for YUNAMI. **Kept.**
22. 小浜 竹富 西表 グルメ (editorial domains): got the list of names.
23. HaaYa / かにふ / シーサイド: single-source each. Held.
24. 石垣牛 焼肉 金城: jalan only. Held.
25. 平良商店 pin (extended): low. Surfaced OTV 81369.
26. 桃林寺 pin (extended): low. Also gave YAEYAMAVB.
27. 竹富島 かにふ (editorial domains): miss. Surfaced Yarabo (Tabirai only).

Language mix: 25 of 27 queries in Japanese. No creator query. Apple Maps not used (per W10 rules).
