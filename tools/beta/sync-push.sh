#!/bin/bash
# tools/beta/sync-push.sh — FE-A's push helper (docs/resume/README.md rules 3, 7, 8).
# Run it AFTER the full gate passed on your own commit (validate + npm test + beta:check):
#   tools/beta/sync-push.sh
# It merges origin (never rebase or force), resolves conflicts ONLY in generated beta/ by regenerating it
# (node tools/beta/build.js), runs beta:check, pushes, and succeeds ONLY when ls-remote == HEAD. A conflict in any
# source file, a conflict marker left anywhere, a failed build or beta:check, or six rejected pushes stop it loudly
# (exit ≠ 0). A clean merge whose rebuild changes beta/ gets its own commit; a dirty beta/ never pushes (exit 6).
# Then re-run the full gate on the pushed head (rule 8.5). Test: tools/beta/test-sync-push.js.
set -u
cd "$(git rev-parse --show-toplevel)" || exit 9
BR=${CLEO_BRANCH:-claude/peaceful-goodall-i0hsrt}
# trailers for the regeneration commit: set CLEO_TRAILERS to your lane's lines (default: the team's)
TRAILERS=${CLEO_TRAILERS:-$'Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>\nClaude-Session: https://claude.ai/code/session_01PCNcUkfa5S1N1BKGzZA4xx'}
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
    # the merge race (8846b138): two green commits can go over a budget together — re-check the budgets on the merged tree
    [ ! -f tools/beta/qa/test-eager-budget.js ] || node tools/beta/qa/test-eager-budget.js || { echo "EAGER-JS BUDGET FAILED after the merge"; exit 7; }
    [ ! -f tools/beta/qa/test-dom-budget.js ] || node tools/beta/qa/test-dom-budget.js >/dev/null 2>&1 || { echo "INITIAL-DOM BUDGET FAILED after the merge (node tools/beta/qa/test-dom-budget.js)"; exit 7; }
    git rev-parse -q --verify MERGE_HEAD >/dev/null && git commit -q --no-edit
    # a CLEAN merge can still leave beta/ stale: the rebuild above staged it, so commit it (platform, 2026-10-16)
    git diff --cached --quiet || git commit -q -m "Merge origin; beta/ regenerated" -m "$TRAILERS"
  fi
  # never push a HEAD that lacks the regenerated beta/ the working tree has
  if [ -n "$(git status --porcelain beta)" ]; then echo "BETA/ NOT COMMITTED:"; git status --porcelain beta | head; exit 6; fi
  if git push -q origin "HEAD:$BR" 2>"${TMPDIR:-/tmp}/fe-a-push.log"; then
    R=$(git ls-remote origin "refs/heads/$BR" | cut -f1); H=$(git rev-parse HEAD)
    [ "$R" = "$H" ] && { echo "PUSHED-VERIFIED $H (ls-remote matches)"; exit 0; }
  fi
  echo "retry $i: $(tail -1 "${TMPDIR:-/tmp}/fe-a-push.log")"
done
echo "PUSH FAILED after 6 tries"; exit 1
