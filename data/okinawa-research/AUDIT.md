# Okinawa — AUDIT (append-only, one section per stage/wave)

## 2026-10-02 — scaffold
- Areas (7), Japan taxonomy (`tools/japan_consolidate.py`), wrappers, registry keys. No places yet.

## 2026-10-02 — Wave W1 (Naha sights backbone + canon probe) — TRUNCATED by the shared WebSearch cap
**Searches run:** 17 (EN + JA). The session-wide WebSearch budget (200/200, shared by ~16 concurrent agents) was
exhausted mid-wave; every further call returns "Web search was not performed … 200 of 200". This is a hard
per-session cap (`CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION`), not a rate limit — re-tested once, still blocked.
No place below was added from memory; every source URL cited was returned by a search.

### Stage 1 — sources discovered (+ why credible)
- `STRIPES` Stars and Stripes Okinawa — staff-written food/travel desk of the DoD-authorized daily; **prints venue
  GPS (`N 26.xxx, E 127.xxx`) in its listings** → doubles as an outlet-published coordinate for restaurants.
- `PARTSUNKNOWN` CNN / Anthony Bourdain's Explore Parts Unknown (taco-rice origin story).
- `JAPANTRAVEL` japantravel.com (named writers; corroborating). `RAMENADVENTURES` Brian MacDuckston (creator named in
  the Japan brief; 1 corroborating source). `GOVONLINE` Highlighting Japan (Cabinet Office PR). `SAMURAIARCHIVES`
  SamuraiWiki (historian-edited; heritage corroboration only). Reused: UNESCO, JAPANGUIDE, VISITOKINAWA,
  LONELYPLANET, WIKIPEDIA, RYUKYUSHIMPO.
- REJECTED as recommenders: hamoni.jp, taiken.co, his-usa blog, hotels.com/hoteles "best of" pages, trip.com,
  kupi.com, jeepe.jp, onookinawa (personal blog) — SEO/aggregator listicles.

### Stage 2–3 — extracted & fact-checked (13 kept; all PASS sourcecheck — 3 on lone UNESCO)
- NAHA (6 sights): Shuri Castle (t1; Seiden interior reopens 2026-11-23 per japan-guide), Tamaudun (t1), Shikinaen
  (t1), Makishi Public Market (t1; new building open since 2023-03-19), Sonohyan-utaki Ishimon (t2), Naminoue Shrine (t2).
- NANBU: Sefa-utaki (t1). CHUBU: Nakagusuku (t1), Zakimi (t2), Katsuren (t2). HOKBU: Nakijin (t1, lone UNESCO).
- Food canon (HOKBU): Kishimoto Shokudo (est. 1905, ash-lye soba; STRIPES + RAMENADVENTURES), King Tacos Kin (taco
  rice; STRIPES + PARTSUNKNOWN + JAPANTRAVEL). Kin town is 国頭郡 → filed HOKBU (prefecture regioning).
- **Held (single/uncredible source only):** Shuri Soba / Shuri Ukaji Soba, Miyazato Soba (Nago), Yanbaru Soba,
  Tsuboya Yachimun-dōri (only hotels.com/trip.com surfaced before the cap) — re-source next wave.
- Closures found: none.
- Channel mix this wave: institutional 7 (UNESCO), editorial/travel 9 (japan-guide, Visit Okinawa, Lonely Planet,
  Stripes, Parts Unknown, Ryukyu Shimpo, gov-online), creator 1 (Ramen Adventures), local 0.

### Stage 5 — geocode (geo/_geoout_okinawa_W1.json)
- high 4: Tamaudun, Naminoue, Sefa-utaki (Wikipedia infobox), Kishimoto Shokudo (Stripes venue GPS).
- med 2: Shuri Castle (DMS surfaced with japan-guide/japantravel), Sonohyan-utaki Ishimon (Sygic POI DB).
- UNVERIFIED 7 (helper queue): Shikinaen (4 searches, no coord), Makishi Public Market, King Tacos Kin, and
  Nakagusuku/Nakijin/Zakimi/Katsuren (only UNESCO 2–3-dp component centroids — rejected as too coarse).
- Lesson: one-place-per-query "<name> coordinates wikipedia" surfaces infobox DMS ~50% of the time; multi-place
  queries and Japanese "北緯 東経" queries mostly fail; mapcarta/latitude.to queries do not surface.

### Stage 6 — build
Not built: 6 verified pins is not a map. `rebuild-city.py okinawa` (prep) ran: consolidate 11 sights + 2 food,
sourcecheck PASS 13/13. Card stays "Being built"; Japan not flipped live by this agent.

## 2026-10-02 — Wave W2 (relaunch; all areas) — in progress, appended per batch
**Method.** Stars and Stripes Okinawa (`STRIPES`) is the coordinate workhorse: its staff articles print venue GPS,
and list articles ("12 Battle of Okinawa sites", "List of beaches", soba guide, castle pieces) yield 5–12 GPS per
search. Each Stripes place is then paired with an independent second source — japan-guide, Visit Okinawa, Lonely
Planet, Mapple (Shobunsha まっぷる editorial spot pages; new key `MAPPLE`), Atlas Obscura, Savor Japan — never two
Stripes articles (one outlet = one source; Itokazu Castle was held for exactly this reason). Island coordinates come
from Wikipedia infoboxes and Atlas Obscura place pages. Raw per-search log: `_okinawa_w2_notes.md`.
**Policy call (recorded):** for a sight that *is* a small island (Taketomi 5 km², Kurima 2.8 km², Ikema 2.8 km²)
the island's own Wikipedia coordinate is accepted at `med`/`low` — it is the place's coordinate, not a town
centroid. Ikema (minute precision) is `low` → re-verify queue.
**Batches 1–4 (commits through batch 4):** +52 places (45 sights, 7 food). Channel mix: editorial/travel
(japan-guide, Visit Okinawa/JNTO, Lonely Planet, Mapple, Savor Japan) ~60 citations; Stripes ~40; institutional
(Wikipedia-backed designations, Miyakojima city register) ~5; Atlas Obscura 6; creators 0 (see CREATORS_OKINAWA_W2
rejected list — no vetted creator surfaced a place-specific Okinawa video/post in 4 creator queries).
**Geocode:** 57 W2 records; resolves W1 UNVERIFIED Nakagusuku, Zakimi, Katsuren, Makishi, King Tacos (Stripes GPS).
UNVERIFIED (helper queue): Mikasa, Jack's Steak House, Yūnangi, Sakaemachi, Sunayama, Higashi-hennazaki, Irabu
Bridge, Gangala, Bise Fukugi, Fukushū-en, Hate-no-hama (+ W1 Shikinaen, Nakijin).
**MEASURED & held (single source so far):** Itokazu Castle (Stripes ×2), Ufuya Nago, Sawanoya, Kairo, Heiwaen soba,
Ishigufu, Captain Kangaroo, HAPI TAPI, Orion Happy Park, Kakazu Ridge, Sugar Loaf, Nirai Kanai Bridge, Cape Zanpa
drive-in park, Hanagasa Shokudo, Shuri Soba, Arakaki Zenzai, GATE1 Kin, Tamaya zenzai, Kudaka Island, Aharen Beach,
Kondoi Beach, Urauchi River, court-cuisine Mie / Sui Dunchi (Japan Times only). **Rejected recommenders:** taiken.co,
hamoni.jp, livelyhotels, japanactivity, aumo, veltra, nap-camp, haveagood-holiday, wanderlog, trip.com.
**Closures:** none found so far (statuses from the citing outlets, 2025–26).
**Build (mid-wave, bg agent):** 49/51 rendered; sourcecheck/geocheck/statuscheck/buildcheck PASS; validate+test PASS.
Derived view landed in the sea (25.57,126.16 z8) → opt-in `CFG["VIEW"]` added to tools/belgium_build.py, Okinawa sets
(26.45,127.85,9).
