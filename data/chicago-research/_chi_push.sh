#!/bin/bash
# Pull+push loop for the shared branch. Shared generated files that conflict are resolved by taking the
# remote copy and regenerating Chicago's part (geocodes via geo-merge, backlog via geocode-status).
cd /home/user/cleo-guide; B=claude/peaceful-goodall-i0hsrt; L=.git/cleo-shared.lock
for i in 1 2 3 4 5 6; do
  flock -w 3600 $L bash -c '
    B=claude/peaceful-goodall-i0hsrt
    git diff --name-only --diff-filter=U | grep -q . || git pull --no-rebase -q origin $B >/dev/null 2>&1
    U=$(git diff --name-only --diff-filter=U)
    if [ -n "$U" ]; then
      for f in $U; do case $f in
        data/geocodes.json|docs/GEOCODE-BACKLOG.md) git checkout --theirs $f ;;
        *) echo "UNHANDLED CONFLICT $f"; exit 2 ;; esac; done
      echo "$U" | grep -q geocodes.json && python3 tools/geo-merge.py chicago-il --only "_geoout_*.json" >/dev/null
      python3 tools/geocode-status.py >/dev/null
      git add data/geocodes.json docs/GEOCODE-BACKLOG.md && git commit -q --no-edit
    fi
    git push -q -u origin $B 2>&1 | grep -v hint | tail -1' || exit 2
  git status | sed -n 2p | grep -q "up to date" && { echo PUSHED; exit 0; }
  sleep 3
done; echo "push not done"; exit 1
