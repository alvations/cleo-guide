#!/bin/bash
# Kyoto: pull (merge) + resolve the generated backlog by regeneration + push. Run under the shared lock.
cd /home/user/cleo-guide
for i in 1 2 3 4; do
  git pull --no-rebase -q origin claude/peaceful-goodall-i0hsrt 2>/dev/null
  U=$(git diff --name-only --diff-filter=U)
  if [ -n "$U" ]; then
    for f in $U; do
      if [ "$f" = "docs/GEOCODE-BACKLOG.md" ]; then git checkout --theirs "$f"; python3 tools/geocode-status.py >/dev/null; git add "$f";
      else echo "!! unresolved conflict in $f — resolve by hand"; exit 1; fi
    done
    git commit -q --no-edit
  fi
  git push -q -u origin claude/peaceful-goodall-i0hsrt && { echo pushed; exit 0; }
  sleep $((2**i))
done
exit 1
