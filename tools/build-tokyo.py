#!/usr/bin/env python3
# Build cities/tokyo.html from the Cleveland engine + the Tokyo dataset. Thin wrapper over
# tools/japan_build.build(). Coordinates injected from geocodes.json["cities"]["tokyo"]; build FAILS on any
# missing/UNVERIFIED pin. Areas with no gated+geocoded place are dropped.
# Prose rewritten 2026-10-02 (W2) once the dataset reached ~250 places across all 13 areas.
import japan_build as B

CFG = {
 "KEY": "tokyo", "OUT": "tokyo.html", "DATASET": "tokyo.dataset.json", "PFX": "tyo",
 "FALLBACK": (35.6812, 139.7671, 11), "VERIFIED": "2026-10-02",
 "TITLE": "Tokyo Field Guide — Sourced",
 "EYEBROW": "Field guide · Tokyo (東京), sourced",
 "H1_MAIN": "Tokyo",
 "H1_THIN": "ward by ward · Jōnan · Jōsai · Jōhoku · Jōtō · Tama · Kantō day trips",
 "CITY_ADDR": "Tokyo", "MYLIST": "Tokyo",
 "PH_ONE": "soba, tonkatsu, shrine, garden…",
 "PH_FOOD": "ramen, sushi, izakaya, matcha…",
 "PH_SIGHT": "temple, shrine, castle, garden…",
 "STANDFIRST": lambda nP, nF: (
   "%d sights and %d places to eat across <strong>Tokyo</strong>, organised the way Tokyoites think about the city — "
   "the big special wards (Chiyoda, Chūō, Minato, Shinjuku, Shibuya, Taitō, Sumida-Kōtō) as their own areas, the rest "
   "by the old compass terms <strong>Jōnan, Jōsai, Jōhoku and Jōtō</strong>, then the <strong>Tama</strong> hills and "
   "the <strong>Kantō day-trip ring</strong> (Kamakura, Hakone, Nikkō, Kawagoe, Fuji Five Lakes, Yokohama). The food "
   "list starts from what is Tokyo's own — Kanda soba, Edomae sushi and unagi, monjayaki, dozeu loach, yōshoku omurice, "
   "tonkatsu and shōyu ramen — with the Michelin bench and century-old shinise beside each other. Every place is "
   "traceable to its source. <strong>Switch modes below</strong>, filter by <strong>area</strong>, "
   "<strong>collection</strong> or <strong>cuisine</strong>, and tick anything to build your own list, then export "
   "it to Google or Apple Maps." % (nP, nF)),
 "META": lambda nP, nF: (
   "Tokyo field guide — %d sights and %d places to eat, each traceable to its source (Michelin, UNESCO, "
   "Japanese press and vetted creators) on one interactive map with area, collection and cuisine filters." % (nP, nF)),
 "REFRESH_NOTE": (
   "Web-researched and fact-checked via the pipeline (data/sources.json, docs/SOURCES.md): the Michelin Guide "
   "Japan 2026 (venue pages carry the pin), GO TOKYO (the official Tokyo tourism site), japan-guide, Time Out Tokyo, "
   "The Japan Times, Savor Japan, UNESCO, Wikipedia/Wikidata published coordinates and vetted creators (Ramen "
   "Adventures, Paolo fromTOKYO). Every coordinate is verified into data/geocodes.json; closed places stay, flagged."),
}
CFG["SR_APPENDIX"] = B.sr_appendix([
 ("FOOD RULES", "How the cuisine filters were policed",
  "Every food card names a specific dish — a label alone doesn’t qualify. A cuisine tag names the kitchen’s own "
  "tradition, never one dish it serves. Tabelog and Retty scores may measure popularity but never count as a source."),
 ("HOW SOURCED", "Web-searched in Japanese and English, fact-checked",
  "Every place is traceable to two credible sources, or a lone Michelin / UNESCO / Agency for Cultural Affairs "
  "designation — recorded in data/sources.json. Every coordinate is verified into data/geocodes.json and every "
  "place status-checked open. Yelp/TripAdvisor/Tabelog never count toward the two-source bar."),
 ("REGIONS", "Why the areas look the way they do",
  "Tokyo has no boroughs; its 23 special wards (tokubetsu-ku) are the equivalent. The seven densest get their own "
  "area; the other sixteen are grouped by the long-standing compass terms Jōnan (south: Shinagawa, Meguro, Ōta), "
  "Jōsai (west: Setagaya, Nakano, Suginami), Jōhoku (north: Toshima, Bunkyō, Kita, Arakawa, Itabashi, Nerima) and "
  "Jōtō (east: Katsushika, Edogawa, Adachi). Every place is filed by the ward its address names."),
 ("GAPS", "What is thin, and why",
  "Pins come only from published coordinates (Michelin venue pages, Wikipedia/Wikidata) — never from a map viewport "
  "or a ward centroid — so some well-sourced restaurants wait off the map until a place pin is found. The Tama and "
  "Kantō food lists are thin for that reason; it is stated here rather than filled with weaker picks."),
])
B.build(CFG)
