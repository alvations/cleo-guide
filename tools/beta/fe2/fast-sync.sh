#!/bin/bash
# fast sync: merge origin → regenerate beta/ → validate + beta:check → commit → push; up to 12 tries
# Atlas FE-2: docs/resume/README.md rule 8 (origin moves faster than the full gate). Run the full gate on your own commit first; run it again on the pushed head after.
cd "$(git rev-parse --show-toplevel)" || exit 1; B=claude/peaceful-goodall-i0hsrt
for i in $(seq 1 12); do
  git fetch -q origin $B || { sleep 4; continue; }
  if ! git merge-base --is-ancestor origin/$B HEAD; then
    git merge --no-edit origin/$B >/dev/null 2>&1
    U=$(git diff --name-only --diff-filter=U)
    if echo "$U" | grep -v '^beta/' | grep -q .; then echo "CONFLICT outside beta/:"; echo "$U" | grep -v '^beta/'; exit 2; fi
    echo "$U" | grep '^beta/' | xargs -r git checkout --theirs --
    (cd tools && npm install --no-audit --no-fund >/dev/null 2>&1; node beta/build.js 2>&1 | tail -1)
    (cd tools && npm run validate >/dev/null 2>&1) || { echo "validate FAIL"; exit 3; }
    (cd tools && node beta/build.js --check 2>&1 | tail -1 | grep -q PASS) || { echo "beta:check FAIL"; exit 3; }
    git add -A beta tools && git commit -q -m "Merge origin into Atlas FE-2 slice 2; beta/ regenerated

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01PCNcUkfa5S1N1BKGzZA4xx" >/dev/null 2>&1
  fi
  if git push origin HEAD:$B >/dev/null 2>&1; then echo "PUSHED $(git rev-parse HEAD) (try $i)"; exit 0; fi
  echo "try $i rejected"
done
exit 1
