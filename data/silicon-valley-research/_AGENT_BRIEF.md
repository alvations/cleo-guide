# Silicon Valley — standing brief for every research / re-sourcing agent

Read before any SV wave. Enforces the user's standing directives.

## The bar (every place must clear it)
A place ships only if it is **notable, authentic, a hidden gem, popular, viral, OR iconic — and above
all CREDIBLE**: traceable to a source that carries real weight, with the specific claim/dish named.
**500 is a yardstick, not a goal.** Never pad to a number. A smaller set of genuinely notable,
credibly-sourced places beats a padded one. Prune or hold anything you cannot credibly source.

## Sources — exhaust these BEFORE ever touching Yelp
Yelp/TripAdvisor are **open-status verification ONLY — never the recommender.** A place may not ship
with Yelp as its sole source. Work down this palette and cite the first credible one that names it:

1. **Guides of record:** MICHELIN (star / Bib Gourmand / Green Star), JAMESBEARD (nominee/semifinalist/winner).
2. **Elite food media:** INFATUATION, KQED (Bay Area / Luke Tsai). *(EATERSF, SFCHRON, MERCURY, THRILLIST
   are credible but their domains are BLOCKED to the crawler — cite them only if a title/quote actually
   surfaces; don't burn searches on the domains. Mercury sometimes surfaces via edition.pagesuite.com.)*
3. **South-Bay local of record:** METROSV (Metro Silicon Valley + its "Best of Silicon Valley" reader
   poll), SJSPOTLIGHT (San José Spotlight), SIXFIFTY (The Six Fifty), PALOALTOONLINE (Palo Alto Online/
   Almanac), MTNVIEWVOICE (Mountain View Voice).
4. **Reported TV/news:** NBCBAY (NBC Bay Area), ABC7.
5. **Curated specialists:** ATLASOBSCURA (oddities), OFFICIAL sites, CASTATEPARKS, SJTOURISM, VISITCA (sights).
6. **Vetted creators:** a YouTuber/TikToker/blogger with a *verified* real following + a *findable* piece
   of content at the actual place (register in `sources.json` creators; see `CREATORS.json`).
7. **Last resort, open-check only:** YELP / TRIPADVISOR / OPENTABLE — allowed to confirm a place is OPEN
   and to grab its address, but it must ALSO carry a source from 1–6 to appear on the map. If you can only
   find Yelp, put the place in a `_needs_credible_source` note, don't ship it as final.

Source KEYS to use: MICHELIN, MICHELIN_BIB, MICHELIN_STAR, JAMESBEARD, INFATUATION, KQED, METROSV,
SJSPOTLIGHT, SIXFIFTY, PALOALTOONLINE, MTNVIEWVOICE, NBCBAY, ABC7, ATLASOBSCURA, OFFICIAL, CASTATEPARKS,
SJTOURISM, VISITCA, YELP (open-check only).

## Always
- **Fact-check OPEN** (2025/2026) from a real source; closures kept-but-flagged or excluded (log why).
- **Name a specific dish**; tag the **kitchen's own tradition**, never a single dish it happens to serve.
- **FULL street address** required (for geocoding). **NEVER invent coordinates.**
- Grade tiers **within area & cuisine** (t1 best-in-class / t2 strong / t3 niche).
- Reply with counts + every exclusion and its reason, so the AUDIT.md ledgers can be updated.

## Area ids
PA Palo Alto/Stanford · MV Mountain View/Los Altos · SUN Sunnyvale · CU Cupertino/Saratoga · SC Santa
Clara · SJ San Jose · DAY day trips/coast. Fold nearby towns: Milpitas→SC, Los Altos→MV, Campbell→SJ,
Los Gatos/Saratoga→CU or DAY, Menlo Park/Redwood City/Fremont/Half Moon Bay/Santa Cruz→DAY.
