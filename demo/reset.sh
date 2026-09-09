#!/usr/bin/env bash
# Delete the branches and PRs created by live-stack.sh so you can do another take.
#   ./demo/reset.sh            # cleans up the "live" prefix
#   PREFIX=take2 ./demo/reset.sh
set -uo pipefail

PREFIX="${PREFIX:-live}"
cd "$(dirname "$0")/.."

git checkout -q main

gh stack unstack 2>/dev/null || true

for pr in $(gh pr list --state open --json number,headRefName \
    --jq '.[] | select(.headRefName | startswith("'"$PREFIX"'")) | .number'); do
  echo "closing PR #$pr"
  gh pr close "$pr" --delete-branch >/dev/null 2>&1 || true
done

for branch in $(git branch --list "${PREFIX}-*" | tr -d ' *'); do
  echo "deleting local branch $branch"
  git branch -D "$branch" >/dev/null 2>&1 || true
  git push -q origin --delete "$branch" >/dev/null 2>&1 || true
done

git checkout -q main
echo "reset done"
