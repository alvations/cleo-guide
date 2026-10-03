#!/bin/bash
# Push helper for the 4-town Singapore session: pull/merge, auto-resolve the generated docs/GEOCODE-BACKLOG.md
# (take theirs + regenerate), push; retry. Any other conflict is reported and left for a human/agent to resolve.
cd /home/user/cleo-guide
for i in 1 2 3 4 5 6; do
flock -w 3600 .git/cleo-shared.lock bash -c '
U=$(git diff --name-only --diff-filter=U)
if [ -z "$U" ]; then git pull --no-rebase -q origin claude/peaceful-goodall-i0hsrt >/dev/null 2>&1; U=$(git diff --name-only --diff-filter=U); fi
if [ -n "$U" ]; then
  for f in $U; do if [ "$f" = docs/GEOCODE-BACKLOG.md ]; then git checkout --theirs "$f"; python3 tools/geocode-status.py >/dev/null 2>&1; git add "$f"; else echo "OTHER CONFLICT $f"; fi; done
  [ -z "$(git diff --name-only --diff-filter=U)" ] && git commit -q --no-edit
fi
git push -q -u origin claude/peaceful-goodall-i0hsrt 2>&1 | grep -v hint | tail -1'
git status -sb | head -1 | grep -qE "ahead|behind" || break; sleep $((i*2)); done
git status -sb | head -1
