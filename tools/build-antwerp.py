#!/usr/bin/env python3
# Build cities/antwerp.html from the Cleveland engine + the Antwerp dataset. Thin wrapper over
# tools/belgium_build.build(). Coordinates injected from geocodes.json["cities"]["antwerp"]; build FAILS on
# any missing/UNVERIFIED pin. Areas with no gated+geocoded place are dropped.
import belgium_build as B

CFG = {
 "KEY": "antwerp", "OUT": "antwerp.html", "DATASET": "antwerp.dataset.json", "PFX": "ant",
 "FALLBACK": (51.2194, 4.4025, 12),
 "TITLE": "Antwerp Field Guide — Sourced",
 "EYEBROW": "Field guide · Antwerp &amp; its region, sourced",
 "H1_MAIN": "Antwerp",
 "H1_THIN": "&amp; its region — Cathedral · MAS · Zuid · Zurenborg · Mechelen · the Port",
 "CITY_ADDR": "Antwerp", "MYLIST": "Antwerp",
 "PH_ONE": "handjes, Bolleke, Rubens, diamant, frietjes…",
 "PH_FOOD": "Antwerpse handjes, Bolleke, moules, frietjes…",
 "PH_SIGHT": "Onze-Lieve-Vrouwe, Het Steen, MAS, Zurenborg…",
 "STANDFIRST": lambda nP, nF: (
   "%d sights and %d places to eat across <strong>Antwerp</strong> and its region — from the Gothic "
   "<strong>Cathedral of Our Lady</strong>, the Grote Markt and <strong>Het Steen</strong> to the "
   "<strong>MAS</strong>, the Rubenshuis, the <strong>Diamond District</strong>, the art-quarter Zuid and "
   "Art-Nouveau <strong>Cogels-Osylei</strong>, out to Berchem, Deurne, the Port and <strong>Mechelen</strong>. "
   "A food canon all its own: <strong>Antwerpse handjes</strong>, a <strong>De Koninck Bolleke</strong> in a "
   "brown café, moules-frites and frietjes, and one of Europe’s great beer-bar scenes (Kulminator, Billie’s). "
   "<strong>Switch modes below</strong>, filter by <strong>area</strong>, <strong>collection</strong> or "
   "<strong>cuisine</strong> (beer is its own layer), and tick anything to build your own list, then export it "
   "to Google or Apple Maps." % (nP, nF)),
 "META": lambda nP, nF: (
   "Antwerp field guide — %d sights and %d places to eat across Antwerp and its region (Mechelen, Lier, the "
   "Port), each traceable to its source (Michelin, UNESCO, Gazet van Antwerpen, De Standaard, VRT, Visit "
   "Antwerpen) on one interactive map with area, collection and cuisine filters — beer &amp; breweries a "
   "first-class layer — a trip builder and exports." % (nP, nF)),
 "REFRESH_NOTE": (
   "Web-researched and fact-checked via the pipeline (data/sources.json, docs/SOURCES.md): sourced in Dutch "
   "(Flemish) across Michelin, UNESCO, Gault&amp;Millau, Gazet van Antwerpen, De Standaard, Het Nieuwsblad, "
   "VRT NWS, Visit Antwerpen and vetted local creators, with beer &amp; breweries grouped as a first-class "
   "layer. Every coordinate is verified into data/geocodes.json and every place status-checked open. A batch "
   "of restaurants is pending a final coordinate pass before appearing."),
}
CFG["SR_APPENDIX"] = B.sr_appendix([
 ("FOOD RULES", "How the cuisine filters were policed",
  "Every food card names a specific dish or beer — a label alone doesn’t qualify. The Antwerp canon: "
  "<b>Antwerpse handjes</b> (biscuits &amp; chocolates), a <b>De Koninck Bolleke</b>, moules-frites, frietjes, "
  "herring and Mechelse koekoek — with a deep beer-bar bench. <b>Beer &amp; breweries are their own grouped "
  "layer.</b> A cuisine tag names the kitchen’s own tradition, never one dish it happens to serve."),
 ("HOW SOURCED", "Web-searched in-language and fact-checked",
  "Every place is traceable to a credible source — Michelin, UNESCO, Gault&amp;Millau, Gazet van Antwerpen, "
  "De Standaard, Het Nieuwsblad, VRT NWS, Visit Antwerpen, beer authorities and vetted local creators — "
  "recorded in data/sources.json. Every coordinate is verified into data/geocodes.json and every place "
  "status-checked open. Yelp/TripAdvisor/RateBeer never count toward the two-source bar."),
])
B.build(CFG)
