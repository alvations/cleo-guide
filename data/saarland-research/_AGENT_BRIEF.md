# Saarbrücken & the Greater Region (SaarLorLux) — standing agent brief

A cross-border guide anchored on **Saarbrücken**, reaching across the tri-border **Greater Region /
Grande Région**: Saarland (DE) · French Moselle/Lorraine (FR) · Luxembourg (LU) · the German Mosel &
Trier (DE). Same pipeline + gates as every guide (docs/PIPELINE.md, docs/SOURCES.md): **discover →
fact-check (≥2 credible) → geocode + location-verify → re-rank within area → build & gate.** WebSearch
only (WebFetch blocked). Discovery agents emit **sourced research JSON with an ADDRESS but NO
coordinates** (geocoding is a later stage). This is a European, multilingual region — **search in German
AND French** (and Luxembourgish/English where natural), and cite native-language sources.

## Region & area codes (a)
- `SAAR` — **Saarbrücken & Saarland (DE):** Saarbrücken (St. Johann, the Saar, Ludwigskirche, Alt-Saarbrücken),
  Völklingen (UNESCO Ironworks), the Saarschleife/Mettlach, Saarlouis, St. Wendel, Homburg, Perl.
- `MOSELLE` — **Sarreguemines & French Moselle/Lorraine (FR):** Sarreguemines (faïence/ceramics), Metz
  (Cathédrale St-Étienne, Centre Pompidou-Metz, Quartier Impérial), Bitche (citadelle), Amnéville, Forbach.
- `LUX` — **Luxembourg (LU):** Luxembourg City (UNESCO old town, Bock casemates, Chemin de la Corniche,
  Grund), Vianden, Echternach, Mullerthal, and the **Luxembourg Moselle** wine towns (Remich, Grevenmacher).
- `MOSEL` — **German Mosel & Trier (DE):** Trier (Porta Nigra + the Roman UNESCO monuments, oldest city in
  Germany), Bernkastel-Kues, Cochem, Traben-Trarbach, and the Mosel Riesling wine villages.
- `ALSACE` — **Alsace, FR (Strasbourg & the Rhine):** the French side reaches east to **Nancy** (Lorraine,
  area `MOSELLE`) and on to **Strasbourg** (area `ALSACE`) — Strasbourg's UNESCO Grande Île, the Cathédrale
  Notre-Dame, Petite France, the European Parliament/Council of Europe, plus the Nancy→Strasbourg corridor
  (Saverne, Sarrebourg, Phalsbourg, Molsheim, Obernai). Alsace food canon: **choucroute**, **tarte
  flambée / flammekueche**, **baeckeoffe**, **kougelhopf**, **bretzel**, winstubs and Alsace Riesling /
  Gewürztraminer / Crémant d'Alsace. Credible FR/Alsace outlets: **Dernières Nouvelles d'Alsace (DNA)**,
  **France Bleu Alsace**, **Visit Strasbourg / Strasbourg.eu**, **Visit Alsace**, Pokaa (Strasbourg local),
  Michelin/Gault&Millau.

## The food & drink canon — signature FIRST, then depth (name the dish)
- **Saarland (DE):** Schwenkbraten/**Schwenker** (marinated grill), **Dibbelabbes** & **Gefillde** (potato),
  **Lyoner** (Fleischwurst ring), Geheirade, Bibbelsche Bohnesupp, Gustavo/Saarland beer, Michelin depth
  (e.g. **Victor's Fine Dining by Christian Bau**, 3-star, Perl-Nennig).
- **Moselle/Lorraine (FR):** **quiche Lorraine**, **pâté lorrain**, **tarte aux mirabelles** & mirabelle
  eau-de-vie, Metz bistros, boulangeries/pâtisseries.
- **Luxembourg (LU):** **Judd mat Gaardebounen** (smoked collar + broad beans, the national dish),
  **Gromperekichelcher** (potato fritters), **Bouneschlupp**, **Kachkéis** (cooked cheese), **Quetschentaart**,
  **crémant** & Luxembourg Moselle wine (Riesling, Pinot, Elbling), F. Rock/Am Tiirmschen institutions.
- **Mosel (DE):** **Riesling** (steep-slope wine villages, weingüter/Weinstuben), Zwiebelkuchen &
  Federweisser in autumn, Viez (Saar-Mosel cider), Trier wine culture.

## The source bar (hard rule)
≥2 **credible** sources per place, OR one lone institutional authority (**Michelin**, **UNESCO**,
Gault&Millau, a national monument/museum). Credible, native-language, for this region:
- **DE:** Saarbrücker Zeitung, SR/Saarländischer Rundfunk, Trierischer Volksfreund, Saarland Tourismus,
  Tourismus Zentrale Saarland, Mosellandtouristik, Michelin Deutschland, Gault&Millau.
- **FR:** Le Républicain Lorrain, France Bleu (Lorraine/Moselle), Guide Michelin, Petit Futé, tourisme
  Moselle / Inspire Metz / Moselle Tourisme.
- **LU:** Luxembourg Times, RTL Lëtzebuerg, Le Quotidien, Visit Luxembourg, Michelin Luxembourg.
- **Cross-border / European broadcast:** Grande Région / Greater Region tourism, **DW Travel (Deutsche
  Welle)**, **ARTE**, **SWR / SR Fernsehen**, 3sat, euronews.
- **Local university & campus sources (authentic student-local recommendations):** **Universität des
  Saarlandes** & **htw saar** (Saarbrücken), **Universität / Hochschule Trier**, **University of
  Luxembourg**, **Université de Lorraine (Metz)** — their student-life pages, "was tun in Saarbrücken /
  que faire à Metz" city guides, **Studierendenwerk** tips, and **ESN (Erasmus Student Network)** local
  guides. These count as credible local recommendations.
- **Luxembourg press:** **Luxemburger Wort (wort.lu)**, **Tageblatt**, Le Quotidien, RTL Lëtzebuerg.
- **Local bloggers & travel vloggers (viral/authentic):** verifiably-popular German/French/Luxembourgish
  food & travel bloggers, YouTubers and TikTokers who cover the region (e.g. Saarland/Mosel/Metz/Luxembourg
  food & travel creators, Reisereporter, regional food vloggers) — count only with a **real, findable
  following and a specific piece naming the place**; record the creator in `CREATORS_*.json`.
- A **verifiably-popular** food/travel creator (real following + a findable piece) may count as a strong
  source. **Yelp/TripAdvisor/Google/OpenTable/Tripadvisor-style ratings count as ZERO** toward the bar
  (they may only *measure* popularity — merit bar below). Reject anonymous SEO listicles / content farms.
  Prefer **German- (and French-/Luxembourgish-) language** sources; search in-language.
- **TikTok & Reddit (younger-generation / local layer)** — mine both for what's popular with a younger,
  local crowd: TikTok/Reels food & travel hashtags (in-language) and the **local subreddits** (r/saarland,
  r/Luxembourg, r/Metz, r/germany, r/Trier). A **TikTok** counts only as a *specific findable video from a
  verifiably-popular account* naming the place (tag `"Viral"`); **Reddit** is an authentic-local **lead +
  corroborating vote**, never a lone-comment pin — pair it with ≥1 credible source and fact-check the
  place. See the Reddit/TikTok rules in [docs/SOURCES.md](../../docs/SOURCES.md). Always fact-check →
  re-rank → location-verify.
Merit bar: a mention is not merit — an award (Michelin/Gault&Millau/regional prize), a real rave, or a
high rating with real cross-platform volume before a place earns a pin. Record keep/drop in AUDIT.md.

## Output schema (mirror the other cities' files exactly)
- **Food/drink** → a JSON **LIST** file `FOOD_<scope>.json`; each record:
  `{"t":1|2|3,"a":"<area>","cz":["<cuisine strings>"],"dish":"<named signature dish>","n":"<name>",
    "address":"<full street address, Town, Country>","w":"<1-3 sentence writeup>","closed":false,
    "sources":[["KEY","https://url"],["KEY2","https://url2"]]}`
- **Sights** → a JSON **DICT** file `SIGHTS_<scope>.json`:
  `{"sources":[{"key","name","url"}...],
    "sights":[{"t":..,"a":"..","n":"..","address":"..","w":"..","k":"<kind>","g":["ICON","HIST","MUS",
               "PARK","CRAFT","MKT","ODD","FREE"...],"sources":[["KEY","url"]...]}]}`
- **New outlets** → `SOURCES_<scope>.json` in the **dict** form `{"outlets":[{"key","name","type","url",
  "credible":"<why credible; note the language>"}...]}`.
- Name a **specific dish**, never a bare cuisine label. `t` = tier WITHIN the area (rank within area, not
  across the whole region). **NO lat/lng** — include the ADDRESS (geocoding is the next stage). Address
  MUST name the town + country so the map can bin it. Dedup: add NEW places only.

## Do NOT
Fabricate a place, address, dish, or source. No Yelp-only entries. No coordinates from memory. If a place
can't clear the ≥2-credible bar, leave it out (or note it in a `_dropped` list).
