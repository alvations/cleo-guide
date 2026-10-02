# W4G3 notes — Okinawa food & drink geocoding (NANBU + HOKBU + KRM), 2026-10-02

Searches: 22/22 (cap reached).

## Channel findings
- Stripes GPS channel (site:okinawa.stripes.com "<name>" GPS, Nanjō cafés, Motobu soba round-up): 0 coords surfaced
  in 6 standard searches; search summaries don't expose the printed GPS lines.
- ja coordinate queries (緯度/経度, Wikipedia 道の駅): 0 coords.
- **WebSearch mode "extended" + "<name> tripadvisor latitude longitude"** reliably surfaced the venue listing's
  lat/lng (TripAdvisor POI coordinate) — 10 of 12 attempts (1 no coord, 1 rejected). Graded **med** (listing coordinate, not !3d!4d), each
  sanity-checked against address + nearby Stripes anchors. TripAdvisor used only as a coordinate, never as recommender.
  Orchestrator: upgrade to !3d!4d when possible; reject if policy disallows listing coords.

## Per-place
Pinned (med, 10): Itoman Osakana Center 26.13827,127.66131; Tamakaya Soba Honten 26.190836,127.745063 (Ōzato Furugen 913-1;
hotpepper/yahoo/gnavi listing); Arakaki Zenzai-ya 26.660524,127.89577; Helios 26.537409,127.96177; Yachimun Kissa Shīsā-en
26.643835,127.9412; Kajinhō 26.668528,127.90075; Cafe ichara 26.646976,127.951035 (2414-6 Izumi); Nakamura Soba
26.506754,127.86558 (Serakaki 1669-1, Onna); Kaiyō Shokudō 26.176687,127.665375 (Nakachi 192-10); Sobaya Yoshiko
26.639357,127.95863 (Izumi 2662).
REJECTED: Café Kurukuma — TripAdvisor printed 26.1444519,127.7669666, ~5 km W of Chinen 1190 → inconsistent, UNVERIFIED.
UNVERIFIED (searched, no coord): Arayama Soba, Michi-no-Eki Kyoda (addr 17-1 Kyoda), Onna no Eki (centroid only, rejected).
UNVERIFIED (not reached, cap): the other 16 — status "unknown" (not closure-checked).

## Addresses learned
Kyoda michi-no-eki 17-1 Kyoda Nago; Onna no Eki 1656-9 Nakadomari Onna; Helios 405 Kyoda; Itoman Osakana 4-19 Nishizaki.

## Closures: none found. Next wave: repeat the extended "<name> tripadvisor latitude longitude" pattern for the remaining 19.
