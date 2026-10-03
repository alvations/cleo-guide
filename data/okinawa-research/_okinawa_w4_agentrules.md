# W4 subagent rules (Okinawa) — read fully

Repo: /home/user/cleo-guide. Research dir: data/okinawa-research/. You are one of several parallel subagents.
- Write ONLY your own tagged files (named in your task). NEVER run git, never edit shared files (data/geocodes.json,
  data/sources.json, cities/*, tools/*, docs/*), never run rebuild-city.py. The orchestrator merges/builds/commits.
- WebSearch is the only web channel (WebFetch is blocked by policy — don't try). Respect your SEARCH CAP; on a
  "limit/cap reached" error, stop immediately, save, and report.
- Read for context first (skim): data/okinawa-research/_AGENT_BRIEF.md, data/japan-research/_AGENT_BRIEF.md,
  data/okinawa-research/_okinawa_w3_notes.md and _okinawa_w2_notes.md (held leads + GPS already surfaced — reuse them,
  don't re-search what's there). Never duplicate an existing place: check names in data/okinawa.dataset.json (P and F).
- NEVER fabricate. Never use Google `/@lat,lng` viewport, a town/area centroid, or memory for a coordinate. Valid pin
  sources: Stars and Stripes Okinawa printed GPS (okinawa.stripes.com articles print "GPS: N26.xxx E127.xxx" or
  decimal coords — very productive: search e.g. `site:okinawa.stripes.com "<place>" GPS`), Google Maps place URL
  `!3d<lat>!4d<lng>`, Wikipedia/Japanese Wikipedia infobox coordinates, official site/municipal page coordinates,
  Michelin venue page, MLIT/prefecture pages printing coords, mapion/navitime pages that print the venue's lat/lng.
  Confidence: high = exact venue point from such a source; med = venue-level point from a less exact source (e.g.
  parking/entrance printed by Stripes); otherwise do not pin → UNVERIFIED (record why).
- Batch queries to save budget: e.g. 2–3 place names per search, or a Stripes list article that prints many GPS.
- Status (CLAUDE.md 4c): record status "open"/"closed" + statusSource (a current article/official page/closure news).
  If you see evidence a place closed permanently, record status "closed" with the source.
- Geo record schema (append via helper, one JSON list on stdin):
  `python3 data/okinawa-research/_okinawa_add.py G <TAG> <<'J'` `[{"n": "<EXACT name as in dataset/your record>",
  "address": "...", "lat": 26.x, "lng": 127.x, "confidence": "high|med", "geoSource": "<source + url + what it printed>",
  "status": "open", "statusSource": "..."}]` `J`
  For unresolvable ones append `{"n":..., "address":..., "confidence":"UNVERIFIED", "geoSource":"<what was tried>", "status":"open", "statusSource":"..."}` (no lat/lng).
- Append results IMMEDIATELY in batches of ~5 (you may be cut off any moment).
- Discovery records (food: `python3 _okinawa_add.py F <TAG>`; sights: `S <TAG>`) follow the schema already in
  FOOD_OKINAWA_W3.json / SIGHTS_OKINAWA_W3.json: food {t (1-3 tier within area), a, cz [cuisine ids from
  data/okinawa.dataset.json "cuisines"], dish (named dish/drink), n ("English (日本語)"), address, w (sourced facts only,
  1-3 sentences), sources [[KEY,url],...], closed}; sights {t, a, n, address, w, k (kicker), g [cat ids from dataset
  "cats"], sources}. Every place needs ≥2 credible independent sources (Yelp/TripAdvisor/Google/Tabelog = 0; a lone
  MICHELIN star/Bib or UNESCO designation suffices). Source KEYs: reuse keys in SOURCES_OKINAWA_W*.json /
  data/sources.json (e.g. RURUBU, MAPPLE, OKINAWATRAVELER, OKINAWATIMES, STRIPES, JAPANGUIDE, GLTJP, WIKI...); a NEW
  outlet/creator → add {key,name,url,credible} to SOURCES_OKINAWA_<TAG>.json {"outlets":[...]} (creators:
  CREATORS_OKINAWA_<TAG>.json {creators:[{key,name,platform,handle,url,scale,niche,credible}],attach:[{place,creatorKey,url}],rejected:[]}).
  Merit bar: a mention is not merit — prefer award/vote/long-standing local institution/major press/high-volume rating.
  Food & drink needs a named dish/drink. Anime records add `"anime": "<franchise — why>"`.
- Pin every new place you discover in the same pass when a valid source surfaces (geo file with your TAG).
- Finally write a short notes file `_okinawa_<TAG>_notes.md`: searches used, per-place outcome, held single-source leads, sources/channel mix, closures.
- Final reply (≤150 words): counts kept/pinned/UNVERIFIED/closed, searches used.
