#!/usr/bin/env python3
# Build cities/osaka.html from the Cleveland engine + the Osaka dataset. Thin wrapper over
# tools/japan_build.build(). Coordinates injected from geocodes.json["cities"]["osaka"]; build FAILS on any
# missing/UNVERIFIED pin. Areas with no gated+geocoded place are dropped.
# Prose rewritten 2026-10-02 (W2) once the dataset had depth: konamon canon, Michelin Osaka, Kita/Minami split.
import japan_build as B

CFG = {
 "KEY": "osaka", "OUT": "osaka.html", "DATASET": "osaka.dataset.json", "PFX": "osk",
 "FALLBACK": (34.6937, 135.5023, 12), "VERIFIED": "2026-10-02",
 "TITLE": "Osaka Field Guide — Sourced",
 "EYEBROW": "Field guide · Osaka (大阪), sourced",
 "H1_MAIN": "Osaka",
 "H1_THIN": "Kita · Minami · the Castle · Shinsekai · the Bay · Kansai day trips",
 "CITY_ADDR": "Osaka", "MYLIST": "Osaka",
 "PH_ONE": "takoyaki, kushikatsu, udon, castle…",
 "PH_FOOD": "takoyaki, okonomiyaki, kushikatsu, udon…",
 "PH_SIGHT": "castle, shrine, kofun, museum…",
 "STANDFIRST": lambda nP, nF: (
   "%d sights and %d places to eat across <strong>Osaka</strong> — the city of <em>kuidaore</em>, eat till you drop — "
   "every one traceable to its source: okonomiyaki teppan, kushikatsu counters, "
   "Michelin Bib Gourmand udon and soba, Kita and Minami, the castle, the bay and the Kansai ring. "
   "<strong>Switch modes below</strong>, filter by <strong>area</strong>, <strong>collection</strong> or "
   "<strong>cuisine</strong>, and tick anything to build your own list, then export it to Google or Apple Maps." % (nP, nF)),
 "META": lambda nP, nF: (
   "Osaka field guide — %d sights and %d places to eat, each traceable to its source (Michelin, UNESCO, "
   "Japanese press and vetted creators) on one interactive map with area, collection and cuisine filters." % (nP, nF)),
 "REFRESH_NOTE": (
   "Web-researched and fact-checked via the pipeline (data/sources.json, docs/SOURCES.md): sourced in Japanese "
   "and English across Michelin, UNESCO, Japanese national and regional press, official tourism bodies and vetted "
   "creators. Every coordinate is verified into data/geocodes.json and every place status-checked open."),
}
CFG["SR_APPENDIX"] = B.sr_appendix([
 ("FOOD RULES", "How the cuisine filters were policed",
  "Every food card names a specific dish — a label alone doesn’t qualify. A cuisine tag names the kitchen’s own "
  "tradition, never one dish it serves. Tabelog and Retty scores may measure popularity but never count as a source."),
 ("HOW SOURCED", "Web-searched in Japanese and English, fact-checked",
  "Every place is traceable to two credible sources, or a lone Michelin / UNESCO / Agency for Cultural Affairs "
  "designation — recorded in data/sources.json. Every coordinate is verified into data/geocodes.json and every "
  "place status-checked open. Yelp/TripAdvisor/Tabelog never count toward the two-source bar."),
])
B.build(CFG)
