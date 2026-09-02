# Cleo — beta (restyled site)

A full, reproducible re-skin of the whole cleo-guide site under one brand, **Cleo**, deployed to
`beta/` so it is reachable at `https://alvations.github.io/cleo-guide/beta/` **without touching any
live page**. Content, maps, map navigation, data arrays and place counts are byte-for-byte the live
site — only the chrome (head, brand bar, masthead, footer, cards, chips, legend, colours, type) is new.

## Brand

- **Name / wordmark:** **CLEO** — a wide-tracked uppercase [Fraunces](https://fonts.google.com/specimen/Fraunces)
  display wordmark, paired with an engraved **compass-rose monogram** (inline SVG, no raster).
- **Tagline:** *Sourced city guides · where to go, after hours.*
- **Positioning (never printed literally):** the quietly-confident concierge for a professional who's away
  for work and wants somewhere worth going once the workday ends — sourced, trustworthy, editorial,
  understated. Classy, not tacky. No third-party travel/hotel brand is referenced; the brand is original.
- **Signature:** an oversized engraved compass-rose **watermark** ghosted into every masthead void
  (~9% opacity, degree bezel + 8-point rose, hidden on mobile).

### Type roles
| Role | Face | Where |
|---|---|---|
| Display / titles | **Fraunces** (opsz 144, SOFT 28) | wordmark, H1, card & entry titles, section clusters |
| Italic accent | **Instrument Serif** italic | the gold masthead subhead |
| Body prose | **Newsreader** (Georgia fallback) | standfirst, writeups, notes |
| UI / labels | **Archivo** (uppercase, tracked) | eyebrows, chips, stats, buttons, back-links, badges, footer |
| Data only | **JetBrains Mono** | genuine `<code>`/`<pre>` only — **never** chrome labels |

Numerals: oldstyle proportional figures in serif prose; lining tabular figures in UI labels/stats.

### Palette (muted, two editions of one house)
- **Dark (engine city pages + country hubs + root hub):** warm-ink editorial night — `--iron #101318`
  ground with a barely-there dual glow, ivory `--bone #ECE8E1` ink, **champagne brass `--brass #CBA96A`**
  and **quiet sage `--patina #8FB3A4`** accents.
- **Light (Singapore / Vietnam pastel pages):** warm ivory paper — `--iron #FAF7F0`, deep-ink text,
  the same brass + sage accents at light-appropriate values. Same brand bar, watermark and masthead
  structure as the dark edition, so the two editions read as one imprint.

`theme-color` is set per edition; the pastel edition declares `color-scheme:light dark`.

## Social share (Open Graph + Twitter)

Every page carries `og:title/description/type/url` (absolute, under `.../cleo-guide/beta/...`),
`og:image` (absolute), `twitter:card=summary_large_image` + `twitter:title/description/image`, and a
`theme-color`, so a shared link renders a rich preview **with an image** rather than a bare link.

The branded **1200×630** cover lives at `beta/assets/og-cover.png` and is referenced by its absolute
Pages URL from every page. Regenerate it by rendering an HTML/SVG template to PNG with the pre-installed
Chromium via `playwright-core` (`PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers`).

## How beta is regenerated

Everything is produced by one reproducible post-processor:

```bash
python3 tools/beta-restyle.py          # regenerate every page under beta/
python3 tools/beta-restyle.py --check   # verify beta/ against sources, no write
```

For each source page it (chrome only): injects the brand `<head>` (Fraunces + Archivo fonts, OG/Twitter
meta, `theme-color`, and an **appended** Cleo design-system `<style>` that wins by cascade order),
inserts the sticky Cleo brand bar after `<body>` and the colophon before `</body>`, and rewires local
`<a href>` links so navigation stays inside `beta/` (unmirrored resources point at the live site).

**It never touches `<script>` blocks, the `const P`/`const F`/`const S` data arrays, Leaflet setup, or any
map logic.** Before writing each page it asserts the concatenated `<script>` bytes are identical to the
source and that `P`/`F` record counts are unchanged, refusing to write on any mismatch. All 67 pages pass.

Pages mirrored: root `index.html`, `cleveland.html`, the country hubs (`Germany/`, `Belgium/`,
`Singapore/`, `Vietnam/` index pages), every `cities/*.html`, and every Singapore/Vietnam pastel place page.

## Design-review loop

`beta/DESIGN-REVIEW.md` logs the adversarial build → Chromium-screenshot → harsh-reviewer-critique →
refine loop. Stop condition (two consecutive rounds > 9.0) was met at **R11 9.1 → R12 9.2**.
