# Stacked PRs Demo

A tiny task-tracker service used to demo **GitHub Stacked Pull Requests**.

The feature "add task tagging" is split into four stacked PRs:

```
    +-- 04-docs-and-tests   -> PR #4 (base: 03-web-ui)          top
   +-- 03-web-ui            -> PR #3 (base: 02-api-endpoints)
  +-- 02-api-endpoints      -> PR #2 (base: 01-data-models)
 +-- 01-data-models         -> PR #1 (base: main)               bottom
main
```

Each PR is small enough to read in one sitting, and each shows only the
diff for its own layer.

## Running it

```bash
npm start        # http://localhost:3000
npm test
```

See `docs/API.md` for endpoints and `docs/ARCHITECTURE.md` for the layering.
