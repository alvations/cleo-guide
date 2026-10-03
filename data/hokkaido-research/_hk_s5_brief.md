# Hokkaido session-5 subagent brief (2026-10-03) — read `_hk_s4_brief.md` FIRST (all its rules apply), then this.

Changes for session 5:
- Existing places (never duplicate): `_hk_existing_names.txt` (area<TAB>F|S<TAB>name) — 435 rows, regenerated 2026-10-03.
  Restaurants still without a pin: `_hk_unpinned.txt` (area, F|S, name, sourced address).
- Your wave number/tag and focus are in your task prompt. Write `_w<NN>_<slug>.py` (from `_hk import S, F, emit`;
  end with `emit("W<NN>")`) and `_note_W<NN>.md`. Run the script after every ~5 places so work survives a cut-off.
- FOOD FIRST: ≥60% of what you add should be food & drink (restaurants, bars, breweries, distilleries, wineries, cafés,
  sweets/dairy shops, markets). Name the city's canon dish in `dish` and in `w`.
- SOURCE MIX (RUN §2a): every wave must also try ≥2 creator/viral queries (e.g. `"<town>" food youtube vlog`,
  `<town> グルメ youtuber`, `<town> tiktok 人気`) and one notable-travel-site query (Time Out, Lonely Planet, CNN, japan-guide,
  Savor-free). A creator counts once only if verifiably large; record creators in `CREATORS_HOKKAIDO_W<NN>.json`
  `{creators:[{key,name,platform,handle,url,scale,niche,credible}], attach:[{place,creatorKey,url}], rejected:[…]}`.
  Report per-channel counts in your note.
- KEY HYGIENE: MICHELIN*/UNESCO/BUNKACHO = the award/designation only; Michelin magazine features = `MICHELIN_EDITORIAL`
  (one ordinary source). Use existing source keys where they exist (RURUBU, MAPPLE, SAPPOROTRAVEL, HAKODATETRAVEL,
  OTARUTOURISM, HOKKAIDOTOURISM, OBIKAN, KUSHIROTOURISM, LAKETOYA, NISEKOTOURISM, JOZANKEITOURISM, JAPANGUIDE, TIMEOUT,
  WIKIPEDIA_JA, WIKIPEDIA, RAMENADVENTURES, GOODLUCKTRIP, HOKKAIDOSHIMBUN, OFFICIAL…). A NEW outlet key needs an entry in
  `SOURCES_HOKKAIDO_W<NN>.json` `{"outlets":[{key,name,url,credible:"<why>"}]}` (pass it via emit("W<NN>", outlets)).
- Anime field (only when a source ties the place to a franchise): `anime="<franchise — why>"`.
- Budget: ≤30 WebSearch calls (hard). Do NOT git add/commit/push, do NOT run rebuild-city, touch only your own files.
