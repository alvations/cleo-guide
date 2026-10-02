#!/usr/bin/env python3
# Build cities/kyoto.html from the Cleveland engine + the Kyoto dataset. Thin wrapper over
# tools/japan_build.build(). Coordinates injected from geocodes.json["cities"]["kyoto"]; build FAILS on any
# missing/UNVERIFIED pin. Areas with no gated+geocoded place are dropped.
# The prose below is a SCAFFOLD — the Kyoto agent rewrites it once the dataset has real depth.
import japan_build as B

CFG = {
 "KEY": "kyoto", "OUT": "kyoto.html", "DATASET": "kyoto.dataset.json", "PFX": "kyo",
 "FALLBACK": (35.0116, 135.7681, 12), "VERIFIED": "2026-10-02",
 "TITLE": "Kyoto Field Guide — Sourced",
 "EYEBROW": "Field guide · Kyoto (京都), sourced",
 "H1_MAIN": "Kyoto",
 "H1_THIN": "Higashiyama-ku · Sakyō-ku · Nakagyō & Shimogyō · Kita & Kamigyō · Ukyō & Nishikyō",
 "CITY_ADDR": "Kyoto", "MYLIST": "Kyoto",
 "PH_ONE": "ramen, sushi, temple, onsen…",
 "PH_FOOD": "ramen, sushi, izakaya, matcha…",
 "PH_SIGHT": "temple, shrine, castle, garden…",
 "STANDFIRST": lambda nP, nF: (
   "%d sights and %d places to eat across <strong>Kyoto</strong>, every one traceable to its source. "
   "<strong>Switch modes below</strong>, filter by <strong>area</strong>, <strong>collection</strong> or "
   "<strong>cuisine</strong>, and tick anything to build your own list, then export it to Google or Apple Maps." % (nP, nF)),
 "META": lambda nP, nF: (
   "Kyoto field guide — %d sights and %d places to eat, each traceable to its source (Michelin, UNESCO, "
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
