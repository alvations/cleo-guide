# Silicon Valley — RESUME checkpoint (read this first)

Single source of truth for **where the SV build is and what to do next**. Any agent — this session,
a scheduled wake, or a brand-new session — resumes deterministically by reading, in order:
1. **this file** (state + next actions),
2. [`AUDIT.md`](AUDIT.md) (the audited pipeline trail — how each stage was done),
3. [`_PENDING_LEADS.md`](_PENDING_LEADS.md) (vetted-but-unfinished leads),
4. the task list (tasks #23 geocode/build, #24 creators, #25 expansion).

Then run `cd data/silicon-valley-research && python3 consolidate.py` to see the live count.

## Design goal (NYC parity) — acceptance criteria
**500 is a YARDSTICK, not a goal.** The real bar is quality: every place **notable / authentic /
hidden-gem / popular / viral / iconic — and above all CREDIBLE.** Never pad to a number; prune or hold
anything not credibly sourceable. Density comparable to NYC is the aim, reached only through places that
clear the bar. See `_AGENT_BRIEF.md` for the full source palette + rules.
- [ ] **NYC-comparable density** across all 7 areas and every cuisine/collection — via credible places only.
- [ ] **Every place fact-checked** — open/closed verified from a real source; notability confirmed;
      closures kept-but-flagged, non-places excluded.
- [ ] **Every place credibly sourced — NO Yelp-only recommenders in the final set.** Yelp/TripAdvisor are
      open-verification ONLY. Each place must carry ≥1 source from: Michelin/James Beard · Infatuation/KQED ·
      Metro Silicon Valley/San José Spotlight/The Six Fifty/Palo Alto Online/MV Voice · NBC Bay Area/ABC7 ·
      Atlas Obscura/official · or a **vetted creator**. Upgrade every entry in `_yelp_only_food.txt`.
- [ ] **Every place location-verified** — exact place pin in `data/geocodes.json`, or queued in the helper.
- [ ] **Built + gated** — `build-siliconvalley.py`; geocheck PASS · statuscheck CONSISTENT · validate
      DATA OK · npm test ALL PASS · headless render-verify (Leaflet mounts, markers>0, 0 errors).
- [ ] **Audit complete** — every stage recorded in `AUDIT.md` so it is reproducible.
- [ ] `index.html` card counts finalized; page live in the chooser.

## State (update this block every wave)
- **Last updated:** 2026-08-14, wave 3 (food+sights) complete; creator pass still running.
- **Consolidated total: 285 places** (110 sights + 175 food). Waves 1 (110) + 2 (+101) + 3 (+74:
  MEXICAN 19, AMERICAN 16, PERSIAN_VN2 16, SIGHTS_DEEP 23).
- **Sourcing:** credible palette expanded (Metro SV, San José Spotlight, Six Fifty, PA Online, MV Voice,
  NBC Bay Area, ABC7, James Beard). BUT waves 1–3 predate `_AGENT_BRIEF.md`, so many food entries are
  still Yelp-only → **re-sourcing wave (task #26)** must upgrade/prune them; refresh `_yelp_only_food.txt`.
- **Remaining gaps** (quality-first, 500 is a yardstick): breweries/wineries/cocktail bars, more seafood,
  wine-country day trips, per-subregion food depth; then re-source + creators + geocode + build.
- **Geocoded:** 0 — all 285 queued in `tools/geocode-helper.html`.
- **Built:** no (held until pins exist + Yelp-only resolved).

## Next actions, in order (resumable)
1. **Finish wave 2:** when CHINESE2 / KRJPSEA / CAFES_BOBA land, `consolidate.py`, refresh
   `data/siliconvalley.dataset.json` + the helper's SV block, append the extraction ledger in AUDIT.md,
   commit. (Watch dedup: disambiguate same-named multi-location spots, e.g. Zareen's.)
2. **More expansion waves to ~500** (each: discover→extract→fact-check→rerank, append AUDIT.md):
   - Food gaps: more Vietnamese (non-SJ + coffee/che/bún riêu), Mexican/taqueria depth, seafood,
     BBQ/burgers, Pakistani/Afghan, Persian, wine-country tasting rooms, breweries, more boba/dessert.
   - Per-subregion sight depth: Palo Alto/Stanford, Mountain View (Castro St), Sunnyvale downtown,
     Cupertino, Santa Clara (Great America area), + more day trips (Santa Cruz, Half Moon Bay, Gilroy,
     Pescadero, Saratoga, Alviso, Mount Umunhum, Henry Coe).
   - Merge the vetted leads in `_PENDING_LEADS.md`.
3. **Creator wave (task #24):** discover + vet popular/honest SV & Bay-Area travel/food creators
   (YouTube/TikTok/blog), register in `sources.json` creators, layer onto Yelp-only + canon spots.
4. **Location-verify (task #23):** geocode via WebSearch agents (read `!3d!4d`/Apple `coordinate=`,
   grade high/med/low) into `data/geocodes.json`; UNVERIFIED → helper. Append the geocode ledger.
5. **Build + gate + render-verify;** finalize `index.html` counts; commit.

## Budget & resumption rules
- WebSearch is shared, capped ~200/session; a wave WILL truncate — that is expected. On truncation:
  commit what landed, append the stop-point + leads to `_PENDING_LEADS.md`, and **update the State
  block above**. Never fabricate to hit a number.
- Geocoding via the browser `tools/geocode-helper.html` does NOT use the WebSearch budget — it is the
  fallback for pins WebSearch can't resolve, and can be run by the user in parallel any time.
- A scheduled continuation (self-trigger / send_later) re-enters to run the next wave until the
  acceptance criteria above are all checked, then it stops and the trigger is removed.
