#!/bin/bash
# _phi_push.sh — pull (merge) + push with retry; regenerates docs/GEOCODE-BACKLOG.md on conflict (generated file).
cd /home/user/cleo-guide
for i in 1 2 3 4 5 6; do
  git pull --no-rebase -q origin claude/peaceful-goodall-i0hsrt 2>/dev/null
  U=$(git diff --name-only --diff-filter=U)
  if [ -n "$U" ]; then
    if [ "$U" = "docs/GEOCODE-BACKLOG.md" ]; then
      git checkout --theirs docs/GEOCODE-BACKLOG.md && python3 tools/geocode-status.py >/dev/null 2>&1
      git add docs/GEOCODE-BACKLOG.md && git commit -q --no-edit
    else echo "UNRESOLVED: $U"; exit 1; fi
  fi
  git push -q -u origin claude/peaceful-goodall-i0hsrt 2>/dev/null && { echo pushed; exit 0; }
  sleep $((i*2))
done
echo "push failed"; exit 1
