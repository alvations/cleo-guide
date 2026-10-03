# W7N geocode pass — _unrendered_W7N.json (134 unpinned), targeting names W7E/F/J did NOT try

Searches used: 50 / 50 (47 `allowed_domains:["mapfan.com"]`, 2 `ja.wikipedia.org`, 1 open-web address check). No WebFetch, no git. Nothing fabricated.
Pins written: 4 (all confidence "med", MapFan spot pages) → `geo/_geoout_osaka_W7N.json` (written directly; `n` exactly as in
`_unrendered_W7N.json`). These supersede older `lat:null` unverified records for the same `n` at consolidation.
Status carried from the dataset; no 閉店/閉業 surfaced → no closures flagged. Nakasone Seinikuten stays `status:"unknown"` as in the dataset.
Yield: 4 / 50 = 0.08 pins/search. The round-2/3 additions (small newer shops) are mostly NOT indexed on MapFan — much worse than F/J.

## Pins (MapFan, med)
| Area | n | lat,lng | MapFan page / match |
|---|---|---|---|
| SOUTH | Saijō Gōshi Gaisha — Amanozake brewery | 34.4495639,135.5699859 | https://mapfan.com/spots/SWIQ,J,1EU4E (天野酒, 河内長野市長野町12-18 — exact match; 2nd query relayed the address) |
| BAY | Nakasone Seinikuten (仲宗根精肉店, Hirao) | 34.6397638,135.4734449 | https://mapfan.com/spots/SA33,J,2P5EE (大正区平尾3丁目23-5 — exact match) |
| SOUTH | Kansai Airport Observation Hall Sky View | 34.4406885,135.258047 | https://mapfan.com/spots/SCYQI,J,QE (関空展望ホールスカイビュー, 展望台, 泉佐野市) |
| MINAM | Okonomiyaki Sanpei Shinsaibashi | 34.6706452,135.5020935 | https://mapfan.com/spots/SC3H,J,CSN2E (お好み焼き三平, 心斎橋筋2丁目2-10 — exact match; 2nd query relayed coords) |

## Rejected (logged, not used)
- **Sobakiri Tenshō** — MapFan spot https://mapfan.com/spots/S3WQY,J,4USYE gives 34.8144331,135.6461731, but the confirmation search
  (Keihan K-PRESS / Mapple summary) gives the current address as **枚方市岡南町10-30**, not 岡東町19-1 → MapFan point is likely the old
  location. Not pinned (per brief).
- **Tsunechan (Sakai)** — 焼肉屋つねちゃん https://mapfan.com/spots/S34QI,J,4LQJ1 gives 34.5654961,135.4734859 (Sakai-ku, nearest 御陵前)
  but no street address relayed in 2 queries; dataset has 4-7 Goryōdōri → not confirmed. Good candidate if the main session can confirm the address.
- **Ōmiya Honten (近江屋本店)** — only 近江屋 **別館** (恵美須東2-4-18, S3WYH,J,5N2B4) surfaced; dataset 本店 is 2-3-18.
- **Chingu (Kujō)** — お好み焼チング S34QI,J,1JTE1 is at 江之子島1-5-8, not 九条1-14-16.
- **Kainantei Tsuruhashi** — only 上六店 / 緑橋店 pages.
- **Yakiniku Sora (Tsuruhashi)** — several "空" pages (焼肉ホルモン空 SCAQC,J,Y05VK0; 空 S34QI,J,8EREE 34.6656201,135.52934); the brand has
  multiple Tsuruhashi branches and the dataset gives no street number → ambiguous.
- **Izakaya Marushin** — only 食事処丸進 (Toyokawa, Aichi).
- **Sakai tea houses Shin-an & Ōbai-an** — ja.wikipedia gives only the Sakai City Museum coordinate (parent) → not used.
- **Asahi Beer Museum (Suita)** — no ja.wikipedia coordinate surfaced for 吹田工場; no MapFan page.
- **Jungle Osaka Nipponbashi Honten** — https://mapfan.com/spots/S44W,J,27RTY "ジャングル" at 日本橋3丁目4-16 (address matches) but coords
  never relayed (3 queries). Retry once more in a later wave.
- **Kissa-ya Dream (珈琲屋ドリーム)** — MapFan summary gave 西宮市甲風園1丁目12-12 (matches) but no spot URL/coords (2 queries).

## Misses (no spot page surfaced)
Ganso Takomasa, Honke Ōtako, Bonkuraya, Daigen Amerikamura, Shinsaibashi Mitsuya, Chūkasoba Kōyōken, Uruma Goten, Tane-yoshi,
Nomisuke Kyōbashi, Arabiya Coffee (3rd try overall), Grill Baranoki, Mentetsu, Katsumen Tomizō, Smartball New Star, Momotaro (Minoo),
Okonomiyaki Den, Rokukakutei, Sumibi Yakiniku Ōkura, Menya Shiki, Nakai Grill, Tonkatsu Kōshirō, Yamato (Kishiwada), Ikareta Noodle
Fishtons, Men no Yōji, RODDA group.
Not attempted (cap): Bible Club, Craftroom, Bar Nayuta, Ult Coffee, Izakaya Toyo, Takoyaki Juhachiban, DINING Ajito, Takatsuki Shiitake
Center, Moriya (Sakai), Amako Sōbē Manga Gallery, Kappo Matsuya / Azuma (no street address). Skipped by design: districts/streets/markets/
parks/cruises/ferries, Mashino Ken, Kinopio's Café (inside USJ), and every name W7E/F/J already tried.

## Lessons
- Dōtonbori takoyaki stands and newer craft/ramen/bar shops have no MapFan spot pages; MapFan's index favours older, phone-listed businesses.
- Adding the full street address to the query reliably relays a spot page's address, and sometimes its coords (三平, 天野酒).
- Remaining unpinned names likely need another channel (official-site map embeds, OSM node pages) rather than more MapFan waves.
