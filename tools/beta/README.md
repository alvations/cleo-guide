# tools/beta — the beta generator

Builds `beta/` from the same data the live site renders, with a count gate that refuses to write when a
beta page would carry different places from its live page. Design and decisions:
[`design/beta/RFC-architecture.md`](../../design/beta/RFC-architecture.md).

```bash
cd tools
npm run beta            # regenerate everything the new generator owns (pages listed in beta/pages.json)
npm run beta:check      # fresh in-memory build == beta/ on disk (reproducibility)
npm run test:beta       # the beta gate (also runs inside `npm test`)
node beta/build.js --list
```

- `pages.json` — live pages the new generator owns. Since Wave 1 (M1-22) that is **every** live page (91) —
  `tools/beta-restyle.py` skips all of them (via `beta/data/manifest.json`) and is due for deletion.
- `lib/` — extraction from live pages, the place model, guards, renderers (`render/`, per lane). Platform
  modules renderers read instead of counting for themselves:
  - `stats.js` — every count and date a page prints (`row.stats`, `country.stats`, `reg.stats`), and the fix-up
    of hand-typed counts in live prose (M1-20);
  - `sources.js` — publisher-level source index per page (`row.sources`, `rec.src`), `data/sources.json` (M1-10);
  - `art.js` — build-time SVG map art from verified pins only: `assets/art/<page>/map.svg` + one per area,
    with projections for client locator dots (`row.art`, `Cleo.art.xy`) (M1-13, M1-06).
- `client/` — browser JS, copied to `beta/assets/js/` with content-hashed URLs. Edit here, never in `beta/`.
- Never hand-edit generated files under `beta/` (pages, `assets/js`, `data/`, `sw.js`): change the source here
  and run `npm run beta`.
