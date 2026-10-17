# R8 acceptance 1(d): first-4 sight cards without a photo, deliberately

R8 gap #1(d) reads: "on every guide whose signature row is sights, the first 4 cards of that row have photos". The
ruling (orchestrator, 2026-10-16) is to read it literally but never game it. Cards are ranked on merit, so we **never**
reorder a row to put photographable cards first. The cards below sit in the first 4 and cannot carry a photo by a
standing rule:
- **food places** never get a photo;
- **venues and brand stores** never get one, because their signage and branding are the subject;
- **copyrighted character art** never gets one, because Japan has no freedom of panorama for art;
- **stated gaps** are places where no honest Commons photo exists.

Every other card in the first 4 of these rows has a credited photo. Regenerate the table from `beta/data/gallery/*.json`,
`CREDITS.json` and `commons-candidates.json` (the `skip` reasons).

| Guide | Signature row | Cards without a photo, and why |
|---|---|---|
| kyoto | Anime, manga & pop culture | #2 Marufukuro — former Nintendo headquarters (丸福樓) — no Commons file shows the 1930 Marufukuro building (only the later research centre and a name plate) — gap stated<br>#3 Pokémon Center Kyoto (ポケモンセンターキョウト) — venue (MKT, NIGHT) — never a photo<br>#4 Nintendo KYOTO — venue (MKT) — never a photo |
| okinawa | Anime, manga & pop culture | #1 Poké Lid — Arcanine, Tenbusu Plaza, Kokusai-dōri (ポケふた ウインディ てんぶす広場) — Poké Lid manhole cover: copyrighted character artwork, and Japan has no freedom of panorama for art (W8 gap stated)<br>#2 Pokémon Center Okinawa, Aeon Mall Okinawa Rycom (ポケモンセンターオキナワ) — brand store — its signage and branding are the subject; never a photo (W8 gap stated)<br>#3 Poké Lid — Growlithe over Mihama fireworks, Depot Island Boardwalk, Chatan (ポケふた ガーディ 北谷町美浜) — Poké Lid manhole cover: copyrighted character artwork, and Japan has no freedom of panorama for art (W8 gap stated)<br>#4 Okitsura pilgrimage — Gushikawa, Uruma (沖ツラ聖地 具志川公民館・具志川ビーチ) — an anime pilgrimage route, not one photographable place — gap stated |
| osaka | Anime, manga & pop culture | #1 LUCUA Characters World — Pokémon Center Osaka & Nintendo OSAKA — brand store — its signage and branding are the subject; never a photo (W8 gap stated)<br>#2 Kiddy Land Umeda — brand store — its signage and branding are the subject; never a photo (W8 gap stated)<br>#3 Gashapon Department Store HEP FIVE (Umeda) — venue (NIGHT) — never a photo<br>#4 Capcom Store & Cafe Umeda — venue (SHOP) — never a photo |
| siliconvalley | Must see | #1 Ramen Nagi — food place (never a photo)<br>#2 Eylan — food place (never a photo)<br>#3 Ettan — food place (never a photo)<br>#4 Oren's Hummus — food place (never a photo) |
| singapore/bangkok | Must see | #4 Raan Jay Fai — food place (never a photo) |
| singapore/bukit-timah | Must see | #2 Selera Rasa Nasi Lemak — food place (never a photo) |
| singapore/civic-district | Must see | #2 Odette — food place (never a photo) |
| singapore/kuala-lumpur | Must see | #3 Village Park Restaurant — food place (never a photo) |
| singapore/mandai | Must see | #1 Singapore Zoo — candidate wave 1: Commons holds animal close-ups and the (refused) entrance sign, no view of the zoo itself — calm cover (stated) |
| singapore/upper-thomson | Must see | #2 Springleaf Prata Place — food place (never a photo) |
| tokyo | Anime, manga & pop culture | #2 Akihabara Electric Town (秋葉原電気街) — venue (MKT) — never a photo<br>#3 Mandarake Complex Akihabara (まんだらけコンプレックス) — venue (MKT) — never a photo<br>#4 Tokyo Character Street, Tokyo Station (東京キャラクターストリート) — venue (MKT) — never a photo |
| wheeling | Must see | #3 Centre Market Historic District — venue (MKT) — never a photo<br>#4 DiCarlo's Pizza — food place (never a photo) |

## Row composition (orchestrator ruling: no FE change)

**"Must see" rows are tier-1 picks across kinds by design**, so food in them is expected and is not a bug. For the
guides whose signature row is "Must see" (Silicon Valley, Wheeling and the Singapore guides above), that row is
mixed, not a sights row, and (d) applies only to its photographable cards. Those cards all carry a photo, or a
stated reason. The anime rows (Tokyo, Osaka, Kyoto, Okinawa) are sights rows whose first cards are brand stores or
venues, and those never get a photo by rule.

### Food cards in sights-led signature rows (reference)

These "sights"-led signature rows also contain **food** cards. Some may be deliberate, since a "Must see" row can mix
food with sights. A sights row made mostly of food, such as Silicon Valley's (its first 4 cards are all food), looks
like a row-composition question, not a photo gap. Routed to FE by the orchestrator.

| Guide | Row | Food cards in the row |
|---|---|---|
| okinawa | Anime, manga & pop culture | 1 of 12: Chiikawa Restaurant Okinawa, PARCO CITY Urasoe (ちいかわレストラン 沖縄店) |
| osaka | Anime, manga & pop culture | 2 of 12: Pokémon Center Osaka DX & Pokémon Café, Kirby Café Osaka |
| siliconvalley | Must see | 6 of 12: Ramen Nagi, Eylan, Ettan, Oren's Hummus, Philz Coffee, Zareen's (Palo Alto) |
| singapore/bangkok | Must see | 2 of 5: Raan Jay Fai, Thip Samai |
| singapore/bukit-timah | Must see | 1 of 2: Selera Rasa Nasi Lemak |
| singapore/civic-district | Must see | 1 of 2: Odette |
| singapore/kuala-lumpur | Must see | 1 of 3: Village Park Restaurant |
| singapore/upper-thomson | Must see | 1 of 2: Springleaf Prata Place |
| tokyo | Anime, manga & pop culture | 1 of 12: Pokémon Café Tokyo, Nihonbashi (ポケモンカフェ 日本橋) |
| wheeling | Must see | 5 of 12: DiCarlo's Pizza, Coleman's Fish Market, Figaretti's Restaurant, Century Inn, Shorty's Lunch |
