# W7G2 notes (geocoder, non-Naha/Chūbu UNVERIFIED backlog) — 2026-10-03

I used all 18 of 18 searches and hit no limit error. There are 7 records in `geo/_geoout_okinawa_W7G2.json`. Every one of them upgrades an UNVERIFIED place and uses the exact `n` from `_okinawa_geo_todo_W7G2.json`.

## Pinned
- med: Mibaru Beach & glass-bottom boats at 26.144302,127.78065. This is the GPS Stars and Stripes prints in its glass-boat article.
- low: Seifuku Shuzō, Busena Marine Park Underwater Observatory, Todoroki Falls Park, Sakihama Seimen, Yae Shokudō and Ōshiro Tempura. Each is an aggregator listing coordinate that matches the sourced address.
- Flags for the 4b re-verify:
  - The Busena point is at park level. It is not confirmed to be the tower itself.
  - Sakihama Seimen's coordinate comes from tabelog alone, and so does its open status.

## Searched, nothing usable (no record written)
- Uezu House: two searches. The jawiki-style query found no coordinates, and neither did the address + 緯度経度 query.
- Konpaku-no-tō: the jawiki article came up, but no coordinates appeared in the result.
- Azama Sun Sun and Yoshino Beach: searches restricted to Stripes found no printed GPS.
- Taragawa (砂川85) and Yamakawa Shuzō (並里58): the address + 緯度経度 query found no coordinates. For Yamakawa only a town centroid came back, which I rejected.
- KOURI SHRIMP and Kunnatu: the address + 緯度経度 query found no coordinates.
- Tuyumya tomb: the address query found no coordinates. The Yahoo map place page AkB11XUu01k and the bunka.go.jp DB entry 176892 exist and may hold coordinates.
- Ōjima search on Stripes: it returned only the island-level GPS for Ōjima (26.131738,127.772283), not a venue point, so I rejected it.

## Lessons
- The `<名> wikipedia 座標` pattern found no coordinates in 2 of 2 tries this wave.
- The address + 緯度経度 pattern returned coordinates for 6 of 11 places.
- The Stripes-restricted search works for beaches that have a dedicated Stripes article (Mibaru).

## Not reached
All the remaining todo entries.

## Closures
None found.
