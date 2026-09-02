#!/usr/bin/env python3
"""
beta-restyle.py — reproducible post-processor that re-skins the whole cleo-guide site under the
"Cleo" brand and writes a mirrored copy into beta/, WITHOUT touching content, data, maps or scripts.

What it does to each source page (chrome only):
  1. Injects a brand <head> block before </head>: a Fraunces font link, Open Graph + Twitter Card
     meta (rich social preview with a branded 1200x630 image), a theme-color, and an APPENDED
     override stylesheet (the Cleo design system) that wins by cascade order over the page's own CSS.
  2. Injects a slim Cleo brand bar (wordmark + compass monogram + tagline) right after <body>.
  3. Rewires local <a href> links (OUTSIDE <script>) so navigation stays inside beta/ for mirrored
     pages, and points at the live site for resources beta does not mirror (docs/, versions/, data/).

What it NEVER touches: <script> blocks, the const P / const F / const S data arrays, Leaflet setup,
any map logic. For every page it asserts the concatenated <script> bytes are identical to the source
and that the P / F record counts are unchanged, refusing to write on any mismatch.

Usage:
  python3 tools/beta-restyle.py            # regenerate all of beta/
  python3 tools/beta-restyle.py --check    # verify an existing beta/ against sources (no write)
"""
import os, re, sys, glob, html

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BETA = os.path.join(ROOT, "beta")
LIVE_BASE = "https://alvations.github.io/cleo-guide"
BETA_BASE = LIVE_BASE + "/beta"
OG_IMAGE = BETA_BASE + "/assets/og-cover.png"

# ---------------------------------------------------------------- mirror set
def mirror_rel_paths():
    rels = ["index.html", "cleveland.html",
            "Germany/index.html", "Belgium/index.html",
            "Singapore/index.html", "Vietnam/index.html"]
    for d in ("cities", "Singapore", "Vietnam"):
        for p in sorted(glob.glob(os.path.join(ROOT, d, "*.html"))):
            rels.append(os.path.relpath(p, ROOT).replace(os.sep, "/"))
    # de-dup, keep order
    seen, out = set(), []
    for r in rels:
        if r not in seen and os.path.exists(os.path.join(ROOT, r)):
            seen.add(r); out.append(r)
    return out

# ---------------------------------------------------------------- script-safe splitting
SCRIPT_RE = re.compile(r"<script[\s\S]*?</script>", re.IGNORECASE)

def scripts_of(doc):
    return SCRIPT_RE.findall(doc)

def outside_scripts_apply(doc, fn):
    """Apply fn to the chrome (everything outside <script>...</script>); leave scripts byte-identical."""
    out, last = [], 0
    for m in SCRIPT_RE.finditer(doc):
        out.append(fn(doc[last:m.start()]))
        out.append(m.group(0))            # script untouched
        last = m.end()
    out.append(fn(doc[last:]))
    return "".join(out)

# ---------------------------------------------------------------- P / F record counting (tolerant)
def _array_literal(doc, name):
    """Return the [...] literal for `const NAME = [ ... ]`, bracket-matched, comments/strings aware."""
    m = re.search(r"const\s+" + re.escape(name) + r"\s*=\s*\[", doc)
    if not m:
        return None
    i = m.end() - 1  # at the '['
    depth, n = 0, len(doc)
    instr = None; esc = False; comment = None
    while i < n:
        c = doc[i]
        if comment == "//":
            if c == "\n": comment = None
        elif comment == "/*":
            if c == "*" and i + 1 < n and doc[i+1] == "/":
                comment = None; i += 1
        elif instr:
            if esc: esc = False
            elif c == "\\": esc = True
            elif c == instr: instr = None
        elif c in "\"'`":
            instr = c
        elif c == "/" and i + 1 < n and doc[i+1] == "/":
            comment = "//"; i += 1
        elif c == "/" and i + 1 < n and doc[i+1] == "*":
            comment = "/*"; i += 1
        elif c in "[{(":
            depth += 1
        elif c in ")}]":
            depth -= 1
            if depth == 0:
                return doc[m.end()-1:i+1]
        i += 1
    return None

def count_records(doc, name):
    """Count depth-1 `{` object openings inside the const NAME array (comment/string aware)."""
    lit = _array_literal(doc, name)
    if lit is None:
        return None
    depth, n, i = 0, len(lit), 0
    instr = None; esc = False; comment = None; count = 0
    while i < n:
        c = lit[i]
        if comment == "//":
            if c == "\n": comment = None
        elif comment == "/*":
            if c == "*" and i + 1 < n and lit[i+1] == "/":
                comment = None; i += 1
        elif instr:
            if esc: esc = False
            elif c == "\\": esc = True
            elif c == instr: instr = None
        elif c in "\"'`":
            instr = c
        elif c == "/" and i + 1 < n and lit[i+1] == "/":
            comment = "//"; i += 1
        elif c == "/" and i + 1 < n and lit[i+1] == "*":
            comment = "/*"; i += 1
        elif c in "[({":
            if c == "{" and depth == 1:   # object opening at array top level
                count += 1
            depth += 1
        elif c in ")}]":
            depth -= 1
        i += 1
    return count

# ---------------------------------------------------------------- link rewiring
HREF_RE = re.compile(r'href="([^"]*)"')

def norm_target(rel_dir, target):
    """Resolve a local href to a repo-root-relative path (or None if not a local file link)."""
    if not target or target[0] in "#?" or "'+".find(target[:2]) != -1:
        return None
    if re.match(r"^[a-zA-Z][a-zA-Z0-9+.-]*:", target) or target.startswith("//"):
        return None  # http(s):, mailto:, tel:, data:, protocol-relative
    if "'+" in target or "+'" in target or "${" in target:
        return None  # script-built href fragment that leaked into chrome (shouldn't happen)
    path = target.split("#")[0].split("?")[0]
    if not path:
        return None
    frag = target[len(path):]
    joined = os.path.normpath(os.path.join(rel_dir, path))
    return joined.replace(os.sep, "/"), frag

def make_link_rewriter(rel_path, mirror_set):
    rel_dir = os.path.dirname(rel_path)
    def rewrite(chrome):
        def repl(m):
            target = m.group(1)
            res = norm_target(rel_dir, target)
            if res is None:
                return m.group(0)
            joined, frag = res
            if joined in mirror_set:
                return m.group(0)                      # resolves within beta/ as-is
            # not mirrored -> point at the live site so it still works
            return 'href="%s/%s%s"' % (LIVE_BASE, joined, frag)
        return HREF_RE.sub(repl, chrome)
    return rewrite

# ---------------------------------------------------------------- brand assets (CSS / bar / head)
# The Cleo mark: an engraved compass rose — a slim ring, a four-point star drawn as facetted
# needles (bright/shadow halves) with hairline diagonals, and a small centre pivot. Reads as
# refined wayfinding rather than a generic outdoor-startup pin.
COMPASS_SVG = (
    '<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'
    '<circle cx="50" cy="50" r="45" stroke="currentColor" stroke-width="1.6" opacity=".55"/>'
    '<g stroke="currentColor" stroke-width="1" opacity=".32">'
    '<path d="M50 12 L50 88 M12 50 L88 50 M26 26 L74 74 M74 26 L26 74"/></g>'
    '<path d="M50 8 L55.5 44.5 L50 50 L44.5 44.5 Z" fill="currentColor"/>'
    '<path d="M50 92 L44.5 55.5 L50 50 L55.5 55.5 Z" fill="currentColor" opacity=".55"/>'
    '<path d="M92 50 L55.5 55.5 L50 50 L55.5 44.5 Z" fill="currentColor" opacity=".55"/>'
    '<path d="M8 50 L44.5 44.5 L50 50 L44.5 55.5 Z" fill="currentColor"/>'
    '<circle cx="50" cy="50" r="3.4" fill="var(--iron)" stroke="currentColor" stroke-width="1.4"/></svg>')

def _hero_svg():
    """An engraved compass-rose watermark: two rings, a degree bezel, an 8-point star, cardinal ticks."""
    import math
    C = 100
    parts = ['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none" '
             'stroke="%23CBA96A" stroke-width="0.7">']
    parts.append('<circle cx="100" cy="100" r="92"/>')
    parts.append('<circle cx="100" cy="100" r="84" stroke-width="0.5"/>')
    parts.append('<circle cx="100" cy="100" r="52" stroke-width="0.5"/>')
    # degree bezel ticks
    for d in range(0, 360, 5):
        a = math.radians(d)
        r1 = 84; r2 = 90 if d % 30 == 0 else 87
        x1 = C + r1*math.sin(a); y1 = C - r1*math.cos(a)
        x2 = C + r2*math.sin(a); y2 = C - r2*math.cos(a)
        parts.append('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke-width="%s"/>'
                     % (x1, y1, x2, y2, "0.7" if d % 30 == 0 else "0.4"))
    # 8-point star (rose): long cardinal needles + short intercardinal
    long_r, short_r, waist = 78, 40, 10
    def pt(a, r): return (C + r*math.sin(a), C - r*math.cos(a))
    star = []
    for k in range(8):
        a = math.radians(k*45)
        tip = pt(a, long_r if k % 2 == 0 else short_r)
        wl = pt(a - math.radians(22.5), waist)
        star.append((wl, tip))
    path = "M %.1f %.1f " % star[0][0]
    for wl, tip in star:
        path += "L %.1f %.1f L %.1f %.1f " % (wl[0], wl[1], tip[0], tip[1])
    path += "Z"
    parts.append('<path d="%s" stroke-width="0.6"/>' % path)
    parts.append('<circle cx="100" cy="100" r="6"/>')
    parts.append('</svg>')
    return "".join(parts)

def _hero_uri():
    svg = _hero_svg().replace('"', "'").replace("<", "%3C").replace(">", "%3E").replace("#", "%23")
    return "url(\"data:image/svg+xml,%s\")" % svg

HERO_URI = _hero_uri()

def palette_css(pastel):
    # Dark: warm-ink editorial night. Light: warm ivory paper. Accents: champagne brass + quiet sage.
    dark = """
    --iron:#101318; --slab:#181C22; --slab-2:#20252C; --hair:#2A2F37; --hair-2:#353B44;
    --patina:#8FB3A4; --patina-dim:#3C4F49; --brass:#CBA96A; --brass-soft:#8A7746; --rust:#C07456;
    --bone:#ECE8E1; --bone-dim:#9AA0AB; --bone-faint:#727982;
    --glow-a:rgba(203,169,106,.06); --glow-b:rgba(143,179,164,.05);"""
    light = """
    --iron:#FAF7F0; --slab:#F2ECE1; --slab-2:#EAE2D3; --hair:#E4DBCC; --hair-2:#D8CDB9;
    --patina:#3C8A79; --patina-dim:#CBE1D9; --brass:#9C7431; --brass-soft:#B79A5E; --rust:#B4645A;
    --bone:#26241F; --bone-dim:#6C665B; --bone-faint:#928B7C;
    --glow-a:rgba(156,116,49,.05); --glow-b:rgba(60,138,121,.05);"""
    if not pastel:
        return ":root{%s\n}" % dark
    return (":root{ color-scheme:light dark;%s\n}\n"
            "@media (prefers-color-scheme:dark){:root{%s\n}}") % (light, dark)

def override_css(pastel):
    return palette_css(pastel) + (r"""
  /* ============ Cleo design system (appended override — wins by cascade order) ============ *
     Type roles:  --display Fraunces (masthead/titles) · body Newsreader (prose) ·
                  --ui Archivo (labels/chips/buttons, uppercase-tracked) · Instrument Serif (italic accent). */
  :root{
    --display:"Fraunces","Newsreader",Georgia,serif;
    --ui:"Archivo","Helvetica Neue",system-ui,-apple-system,sans-serif;
    --serif:"Newsreader",Georgia,serif;
    --measure:64ch; --radius:16px;
  }
  html{-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;}
  body{font-family:var(--serif);position:relative;background:var(--iron);}
  /* Numerals: oldstyle in editorial prose (they sit in the line like a fine book),
     lining + tabular in UI labels/stats so figures align in a column. */
  .standfirst,.desc,.what,.cd,p{font-variant-numeric:oldstyle-nums proportional-nums;}
  .eyebrow,.marker,.addr,.city .stat,.subrow,.count,.cluster .meta,.maplegend,
  .cleo-tag,.cleo-colophon,.chip,.city .kicker,.country .cgo{
    font-variant-numeric:lining-nums tabular-nums;}
  /* atmospheric ground — barely-there dual glow so the dark isn't one flat note */
  body::before{content:"";position:fixed;inset:0;z-index:-1;pointer-events:none;
    background:
      radial-gradient(1200px 720px at 84% -8%, var(--glow-a), transparent 60%),
      radial-gradient(900px 640px at -6% 108%, var(--glow-b), transparent 62%);}
  ::selection{background:var(--brass);color:var(--iron);}
  /* Kill any inline monospace stragglers baked into the source markup (meta lines) */
  [style*="JetBrains"],[style*="monospace"]{font-family:var(--ui)!important;letter-spacing:.1em!important;}
  /* Kill EVERY classed monospace in the chrome (the source's own coder font). This list is the
     complete union of JetBrains-Mono selectors across all source pages (regenerate with the
     enumerator if the engine adds one). Genuine <code>/<pre> keep mono — real data, where mono belongs. */
  .addr,.applelink,.back,.chip,.cites,.city .go,.city .kicker,.city .stat,.cluster .meta,
  .count,.country .cgo,.ctrl-label,.czbadge,.eyebrow,.ledger .lbl,.maplegend,.marker,.modebtn,
  .note .tag,.pc,.ptier,.reg,.regnote,.saved li .when,.soon,.src,.srcrow .k,.subrow,.tierbadge,
  .tripbtn,.tripcount,footer,h2.sec{
    font-family:var(--ui)!important;}
  .note{font-family:var(--serif);}
  /* Badges (tier / cuisine) read as small engraved labels, not code */
  .tierbadge,.czbadge{letter-spacing:.12em;text-transform:uppercase;font-weight:600;}
  .cites,.srcrow .k{letter-spacing:.1em;}
  code,pre,kbd,samp{font-family:"JetBrains Mono",ui-monospace,SFMono-Regular,Menlo,monospace;}
  /* Refined editorial back-link (was a mono crumb) */
  .back{font-weight:600;font-size:10.5px;letter-spacing:.2em;text-transform:uppercase;
    color:var(--bone-faint);text-decoration:none;display:inline-flex;align-items:center;gap:.6em;
    transition:color .2s ease,gap .2s ease;}
  .back:hover{color:var(--brass);gap:.9em;}

  /* Signature: an oversized engraved compass watermark filling the masthead void */
  header{position:relative;}
  header::after{content:"";position:absolute;top:-40px;right:-70px;width:430px;height:430px;
    background:__HEROURI__ center/contain no-repeat;opacity:.09;pointer-events:none;z-index:0;}
  header>*{position:relative;z-index:1;}
  @media (max-width:900px){header::after{display:none;}}
  a:focus-visible,button:focus-visible,input:focus-visible,textarea:focus-visible,
  [role="button"]:focus-visible,.chip:focus-visible,.src:focus-visible,.cleo-brand:focus-visible{
    outline:2px solid var(--brass);outline-offset:3px;border-radius:4px;}
  /* Accessibility: honour reduced-motion — no hover lifts, no spinning mark, no reveals */
  @media (prefers-reduced-motion:reduce){
    *,*::before,*::after{transition-duration:.001ms!important;animation-duration:.001ms!important;}
    .city:hover,.country:hover{transform:none;}
    .cleo-brand:hover .cleo-mark{transform:none;}}

  /* -- Brand bar -- */
  .cleo-topbar{position:sticky;top:0;z-index:60;
    background:color-mix(in srgb,var(--iron) 84%,transparent);
    -webkit-backdrop-filter:saturate(150%) blur(12px);backdrop-filter:saturate(150%) blur(12px);
    border-bottom:1px solid var(--hair);}
  /* engraved keyline — a bound-volume edge across the very top */
  .cleo-topbar::before{content:"";position:absolute;top:0;left:0;right:0;height:2px;
    background:linear-gradient(90deg,var(--brass),color-mix(in srgb,var(--patina) 80%,var(--brass)),transparent 88%);}
  .cleo-bar-inner{max-width:1120px;margin:0 auto;padding:12px 24px;display:flex;align-items:center;
    justify-content:space-between;gap:18px;}
  .cleo-brand{display:inline-flex;align-items:center;gap:13px;text-decoration:none;color:var(--bone);}
  .cleo-brand:hover{text-decoration:none;}
  .cleo-mark{width:30px;height:30px;color:var(--brass);flex:none;transition:transform .6s cubic-bezier(.2,.7,.2,1);}
  .cleo-brand:hover .cleo-mark{transform:rotate(90deg);}
  .cleo-word{font-family:var(--display);font-weight:600;font-size:19px;letter-spacing:.42em;
    text-transform:uppercase;padding-left:.42em;line-height:1;}
  .cleo-tag{font-family:var(--ui);font-size:10px;font-weight:500;letter-spacing:.24em;
    text-transform:uppercase;color:var(--bone-faint);white-space:nowrap;display:flex;align-items:center;gap:.7em;}
  .cleo-tag b{color:var(--patina);font-weight:600;}
  .cleo-tag .sep{width:3px;height:3px;border-radius:50%;background:var(--brass);opacity:.7;}
  @media (max-width:640px){.cleo-tag{display:none;}}

  /* -- Editorial masthead -- */
  header .eyebrow,.eyebrow{font-family:var(--ui);font-size:11px;font-weight:600;
    letter-spacing:.26em;text-transform:uppercase;color:var(--patina);
    display:inline-flex;align-items:center;}
  header .eyebrow::before,.eyebrow::before{content:"";width:22px;height:1px;margin-right:14px;
    background:var(--brass);opacity:.8;flex:none;}
  h1{font-family:var(--display);font-weight:600;font-optical-sizing:auto;
    font-variation-settings:"opsz" 144,"SOFT" 28,"WONK" 0;
    letter-spacing:-.02em;text-transform:none;line-height:.98;}
  h1 .thin{font-family:"Instrument Serif",Georgia,serif;font-style:italic;font-weight:400;
    text-transform:none;letter-spacing:0;color:var(--brass);line-height:1.05;max-width:30ch;}
  .standfirst{font-family:var(--serif);color:color-mix(in srgb,var(--bone) 72%,var(--bone-dim));
    max-width:var(--measure);font-size:19px;line-height:1.62;}
  .standfirst strong{color:var(--bone);font-weight:500;}
  header a{color:var(--patina);}

  /* -- Section headings / clusters -- */
  h2.sec{font-family:var(--ui);font-weight:600;letter-spacing:.2em;color:var(--brass-soft);
    text-transform:uppercase;font-size:12px;position:relative;padding-left:26px;}
  h2.sec::before{content:"";position:absolute;left:0;top:50%;width:16px;height:1px;background:var(--brass);opacity:.7;}
  .cluster{border-bottom:1px solid var(--hair-2);align-items:baseline;}
  .cluster h2{font-family:var(--display);font-weight:600;text-transform:none;letter-spacing:-.015em;
    font-size:clamp(20px,3vw,26px);}
  .cluster .meta{font-family:var(--ui);font-weight:500;color:var(--bone-faint);
    letter-spacing:.12em;text-transform:uppercase;font-size:10.5px;}

  /* -- Entries -- */
  .entry h3{font-family:var(--display);font-weight:600;letter-spacing:-.015em;text-transform:none;}
  .marker{font-family:var(--ui);font-weight:600;color:var(--brass);letter-spacing:.06em;}
  .addr{font-family:var(--ui);letter-spacing:.04em;font-size:11.5px;text-transform:uppercase;}

  /* -- Cards (country / city / panel) -- */
  .city,.country,.panel{border:1px solid var(--hair);border-radius:var(--radius);
    background:linear-gradient(180deg,color-mix(in srgb,var(--slab) 96%,var(--bone) 4%),var(--slab));
    position:relative;overflow:hidden;
    display:flex;flex-direction:column;
    transition:border-color .2s ease,transform .2s ease,box-shadow .2s ease;}
  /* Pin the "OPEN →" CTA to the card floor so a row of cards aligns like a contents page */
  .city .go,.country .cgo{margin-top:auto;padding-top:16px;}
  .city::after,.country::after{content:"";position:absolute;left:0;right:0;top:0;height:2px;
    background:linear-gradient(90deg,var(--brass),var(--patina));transform:scaleX(0);transform-origin:left;
    transition:transform .32s cubic-bezier(.2,.7,.2,1);opacity:.9;}
  .city:hover,.country:hover{border-color:color-mix(in srgb,var(--brass) 55%,var(--hair));
    transform:translateY(-4px);box-shadow:0 22px 48px -26px rgba(0,0,0,.6);}
  .city:hover::after,.country:hover::after{transform:scaleX(1);}
  .city.soon,.country.soon{background:transparent;}
  .city .nm,.country .cn{font-family:var(--display);font-weight:600;text-transform:none;letter-spacing:-.02em;}
  .city .kicker,.country .cgo,.city .go,.city .stat,.subrow{font-family:var(--ui);}
  /* Flag emoji -> pressed-metal medallion instead of a raw sticker on dark */
  .country .flag,.city .flag,.flag{position:relative;display:inline-flex;align-items:center;justify-content:center;
    width:46px;height:46px;border-radius:50%;border:1px solid var(--hair-2);
    background:radial-gradient(120% 120% at 30% 22%,var(--slab-2),color-mix(in srgb,var(--slab) 80%,#000 20%));
    font-size:21px;line-height:1;
    box-shadow:inset 0 1px 0 color-mix(in srgb,var(--bone) 12%,transparent),
      inset 0 -6px 12px -8px #000, 0 2px 6px -3px rgba(0,0,0,.5);
    filter:saturate(.92);}
  /* engraved inner keyline ring */
  .country .flag::after,.city .flag::after{content:"";position:absolute;inset:4px;border-radius:50%;
    border:1px solid color-mix(in srgb,var(--brass) 22%,transparent);opacity:.7;pointer-events:none;}
  .city .kicker,.country .cgo{font-weight:600;letter-spacing:.18em;text-transform:uppercase;font-size:10.5px;color:var(--patina);}
  .city .go{font-weight:600;letter-spacing:.14em;text-transform:uppercase;font-size:11px;color:var(--brass);
    display:inline-flex;align-items:center;gap:.5em;transition:gap .2s ease;}
  .city:hover .go{gap:1em;}
  .city .stat{font-weight:500;letter-spacing:.08em;color:var(--bone-faint);text-transform:uppercase;font-size:10.5px;}
  .subrow{letter-spacing:.06em;}

  /* -- Chips / filters (editorial pills, not a dashboard) -- */
  .ctrl-label,.controls .ctrl-label{font-family:var(--ui);font-weight:600;letter-spacing:.18em;
    text-transform:uppercase;color:var(--bone-faint);font-size:10px;}
  .chip{font-family:var(--ui);font-weight:500;border:1px solid var(--hair-2);border-radius:999px;
    color:var(--bone-dim);background:transparent;transition:.16s ease;letter-spacing:.05em;
    text-transform:none;padding:7px 14px;}
  .chip:hover{border-color:var(--brass);color:var(--bone);background:color-mix(in srgb,var(--brass) 8%,transparent);}
  .chip[aria-pressed="true"]{background:var(--brass);border-color:var(--brass);color:var(--iron);font-weight:600;
    box-shadow:inset 0 1px 2px color-mix(in srgb,#000 22%,transparent);}

  /* Inline prose links — engraved brass underline that grows on hover */
  .standfirst a,.what a,.desc a,.cd a,.panel p a{color:var(--brass);text-decoration:none;
    box-shadow:inset 0 -1px 0 color-mix(in srgb,var(--brass) 42%,transparent);
    transition:box-shadow .2s ease,color .2s ease;}
  .standfirst a:hover,.what a:hover,.desc a:hover,.cd a:hover,.panel p a:hover{
    color:var(--bone);box-shadow:inset 0 -2px 0 var(--brass);}

  /* -- Inputs / buttons -- */
  #search,input.city-in,textarea{border-radius:11px;font-family:var(--serif);}
  #search{font-family:var(--ui);letter-spacing:.02em;}
  #search:focus,input.city-in:focus,textarea:focus{border-color:var(--brass);outline:none;
    box-shadow:0 0 0 3px color-mix(in srgb,var(--brass) 18%,transparent);}
  button,.tripbtn,.modebtn,.count,.city-in,.saved li .when{font-family:var(--ui);letter-spacing:.08em;}
  .modebar{border:1px solid var(--hair-2);border-radius:13px;overflow:hidden;}
  .modebtn{font-weight:600;letter-spacing:.1em;text-transform:uppercase;}
  .modebtn[aria-pressed="true"]{background:var(--brass);color:var(--iron);}
  .tripbtn{border-radius:10px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;font-size:11px;}
  .count{color:var(--brass-soft);letter-spacing:.12em;text-transform:uppercase;}

  /* -- Sources / notes / legend -- */
  .src{border-radius:999px;font-family:var(--ui);border-color:var(--patina-dim);letter-spacing:.03em;}
  .src:hover,.src:focus-visible{background:var(--patina);color:var(--iron);}
  .ledger .lbl{font-family:var(--ui);font-weight:600;letter-spacing:.16em;text-transform:uppercase;}
  .note{border-left:2px solid var(--brass);border-radius:0 10px 10px 0;
    background:color-mix(in srgb,var(--slab) 90%,var(--brass) 4%);}
  .note.warn{border-left-color:var(--rust);}
  .note .tag{font-family:var(--ui);font-weight:600;letter-spacing:.14em;}
  .maplegend{font-family:var(--ui);letter-spacing:.06em;color:var(--bone-dim);text-transform:uppercase;font-size:10px;font-weight:500;}
  /* Brand the trip-builder tick + every native control: your list fills with brass, not browser blue */
  input[type=checkbox],input[type=radio]{accent-color:var(--brass);}
  #map{border:1px solid var(--hair-2);border-radius:14px;}
  #tilewarn,#tripbar .tripinner{font-family:var(--ui);}

  /* -- Footer + Cleo colophon -- */
  footer{color:var(--bone-dim);border-top:1px solid var(--hair);}
  .cleo-colophon{max-width:1120px;margin:0 auto;padding:30px 24px 64px;border-top:1px solid var(--hair);
    display:flex;align-items:center;gap:14px;flex-wrap:wrap;
    font-family:var(--ui);font-weight:500;font-size:10.5px;letter-spacing:.16em;
    text-transform:uppercase;color:var(--bone-faint);}
  .cleo-colophon .cleo-mark{width:20px;height:20px;color:var(--brass);}
  .cleo-colophon b{font-family:var(--display);font-weight:600;letter-spacing:.34em;
    color:var(--bone);text-transform:uppercase;font-size:12px;padding-left:.34em;}
  .cleo-colophon .cleo-dot{width:3px;height:3px;border-radius:50%;background:var(--brass);opacity:.6;}
""").replace("__HEROURI__", HERO_URI)

def brand_bar(home_href):
    return (
        '\n<div class="cleo-topbar"><div class="cleo-bar-inner">'
        '<a class="cleo-brand" href="%s" aria-label="Cleo — home">'
        '<span class="cleo-mark">%s</span><span class="cleo-word">Cleo</span></a>'
        '<span class="cleo-tag">Sourced city guides<span class="sep"></span>'
        '<b>where to go, after hours</b></span>'
        '</div></div>\n' % (home_href, COMPASS_SVG))

def colophon():
    return ('\n<div class="cleo-colophon"><span class="cleo-mark">%s</span>'
            '<b>Cleo</b><span class="cleo-dot"></span>'
            '<span>Sourced city guides · every place traceable to its source</span>'
            '</div>\n' % COMPASS_SVG)

def head_block(title, desc, og_url, pastel):
    t = html.escape(title, quote=True)
    d = html.escape(desc, quote=True)
    theme_dark = "#101318"; theme_light = "#FAF7F0"
    tc = ('<meta name="theme-color" content="%s" media="(prefers-color-scheme:light)">\n'
          '<meta name="theme-color" content="%s" media="(prefers-color-scheme:dark)">'
          % (theme_light, theme_dark)) if pastel else \
         '<meta name="theme-color" content="%s">' % theme_dark
    return """
<!-- Cleo brand: fonts -->
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400&display=swap" rel="stylesheet">
<!-- Cleo brand: social share -->
<meta property="og:type" content="website">
<meta property="og:site_name" content="Cleo — Sourced City Guides">
<meta property="og:title" content="{t}">
<meta property="og:description" content="{d}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{img}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Cleo — sourced city guides. Where to go, after hours.">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{t}">
<meta name="twitter:description" content="{d}">
<meta name="twitter:image" content="{img}">
{tc}
<!-- Cleo brand: design system (appended so it wins by cascade order) -->
<style id="cleo-ds">{css}</style>
""".format(t=t, d=d, url=og_url, img=OG_IMAGE, tc=tc, css=override_css(pastel))

# ---------------------------------------------------------------- per-page transform
TITLE_RE = re.compile(r"<title>([\s\S]*?)</title>", re.IGNORECASE)
DESC_RE = re.compile(r'<meta[^>]*name=["\']description["\'][^>]*content=["\']([^"\']*)["\']', re.IGNORECASE)
BODY_RE = re.compile(r"(<body[^>]*>)", re.IGNORECASE)

def clean_text(s):
    return re.sub(r"\s+", " ", html.unescape(s or "")).strip()

def transform(rel_path, src, mirror_set):
    pastel = rel_path.startswith("Singapore/") or rel_path.startswith("Vietnam/")
    depth = rel_path.count("/")
    home_href = ("../" * depth) + "index.html" if depth else "index.html"

    tm = TITLE_RE.search(src)
    raw_title = clean_text(tm.group(1)) if tm else "Cleo"
    # Brand the OG title without altering the page's own <title>
    og_title = raw_title if raw_title.lower().startswith("cleo") else (raw_title + " — Cleo")
    dm = DESC_RE.search(src)
    desc = clean_text(dm.group(1)) if dm else "Source-traceable travel field guides on interactive maps."
    if len(desc) > 300:
        desc = desc[:297].rstrip() + "…"
    og_url = BETA_BASE + "/" + rel_path

    # 1) head injection (chrome only; </head> is outside any script)
    hb = head_block(og_title, desc, og_url, pastel)
    if "</head>" in src:
        out = src.replace("</head>", hb + "</head>", 1)
    else:
        out = hb + src

    # 2) brand bar after <body> + colophon before </body>
    out = BODY_RE.sub(lambda m: m.group(1) + brand_bar(home_href), out, count=1)
    if "</body>" in out:
        out = out.replace("</body>", colophon() + "</body>", 1)
    else:
        out = out + colophon()

    # 3) link rewiring (outside scripts only)
    out = outside_scripts_apply(out, make_link_rewriter(rel_path, mirror_set))
    return out, pastel

# ---------------------------------------------------------------- verification
def verify(rel_path, src, out):
    problems = []
    if scripts_of(src) != scripts_of(out):
        problems.append("SCRIPT BYTES CHANGED")
    for name in ("P", "F"):
        cs, co = count_records(src, name), count_records(out, name)
        if cs != co:
            problems.append("%s.length %s -> %s" % (name, cs, co))
    return problems

# ---------------------------------------------------------------- driver
def main():
    check_only = "--check" in sys.argv
    mirror = mirror_rel_paths()
    mirror_set = set(mirror)
    n_ok = n_map = 0
    failures = []
    for rel in mirror:
        src = open(os.path.join(ROOT, rel), encoding="utf-8").read()
        out, pastel = transform(rel, src, mirror_set)
        probs = verify(rel, src, out)
        cp = count_records(src, "P")
        if cp is not None:
            n_map += 1
        if probs:
            failures.append((rel, probs))
            continue
        if not check_only:
            dst = os.path.join(BETA, rel)
            os.makedirs(os.path.dirname(dst), exist_ok=True)
            open(dst, "w", encoding="utf-8").write(out)
        n_ok += 1
    print(">>> Cleo beta-restyle: %d pages processed (%d are map pages with P/F data)." % (n_ok + len(failures), n_map))
    if failures:
        print(">>> FAIL — content/script integrity broke on:")
        for rel, probs in failures:
            print("     %s: %s" % (rel, "; ".join(probs)))
        sys.exit(1)
    if check_only:
        print(">>> PASS — every page's <script> bytes and P/F counts match source (no write).")
    else:
        print(">>> PASS — wrote %d restyled pages under beta/ ; all P/F counts + scripts identical to source." % n_ok)

if __name__ == "__main__":
    main()
