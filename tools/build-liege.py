#!/usr/bin/env python3
# Build cities/liege.html from the Cleveland engine + the Liège dataset. Thin wrapper over
# tools/belgium_build.build(). Coordinates injected from geocodes.json["cities"]["liege"]; build FAILS on
# any missing/UNVERIFIED pin. Areas with no gated+geocoded place are dropped.
import belgium_build as B

CFG = {
 "KEY": "liege", "OUT": "liege.html", "DATASET": "liege.dataset.json", "PFX": "lie",
 "FALLBACK": (50.6412, 5.5718, 13),
 "HUB": "../Belgium/index.html",
 "TITLE": "Liège Field Guide — Sourced",
 "EYEBROW": "Field guide · Liège &amp; the Meuse valley, sourced",
 "H1_MAIN": "Liège",
 "H1_THIN": "&amp; the Meuse — Montagne de Bueren · Palais · Batte · Guillemins · Spa · Huy · Val-Dieu",
 "CITY_ADDR": "Liège", "MYLIST": "Liège",
 "PH_ONE": "boulets, gaufre de Liège, péket, Val-Dieu, Herve…",
 "PH_FOOD": "boulets à la liégeoise, gaufre, péket, Herve, Val-Dieu…",
 "PH_SIGHT": "Montagne de Bueren, Curtius, Guillemins, Blegny-Mine, Spa…",
 "STANDFIRST": lambda nP, nF: (
   "%d sights and %d places to eat across <strong>Liège</strong> and the Meuse valley — from the 374 steps of the "
   "<strong>Montagne de Bueren</strong>, the <strong>Prince-Bishops' Palace</strong>, the <strong>Grand Curtius</strong> "
   "and La Boverie to the Sunday <strong>Batte</strong> market, Outremeuse and Calatrava's <strong>Guillemins</strong> "
   "station, out to <strong>Spa</strong>, Francorchamps, <strong>Huy</strong>, the abbey of <strong>Val-Dieu</strong> "
   "and the UNESCO coal mine at <strong>Blegny</strong>. A food canon all its own: <strong>boulets à la liégeoise</strong> "
   "in sauce lapin, the pearl-sugar <strong>gaufre de Liège</strong>, salade liégeoise, <strong>péket</strong>, sirop de "
   "Liège and <strong>Herve</strong> cheese. <strong>Switch modes below</strong>, filter by <strong>area</strong>, "
   "<strong>collection</strong> or <strong>cuisine</strong> (beer is its own layer), and tick anything to build your own "
   "list, then export it to Google or Apple Maps." % (nP, nF)),
 "META": lambda nP, nF: (
   "Liège field guide — %d sights and %d places to eat across Liège and the Meuse valley (Spa, Huy, Herve, Val-Dieu, "
   "Blegny-Mine), each traceable to its source (Michelin, UNESCO, Le Soir, RTBF, La Meuse, Visit Liège) on one "
   "interactive map with area, collection and cuisine filters — beer &amp; breweries a first-class layer — a trip "
   "builder and exports." % (nP, nF)),
 "REFRESH_NOTE": (
   "Web-researched and fact-checked via the pipeline (data/sources.json, docs/SOURCES.md): sourced in French "
   "across Michelin, UNESCO, Gault&amp;Millau, Le Soir, La Libre, RTBF, La Meuse, L'Avenir, Visit Liège, Wallonie "
   "Belgique Tourisme and the Walloon heritage agency, with beer &amp; breweries grouped as a first-class layer. "
   "Every coordinate is verified into data/geocodes.json and every place status-checked. Places whose exact pin "
   "could not be verified are held back until a final coordinate pass."),
}
CFG["SR_APPENDIX"] = B.sr_appendix([
 ("FOOD RULES", "How the cuisine filters were policed",
  "Every food card names a specific dish or beer — a label alone doesn’t qualify. The Liège canon: "
  "<b>boulets à la liégeoise</b> (sauce lapin with sirop de Liège), the pearl-sugar <b>gaufre de Liège</b>, "
  "salade liégeoise, <b>péket</b>, sirop de Liège and <b>Herve</b> cheese. <b>Beer &amp; breweries are their own "
  "grouped layer</b> (Val-Dieu, Brasserie C, Jupiler’s Jupille). A cuisine tag names the kitchen’s own "
  "tradition, never one dish it happens to serve."),
 ("HOW SOURCED", "Web-searched in French and fact-checked",
  "Every place is traceable to a credible source — Michelin, UNESCO, Gault&amp;Millau, Le Soir, La Libre, RTBF, "
  "La Meuse, L’Avenir, Visit Liège, Wallonie Belgique Tourisme, beer authorities and vetted creators — recorded "
  "in data/sources.json. Every coordinate is verified into data/geocodes.json and every place status-checked. "
  "Yelp/TripAdvisor/RateBeer never count toward the two-source bar."),
])
B.build(CFG)
