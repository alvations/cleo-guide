# FE-B surfaces — photo-less media slots (owner: "too many blanks")

Probe: `cd tools && node beta/feb-blanks.js [out.json]` (needs `python3 -m http.server 8765 -d <repo>`). Head 7012bbc38, light.
A slot is a card's media box or a cover. **p** = a loaded photo, **a** = motif / glyph art (no photo), **b** = empty.
"First 24" = the first 24 slots in document order (lazy images scrolled into load first).

| Page | Width | First screen p / a / b | First 24 p / a / b | Full-bleed empty | Bare word in a slot |
|---|---|---|---|---|---|
| Landing | 390 | 4 / 1 / 0 | 22 / 1 / 1 | 0 | — |
| Landing | 1440 | 7 / 1 / 0 | 23 / 1 / 0 | 0 | — |
| Japan hub | 390 | 2 / 0 / 0 | 8 / 9 / 0 | 0 | country cards: Singapore, Vietnam, Germany, Belgium |
| Japan hub | 1440 | 4 / 0 / 0 | 9 / 8 / 0 | 0 | same |
| Singapore hub | 390 / 1440 | 3–4 / 0 / 0 | 9 / 8 / 0 | 0 | country cards: Vietnam, Germany, Belgium, Japan |
| Vietnam hub | 390 / 1440 | 0 / 4–5 / 0 | 5 / 7 / 0 | 0 | Hanoi (twice: Singapore/hanoi.html and Vietnam/hanoi.html), country cards |
| What changed (Tokyo) | both | no media slots | — | 0 | — |
| Guidebook (Tokyo, Cleveland, Punggol) | both | 1 / 0 / 0 | 2 / 0 / 0 (mounted chapters) | 0 | — |
| Insights (same three) | both | no media slots | — | 0 | — |

Where the non-photo slots are:
- **Hubs, "Known for" themes** (8 per hub: Anime, Temples, Ramen, Fine dining, UNESCO, Onsen…): motif art covers, no photo.
- **Hubs, other-country cards** (bottom): a motif cover whose only text is the country name — the "bare word" pattern.
- **Landing, Singapore town cards** (lower in the list: Ang Mo Kio, Potong Pasir–MacPherson, Upper Serangoon, Punggol,
  Newton–Novena, Balestier…): no photo yet (one falls inside the first 24 at 390).
- **Vietnam hub:** no photos by rule (no freedom of panorama), so its hero and cards are art.

No full-bleed empty cover anywhere on these surfaces; no bare cuisine word. Fix path: DESIGN-SYSTEM §v2.7b card variants
(FE-A's shared A compact row / B quote card) for the theme and country cards, and photos for the Singapore towns (imagery).
