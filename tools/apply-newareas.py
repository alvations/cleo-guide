#!/usr/bin/env python3
# apply-newareas.py — the reusable NEW-AREA step. A corridor/expansion agent that reaches a place needing a
# map area that doesn't exist yet writes the record as {"a":"<NEWID>", "_newarea":"<Human Area Name>", ...}.
# This tool adds every such area to that city's data/<city>-research/consolidate.py (AREAS + AC colour, dedup),
# then strips the `_newarea` keys from the research records. Replaces hand-editing consolidate.py per wave.
#
#   python3 tools/apply-newareas.py <city-key>            # e.g. dayton-oh, columbus-oh
import json, sys, os, glob, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# a palette of distinct, legible marker colours to draw from for new areas (avoids clashing greys)
PALETTE = ["#A6588C", "#5B8DEF", "#E07A5F", "#3D9970", "#B5651D", "#6A8CAF", "#C05780", "#7D8C38",
           "#9B5DE5", "#00A6A6", "#D4A017", "#8D6E63"]

def research_dir(key):
    full = os.path.join(ROOT, "data", f"{key}-research")
    slug = key if os.path.isdir(full) else key.rsplit("-", 1)[0]
    return os.path.join(ROOT, "data", f"{slug}-research"), slug

def main():
    key = (sys.argv[1] if len(sys.argv) > 1 else "").strip()
    if not key:
        print("usage: python3 tools/apply-newareas.py <city-key>"); sys.exit(2)
    rdir, slug = research_dir(key)
    cpath = os.path.join(rdir, "consolidate.py")
    if not os.path.exists(cpath):
        print("no consolidate.py at", cpath); sys.exit(1)

    # collect {id: name} from research records carrying _newarea
    research = [p for p in glob.glob(os.path.join(rdir, "*.json"))
                if not os.path.basename(p).startswith(("_", slug[:3] + "_", "geo_"))
                and "dataset" not in os.path.basename(p)]
    newareas = {}
    touched_files = []
    for path in research:
        try:
            d = json.load(open(path, encoding="utf-8"))
        except Exception:
            continue
        items = d if isinstance(d, list) else (d.get("food", []) + d.get("sights", []))
        changed = False
        for x in items:
            if isinstance(x, dict) and x.get("_newarea"):
                aid = x.get("a")
                if aid:
                    newareas.setdefault(aid, x["_newarea"])
                del x["_newarea"]; changed = True
        if changed:
            json.dump(d, open(path, "w", encoding="utf-8"), indent=1, ensure_ascii=False)
            touched_files.append(os.path.basename(path))
    if not newareas:
        print(f"{key}: no `_newarea` records found — nothing to add."); return

    src = open(cpath, encoding="utf-8").read()
    existing_ids = set(re.findall(r'\{"id":"(\w+)"', src))
    used_colors = set(re.findall(r'"#[0-9A-Fa-f]{6}"', src))
    to_add = {aid: nm for aid, nm in newareas.items() if aid not in existing_ids}
    if not to_add:
        print(f"{key}: areas already present {sorted(newareas)}; stripped _newarea from {len(touched_files)} file(s).")
        return

    # 1) insert into AREAS = [ ... ]  (before its closing "]")
    m = re.search(r'(AREAS\s*=\s*\[)(.*?)(\n\])', src, re.S)
    if not m:
        print("could not find AREAS list in consolidate.py — aborting"); sys.exit(1)
    area_lines = "".join(f'\n {{"id":"{aid}","n":"{nm}"}},' for aid, nm in to_add.items())
    src = src[:m.end(2)] + area_lines + src[m.end(2):]

    # 2) insert colours into AC = { ... }  (before its closing "}")
    m2 = re.search(r'(AC\s*=\s*\{)(.*?)(\})', src, re.S)
    if not m2:
        print("could not find AC dict in consolidate.py — aborting"); sys.exit(1)
    palette = [c for c in PALETTE if f'"{c}"' not in used_colors] or PALETTE
    ac_add = ""
    for i, aid in enumerate(to_add):
        ac_add += f',"{aid}":"{palette[i % len(palette)]}"'
    # place after the last existing entry, before the closing brace
    inner = src[m2.start(2):m2.end(2)].rstrip()
    src = src[:m2.start(2)] + inner + ac_add + src[m2.end(2):]

    open(cpath, "w", encoding="utf-8").write(src)
    print(f"{key}: added {len(to_add)} area(s) to consolidate.py: " +
          ", ".join(f'{aid} ("{nm}")' for aid, nm in to_add.items()))
    print(f"  stripped _newarea from {len(touched_files)} research file(s). "
          f"Ensure each new area has a geocoded tier-1 before build (the build asserts it).")

if __name__ == "__main__":
    main()
