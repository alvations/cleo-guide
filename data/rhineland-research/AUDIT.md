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

---

## BONN — discovery pass (agent)

Files: `SIGHTS_BONN.json` (34 sights, DICT with sources[]), `FOOD_BONN.json` (19 food/drink, LIST),
`SOURCES_BONN.json` (14 outlets), `CREATORS_BONN.json` (empty — see note). All parse; `consolidate.py`
runs clean (BONN contributes 52 records after cross-area dedup). Searched IN GERMAN; NO coordinates emitted.

SIGHTS (34): tiers t1=13, t2=13, t3=8. Coverage of the brief's canon —
- Beethoven: Beethoven-Haus (birthplace), Beethoven-Denkmal (Münsterplatz, 1845, oldest in DE), Redoute
  (Beethoven played before Haydn), Beethovenhalle.
- Museumsmeile: Haus der Geschichte (free), Museum Koenig (Grundgesetz birthplace), Kunstmuseum Bonn,
  Bundeskunsthalle, Deutsches Museum Bonn; plus LVR-LandesMuseum, August Macke Haus, Arithmeum, Frauenmuseum.
- Core: Bonner Münster, Altes Rathaus & Markt, Poppelsdorfer Schloss & Botanischer Garten, Freizeitpark
  Rheinaue, Alter Zoll, Kurfürstliches Schloss & Hofgarten, Bonner Kirschblüte (Heerstraße), Rheinuferpromenade,
  Kreuzbergkirche, Doppelkirche Schwarzrheindorf, Sterntor, Namen-Jesu-Kirche, Alter Friedhof (Schumann),
  Post Tower.
- Government/UN quarter: UN Campus & Langer Eugen, Kanzlerbungalow & Palais Schaumburg, Villa Hammerschmidt.
- Bad Godesberg: Godesburg, Stadtpark & Kurpark; edge day-trip across the Rhine: Drachenfels & Drachenfelsbahn,
  Schloss Drachenburg.
- `g` uses HIST/ARCH/MUS/RIVER/PARK/MKT/ICON/FREE (no UNESCO in Bonn, per brief).

FOOD (19): tiers t1=5, t2=10, t3=4; closures=1.
- Signature/Rheinisch: Brauhaus Bönnsch (Bönnsch, the city's own beer + Halve Hahn), Em Höttche (Rheinischer
  Sauerbraten; Bonn's oldest gasthaus, 1389), Im Sudhaus (Reibekuchen), Maternus (Bonn-Republic institution).
- Michelin bench (lone-institutional): halbedel's Gasthaus (1*), Yunico (1*, Japanese omakase), Strandhaus
  (Guide, Mediterranean), Redüttchen (Guide/2 Hauben), Oliveto (Guide, Italian), Konrad's (Michelin Plate).
- Castle/historic dining: Restaurant Godesburg (Böhm building), Rheinhotel Dreesen (1894 Art-Nouveau Rhine terrace).
- Veg/Levantine/café/sweet: Cassius Garten (wholefood-veg institution), Mr. and Mrs. Humus (Levantine),
  Café Blau (brunch in a former pool), Café Spitz, Der Kaffeeladen (specialty roastery), Café Profittlich
  (Konditorei, Herrentorte — at the foot of the Drachenfels, on the day-trip).

Merit/source notes:
- Every sight carries ≥2 credible (official site + BONNDE/BONNTOURISMUS/KULADIG/BAUKUNSTNRW/NRWTOURISMUS/
  Wikipedia). Museums/monuments lean on official + regional authority (LVR KuLaDig, Architektenkammer NRW).
- Michelin food cleared on lone-institutional (guide.michelin.com) + a 2nd guide (Falstaff/Feinschmecker/Gusto).
- Kaspars: Michelin star holder that CLOSED permanently (staff shortage, trade-press Tageskarte). Kept flagged
  `closed:true` + " — CLOSED"; not presented as live.
- SINGLE-CREDIBLE-SOURCE flags (GA is the credible editorial recommender; merit met by institution/rating
  volume, but a 2nd independent credible outlet was NOT confirmed in this pass — verify before build):
  Maternus (GA; historic institution), Cassius Garten (GA; 30-yr institution), Mr. and Mrs. Humus (GA veg
  feature; #5/603 rating volume), Café Blau (GA cafés feature), Café Spitz (GA cafés feature),
  Im Sudhaus (BONNTOURISMUS only), Der Kaffeeladen (Bonner Kaffeeschule/official only). Sudhaus/Kaffeeladen
  are tourism/own-site only — treat as provisional.
- CREATORS: none emitted. No German food/travel creator with a verifiable following AND a specific findable
  piece naming a Bonn place surfaced in this pass — none fabricated. (r/bonn not used as a lone pin.)
- HELD candidates (unresolved / single-source, not pinned): Äll Inn (named in brief but did not resolve in
  search — no address/sources found), Nees (Poppelsdorf; Falstaff only), NeuN (Bad Godesberg; Falstaff only +
  possible closure — needs status check), a dedicated ice-cream pin (GA "beste Eisdielen" exists but no place
  cleared ≥2 credible — EisLabor/San Marco held). Under the ~30 food target: this pass prioritised the
  ≥2-credible bar over padding; the held list is the fastest route to extend.
- All addresses = street + Bonn/Königswinter/Bad Honnef + PLZ + Germany, fact-checked via German-language
  search; NO coordinates (geocode/location-verify happen at build from data/geocodes.json).

---

## DÜSSELDORF (DUS) — discovery pass (2026-09-01)

Emitted: `SIGHTS_DUS.json` (39 sights, DICT), `FOOD_DUS.json` (36 food, LIST), `SOURCES_DUS.json` (27
outlets), `CREATORS_DUS.json` (3 creators). Consolidate OK — DUS contributes 75 records; combined
region total 225 (KOLN 98, DUS 75, BONN 52). No dup names within DUS or across the region merge.

### Sights (39) — tiers 1:14 / 2:17 / 3:8
Signature spine covered: Altstadt/"längste Theke", Königsallee, Neuer Zollhof (Gehry)+Rheinturm+MedienHafen,
Rheinuferpromenade, Little Tokyo, St. Lambertus (schiefer Turm), K20 & K21, Kunstpalast & NRW-Forum,
Schloss Benrath, Kaiserpfalz Kaiserswerth, Hofgarten, Carlsplatz, Kö-Bogen II, EKŌ-Haus, Nordpark/Japanischer
Garten, Schlossturm/SchifffahrtMuseum, Hetjens, Heinrich-Heine-Institut, Aquazoo, Kiefernstraße/Flingern,
KIT, St. Andreas, Tonhalle, Botanischer Garten HHU (Kuppel), Dreischeibenhaus/Schauspielhaus, Landtag NRW,
Jan-Wellem/Marktplatz, Kunsthalle, Stadterhebungsmonument, Bilker Bunker, Apollo Varieté, Alt St. Martin
(oldest building), Filmmuseum/Black Box, St. Rochus (egg dome), Wilhelm-Marx-Haus (1st German high-rise),
Südpark. `g` from HIST/ARCH/MUS/RIVER/PARK/MKT/NIGHT/FREE/ICON (no UNESCO in DUS, per brief).
- Every sight ≥2 credible: DUSTOURISMUS (tourism board) + BAUKUNSTNRW (Architektenkammer NRW db) / WIKIPEDIA /
  WZ (Westdeutsche Zeitung) / KUNSTSAMMLUNG (official) / NRWSTIFTUNG / MUSENKUSS / SWD / THEDUESSELDORFER.

### Food (36) — tiers 1:12 / 2:15 / 3:9. Signature FIRST, dish named.
- Altbier brewhouses (7): Uerige (Sticke), Füchschen, Schumacher (oldest, Stammhaus), Zum Schlüssel, Kürzer,
  Frankenheim, Zur Uel; + Brauhaus Joh. Albrecht (Niederkassel brewpub). Rhenish canon dishes named
  (Schweinshaxe, Sauerbraten, Alt).
- Little Tokyo / Japanese (9): Takumi & Naniwa & Takezo (ramen), Maruyasu & Yabase (sushi), Kushi-Tei
  (yakitori/izakaya), Soba-An (hand-cut soba), Bing Go (taiyaki), plus the two Nagaya stars below.
- Michelin bench (9 star houses + 1 guide-listed bistro): Nagaya + Yoshi by Nagaya (JP), Agata's, 1876
  Daniel Dal-Ben, Fritz's Frau Franzi, Le Flair, Setzkasten, Im Schiffchen + Enzo im Schiffchen, LA VIE by
  Thomas Bühner; Münstermanns Kontor (guide-listed bistro). All cleared on lone-Michelin + a 2nd guide
  (Falstaff/WZ/DUSTOURISMUS/Tageskarte/MRDUES).
- Sweets/bakery/coffee/veg/intl: Konditorei Heinemann (Champagnertrüffel), Bäckerei Hinkel (Brotinstitut +
  Feinschmecker), Kaffeehandwerk & Lightroast (specialty coffee), Café Hüftgold (Flingern cakes),
  Sattgrün (vegan buffet), Meerbar (MedienHafen seafood, in the red Gehry building), Phox (Vietnamese pho,
  named by Der Feinschmecker top-10 DE).

### Merit / source notes
- Merit bar applied — mentions measured, not auto-added. Michelin/Feinschmecker/Brotinstitut = institutional;
  editorial recommenders = DUSTOURISMUS, WZ, MRDUES, SWD, Falstaff, JapanDigest, Mit Vergnügen, THE DORF, The
  Düsseldorfer, PRINZ, Schlemmer Atlas. Yelp/TripAdvisor/Google/OpenTable = 0.
- CLOSED (kept, flagged " — CLOSED" + closed:true): Brauerei zum Schiffchen (city's oldest restaurant, closed
  autumn 2024 for renovation; Wikipedia + Viernull).
- CREATORS (3, all corroborating, never lone): Bento Daisuki & Verliebt in Japan (Little-Tokyo blogs),
  Life in Düsseldorf (expat city blog). None fabricated; r/dusseldorf not used as a lone pin.

### SINGLE-/SOFT-SOURCE flags (verify before build)
- Heinemann: cited KOENIGSALLEE (official Kö boulevard site) + OFFICIAL — both non-editorial; the
  Champagnertrüffel fame is genuine but a 2nd independent credible editorial (RP/Feinschmecker) should be
  added before build.
- Café Hüftgold: RHEINTOPF + LIFEINDUS (blogs) — credible but soft; add MRDUES/RP if extending.
- Zur Uel: WIKIPEDIA + a DUSTOURISMUS attractions URL that was inferred (not opened this pass) — verify the
  visitduesseldorf link resolves before build.
- Several sight sources reuse a DUSTOURISMUS attractions URL pattern that was seen for the institution but not
  each exact slug re-opened (Benrath, Zur Uel) — spot-check slugs at build.

### HELD candidates (not pinned — sourcing under the ≥2-credible bar this pass)
- Okinii (AYCE sushi; PRINZ only), Kikaku (Little-Tokyo izakaya — appears CLOSED per recent listings; confirm
  + flag if adding), Sila Thai (guide/rating only), Bistro Zicke (DUSTOURISMUS only; iconic Altstadt bistro —
  find 2nd credible), Woyton (specialty-coffee institution since 1998; CREMAGAZIN + coffee-retailer guide),
  Pia Eis (best-gelato reputation; duesseldorf-magazin + ratings), Berens am Kai / "Am Kai" (Michelin but
  renamed/ownership change — resolve status), En de Canon (Badisch, PRINZ only), Bob & Mary (burgers;
  TIMEOUT + THE DORF — dropped only for lack of a mappable cuisine tag, re-add with an INT label).
- Carlsplatz individual stalls (Dauser Gulasch, Fladi, Steakschmiede) — Carlsplatz kept as a SIGHT (MKT);
  stalls held pending per-stall ≥2-credible.
