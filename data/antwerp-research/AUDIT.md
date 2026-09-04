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
