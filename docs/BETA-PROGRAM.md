# Beta program — make `beta/` look like (or better than) the leading travel products

Owner request (2026-10-10): after the competitive UI/UX research and the SWOT land, launch agents in their
lanes — product manager, UI/UX, frontend and "backend"/platform engineers, QA — to **build, review and iterate
autonomously** until the **beta site** looks like the competitors or better, and includes the competitor features
that make the product better. **Beta only.**

Inputs (read before doing anything):

- `design/research-2026-10/ux-competitive/README.md` — UI/UX teardown of hotels, OTAs, experiences and map tools.
- `design/research-2026-10/swot/README.md` — SWOT, gap analysis and roadmap.
- `design/ux-2026-10/README.md` — the earlier "Salon" proposal. It is an input, not the answer; the owner judged
  the current beta "horrible, nothing like Airbnb or a modern hotel site".
- `docs/QA-2026-10-03.md` — known defects and the QA harness (`cd tools && npm run qa`).

## Scope

- **In scope:**
  - Everything under `beta/`.
  - New beta-only tooling under `tools/beta/` (and `tools/beta-*.py`).
  - Beta-only assets under `beta/assets/`.
  - Design and program docs under `design/beta/` and `docs/BETA-*.md`.
- **Out of scope:** the live site. Never edit:
  - `index.html`, `cleveland.html`, `cities/`, `Japan/`, `Singapore/`, `Vietnam/`, `Belgium/` or `Germany/` at the root;
  - the live builders (`tools/build-*.py`, `tools/*_build.py`, `tools/rebuild-city.py`);
  - `data/` registries or datasets.

  Beta reads data; it never writes it. If a beta feature needs a data change, the PM files it in the backlog as a
  live-pipeline request and does not implement it here.
- Beta pages may get a **new engine** (new HTML/CSS/JS), not just a re-skin. They must be generated reproducibly
  from the same data the live pages use, by a script under `tools/beta/`. No hand-edited beta pages.

## Non-negotiable rules (from CLAUDE.md and the owner)

1. **Keep every place.** Never cap, trim, hide or paginate away places. Progressive rendering is fine only if every
   place stays reachable. Every beta page must carry exactly the places of its live counterpart; the generator
   asserts the record counts and refuses to write on a mismatch.
2. **Attribution stays visible:** "Recommended by" sources on every card. Closed places stay, flagged. Stated gaps
   stay stated.
3. **No fabrication:** no invented places, photos, ratings, reviews, prices, opening hours or quotes. Imagery must
   be licensed with attribution (e.g. Wikimedia Commons), illustrative, typographic or map-art. Never present a
   photo as a specific venue unless it really is that venue and is properly licensed.
4. **Content never depends on a CDN.** The page renders without network access; the map is progressive
   enhancement. No `document.write`. Wrap every `localStorage` call in try/catch.
5. **Maps:** OpenStreetMap and Esri tiles only. Never Google or any key-required tile host; `tools/check-google.py`
   must pass on beta.
6. **No third-party brand copying or naming:** take the feel of the leading hotel, experience and booking products,
   but never a name, logo, wordmark or trade dress. **Owner rule (2026-10-10):** from Round 3 on, no third-party travel,
   hotel, review or guidebook brand or style may be named, referenced or alluded to anywhere in new work: docs, briefs,
   code, comments, CSS class names, commit messages, filenames or UI copy. Use our own names (Gallery, Atlas, Guidebook,
   Insights). Source attributions are exempt: a place recommended by a named publication still credits it on its card.
   Earlier research and evaluation docs predate this rule and keep their citations as evidence.
7. `cd tools && npm run validate && npm test` must pass before every commit. The QA harness must show 0 FAIL on
   beta, mobile (390×844) and desktop (1440×900).
8. "Backend" means **no server**. GitHub Pages is static. Platform work means:
   - build-time generators;
   - JSON indexes;
   - client-side search;
   - a PWA / service worker for offline use;
   - schema.org structured data;
   - share links;
   - client-side saved lists.

   Features that truly need a server (accounts, booking, UGC reviews) are designed as honest stubs (for example
   "save to device", or deep links to the venue's own site) or deferred, and the deferral is documented.

## Lanes (max ~6 concurrent sessions)

| Lane | Owns | Deliverables |
|---|---|---|
| **PM** (lead) | `docs/BETA-BACKLOG.md`, `docs/BETA-DECISIONS.md`, acceptance | Turn the research and SWOT into a prioritised backlog with acceptance criteria. Accept or reject each increment against the competitor benchmarks. Keep the roadmap honest about what static hosting can do. |
| **UI/UX designer** | `design/beta/` (tokens, components, specs, mockups, screenshots), `beta/assets/*.css` | A design system and page specs that hold up next to Airbnb Experiences, luxury-hotel and OTA pages. Reviews every increment visually. |
| **Tech lead / platform ("backend")** | `tools/beta/` generator core, data-to-JSON indexes, search index, PWA / service worker, structured data, `npm run beta` | An architecture RFC first (`design/beta/RFC-architecture.md`), then the generator that emits all beta pages from data with count asserts. |
| **Frontend engineer A** | City page template and its JS (cards, filters, map ↔ list, detail sheet, concierge, saved lists, itineraries) | The city experience. |
| **Frontend engineer B** | Landing, country and city hubs, navigation, search UI, share / OG, empty / error states | Hub and landing experience, plus site-wide navigation. |
| **QA / reviewer** | `docs/BETA-QA.md`, tests | Runs the QA harness, accessibility (WCAG AA), performance, the count asserts, the no-CDN test and visual diffs. Files defects to the backlog. Must sign off before any deploy. |

Each lane edits only the files it owns. Shared files (generator entry points, `tools/package.json`) change through
small, coordinated commits. Always `git pull --no-rebase` before pushing; never reset or force-push.

## Iteration protocol

- **Wave 0 — plan.** The PM writes the backlog and acceptance criteria, the designer writes the design system and
  page specs, and the tech lead writes the RFC.
- **Wave 1 to N — build → review → iterate.** Each wave:
  1. Engineers build to the backlog.
  2. QA runs the harness and files defects.
  3. The designer reviews screenshots (mobile and desktop) against the competitor benchmarks.
  4. The PM accepts or rejects each item and re-prioritises.
- **Deploy.** When the PM has accepted a milestone and QA has signed off, the orchestrator opens a PR whose diff
  touches only beta-scope paths and merges it into the GitHub Pages branch (`claude/cleveland-page-creation-pant4l`).
  The live site is never touched.
- **Done.** The program finishes when the PM and designer judge that the beta matches or beats the benchmark set on
  the research's checklist, and the SWOT's must-have gaps are either shipped or explicitly deferred with a reason.
- **Audit trail.** Every session appends to `docs/BETA-LOG.md`: date, lane, what changed, commit SHAs, screenshots.
  The orchestrator logs sessions in `docs/AGENT-LEDGER.md`.

## Evaluation rounds — 5 rounds to ≥ 80–90 % (owner instruction, 2026-10-10)

After each build wave completes, run an **evaluation round**, then launch the squad to close the gaps. Do **5 rounds**
(more if the goal is not yet met). The goal: the beta reaches **≥ 80–90 % of the leaders' experience and feel**,
including imagery, covers **all or most of the competitors' features** that fit our constraints, and adds our
**unique features**.

**Round loop**
1. **Evaluate.** An independent evaluator session scores the beta.
   - It uses Playwright at 390×844 and 1440×900 on the landing page, a country hub, Tokyo, Cleveland, a Singapore
     town, a place detail, the map on mobile, saved lists and a day plan.
   - It scores against `docs/BETA-BENCHMARK.md` and the research teardown (`design/research-2026-10/ux-competitive/`).
   - It scores four dimensions, each 0–100, with evidence: screenshots, metrics, and the cited competitor pattern.
     - **A. Look & feel** (weight 40 %): visual polish, imagery, typography, layout, motion, luxury plus fun, wanderlust.
     - **B. UX & ergonomics** (25 %): first screen, discovery, map ↔ list, filters, detail, mobile, a11y, performance.
     - **C. Competitor feature coverage** (20 %): the share of the teardown/SWOT feature matrix that applies to a
       static, honest guide and is shipped. List each feature as shipped / partial / missing / out-of-scope (with reason).
     - **D. Unique strengths** (15 %): sourced picks and attribution as navigation, verified pins, closure honesty, the
       interest triad (landmarks × signature food × pop culture), the anime layer, "your guide" and day plans.
   - **Overall similarity score** = the weighted sum. The goal is **≥ 80 %** overall, with A ≥ 80 % and C ≥ 80 %
     (stretch: 90 %).
   - Output: `design/beta/eval/ROUND-N.md`, with a scorecard, before/after screenshots versus the previous round, the
     top 10 gaps ranked by score impact (each mapped to a lane), and a verdict.
2. **Plan.** The PM turns the evaluator's gaps into the next wave's backlog items (`docs/BETA-BACKLOG.md`), each with
   acceptance criteria.
3. **Build.** The squad (platform, FE-A, FE-B, designer, QA, plus any other lane needed — e.g. an imagery/content lane)
   implements the plan.
4. **Ship.** QA signs off, the PM accepts, then a beta-only PR is merged into the Pages branch.
5. **Changelog.** Append `docs/BETA-CHANGELOG.md` with the round number, the score before → after per dimension, what
   shipped (backlog IDs, commits) and what was deferred.

**Imagery.** Real imagery is part of the goal. Use licensed imagery only: Wikimedia Commons (CC BY / CC BY-SA / PD)
or similarly licensed material. Show the credit and licence in the UI, and record each asset's source URL, author,
licence and the record it depicts in `beta/assets/img/CREDITS.json`. A photo may appear on a place only when it truly
depicts that place, typically landmarks and sights. Food places use illustration, typographic plates or map art unless
a genuinely licensed photo of that venue exists. Never fabricate.

If the environment's egress policy blocks downloading images, the imagery lane records that in the round doc and
the changelog. It ships the strongest honest alternative and lists the asset manifest for the owner to fetch. It
never routes around the policy.

**Audit trail per round:**
- `design/beta/eval/ROUND-N.md` (scorecard + evidence);
- `docs/BETA-CHANGELOG.md`;
- `docs/BETA-LOG.md`;
- `docs/BETA-BACKLOG.md` status updates;
- `docs/BETA-QA.md`;
- `docs/AGENT-LEDGER.md` (every session).

Keep all research docs; add new research under `design/research-2026-10/` when a round needs it.

## Round 3 — view styles (owner request, 2026-10-10)

Today every city page is map-centred. From Round 3 a city page offers switchable **view styles** over the same full
record set, shareable through the URL hash. The owner's own site melon-seek is the reference for its map, chart and
insight modes; a snapshot is in `design/reference/melon-seek/`.

- **Gallery** — art- and image-led experience cards with category rows.
- **Atlas** — our map-centred view, with a ranked-list bottom tray.
- **Guidebook** — editorial area chapters.
- **Insights** — charts of the data.

A view may page its results only if every place stays reachable: page navigation, an "all N places" total, show-all,
and search and filters that reach every record. The study, specs, mockups and build plan go in `design/beta/views/`.

## Round 6: typography & style (owner request, 2026-10-11)

The owner asked for the fonts, the styles and every other visual element to be **rated explicitly** and the improvements built in. melon-seek's ideas may be borrowed.

From Round 6 on, the evaluator reports an itemised **Typography & style** sub-scorecard inside dimension A, covering:
- the display face and the UI face;
- scale and rhythm;
- colour and skins;
- spacing, radius and elevation;
- components;
- iconography;
- motion;
- consistency.

The A weight is unchanged. The audit and the decision record live in `design/beta/style/`. The briefs are in `design/beta/eval/W6-BRIEFS.md`.

## Rounds 6–9 (owner request, 2026-10-11)

There will be four more rounds, Rounds 6–9, run with the same loop. Each evaluator also scores the **design-conformance checklist** in `design/beta/eval/ROUNDS-6-9.md`, which covers:
- the views;
- Atlas map-first;
- Gallery, Guidebook and Insights;
- the type & style rating and rebuild;
- the melon-seek ideas;
- luxury and fun;
- photos;
- honesty;
- performance and accessibility.

Any row that is not ✅ becomes the next wave's work.

## Target raised: ≥ 98 overall (owner, 2026-10-11)

**98 is the minimum, not a stretch target.** Rounds continue (6, 7, 8, …) until the independent review scores ≥ 98 overall with every design-conformance row ✅. The rubric and the evaluator's independence are unchanged:
- the evaluator is never given the target, nor asked to hit it;
- QA never weakens a gate.

If progress stalls because the remaining points are blocked on the owner (photographs, a reviewed locale), the orchestrator pauses and reports exactly what unblocks them. See `design/beta/eval/ROUNDS-6-9.md`.
