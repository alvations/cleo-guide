# W9 subagent rules (Okinawa) — addendum. Read `_okinawa_w4_agentrules.md` FIRST (binds), then `_okinawa_w5_agentrules.md`,
`_okinawa_w6_agentrules.md`, `_okinawa_w7_agentrules.md`, `_okinawa_w8_agentrules.md` (all bind), then this.

Date 2026-10-03. W9 additions:
- **Search cap = the number in your task.** The ~200-call session cap is shared with sibling agents; on any "limit/cap"
  error stop at once, save, write notes, report. Count every WebSearch call.
- **Discovery FIRST** (this wave closes density gaps): a list article (Ryukyu Shimpo / Okinawa Times / OTV Okitive /
  Mapple / Rurubu / Okinawa Traveler / KozaWeb / Stripes / OCVB okinawastory.jp / Tabirai / japan-guide) yields 4–8 names;
  one confirm search pairs 2–4. Japanese AND English queries (≥1/3 Japanese). Held leads in `_okinawa_W8*_notes.md` first.
- **NEW pin channel (2026-10-03, worked in Miami W4):** WebSearch with `allowed_domains: ["maps.apple.com"]` and a query like
  `<name> <town> Okinawa` (or the Japanese name) returns Apple Maps place URLs carrying `coordinate=lat,lng` or `ll=lat,lng`
  — Apple's own place pin. Accept only if the place URL's name/address matches the sourced record → confidence `med`
  (geoSource: "Apple Maps place URL <url> coordinate=..."). Also: NAVITIME spot pages (`allowed_domains:
  ["travel.navitime.com","www.navitime.co.jp"]`) → med; MapFan spot pages (`mapfan.com`) → med; ja.wiki infobox → high.
  Extended `<日本語名> <JA address> 緯度 経度` → low (aggregator listing; must match the address).
- Food & drink ≥55 % of what discovery agents add (Chūbu, Nanbu, KRM: food & drink ONLY).
- Anime records: `"anime": "<franchise — why it matters>"`, ≥2 credible sources.
- Don't duplicate: check `data/okinawa.dataset.json` P/F names AND every `FOOD_/SIGHTS_OKINAWA_W9*.json` sibling right before appending.
