# W7R notes — CLAUDE.md 4b re-verify of 98 `low` Okinawa pins (2026-10-03)

Searches used: 31 / 32 (WebSearch; extended unless noted). Geo file: `geo/_geoout_okinawa_W7R.json` (9 records).
Distances = haversine vs the current low point (python).

## Upgraded (9)
| Place | New conf | Source | Moved |
|---|---|---|---|
| Mekaru Tomb Site, Shintoshin (銘苅墓跡群) | high | en.wiki Mekaru_Tomb_Cluster / ja.wiki infobox 26.230611,127.697028 | **690 m** — orchestrator: old point was a search-summary value; Wikipedia infobox now governs. Bunka-cho lists the site at 大字銘苅 小字銘苅原/名護松尾原. |
| Ikema Island & Ikema Ōhashi (池間島) | high | ja.wiki 池間大橋 infobox 24.91889,125.26194 (second precision, on the bridge) | **1222 m** (old = minute-precision island point) |
| Ishigaki-jima Milmil Honpo (石垣島ミルミル本舗) | med | NAVITIME venue page spot 02301-1803063 (address 新川1583-74 matches) 24.369682,124.120619 | **244 m** — resolves the 250 m spread in favour of the NAVITIME point; the 24.3709,124.1226 pair traces to gnavi/hotpepper |
| KITCHEN inaba, Iriomote | med | NAVITIME poi 02301-t4357 (上原742-6, tel matches) 24.423391,123.777805 | 26 m (single-listing flag cleared) |
| Michi-no-Eki Kyoda (道の駅許田) | high | ja.wiki 道の駅許田 infobox 26.55206,127.96925 | 62 m |
| Itoman Osakana Center / Michi-no-Eki Itoman | high | ja.wiki 道の駅いとまん infobox 26.13847,127.66125 (complex point) | 23 m |
| Ryukyu Mura, Onna (琉球村) | high | en.wiki Ryukyu_Mura infobox 26.42944,127.77528 | 74 m |
| Seaside Drive-In, Onna | high | Stars and Stripes 'MY FAVES … picnic' GPS N 26.44261 E 127.80348 | 13 m |
| Nuchi Māsu Salt Factory, Miyagi Island | high | Stars and Stripes GPS N 26.360380 E 127.991004 | 5 m |

## Unchanged (searched, no better source — nothing written)
- Tamatorizaki Observation Point: ja query re-surfaced the same NAVITIME/summary point 24.489238,124.276962; en query returned only TripAdvisor/inspirock values 24.49058,124.27890 (~250 m NE). No wiki article. Conflicting aggregators → keep low; worth a !3d!4d place-pin check later.
- Great Akagi Trees of Shuri Kinjō: 2 searches; only the same tabi-mag value 26.215887,127.716012 re-surfaced (Bunka-cho / nabunken pages print no coords in summary).
- Aharen Beach: no ja.wiki coord, no Stripes GPS (2 searches).
- Helios Distillery: ja.wiki article has no coords. Jack's Steak House: same listing coord. Charlie's Tacos, Gordie's, A&W Makiminato, Highway Drive-In, Ploughman's Lunch Bakery, Maeda Shokudō, Mikasa Matsuyama: Stripes articles found but no GPS surfaced.
- Iriomote Island: island-level Wikipedia infobox point is appropriate for an island record; not searched.
- Leads for a later wave: Stripes 'How, where to slurp noodles like Okinawans' prints GPS for many soba shops (Kishimoto Shokudō N 26.660328 E 127.895893 etc.) — could upgrade soba records not in this list.

## Status
- Sukeroku Kamaboko (助ろく), Kume: rurubu.jp/andmore/spot/80043414 lists it current (9:00–19:00, closed Sun & Thu, 15 parking) — adds a non-tabelog status source; no geo record written (no better coordinate).
- No closures found.

## WRONG PINS
- None found. (Mekaru moved 690 m and Ikema 1222 m are precision upgrades rather than wrong-building evidence; Milmil 244 m resolved to the NAVITIME point.)

## Not reached (~80 food pins): Naha/Chūbu/Hokubu/Miyako/Yaeyama/Kerama listing pins — no record written.
