# Pittsburgh — audit log

This file records sourcing passes for the Pittsburgh guide. The data itself lives in `tools/build-pittsburgh.py` (DATA block).

## 2026-10-17 — D-53: sourcing the "No independent source yet" cards

FE-B's D-53 render (QA-87) shows "No independent source yet" on any card whose only sources are the guide's general knowledge (ADD/FADD), the place's own site, or a rating platform. This pass looked for a credible independent recommender for each such card, using sequential `WebSearch` on 2026-10-17 and the merit bar in docs/SOURCES.md. **ADD/FADD is never relabelled.** A found source is *added* as a new per-article registry entry (`D53_<NAME>_<n>` in `S`/`FS`) next to the existing ADD/FADD key, so the card keeps saying the place was added by the guide and also names who independently recommends it. A record that found nothing keeps its honest label and is listed below.

| Place | Source(s) added | Note |
|---|---|---|
| PPG Paints Arena | [WIKIPEDIA](https://en.wikipedia.org/wiki/PPG_Paints_Arena) + [VISITPITTSBURGH](https://www.visitpittsburgh.com/directory/ppg-paints-arena-banquet-space/) |  |
| Fred Rogers Memorial statue | [POSTGAZETTE](https://post-gazette.com/ae/tv-radio/2018/05/04/Fred-Rogers-memorial-reopens-on-the-North-Shore-Pittsburgh/stories/201805040124) + [VISITPITTSBURGH](https://www.visitpittsburgh.com/blog/north-shore-memorials/) |  |
| PPG Place Wintergarden | [PGHMAG](https://www.pittsburghmagazine.com/your-ultimate-holiday-guide-to-family-fun-in-pittsburgh/) + [PGHCITYPAPER](https://pghcitypaper.com/specials-guides/winter-activities-for-getting-into-the-holiday-spirit-12006705) |  |
