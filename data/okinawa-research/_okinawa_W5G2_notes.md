# W5G2 notes — Miyako + Yaeyama geocode/status (2026-10-03)

Searches: 24/25 (stopped one short). Output: geo/_geoout_okinawa_W5G2.json (13 records; 23 todo places not reached, so they have no record).

## Pinned (4, all med, NAVITIME points that agree with the sourced address)
- Tamatorizaki Observation Point: 24.489238,124.276962. NAVITIME POI 02301-1300758. The extended-search summary named NAVITIME, but the query had no domain restriction.
- Kondoi Beach: 24.325379,124.077407. navitime.co.jp POI 02301-pn0002204 (竹富441).
- Yukishio Museum: 24.902684,125.267804. travel.navitime.com spot 02301-1300764 (狩俣191).
- Sobadokoro Takenoko: 24.330053,124.081594. travel.navitime.com spot 02301-1300721 (竹富101-1). This replaces W4G4's unattributed point, which was about 250 m away.

## UNVERIFIED (9)
Yoshino Beach, Sugar Road (only the island centroid surfaced, rejected), Nakanoshima Beach, Kojasobaya, Gōya, Seifuku, Taragawa, Yaesen, Kinatsuyu.
Leads to check in a browser: navitime POI 02301-pn0001047 (Yoshino), 02022-10018870 (Nakanoshima), 02301-1800151 (Kojasobaya), 02301-1800221n (Gōya).
Address upgrade: Gōya is at 570-2 Nishizato.

## Pattern
Use WebSearch extended with allowed_domains set to travel.navitime.com and the query `<日本語名> <town> 詳細/周辺情報 緯度 経度`.
- Spot pages in the `02301-1300xxx` series print coordinates.
- `pn`, `1800`, `02022` and other pages usually do not.
- `<名> wikipedia 座標` returned no coordinates for any of these places.

## Status
No closures found.
