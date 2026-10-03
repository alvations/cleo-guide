# W92 — ANIME & pop-culture wave 3 (Hokkaido seichi junrei) — 2026-10-03 (s5)

**Queries run: 29 WebSearch** (cap 30). No WebFetch. Script: `_w92_anime.py` → `SIGHTS_HOKKAIDO_W92.json`,
`geo/_geoout_hokkaido_w92.json`, `SOURCES_HOKKAIDO_W92.json`, overlays `SIGHTS_HOKKAIDO_W92O.json` (13).
The script asserts every overlay name is in `_hk_existing_names.txt` AND that its original record sorts before the overlay
file (the consolidator overlays onto the first record seen).

Channel mix: Japanese anime/press (Mynavi, @DIME, Denfaminicogamer, Famitsu, Anime!Anime!, Hokkaido Shimbun, Waraku) 9 ·
official municipal (Sapporo city Pokéfuta page, Hokkaido pref Pokéfuta page, Otaru city event PDFs) 4 · tourism/guide
(rurubu, mapple, furanotourism, JAL OnTrip, Impress Travel Watch, fun-japan) 7 · English notable (SoraNews24 1; ANN only
film reviews — no locations) · creators 2 queries, 0 counted (see CREATORS_HOKKAIDO_W92.json).

## Kept — new (2 sights, 0 food)
| Place | Area | Sources | Pin |
|---|---|---|---|
| Rokugō no Mori — 'Kita no Kuni kara' location (麓郷の森) | DHOKU | WIKIPEDIA_JA; FURANOTOURISM 404; MAPPLE art.42419 | **high** 43.312417,142.540528 (ja.wikipedia infobox) |
| Gorō's Stone House — 'Kita no Kuni kara' (五郎の石の家・最初の家) | DHOKU | RURUBU 80001183; FURANOTOURISM 401; MAPPLE art.42419 | **UNVERIFIED** |
Both pop-culture (TV drama) rather than anime; tagged `anime=` per the "anime & pop culture" layer.

## Overlays (SIGHTS_HOKKAIDO_W92O.json — sources + anime only)
- **Detective Conan: The Million-dollar Pentagram (2024, Hakodate)** — Goryōkaku (MYNAVI, DIME, HOKKAIDOSHIMBUN 1160689:
  tram ridership back above 5M on the "Conan effect"), Mount Hakodate (MYNAVI, DIME, JALONTRIP), Hakodate Morning Market (DIME),
  Kanemori Red Brick Warehouses (DIME), Goryōkaku Tower (DIME, MAPPLE original 470408), Hachimanzaka (MAPPLE 470408, MYNAVI).
  (Tower/Hachimanzaka/Kanemori already carry a Love Live/Golden Kamuy note — first note wins; sources merge.)
- **Love Live! Sunshine!!** — Lucky Pierrot Bay Area Honten (FOOD overlay; official Aqours × Saint Snow AR stamp-rally point:
  TRAVELWATCH 1286441, JALONTRIP).
- **Golden Kamuy** — Shiroi Koibito Park (ISHIYA collab tins, 6th ed. Mar 2026, sold at Shop Piccadilly: DENFAMI, FAMITSU,
  ANIMEANIME) · Sapporo Beer Museum (Noda Satoru's signed shikishi: WARAKU) · Otaru City General Museum (2016 exhibition
  "Otaru inside Golden Kamuy": OFFICIAL Otaru city PDFs ×2) · Otaru Canal (SORANEWS24, FUNJAPAN).
- **Pokémon** — Jōzankei Onsen (Sapporo's Pokéfuta, Vulpix & Slaking, at the Jōzankei Tourist Association: OFFICIAL
  city.sapporo.jp + OFFICIAL pref.hokkaido.lg.jp Pokéfuta page — 50 Hokkaido municipalities have Poké-lids).
- **Snow Miku** — Ōdōri Park (17th year of the Snow Miku statue at the Snow Festival's 11-chōme site: ANIMEANIME PR release, MYNAVI).

## MEASURED & DROPPED / HELD
- Former NYK Otaru Branch (旧日本郵船小樽支店, Important Cultural Property) — Golden Kamuy tie only from cotaru.co (blog);
  no wiki coords surfaced. HELD (would clear as a plain sight on ICP + MLIT official text).
- Yūbari Coal Mine Museum — wiki coords 43.068389,141.98917 + Hokkaido Shimbun 1154360 (mock mine reopened), but no source
  ties it to Golden Kamuy. HELD for a non-anime wave.
- Hokkaido Gokoku Shrine, Asahikawa — wiki coords 43.788167,142.366750 found; still no credible Golden Kamuy tie (blogs only). Dropped again.
- Asahikawa City Museum — Golden Kamuy character panels per johnny88 blog only. HELD.
- Kitami (Dosanko Gal wa Namaramenkoi) — Hokkaido Shimbun 1038717 confirms city-wide panels/coasters at the Kitami Station
  tourist office, no venue with ≥2 ties. Kitami Hakka Memorial Museum (RURUBU 80000930, HOKKAIDOSHIMBUN 1341629, wiki
  43.79972,143.89389) clears the bar as a sight but has no anime tie → HELD for a DOTO sights wave.
- Michi-no-eki Onneyu Onsen (Kitami) — Pokéfuta (Vulpix & Alolan Vulpix) per Hokkaido Shimbun video; one source only. HELD.
- Silver Spoon — only the Yotsuba milk-carton collab (not a visitable venue); Obihiro Agricultural HS still excluded.
- Animate Sapporo / Mandarake Sapporo — no credible source surfaced in 2 queries. Dropped.
- Golden Kamuy food/collab cafés — results were Tokyo (Pasela Shinjuku, Midtown Hibiya); Abashiri prison canteen no collab;
  Poronno/Akan Ainu Kotan no explicit Golden Kamuy source. None kept.
- Conan Hakodate food collabs — none found.
- FOOD-FIRST target (≥60%) NOT met: anime-tied Hokkaido food venues with ≥2 credible ties are scarce; 1 food overlay only.

## New outlet keys (SOURCES_HOKKAIDO_W92.json)
DIME · DENFAMI · SORANEWS24 · FURANOTOURISM (used since W83/W90, registered here). Reused: MYNAVI, ANIMEANIME, WARAKU,
JALONTRIP, TRAVELWATCH, FAMITSU, FUNJAPAN, HOKKAIDOSHIMBUN, MAPPLE, RURUBU, WIKIPEDIA_JA, OFFICIAL.

Pins: 1 high, 0 med, 1 unverified. Status: all open; no closures found.
