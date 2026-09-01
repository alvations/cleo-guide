# The Rhineland (Cologne · Bonn · Düsseldorf) — audit ledger

Append-only, one section per pipeline stage. Target density: as dense as the SaarLorLux region (~287),
deep in each of the three cities. See [docs/PIPELINE.md](../../docs/PIPELINE.md).

## Scaffold (2026-09-01)
- Areas (3, the lower-Rhine triangle, ONE map page): `KOLN` (Cologne/Köln), `BONN`, `DUS` (Düsseldorf).
- Cuisines: GER, BEER (Kölsch/Altbier/Brauhaus), FINE, JP (Little Tokyo), INT, SWEET, CAFE, VEG.
- Collections: ICON, UNESCO (Kölner Dom), HIST, ARCH, MUS, RIVER (the Rhine), PARK, MKT, NIGHT, FREE.
- `consolidate.py` + `tools/build-rhineland.py` cloned from the aachen/saarland pipeline (trimmed-bounds
  midpoint centring, near-duplicate dedup). Registered `rhineland` in research.js, geocode-status.py,
  rebuild-city.py; empty `data/geocodes.json["rhineland"]` entry. Grouped under the Germany country hub.

## Discovery — (append per wave; iterate to density)

### KOLN (Cologne / Köln) — discovery wave 1 (2026-09-01)
Agent: KOLN discovery. WebSearch only (German-first), no coordinates (address only). Output:
`SIGHTS_KOLN.json` (56, dict, a=KOLN), `FOOD_KOLN.json` (44, list, a=KOLN), `SOURCES_KOLN.json`
(21 outlets), `CREATORS_KOLN.json` (1). Consolidate parses clean: KOLN 56 sights + 44 food = 100;
0 duplicate/normalized-name collisions; 0 closures flagged.

Sights by tier: t1=13, t2=23, t3=20. Coverage: Kölner Dom (+Domschatzkammer), all TWELVE Romanesque
churches (Groß St. Martin, St. Gereon, St. Aposteln, St. Maria im Kapitol, St. Severin, St. Pantaleon,
St. Kunibert, St. Ursula, St. Andreas, St. Georg, St. Maria Lyskirchen, + St. Cäcilien via Museum
Schnütgen); museums (Ludwig, Wallraf-Richartz, Römisch-Germanisches [temp. Belgisches Haus], Schokoladen,
Kolumba, MAKK, Käthe Kollwitz, Schnütgen, Rautenstrauch-Joest, Ostasiatische Kunst, Stadtmuseum,
NS-Dok/EL-DE, Odysseum, Duftmuseum Farina, Dufthaus 4711); Altstadt (Rathaus, Praetorium, Alter Markt,
Heumarkt, Gürzenich, Römerturm, Hahnentorburg, Fischmarkt); Rhine (Hohenzollernbrücke, Kranhäuser,
Rheinauhafen, KölnTriangle, Rheinboulevard); parks (Flora, Zoo, Seilbahn, Rheinpark, Claudius Therme,
Melaten, Skulpturenpark, Stadtgarten); quarters (Belgisches Viertel, Kwartier Latäng, Ehrenfeld, Südstadt,
Nippes, Deutz); Philharmonie. Sight g-tags from ICON/UNESCO/HIST/ARCH/MUS/RIVER/PARK/MKT/NIGHT/FREE.

Food by tier: t1=10, t2=20, t3=14. Signature-first: Kölsch Brauhäuser (Früh, Malzmühle, Päffgen,
Lommerzheim [Deutz cult, Kotelett], Gaffel, Peters, Sion, Bierhaus en d'r Salzgass, Reissdorf, Hellers,
Sünner im Walfisch, Gilden im Zims) — dishes named: Halve Hahn, Himmel un Ääd, Rheinischer Sauerbraten,
Kotelett; Rhenish/German (Bei Oma Kleinmann Riesenschnitzel, Metzgerei & Salon Schmitz Mettbrötchen,
Traubenzeit, Weinhaus Vogel); Michelin bench (Ox & Klee 2*, +1*/listed: Le Moissonnier, maximilian
lorenz, astrein, neobiota, maiBeck, taku, ACHT, Pottkind, Sahila, La Société, La Cuisine Rademacher);
international (Habibi Lebanese, Asmali Konak Turkish, Hankki + Gogi Matcha Korean, Takezo + Takumi ramen,
NOI Italian, Fischermanns'); burgers (Die fette Kuh, Freddy Schilling); coffee (Van Dyck, Ernst);
sweets (Nimmersatt, Villa Kalka, Eis-Engeln, Bäckerei Balkhausen).

Merit/source notes:
- Every Michelin entry cleared on lone-institutional (guide.michelin.com) — sufficient per source bar.
  Le Moissonnier now runs as a bistro (dropped its star by choice) — kept on Michelin + Feinschmecker.
- Dom on lone UNESCO; museums/churches on official institutional (museenkoeln, romanische-kirchen-koeln,
  wallraf, kolumba, makk, kollwitz, stadt-koeln) + KölnTourismus/koeln.de → ≥2 credible.
- Non-Michelin food each carries ≥2 credible (KölnTourismus, koeln.de, Mit Vergnügen, Falstaff,
  Feinschmecker, Geheimtipp, t-online poll, Köln-Magazin). Yelp/TripAdvisor/Google excluded (measure only).
- CREATORS: Emeka Iwueze (~100k TikTok/YouTube; documented Cologne feature via koeln0221 naming Puszta
  Hütte). Kept as corroborating creator signal only — NOT used as a lone pin; Puszta Hütte NOT added
  (no verified address). No other creator had a verifiable handle+following+specific piece — none fabricated.
- HELD (not pinned, unverified address or single-source): Puszta Hütte (goulash), Viet Village, Tokyo Ramen
  Takeichi, Peppe/Rosticceria Massimo (Südstadt Italian), Zur Tant (Porz-Langel 1*, address unverified).
  Bunte Burger (vegan) DROPPED — sources indicate permanent closure; not presented as live.
- All addresses are street + Köln + PLZ + Germany, fact-checked via search; NO coordinates emitted
  (per region pipeline — geocode/location-verify happens at build stage from data/geocodes.json).
