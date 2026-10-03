# W5 subagent rules (Okinawa) — addendum to `_okinawa_w4_agentrules.md` (read that FIRST, fully; it still binds)

Date 2026-10-03. Everything in the W4 rules applies (own tagged files only, no git, no shared files, never fabricate,
never `/@`/centroids/memory, ≥2 credible sources, append in batches of ~5 via `_okinawa_add.py`, notes file at the end).
W5 additions:
- **Search cap:** your task names it. The session-wide cap is shared with ~7 sibling agents — on any "limit/cap" error,
  stop at once, save, write notes, report.
- **Productive pin patterns (W4 lessons):** (1) WebSearch mode **extended**, ONE place per query:
  `<日本語名> wikipedia 座標` (sights → high); (2) `site:travel.navitime.com <日本語名>` / `<日本語名> navitime 緯度 経度`
  (venue page → med); (3) restaurants: extended `"<English name>" <town> tripadvisor latitude longitude` → listing
  coordinate graded **low** (AUDIT policy W4: accept only if consistent with the sourced street address; name the
  aggregator in geoSource; reject if inconsistent); (4) Stars and Stripes printed GPS (high/med); Michelin venue pages.
  Mapion / hotpepper / gnavi / retty / tabelog pages printing the venue's lat/lng also = low (coordinate only; never a
  recommender). Batched multi-name queries rarely work.
- **Status (4c):** every place you touch gets status + statusSource (a current page with hours/open info, or closure
  news). A place you never reached: do NOT write a record for it.
- **Key hygiene:** `MICHELIN` = star/Bib/selection only; Michelin magazine/travel articles = `MICHELIN_EDITORIAL`
  (ordinary source). Same for `UNESCO` vs editorial.
- **Source mix (RUN §2a):** every discovery wave must also try creators (YouTubers/TikTok/Instagram/bloggers with a
  verifiable large following and a findable post naming the place) — ≥2 searches; record kept AND rejected in
  `CREATORS_OKINAWA_<TAG>.json`. A creator is one corroborating source, never enough alone.
- **Don't duplicate:** check `data/okinawa.dataset.json` (P and F names) AND every `FOOD_/SIGHTS_OKINAWA_W5*.json`
  sibling file right before appending (siblings run concurrently). Read held leads in `_okinawa_w3_notes.md`,
  `_okinawa_W4D*_notes.md`, RESUME.md "Next actions" first — pairing a held lead with a 2nd source is the cheapest win.
