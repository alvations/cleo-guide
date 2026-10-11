"""R7 evaluator (copy of r6/tools/probe-css.py): static style-discipline census of beta/assets/*.css (+ the inline <style> of one city page).
Usage: python3 probe-css.py <tree-root> [label]. Counts distinct raw values vs token uses per property."""
import re, sys, glob, os, collections, json
root, label = sys.argv[1], (sys.argv[2] if len(sys.argv) > 2 else '')
css = ''
for f in sorted(glob.glob(os.path.join(root, 'beta/assets/*.css'))):
    css += open(f, encoding='utf-8').read()
page = open(os.path.join(root, 'beta/cities/tokyo.html'), encoding='utf-8').read()
inline = ''.join(re.findall(r'<style[^>]*>(.*?)</style>', page, re.S))
css_all = css + inline
css_all = re.sub(r'/\*.*?\*/', '', css_all, flags=re.S)
decl = re.findall(r'(?<![-\w])(font-size|border-radius|letter-spacing|box-shadow|font-weight|line-height|font-family|font-variant-numeric)\s*:\s*([^;}]+)', css_all)
out = {}
for prop in ['font-size', 'border-radius', 'letter-spacing', 'box-shadow', 'font-weight', 'line-height', 'font-family', 'font-variant-numeric']:
    vals = [v.strip().replace('!important', '').strip() for p, v in decl if p == prop]
    tok = [v for v in vals if v.startswith('var(') or v in ('inherit', 'unset', 'initial', 'none', '0', 'normal')]
    raw = [v for v in vals if v not in tok]
    c = collections.Counter(raw)
    out[prop] = {'decls': len(vals), 'token_or_keyword': len(tok), 'raw': len(raw), 'distinct_raw': len(c), 'distinct_all': len(set(vals)), 'top_raw': c.most_common(8)}
fams = sorted(set(re.findall(r"font-family\s*:\s*['\"]?([A-Za-z][\w \-]+)", css_all)))
ff = re.findall(r"@font-face\s*{[^}]*font-family\s*:\s*['\"]?([^;'\"]+)", css_all)
out['@font-face families'] = sorted(set(ff))
out['tabular-nums rules'] = len(re.findall(r'tabular-nums|var\(--num\)', css_all))
out['css bytes'] = len(css.encode())
out['tokens'] = {k: len(re.findall(r'--' + k + r'[\w-]*\s*:', css_all)) for k in ['fs', 'r-', 'radius', 'shadow', 'e-', 'sp', 'font']}
print(json.dumps({'label': label, **out}, ensure_ascii=False, indent=1))
