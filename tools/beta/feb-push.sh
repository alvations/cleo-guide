#!/bin/bash
# FE-B sync + push (resume protocol rule 7). Merge origin (generated beta/ conflicts -> regenerate; any source
# conflict or leftover conflict marker -> stop), rebuild beta/, push, and verify the remote ref moved. Run the gates
# (validate, npm test, beta:check) BEFORE calling this; re-run them on the merged head after.
cd "$(git rev-parse --show-toplevel)" || exit 1
for i in 1 2 3 4 5 6 7 8; do
  git pull --no-rebase -q origin claude/peaceful-goodall-i0hsrt >/dev/null 2>&1
  NB=$(git diff --name-only --diff-filter=U | grep -v "^beta/"); [ -n "$NB" ] && { echo "SOURCE CONFLICT: $NB"; exit 1; }
  U=$(git diff --name-only --diff-filter=U); [ -n "$U" ] && git checkout --theirs -- $U
  M=$(git grep -l "^<<<<<<< \|^>>>>>>> " -- tools design data docs 2>/dev/null); [ -n "$M" ] && { echo "CONFLICT MARKERS: $M"; exit 1; }
  (cd tools && node beta/build.js 2>&1 | tail -1); git add beta
  if [ -f .git/MERGE_HEAD ] || ! git diff --cached --quiet; then git commit -q --no-edit 2>/dev/null || git commit -q -m "Beta: regenerate after merge

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01PCNcUkfa5S1N1BKGzZA4xx"; fi
  P=$(git push origin HEAD:claude/peaceful-goodall-i0hsrt 2>&1)
  echo "$P" | grep -qE "^ +[0-9a-f]+\.\.[0-9a-f]+ +HEAD" && { echo "PUSHED $(git rev-parse --short HEAD)"; exit 0; }
  sleep $((i*3))
done
echo "NOT PUSHED"; exit 1
