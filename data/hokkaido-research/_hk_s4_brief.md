# Hokkaido session-4 subagent brief (2026-10-02) — read with _AGENT_BRIEF.md + ../japan-research/_AGENT_BRIEF.md

You are a background research subagent for the Hokkaido map. Work dir: `data/hokkaido-research/`.
WRITE ONLY: your own wave script `_w<NN>_<slug>.py` (uses `_hk.py`: S()/F()/emit("W<NN>")), run it, and your
`_note_W<NN>.md` (audit note: queries run, sources/channel mix, kept, MEASURED & DROPPED, held single-source, pins
high/med/unverified counts, closures). Do NOT git add/commit/push, do NOT run rebuild-city, do NOT touch other files.

HARD RULES: ≥2 credible sources per place (or a lone MICHELIN/UNESCO/BUNKACHO award); Tabelog/Google/Retty/Yelp/TA = 0.
rurubu.jp + mapple.net + city tourism bodies (sapporo.travel, hakodate.travel, otaru.gr.jp, obikan.jp, kushiro-lakeakan.com,
laketoya.com, niseko-ta.jp, visit-hokkaido.jp) each count as ONE credible source. Creators (YouTube/TikTok/blogs) count
once only if verifiably large (record follower scale in the note). Coordinates ONLY as read in a search result from
Wikipedia/Wikidata infobox (北緯…東経…), an official map, or a Google `!3d!4d` place pin — never `/@`, never a
town/ward centroid, never memory → else lat=None (UNVERIFIED). Status: open unless a source says closed (record it).
Never fabricate. Check `_hk_existing_names.txt` (area<TAB>name) — never duplicate an existing place (same venue under
another spelling counts as duplicate). Names: romanized + (Japanese). Every food record names a `dish`.
cz labels: SUSHI RAMEN NOODLE KAISEKI IZAKAYA TEMPURA KONAMON WAGYU TEISHOKU OKINAWA HOKKAIDO TOFU SWEET CAFE SAKE MKT FINE INT.
Areas: SPR OTARU NSK DONAN IBURI DHOKU TKC DOTO SOYA (see _AGENT_BRIEF.md). Tier 1/2/3 graded within area.

WHAT WORKS (reuse): batched `"<A> 座標; <B> 座標; <C> 座標"` with allowed_domains ["ja.wikipedia.org"] returns infobox
coords (3 names/query). Restaurants: query 3–4 shop names restricted to rurubu.jp + mapple.net → both outlets' spot pages =
2 sources in one search. Pinnable FOOD = michi-no-eki with a named dish, breweries/wineries/distilleries/sake breweries,
markets, food halls, cafés inside historic buildings with wiki coords — prefer these so new food lands ON the map.
DEAD ENDS: guide.michelin.com venue pages (none for Hokkaido), `<shop> 緯度経度`, mapion, OSM search, Tabelog lists.

BUDGET: hard cap of ~30 WebSearch calls for you. Stop at 30. On rate-limit errors wait and retry.
Write the wave script incrementally (re-run emit after each ~5 places). Final reply (≤150 words): counts kept per area,
pinned vs unverified, searches used, file names.
