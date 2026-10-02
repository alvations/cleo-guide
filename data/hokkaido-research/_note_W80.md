# W80 — pin unpinned restaurants via Wikipedia host/own-article coords (2026-10-02)

Output: `geo/_geoout_hokkaido_w80.json` — 16 pins (3 high, 13 med). Searches used: 18 / 30.

## Queries (all WebSearch; ja.wikipedia unless noted)
1. 五島軒; 北菓楼 札幌本館/旧北海道庁立図書館; 大通ビッセ → HIT 大通ビッセ (北洋大通センター 43.061417,141.35250). Miss 五島軒, 北菓楼.
2. 北菓楼本館 / 五島軒本店旧館 / 旧北海道庁立図書館 北緯 → miss (addresses only).
3. 新千歳空港; 釧路丹頂市場; 北一硝子三号館 → airport ref point only (42.775,141.692 — airport-wide, NOT used for ROYCE'); 丹頂市場 no article; 三号館 no coord.
4. 小樽倉庫No.1; 田中酒造 亀甲蔵; はこだてビール → articles exist, no coords.
5. 大門横丁; 北の屋台; 丹頂市場 北緯 → miss.
6. 富良野チーズ工房; 柳月スイートピア・ガーデン; 美瑛選果 → HIT 柳月 (42.97444,143.17889).
7. 菓子工房フラノデリス → HIT (43.33806,142.36083, 下御料2156-1 = our address).
8. 柳月 HQ confirm → HQ 音更町なつぞら1-1; Sweetpia Garden built 2001 as factory+store and HQ moved there → same site.
9. ルタオ; なると; 伊勢鮨 → miss.
10. (en.wikipedia/wikidata) Gotoken; Lucky Pierrot; Otaru Soko No.1 → miss.
11. 旧木村倉庫; ニセコ高橋牧場; わかさいも本舗 → miss.
12. (open web) きのとや 大通公園店 大通ビッセ → walkerplus confirms KINOTOYA Café in 大通ビッセ 1F.
13. 大丸藤井セントラル; ホクレンビル; 札幌場外市場 → HIT ホクレン HQ (北4西1-3) 43.06694,141.35417.
14. (open web) ホクレンビル B1 一粒庵/奥芝商店 → both at 北4条西1-1 ホクレンビル B1F.
15. 山頭火; 蜂屋; 満寿屋 → miss (company articles, no coords).
16. 北海道立図書館 旧館 → building now 北菓楼 札幌本館 confirmed, but only the current Ebetsu library coord given → NOT used.
17. なると (飲食店) → company article, no coord.
18. (wikidata) Daimon Yokocho; Kita no Yatai; Hakodate Beer; Kitaichi Glass → miss.

## Reused registry host coords (no search needed; already sourced in data/geocodes.json)
二条市場 (high), 函館朝市 (high), 金森赤レンガ倉庫 (high), 阿寒湖アイヌコタン (high).

## High vs med reasoning
- HIGH: 大通ビッセ (the venue is the building's low-rise floors — the coordinate is its own building); 柳月スイートピア・ガーデン (article HQ = this site); 菓子工房フラノデリス (shop's own article, address matches).
- MED (shop inside one host building/market): 3 Nijō Market stalls; 5 Hakodate Morning Market shops (Kikuyo, Ekini Ichiba, and the 3 Donburi Yokochō stalls — 函館朝市 is a multi-block market, point error up to ~150 m); Hakodate Beer Hall in Kanemori warehouses; Poronno in Akan Ainu Kotan; KINOTOYA in BISSE; Okushiba + Ichiryūan in ホクレンビル — CAVEAT: shop address is 北4西1-1, the Hokuren HQ article gives 北4西1-3; both on the single 北4西1 city block (~100 m), so med, flag for re-verify.

## Deliberately NOT pinned
- ROYCE' Chocolate World: only the airport reference point (airport-wide) — too coarse.
- Curb-market shops (北のグルメ亭, まるさん亭): only coordinate is the 中央卸売市場 article point, an adjacent facility, not the 場外市場 itself — skipped.
- Tanukikōji shops (Bossa, Miyoshino): street — not allowed.
- 北菓楼 札幌本館, 五島軒, ルタオ, なると, 伊勢鮨, 山頭火, 蜂屋, 六花亭 stores, ハセガワストア, ラッキーピエロ, 北一ホール, 小樽倉庫No.1, 田中酒造亀甲蔵, はこだてビール, 大門横丁, 北の屋台, 丹頂市場 shop: no coordinate found → stay UNVERIFIED.
- Company-HQ coords elsewhere (六花亭 HQ ≠ 帯広本店) — not used.

Status: all left `open`; no source in these searches reported a closure (statusSource = the wave's first source).
