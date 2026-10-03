# W7E geocode pass — _unrendered_W7.json (127 places)

Searches used: 22 / 22 (WebSearch only; no WebFetch, no git). Nothing fabricated.
Pins written: 9 (all confidence "med", map-provider POI pins) → `geo/_geoout_osaka_W7E.json`.

**Merge note:** `_osaka_add.py geo` skipped all 9 as DUP, because every name already has a `lat:null, confidence:"unverified"`
record in an older geo file (W2u/W3C/W3G/W4B/W4F/W5C/W5D). So I wrote `geo/_geoout_osaka_W7E.json` directly (only my own
file). At consolidation these W7E records must **supersede** the older unverified ones for the same `n`.

## Channels tried + yield
| Channel | Searches | Pins |
|---|---|---|
| (a) wikidata.org (`allowed_domains`) — 道具屋筋, かに道楽, だんじり会館, 上方浮世絵館, 壇上伽藍 | 5 | 0 |
| (c) navitime/mapion/its-mo — だんじり会館 | 1 | 0 |
| (c) **mapfan.com** spot pages (`allowed_domains:["mapfan.com"]`, query `<Japanese name> MapFan 地図`) | 14 | 9 |
| Address re-checks (Mashino Ken EN; Mandarake JP open web) | 2 | 0 (info only) |

- **Wikidata**: snippets DO relay P625 when an item has one (e.g. Koyasan Reihōkan 34°12'40.6"N 135°34'53.3"E,
  Sennichimae district) — but the target items either have no P625 (Sennichimae Dōguyasuji Q11405529; Kani Dōraku
  Q11264072 is the chain/company) or don't exist (Danjiri Kaikan, Kamigata Ukiyoe-kan, Danjō Garan as such). Yield 0/5 → stopped.
- **NAVITIME**: spot pages don't print lat/lng in snippets; drive-route URLs encode coords in ms, but appear to be Tokyo
  datum (≈500 m offset vs WGS84) — rejected, not converted.
- **MapFan** (best channel; ~64% yield on single-name queries): spot pages print "Degree 緯度 経度" + address + nearest
  station; the search summarizer relays them. Works best ONE name per query, Japanese name + "MapFan 地図". Batched
  3-name queries returned ambiguous branches. Misses: さかい利晶の杜, 中座くいだおれビル, 老祥記, 鳥美 (no spot page surfaced).
  Recommend the main session run further MapFan waves for the remaining ~118 (esp. named shops with branch names).

## Pins (MapFan, med)
| n | lat,lng | URL |
|---|---|---|
| Kamigata Ukiyo-e Museum | 34.6679405,135.5021857 | https://mapfan.com/spots/SC54C,J,L5 |
| Kishiwada Danjiri Kaikan | 34.459073,135.3682573 | https://mapfan.com/spots/SCAQC,J,LWY35W |
| Hirakatashuku Kagiya Museum | 34.8118495,135.6371091 | https://mapfan.com/spots/S355W,J,KLRSY |
| 551 Hōrai Honten (Namba) | 34.6664252,135.5012706 | https://mapfan.com/spots/S5QHW,06II,78MR40 |
| Kani Doraku Dōtonbori Honten | 34.6688389,135.5014927 | https://mapfan.com/spots/S5CQC,E0,W56CP0 (address 道頓堀1-6-18 matches) |
| Nishimura Coffee Nakayamate Honten | 34.6965046,135.190807 | https://mapfan.com/spots/S5YI4,FSD0,XEY160 |
| Hinode-yu | 34.6452456,135.5064765 | https://mapfan.com/spots/S34W5,J,7GU7E (山王2-7-9 matches) |
| Ide Shoten (Wakayama) | 34.2284794,135.1894864 | https://mapfan.com/spots/S3W4W,J,QIKE1 (田中町4-84 matches) |
| Mandarake Grand Chaos | 34.6591353,135.5055032 | https://mapfan.com/spots/SYQHI,J,H0ZJD0 |

Status: carried over from the dataset (not re-checked); no closure evidence surfaced.

## Rejected coordinates
- 金龍ラーメン 34.6678675,135.4982341 (mapfan S3W4W,J,2C2PE): spot titled just "金龍ラーメン" — branch ambiguous (several
  Dōtonbori shops; dataset address 1-1-18), not used.
- 法善寺横丁 34.6679405,135.5024906 — alley, not Meoto Zenzai.
- Sennichimae district 34°40'1.4"N 135°30'15.4"E (Wikidata) — district, not Dōguyasuji.
- Dōtonbori 34°40'7"N 135°30'5"E (Wikidata) — district.
- Koyasan University / Reihōkan / Kōyasan Station (Wikidata) — neighbours, not Danjō Garan.
- NAVITIME route-URL ms coords for だんじり会館 (lon 487335820, lat 124040850) — probable Tokyo datum; not used.

## Address re-checks
- **Mashino Ken**: Michelin venue page (https://guide.michelin.com/en/osaka-region/osaka/restaurant/mashino-ken) and Tabelog
  still give 2F, 1-3-6 Awajimachi, Chuo-ku 541-0047, tel 06-6210-4449. No evidence of a move — so the Michelin lat/lng
  (34.673359,135.517416, ~1.5 km off) looks like a bad Michelin pin. Leave unverified; try MapFan "ましの軒"/Japanese name next.
- **Mandarake Grand Chaos**: MapFan lists it in Naniwa-ku, nearest Ebisuchō Station (Sakaisuji Line) — i.e. Nipponbashi /
  Den Den Town, consistent with the dataset address. en.wikipedia "Amerikamura" is probably the older location. Pinned med
  with a note; a JP search for 西心斎橋 address returned nothing useful.
