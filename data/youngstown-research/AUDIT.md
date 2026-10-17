# Youngstown — audit log

This file records sourcing passes for the Youngstown guide. The data itself lives in `tools/build-youngstown.py` (DATA block).

## 2026-10-17 — D-53: sourcing the "No independent source yet" cards

FE-B's D-53 render (QA-87) shows "No independent source yet" on any card whose only sources are the guide's general knowledge (ADD/FADD), the place's own site, or a rating platform. This pass looked for a credible independent recommender for each such card, using sequential `WebSearch` on 2026-10-17 and the merit bar in docs/SOURCES.md. **ADD/FADD is never relabelled.** A found source is *added* as a new per-article registry entry (`D53_<NAME>_<n>` in `S`/`FS`) next to the existing ADD/FADD key, so the card keeps saying the place was added by the guide and also names who independently recommends it. A record that found nothing keeps its honest label and is listed below.

| Place | Source(s) added | Note |
|---|---|---|
| Wick Park | [Wikipedia (Wick Park Historic District, NRHP 1990)](https://en.wikipedia.org/wiki/Wick_Park_Historic_District) |  |
| McDonough Museum of Art | [Business Journal Daily](https://businessjournaldaily.com/four-new-exhibits-at-the-mcdonough-museum/) |  |
| DeYor Performing Arts Center (Powers Auditorium) | [Wikipedia (Powers Auditorium, NRHP 1980)](https://en.wikipedia.org/wiki/Powers_Auditorium) |  |
| National McKinley Birthplace Memorial & Museum | [Wikipedia](https://en.wikipedia.org/wiki/National_McKinley_Birthplace_Memorial) + [Clio](https://theclio.com/entry/25013) |  |
| Handel's Homemade Ice Cream | [WFMJ (80th anniversary)](https://www.wfmj.com/story/52935914/handels-ice-cream-and-yogurt-marking-its-80th-birthday-with-a-community-celebration) | FLAG address: record = 7485 South Ave, Boardman but text says 'the original South Side stand'; original per Handel's/WFMJ = 3931 Handel's Ct, Youngstown. Check which store is meant + pin. |
| Birdfish Brewing Co. | [Farm and Dairy](https://www.farmanddairy.com/?p=568579) + [WFMJ (10 years)](https://www.wfmj.com/story/53259637/birdfish-brewing-company-celebrates-a-decade-of-beer) |  |
| Covelli Centre | [Wikipedia](https://en.wikipedia.org/wiki/Covelli_Centre) + [Tribune Chronicle (20 years)](https://www.tribtoday.com/news/local-news/2025/10/covelli-centre-turns-20/) |  |
