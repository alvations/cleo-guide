# W7J geocode pass — _unrendered_W7J.json (121 unpinned)

Searches used: 45 / 45 (44 `allowed_domains:["mapfan.com"]` + 1 open-web address check). No WebFetch, no git. Nothing fabricated.
Pins written: 12 (all confidence "med", MapFan spot pages) → `geo/_geoout_osaka_W7J.json` (written directly; `n` exactly as in
`_unrendered_W7J.json`). These supersede older `lat:null` unverified records for the same `n` at consolidation.
Status carried from the dataset; no 閉店/閉業 surfaced on any spot page → no closures flagged. Tsuriganeya Honpo and Akamaru Shokudō
stay `status:"unknown"` as in the dataset (a MapFan listing is not proof they are open).
Yield: 12 / 45 = 0.27 pins/search.

## Pins (MapFan, med)
| Area | n | lat,lng | MapFan page / match |
|---|---|---|---|
| TNJ | Yaekatsu | 34.6496835,135.5060004 | https://mapfan.com/spots/S3WYH,J,IWYEE (八重勝, Naniwa-ku, kushikatsu, nearest 動物園前) |
| TNJ | Tengu (Jan Jan Yokochō kushikatsu) | 34.6497929,135.5060384 | https://mapfan.com/spots/S3WYH,J,I482E (てんぐ, Naniwa-ku, kushikatsu, nearest 動物園前; 2nd query relayed coords) |
| TNJ | Daiko Sushi (Jan Jan Yokochō) | 34.6497791,135.5061617 | https://mapfan.com/spots/S3WIH,J,35YEE (大興寿司, 恵美須東3-2-18) |
| TNJ | Kissa Doremi (喫茶ドレミ) | 34.6524941,135.5060555 | https://mapfan.com/spots/SYQW,J,V1YEE (ドレミ, 喫茶, Naniwa-ku, nearest 恵美須町 — W7F retry) |
| TNJ | Tsuriganeya Honpo (釣鐘屋本舗) | 34.6532377,135.5139369 | https://mapfan.com/spots/SQ3Y,J,B2WIE (title 総本家釣鐘屋 — 本舗 omitted; Tennōji-ku, confectionery; same brand) |
| MINAM | Okonomiyaki Mizuno (美津の) | 34.6683612,135.5032226 | https://mapfan.com/spots/SC3H,J,IJL2E (美津の, okonomiyaki, Chuo-ku — W7F retry) |
| CHUO | Mimiu Honten | 34.6871505,135.4986946 | https://mapfan.com/spots/S3WQY,J,3N56E (美々卯 本店, Chuo-ku, nearest 本町; branches have own pages) |
| CHUO | Yoshinosushi | 34.6871199,135.5018355 | https://mapfan.com/spots/S3WIH,J,2QYRE (淡路町3-4-14 — exact match) |
| SOUTH | Saryo Tsuboichi Seicha Honpo | 34.5851115,135.4804547 | https://mapfan.com/spots/SYCA5,J,PDDCP0 (茶寮つぼ市製茶本舗, Sakai-ku, nearest 神明町) |
| SOUTH | Kojimaya (Sakai keshi mochi) | 34.5752643,135.4712789 | https://mapfan.com/spots/S3AY5,J,3JFRE (小島屋けし餅本舗, 宿院町東1丁1-23; not 小嶋本家芥子餅) |
| BAY | Sawashi Shoten (沢志商店, Hirao Little Okinawa) | 34.6394586,135.4741308 | https://mapfan.com/spots/SACH,J,265EE (沢志商店, Taishō-ku, food shop, nearest 津守) |
| BAY | Akamaru Shokudō (赤丸食堂, Bentenchō) | 34.6647997,135.4615639 | https://mapfan.com/spots/S3WQQ,J,VXQEE (港区磯路2-6-3, nearest 弁天町; dataset had ward only) |

## Rejected / settled
- **Steakland Kobe-kan** — address check (EPARK https://epark.jp/shopinfo/jsp631556/): current address is 北長狭通1-9-17 三宮興業ビル6F,
  matching the dataset; MapFan S3WY4,J,V3WNT shows 1-8-2 → inconsistent, NOT pinned (stays unverified).
- **Abeno Takoyaki Yamachan** — only "やまちゃん本舗" (Abeno-ku, categorised okonomiyaki, 34.6451178,135.5145633) surfaced — name mismatch, not used.
- **Itamae Yakiniku Itto Tengachaya Honten** — summary confirmed 西成区天下茶屋東1-23-18 but no spot URL/coords relayed (2 queries) — not pinned.
- **Arabiya Coffee** — spot SI4C,J,BYYRE confirms 難波1-6-7 but no coords relayed (2 queries) — retry once more.
- **Yakiniku Yoshida Shinkan** — only 焼肉吉田本店 surfaced (different branch).
- **Yamada Shōten** — only a Tokyo 山田商店.

## Misses (no spot page surfaced)
Tsuruichi Honten, Iwashibune, Okamuro Saketen, Manmasa, Honke Arochi Marutaka, Okonomiyaki Aomori, Wakkoqu, Hisakuni Kōsendō,
Le Sucré-Coeur, Yaogen Raikodo, Usamitei Matsubaya, Matsuba Sohonten, Hanadako, Dotonbori Akaoni, Kitahama Anagoya,
Saishiki Ramen Kinsei, TUGBOAT_TAISHO, Udonya Kisuke, Menya Joroku, Yamato (Kishiwada), Menya Hakkaisan, Kijimunā no Mori,
Hige to Bōin. Not attempted (cap): the rest of NORTH/EAST/SOUTH/KNSAI/KITA/MINAM; districts/streets/markets and Mashino Ken skipped by design.

## Lessons
- Jan Jan Yokochō / Shinsekai one-off shops are well indexed (4/4); small craft/bar/ramen newcomers mostly not.
- A spot page that surfaces without coords usually relays them on a repeat query with the ward name added (てんぐ).
