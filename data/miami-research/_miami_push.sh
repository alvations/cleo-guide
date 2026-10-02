#!/bin/bash
# usage: _miami_push.sh "msg" paths...   (run under the shared lock)
cd /home/user/cleo-guide
msg="$1"; shift
git add "$@" && git commit -q -m "$msg" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_011WhyqJrfkZKDGQ1bVqMRyN"
for i in 1 2 3 4; do
  git pull --no-rebase -q origin claude/peaceful-goodall-i0hsrt && git push -q -u origin claude/peaceful-goodall-i0hsrt && { echo PUSHED; exit 0; }
  sleep $((2**i))
done; echo PUSHFAIL
