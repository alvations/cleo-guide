# City requests — backlog

The tracked backlog of cities to add. The site's "Suggest the next city" box (on `index.html`)
files suggestions here as GitHub issues labelled `city-request`; maintainers/agents then run the
research pipeline and build the page.

## How a request becomes a page

1. A request arrives as a GitHub issue (label `city-request`) or a row below.
2. Run `node tools/research.js "<City>" "<ST>"` and follow [docs/SOURCES.md](../docs/SOURCES.md):
   **search → rank sources → fact-check → build**.
3. Record the ranked, fact-checked sources in [`sources.json`](sources.json).
4. `node tools/research.js --validate <city-key>` must pass before the page is built.
5. Add the page under `cities/<city>.html` and link it from `index.html` and the README.

## Open requests

_None yet. Add rows as `| City, ST | requested by | notes / sources |` or file via the site._

| City, ST | Source of request | Notes / candidate sources |
|---|---|---|

## Done

| City, ST | Page | Status |
|---|---|---|
| Cleveland, OH | [`cleveland.html`](../cleveland.html) | Complete — 183 places, fully sourced |
| Youngstown, OH | [`cities/youngstown.html`](../cities/youngstown.html) | Shortlist — web-researched & fact-checked |
