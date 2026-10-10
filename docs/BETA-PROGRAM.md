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
6. **No third-party brand copying:** take the feel from Airbnb, Marriott and Booking, never a name, logo, wordmark
   or trade dress.
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
