#!/usr/bin/env bash
set -euo pipefail

DEFAULT_BRANCH="main"
git fetch origin

# Switch to the default branch (creates it if missing)
if git rev-parse --verify "$DEFAULT_BRANCH" >/dev/null 2>&1; then
  git checkout "$DEFAULT_BRANCH"
else
  git checkout -b "$DEFAULT_BRANCH"
fi

# Stage everything
git add -A

# Build commit message
if [[ -n "${1:-}" ]]; then
  COMMIT_MSG="$1"
else
  FILES=$(git diff --name-only --cached | head -n 5 | tr '\n' ', ' | sed 's/, $//')
  MORE=$(git diff --name-only --cached | wc -l)
  (( MORE > 5 )) && FILES="${FILES} …"
  COMMIT_MSG="AI update: changed ${FILES}"
fi

git commit -m "$COMMIT_MSG"
git push origin "$DEFAULT_BRANCH"

# Log
LOG="ai_commit_log.txt"
echo "$(date '+%Y-%m-%d %H:%M:%S') | $COMMIT_MSG | $(git rev-parse HEAD)" >> "$LOG"
