# Osaka W4 worker brief (session 4, 2026-10-03) — read fully

You are a background research worker for the Osaka travel map (repo `/home/user/cleo-guide`, research dir
`data/osaka-research/`). Rules that override everything: `CLAUDE.md` hard rules 4a/4c + editorial rules,
`data/japan-research/_AGENT_BRIEF.md` (source bar, output schema, cuisine taxonomy), `data/osaka-research/_AGENT_BRIEF.md`
(area ids). Skim those three files first (quickly — don't read the whole docs tree).

## Hard limits
- **WebSearch only** (WebFetch is blocked by policy — never try it, never curl). **Cap: the number of searches in your
  task prompt.** Count every call. Stop when you hit it.
- **Do NOT run git** (no add/commit/push/pull). Do NOT edit any file outside the files named in your task. Do not run
  the build. The main session consolidates, builds and commits.
- **Never fabricate** a place, address, dish, source URL or coordinate. Use only URLs that appeared in search results.

## Already discovered — do not duplicate
`data/osaka-research/_osaka_names.txt` lists every name already in the dataset (319). Also check `_pending_osaka_W2.json`, `_held_*.json` (leads already found — promote them by finding the missing 2nd source rather than re-discovering). Skip those.

## Source bar
≥2 credible sources per place (different keys), OR one lone institution: Michelin (`MICHELIN` Selected /
`MICHELIN_BIB` / `MICHELIN_STAR` — the award/listing venue page only), `UNESCO`, `BUNKACHO` (National Treasure /
Important Cultural Property / Special Historic Site / Special Scenic Beauty). Michelin magazine articles =
`MICHELIN_EDITORIAL` (one ordinary source). Credible keys in use: `JAPANGUIDE`, `OSAKAINFO`, `TIMEOUT`, `WIKIPEDIA`
(en or ja), `LONELYPLANET`, `INSIDEOSAKA`, `FEELKOBE`, `JAPANTIMES`, `TABELOG100` (百名店 selection page), `TABELOGAWARD`,
`DANCYU`, `SAVORJAPAN`, `ATLASOBSCURA`, `CNTRAVELER`, `CNN`, `NHK`, `ASAHI`, `MAINICHI`, `ASIA50`, `JATA88` (Japan Anime
Tourism Association 88 spots), `OFFICIAL` (own site — corroborates, never one of the two for a restaurant).
Yelp/TripAdvisor/Google/Tabelog *scores*/Retty/Klook = 0. A creator (YouTube/TikTok/blog with verifiable large
following + a specific piece naming the place) = `CREATOR_<HANDLE>` one source.

## Output — append as you go (every ~5 verified places), using the dedup helper
```bash
cd /home/user/cleo-guide/data/osaka-research
python3 _osaka_add.py food  FOOD_OSAKA_<TAG>.json  < /path/recs.json     # list of food dicts
python3 _osaka_add.py sight SIGHTS_OSAKA_<TAG>.json < /path/recs.json    # list of sight dicts
python3 _osaka_add.py geo   _geoout_osaka_<TAG>.json < /path/recs.json   # list of geo dicts (goes into geo/)
```
Write temp JSON into `data/osaka-research/_tmp_<TAG>_*.json` (delete when done).
- Food: `{"t":1|2|3,"a":"<AREA>","cz":["SUSHI"…],"dish":"<named dish>","n":"<romanized name>","address":"<full
  address incl. ward, Osaka, 〒 if known>","w":"<1-2 sentences, cite the award/year>","closed":false,
  "sources":[["KEY","url"],…]}` — cz from `SUSHI RAMEN NOODLE KAISEKI IZAKAYA TEMPURA KONAMON WAGYU TEISHOKU OKINAWA
  HOKKAIDO TOFU SWEET CAFE SAKE MKT FINE INT` (INT = non-Japanese cuisine: Chinese/French/Italian/Korean/bar etc.;
  bars/cocktails → `SAKE` only if sake/whisky/craft-beer focused, else `INT`; coffee/kissaten → `CAFE`). Every card
  must name a specific dish/drink; if none surfaces, hold it (don't write it).
- Sight: `{"t":1|2|3,"a":"<AREA>","n":"…","address":"…","w":"…","k":"<kind>","g":["ICON","TEMPLE","MUS","POP",…],
  "sources":[…]}` — anime/pop-culture places add `"anime":"<franchise — why it matters>"` and `"POP"` in g.
- Geo: `{"n":"<exact same name>","address":"…","lat":…,"lng":…,"confidence":"high|med|unverified",
  "geoSource":"<what + URL>","status":"open|closed","statusSource":"<what + URL>"}`. Coordinates ONLY from: Michelin venue
  page lat/lng, Wikipedia/ja.wikipedia infobox coordinates (座標), the official site map, or a Google `!3d<lat>!4d<lng>`
  place pin. Never a `/@` viewport, centroid, or memory. If you can't get one, write the geo record with
  `lat:null,lng:null,confidence:"unverified"` (still record status if known).
- Tiers graded within area: t1 = must-go (stars, iconic), t2 = strong, t3 = solid.
- Address street numbers only if a source showed them; otherwise ward/locality only.

## Efficient searching (proven)
- Michelin: `allowed_domains:["guide.michelin.com"]`, query like `Osaka Bib Gourmand <genre> Chuo-ku Namba address`
  → 3–6 venue pages each with address + distinction. Then `<name> <street> latitude longitude` on the same domain
  returns the venue-page lat/lng. Batch 2–3 names per lat/lng query only when sure they're Michelin venues.
- Wikipedia coordinates: `allowed_domains:["ja.wikipedia.org"]` `"<名称A> 座標; <名称B> 座標; <名称C> 座標"` (3/3 proven).
- Lists: `allowed_domains:["osaka-info.jp"]`, `["japan-guide.com"]`, `["timeout.com"]` area queries.

## Finish
Return a short report: places written (food/sight per area), geocoded high/med/unverified, held (with reason),
MEASURED & DROPPED (name + reason), searches used, and anything the main session should know.

## W4 additions (2026-10-03)
- **Source mix (RUN §2a):** every worker must try at least 2–3 searches on the creator/viral channel (named
  creators' Osaka pieces — e.g. Inside Osaka, Ramen Adventures, Abroad in Japan, Paolo fromTOKYO, Only in Japan,
  Rachel & Jun, Japanese YouTubers/TikTokers with a real following) and record any vetted creator in
  `CREATORS_OSAKA_<TAG>.json` (`{creators:[{key,name,platform,handle,url,scale,niche,credible}], attach:[{place,creatorKey,url}], rejected:[…]}`).
  Creator = ONE source, never a lone pin. Specific-title queries; broad creator queries fan out and burn budget.
- **Key hygiene:** MICHELIN_* = the guide's venue listing only; Michelin magazine = MICHELIN_EDITORIAL.
- **Food ≥50%** of what you add unless your task says sights.
- In your final report give per-channel counts (Michelin / editorial / official / creator / local).
- Nara belongs to the Kyoto map — skip it.
