#!/usr/bin/env bash
# Atlas FE-1: merge origin and push a green head (docs/resume/README.md §8). Generated files (beta/, QA evidence) take
# origin's side and beta/ is regenerated; a SOURCE conflict stops the script for a hand merge. Verifies ls-remote = HEAD.
set -u
cd "$(dirname "$0")/../.."
B=claude/peaceful-goodall-i0hsrt
for i in 1 2 3 4; do
  git pull -q --no-rebase origin "$B" >/dev/null 2>&1
  U=$(git diff --name-only --diff-filter=U)
  if [ -n "$U" ]; then
    NB=$(echo "$U" | grep -vE '^(beta/|qa/|design/beta/eval|docs/BETA-LOG.md)')
    if [ -n "$NB" ]; then echo "SOURCE CONFLICT (merge by hand): $NB"; exit 2; fi
    echo "$U" | grep -E '^(beta/|qa/|design/beta/eval)' | xargs -r git checkout --theirs --
    python3 - <<'EOF'
import re
p = 'docs/BETA-LOG.md'; s = open(p).read()
s = re.sub(r'<<<<<<< [^\n]*\n(.*?)=======\n(.*?)>>>>>>> [^\n]*\n', lambda m: m.group(2) + m.group(1), s, flags=re.S)
open(p, 'w').write(s)
EOF
  fi
  node tools/beta/build.js 2>&1 | grep -q 'FAIL' && { echo "build refused to write (a source error)"; exit 1; }
  git add -A
  git diff --cached --quiet || git commit -qm "Merge origin; beta/ regenerated

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01PCNcUkfa5S1N1BKGzZA4xx"
  (cd tools && npm run validate >/dev/null 2>&1 && npm run beta:check >/dev/null 2>&1) || { echo "fast gate failed"; exit 1; }
  if git push -q origin "HEAD:$B" 2>/dev/null; then
    R=$(git ls-remote origin "refs/heads/$B" | cut -f1); H=$(git rev-parse HEAD)
    [ "$R" = "$H" ] && { echo "pushed $H (ls-remote verified)"; exit 0; } || { echo "ls-remote $R != HEAD $H"; exit 1; }
  fi
  sleep $((2 ** i))
done
echo "push failed after retries"; exit 1
