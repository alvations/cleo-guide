# W7F geocode pass — _unrendered_W7.json minus W7E pins (118 candidates)

Searches used: 50 / 50 (WebSearch only, `allowed_domains:["mapfan.com"]`; no WebFetch, no git). Nothing fabricated.
Pins written: 12 (all confidence "med", MapFan spot pages) → `geo/_geoout_osaka_W7F.json` (written directly, `n` exactly as in
`_unrendered_W7.json`). These supersede older `lat:null` unverified records for the same `n` at consolidation.
Status: carried from the dataset (no statusSource field in `_unrendered_W7.json`); no 閉店/閉業 surfaced on any page → no closures flagged.
Sennariya Coffee stays `status:"unknown"` (as in dataset) — the MapFan spot exists but that is not proof it is open.

Yield: 12 / 50 = 0.24 pins/search (much lower than W7E's 0.64). MINAM 10/31 queries.

## Pins (MapFan, med)
| Area | n | lat,lng | MapFan page / match |
|---|---|---|---|
| MINAM | Hokkyokusei Shinsaibashi Honten | 34.6696206,135.4987216 | https://mapfan.com/spots/S3WWH,J,ZTBUE (北極星 心斎橋店, Chuo-ku; Umeda branch is a separate page) |
| MINAM | Takoume Honten | 34.6688563,135.5052744 | https://mapfan.com/spots/S3WQA,J,4W3CY (たこ梅本店, nearest 近鉄日本橋) |
| MINAM | Marufuku Coffee Sennichimae Honten | 34.6675708,135.5041502 | https://mapfan.com/spots/SI4C,J,8U63E (丸福珈琲店 千日前本店) |
| MINAM | Rikuro Ojisan no Mise Namba Honten | 34.6661083,135.5015602 | https://mapfan.com/spots/S34IC,J,AMNU1 (りくろーおじさんの店なんば本店) |
| MINAM | Dotonbori Imai | 34.6686062,135.5027026 | https://mapfan.com/spots/S3WQY,J,PH8G1 (道頓堀今井本店, 道頓堀1-7-22) |
| MINAM | Animate Osaka Nipponbashi | 34.6605426,135.504519 | https://mapfan.com/spots/SYQHI,J,V38JP0 (浪速区日本橋西1-1-3; route URL dest agrees) |
| MINAM | Okonomiyaki Yukari Sennichimae | 34.6654912,135.50305 | https://mapfan.com/spots/S5CC4,00KE,4LCXP0 (千日前2-11-12 — exact address match) |
| MINAM | Okonomiyaki Fukutaro Sennichimae Honten | 34.6655811,135.504533 | https://mapfan.com/spots/SC3H,J,DWJ24 (福太郎 本店, Chuo-ku, nearest 日本橋駅) |
| MINAM | Ajinoya Honten | 34.6680521,135.5009544 | https://mapfan.com/spots/SC3H,J,KSN2E (味乃家, okonomiyaki, Chuo-ku) |
| MINAM | Creo-Ru Dōtonbori | 34.6688391,135.5029892 | https://mapfan.com/spots/S33YA,J,PVWYT (くれおーる道頓堀店) |
| TNJ | Sennariya Coffee | 34.649536,135.50595 | https://mapfan.com/spots/S5YI4,J,00DJP0 (千成屋珈琲店, Naniwa-ku, nearest 動物園前; DMS 34°38'58.33" 135°30'21.42" converted) |
| KNSAI | Mitsumori Honpo (Arima) | 34.797853,135.247411 | https://mapfan.com/spots/SAAY,J,K1SW4 (MapFan spells it 三ツ森 本店, 有馬町290-1, confectionery; DMS 34°47'52.27" 135°14'50.68" converted) |

## Rejected (logged, not used)
- **Steakland Kobe-kan** — https://mapfan.com/spots/S3WY4,J,V3WNT gives 34.692989,135.191731 but address 北長狭通1-8-2 vs dataset
  1-9-17 (Sannomiya Kogyo Bldg 6F). Unique name, adjacent block — good candidate if the main session confirms the address.
- **Volks Osaka Showroom** — S34CC,J,MKKSY: two searches gave conflicting addresses (日本橋4-9-17 vs 難波中2-4-4) for coords
  34.6606787,135.5061927 — ambiguous.
- **Kobe Fugetsudo Motomachi Honten** — coords 34.6878265,135.1860277 were attributed to 神戸風月堂 **本社** (head office, S5Y3H,J,TSI160),
  not the 本店 page (S5Y3H,J,ESI160, no coords surfaced).
- **Omoro Taishō Honten** — "おもろ" S44W,J,JDJIY (34.6655321,135.4798668), Taishō-ku but no branch name and categorised Thai/local — ambiguous.
- **Dōtonbori Kamukura** — "神座" SCC,J,9H0R has a place-name-style id, no branch — ambiguous.
- **Joshin Super Kids Land** — MapFan hit is the Kobe (Sannomiya) store, not Den Den Town.
- **Kaiyodo Hobby Land** — hit is 海洋堂 at 門真市柳町19-3 (company/toy store), not Hobby Land at Shinbashi-cho.
- **Super Potato** — only "オタロード店" surfaced; not confirmed as the dataset's store.
- **Kushikatsu Daruma** — only 難波本店 surfaced, not 新世界総本店.
- **Kushinobo** — only Ginza / Umeda Sky / Shizuoka pages.
- **Aizuya** — 会津屋本店 hit is a Tokyo inn; only 天下茶屋店 for Osaka.
- **Misono** — only a Kyoto "みその".
- Address-point pages (`/spots/A,<lat>,<lng>,<address>`) — address geocodes, not place pins; not used.

## Misses (no spot page / no coords surfaced)
Kogaryu (2 queries), Takoyaki Doraku Wanaka, Jiyuken, Meoto Zenzai, Chitose, Sennichimae Hatsuse, Junkissa American,
Shōben Tango-tei, Chibo, Kinguemon, Takoya Kukuru (only other branches), Jūtei (address 難波3-1-30 confirmed, no coords),
Okonomiyaki Mizuno (spot SC3H,J,IJL2E exists, no coords in summary — retry), Meijiken, Kissa Doremi (spot SYQW,J,V1YEE
"ドレミ" Naniwa-ku exists, no coords — retry), Aabel Curry, Yasubei, Kanbukuro, Fukase-zushi, Mouriya, Tsuruhashi Fugetsu,
Minoh Beer. Not attempted (cap): remaining BAY/SOUTH/TNJ/NORTH/EAST/KNSAI/CHUO/KITA items; districts/streets/alleys
(Doguyasuji, Orange St, Ura-Namba, Little Okinawa, Seven Slopes, Nada-gogō, ferries, Tsuruhashi Market) deliberately skipped
— MapFan would only give centroids.

## Lessons
- Plain `<name with branch> MapFan 地図` works; extra keywords (dish, genre, 緯度 経度) drop the spot page.
- Chains with an exact branch name in MapFan (丸福 千日前本店, ゆかり 千日前店, くれおーる道頓堀店) hit best; one-off old shops
  (正弁丹吾亭, 千とせ, 深清鮓, かん袋) mostly have no indexed spot page.
- When a spot page surfaces but no coords, a second identical-form query sometimes relays them (道頓堀今井).
