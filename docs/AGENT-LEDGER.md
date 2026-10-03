# Agent ledger — city build-out run (2026-10-02 → 2026-10-03)

Consolidated record of every child session the orchestrator (session_01PCNcUkfa5S1N1BKGzZA4xx) launched, what each produced, and where
its audit trail lives. Source of truth for the chronology is [RUN-2026-10-02.md](RUN-2026-10-02.md) §9; the standard child prompt is
[CHILD-PROMPT.md](CHILD-PROMPT.md). Deployed via alvations/cleo-guide#2 (merge `91647ed`, 2026-10-03 08:18Z).

**Retirement:** every session below was idle with its work pushed and logged, and was **archived on 2026-10-03** at the user's
request ("retire them when they are no longer useful"). Archived sessions stay readable; any further work on a city starts a fresh
session from that city's `RESUME.md` + `docs/CHILD-PROMPT.md` — no agent holds state that isn't in the repo.

Status column = the session's final state before archiving (completed / review ready = finished its wave; blocked = finished but
waiting on the browser geocoder; failed = stopped by a usage limit, work superseded by a later wave).

**Archive check (2026-10-03, all 75 archived, 0 errors):** three records looked like possible loose ends; each was verified against the repo:
- `session_01RfKka7PrBWFE5roj3MLcKB` (Orlando W4, first attempt) reported "50 local commits not pushed". Those were stale copies from an
  out-of-date clone that the remote already had in newer form (e.g. Holland Village W1 `9dc5b47` is in the deployed head). Its task was
  redone by `session_016MSoK1ygKzRgo6eWGSCedU`. Nothing lost.
- `session_01BJXE8Nd68XJt2UQirC9Y6e` (Chicago W2) and `session_013SchN5xr8QFAgVqjZY37dr` (SF W3) ended "failed" on a usage limit after
  pushing incrementally; later waves superseded both (Chicago 510/510, SF 579/500).
- `session_01ECt8nbbQXGgxskj1179NHd` (Philadelphia W3) worked on a local branch named `philly-work` but merged it into the shared
  branch (`3767fe6`, in the deployed head); no `philly-work` branch exists on the remote.

## Per-city audit trail

| City | Final state | Audit trail | Page |
|---|---|---|---|
| Tokyo | 552/530 · 52% food · 488 pins · ANIME 38 | `data/tokyo-research/` — AUDIT.md, RESUME.md, _AGENT_BRIEF.md, consolidate.py, FOOD_/SIGHTS_/SOURCES_/CREATORS_ files, geo/ | `cities/tokyo.html` |
| Kyoto | 494/485 · 55% · 398 pins · ANIME 10 | `data/kyoto-research/` — AUDIT.md, RESUME.md, _AGENT_BRIEF.md, consolidate.py, FOOD_/SIGHTS_/SOURCES_/CREATORS_ files, geo/ | `cities/kyoto.html` |
| Osaka | 499/460 · 63% · 369 pins · ANIME 25 | `data/osaka-research/` — AUDIT.md, RESUME.md, _AGENT_BRIEF.md, consolidate.py, FOOD_/SIGHTS_/SOURCES_/CREATORS_ files, geo/ | `cities/osaka.html` |
| Okinawa | 513/510 · 58% · 425 pins · ANIME 19 | `data/okinawa-research/` — AUDIT.md, RESUME.md, _AGENT_BRIEF.md, consolidate.py, FOOD_/SIGHTS_/SOURCES_/CREATORS_ files, geo/ | `cities/okinawa.html` |
| Hokkaido | 515/500 · 53% · 412 pins · ANIME 29 | `data/hokkaido-research/` — AUDIT.md, RESUME.md, _AGENT_BRIEF.md, consolidate.py, FOOD_/SIGHTS_/SOURCES_/CREATORS_ files, geo/ | `cities/hokkaido.html` |
| Chicago | 510/510 · 56% · 367 pins (SW source-exhausted) | `data/chicago-research/` — AUDIT.md, RESUME.md, _AGENT_BRIEF.md, consolidate.py, FOOD_/SIGHTS_/SOURCES_/CREATORS_ files, geo/ | `cities/chicago.html` |
| Miami · Fort Lauderdale · Everglades | 509/500 · 65% · 325 pins | `data/miami-research/` — AUDIT.md, RESUME.md, _AGENT_BRIEF.md, consolidate.py, FOOD_/SIGHTS_/SOURCES_/CREATORS_ files, geo/ | `cities/miami.html` |
| Orlando & Central Florida | 522/517 · 56% · 387 pins | `data/orlando-research/` — AUDIT.md, RESUME.md, _AGENT_BRIEF.md, consolidate.py, FOOD_/SIGHTS_/SOURCES_/CREATORS_ files, geo/ | `cities/orlando.html` |
| Philadelphia | 519/500 · 66% · 363 pins | `data/philadelphia-research/` — AUDIT.md, RESUME.md, _AGENT_BRIEF.md, consolidate.py, FOOD_/SIGHTS_/SOURCES_/CREATORS_ files, geo/ | `cities/philadelphia.html` |
| Indianapolis | 217/210 · 65% · 156 pins | `data/indianapolis-research/` — AUDIT.md, RESUME.md, _AGENT_BRIEF.md, consolidate.py, FOOD_/SIGHTS_/SOURCES_/CREATORS_ files, geo/ | `cities/indianapolis.html` |
| Madison | 211/210 · 63% · 156 pins | `data/madison-research/` — AUDIT.md, RESUME.md, _AGENT_BRIEF.md, consolidate.py, FOOD_/SIGHTS_/SOURCES_/CREATORS_ files, geo/ | `cities/madison.html` |
| Akron · Kent · Canton | 207/210 · 59% · 150 pins (BARB/CANT/NSUM +1, source-exhausted) | `data/akron-research/` — AUDIT.md, RESUME.md, _AGENT_BRIEF.md, consolidate.py, FOOD_/SIGHTS_/SOURCES_/CREATORS_ files, geo/ | `cities/akron.html` |
| Harrisburg · York · Lancaster & Amish | 218/216 · 55% · 171 pins | `data/harrisburg-research/` — AUDIT.md, RESUME.md, _AGENT_BRIEF.md, consolidate.py, FOOD_/SIGHTS_/SOURCES_/CREATORS_ files, geo/ | `cities/harrisburg.html` |
| Liège | 153/145 · 60% | `data/liege-research/` — AUDIT.md, RESUME.md, _AGENT_BRIEF.md, consolidate.py, FOOD_/SIGHTS_/SOURCES_/CREATORS_ files, geo/ | `Belgium/` |
| Singapore towns (Punggol, Balestier, Novena & Newton, Holland Village) | NVN 56/55 · BLS 56/55 · HLV 57/55 live; PGL 63/93 (source-exhausted) | `data/singapore-research/` — AUDIT.md, RESUME.md, _AGENT_BRIEF.md, consolidate.py, FOOD_/SIGHTS_/SOURCES_/CREATORS_ files, geo/ | `Singapore/` |
| San Francisco & Peninsula | 579/500 · 63% food (see its RESUME.md) | `data/san-francisco-research/` — AUDIT.md, RESUME.md, _AGENT_BRIEF.md, consolidate.py, FOOD_/SIGHTS_/SOURCES_/CREATORS_ files, geo/ | `cities/sanfrancisco.html` |

Shared: `data/sources.json` (outlets + creators with credibility rationale), `data/geocodes.json` (every coordinate + source + confidence +
open/closed status), `docs/CITIES.md` (one row per city), `docs/AGENT-PROMPTS.md` (per-pass run log + lessons), `docs/RESEARCH-LOG.md`,
`docs/GEOCODE-BACKLOG.md` (unpinned places for `tools/geocode-helper.html`).

## Sessions by city

### Tokyo (4 sessions)

| Session | Wave | Started (UTC) | Final status | Outcome (session's own summary) |
|---|---|---|---|---|
| `session_01LAuhxLaLAzdSvGcQzPqjNj` | Tokyo map — build-out wave (fresh search budget) | 2026-10-02 02:10 | completed | Tokyo patch: 387 places (382 on map); gates/tests pass; 8 pins checked; merges clean |
| `session_01VQaxQ69L5PmZRFY3PnAJQQ` | Tokyo map — wave 5 (food & drink + anime) | 2026-10-02 13:13 | review ready | Tokyo: 387/433 on map; anime agent recheck complete, no new data |
| `session_01S4xkEp3ybvSczLJTRuA3Xb` | Tokyo map — wave 6 (food & drink + anime) | 2026-10-02 13:47 | completed | Tokyo map: 387 placed, 4 gates green, food 42% → 50%; worklist + resume ready |
| `session_01LvabJcJR7Zay1SoN8gzwc7` | Tokyo map — finishing pass (last 9 + pins) | 2026-10-02 18:17 | completed | Tokyo map complete: 411 on map, all 4 gates green, 111 unpinned logged |

### Kyoto (3 sessions)

| Session | Wave | Started (UTC) | Final status | Outcome (session's own summary) |
|---|---|---|---|---|
| `session_01529pjNXXLd3c1DecKLpnXY` | Kyoto map — build-out wave (fresh search budget) | 2026-10-02 03:44 | completed | Kyoto map: 237 places, 162 searches, sourced & geocoded |
| `session_01QTJJ52XNcV6K8ZgX6YNXCd` | Kyoto map — wave 2 (food & drink + anime) | 2026-10-02 13:14 | review ready | 229/485 discovered, 216 on map; 4 gates green; food share 31%; W4 plan queued |
| `session_01Vy9fNhtKKodiDfsRzbRYMP` | Kyoto map — wave 3 (food & drink + anime) | 2026-10-02 18:17 | completed | Kyoto map: 339/494 discovered (211 sights + 128 food); all gates green |

### Osaka (6 sessions)

| Session | Wave | Started (UTC) | Final status | Outcome (session's own summary) |
|---|---|---|---|---|
| `session_01XvYRbeZ47cQbq5nVywGiJs` | Osaka map — build-out wave | 2026-10-02 03:46 | review ready | Searching Japanese Wikipedia for 3 coordinates at a time found all 3 every time. |
| `session_017NmDS54H7jMsJEAMQJu3Pi` | Osaka map — wave 2 (food & drink + anime) | 2026-10-02 13:47 | completed | Osaka map: 172 on map, 199 discovered; Michelin Minami exhausted, corrections made, next wave planned |
| `session_01VEkLdVBGjnbcJ2ScmoZKZS` | Osaka map — wave 3 (food & drink + anime) | 2026-10-03 01:04 | review ready | Osaka map: 319/460 discovered, 266 pinned; Minami +38, need Japanese sources & geocoding |
| `session_01GoWK96VV9UAQBzyP6sU87e` | Osaka map — wave 5 | 2026-10-03 01:41 | completed | Osaka research wave 4 complete: 28 new places, food+anime layers expanded, all validation green |
| `session_01LfJa7s4pxTnt8YGN3xbmGg` | Osaka map — wave 6 | 2026-10-03 02:09 | review ready | wave 6 summary complete; 436 found, 309 pinned; pinning worker next |
| `session_01KR6ci9VHSkrtDUkyPaiNTj` | Osaka map — wave 7 | 2026-10-03 02:32 | review ready | Osaka wave 7 done: 499 places, 369 pinned, anime 34; next wave queued |

### Okinawa (9 sessions)

| Session | Wave | Started (UTC) | Final status | Outcome (session's own summary) |
|---|---|---|---|---|
| `session_01BVM3HpzTBSJm99i3RbcN79` | Okinawa map — build-out wave | 2026-10-02 03:46 | review ready | Okinawa map: 126 pins live, 45 held for geocoding, next: coordinate batch |
| `session_01PSbfUPyakv51bzvuzCKCTz` | Okinawa map — wave 2 (food & drink + anime) | 2026-10-02 13:14 | review ready | Okinawa map: 119/510 discovered, 74–126 on map, food 22%; plan next in RESUME.md |
| `session_0169a1tLEUqiQ74m84fvoJvB` | Okinawa map — wave 3 (food & drink + pins + anime) | 2026-10-02 18:17 | completed | Okinawa map: 89→102 pins (20% food, 6 anime, 4 gates); 129 unpinned; search budget exhausted |
| `session_01VjDaZF1gYJz6K7mqkAHid2` | Okinawa map — wave 4 (pins + food & drink + anime) | 2026-10-03 01:04 | completed | Okinawa wave 5: 302 researched, 183 pinned; search budget exhausted |
| `session_01QxMEfRBY8jBHsecT9JCdAc` | Okinawa map — wave 6 | 2026-10-03 01:41 | review ready | wave 7 complete: 41 new places added; 98 low pins flagged for re-check; next: confirm 20 held, discover 85 Naha/Chūbu |
| `session_01ArZFSzKcMbcHeXLyDAXfRU` | Okinawa map — wave 7 | 2026-10-03 02:09 | review ready | wave 7 complete: 378 food/drink, +35 places, 16 anime; wave 8 queued (held leads + Nago manhole + Koza steak discovery) |
| `session_01Df9Wi2VqyzsSc7XCRZBEQz` | Okinawa map — wave 8 | 2026-10-03 02:32 | review ready | Wave 8 complete: 344 pins across 7 areas (target 410); 184/200 search budget; Wave 9 plan documented |
| `session_012LmRFpCmy9XHMHT66hkzS3` | Okinawa map — wave 9 | 2026-10-03 06:25 | review ready | W9 complete: 451 places, 378 pinned; 73 need browser geocoder; W10 plan in RESUME.md |
| `session_01SNdRN4VTyvqgJyuKThEgUA` | Okinawa map — wave 10 | 2026-10-03 07:00 | completed | Okinawa wave 10: 408 places, 273 pinned, 35 held; W11 is geocoding phase |

### Hokkaido (4 sessions)

| Session | Wave | Started (UTC) | Final status | Outcome (session's own summary) |
|---|---|---|---|---|
| `session_0176EP1XAbSx4MjoDR53xRGF` | Hokkaido map — build-out wave | 2026-10-02 03:46 | review ready | Hokkaido map: 192/400 places pinned; food weak spot; 188 searches used |
| `session_01GZeRYqkVX6UWLqgqfQfJXu` | Hokkaido map — wave 2 (food & drink + anime) | 2026-10-02 13:14 | completed | Hokkaido map: 132 placed, 4 gates green, food 26%→need pin helper |
| `session_01CoPiPP5PAGXtRZ97Shyztk` | Hokkaido map — wave 3 (food & drink + pins + anime) | 2026-10-02 18:17 | review ready | 334/500 discovered, 189 pinned; geocoder next + anime wave 3 |
| `session_01XrTRpGPSBEARBki8TPmMDm` | Hokkaido map — wave 4 (pins + food & drink + anime) | 2026-10-03 01:04 | review ready | hokkaido: 435 discovered, 252 pinned; audit: anime +12, weak spots logged, resume queued |

### Chicago (4 sessions)

| Session | Wave | Started (UTC) | Final status | Outcome (session's own summary) |
|---|---|---|---|---|
| `session_018ijTCyxMASSXrD1dHkYpEz` | Chicago map — build-out wave | 2026-10-02 03:46 | completed | Chicago map: 45 food + 40 sights pinned, 29 restaurants backlogged, geocoding lessons logged |
| `session_01BJXE8Nd68XJt2UQirC9Y6e` | Chicago map — wave 2 (food & drink first) | 2026-10-02 13:15 | failed | You've hit your session limit · resets 6:10pm (UTC) |
| `session_01SAHR99C4HDxxG1gtwR3s5D` | Chicago map — wave 3 | 2026-10-03 01:41 | completed | Chicago added: 93 food/drink + 27 sights; 187 unpinned remain |
| `session_01JcADqu8wJf489GkfX1PKk6` | Chicago map — wave 4 | 2026-10-03 02:32 | completed | 318 places on map (206 sights + 112 food); 8 short of target; gates pass |

### Miami · Fort Lauderdale · Everglades (4 sessions)

| Session | Wave | Started (UTC) | Final status | Outcome (session's own summary) |
|---|---|---|---|---|
| `session_01EqQisNPCjTPtL94eMjjSxi` | Miami · Fort Lauderdale · Everglades map — build-out wave | 2026-10-02 04:13 | completed | Miami map: 246 pins placed, 9 areas below target; search budget exhausted |
| `session_011WhyqJrfkZKDGQ1bVqMRyN` | Miami · Fort Lauderdale · Everglades — wave 2 | 2026-10-02 13:47 | review ready | Miami map 166/500 discovered, 71 pinned; 5 agents placed sights, 210 searches done |
| `session_01Y5DtVtNLvyEFDUG6fQtN8Q` | Miami · Fort Lauderdale · Everglades map — wave 3 | 2026-10-03 01:41 | completed | Miami–Fort Lauderdale–Everglades: 370+ restaurants pending geocode; audit & merge bug fixed |
| `session_0123ZsRqMCQtqDcWJuoKMgB1` | Miami map — wave 4 (pins) | 2026-10-03 02:32 | completed | Miami map: 261 pins, 1 swap (Cotoa flagged); all gates & tests pass |

### Orlando & Central Florida (7 sessions)

| Session | Wave | Started (UTC) | Final status | Outcome (session's own summary) |
|---|---|---|---|---|
| `session_01JKB6LSfF2xnWcfnPpVo84q` | Orlando & Central Florida map — build-out wave | 2026-10-02 04:13 | completed | Orlando map: 517 targets researched, geocoded, validated; commit+push to branch |
| `session_012bLityogWkWYCmzcWBXNkd` | Orlando map — wave 2 (food & drink first) | 2026-10-02 13:15 | completed | Orlando map: 208 discovered, 142 mapped; gates green except 9 single-source; logged next session |
| `session_015uNQnwbrW5b44sKxpEXCpm` | Orlando & Central Florida map — wave 3 | 2026-10-03 01:41 | completed | wave 3 complete: 35 food places pinned, 190 held; closures logged, sources vetted |
| `session_01RfKka7PrBWFE5roj3MLcKB` | Orlando & Central Florida map — wave 4 | 2026-10-03 02:09 | completed | orchestrator stop signal; session complete, no push needed |
| `session_016MSoK1ygKzRgo6eWGSCedU` | Orlando & Central Florida map — wave 4 (fresh) | 2026-10-03 02:33 | completed | wave 4 complete; 471 places found, 226 on map, gates green |
| `session_01VsEzF82NLzh1ivd2MR2MVT` | Orlando & Central Florida map — wave 5 | 2026-10-03 06:12 | review ready | wave 5: 316 pinned; 12 under-target spots added; status closures logged |
| `session_014dzA4W8xoPEUzDSWEswASU` | Orlando & Central Florida map — wave 6 | 2026-10-03 07:00 | review ready | orlando-fl map: 41 new pins, 5 closures closed, 149 unverified |

### Philadelphia (5 sessions)

| Session | Wave | Started (UTC) | Final status | Outcome (session's own summary) |
|---|---|---|---|---|
| `session_019KaAPmW11ZF61WwC8VovBn` | Philadelphia map — build-out wave | 2026-10-02 03:46 | review ready | Philadelphia map 56% done; 15 sights pinned, 11/61 restaurants geocoded |
| `session_013h32337aVQ9QKB7DKgSPdW` | Philadelphia map — wave 2 | 2026-10-02 04:13 | completed | 297 places mapped, 4 gates green; 230 pins + 88 checks remain |
| `session_01ECt8nbbQXGgxskj1179NHd` | Philadelphia map — wave 3 (food & drink first) | 2026-10-03 01:04 | blocked | 423/500 discovered; 170 pinned; needs browser geocoder for ~250 restaurants |
| `session_01MqoZKuTGYq8oSdEz2K3dLu` | Philadelphia map — wave 5 (pins first) | 2026-10-03 01:41 | completed | Philadelphia wave complete: 62 places added, 336 backlog, next steps queued |
| `session_01DsVQh4xSMpquswxCXqQqid` | Philadelphia map — wave 6 (pins via Apple Maps) | 2026-10-03 06:12 | review ready | Philadelphia map: 276 pins (238 high, 38 med), 242 unpinned; moving to browser geocoder next |

### Indianapolis (3 sessions)

| Session | Wave | Started (UTC) | Final status | Outcome (session's own summary) |
|---|---|---|---|---|
| `session_014fZvXEgNJnEnQYo2WV7ohZ` | Indianapolis map — wave 1 | 2026-10-03 02:09 | blocked | 44 unpinned restaurants need browser geocoder; awaiting user to run tools/geocode-helper.html |
| `session_016SHA4Zbgb16N2M7n7DJVAA` | Indianapolis map — wave 2 | 2026-10-03 06:33 | completed | Indianapolis map: 150 venues (81 food), 6 areas at target, audit + commit done |
| `session_01MnAUfd38BSLQ34gPnZXjRW` | Indianapolis map — wave 3 | 2026-10-03 07:00 | review ready | 215 places sourced (141 food), 67 pinned; 76 awaiting coords |

### Madison (4 sessions)

| Session | Wave | Started (UTC) | Final status | Outcome (session's own summary) |
|---|---|---|---|---|
| `session_012UuF7rf1Vf8W7MMXhJxyfM` | Madison, Wisconsin map — wave 1 | 2026-10-03 02:09 | completed | Madison food/sights map built; 19 restaurants unverified, closures flagged |
| `session_017mde4NB6C7tifD9WFtuFgm` | Madison, Wisconsin map — wave 2 | 2026-10-03 02:32 | review ready | W4/W5 commits pushed, all 4 gates passing, clean tree |
| `session_01D3bVUrTLP12L7PnmpPUDcB` | Madison, Wisconsin map — wave 3 | 2026-10-03 07:01 | completed | madison-wi: 29 pins added (37 high-grade, 14 med); 42 unpinned; next wave planned |
| `session_01Rjg6M4XRHgN3TEY1BpEFYX` | Madison, Wisconsin map — wave 4 | 2026-10-03 07:29 | completed | madison-wi map: 156 pins (up 16), 211 places researched, all gates pass |

### Akron · Kent · Canton (6 sessions)

| Session | Wave | Started (UTC) | Final status | Outcome (session's own summary) |
|---|---|---|---|---|
| `session_013rKpHFyTQ3hhs9prL8hK5V` | Akron · Kent · Canton map — wave 1 | 2026-10-03 02:09 | completed | Akron map: 78 places live, 4 gates pass, npm validate/test green |
| `session_018qGTgyuZtU3T8Dosod3Aks` | Akron · Kent · Canton map — wave 2 | 2026-10-03 02:32 | completed | Akron map: 76 places added, all gates pass, branch ready |
| `session_01JaX7QMjesUczQRp8UWZFEi` | Akron · Kent · Canton map — wave 4 | 2026-10-03 06:28 | review ready | 79 of 124 places found (64%); 30 hidden pending geocode; resume.md + audit trail logged |
| `session_01VFis4npwifcA8YKMo7LMEy` | Akron · Kent · Canton map — wave 5 | 2026-10-03 07:01 | completed | W6 research complete: 27 sights + 23 food added; 38 unpinned; plan in RESUME.md |
| `session_014PnjhhdSU9Y6LMs24Soex9` | Akron · Kent · Canton map — wave 6 | 2026-10-03 07:29 | completed | akron-oh map: 27 new places added, 4 gates + tests pass |
| `session_01Queyo5GW2TK7SoB6ytbm4n` | Akron · Kent · Canton map — wave 7 (finish) | 2026-10-03 07:56 | review ready | food places + sights added; 3 areas short; W8 geocoding plan set |

### Harrisburg · York · Lancaster & Amish (3 sessions)

| Session | Wave | Started (UTC) | Final status | Outcome (session's own summary) |
|---|---|---|---|---|
| `session_01YAP3BYkZ5hKmvtgXiwyxzx` | Harrisburg · York · Lancaster & Amish map — wave 1 | 2026-10-03 02:09 | review ready | Pushing meant merging other sessions' work twice; I regenerated the backlog doc and kept both rows where CITIES.md conflicted. |
| `session_01MjBZJmVPTEPASWdxECDdFx` | Harrisburg · York · Lancaster & Amish map — wave 2 | 2026-10-03 06:29 | review ready | researched 51 food places in PA (Lancaster/Gettysburg/York/Carlisle); 37 pinned, 73 unpinned, 4 merged; next: pin remainders + grow Lancaster/Harrisburg |
| `session_014zSqoUsvHc6U5mJKtpL7hf` | Harrisburg · York · Lancaster & Amish map — wave 3 | 2026-10-03 07:01 | review ready | 218 places discovered (120 food); 58 pinned, 62 unpinned; all gates pass |

### Liège (1 sessions)

| Session | Wave | Started (UTC) | Final status | Outcome (session's own summary) |
|---|---|---|---|---|
| `session_01A6SS21s3WqzwS1j5rNVBMH` | Liège map — build-out wave | 2026-10-02 03:46 | completed | Liège map complete: 99 places, 51 high/48 medium confidence, committed to branch |

### Singapore towns (Punggol, Balestier, Novena & Newton, Holland Village) (3 sessions)

| Session | Wave | Started (UTC) | Final status | Outcome (session's own summary) |
|---|---|---|---|---|
| `session_01RhksAf2Cb3EWdvdtQY1wvY` | Singapore towns — Punggol, Balestier, Novena-Newton, Holland Village | 2026-10-02 03:46 | review ready | 4 Singapore towns: Punggol 38%, others 65-85%; held for geocoder |
| `session_0146eGBHtRd2wVu6gkv4Byeb` | Singapore Punggol + Novena & Newton — next wave | 2026-10-03 01:41 | review ready | Punggol/Novena research: 46 places mapped, 17 held; pinning 3 buildings next |
| `session_01VghHmPxC9xzqHpPKHK8sUn` | Singapore Punggol + Novena — wave 3 | 2026-10-03 02:32 | completed | Punggol search concluded at 63/93; session report sent to orchestrator |

### San Francisco & Peninsula (4 sessions)

| Session | Wave | Started (UTC) | Final status | Outcome (session's own summary) |
|---|---|---|---|---|
| `session_01PWSST1HmupcfRDUu6Q3ZxX` | San Francisco map — audit, re-rank, re-verify & expand (PRIORITY) | 2026-10-02 13:40 | review ready | SF map audited (236 pins, 62% food, 8 source fixes); 25 held pending geocode |
| `session_0159tKUL6tQ8pvUJRBHa67Nx` | San Francisco map — wave 2 expansion (PRIORITY) | 2026-10-02 14:26 | completed | SF map wave 2 complete: 13 new pins, 552 total; food 67% avg |
| `session_013SchN5xr8QFAgVqjZY37dr` | San Francisco map — wave 3 expansion (PRIORITY) | 2026-10-02 15:19 | failed | You've hit your session limit · resets 6:10pm (UTC) |
| `session_01Hg5dmhczkVf2CSHxgwBCVu` | San Francisco map — wave 2 (PRIORITY, food & drink first) | 2026-10-02 18:17 | completed | SF map audit complete: 579 places, 343 high pins, 63% food, all gates pass |

### Follow-up sessions (after deploy)

| Session | Task | Started (UTC) | Final status | Outcome |
|---|---|---|---|---|
| `session_01DpemyawneXmB7YPoPQhDWv` | Singapore gap-fill — Balestier pins + Punggol | 2026-10-03 09:55 | completed, archived | Balestier pins 5→49, Punggol 29→48 (places 63→65); both LIVE; 0 places removed |
| `session_011cSHJwH2jx8M9RXKJBJ6Ds` | Site-wide QA, mobile + desktop | 2026-10-03 09:56 | running | — |
| `session_019cuMgwoxChA7ZDeYk9WCji` | UI/UX redesign proposals for owner review | 2026-10-03 10:02 | running | — |

### Cross-city pin and top-up passes (5 sessions)

| Session | Wave | Started (UTC) | Final status | Outcome (session's own summary) |
|---|---|---|---|---|
| `session_01EyztEP1R9DpmZ8Y3s3PbVk` | Top-ups — Liège LIE + Hokkaido NSK/SPR | 2026-10-03 02:32 | review ready | **Next:** both RESUME files have the plan. For Hokkaido, about 50 more NAVITIME searches should clear most of the 118 held pins. For Liège, the last 8 pins can go through `tools/geocode-helper.html`,  |
| `session_01Vw83p7q4p9uDVLjFYPL7MJ` | Top-up — Chicago last areas + Indianapolis FSQ + pins | 2026-10-03 07:29 | review ready | Chicago +49 pins, Indianapolis +17; 204 unpinned remain; closure checks pending |
| `session_01847XyVQRMAQiVAHDWpaEmS` | Pins — Philadelphia + Miami (Apple Maps retries) | 2026-10-03 07:29 | completed | mapped 363 Philly + 325 Miami pins; 200-search limit hit; leads logged |
| `session_01MSLcGPNe5T99YMT5ijECRS` | Pins — Tokyo + Kyoto + Hokkaido | 2026-10-03 07:29 | completed | pinned 402 city entries across Tokyo/Kyoto/Hokkaido; docs updated |
| `session_014tccsddAZhWkWHE1pGLan6` | Pins — Orlando + Okinawa + Harrisburg | 2026-10-03 07:29 | review ready | map pins: 182 web lookups, Harrisburg/Orlando/Okinawa coords placed; Gettysburg closure flagged |

## Totals

- Sessions: **75** (72 launched by the orchestrator; 3 San Francisco sessions launched from the Chicago wave-2 session at the user's request).
- Final states before archiving: completed 38, review ready 33, failed 2, blocked 2.
- Lessons that became rules (in CHILD-PROMPT.md / AGENT-PROMPTS.md): one cloud session per city (the 200-search cap is per session);
  cap concurrency at ~6 (11 at once hit the five-hour limit); sync with `git pull --no-rebase`, never reset/force-push; Apple Maps /
  OneMap / NAVITIME / MapFan pin channels; city-unique helper filenames; lone-authority key hygiene (JBF_EDITORIAL / MICHELIN_EDITORIAL).
