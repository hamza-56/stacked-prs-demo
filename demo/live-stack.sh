#!/usr/bin/env bash
# Build a three-layer stack from scratch, live, on camera.
#
#   ./demo/live-stack.sh              # branches: live-01-… live-02-… live-03-…
#   PREFIX=take2 ./demo/live-stack.sh # use a different prefix for another take
#   STEP=1 ./demo/live-stack.sh       # pause before each command, press enter to run
#
# Tear it down again with ./demo/reset.sh
set -euo pipefail

PREFIX="${PREFIX:-live}"
STEP="${STEP:-0}"

bold=$'\033[1m'; dim=$'\033[2m'; off=$'\033[0m'

say()  { printf '\n%s# %s%s\n' "$dim" "$1" "$off"; }
run()  {
  printf '\n%s$ %s%s\n' "$bold" "$*" "$off"
  [ "$STEP" = "1" ] && read -r -p "${dim}[enter]${off}" _
  "$@"
}

cd "$(dirname "$0")/.."
git checkout -q main
git pull -q

# ---------------------------------------------------------------- layer 1
say "Start the stack. The first branch is the bottom, based on main."
run gh stack init "${PREFIX}-01-due-dates"

say "Layer 1: the model helper. Nothing above it exists yet."
cat > src/due.js << 'EOF'
export function parseDue(input) {
  if (!input) return null;
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) throw new Error('invalid due date');
  return date.toISOString();
}

export function dueLabel(iso, from = Date.now()) {
  if (!iso) return '';
  const days = Math.floor((new Date(iso) - from) / 86400000);
  if (days < 0) return `overdue by ${Math.abs(days)}d`;
  return days === 0 ? 'due today' : `due in ${days}d`;
}
EOF
run git add src/due.js
run git commit -qm "Add due-date parsing and labels"

# ---------------------------------------------------------------- layer 2
say "New concern, so a new layer. This branches off layer 1, not off main."
run gh stack add "${PREFIX}-02-due-endpoint"

cat > src/dueApi.js << 'EOF'
import { route } from './server.js';
import { parseDue, dueLabel } from './due.js';

export function registerDueRoutes() {
  route('GET', '/api/due', (req, res, url) => {
    const iso = parseDue(url.searchParams.get('at'));
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ dueAt: iso, label: dueLabel(iso) }));
  });
}
EOF
run git add src/dueApi.js
run git commit -qm "Add GET /api/due endpoint"

# ---------------------------------------------------------------- layer 3
say "One more layer for the UI, which depends on the endpoint below it."
run gh stack add "${PREFIX}-03-due-badge"

mkdir -p public
cat > public/dueBadge.js << 'EOF'
export async function renderDueBadge(el, dueAt) {
  if (!dueAt) return;
  const res = await fetch(`/api/due?at=${encodeURIComponent(dueAt)}`);
  const { label } = await res.json();
  el.textContent = label;
  el.className = label.startsWith('overdue') ? 'due overdue' : 'due';
}
EOF
run git add public/dueBadge.js
run git commit -qm "Show a due-date badge on each task"

# ---------------------------------------------------------------- ship it
say "Three branches, three concerns. Look at the chain before pushing."
run gh stack view --json

say "One command: pushes every branch, opens a PR per layer, links them as a stack."
run gh stack submit --auto --open

say "Done. Every PR has the one below it as its base."
gh pr list --json number,title,baseRefName,headRefName \
  --jq '.[] | select(.headRefName | startswith("'"$PREFIX"'")) | "#\(.number)  \(.headRefName)  base: \(.baseRefName)"'
