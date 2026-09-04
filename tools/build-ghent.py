#!/usr/bin/env python3
# Build cities/ghent.html from the Cleveland engine + the Ghent dataset. Thin wrapper over
# tools/belgium_build.build(). Coordinates injected from geocodes.json["cities"]["ghent"]; build FAILS on
# any missing/UNVERIFIED pin. Areas with no gated+geocoded place are dropped.
import belgium_build as B

CFG = {
 "KEY": "ghent", "OUT": "ghent.html", "DATASET": "ghent.dataset.json", "PFX": "gen",
 "FALLBACK": (51.0543, 3.7253, 13),
 "TITLE": "Ghent Field Guide — Sourced",
 "EYEBROW": "Field guide · Ghent &amp; its region, sourced",
 "H1_MAIN": "Ghent",
 "H1_THIN": "&amp; its region — Gravensteen · the Ghent Altarpiece · Graslei · Patershol · the Leie",
 "CITY_ADDR": "Ghent", "MYLIST": "Ghent",
 "PH_ONE": "waterzooi, stoverij, cuberdon, Gruut, Van Eyck…",
 "PH_FOOD": "waterzooi, Gentse stoverij, cuberdon, Gruut…",
 "PH_SIGHT": "Gravensteen, Lam Gods, Graslei, Werregarenstraat…",
 "STANDFIRST": lambda nP, nF: (
   "%d sights and %d places to eat across <strong>Ghent</strong> and its region — from the moated "
   "<strong>Gravensteen</strong> and St Bavo’s Cathedral with the <strong>Ghent Altarpiece</strong> (Van Eyck) "
   "to the Graslei/Korenlei quays, the Belfry, the medieval <strong>Patershol</strong>, SMAK/MSK and the "
   "<strong>Werregarenstraat</strong> graffiti alley, out to Sint-Martens-Latem and the Leie. A food canon all "
   "its own: <strong>Gentse waterzooi</strong> and <strong>stoverij</strong>, the purple <strong>cuberdon</strong> "
   "(neuzekes) carts, <strong>Tierenteyn mustard</strong>, the <strong>Gruut</strong> city brewery and the boot "
   "of beer at Dulle Griet — plus Europe’s veggie capital. <strong>Switch modes below</strong>, filter by "
   "<strong>area</strong>, <strong>collection</strong> or <strong>cuisine</strong> (beer is its own layer), and "
   "tick anything to build your own list, then export it to Google or Apple Maps." % (nP, nF)),
 "META": lambda nP, nF: (
   "Ghent (Gent) field guide — %d sights and %d places to eat across Ghent and its region, each traceable to "
   "its source (Michelin, UNESCO, De Standaard, Het Nieuwsblad, VRT, Visit Gent) on one interactive map with "
   "area, collection and cuisine filters — beer &amp; breweries a first-class layer — a trip builder and "
   "exports." % (nP, nF)),
 "REFRESH_NOTE": (
   "Web-researched and fact-checked via the pipeline (data/sources.json, docs/SOURCES.md): sourced in Dutch "
   "(Flemish) across Michelin, UNESCO, Gault&amp;Millau, De Standaard, Het Nieuwsblad, VRT NWS, Visit Gent and "
   "vetted local creators, with beer &amp; breweries grouped as a first-class layer. Every coordinate is "
   "verified into data/geocodes.json and every place status-checked open. A batch of restaurants is pending a "
   "final coordinate pass before appearing."),
}
CFG["SR_APPENDIX"] = B.sr_appendix([
 ("FOOD RULES", "How the cuisine filters were policed",
  "Every food card names a specific dish or beer — a label alone doesn’t qualify. The Ghent canon: "
  "<b>waterzooi</b>, <b>Gentse stoverij</b>, the <b>cuberdon</b> (neuzekes), <b>Tierenteyn mustard</b> and a "
  "strong veg bench — with the <b>Gruut</b> brewery and jenever at ’t Dreupelkot. <b>Beer &amp; breweries are "
  "their own grouped layer.</b> A cuisine tag names the kitchen’s own tradition, never one dish it serves."),
 ("HOW SOURCED", "Web-searched in-language and fact-checked",
  "Every place is traceable to a credible source — Michelin, UNESCO, Gault&amp;Millau, De Standaard, Het "
  "Nieuwsblad, VRT NWS, Visit Gent, beer authorities and vetted local creators — recorded in data/sources.json. "
  "Every coordinate is verified into data/geocodes.json and every place status-checked open. "
  "Yelp/TripAdvisor/RateBeer never count toward the two-source bar."),
])
B.build(CFG)
