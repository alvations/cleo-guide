# W7 subagent rules (Okinawa) — addendum. Read `_okinawa_w4_agentrules.md` FIRST (binds), then `_okinawa_w5_agentrules.md`,
then `_okinawa_w6_agentrules.md` (both bind), then this.

Date 2026-10-03. W7 additions:
- **Search cap = the number in your task.** The ~200-call session cap is shared with 7 sibling agents; on any
  "limit/cap" error stop at once, save, write notes, report.
- **Search in Japanese AND English** (≥1/3 of discovery queries in Japanese; cite the native source).
- **Held leads first.** Each held lead in RESUME "Next actions" / `_okinawa_W6D*_notes.md` is ONE confirm search from kept.
- **Re-verify (CLAUDE.md 4b):** an upgrade record for an existing pin uses the EXACT existing name (`n`), the same
  address, and a coordinate from a better source (Wikipedia/ja.wiki infobox → high; official site map embed / Google
  `!3d!4d` place pin / navitime venue page → med). If the better point is >150 m from the current `low` point, say so
  in `geoSource` ("moved NNN m"). If the search only re-surfaces the same aggregator coordinate, write NOTHING for that
  place (keep the existing low pin) — never write a record with the same or lower confidence. If evidence shows the
  current pin is WRONG (different building/town) and no better point is found, write `confidence:"UNVERIFIED"` with the
  reason (the merge keeps verified pins over unverified ones, so ALSO list it under "WRONG PINS" in your notes for the
  orchestrator).
- **Food & drink ≥55 % of what discovery agents add** (Naha area already 63 % food — Naha SIGHT additions are welcome
  from the sights agent only; Chūbu additions are food & drink ONLY).
- **Anime records** carry `"anime": "<franchise — why it matters>"` and need ≥2 credible sources (Japan Anime Tourism
  Association 88 list = one; official franchise/municipal page = OFFICIAL, counts once).
- Do not duplicate: check `data/okinawa.dataset.json` P/F names AND every `FOOD_/SIGHTS_OKINAWA_W7*.json` sibling right
  before appending.
