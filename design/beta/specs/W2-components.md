# Wave 2 component specs (designer → FE-A, FE-B)

> 2026-10-10 · designer lane · CSS shipped in `beta/assets/cleo.css` (source `design/beta/css/contract.css` §15).
> Live sheet built from real Tokyo records: [`mockups/w2-components.html`](../mockups/w2-components.html)
> (`python3 design/beta/tools/make-w2-mockups.py`). Screenshots: `eval/w2/designer/w2-components-{m,d}.jpg`.
> Emit the markup below and it is styled — no inline CSS needed. All tokens; AA in light and night; every target ≥ 44 px.

## 1. "For you" (ROUND-1 #2) — FE-A

- **Picker:** `ul.interests > li > button.interest[aria-pressed]` with `.glyph > .g[data-g]`, `b` (title),
  `span.d` (computed "N of M {city} places"), `.tick`. Put it in a `.sheet.picker` (or the tray). Store via `Cleo.store`.
- **Interest → ids** (ids only — Wenwen rule; never dish or description words). Recommended table:

  | Interest | Glyph | Collection / kind ids |
  |---|---|---|
  | History & landmarks | `columns` | ICON ARCH HERITAGE HIST TEMPLE CASTLE UNESCO |
  | Food & drink | `bowl` | every `data-k="f"` record + MKT SPEAK NIGHT |
  | Pop culture | `tv` | ANIME POP ENT ODD |
  | Outdoors | `mountain` | PARK NATURE GARDEN OUTDOOR VIEW ONSEN |
  | Art | `frame` | MUS ART ARTS |

- **Result:** `p.because` above the first area: "**First because you picked {a} and {b}:** N places from those collections
  move up. <span class="n">All {total} are still here.</span>" + `button` "Change". Promoted cards get
  `<span class="pl-why">For you · {interest}</span>` at the end of `.pl-e`. Reorder only; the record set is identical.

## 2. Home modules (M2-11) — FE-A

`div.modules > a.mod` ×3, each `span.g` (set `--g: var(--g-heart|tv|ticket|…)`), `b` title, `span` computed line.
Order: **Your list** (saved in this city) · **★ signature** (`a.mod.sig`, platform `guide.signature`) · **Free to visit**
(`FREE` collection). Horizontal scroll on phones; sits between masthead and rail. Counts toward B-03 ≤ 14 — if it
pushes over, show it below the first area instead.

## 3. "Your day" (ROUND-1 #5) — FE-A, data from platform `guide.days.plans[AREA]`

```
section.day > header(.eyebrow "Your day · {area}", h2 "{area}, on foot")
            > .daysum(div>b+span ×3: stops · "{km} km" straight-line total · places to eat)
            > p.caveat ({guide.days.label} verbatim)
            > .sharebar(btn-primary Share this day [#day= / #list= codec] · Open in maps · Save all)
            > ol.stops > li.stop > span.n {i} + div > ul.pls > li.pl (the normal card) + p.leg "{x} km straight-line to stop {i+1}"
```
Map: `L.polyline(latlngs, {className: 'day-route'})` (dotted city accent) and stop pins `.pin-n.day`. Closed places are
never stops (platform guarantees).

## 4. Saved page (ROUND-1 #7, `mockups/saved.html`) — FE-A

`main.saved-page`: masthead → `.listhead` (`.eyebrow`, `h1`/`h2.d2`, `p.device-note`) → `.listtabs` of `button.pill[aria-pressed]`
with `span.n` counts and a dashed `button.pill.new` "+ New list" → `.listmenu` (Rename, `.danger` Delete list) →
`.exportbar` (`.lbl` "Take it with you", Share link, KML, GeoJSON, Open in maps) → `.split` (list + map of saved) with
`ul.saved-cards > li.pl` (normal cards; `.stamp` "Been there"), unknown ids as `li.gone` "no longer listed".
Shared link view: `div.banner.shared` "A shared list of N places — read only." + `button.btn` "Save a copy".
Until this ships, the current `#saved` markup has a designed baseline (numbered list cards, no default buttons).

## 5. Near me (M3-02) — FE-A

Toolbar `button.btn.nearme[aria-pressed]`; once on, a `.device-note` "Using your location for this visit only — never
stored." and `span.pl-dist` "1.2 km" appended to `.pl-e`; sort nearest first (state the order).

## 6. Map as guide (ROUND-1 #6) — FE-A

- **Pin peek ≤ 40 %:** CSS now shows only the plate (name, tier, save) + actions in `.poi-sheet:not(.full)`, max 40 vh;
  `.full` shows the whole card. No markup change.
- **Sheet locator:** put `div.locator > svg` (area pins as `circle`, this place as `circle.me`) inside `.hero-plate`;
  it replaces the generic glyph (pulses unless reduced motion).
- **Native name once:** wrap the title's native script as `<span class="nat" lang>` — hidden visually when the plate shows it.

## 7. Hubs / landing (ROUND-1 #3) — FE-B

FE-B's slice 1–3 already ship the composition rotation (`.tile.c-night/.c-wash/.c-city/.c-paper`), signature tile lines,
the cross-city rail and country heroes — the design direction is met. Design notes:
- Tile bar carries the skin's second accent (`--city-2`, decorative only) — automatic via cleo.css.
- Country hero "known for" line is Didone italic: it is now capped at `opsz 28` so macrons (Goryōkaku) stay visible.
- When imagery motifs arrive (`beta/assets/img/motifs/`), use them on the `.c-city` and `.c-night` grounds only; keep
  `.c-wash/.c-paper` typographic so neighbours still differ.
- Upstreaming FEB_CSS / GLUE into cleo.css happens once those blocks stop changing (end of W2); until then inline wins.

## 8. Rules unchanged

One action accent (`--city`); `--city-2` is never text or an action. No opacity animation on content. Nothing animates
under `prefers-reduced-motion: reduce`. No caps-only text (B-19 < 15 %).
