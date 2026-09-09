# Live demo script

Repo: https://github.com/hamza-56/stacked-prs-demo

The feature "task tagging" is split into four stacked PRs:

```
    +-- 04-tests-and-docs   -> PR #4 (base: 03-web-ui)          top
   +-- 03-web-ui            -> PR #3 (base: 02-api-endpoints)
  +-- 02-api-endpoints      -> PR #2 (base: 01-data-models)
 +-- 01-data-models         -> PR #1 (base: main)               bottom
main
```

## 1. The stack map on github.com

Open PR #3. Point at:
* the stack icon showing which layer you are on
* the stack map in the merge box: every PR, its status, one-click jump
* the diff: only the UI layer, not the model or API changes underneath

Contrast: open the "Files changed" of all four and note that as one PR
this would be ~10 files across four concerns.

## 2. CI runs on every layer

Actions tab. The workflow fires for PR #2, #3, and #4, not just the
bottom one, even though their base is not the default branch.

## 3. Mid-stack change and cascading rebase

A reviewer on PR #1 asks for a `slug` field on tasks. Do it live:

```bash
gh stack checkout 1                 # or: gh stack bottom
# edit src/models.js, add the field
git commit -am "Add slug to task model"
gh stack rebase --upstack           # replays 02, 03, 04 on top
gh stack push
```

Refresh PR #3: it now sits on the updated base, no manual rebasing.
Or trigger the same rebase server-side from the PR page.

## 4. Merging bottom-up

Merge PR #1 on github.com. Watch PR #2 re-target to `main` automatically
while #3 and #4 stay open and stay stacked. Then:

```bash
gh stack sync --prune
```

## 5. CLI navigation (optional, fast)

```bash
gh stack view --json | jq
gh stack up / down / top / bottom
```

## Reset the demo

```bash
gh stack unstack
git push origin --delete 01-data-models 02-api-endpoints 03-web-ui 04-tests-and-docs
```
