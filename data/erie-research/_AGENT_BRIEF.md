# Erie, PA + Pittsburgh→Lake Erie corridor — standing agent brief

Every research agent for Erie follows this. Same pipeline + gates as every US city
(docs/PIPELINE.md, docs/SOURCES.md): **discover → fact-check (≥2 credible) → geocode + location-verify →
re-rank within area → build & gate.** WebSearch only (WebFetch is blocked here). Discovery agents emit
**sourced research JSON with an ADDRESS but NO coordinates** (geocoding is a later, separate stage).

## Region & area codes
Erie, PA and the I-79/US-19 corridor SOUTH to Pittsburgh's edge. Area codes (a):
- `ERIE` — Erie proper: Bayfront, Presque Isle, downtown, Millcreek, the east/west side.
- `NORTHEAST` — North East & the Lake Erie wine belt.
- `MEADVILLE` — Meadville & Crawford County (Allegheny College, Market House, Cambridge Springs).
- `EDINBORO` — Edinboro (PennWest/Edinboro University) & Cambridge Springs.
- `GROVECITY` — Grove City, Mercer, Slippery Rock (Slippery Rock University).
- `CORRIDOR` — the I-79 in-between toward Pittsburgh: Conneaut Lake, Zelienople/Harmony, Cranberry Twp,
  Portersville, Butler-adjacent. The stops a traveller passes between the city and Pittsburgh.

## The food canon — signature FIRST, then the immigrant/Asian tables (every US city gets this)
1. **Erie's own canon:** the **Greek-sauce hot dog** (New York Lunch, Sara's), deep-fried **pepperoni
   balls** (Stanganelli's), **sponge candy** (Romolo, Pulakos), **Federal Hill Italian**, **Great-Lakes
   perch & walleye** fish fries, the **Lake Erie wine belt**, and the breweries.
2. **THEN the immigrant/Asian deep-dive — do NOT skip it.** Erie is one of Pennsylvania's largest
   **refugee-resettlement** cities: sizeable **Bhutanese/Nepali**, **Vietnamese**, **Chinese**, **Thai**,
   **Indian/South Asian**, **Middle Eastern (Syrian/Iraqi)**, **Bosnian**, and **Congolese** communities,
   plus **Mexican/Latin**. That means real momo, pho, curry houses, halal groceries/kitchens, dumplings,
   sushi. Find the hidden-gem places that serve them (cuisine tag = the KITCHEN's tradition, dish named).
3. **College-town & corridor food:** Edinboro U / Slippery Rock U / Allegheny College town food; Grove
   City, Meadville, Cranberry/Zelienople notable spots.

## The source bar (hard rule)
≥2 **credible** sources per place, OR one lone institutional authority (James Beard / Michelin / NPS).
Credible for Erie: **Erie Times-News / GoErie**, **Erie Reader**, **Erie News Now / WICU-WSEE**,
**YourErie / WJET-WFXP**, **Visit Erie / VisitPA**, **PA DCNR / NPS**, **Pittsburgh Post-Gazette /
TribLive** and **Butler Eagle / Meadville Tribune / Sharon Herald** (for corridor towns), **UncoveringPA
/ interestingpennsylvania**, and a **verifiably popular** food creator (real following + findable video).
For the immigrant-food scene, community/nonprofit features (USCRI Erie, International Institute of Erie)
and local-news pieces on the international food scene count as credible. **Yelp/TripAdvisor/Google/
OpenTable count as ZERO** toward the bar (they may only *measure* popularity — see the merit bar).
Merit bar: a mention is not merit — an award, a real rave, or a high rating with real volume before it
earns a pin. Record keep/drop in AUDIT.md.

## Output schema (mirror the existing files exactly)
- **Food** → a JSON **LIST** file `FOOD_ERIE_<scope>.json`; each record:
  `{"t":1|2|3,"a":"<area>","cz":["<cuisine strings>"],"dish":"<named signature dish>","n":"<name>",
    "address":"<full street address, City, PA ZIP>","w":"<1-3 sentence writeup>","closed":false,
    "sources":[["KEY","https://url"],["KEY2","https://url2"]]}`
- **Sights** → a JSON **DICT** file `SIGHTS_ERIE_<scope>.json`:
  `{"sources":[{"key":"KEY","name":"…","url":"…"}...],
    "sights":[{"t":..,"a":"..","n":"..","address":"..","w":"..","k":"<kind>","g":["ICON","PARK"...],
               "sources":[["KEY","url"]...]}]}`
- **New outlets** → add to `SOURCES_ERIE.json` (or a new `SOURCES_<scope>.json`) as
  `{"key","name","type","url","credible":"<why credible>"}`.
- Cuisine strings map via consolidate.py CMAP (Thai/Chinese/Vietnamese/Indian/Japanese/Sushi/Korean/Pho →
  ASIAN; Mexican/Tacos → MEX; Italian/Pizza → ITAL; etc.). Name a **specific dish**, never a bare label.
- `t` = tier WITHIN the area (1 = must-eat/see, 2 = strong, 3 = worth it). Rank within area, not city.
- **NO lat/lng** — include the ADDRESS; geocoding is the next stage.
- **Dedup:** do not re-add any name in `data/erie-research/` already (list at
  `/tmp/.../scratchpad/erie_existing.txt`, or the current dataset). Add NEW places only.

## Do NOT
Fabricate a place, an address, or a source. If a place can't clear the ≥2-credible bar, leave it out (or
list it in the file's `_dropped` note). No Yelp-only entries. No coordinates from memory.
