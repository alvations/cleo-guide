# AUDIT — Antwerp (antwerp map) — DISCOVERY phase

Scope: DISCOVERY only (research JSON, NO coordinates, NO build). Areas: `ANT` (Antwerp centre) and
`ANTR` (surrounding: Berchem, Deurne, Hoboken, Mechelen, Lier, Kalmthout, the Port). Channel: WebSearch
only, searched primarily in Dutch (Flemish), English where natural. Mirrors Aachen's schema exactly.

## Final counts

| File | Area | Count |
|---|---|---|
| SIGHTS_ANTWERP_ANT.json | ANT | 29 |
| SIGHTS_ANTWERP_ANTR.json | ANTR | 16 |
| FOOD_ANTWERP_ANT.json | ANT | 44 |
| FOOD_ANTWERP_ANTR.json | ANTR | 12 |
| **TOTAL** | | **101** |

Split: **45 sights (45%) / 56 food+drink (55%)** — matches the requested ratio. Beer & breweries are a
grouped, first-class layer (all tagged `cz:["Beer"]`). No padding: every place clears the source bar;
weaker candidates were held (below).

Supporting files: `SOURCES_ANTWERP.json` (54 outlets used), `CREATORS_ANTWERP.json` (1 creator).

## Search waves (chronological)

1. ANT marquee sights: Cathedral, Grote Markt/Stadhuis, Het Steen, MAS, Rubenshuis, Meir, Centraal Station, Zurenborg/Cogels-Osylei, Plantin-Moretus (UNESCO).
2. ANT museum district (Zuid): KMSKA (reopened 2022), M HKA, FoMU; the three Rubens Baroque churches (Sint-Paulus, Sint-Jacobs, Sint-Carolus Borromeus); Sint-Annatunnel, MoMu, Vlaeykensgang, Boerentoren.
3. ANT museums: DIVA, Mayer van den Bergh (Dulle Griet — building in renovation), Snijders&Rockoxhuis, Red Star Line, ZOO, Havenhuis (Zaha Hadid), Middelheim.
4. ANTR sights: Mechelen (Sint-Rombouts, Kazerne Dossin, Grote Markt, Groot Begijnhof-UNESCO, Speelgoedmuseum, Hof van Busleyden, Binnendijle boat), Lier (Zimmertoren, Begijnhof-UNESCO, Sint-Gummarus), Rivierenhof, Kalmthoutse Heide, Arboretum Kalmthout, Kasteel Sorghvliedt (Hoboken), Fort Liefkenshoek (Port).
5. BEER layer: De Koninck/Bolleke + brewery, Kulminator, Billie's, 't Waagstuk, 't Paters Vaetje, Oud Arsenaal, Den Engel, De Groote Witte Arend, Antwerpse Brouw Compagnie/Seef, Elixir d'Anvers/De Beukelaer.
6. Food canon: Antwerpse handjes (Philip's, Goossens), lacquemants/smoutebollen (Désiré de Lille), chocolatier (Del Rey), coffee (Caffènation, Normo), Chinatown dim sum (Fong Mei, Oriental Delight, Lung Wah).
7. Michelin/G&M: Zilte (3*), The Jane (2*), Le Pristine, Bar Bulot, 't Fornuis, Het Gebaar, Nathan, Dôme, Graanmarkt 13; brasseries Bourla, Ciro's, Fiskebar, Dôme sur Mer, Het Pomphuis, Pazzo; veggie De Broers van Julienne; kosher Hoffy's/Kleinblatt.
8. Casual/bars: Frites Atelier, Balls & Glory, Dogma Cocktails, Bar Burbure, Patine, Album, Domestic bakkerij.
9. ANTR food: Het Anker (Gouden Carolus/Mechelse koekoek), Tinèlle, Graspoort, Emiel, Lesco (Mechelen); De Gouden Vis, Makadam (Mechelen brown cafés); Soixante, Somista, Brel (Berchem); Numerus Clausus, Liers vlaaike/Kesselaers (Lier).
10. Address firm-ups: exact addresses for Mechelen G&M restaurants, Caffènation, Rubenshuis (Wapper 9-11), MAS (Hanzestedenplaats 1); credible sourcing for chocolatiers and Zuid bistros.

## Source bar — how it was met

- **Lone institutional authority** used for: cathedral tower & Groot/Lier begijnhoven & Sint-Rombouts (UNESCO); Plantin-Moretus (UNESCO); all Michelin-starred restaurants (Michelin); Gault&Millau-listed restaurants (G&M is an institutional gastronomy authority per the brief).
- **≥2 credible** used everywhere else: official tourism (Visit Antwerpen/Mechelen/Lier, visitflanders), municipal/heritage (antwerpen.be, pers.antwerpen.be, onroerenderfgoed.be, provincieantwerpen.be, Herita), national broadcaster (VRT), official museum/brewery sites, Wikipedia, and credible editorial (ELLE, Feeling, Made in, njam!, Olive Magazine, Time to Momo, Le Fooding, 50 Best Discovery, European Coffee Trip) + beer-journalism (All About Beer, De Bierschrijver, European Bar Guide) for the beer layer.
- **Yelp/TripAdvisor/Google/RateBeer/Untappd = ZERO** — appeared often in results, never cited toward the bar.

## Fact-check: OPEN / CLOSED notes (flag closures)

- **Kulminator — CLOSED** (`closed:true`, name carries "— CLOSED"). Verified permanently closed **April 2026** (owners Dirk & Leen, age); confirmed via De Bierschrijver + apen.be + Facebook owner statement. Kept and flagged, per house rule that closed places stay.
- **Rubenshuis** — building **closed for restoration** since Jan 2023; reopening delayed to **~2030** (asbestos, costs). Included as a sight with the closure clearly stated in `w` (sights schema has no closed flag). Sources: pers.rubenshuis.be + VRT.
- **Museum Mayer van den Bergh** — building (partly) **closed for renovation**; Dulle Griet & top pieces temporarily shown elsewhere (Maagdenhuis). Noted in `w`; kept.
- **Désiré de Lille** — operating in a **pop-up on the Suikerrui** during renovation of the Schrijnwerkersstraat premises; NOT closed. Noted in `w`.
- **Sint-Andrieskerk** — out of the restoration scaffolding in spring 2025 (open). All other places checked open at time of research (Sept 2026).

## Held / not included (did not clear the ≥2-credible bar with the sources found)

- **De Vagant** (jenever bar, Reyndersstraat 25) — genuine icon, but only Yelp/Foursquare/TripAdvisor surfaced; no ≥2 credible found. Jenever/liqueur canon still covered via Elixir d'Anvers/De Beukelaer (Wikipedia + Onroerend Erfgoed).
- **Café Beveren** (Vlasmarkt 2, 1937 Decap dance organ) — beloved curiosity; Atlas Obscura (credible) found but no clean second credible. Hold for a re-check.
- **Bier Central** (De Keyserlei) — touristy beer restaurant; only listings/blogs. Hold.
- **Bar Paniek** (Eilandje artist-collective bar) — single-source; seasonal. Hold.
- **Grand Café Horta, Brasserie Appelmans, De Peerdestal** — plausible Belgian brasseries but only arrivalguides/blog sourcing found; held rather than padded.
- **Butchers Coffee** — credible coffee reputation but no reliable street address surfaced; held (needs address).
- **Burie** (chocolatier) — named in listicles only; no ≥2 credible. Del Rey kept (Relais Desserts distinction); Burie held.
- **Otomat** (Belgian pizza w/ Duvel yeast), **Broer Bretel**, **Berlin (Zuid)** — held pending credible sourcing.
- **D'Hanekeef** (Mechelen oldest brown café) — held (uncertain address); De Gouden Vis + Makadam represent the Mechelen brown-café/beer scene.
- Borgerhout diverse (Moroccan/Turkish) — several candidates (Roma Nova, Sol y Mar, Andaluce, Kunthun) surfaced only via forums/resto.be; none cleared ≥2 credible. Held for a targeted native-source wave.

## Notes for downstream stages (geocode / build)

- **No coordinates** anywhere, per contract. Addresses name town + Belgium for later geocoding.
- A few addresses are neighbourhood-level where a precise house number wasn't credibly confirmed (Fong Mei/Lung Wah on Van Wesenbekestraat; Het Pomphuis Siberiastraat; Bar Burbure/Patine on 't Zuid; Balls & Glory Theaterplein). Flag for the place-pin re-verify pass.
- `cz` cuisine tags name the kitchen's own tradition (e.g. Chinatown = `Chinese`; kosher deli under `Belgian`/`SWEET` by form, not a nationality label). Beer venues all carry `cz:["Beer"]` so the beer filter surfaces the grouped set.
- Postcodes reflect districts (2018 Diamant/Zuid-edge, 2020 Middelheim, 2030 Eilandje-north, 2060 Chinatown, 2600 Berchem, 2660 Hoboken, 2800 Mechelen, 2500 Lier, 2920 Kalmthout, 9130 Kallo/port).

---

# AUDIT — Antwerp — WAVE 2 (density deepening)

Scope: DISCOVERY only (research JSON, NO coordinates, NO build). Goal: push Antwerp from wave-1's 101
toward NYC-level density (~135+). Channel: WebSearch only, searched primarily in Dutch (Flemish),
English where natural. All wave-1 names were loaded first and DEDUP was enforced — 0 name collisions.

## Wave-2 new counts (NEW files, wave-1 untouched)

| File | Area | Count |
|---|---|---|
| FOOD_ANTWERP_ANT_X2.json | ANT | 18 |
| FOOD_ANTWERP_ANTR_X2.json | ANTR | 5 |
| SIGHTS_ANTWERP_ANT_X2.json | ANT | 8 |
| SIGHTS_ANTWERP_ANTR_X2.json | ANTR | 6 |
| **WAVE-2 TOTAL** | | **37** |

Running city total: **101 (wave 1) + 37 (wave 2) = 138**. Supporting: SOURCES_ANTWERP_X2.json
(15 NEW outlet keys), CREATORS_ANTWERP_X2.json (0 new creators this wave — all adds cleared on
institutional/native-outlet sourcing, no lone-creator pins needed).

## Wave-1 HELD candidates — re-sourced this wave

Cleared and ADDED (each now ≥2 credible OR a lone institutional authority):
- **De Vagant** (jenever house) — now VRT + apen.be. BUT verified **permanently closed 5 Dec 2021**
  (collection donated to Jenevermuseum Hasselt). Added `closed:true`, name "— CLOSED", per house rule.
- **Café Beveren** — Atlas Obscura + Historiek (Decap/Mortier dansorgel-erfgoedstuk uit 1937, beschermd).
- **Brasserie Appelmans** (+ absintbar) — Gault&Millau 12/20 (institutional) + apen.be. Address firmed:
  **Papenstraatje 1** (not Grote Pieter Potstraat).
- **Otomat** (Belgische pizza met Duvel-gist) — Gault&Millau listing + own site; Gazet van Antwerpen
  named the Margherita among Antwerp's 3 best pizzas.
- **Burie** (chocolatier) — antwerpentoerisme.nl (official) + apen.be. Korte Gasthuisstraat 3.
- **Butchers Coffee** — Gault&Millau + Le Fooding. Address resolved: relocated from 't Zuid (Kasteelstraat)
  to **Generaal Eisenhowerlei 19, 2140 Borgerhout**.
- **Bier Central** — apen.be + The European Bar Guide. De Keyserlei 25.

Re-checked and STILL HELD (couldn't clear the bar with a clean 2nd native-credible source):
- **Grand Café Horta** — only own site + Petit Futé surfaced as non-review sources; no clean 2nd credible
  native outlet. Held (the Horta/Maison-du-Peuple ironwork story is notable — worth a re-try).
- **De Peerdestal** — only TheFork/TripAdvisor/own-site + a steak-listicle. No credible editorial. Held.
- **Bar Paniek** — single-source (blogs/listings). Held.

## Beer layer — brown cafés / bars added or held

Added: Café Beveren, Bier Central, **Quinten Matsijs** (VRT + apen.be — Antwerp's oldest tavern, 1565,
voted favourite bruine kroeg), **Café Pelikaan** (Knack Weekend "8 bruine cafés" + apen.be).
- **Café Gollem** (Suikerrui 28) — HELD: a Yelp "CLOSED" flag (April 2026) appeared but no credible
  closure source to confirm; not added rather than mis-flag a possibly-live/closed place.
- **Den Uilenspiegel** (Suikerrui 27), **De Kat** — only 1 credible each (apen.be / the Knack list
  partial); held pending a 2nd.
- **Beers & Brains** — not found (only "Gollem's Beers & Burgers"). Skipped.

## Under-covered quarters — Borgerhout / Congolese / Portuguese / Jewish deli

Reached the Borgerhout/Turnhoutsebaan Moroccan-Turkish scene, the Antwerp African/Congolese kitchens,
and Portuguese natas — but they surface **only** in listicles / resto.be / TripAdvisor / own sites, never
≥2 credible native editorial (same wall wave 1 hit). HELD, not padded: Roma Nova, Churros, Tantines,
Farafina (Malian, Kerkstraat 21), Paraiso do Paladar, Doce Tentação. NOTE: the quarter IS now represented
credibly via **Bloesem** (Michelin star, Borgerhout) and **Butchers Coffee** (Borgerhout).

## Michelin / Gault&Millau bench — big yield (institutional = single-source OK)

From the **MICHELIN Belgium & Luxembourg 2026** official star list + Gault&Millau pages:
- ANT: **Fine Fleur** (1*), **Kommilfoo** (1*), **Hertog Jan at Botanic** (2*, Gert De Mangeleer),
  **The Butcher's Son** (1*), **Bloesem** (1*, NEW 2026, Borgerhout), **Pont-Neuf** (1*),
  **Bistrot du Nord** (1*), **Bizie Lizie** (Bib Gourmand), **Bien Soigné** (G&M 13/20).
- ANTR: **Komaf** (Wommelgem, 1* NEW 2026), **Vintage** (Kontich, 1*), **Bistro Vin d'Où**
  (Berchem, G&M 15/20), **Decan** (Berchem, G&M 14/20).
- EXCLUDED after fact-check: **Cuines 33** — the VRT "2 stars" headline groups it with The Jane, but it
  is in **Knokke-Heist (West-Vlaanderen)**, not Antwerp. Not added. **Nebo** left out to avoid confusion
  ("Nebo" the restaurant vs. chef Nebo Schamp now co-chef at Bloesem) — needs a dedicated verify.

## Signature-food / ANTR

- **Caves — het bier van Lier** (VRT 50-jaar-jubileumstuk 2026 + Visit Lier "Caveswandeling"): geuze-achtig
  Liers streekbier sinds 1688, in principe enkel in Lier geschonken. Added as a drink specialty (address =
  Grote Markt, Lier — served in the Markt's bruine cafés).
- **'t Ankertje aan de Dijle** (Mechelen Vismarkt, Het Anker / Gouden Carolus) — HELD: only 1 credible
  (European Bar Guide); Mechelen Vismarkt dining is already covered by wave-1 **Emiel**.
- Mechelen G&M (Emiel, Graspoort, Lesco) confirmed already in wave 1 — NOT re-added.

## New sights (mostly single-institution or municipal + reference = easy clears)

- ANT: **De Ruien** (ruien.be + UiTinVlaanderen), **Vlinderpaleis/Justitiepaleis** (VRT + Wikipedia NL +
  Onroerend Erfgoed), **Park Spoor Noord** (antwerpen.be + Wikipedia NL), **Felixarchief/Sint-Felixpakhuis**
  (antwerpen.be + OKV), **AMUZ/Sint-Augustinuskerk** (PARCUM + AMUZ + Wikipedia NL), **Chinatown & Chinese
  Poort** (Wikipedia + apen.be — België's enige erkende Chinatown), **Stadspark** (antwerpen.be + Wikipedia
  NL), **Sint-Annastrand/Sint-Anneke** (Wikipedia NL + VRT).
- ANTR: **Fort van Breendonk** (official + museumPASS — national WWII memorial), **ZOO Planckendael**
  (Visit Mechelen + Wikipedia NL), **Onze-Lieve-Vrouw-over-de-Dijlekerk** (Rubens' Wonderbare Visvangst
  in situ; mechelen.be + VRT), **Sint-Janskerk Mechelen** (Rubens' Aanbidding der Wijzen; mechelen.be +
  Wikipedia NL), **Technopolis** (Visit Mechelen + OKV), **Brusselpoort** (Visit Mechelen + Wikipedia NL).
- HELD sight: **Timmermans-Opsomerhuis (Lier)** — the house-museum **closed in 2018**; its collection
  merged into **Stadsmuseum Lier**. Not added to avoid an unverified successor address; flag for a
  targeted Stadsmuseum-Lier address pass.

## Fact-check: OPEN/CLOSED (flag closures)

- **De Vagant — CLOSED** (5 Dec 2021, permanent) — `closed:true`, name carries "— CLOSED".
- **Kulminator** already flagged CLOSED in wave 1; **Rubenshuis** closed for restoration to ~2030 (wave 1).
- **Brusselpoort** — the gate's interior is not publicly accessible (Het Firmament sits inside); noted in
  `w`, kept as an exterior monument. All other wave-2 places checked OPEN at research time (Sept 2026).

## Notes for downstream (geocode / build)

- **No coordinates** anywhere, per contract. Addresses name street + town + Belgium.
- Neighbourhood-level (flag for place-pin re-verify): **Caves** (Grote Markt, Lier — a town-beer, no single
  venue), **Chinatown** (Van Wesenbekestraat, street-level), **Stadspark** (Rubenslei/Van Eycklei corner),
  **Technopolis** (Technologielaan, no house number credibly fixed), **Park Spoor Noord** (Ellermanstraat
  entrance). Fine-dining/Michelin addresses are house-number precise.
- New outlet keys (SOURCES_ANTWERP_X2.json): HISTORIEK, OTOMAT, ANTWERPENTOERISME, KNACK, BIENSOIGNE,
  BIZIELIZIE, KOMMILFOO, BRUSSELSTIMES, RUIEN, UITINVLAANDEREN, PARCUM, AMUZ, BREENDONK, MUSEUMPASS,
  MECHELENBE. Reused wave-1 keys throughout (VRT, MICHELIN, GAULTMILLAU, APEN, WIKIPEDIA(NL), ANTWERPENBE,
  VISITMECHELEN, VISITLIER, OKV, ATLASOBSCURA, EUROPEANBARGUIDE, LEFOODING, DEKONINCK, ONROERENDERFGOED).
- `cz` tags name the kitchen's own tradition; jenever/liqueur and beer venues carry `cz:["Beer"]` so the
  drinks layer surfaces the grouped set (mirrors wave-1's treatment of Elixir d'Anvers).
