# Aachen & the Dreiländereck — audit ledger

Append-only, one section per pipeline stage (sources → places → fact-check → re-rank → location-verify →
build). Every wave records what it searched, kept, and dropped (with the measurement + reason). See
[docs/PIPELINE.md](../../docs/PIPELINE.md).

## Scaffold (2026-09-01)
- Areas (5, cross-border Dreiländereck / Euregio Maas-Rhein): `AACHEN` (city), `STADT` (StädteRegion:
  Monschau, Stolberg, Kornelimünster…), `EIFEL` (National Park + Düren/Jülich), `NL` (Maastricht + Dutch
  South Limburg), `BE` (Ostbelgien: Eupen, Kelmis, Hautes Fagnes).
- Cuisines: GER, BE, NL, FINE, BEER, SWEET (Printen/bakeries/vlaai), CAFE, INT.
- Collections: ICON, UNESCO, HIST, ARCH, MUS, SPA (thermal baths — Aachen's Roman/spa identity), PARK,
  MKT, NIGHT, FREE.
- `consolidate.py`, `tools/build-aachen.py` cloned from the saarland pipeline (cross-border, trimmed-bounds
  midpoint centring, near-duplicate dedup). Registered `aachen` in research.js (PAGE_FOR/DATASET_FOR),
  geocode-status.py, rebuild-city.py; empty `data/geocodes.json["aachen"]` entry.

## Discovery — (append per wave)

### Wave NL — Dutch South Limburg (Maastricht · Vaals · Valkenburg · Heerlen · Margraten · Heuvelland) — 2026-09-01
Searched in Dutch (English where natural) across Visit Maastricht/VVV, Visit Zuid-Limburg, De Limburger-adjacent
regional media (RTV Maastricht, 1Zuid), Michelin/Gault&Millau NL, Rijksmonumenten/Cultureel Erfgoed,
Natuurmonumenten, official attraction sites, ABMC (Margraten), plus specialty-coffee guides and SUSA (Maastricht
student layer). WebSearch only; budget exhausted mid-verification (200/200) — remaining street numbers left to the
geocode/location-verify stage, none fabricated.

Output: `SIGHTS_NL.json` (24, dict), `FOOD_NL.json` (21, list), `SOURCES_NL.json` (40 outlets), `CREATORS_NL.json`
(empty — no individual creator relied on; every pin carries credible editorial/institutional sourcing).
consolidate.py ingests NL cleanly = **45 records** (Area coverage NL: 45).

**Sights (24): t1×10, t2×12, t3×2.**
- Maastricht (15): Sint-Servaasbasiliek(+Schatkamer), Onze-Lieve-Vrouwebasiliek (Sterre der Zee), Boekhandel
  Dominicanen (world's most beautiful bookshop 2025), Bonnefantenmuseum (Aldo Rossi), Grotten Noord & Fort Sint
  Pieter (Sint-Pietersberg), Kazematten/Maastricht Underground, Vrijthof, Sint-Janskerk, Helpoort (oldest city gate
  NL), Stadhuis op de Markt, Sint Servaasbrug (oldest bridge NL), Jekerkwartier, Stokstraatkwartier, Sphinxkwartier.
- Vaals (2): Drielandenpunt/Vaalserberg (highest point NL + Wilhelminatoren + maze), Kasteel Vaalsbroek.
- Valkenburg (4): Kasteelruïne & Fluweelengrot (only hilltop castle NL), Gemeentegrot (Europe's largest underground
  Christmas market), Thermae 2000, Cauberg (Amstel Gold Race).
- Heerlen (1): Het Romeins Museum/Thermenmuseum — **CLOSED** (closed Sept 2024; new museum opens 2028).
- Margraten (1): Netherlands American Cemetery (ABMC, lone-institutional, free). Heuvelland (1): Vijlenerbos & Epen.
- `g` from HIST/ARCH/MUS/SPA/PARK/MKT/NIGHT/FREE/ICON (no UNESCO in NL area, per brief).

**Food (21): t1×7, t2×10, t3×4.** Signature-first, dish named on every record.
- Zuurvlees/zoervleisj: Café Sjiek (t1 — Michelin Bib Gourmand 2025; the connoisseurs' pick), In den Ouden
  Vogelstruys (Vrijthof brown café), Bar & Kitchen De la Bourse (Markt).
- Michelin/fine: Beluga Loves You (1★ + G&M), Tout à Fait (1★), Château Neercanne (1★, terraced castle), L'Auberge
  (Neercanne Bib brasserie), Les Salons/Château St. Gerlach (Relais&Châteaux, Houthem), Prix de Rome (Bib 2025),
  Tabkeaw (Bib, Thai), Harry's (Michelin Guide, Wyck).
- Vlaai: De Bisschopsmolen (t1 — oldest working watermill NL, spelt vlaai at source), Bakkerij Hermans (best vlaai
  baker NL 2013), Patisserie Royale (since 1929; street # TBD at geocode stage).
- Coffee: Coffeelovers Dominicanen (t1, coffee in the church-bookshop), Blanche Dael Branderij (roaster since 1878),
  Fixed Gear Coffee. Student: Café Zondag (Wyck). Beer: Gulpener BrouwLokaal (Gulpen, t1), Brand (Wijlre, oldest NL
  brewery), Take One — **CLOSED** (2018, kept for the record).

**Merit / measure (dropped):** Da Vinci (Michelin) — out of scope, it is in **Maasbracht** (central Limburg), not
the Dreiländereck. Restaurant De Bokkerijder at the Drielandenpunt — dropped (TripAdvisor 3.4, ranked #27/31 in
Vaals; fails merit bar despite the location). Valkenburg caves collapsed to 2 pins (Kasteelruïne+Fluweelengrot;
Gemeentegrot incl. Christmas market) and Wilhelminatoren folded into the Drielandenpunt entry — anti-padding.
Yelp/TripAdvisor/Google used only to *measure* (never as a recommender); every kept pin has ≥2 credible sources or a
lone institutional (Michelin/ABMC/national museum). Expedia citation removed (not a credible recommender).

### Wave: EIFEL (Eifel & Düren, DE) — discovery (2026-09-01)
Searched in German across Nationalpark Eifel, Rureifel/Rursee, Nideggen, Heimbach, Düren, Jülich, and the
Hohes Venn German edge. Sources vetted to the bar: official tourism (nationalpark-eifel.de, eifel.info,
eifel.de, rureifel-tourismus.de, nordeifel-tourismus.de, eifelsteig.de, rursee.de, kreis-dueren tourismus),
official municipal (heimbach-eifel.de, juelich.de, mechernich.de), institutional (KuLaDig/LVR, Gedenkstätten
NRW, Memorial Museums, baukunst-nrw, Straße der Moderne, arthistoricum.net, Michelin, Der Feinschmecker),
press (Aachener Zeitung, katholisch.de), and Wikipedia as corroboration only. Yelp/TripAdvisor/Google/
speisekarte.de/restaurantguru/opentable treated as ZERO.

**Output: 24 sights (SIGHTS_EIFEL.json, dict), 11 food (FOOD_EIFEL.json, list), 24 outlets registered
(SOURCES_EIFEL.json), 0 creators (none met the verifiable-following bar).** No coordinates (geocoding is a
later stage) — full addresses only, all naming Town + Germany.

Sights by tier: t1 = 9 (Nationalpark Eifel, Wilder Kermeter/Wilder Weg, Vogelsang IP, NS-Dokumentation
Vogelsang, Burg Nideggen & Burgenmuseum, Buntsandsteinfelsen/Buntsandsteinroute, Jugendstil-Wasserkraftwerk
Heimbach, Rurtalsperre Schwammenauel/Rursee, Leopold-Hoesch-Museum, Zitadelle Jülich & Museum). t2 = 14
(Wollseifen, Abtei Mariawald, Burg Hengebach, Heimbach Altstadt, Rursee-Schifffahrt, Urftsee/Urftstaumauer,
Nationalpark-Tor Rurberg, Papiermuseum Düren, Annakirche Düren, Brückenkopf-Park Jülich, Perlenbach-
Fuhrtsbachtal/Narzissenblüte, Wildnis-Trail, Dreiborner Hochfläche). t3 = 1 (Ausstellung 'Rur und Fels').

Food by tier: t1 = 1 (Heimbacher Brauhaus). t2 = 9 (Burgrestaurant Nideggen, Eifeler Hof am Rursee,
Eifelhaus Einruhr, Kermeterschänke, Gastro Vogelsang, Hotel-Restaurant Roeb, Gemünder Parkrestaurant,
Zum kleinen Seehof, Seemöwe). t3 = 1 (Klostergastronomie Abtei Mariawald — Klosterlikör & Nemus Mariae
Trappistenbier). Signature dishes covered: Eifeler Wild/game, Forelle/trout, Rheinischer Sauerbraten,
Heimbacher Bier, Trappist Klosterlikör/-bier, Eifeler Kuchen.

Status / closure findings (verify at build):
- **Brockel Schlimbach (Burg Nideggen)** — Michelin 1★ 2019–2025; star removed and the fine-dining
  partnership CLOSED (AZ). NOT added as its own entry; folded into the still-operating **Burgrestaurant
  Nideggen** (same castle, Kirchgasse 10a) with the star history noted. Michelin corroborates the venue.
- **Schwan Jülich** (upscale restaurant/bistro) — DROPPED: Schwan Gastgebergesellschaft filed insolvency
  Oct 2025 and the restaurant/bistro CLOSED early 2026 (AZ). Not a live suggestion.
- **Abtei Mariawald** — Trappist community dissolved 15 Sep 2018; site is NOT closed — reopened as a
  spiritual centre with near-daily guided tours, shop, guesthouse and gastronomy. Kept as open, flagged.
- Dropped for failing the ≥2-credible bar (only aggregators): Jülicher Hof & other Düren town restaurants
  (speisekarte.de/restaurantguru/gelbeseiten only), Brauhaus Naashorn Nideggen (own site + TripAdvisor),
  Steakhaus Büffel Heimbach.

Note: Gemünd/Schleiden/Vogelsang/Wolfgarten/Wollseifen sit in Kreis Euskirchen but are core Nationalpark
Eifel and explicitly in the EIFEL brief; binned as EIFEL. Perlenbach-Fuhrtsbachtal (Monschau-Höfen) placed
under EIFEL as the Hohes-Venn German edge per the brief (Monschau town itself belongs to STADT).

## Discovery — STADT (StädteRegion Aachen towns) — 2026-09-01

Agent: STADT discovery. Search in German only; WebSearch only (WebFetch blocked). Shared WebSearch budget
was exhausted during this wave (hit the 200-call session cap), so a few last food-corroboration queries
could not run — noted below.

**Output: 21 sights (SIGHTS_STADT.json, dict), 7 food (FOOD_STADT.json, list), 28 outlets registered
(SOURCES_STADT.json), 0 creators (CREATORS_STADT.json — none met the verifiable-following bar).** No
coordinates (geocoding is a later stage) — full addresses only, each naming Town + Germany. All `"a":"STADT"`.

Sights by tier: t1 = 7 (Historische Altstadt Monschau, Rotes Haus/Scheibler-Museum, Burg Monschau,
Historischer Ortskern Kornelimünster, Burg Stolberg, Burg Rode Herzogenrath, ENERGETICON Alsdorf,
Dreilägerbachtalsperre Roetgen — note: 8 listed here, ENERGETICON+Dreilägerbach both t1). t2 = 10
(Historische Senfmühle Monschau, Kunsthaus NRW/ehem. Reichsabtei, Propsteikirche St. Kornelius,
Historischer Altstadtkern Stolberg, Kupferhof Rosenthal, Museum Zinkhütter Hof, Wurmtal, Burg Wilhelmstein
Würselen, Carl-Alexander-Park Baesweiler, NSG Struffelt Roetgen). t3 = 3 (Monschauer Glashütte, Felsenkeller
Brauhaus & Museum [CLOSED], Kupferhof Grünenthal). Towns covered: Monschau (6), Kornelimünster (3), Stolberg
(5), Herzogenrath (2), Alsdorf (1), Würselen (1), Baesweiler (1), Roetgen (2).

Food by tier: t1 = 3 (Restaurant Sankt Benedikt — Michelin 1★ Kornelimünster; Schnabuleum/Historische
Senfmühle Monschau — Moutarde de Montjoie dishes; Café Kaulard Monschau — Dütchen/Printen). Plus Alte
Feuerwache Podobnik Würselen (t1, ex-Michelin French, Feinschmecker/Gusto/Falstaff). t2 = 3 (Konditorei-Café
am Roten Haus Monschau — Vennbrocken; Gut Schwarzenbruch Stolberg; Landgasthof Gut Marienbildchen Roetgen —
Eifeler Wild). Signature dishes covered: Monschauer Senf/Moutarde de Montjoie, Monschauer Dütchen &
Vennbrocken, Printen, Michelin-Menü (Stör), Eifeler Wild/game, gehobene französische Küche.

Closure findings (verify at build):
- **Felsenkeller Brauhaus & Museum (Monschau)** — brewery from 1847; the brewery-museum CLOSED 2019 (BRF +
  Industriemuseen EMR). Kept as a sight, flagged `closed:true` + " — CLOSED" per the closed-places-stay rule.
- **Landhaus/Restaurant Solchbachtal (Stolberg-Zweifall)** — DROPPED: permanently closed (Das Örtliche /
  onlinestreet). Not carried as food.

Merit-bar drops (a mention is not merit; only rating aggregators = 0 toward the ≥2-credible bar):
- **Zum Haller** and **Eifelstübchen** (Monschau) — TripAdvisor/speisekarte only; no credible editorial found.
- **Bäckerei Hensch** (Monschau, Printen since 1770) — genuinely notable heritage but only TripAdvisor + a
  blog surfaced; Printen/Dütchen already covered credibly by Café Kaulard + Café am Roten Haus. Left out.
- **Brauhaus Peltzer** (Eschweiler), **Restaurant Eduard** (Alsdorf, in the Energeticon), **Vichter Landhaus**
  and **Schwarzmüller Stubn** (Stolberg/Roetgen), **Zur Abtei / Bahnhofsvision** (Kornelimünster) — aggregators
  only (or ≤1 credible); did not clear ≥2. Candidates for a later wave if editorial coverage is found.
- **Blausteinsee (Eschweiler)** — likely a valid StädteRegion recreation-lake sight but only 1 credible source
  surfaced before the budget cap; left out pending corroboration (revisit in extension).

Sourcing notes: credible channels used are the brief's DE tourism/heritage authorities (eifel.info/eifel.de,
nrw-tourismus, rureifel-tourismus, StädteRegion Aachen Freizeit-/Tourenportal, Monschau/Herzogenrath/Roetgen
municipal sites, Eifelsteig, HSO-NRW, Baukunst NRW, KuLaDig/LVR, Kunsthaus NRW, museen.de) plus the food
guides Michelin/Feinschmecker/Falstaff/Gusto/Schlemmer-Atlas, BRF (Ostbelgien/Euregio broadcaster) and DuMont.
Reality of the eastern industrial towns (Eschweiler, Herzogenrath, Alsdorf, Baesweiler): thin editorial food
coverage — most restaurants appear only on rating aggregators, so the food list is deliberately not padded
(merit bar). Food density (7) is below the ~20 aim for this reason; the signature-first Monschau/Kornelimünster
core is well-sourced. r/Aachen and DE food TikTok/YouTube were not reachable as findable named-place videos
within budget; CREATORS_STADT is empty. NO coordinates emitted — geocoding + placement re-verify are later gates.

## Discovery Wave 1 — AACHEN city (2026-09-01, anchor area)

**Output:** `SIGHTS_AACHEN.json` (29 sights), `FOOD_AACHEN.json` (12 food), `SOURCES_AACHEN.json`
(24 outlets), `CREATORS_AACHEN.json` (1 creator, LINHÉ). All four validate with `python3 -c json.load`.
Searched **in German**. Every record clears **≥2 credible** or a lone institutional (Michelin/UNESCO);
automated check found **0 under-bar** records. No coordinates (address-only, per pipeline).

**Sights (29): tiers t1=10 / t2=16 / t3=3.** All 10 t1 must-sees satisfy the ≥1-per-area rule.
- t1 anchors: Aachener Dom (UNESCO, 1st German WHS 1978), Domschatzkammer, Rathaus & Krönungssaal,
  Elisenbrunnen, Carolus Thermen, Centre Charlemagne, Suermondt-Ludwig-Museum, Ludwig Forum,
  Weihnachtsmarkt, Pontstraße/Pontviertel.
- t2: Katschhof, Couven-Museum, Internationales Zeitungsmuseum, Ponttor, Marschiertor, Grashaus,
  Lousberg, Burg Frankenberg, Kurpark Burtscheid, Burtscheid-Bäderviertel, Euregiozoo, Theater Aachen,
  St. Foillan, Markt & Karlsbrunnen, Puppenbrunnen, Öcher Bend.
- t3: Fischmarkt, Elisengarten (archäolog. Vitrine), RWTH Hauptgebäude & Reiff-Museum.
- Sourcing spine: UNESCO + aachen-tourismus (official) + Wikipedia for the monuments; official museum
  sites (Centre Charlemagne, Suermondt, Ludwig Forum, Couven, Euregiozoo); NRW-Tourismus; KuLaDig (LVR)
  for RWTH/Frankenberg; AZ for the Weihnachtsmarkt; top-aachen + Ruhr Nachrichten for the Öcher Bend.

**Food (12): tiers t1=5 / t2=5 / t3=2.** Signature-first, dish named on every record. 0 closures.
- Canon covered: **Aachener Printen** across four producers (Nobis, Lambertz, Klein, Van den Daele),
  **Reisfladen** (Van den Daele/Nobis), **Aachener Sauerbraten rheinischer Art + Himmel un Ääd**
  (Postwagen, Am Knipp — oldest inn 1698), the **Michelin bench** (La Bécasse, 1★, MICHELIN+AZ),
  **specialty coffee** (MAQII AZ+EuropeanCoffeeTrip; Baristinho; Rösterei Mundus), **gelato** (Del Negro,
  Klenkes+AZ), and one AVPN-certified Neapolitan pizza (Gold of Naples) for the Pontstraße/student layer.

**MEASURE — merit-bar keep/drop notes:**
- KEPT with a flag: **Printenbäckerei Klein** — famous (1912 + Printen-Museum) but the clearest credible
  hits were Schwarzaufweiss (Printen feature) + gut-wirtz (niche Printen catalogue); flagged niche, keep
  because the place itself is institutionally notable. **Gold of Naples** — aachen-tourismus official
  listing + AVPN certification (an institutional Neapolitan-pizza authority) + LINHÉ creator; kept t2.
  **Rösterei Mundus** — Aachen-Altstadt editorial + Kaffee-Netz community thread; kept t3 as corroborated.
- **DROPPED (mention ≠ merit / failed ≥2-credible with the web budget spent):** Sauerbratenpalast,
  Gaffel Wirtshaus am Hühnerdieb, Restaurant Palladion, Restaurant Macaroni, AKL (Lebanese), Café Egmont,
  Sowieso/Oceans, Ghorban Wine Bar, Elysée, Magellan, Café Middelberg, Hanswurst, Café Kittel,
  Café Juli, Pfannenzauber — each surfaced only via rating aggregators (Yelp/TripAdvisor/TheFork/
  OpenTable = ZERO) or a single credible source; left out rather than padded.
- **Bushmans Kitchen** (named in the task brief): no credible evidence found under that name in current
  Aachen listings — NOT fabricated, left out. Re-check in the enrich wave.
- **Aachener Brauhaus Degraa** (local beer + Öcher Kaviar/Puttes): has 2 credible sources (aachen-tourismus
  + Wikipedia) but I could not verify its exact street address from search results, so it was held rather
  than shipped with a guessed house number. High-priority add for the enrich wave (verify address, then
  it carries the Öcher-Kaviar/Puttes and local-beer canon).

**GAP — stated, not filled (per project rules):** the WebSearch budget was exhausted (200/200, shared
session-wide) mid-discovery, so the casual/international/beer layer (Turkish, Vietnamese/Asian, Lebanese,
Italian beyond pizza, Öcher Kaviar/Weckmann butchers, breweries, Pontstraße nightlife food) is
under-represented — these places exist but are dominated online by rating aggregators that count ZERO,
and confirming a second credible German-language source for each needs more searches. Food count is 12,
below the ~30 target; sights 29, near the ~35 target. **Enrich wave to-do (needs web budget):** Degraa
(address), Öcher Kaviar/Puttes + Weckmann sources, 8–12 more Pontviertel/international tables each with
≥2 credible DE sources, plus Haus Löwenstein, the Bahkauv & 'Kreislauf des Geldes' fountains, and the
SuperC as additional sights once sourced. No coordinates added; all addresses name town + country for the
geocode stage.

## Discovery wave — BE / Ostbelgien (2026-09-01)
Agent: BE discovery. In-language DE/FR WebSearch; ≥2 credible per place; Yelp/TripAdvisor/Google/resto.be/
holidaycheck/outdooractive/komoot treated as ZERO. Emitted `SIGHTS_BE.json` (16), `FOOD_BE.json` (14),
`SOURCES_BE.json` (18 new outlets), `CREATORS_BE.json` (none vetted — see note).

### SIGHTS kept — 16 (t1×9, t2×5, t3×2; 1 CLOSED)
Hautes Fagnes cluster: Signal de Botrange (t1, 694 m roof of Belgium), Hohes Venn/Hautes Fagnes reserve &
boardwalks (t1), Naturparkzentrum Botrange/Maison du Parc (t2), Baraque Michel (t2), Haus Ternell nature
centre (t3), Burg Reinhardstein/Ovifat (t1). Eupen: St-Nikolaus-Kirche (t1), Marktplatz & Werthplatz (t1),
Wesertalsperre + visitor centre (t1), IKOB contemporary-art museum (t2), Rosenmontagszug/carnival (t2),
Schokoladenmuseum Chocolaterie Jacques — CLOSED 2019 (t3, kept flagged for the story/canon). Kelmis: Museum
Vieille Montagne / ex-Göhltalmuseum, Neutral-Moresnet & zinc (t1). Raeren: Töpfereimuseum in Burg Raeren
(t1). St. Vith: Büchelturm (t2). Bütgenbach: Stausee + Worriken (t1).
Sourcing spine: Ostbelgien.eu, Visit Wallonia, de/fr/en Wikipedia, BRF, official museum sites (mvm-kelmis,
toepfereimuseum, ikob, worriken, ternell, botrange), Eifel.de, Naturpark Hohes Venn-Eifel, Burgenwelt, Varta.

### FOOD kept — 14 (t1×10, t2×4; signature-first, dish named)
Michelin/G&M bench: Zur Post (St. Vith, Michelin★ since 1977 + G&M 15.5) t1; Quadras (St. Vith, Michelin★
2020 + G&M 15) t1; Couleur Rouge (Eupen, G&M 14) t1; Arti'Choc (Eupen, Bib Gourmand — Zeeland mussels/
curry, Ondenval trout) t1; Bütgenbacher Hof (G&M toque 13 + Michelin) t1; Sel et Poivre (Raeren, Bib
Gourmand — Liège veal kidneys) t1; Antoine (Eupen, G&M 13.5) t2. Canon-first: La Baraque Michel (Fagnes
game/Wild, Grenz-Echo Mahlzeit + BRF) t1; Brauerei Néau (Eupen craft brewery/Biergarten + Eupen Pils, BRF)
t1; Kelleter Konditorei (Reisfladen, Made in Ostbelgien) t1; Panciera Eiscafé (Spaghetti-Eis, BRF "2nd-best
in the world" + Aachener Zeitung) t1; Reiner's Fritten (frites, Fritten-dossier) t2; Alt Keris (Kelmis
Belgian-French, Grenz-Echo Mahlzeit) t2; Ratskeller (Eupen town-hall brasserie, moules-frites) t2.

### Measured & dropped / not added
- Le Gourmet (Eupen): G&M 2014 but ownership changed to Hua Mei (2016) — no longer the traditional table;
  dropped as stale/uncertain.
- Pip-Margraff (St. Vith): real G&M hotel-restaurant but WebSearch budget exhausted before its street
  address was confirmed — held out rather than fabricate an address. Add on next wave.
- Lac de Robertville, Kettenis (St. Katharina), Eupen Unterstadt/Gospert quarter, Amel/GrenzGeschichteDG,
  Eupen "seven church towers" viewpoint: only single-source or unconfirmed street — held for a follow-up
  wave (all plausible ≥2-credible with more search budget).
- Chocolatier for the "Eupen chocolate" canon: Jacques museum is CLOSED (kept as a closed sight); Leonidas
  = chain (merit-fail); no independent Eupen chocolatier cleared ≥2 credible + address here → gap stated,
  not filled. Revisit on refresh.
- Friteries/ice-cream: mostly Yelp/TripAdvisor/resto.be-only → rejected; kept only Reiner's & Panciera,
  which had DG-press coverage (Ostbelgien Direkt / BRF / Aachener Zeitung).

### Notes / limits
- WebSearch budget hit 200/200 mid-wave — targets were ~20 sights / ~15 food; delivered 16 / 14 (30 total)
  with no fabricated addresses. A short follow-up wave (Pip-Margraff address, Robertville, Kettenis, a
  sourced chocolatier, 1-2 more southern DG restaurants) would reach ~35.
- CREATORS_BE: no individual creator met the vetting bar (verifiable following + findable piece naming a
  place). Credible base is institutional/editorial (Grenz-Echo incl. its "Mahlzeit" column, BRF, Ostbelgien.
  eu/Direkt, Michelin, Gault&Millau). Re-run the creator pass on refresh.
- Cross-border notes: Baraque Michel (Jalhay) and Reinhardstein/Botrange (Waimes/Ovifat) sit in French-
  speaking facilitated communes but are THE Hautes Fagnes landmarks bordering the DG — binned to BE per the
  Ostbelgien/Hautes-Fagnes remit. Sel et Poivre & Töpfereimuseum are in Raeren/Eynatten (DG).
