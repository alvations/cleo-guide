#!/bin/bash
# tools/beta/sync-push.sh — FE-A's push helper (docs/resume/README.md rules 3, 7, 8).
# Run it AFTER the full gate passed on your own commit (validate + npm test + beta:check):
#   tools/beta/sync-push.sh
# It merges origin (never rebase or force), resolves conflicts ONLY in generated beta/ by regenerating it
# (node tools/beta/build.js), runs beta:check, pushes, and succeeds ONLY when ls-remote == HEAD. A conflict in any
# source file, a conflict marker left anywhere, a failed build or beta:check, or six rejected pushes stop it loudly
# (exit ≠ 0). Then re-run the full gate on the pushed head (rule 8.5).
set -u
cd "$(git rev-parse --show-toplevel)" || exit 9
BR=claude/peaceful-goodall-i0hsrt
for i in 1 2 3 4 5 6; do
  git fetch -q origin "$BR"
  if ! git merge-base --is-ancestor "origin/$BR" HEAD; then
    git merge --no-edit "origin/$BR" >/dev/null 2>&1
    if git diff --name-only --diff-filter=U | grep -qv "^beta/"; then echo "NON-BETA CONFLICT:"; git diff --name-only --diff-filter=U | grep -v "^beta/"; exit 2; fi
    git diff --name-only --diff-filter=U | grep "^beta/" | xargs -r git checkout --theirs --
    node tools/beta/build.js >/dev/null 2>&1 || { echo "BUILD FAILED"; exit 3; }
    git add beta
    if git grep -nI -e '^<<<<<<< ' -e '^>>>>>>> ' -- ':!beta' >/dev/null 2>&1; then echo "CONFLICT MARKERS LEFT:"; git grep -nI -e '^<<<<<<< ' -e '^>>>>>>> ' -- ':!beta' | head; exit 5; fi
    (cd tools && npm run -s beta:check >/dev/null 2>&1) || { echo "BETA:CHECK FAILED"; exit 4; }
    git rev-parse -q --verify MERGE_HEAD >/dev/null && git commit -q --no-edit
  fi
  if git push -q origin "HEAD:$BR" 2>"${TMPDIR:-/tmp}/fe-a-push.log"; then
    R=$(git ls-remote origin "refs/heads/$BR" | cut -f1); H=$(git rev-parse HEAD)
    [ "$R" = "$H" ] && { echo "PUSHED-VERIFIED $H (ls-remote matches)"; exit 0; }
  fi
  echo "retry $i: $(tail -1 "${TMPDIR:-/tmp}/fe-a-push.log")"
done
echo "PUSH FAILED after 6 tries"; exit 1
