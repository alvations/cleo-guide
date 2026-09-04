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
