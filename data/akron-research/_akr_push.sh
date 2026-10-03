#!/bin/bash
# Akron: pull --no-rebase + push with auto-resolution of the generated GEOCODE-BACKLOG.md (regenerated, never hand-merged).
cd /home/user/cleo-guide
for i in 1 2 3 4 5; do
  if [ -n "$(git diff --name-only --diff-filter=U)" ] || ! git pull --no-rebase -q origin claude/peaceful-goodall-i0hsrt; then
    U=$(git diff --name-only --diff-filter=U)
    if [ "$U" = "docs/GEOCODE-BACKLOG.md" ]; then
      git checkout --theirs docs/GEOCODE-BACKLOG.md && python3 tools/geocode-status.py >/dev/null 2>&1
      git add docs/GEOCODE-BACKLOG.md && git commit -q --no-edit || exit 1
    elif [ -n "$U" ]; then echo "UNRESOLVED: $U"; exit 1; fi
  fi
  git push -q -u origin claude/peaceful-goodall-i0hsrt && { echo PUSHED; exit 0; }
  sleep $((2**i))
done
exit 1
