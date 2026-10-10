# Voice — the butler who is also your local friend

> M0-05. Second person, sentence case, warm and specific, never salesy. The guide speaks only from data it holds.

## Rules

1. **Sentence case everywhere.** Tracked caps only for one eyebrow per block ("Area 6 of 13 · 44 places").
2. **Say what we know, and say what we don't.** "Hours and prices aren't in our data — check before you go." Never guess.
3. **Never manufacture urgency or popularity.** Lint list (build fails if any appears in beta output, case-insensitive):
   `trending`, `popular now`, `only \d+ left`, `hurry`, `selling fast`, `book now`, `don't miss out`, `limited time`, `best-selling`.
4. **"Your guide's note"** only when the record's `k` is prose (≥ 8 words and a full stop). Otherwise render **"Look for"** with
   the comma-separated keywords as tags. A butler never speaks in tags.
5. **Attribution words are fixed:** "Recommended by" (named sources) · "Added by the guide" (ADD/FADD — general knowledge,
   never relabelled as sourced) · "Everything {source} recommends in {city}" / "All n {city} picks citing {source}".
6. **Distinctions:** "Must see", "Worth the detour", "Deep cut" — always "in {area}" in titles and the sheet.
7. **Closed:** "Closed · kept for the record" + "per {statusSource}, checked {date}". Never "permanently closed!!", never hidden.
8. **Stated gaps quote the guide verbatim** and point to the closest qualifying place.
9. **Distances** are "straight-line" every time they appear.
10. Numbers are digits, computed; dates ISO (2026-10-02) in trust lines, words elsewhere.

## Microcopy

| Moment | Copy |
|---|---|
| 0 results | **No places match "{q}" in {area}.** Try all of {city} — {n} places match there. Filters never hide places for good. [Search all of {city}] |
| Nothing saved | **Nothing saved yet.** Tap the heart on any place. Your list lives on this device — no account needed. [Explore {city}] |
| Tiles failed | **The map couldn't load.** The list still has every place, address and source. We're showing map art from our own pins until tiles return. [Try again] |
| Offline | You're offline — the guide still works. Your list and every place's details are on this device; map tiles return when you reconnect. |
| Storage blocked | Storage is blocked here, so saves last until you close the tab. |
| Unknown deep link | **We couldn't find that place.** It may have been renamed. Here's {city} — every place is still listed. |
| Link copied | Link copied — it opens this exact view. |
| Picker promise | It puts those places first — all {n} places stay in the list and on the map. |
| Why first | First because: {interest} · {tier} in {area} |
| Day plan label | Suggested by the guide from sourced picks — check hours before you go. |
