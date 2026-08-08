# Testing

Two commands, both of which must pass before you push.

```bash
cd tools
npm install
npm run validate   # content integrity
npm test           # behaviour
```

---

## Why not a headless browser

Playwright or Puppeteer would be better. In many sandboxes their Chromium download host is
blocked, so the harness runs the real page in **jsdom with the real Leaflet library**. That is
enough to catch every bug this project actually hit: reference errors, scope errors, broken
rendering, and total failure when a CDN is unavailable.

If you can run a real browser, do — but keep the two-scenario structure below.

## `npm run validate` — content

Syntax checking is not enough. A find-and-replace once deleted 143 records from this file and the
result parsed cleanly as valid JavaScript. The validator checks:

- **Structure** — the arrays exist and parse
- **Fields** — name, address, numeric coordinates, valid tier, known area, at least one source,
  known source keys, cuisine tags on food, description long enough to be useful
- **Geography** — every coordinate inside a bounding box, which catches transposed lat/lng
- **Duplicates** — no name in both lists
- **Source coverage** — every numbered entry of a numbered source is present
- **Rank balance** — every area has at least one must-see, or the must-see filter returns an
  empty region
- **Hazards** — no `document.write`

## `npm test` — behaviour

Runs the page four ways.

**1. Map library available.** Cards render, base layer chips build, Leaflet panes exist, and more
than fifty markers draw as real SVG paths.

**2. Map library blocked.** This is the important one. The CDN script tag is replaced with a stub.
Every card, filter, preset and export must still work; the base layer row must hide itself; the
map area must explain what happened. **This scenario exists because it once took the whole page
down in production.**

**3. Interaction.** Mode switching, every cuisine filter returning results, presets, visited
tracking and its filters, the trip view, all five free base layers, Google without a key not
crashing, sorting, rank filtering, and search with no hits showing an empty state. Zero
uncaught errors throughout.

**4. Exports and persistence.** KML, JSON and offline-copy downloads fire with correct filenames;
the Google directions URL is well formed; trip and visited state reach `localStorage`; per-card
Google and Apple links are correct.

## Adding a check

Both scripts use one helper:

```js
chk('what it is', actualValue, expectedOrPredicate);
```

The third argument may be a value or a function. Both scripts exit non-zero on failure, so they
drop straight into CI if you want one.

## Before every commit

```bash
cd tools && npm run validate && npm test
```

If you edit `cleveland.html` with a script rather than by hand, **assert on record counts inside that
script before it writes**. That is the only thing that reliably catches silent content loss:

```python
assert h.count('Soldiers') == n0, "records lost"
open('cleveland.html','w').write(h)
```
