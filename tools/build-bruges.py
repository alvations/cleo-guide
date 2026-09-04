#!/usr/bin/env python3
# Build cities/bruges.html from the Cleveland engine + the Bruges dataset. Thin wrapper over
# tools/belgium_build.build(). Coordinates injected from geocodes.json["cities"]["bruges"]; build FAILS on
# any missing/UNVERIFIED pin. Areas with no gated+geocoded place are dropped.
import belgium_build as B

CFG = {
 "KEY": "bruges", "OUT": "bruges.html", "DATASET": "bruges.dataset.json", "PFX": "brg",
 "FALLBACK": (51.2085, 3.2251, 13),
 "TITLE": "Bruges Field Guide — Sourced",
 "EYEBROW": "Field guide · Bruges &amp; the coast, sourced",
 "H1_MAIN": "Bruges",
 "H1_THIN": "&amp; the coast — Markt &amp; Belfry · Holy Blood · Groeninge · Béguinage · Damme · Ostend",
 "CITY_ADDR": "Bruges", "MYLIST": "Bruges",
 "PH_ONE": "Brugse Zot, garnaalkroketten, chocolate, moules…",
 "PH_FOOD": "Brugse Zot, garnaalkroketten, moules, waffles…",
 "PH_SIGHT": "Belfort, Heilig Bloed, Groeninge, Begijnhof, Damme…",
 "STANDFIRST": lambda nP, nF: (
   "%d sights and %d places to eat across <strong>Bruges</strong> and the coast — from the <strong>Markt</strong> "
   "and its Belfry, the Burg and the Basilica of the <strong>Holy Blood</strong> to the <strong>Groeningemuseum</strong>, "
   "the Béguinage and the canals, and the <strong>De Halve Maan</strong> brewery, out to <strong>Damme</strong> and "
   "the North-Sea resorts — <strong>Ostend</strong>, Knokke, Zeebrugge. A food canon all its own: a "
   "<strong>De Halve Maan Brugse Zot</strong>, Belgian chocolate (The Chocolate Line, Dumon), "
   "<strong>garnaalkroketten</strong> (grey-shrimp croquettes), moules, waffles and North-Sea fish. "
   "<strong>Switch modes below</strong>, filter by <strong>area</strong>, <strong>collection</strong> or "
   "<strong>cuisine</strong> (beer is its own layer), and tick anything to build your own list, then export it "
   "to Google or Apple Maps." % (nP, nF)),
 "META": lambda nP, nF: (
   "Bruges (Brugge) field guide — %d sights and %d places to eat across Bruges and the Belgian coast (Damme, "
   "Ostend, Knokke), each traceable to its source (Michelin, UNESCO, De Standaard, VRT, Visit Bruges) on one "
   "interactive map with area, collection and cuisine filters — beer &amp; breweries a first-class layer — a "
   "trip builder and exports." % (nP, nF)),
 "REFRESH_NOTE": (
   "Web-researched and fact-checked via the pipeline (data/sources.json, docs/SOURCES.md): sourced in Dutch "
   "(Flemish) across Michelin, UNESCO, Gault&amp;Millau, De Standaard, Het Nieuwsblad, VRT NWS, Visit Bruges "
   "and vetted local creators, with beer &amp; breweries grouped as a first-class layer. Every coordinate is "
   "verified into data/geocodes.json and every place status-checked open. A batch of restaurants is pending a "
   "final coordinate pass before appearing."),
}
CFG["SR_APPENDIX"] = B.sr_appendix([
 ("FOOD RULES", "How the cuisine filters were policed",
  "Every food card names a specific dish or beer — a label alone doesn’t qualify. The Bruges canon: a "
  "<b>De Halve Maan Brugse Zot</b>, Belgian <b>chocolate</b> (The Chocolate Line, Dumon), <b>garnaalkroketten</b>, "
  "moules, waffles and North-Sea fish. <b>Beer &amp; breweries are their own grouped layer.</b> A cuisine tag "
  "names the kitchen’s own tradition, never one dish it happens to serve."),
 ("HOW SOURCED", "Web-searched in-language and fact-checked",
  "Every place is traceable to a credible source — Michelin, UNESCO, Gault&amp;Millau, De Standaard, Het "
  "Nieuwsblad, VRT NWS, Visit Bruges, beer authorities and vetted local creators — recorded in "
  "data/sources.json. Every coordinate is verified into data/geocodes.json and every place status-checked open. "
  "Yelp/TripAdvisor/RateBeer never count toward the two-source bar."),
])
B.build(CFG)
