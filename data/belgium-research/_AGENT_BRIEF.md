# Belgium — four city maps (Antwerp · Ghent · Brussels · Bruges) — standing agent brief

**Four SEPARATE maps**, one per city, each a dark-engine **dataset city** (like Aachen/Saarland) grouped
under the **Belgium country hub**. Each map covers the **city AND its surrounding area**. Target density:
**as dense as NYC where the brief calls for it** — go deep; iterate in sequenced waves to the benchmark
(see [docs/DENSITY.md](../../docs/DENSITY.md)). Same pipeline + gates as every guide: **discover →
fact-check (≥2 credible) → geocode + location-verify → re-rank within area → build & gate.** WebSearch only.
**Search in Dutch (Flemish) AND French** (Brussels is bilingual), English where natural; cite native sources.

## BEER & BREWERIES — a required, grouped layer in food & drinks (user instruction)
Belgium's beer culture is UNESCO Intangible Heritage. In EVERY city, **treat beer & breweries as a
first-class part of the food-and-drink discovery and group them together**: name the **brewery / brown
café / beer bar** and the **style/beer** (Trappist — Westvleteren, Chimay, Orval, Rochefort, Westmalle,
Achel; abbey ales; **lambic / gueuze / kriek** — Cantillon, 3 Fonteinen, Boon, Girardin, Tilquin;
**witbier**; Flemish red/oud bruin — Rodenbach, Duchesse; saison; De Koninck **Bolleke** in Antwerp; local
city breweries). Tag these `cz:["Beer"]` (maps to the BEER cuisine) so the beer filter surfaces the whole
grouped set. A beer bar counts only with the ≥2-credible bar; a brewery with its own site + a credible
write-up qualifies.

## The four maps & their areas (a = area code)
- **antwerp** (`cities/antwerp.html`): `ANT` Antwerp centre (Cathedral, Grote Markt, Het Steen, MAS, Rubens,
  Meir, the **Diamond District**, Zuid/museums, Eilandje, **Zurenborg/Cogels-Osylei**, Het Zuid), `ANTR`
  surrounding (Berchem, Deurne, Hoboken, **Mechelen**, Lier, the Port). Canon: **Antwerpse handjes**,
  frietjes, **De Koninck Bolleke**, moules-frites, Brabo, herring; deep beer-café scene (Kulminator,
  Billie's Bier Kafétaria).
- **ghent** (`cities/ghent.html`): `GEN` Ghent centre (**Gravensteen**, St Bavo's Cathedral + the **Ghent
  Altarpiece**, Graslei/Korenlei, Belfry, Patershol, SMAK/MSK, Vrijdagmarkt, **Werregarenstraat** graffiti
  alley), `GENR` surrounding (Sint-Martens-Latem, the Leie, Deinze). Canon: **waterzooi**, **Gentse
  stoverij**, **cuberdon** (neuzekes), **Tierenteyn mustard**, Gruut city brewery, veggie-capital dining.
- **brussels** (`cities/brussels.html`): `BRU` Brussels centre & inner communes (**Grand-Place**, Manneken
  Pis, the Royal Museums, **Atomium**, Sablon, Marolles, **Ixelles/Elsene**, **Saint-Gilles/Sint-Gillis**,
  Châtelain, EU quarter, Matongé), `BRUR` periphery (Uccle, Schaerbeek, Anderlecht — **Cantillon**,
  Tervuren, Waterloo). Canon: **moules-frites**, **stoofvlees/carbonnade**, **gaufre de Bruxelles**,
  speculoos, **lambic/gueuze/kriek** (Cantillon, the Senne valley), chocolate houses, brown cafés (À la
  Mort Subite, Delirium).
- **bruges** (`cities/bruges.html`): `BRG` Bruges centre (**Markt & Belfry**, Burg, Basilica of the Holy
  Blood, Groeningemuseum, Béguinage, canals, **De Halve Maan** brewery), `BRGR` surrounding (**Damme**, the
  coast — **Ostend**, Knokke, Zeebrugge, Blankenberge). Canon: **De Halve Maan Brugse Zot**, Belgian
  chocolate (The Chocolate Line, Dumon), **garnaalkroketten** (grey-shrimp croquettes), moules, waffles,
  North Sea fish.

## The source bar (hard rule)
≥2 **credible** sources per place, OR one lone institutional authority (**Michelin**, **UNESCO**,
Gault&Millau, a national museum). Credible, native-language:
- **Flemish (NL):** **De Standaard**, **Het Nieuwsblad**, **Het Laatste Nieuws (HLN)**, **Gazet van
  Antwerpen**, **Het Belang van Limburg**, **VRT / VRT NWS**, **Visit Antwerpen / Visit Gent / Visit
  Bruges**, **Gault&Millau België**, **Michelin België**, **Culinaire Ambiance**, city brewery/tourism sites.
- **French (Brussels/Wallonia):** **Le Soir**, **La Libre / La DH**, **RTBF**, **BX1** (Brussels),
  **visit.brussels**, **Le Guide Michelin Belgique**, Gault&Millau, **Resto.be** editorial (not user reviews).
- **English/international (reuse where they name a place):** **DW Travel**, **Rick Steves** (Bruges/Ghent/
  Brussels/Antwerp), **Atlas Obscura**, **Lonely Planet**, **Time Out** (Brussels/Antwerp editions),
  **CNN Travel**, **National Geographic**, **Condé Nast Traveler**, **The Brussels Times**.
- **Beer authorities (credible for the beer layer):** **RateBeer/Untappd count as ZERO** (rating-only);
  but a brewery's own site + a credible outlet, or a **CAMRA/beer-journalism** feature, or the Belgian
  **Zythos**/beer-heritage bodies, do count. Trappist/abbey status from the official **ITA / Trappist**
  authority is institutional.
- **University & campus:** KU Leuven/UAntwerpen/UGent/ULB/VUB student-life guides, ESN.
- **Creators (viral/authentic):** verifiably-popular BE food/travel bloggers, YouTubers, TikTokers with a
  real following + a specific findable piece naming the place — record in `CREATORS_*.json`.
- **TikTok & Reddit:** in-language hashtags + r/belgium, r/brussels, r/Antwerp, r/ghent, r/Bruges — a
  corroborating local vote, never a lone-comment pin. Fact-check everything.
- **Yelp/TripAdvisor/Google/Resto.be-user-reviews = ZERO** toward the bar (may only *measure*). Reject
  anonymous SEO listicles. A mention is not merit — measure (award / real rave / cross-platform volume).

## Output schema (dataset-city format — mirror Aachen's files exactly)
- **Food/drink** → LIST `FOOD_<CITY>_<scope>.json`; each: `{"t":1|2|3,"a":"<AREA>","cz":["Beer"/"Belgian"/
  "Flemish"/"French"/"Michelin"/…],"dish":"<named dish or beer>","n":"<name>","address":"<full street,
  City, Belgium>","w":"<1-3 sentences>","closed":false,"sources":[["KEY","url"],["KEY2","url2"]]}`
- **Sights** → DICT `SIGHTS_<CITY>_<scope>.json`: `{"sources":[...],"sights":[{"t","a","n","address","w",
  "k","g":["ICON","UNESCO","HIST","ARCH","MUS","PARK","MKT","NIGHT","FREE"...],"sources":[...]}]}`
- **New outlets** → `SOURCES_<CITY>_<scope>.json` `{"outlets":[...]}`; creators → `CREATORS_<CITY>_<scope>.json`.
- Name a **specific dish/beer**, never a bare label. `t` = tier WITHIN the area. **NO lat/lng** — ADDRESS
  names the town + Belgium. Dedup: add NEW places only. Flag closures `closed:true` + " — CLOSED".

## Do NOT
Fabricate a place, address, dish, source, or beer. No rating-only entries. No coordinates from memory. If a
place can't clear the ≥2-credible bar, leave it out (log it in AUDIT.md as held).
