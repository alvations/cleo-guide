# Okinawa W8D5 notes (2026-10-03): MYK + YAEYA discovery
I used all 24 of my 24 WebSearch calls and hit no limit error. Kept 9 places: 6 food and drink (67%) and 3 sights. MYK got +5 (target 9) and YAEYA +4 (target 7). Most list searches returned only aggregators (retty, nap-camp, skyticket, hamoni).

## Kept
| Area | Place | Sources | Pin |
|---|---|---|---|
| MYK F | Kikunotsuyu Shuzō (1928) | TABIRAI 0003378, JSS, NTA kanpyo, ja.wiki | low 24.803614,125.281353 (search summary, page not identified) |
| MYK F | Okinohikari Shuzō (1948; NTA Director's Award 2005) | TABIRAI 0003377, JTAJOURNAL, JSS | low 24.793779,125.28908 (Yahoo/NAVITIME/nikkei listings) |
| MYK F | Ikemajima gelato cafe Ninufa (held lead) | MAPPLE 30624, COTRIP article 660294 (title names Ninufa) | low 24.92993,125.23345 (2 listings agree; 3rd point ~520 m off was rejected) |
| MYK S | Painagama Beach | OCVB 600006192, MIYAKOKANKO, GLTJP 16192, ja.wiki | med 24.8026123,125.2703656 |
| MYK S | Ikema Wetlands (one of Japan's 500 Important Wetlands) | ja.wiki, TANOSHIMA, MIDORIHANA | high, ja.wiki infobox |
| YAEYA F | Tamanaha Shuzōsho (Yaeyama's oldest distillery) | YAEYAMAVB, TABIRAI 0003373, RURUBU andmore 22673, NTA | UNVERIFIED |
| YAEYA F | Donan / Kokusen Awamori, Yonaguni hanazake (held lead) | en.wiki Awamori, Mapple Yonaguni sake list, YONAGUNIKANKO | UNVERIFIED |
| YAEYA F | Ishigaki City Public Market (held lead) | RURUBU 80042729, GLTJP 13820, ja.wiki | high, ja.wiki infobox |
| YAEYA S | Tachigami-iwa, Yonaguni | OCVB 20420900, ja.wiki 与那国島 | UNVERIFIED |

Totals: pinned 6 (high 2, med 1, low 3), UNVERIFIED 3, closed 0. Every place has a status and statusSource.

## Caveats for the orchestrator
- For RURUBU 22673 (Tamanaha) and ja.wiki 与那国島 (Tachigami-iwa), I inferred that the page names the place; I did not confirm it. Tachigami-iwa's second source is the weakest, so drop it if needed.
- TANOSHIMA and MIDORIHANA are new keys whose publishers are unverified.
- One search result gave the address "与那国2329" for Tachigami-iwa, but that is Sakimoto Shuzō's address, so I rejected it.
- Already in the dataset, so skipped: Sunayama, Higashi-hennazaki, Toguchi, 17END, Irizaki, Agarizaki, Pinaisāra, Yubu, Takanazaki, Seifuku, Yaesen.

## Held leads
- Shima Soba Ichiban-chi, Ishigaki: rurubu 24742 only (the rest were aggregators).
- Yakiniku Kihachi, Miyako beef: only retty and Tabelog Hyakumeiten 2021; I found no editorial source.
- Kanifu and Shidamē-kan, Taketomi: Mapple 30073 only.
- Ikema Shuzō: no hit.
- Inkaji and Ryūgūen, Miyako yakiniku: aggregators only.

## New source keys
YONAGUNIKANKO, MIYAKOKANKO, TANOSHIMA, MIDORIHANA, JTAJOURNAL (all in SOURCES_OKINAWA_W8D5.json). JSS, TABIRAI and YAEYAMAVB are existing keys.

## Searches
- 24 in total, 9 of them in Japanese for discovery.
- Creators: 2 searches, 0 kept, 2 rejected.
