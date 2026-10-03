#!/usr/bin/env python3
# Build cities/okinawa.html from the Cleveland engine + the Okinawa dataset. Thin wrapper over
# tools/japan_build.build(). Coordinates injected from geocodes.json["cities"]["okinawa"]; build FAILS on any
# missing/UNVERIFIED pin. Areas with no gated+geocoded place are dropped.
# Prose reflects the real Okinawa content: Ryūkyū gusuku (UNESCO), Okinawa soba / taco rice canon, and the
# outlying Kerama, Miyako and Yaeyama island groups (the map spans ~500 km of ocean).
import japan_build as B

CFG = {
 "KEY": "okinawa", "OUT": "okinawa.html", "DATASET": "okinawa.dataset.json", "PFX": "oki",
 "FALLBACK": (26.2124, 127.6809, 9), "VERIFIED": "2026-10-02",
 # Frame the main island (Naha→Yanbaru); the derived 5–95% centre (~25.57,126.16) lands in the sea between the
 # main island and Miyako. Kerama/Miyako/Yaeyama stay reachable by panning/zooming out.
 "VIEW": (26.45, 127.85, 9),
 "TITLE": "Okinawa Field Guide — Sourced",
 "EYEBROW": "Field guide · Okinawa (沖縄), sourced",
 "H1_MAIN": "Okinawa",
 "H1_THIN": "the Ryūkyū islands — Naha, the main island, Kerama, Miyako &amp; Yaeyama",
 "CITY_ADDR": "Okinawa", "MYLIST": "Okinawa",
 "PH_ONE": "soki soba, taco rice, gusuku, beach…",
 "PH_FOOD": "Okinawa soba, taco rice, champurū, awamori…",
 "PH_SIGHT": "gusuku, utaki, beach, market…",
 "STANDFIRST": lambda nP, nF: (
   "%d sights and %d places to eat across <strong>Okinawa</strong> — the Ryūkyū Kingdom’s castles and sacred groves, "
   "Okinawa soba counters and taco-rice joints, from Naha out to the Miyako and Yaeyama islands — every one traceable to its source. "
   "<strong>Switch modes below</strong>, filter by <strong>area</strong>, <strong>collection</strong> or "
   "<strong>cuisine</strong>, and tick anything to build your own list, then export it to Google or Apple Maps." % (nP, nF)),
 "META": lambda nP, nF: (
   "Okinawa field guide — %d sights and %d places to eat, each traceable to its source (UNESCO, Okinawan and "
   "Japanese press, Stars and Stripes Okinawa and vetted creators) on one interactive map with area, collection and cuisine filters." % (nP, nF)),
 "REFRESH_NOTE": (
   "Web-researched and fact-checked via the pipeline (data/sources.json, docs/SOURCES.md): sourced in Japanese "
   "and English across UNESCO, the Agency for Cultural Affairs, the Ryukyu Shimpo / Okinawa Times, Stars and Stripes Okinawa, "
   "official tourism bodies (Visit Okinawa, japan-guide) and vetted creators. Every coordinate is verified into data/geocodes.json and every place status-checked open."),
}
CFG["SR_APPENDIX"] = B.sr_appendix([
 ("FOOD RULES", "How the cuisine filters were policed",
  "Every food card names a specific dish — a label alone doesn’t qualify. A cuisine tag names the kitchen’s own "
  "tradition, never one dish it serves. Tabelog and Retty scores may measure popularity but never count as a source."),
 ("HOW SOURCED", "Web-searched in Japanese and English, fact-checked",
  "Every place is traceable to two credible sources, or a lone UNESCO / Agency for Cultural Affairs "
  "designation — recorded in data/sources.json. Every coordinate is verified into data/geocodes.json and every "
  "place status-checked open. Yelp/TripAdvisor/Tabelog never count toward the two-source bar."),
])
B.build(CFG)
