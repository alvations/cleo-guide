# W7L note — round 3, SOUTH + NORTH close-out (2026-10-03) — 39 WebSearch calls (cap 40)

Yield: 11 places / 39 searches (≈0.28/search). 6 food, 5 sights. No WebFetch, no git, no constructed URLs (every URL cited appeared in my own results).

## Written
FOOD_OSAKA_W7L.json (6)
| Area | Name | Keys | Note |
|---|---|---|---|
| NORTH | Sobakiri Tenshō (そば切り 天笑, Hirakata) | TABELOG100 soba_west 2025 + MAPPLE | **promoted** (W7D held). FLAG: the MAPPLE cite is the Hirakata–Katano *region gourmet list* page (mapple.net/region/a0503030700_g03000000/spot/), whose summary carried the editorial line ('nationally famous… stone-milled daily'). A search for the spot page itself failed. Reviewer: accept or hold |
| NORTH | Menya Shiki (麺ゃ しき) | TABELOG100 ramen_osaka 2025 (also 2023/24) + WALKERPLUS (Ramen Walker article 4024622) | **promoted, AREA/TOWN CORRECTION**: it is in **Moriguchi** (2-1-3 Toyohide-chō, Tanimachi-line Moriguchi Stn), not Hirakata. The 百名店 entry is listed at 守口駅. Moriguchi = Kita-Kawachi → NORTH |
| NORTH | Marushō Gyōza-ten Honten (丸正餃子店 本店, Daitō) | TIMEOUT (venue page + 東大阪27選) + RURUBU spot 80028930 | **promoted** from the W7H 27選 list. Daitō is in Kita-Kawachi → NORTH (follows Time Out's grouping) |
| NORTH | Katsumen Tomizō (活麺富蔵, Shijōnawate) | TIMEOUT 東大阪27選 + TABELOG100 udon_west 2024 (also 2020) | **promoted**. Udon no tessa |
| SOUTH | Saijō Gōshi — Amanozake brewery (Kawachinagano) | OSAKAINFO (2 DC experience pages = one key) + RURUBU spot 80028923 | **new**. Walker 139072 (local sake 10) may also name it; not confirmed |
| SOUTH | Kawachi Wine Kan (Habikino) | OSAKAINFO (spot + 'osaka-mania' wine article = one key) + RURUBU spot 80028963 | **new** |

SIGHTS_OSAKA_W7L.json (5): this is the sight fallback, used after the SOUTH food leads ran dry.
- SOUTH, lone BUNKACHO + ja.wikipedia:
  - **Fujii-dera** (National Treasure Thousand-Armed Kannon; Japan Heritage portal 4305)
  - **Jigen-in, Izumisano** (National Treasure tahōtō of 1271; online.bunka.go.jp 194830 + Japan Heritage 4371)
  - **Kōon-ji, Kaizuka** (National Treasure Kannon-dō; online.bunka.go.jp 147361)
- NORTH, OSAKAINFO + ja.wikipedia: **Katano Tenjin-sha, Kuzuha**. Its main hall is an Important Cultural Property.
- Area note: Fujiidera city is Minami-Kawachi, beside the Furuichi kofun (SOUTH).

Per-area: **NORTH +5** (4 food, 1 sight) · **SOUTH +5** (2 food, 3 sights).

## Geo (_geoout_osaka_W7L.json)
- **4 high**, all ja.wikipedia 座標: Fujii-dera, Jigen-in, Kōon-ji, Katano Tenjin-sha.
- **2 med**, MapFan with an address match:
  - Kawachi Wine Kan: 34.5451225, 135.6272796
  - Marushō: 34.710342, 135.6226101. The MapFan name is '丸正ギョーザ店', with the same address.
- **4 unverified:**
  - Tenshō: MapFan spot S3WQY,J,4USYE gives 19-1 Okahigashi-chō, ≈34.814433, 135.646172. That conflicts with the 'Oka-machi 10-30' from a summary, so I left it unverified; it can be promoted if the address checks out.
  - Shiki and Saijō: no MapFan page.
  - Tomizō: not searched.
- All 10 records have status open with a source.

## MEASURED & DROPPED
- **Mochizuki Ichimian (Sakai): CLOSED.** The restaurant.ikyu.com/116909 listing carries a closure notice: closed 31 Aug after 70+ years. Not added. If it is already anywhere in the dataset, flag it `— CLOSED`.
- Kishiwada 'Japan's only watari-gani specialist' (Time Out 50 things): this is Kappo Matsuya, which is already in the dataset.
- りきちゃん 大阪豊中店: a branch of a chain, not pursued.

## Held (have → need)
- Chikuma ちく満: still SAKAITCB only. 2 searches; only tabelog matome/hamoni/nap-camp surfaced (= 0).
- Yasuke 弥助: SAKAITCB only. Rurubu returned only the unrelated Wakayama 弥助寿司.
- Ryūkishin: the 百名店 ramen_osaka 2025 search did not confirm it.
- 麺屋 一慶 (Ibaraki): no Ramen Walker article found.
- 鴨と醸し 鼓道 (Ryokuchi-kōen, Toyonaka): TABELOG100 soba_west 2025 only (new selection; this confirms the full name).
- 北村みそ: OSAKAINFO only.
- Asuka Wine (飛鳥ワイン, Habikino 1104 Asuka, founded 1934): OSAKAINFO wine article only. Time Out 南大阪50 mentions it only as a drink.
- Time Out 東大阪27選 Minami-Kawachi:
  - 焼肉 くいん: only the Time Out venue page.
  - daccia (Tondabayashi kominka Italian): only the Time Out venue page.
  - 観心寺 創作精進料理 KU-RI: only the Time Out venue page (azuki chagayu + shōjin). The Kanshin-ji searches did not surface it.
  - Osteria Beccafico: hotpepper/gnavi only (= 0).
- 天の川 なかなか (Katano kaiseki): TIMEOUT only.
- 漁師の家めし 英進丸 名倉 (Nishi-Tottori port, Hannan): TIMEOUT venue page only. Note the 英進丸 spelling (not 栄進丸).
- Fugu Agasa: no hit.

## Queries (39)
- **SOUTH food:** ちく満 ×2, 弥助, Walker 堺20選, Beccafico, Michelin south ×2, 龍旗信 百名店, 27選 Minami-Kawachi, KU-RI, くいん, 英進丸, 天野酒, 羽曳野 wine, 飛鳥ワイン ×2, ワタリガニ, あがさ, 望月一味庵 (closure check).
- **NORTH food:** 北村みそ, 天笑 ×2, soba 百名店, 鼓道, 麺や しき ×2, 一慶, 丸正餃子, 27選 Kita-Kawachi, 富蔵, 天の川なかなか.
- **Sights:** ja.wiki 座標 ×2, bunka NT.
- **MapFan:** 5 (Kawachi Wine ✓, Saijō ✗, Marushō ✓, Shiki ✗, Tenshō, address conflict).

Per channel (written places):
- Michelin: 0
- Editorial (TIMEOUT/RURUBU/MAPPLE/WALKERPLUS): 7
- Official/tourism (OSAKAINFO): 3
- TABELOG100: 3
- Institutional (BUNKACHO): 3
- WIKIPEDIA: 4
- Creator: 0. Creator queries were skipped to spend the cap on pairing; nothing to attach, so there is no CREATORS file.
