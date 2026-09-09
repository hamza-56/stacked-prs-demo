# Architecture

Four layers, bottom to top. Each one only depends on the layers below it.

```
public/          browser UI, talks to /api only
  src/api/       HTTP routes, parsing, status codes
    src/services/  business rules, returns Result objects
      src/models/  pure constructors and validation
        src/store/ in-memory persistence
```

`src/lib/` holds leaf utilities (ids, dates, JSON, result type) that any
layer may import. `src/middleware/` holds cross-cutting request concerns.

## The Result convention

Services never throw for expected failures. They return
`{ ok: true, value }` or `{ ok: false, error: { message, code } }`. The API
layer maps `code: 'not_found'` to 404 and everything else to 400. Only
programmer errors throw.

## Note for reviewers

This document exists because this change is too large to hold in your head
while reading the diff. That is a signal, not a solution.
