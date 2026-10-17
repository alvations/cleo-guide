# Imagery lane — checkpoint

**Task:** W8 photo coverage for every non-Vietnam guide, in this order: lead card, first rail row, tier-1 open sights. Commons only, high-confidence, complete TASL credit; never food, venues, closed places or Vietnam. Weights: Tokyo phone@3× first load ≤ 700 KB, Tokyo/Cleveland/NY first load ≤ 2.0 MB. Open issues: R7-g1 (run reviews/refusals), D-40 option a (approved 2026-10-16: lead/first-row cards 500 + 720 + 960, 720 ≤ 55 KB; Tokyo phone@3× must stay ≤ 700 KB, tighten the cap rather than exceed). QA-67: no 1280w; resolved in layout by FE-A.

**Done (pushed):**
- 128c3bac: 7 run-#40 refusals (Pillar of Fire is a stated gap), PNG→JPEG in recompress, all-format size gate, wider NOT_A_PHOTO + a PNG-lead guard (R7-g1, R7-g7).
- run #46 / 67621b28: 720w backfill on 71 rows.
- 9a7c4819: manifest generator + vetted candidates committed to `tools/beta/imagery/manifest/`. They were previously scratch-only.
- d36f7b49: D-40 (a) code. recompress.js derives a ≤ 55 KB (now 45 KB) 720 for lead/first-row Commons cards from the committed 960 (`needs720`, `priority720`, `P720_KB`). fetch-commons asks priority targets for 500/720/960. Tests are in, with the data check PENDING at the time (`D40A_PENDING` in test-imagery.js).
- df29c10b: run #48 review (`design/beta/imagery-runs/run-48.md`).
- 15bf5685: run #48's 32 refusals applied; D-40a data landed (cap 45 KB, `NO720` exceptions); pending flag off.

- This push: run #52 review; build_manifest fix (a later refusal wins over an earlier vetted line) + test; Gotoku-ji and CMA removed again.

- This push: Pullman Porter Museum refused (wrong subject); candidate wave 1: 20 vetted Commons titles for the 10 searchable empty leads / first-row slots, plus 6 stated gaps (Otaru Kihinkan, Nintendo Museum, Den Den Town, Gamble Garden, Singapore Zoo, Coney Island Park).

- This push: run #54 review (wave 1). 10 new rows, 9 kept; Uluwatu refused (the temple is barely visible); Cebu's shrunken 720 dropped and added to NO720; recompress auto-drops such copies. Leads 24/25, first row 50/51.

- This push: candidate wave 2. Pittsburgh and Washington DC had 0 tier-1 photos because their places carry no Wikipedia link (so no lead image to try). Added 56 vetted Commons titles for 29 targets and 7 stated gaps (DC modern sculpture memorials without US freedom of panorama, the 600 px Carnegie Free Library, the Pittsburgh trolley museum). Not found yet: Heinz History Center, Pump House, Air & Space (Mall), Udvar-Hazy, Army museum.

- This push: candidate wave 3. 26 vetted titles for 13 Bruges and Youngstown places, English name aliases (NAMES) so the Dutch-named Bruges targets match Commons titles, and 3 stated gaps (Dave Grohl Alley murals, Past Times Arcade, Garnaalvissers te paard). Not found yet: Atlantikwall Raversyde (numbered series, exact title unconfirmed), De Haan, Ensorhuis, NAVIGO, the boat tour, DeYor, Packard Museum, Youngstown Historical Center, Fellows Riverside Gardens.
- This push: run #58 reviewed (design/beta/imagery-runs/run-58.md). 11 kept, 5 refused (Cebu per the orchestrator; CMoA banners; Duquesne skyline; Grandview street; Gotoku-ji figurines, so CLOSEUP now names maneki-neko). Mattress Factory is '?'. DC got 0 rows because the budget ran out; the next run (budget 600) covers DC + wave 3 + the retries.
- FE-A asked (16:10Z) to switch gallery.js `sizes` to 240px for cards with a 600–799 copy (platform's cardSizes landed 3a0ecfec). Re-run w8p when FE-A pushes.

- This push: the dispatch run reviewed (design/beta/imagery-runs/run-60.md): 24 kept, 6 refused, Zwin '?', Mattress Factory refused and stated. Leads 25/25, first row 51/51, tier-1 503/1003. w8p is green again at 618 KB (FE-C b8a3a6ae took the page JSON off the first screen; FE-A 8b06f542 fixed the gallery 720 sizes).

- This push: Zwin 32.jpg refused per the orchestrator (a plain beach; 'Het Zwin.JPG' is next). Candidate wave 4: 19 vetted titles for the still-open Ghent, Antwerp, Dayton, Saarland and State College targets (Gravensteen, OLV Antwerp, Kazerne Dossin, Carillon Park, Westcott House, NMUSAF, Ludwigskirche, Hauptmarkt Trier, Cusanusstift, Horseshoe Curve). Eastwood and Englewood MetroParks are stated gaps (no file found). Not found yet: MSK Gent, Zoo Planckendael, Kudaka, Diekirch, Musée lorrain. Next: dispatch `all` at budget 600 and review it.

- This push: R7 QA-78 fixed (the Duquesne Incline author was a Flickr profile URL; it is now "arne_heggestad (Flickr)". The fetcher names the account for a profile-link credit and refuses any other URL or HTML author; test-imagery checks every CREDITS author). Run #64 (wave 4) reviewed in design/beta/imagery-runs/run-64.md. 7 kept. Heilig Bloed (triptych) and Het Zwin (housing estate) refused and now stated gaps. Tier-1 509/999, 244 left. No '?' rows. Next: wave 5 candidates for Chicago, Orlando, SF and Miami (the largest remaining counts).

- R8 gap #1 (orchestrator, 23:00Z): (a) hero candidates for Jalan Besar and Queenstown, Dempsey Hill stays stated; (d) holds on eligible cards, and the 12 misses are all food, venue or stated gap; (b) tier-1 509/999 = 51 % against a 70 % target (+191); (c) 523/3829 = 13.7 % against 30 % (+626). Wave 5a: 127 titles for Saarland and Okinawa, plus 5 stated gaps. Work list: scratchpad t1todo.tsv, rebuilt by the node one-liner in this lane's notes.

- DONE imagery side (FE-A places it): designed food covers. motifs.js has foodGround(spec), giving the city tile as {light, dark} data-URI url()s under 1 KB together, plus foodGlyphs(primary) for the no-repeat rule over FOOD_GLYPH_LADDER. imagery.foodStyle(row) gives the --food-ground / --food-ground-dark pair, and city rows carry row.imagery.food. Tests in test-imagery. Original task: designed food covers in tools/beta/imagery/motifs.js per DESIGN-SYSTEM §v2.7a (6b2faadd4). They combine the --cover-food ground plus the city pattern at ink 5/7 %, the cuisine kit glyph at 56 % bottom-right, FE-A's cover word and a native dish name. The skin must stay under 1 KB per city and add no requests. Acceptance: the first food rows on New York and Chinatown. Start after the wave-5a review.

**In flight:**
- Run #48's 32 refusals are APPLIED in this push (orchestrator's final list, recorded in design/beta/imagery-runs/run-48.md). CREDITS 580 → 548.
- D-40a data has LANDED: 38 lead/first-row cards have a 720 copy ≤ 45 KB. 7 are in `NO720` in recompress.js (busy or tall photos that only fit by shrinking below 600 px) and keep 500 + 960. The cap went from 55 to 45 KB because 55 measured Tokyo phone@3× at 703 KB once the 720-aware `sizes` was applied; 45 measures 691 KB. Platform still has to switch `cardSizes()` to the 720 copy (asked); until then phones load the 500 and Tokyo is 649 KB.
- Run #52 (`all` budget 1200, 38918569922) committed e5584852 and is REVIEWED (`design/beta/imagery-runs/run-52.md`): 9 new rows, 2 of them refused files re-fetched by a build_manifest bug (fixed, tested, removed). 1 row flagged '?' for the orchestrator (Pullman Porter Museum). Yield is low: the lead images are used up.

**Next:**
1. When the run commits: `git pull` (resolve CREDITS conflicts BY HAND, never `--theirs`). List the new rows, i.e. CREDITS rows whose `commonsTitle` is not in `git show f47945e9:beta/assets/img/CREDITS.json`, grouped by city as `id ← file | depicts`, flagging doubtful ones. Then send the orchestrator: coverage (`node tools/beta/imagery/coverage.js`), remaining (`node tools/beta/imagery/fetch-commons.js --dry-run --scope all`), and `npm run beta:qa:w8p` (Tokyo phone@3×).
2. On the orchestrator's refusals:
   - append each to `tools/beta/imagery/manifest/cands.tsv` as `landmark:<page>#<id>\t<file>\t(lead image)\thigh\tlead image (run #N)\t\trefused by visual review (…): <reason>`, giving a photo-fault reason so it is global;
   - add a stated SKIP in build_manifest.py when nothing honest is left;
   - run `python3 tools/beta/imagery/manifest/build_manifest.py`;
   - remove the CREDITS rows and their files with a count-asserted script;
   - `cd tools && npm run beta && npm run validate && npm test && npm run beta:check`;
   - push and verify with ls-remote.
3. When platform's `cardSizes` change lands, re-run `npm run beta:qa:w8p`. It should be ≈ 691 KB. If Tokyo phone@3× is over 700 KB, lower `P720_KB`, delete the lead/first-row 720 variants, re-derive with recompress, and add any new skips to `NO720`.
4. Wave 1 (leads + first rows) is dispatched as scope=priority; review it (contact sheet) and send the orchestrator only the '?' rows. Then wave 3: Bruges (0%), Youngstown (0%), then Ghent, Antwerp, Okinawa, Saarland, Dayton, State College — the guides with the lowest tier-1 share (`coverage.js --json`), about 40 targets per wave. Coverage needs VETTED CANDIDATES: WebSearch for Commons file titles of the top tier-1 gaps (`coverage.js --json`), add them to cands.tsv with depicts and confidence, rebuild the manifest, then a dispatch. Don't dispatch more plain `all` runs; they yield about 4%.
5. Review any dispatched run as in step 1. Write `design/beta/imagery-runs/run-<N>.md` and send the flagged rows to the orchestrator.

**Notes:**
- `npm run beta:qa:w8p` is a BLOCKING pre-push check for imagery: Tokyo phone@3× ≤ 700 KB. Run it with the gates and do not push on FAIL; instrument the transfer list to find the cause.
- Closed gap: recompress now DROPS a lead/first-row `-720` copy that would only fit by shrinking below 600 px, and logs it ("add … to NO720"). Add the logged row to `NO720` at review so `needs720` stops re-trying it.
- sharp for local runs is at `NODE_PATH=<scratch>/sh/node_modules`. In a fresh session: `cd tools && npm install --no-save sharp`.
- The Actions workflow `beta-fetch-unsplash.yml` belongs to the orchestrator; never edit it. Runs: push → scope priority; dispatch → `scope` + `budget`. The image hosts are blocked in this sandbox, so all fetching happens on Actions.
- Refusal scope: a photo-fault reason applies to every target; a slot or duplicate reason stays local (`refusalIsGlobal`).
- Grandfathered PNG leads (Aachen Vogelsang, Erie Waldameer): the orchestrator says keep them (now JPEG).
- Push guard: check git's exit code, never grep the output; then confirm with `git ls-remote origin refs/heads/claude/peaceful-goodall-i0hsrt` = HEAD.
