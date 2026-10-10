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

- `pages.json` — live pages migrated to the new generator. The rest of `beta/` is still the legacy re-skin
  (`tools/beta-restyle.py`), which skips anything listed in `beta/data/manifest.json`.
- `lib/` — extraction from live pages, the place model, guards, renderers (`render/`, per lane).
- `client/` — browser JS, copied to `beta/assets/js/` with content-hashed URLs. Edit here, never in `beta/`.
- Never hand-edit generated files under `beta/` (pages, `assets/js`, `data/`, `sw.js`): change the source here
  and run `npm run beta`.
