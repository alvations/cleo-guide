#!/bin/bash
# Osaka: pull (merge) + push with union-resolution of the shared generated/registry files. Run under the shared lock.
cd /home/user/cleo-guide
for i in 1 2 3 4 5; do
  git pull --no-rebase -q origin claude/peaceful-goodall-i0hsrt >/dev/null 2>&1
  if git status --short | grep -q "^UU"; then
    for f in $(git diff --name-only --diff-filter=U); do
      case "$f" in
        data/geocodes.json|data/sources.json)
          git show :2:$f > /tmp/claude-0/osk_o.json; git show :3:$f > /tmp/claude-0/osk_t.json
          python3 - "$f" <<'PY'
import json,sys
f=sys.argv[1]; o=json.load(open('/tmp/claude-0/osk_o.json')); t=json.load(open('/tmp/claude-0/osk_t.json'))
def union(a,b):  # theirs b wins except where ours adds keys / osaka subtree
    if isinstance(a,dict) and isinstance(b,dict):
        r=dict(b)
        for k,v in a.items():
            if k not in b: r[k]=v
            elif k=='osaka': r[k]=v
            else: r[k]=union(v,b[k])
        return r
    if isinstance(a,list) and isinstance(b,list):
        r=list(b); seen={json.dumps(x,sort_keys=True) for x in b}
        for x in a:
            if json.dumps(x,sort_keys=True) not in seen: r.append(x)
        return r
    return b
json.dump(union(o,t),open(f,'w'),ensure_ascii=False,indent=1)
PY
          git add "$f";;
        docs/GEOCODE-BACKLOG.md) git checkout --theirs "$f"; git add "$f";;
        docs/AGENT-PROMPTS.md|docs/RESEARCH-LOG.md|docs/CITIES.md)  # append-only / per-row docs: keep both sides
          python3 - "$f" <<'PY'
import re,sys
f=sys.argv[1]; s=open(f).read()
s=re.sub(r"^<<<<<<< [^\n]*\n(.*?)^=======\n(.*?)^>>>>>>> [^\n]*\n", lambda m: m.group(1)+"".join(l for l in m.group(2).splitlines(True) if not (l.startswith("| Osaka") and "| Osaka" in m.group(1))), s, flags=re.S|re.M)
open(f,"w").write(s)
PY
          git add "$f";;
        *) echo "UNHANDLED CONFLICT $f"; exit 1;;
      esac
    done
    python3 tools/geocode-status.py >/dev/null 2>&1; git add docs/GEOCODE-BACKLOG.md
    git commit -q --no-edit
  fi
  git push -q -u origin claude/peaceful-goodall-i0hsrt 2>/dev/null && { echo PUSHED; git log --oneline -1; exit 0; }
  sleep $((2**i))
done
echo PUSH FAILED; exit 1
