# Philadelphia — AUDIT (append-only ledger; docs/PIPELINE.md audit contract)

## 2026-10-02 · Stage 0 — Scope & taxonomy
- Region: City of Philadelphia (7 in-city areas) + Main Line/suburbs, South Jersey/Camden edge, Brandywine/Valley Forge
  day trips (10 areas total; see _AGENT_BRIEF.md). Lancaster County deliberately excluded (Harrisburg-York-Lancaster map).
- Why these areas: they mirror how Philadelphians and Visit Philadelphia carve the city (Center City/Old City vs South
  Philly vs the river wards vs University City vs the Northwest), NYC-style borough granularity; ~500 target split by
  how dense each is in sights + food (Center City heaviest).
- Cuisines: 21-id Philadelphia taxonomy led by the canon (Cheesesteaks & Roast Pork, Hoagies, Pizza & Tomato Pie,
  Diners/Scrapple, Bakeries/Pretzels/Water Ice) + immigrant kitchens (Mexican, Vietnamese, Cambodian/Indonesian/SEA,
  Chinese, African, Latin/Caribbean, Middle Eastern). Collections: 13 incl. Revolutionary & Colonial History, Murals &
  Public Art, Sports & Rocky.

## 2026-10-02 · Stage 1 — Discover sources (W1) — BLOCKED by the shared WebSearch cap
- Seeded the registry with 27 outlets (SOURCES_core.json → data/sources.json, each with a `credible` rationale):
  Michelin Philadelphia 2025, James Beard, NPS, Inquirer/LaBan, Philly Mag/Foobooz, Eater Philly, Infatuation,
  Visit Philadelphia, Billy Penn/WHYY, PhillyVoice, Atlas Obscura, Hidden City, Mural Arts, Parks & Rec, travel
  (Lonely Planet, Time Out, Condé Nast Traveler), regional (Main Line Today, NJ Monthly, Courier-Post), 6abc.
  These are registered as candidate palette; per-place credibility is still established by search per wave.
- First WebSearch calls returned "this session has used its web search budget (200 of 200 WebSearch calls)" —
  the cap is session-wide and shared by all ~17 concurrent agents, already exhausted before this agent's first
  query. Backed off 10 min and retried (see next entry). NOTHING was added from memory (CLAUDE.md 4a; no-fabrication).
- Retry after a 10-minute back-off (2026-10-02): still "200 of 200 WebSearch calls" — the cap is a hard per-session
  limit (CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION), not a rate limit, so waiting does not restore it. W1 not started;
  0 places discovered, 0 geocoded. Scaffold (consolidate.py, build-philadelphia.py, brief, targets, registry entry)
  is committed and ready; the next launch with search budget starts W1 directly from RESUME.md "Next actions".

## 2026-10-02 · W1 relaunch — Stage 1-3 discover/extract/fact-check (fresh search budget)
- Sources found per query (researchedVia WebSearch; WebFetch blocked): Michelin 2025 Philadelphia list via FOX29 + Billy Penn
  (3 stars, 10 Bib, 1 Green Star, 21 Selected — Pietramala counted once) → 34 places, lone-authority MICHELIN_* keys.
  Inquirer 2023 cheesesteak bracket + LaBan 2002/2008; Visit Philly + Philly Mag roast pork; Inquirer + Philly Mag tomato pie;
  Visit Philly + Billy Penn water ice; Infatuation + Inquirer Reading Terminal Market vendors; Visit Philly + Philly Mag
  hoagies (+ LaBan on Castellino's); Infatuation + Philly Mag pho/Vietnamese; JBF 2022 (Cristina Martinez) + Time Out +
  Visit Philly tacos; NPS Independence 'Places to go'; Visit Philly Old City / Historic District / Parkway guides.
- MEASURED (cheesesteak): Inquirer 2023 reader bracket (Dalessandro's 23%, John's 19.2%, Angelo's 17%) + Michelin Bib
  (Angelo's, Dalessandro's, Del Rossi's) = the standouts (t1). Pat's kept t1 as the historic ORIGIN (1930s, CBS + Wikipedia),
  explicitly described as history-not-best; Geno's / Jim's South St / Tony Luke's kept t2 as icons. Steve's Prince of Steaks
  HELD (only an SEO/blog listing; no credible 2nd source yet). Sonny's HELD (GQ 2014 claim seen only second-hand).
- Creators: Mark Wiens Taste Tour USA Philadelphia Pt 2 (Tubi) → attached to Angelo's (CREATORS_W1.json).
- HELD single-source (not added): Jean-Georges Philadelphia (Infatuation), Scampi, Griddle & Rice (Infatuation 2025 new),
  Amá + Emilia (Eater 38 summer 2026 mention only), June BYOB + White Yak (Philly Mag 50 Best mention only), Frida Cantina
  (6abc only), D'Jakarta Cafe (Food Republic 2015 only), Corropolese (Inquirer only — 2 Inquirer pieces = 1 outlet),
  Liberty Kitchen (Visit Philly roast pork only), Sonny's, Steve's.
- Address note: discovery addresses are best-known street addresses; several Michelin addresses were left partial
  (Provenance, Ambra, Illata, Little Water, Roxanne, Del Rossi's) — the geocode pass verifies/corrects every address.
- Counts after batch 1: food 60 (Michelin 34, canon 26), sights 24 (CC). Channel mix: institutional 37, editorial 47, creator 1.
- Dead end: 'Wikipedia coordinates A; B; C' for PMA/Barnes/ESP returned addresses only (no coords) — budget 1 search/pin.
