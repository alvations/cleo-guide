#!/usr/bin/env python3
# Build cities/brussels.html from the Cleveland engine + the Brussels dataset. Thin wrapper over
# tools/belgium_build.build(). Coordinates injected from geocodes.json["cities"]["brussels"]; build FAILS on
# any missing/UNVERIFIED pin. Areas with no gated+geocoded place are dropped.
import belgium_build as B

CFG = {
 "KEY": "brussels", "OUT": "brussels.html", "DATASET": "brussels.dataset.json", "PFX": "bru",
 "FALLBACK": (50.8466, 4.3528, 12),
 "TITLE": "Brussels Field Guide — Sourced",
 "EYEBROW": "Field guide · Brussels &amp; its region, sourced",
 "H1_MAIN": "Brussels",
 "H1_THIN": "&amp; its communes — Grand-Place · Sablon · Marolles · Ixelles · Saint-Gilles · the EU quarter",
 "CITY_ADDR": "Brussels", "MYLIST": "Brussels",
 "PH_ONE": "moules-frites, gaufre, gueuze, Cantillon, Magritte…",
 "PH_FOOD": "moules-frites, carbonnade, gaufre, gueuze, kriek…",
 "PH_SIGHT": "Grand-Place, Manneken Pis, Atomium, Sablon, Magritte…",
 "STANDFIRST": lambda nP, nF: (
   "%d sights and %d places to eat across <strong>Brussels</strong> and its communes — from the gilded "
   "<strong>Grand-Place</strong> and Manneken Pis to the Royal Museums, the <strong>Atomium</strong>, the "
   "Sablon and Marolles, bohemian <strong>Ixelles</strong> and <strong>Saint-Gilles</strong>, the EU quarter "
   "and Matongé, out to Uccle, Schaerbeek, Anderlecht and Waterloo. A bilingual food canon: "
   "<strong>moules-frites</strong> and <strong>stoofvlees/carbonnade</strong>, a <strong>gaufre de Bruxelles</strong>, "
   "speculoos and chocolate houses, and the Senne-valley <strong>lambic, gueuze &amp; kriek</strong> — "
   "<strong>Cantillon</strong>, À la Mort Subite, Delirium. <strong>Switch modes below</strong>, filter by "
   "<strong>area</strong>, <strong>collection</strong> or <strong>cuisine</strong> (beer is its own layer), and "
   "tick anything to build your own list, then export it to Google or Apple Maps." % (nP, nF)),
 "META": lambda nP, nF: (
   "Brussels field guide — %d sights and %d places to eat across Brussels and its communes, each traceable to "
   "its source (Michelin, UNESCO, Le Soir, RTBF, BX1, VRT, visit.brussels) on one interactive map with area, "
   "collection and cuisine filters — beer &amp; breweries a first-class layer — a trip builder and exports." % (nP, nF)),
 "REFRESH_NOTE": (
   "Web-researched and fact-checked via the pipeline (data/sources.json, docs/SOURCES.md): sourced in French "
   "AND Dutch across Michelin, UNESCO, Gault&amp;Millau, Le Soir, La Libre, RTBF, BX1, VRT NWS, visit.brussels "
   "and vetted local creators, with beer &amp; breweries grouped as a first-class layer. Every coordinate is "
   "verified into data/geocodes.json and every place status-checked open. A batch of restaurants is pending a "
   "final coordinate pass before appearing."),
}
CFG["SR_APPENDIX"] = B.sr_appendix([
 ("FOOD RULES", "How the cuisine filters were policed",
  "Every food card names a specific dish or beer — a label alone doesn’t qualify. The Brussels canon: "
  "<b>moules-frites</b>, <b>stoofvlees/carbonnade</b>, the <b>gaufre de Bruxelles</b>, speculoos and chocolate "
  "— with the Senne-valley <b>lambic, gueuze &amp; kriek</b> (Cantillon). <b>Beer &amp; breweries are their own "
  "grouped layer.</b> A cuisine tag names the kitchen’s own tradition, never one dish it happens to serve."),
 ("HOW SOURCED", "Web-searched in French &amp; Dutch and fact-checked",
  "Every place is traceable to a credible source — Michelin, UNESCO, Gault&amp;Millau, Le Soir, La Libre, RTBF, "
  "BX1, VRT NWS, visit.brussels, beer authorities and vetted local creators — recorded in data/sources.json. "
  "Every coordinate is verified into data/geocodes.json and every place status-checked open. "
  "Yelp/TripAdvisor/RateBeer never count toward the two-source bar."),
])
B.build(CFG)
