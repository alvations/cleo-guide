# AUDIT — Bruges (Brugge) + coast — discovery pass

**City:** bruges (dataset-city under the Belgium country hub)
**Areas:** `BRG` = Bruges centre (UNESCO historic city) · `BRGR` = surrounding & the coast (Damme, Oostende, Knokke-Heist, Zeebrugge, Blankenberge, De Haan, Jabbeke, Lissewege)
**Stage:** DISCOVER only — research JSON written, **no coordinates, no build**. Search channel: WebSearch (NL/Flemish primary, EN where natural).
**Date:** 2026-09-04

## Final counts
| File | Area | Type | Count |
|---|---|---|---|
| SIGHTS_BRUGES_BRG.json | BRG | sights | 27 |
| SIGHTS_BRUGES_BRGR.json | BRGR | sights | 25 |
| FOOD_BRUGES_BRG.json | BRG | food/drink | 29 |
| FOOD_BRUGES_BRGR.json | BRGR | food/drink | 21 |
| **TOTAL** | | | **102** (52 sights / 50 food) |

Ratio ≈ 51% sights / 49% food. Held candidates (below) were **not padded in** to hit a number — the ≥2-credible bar was applied strictly per the brief ("do not pad; hold anything that can't clear the bar"). Reaching the ~115 aspiration at this bar would need further waves on thinly-sourced brown cafés, waffle/ice-cream shops and mid-tier coast brasseries whose only findable coverage is rating platforms.

## Beer & breweries layer (required, `cz:["Beer"]`)
Grouped first-class in FOOD_BRG: **De Halve Maan** (Brugse Zot / Straffe Hendrik — the underground beer pipeline), **Bourgogne des Flandres** (Bruges city brewery, Flemish red-brown), **Brouwerij Fort Lapin** (Tripel 8 / Quadrupel 10), plus beer cafés **'t Brugs Beertje** (300+ beers), **Staminee De Garre** (house Tripel de Garre 11%), **Le Trappiste** (13th-c cellar), **'t Poatersgat**, **Bierbrasserie Cambrinus** (400+ beers). Coast: **Brouwerij Stene** (Oostende maritime brewery, `cz:["Beer"]` in FOOD_BRGR). Each brewery = own site + credible outlet; each beer café = 2 credible sources (official tourism / Bierschrijver / named travel editorial).

## Waves (sequenced WebSearch)
1. Bruges core sights (Markt/Belfort/Burg/Basilica/Groeninge); De Halve Maan + pipeline; 't Brugs Beertje.
2. Bourgogne des Flandres; De Garre; The Chocolate Line; garnaalkroketten (Gault&Millau).
3. Bruges Michelin tables; Begijnhof/OLV/Memling/Minnewater; Le Trappiste + Cambrinus; Fort Lapin.
4. Gruuthuse/Sint-Salvator/molens/Jan van Eyck/Rozenhoedkaai; Choco-Story/Frietmuseum/Concertgebouw; Dumon/Sukerbuyc/Marcolini; waffles/frites/stoverij (De Vlaamsche Pot).
5. Coast sights: Oostende (Mu.ZEE/Ensor/Fort Napoleon/Mercator/Amandine); Damme (Uilenspiegel/boekendorp/kerk); Knokke Zwin/Het Zoute; De Haan/Blankenberge/Zeebrugge/Kusttram.
6. Coast food: Knokke Michelin cluster; Oostende Vistrap + 't Vistrapje; Permeke/Lissewege/Seafront; Oostende breweries.
7. Bruges dining/beer deep-dives: Sans Cravate/Bar Bulot/Bruut/Books&Brunch; frituren; Historium/Kantcentrum/'t Zand; Knokke/Damme/De Haan Bib Gourmand.
8. De Florentijnen/Patrick Devos/Franco Belge; 2be/Poatersgat/Bacchus; Raversyde/KMSKA/Oosteroever; Knokke brasseries.
9–12. Bruges lunch/veg; Oostende De Zeester/Bel Œil; De Haan/Zeebrugge/Blankenberge dining; reien/Begijnhof/Adornes; Musea Brugge (Potterie/Volkskunde/Kantcentrum); Oostende church/Kursaal/Leopoldpark; Damme Schellemolen/Grote Sterre; Knokke Bib.
13–15. Oostende Gault&Millau (EAUst/Gastrobar Sam/Leon Spilliaert/Savarin); Michelin Knokke full list (VRT/Elle); Old Chocolate House/Chez Albert; Den Gouden Harynck/Refter/Cafedraal; Breydel-De Coninck/Den Dyver; Blankenberge Oesterput; Goffin/Onslow/Lissewege De Goedendag; Knokke fish (Culinaire Ambiance: Esmeralda/'t Kantientje/Bristol).

## Source base (all native/institutional or official-site + credible outlet)
Official tourism: Visit Bruges, Musea Brugge, Stad Brugge, Visit Flanders, Toerisme Damme, Visit/Stad Oostende, De Kust (Westtoer), Visit Knokke-Heist, Blankenberge, Brugse Ommeland. Institutional: UNESCO, Michelin Guide België, Gault&Millau België, Inventaris Onroerend Erfgoed, national/provincial museums (Ensorhuis, Permekemuseum, Sincfala, Mu.ZEE). News/media: VRT NWS, Krant van West-Vlaanderen (kw.be), Het Nieuws van West-Vlaanderen, Culinaire Ambiance, Feeling, Elle, Flanders Today, WideOyster, Would Be Chef, Njam!, Hungry for More. Official venue sites (paired w/ an outlet): De Halve Maan, Bourgogne des Flandres, De Garre, Fort Lapin, The Chocolate Line, Sel Gris, Rubens, Bistro Mathilda, Patrick Devos, Adornesdomein, Sint-Salvatorskathedraal, 't Werftje, Brouwerij Stene, De Goedendag. Beer journalism: Bierschrijver. English reuse: Frommer's, Lonely Planet, Indagare, plus named travel editorial (The Discoveries Of, Rebel Atlas, Worldwife) used only as the SECOND source for beer cafés.

**Yelp / TripAdvisor / Google / Untappd / RateBeer = ZERO** toward the bar (used only to sanity-check existence/popularity, never cited).

## Closure / status notes
- **No permanently-closed places included.** Nothing carries `closed:true`.
- **Mu.ZEE (Oostende)** — TEMPORARILY closed for renovation until ~2028; kept as a sight with the renovation stated in the copy (it reopens; not a permanent closure). Flag for a status re-check at build time.
- **Guillaume (Bruges)** — a TripAdvisor listing showed it as possibly closed; unverified against a credible source, so **HELD/omitted** rather than risk a wrong live pin.

## Held / single-source candidates (NOT included — clear the bar first)
- **De Vlaamsche Pot** (stoverij) — only own site + booking/rating platforms found; "best stoverij of Bruges" claim unattributed. Represents the stoverij canon — re-source (Visit Bruges / food press) and add.
- **Chez Vincent frites** — included (VINDEENFRITUUR editorial + Visit Bruges) but house-number to confirm; frites canon is thin on credible editorial.
- **Bruges beer/bottle spots**: 2be Beer Wall, Bacchus Cornelius (beer & jenever house) — only rating/travel-blog coverage; HELD.
- **Bruges sweets**: Pierre Marcolini (Bruges outpost), Da Vinci gelato, Oyya, Lizzie's Wafels — HELD (chain/rating-only or blog-only second source).
- **Bruges lunch/veg**: De Bron (veg institution), That's Toast, Books & Brunch, Cafedraal, Den Dyver (bierkeuken) — HELD; each has one credible lead, needs a second.
- **Oostende**: Ocean (mussels), Gastrobar Sam, Brasserie Leon Spilliaert, De Zeester — HELD (address ambiguity or single credible source; avoid stacking near-identical garnaalkroket spots — merit-bar).
- **Knokke**: Casavant, Tato's, Bristol/Kantientje/Esmeralda house-numbers — Bristol/Kantientje/Esmeralda ARE included (Culinaire Ambiance + De Kust) but at street/town level; confirm numbers at geocode.
- **Blankenberge**: Oosterstaketsel, Blankeduyn, La Cuisine; **Zeebrugge**: Martin's Visrestaurant — HELD (rating-only).

## Address precision note (for the geocode stage)
No street numbers were fabricated. Where a confident house number wasn't found in credible results, the entry gives **street + town + Belgium** (or town-level for a few coast restaurants: Restaurant Casanova De Haan, Le Kok sur Mer, Esmeralda, De Zuidkant Damme). The `--geocheck`/place-pin re-verify pass must resolve exact coordinates and confirm/append these numbers before building. Bar Bulot is at Hotel Jan Brito (Freren Fonteinstraat 1) — confirm.

## Editorial checks honoured
- Cuisine tags name a **specific dish or beer** for every food entry (garnaalkroketten, Brugse Zot, Tripel de Garre, mosselen, oesters, gebakken tong, Brusselse wafel, etc.) — never a bare label.
- Cuisine = the **kitchen's own tradition**; Boo Raan tagged Thai (not "Belgian" despite location); "Beer" grouped as its own layer.
- Tiers (`t`) graded **within each area**, not across the city; every area has ≥1 tier-1 icon.
- Merit bar applied: Michelin/Bib/Gault&Millau or official award or ≥2 credible; near-identical mid-tier garnaalkroket brasseries in Oostende were capped (Savarin/EAUst/'t Vistrapje/David kept; Sam/Spilliaert/Ocean held).

---

# AUDIT — WAVE 2 (deepening pass)

**Date:** 2026-09-04 · **Stage:** DISCOVER only (no coordinates, no build). WebSearch (NL/Flemish primary, EN where natural).
**Goal:** push 102 → ~120+ by re-sourcing held wave-1 candidates and deepening the coast (Nieuwpoort, Oostduinkerke, De Panne, Koksijde, Veurne, more Ostend).

## Wave-2 new counts (added, all clearing the bar)
| File | Area | Type | New |
|---|---|---|---|
| FOOD_BRUGES_BRG_X2.json | BRG | food/drink | 6 |
| SIGHTS_BRUGES_BRG_X2.json | BRG | sights | 4 |
| FOOD_BRUGES_BRGR_X2.json | BRGR | food/drink | 5 |
| SIGHTS_BRUGES_BRGR_X2.json | BRGR | sights | 8 |
| **WAVE-2 TOTAL** | | | **23** |

**Running city total: 102 + 23 = 125** (BRG food 29→35, BRG sights 27→31, BRGR food 21→26, BRGR sights 25→33).

### BRG food (6) — re-sourced held + new
- **Café Vlissinghe** (Beer/CAFE, Blekersstraat 2) — oldest inn in Flanders (1515). KennisWest + Knack Weekend. Represents the brown-café/estaminet canon wave-1 held for lack of a 2nd credible.
- **Café Rose Red** (Beer, Cordoeaniersstraat 16) — full Trappist range. Visit Bruges (official) + Indagare.
- **Chocolatier Depla** (SWEET, Mariastraat 20) — oldest artisan chocolatier (1958), Brugs Swaentje praline. Gault&Millau listing + Visit Bruges.
- **Chocolaterie Spegelaere** (SWEET, Ezelstraat 94) — family since 1954, chocolate grape bunches. Visit Bruges + Handmade in Brugge.
- **Vero Caffè** (CAFE, Sint-Jansplein 9) — specialty coffee. Visit Bruges + European Coffee Trip.
- **BbyB Chocolates** (SWEET, Sint-Amandsstraat 39) — design pralines by Bart Desmidt (Bartholomeus 2★) + Jan Verleye. Gault&Millau listing (institutional) + Robb Report.

### BRG sights (4)
- **Sint-Sebastiaansgilde** (Carmersstraat 174) — 600-yr archers' guild, museum. Visit Bruges + Onroerend Erfgoed.
- **Bonifaciusbrug** (Arentshof) — most-photographed bridge. Visit Bruges (film office) + Onroerend Erfgoed (Arentshof).
- **Historium Brugge** (Markt 1) — Golden-Age experience museum + VR. Flemish Masters in situ + Focus/WTV.
- **Godshuizen (almshouses)** (Nieuwe Gentweg) — 40+ historic courtyards, part of UNESCO listing. Visit Bruges + Lonely Planet.

### BRGR sights (8) — coast deepened
- **Garnaalvissers te paard** (Oostduinkerke strand) — UNESCO Intangible Heritage (2013), only place on earth. UNESCO + VRT.
- **NAVIGO – Nationaal Visserijmuseum** (Pastoor Schmitzstraat 5, Oostduinkerke) — national fisheries museum. Official + OKV.
- **Abdijmuseum Ten Duinen** (Koninklijke Prinslaan 8, Koksijde) — Cistercian abbey ruins + museum. Official + Onroerend Erfgoed.
- **Grote Markt Veurne** — Flemish-Renaissance square + Boeteprocessie. Onroerend Erfgoed + Wikipedia.
- **Dumontwijk (De Panne)** — protected belle-époque villa quarter beside Belgium's widest beach. Onroerend Erfgoed + De Panne (official).
- **Beaufort Beeldenpark** — permanent coast-wide sculpture park (50+ works, 67 km). Visit Flanders + De Kust.
- **Westfront Nieuwpoort & Koning Albert I-monument** — WWI Ganzepoot visitor centre. Nieuwpoort (official) + Onroerend Erfgoed.
- **Plopsaland De Panne** (De Pannelaan 68) — Studio 100 theme park, 1.4M visitors/yr. VRT + Wikipedia.

### BRGR food (5) — coast deepened
- **Estaminet De Peerdevisscher** (Pastoor Schmitzstraat 4, Oostduinkerke) — 1920s-replica tavern by NAVIGO run by an actual paardenvisser; grey shrimp + sliptong. Knack Weekend + De Kust.
- **De Vistrap / Visserskaai** (Oostende) — open-air fish market, only place in BE to buy shrimp straight from the fisher. De Kust + Visit Oostende.
- **Restaurant Julia** (Koksijde) — fresh North Sea fish, fishmonger Mare Nostrum; Gault&Millau 13.5/20. G&M + Libelle Lekker. *(town-level address — confirm street at geocode.)*
- **De Vierboete** (Halvemaanstraat 2a, Nieuwpoort) — garnaalkroketten/vissoep over the yacht harbour. De Kust + Culinaire Ambiance.
- **Restaurant Olijfboom** (Noordstraat 3, Veurne) — Bib Gourmand, G&M 13/20. Michelin + Gault&Millau.

## Held again (still below the ≥2-credible bar — NOT added; re-source before use)
- **Gelateria Da Vinci** (Geldmuntstraat 34) — searched twice; only TripAdvisor/Yelp/Foursquare/HappyCow + own site. Feeling's coast-ijssalon list does not cover it. HELD — the gelato canon still lacks a credible 2nd source.
- **Lizzie's Wafels** / **House of Waffles** — rating platforms + own site only. Waffle canon already carried by Chez Albert (wave 1). HELD.
- **De Vlaamsche Pot** (Helmstraat 3-5, stoverij) — own site + TheFork/TripAdvisor/Yelp + Petit Futé only; no native editorial recommender. Stoverij canon covered by Bistro Refter + Cambrinus (wave 1). HELD.
- **Bacchus Cornelius** (Academiestraat 17, beer & jenever house) — TripAdvisor/Untappd/Foursquare + one travel blog (Worldwife). HELD.
- **Books & Brunch** (Garenmarkt 30) — HappyCow flags it CLOSED, TripAdvisor still lists it: closure ambiguous + no credible source. HELD/omitted (avoid a wrong live pin).
- **That's Toast** (Dweersstraat 4) — own site + rating only. HELD.
- **De Bron** (Katelijnestraat 82, veg institution) — EVA vzw + resto.be listing; EVA is a credible curated body but the 2nd is a listing, not editorial. HELD — one more credible needed.
- **Bistronomie Eglantier** (Albert I-laan 141, Koksijde, G&M 12.5) — clears via G&M, but held to avoid stacking two near-identical mid-tier G&M fish bistros in Koksijde alongside Julia (13.5, more distinctive). Merit-bar cap.
- **De Vette Os / De Oogappel** (Veurne, G&M 12.5 / 12) — clear via G&M but capped; Olijfboom (Bib + 13/20) represents Veurne. Log-only.

## Address precision notes (for geocode stage)
- No house numbers fabricated. **Restaurant Julia (Koksijde)** left town-level — confirm street/number. **NAVIGO** given as Pastoor Schmitzstraat 5 (adjacent to Estaminet De Peerdevisscher at nr 4, cross-confirmed in results); confirm exact number. **Abdijmuseum Ten Duinen** Koninklijke Prinslaan 8 — confirm number. **Westfront Nieuwpoort** anchored to the Koning Albert I-monument at the Ganzepoot (Kustweg) — resolve exact coordinate to the monument, not the town. **Beaufort Beeldenpark** and **Garnaalvissers te paard** are area/experience entries (coast-wide / beach) — the build/geocode should anchor each to a representative point (e.g. Beaufort → a named permanent work; paardenvissers → Oostduinkerke beach / NAVIGO).

## Editorial checks honoured (wave 2)
- Every food entry names a specific dish/beer (Brugs Swaentje, chocolade druiventrossen, grijze garnaal, sliptong in botersaus, garnaalkroketten, trappistgamma, specialty espresso). Cuisine tag = the kitchen's own tradition; Beer/CAFE/SWEET grouped as their own layers.
- Tiers graded within area. Merit bar applied (institutional G&M/Michelin/Bib/UNESCO/national museum, or ≥2 credible); near-identical G&M bistros in Koksijde/Veurne capped. No padding — everything unsourced was logged as held.
- No permanently-closed place added. Books & Brunch omitted due to ambiguous closure (no credible confirmation), consistent with wave-1's Guillaume handling.
