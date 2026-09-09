# API

All responses are JSON. Errors are `{ "error": "message" }`.

## Tasks

| Method | Path | Body / query | Notes |
|--------|------|--------------|-------|
| GET | `/api/tasks` | `?tag=&projectId=&state=&assigneeId=` | List with optional filters |
| POST | `/api/tasks` | `{ title, tags?, projectId?, assigneeId?, dueAt? }` | 201 on success |
| GET | `/api/task` | `?id=` | 404 if missing |
| POST | `/api/task/tags` | `?id=` + `{ tags: [] }` | Replaces the tag set |
| POST | `/api/task/state` | `?id=` + `{ state }` | `todo`, `doing`, `done` |

## Projects

| Method | Path | Body / query |
|--------|------|--------------|
| GET | `/api/projects` | `?archived=true` to include archived |
| POST | `/api/projects` | `{ name, color? }` |
| POST | `/api/project/archive` | `?id=` |

## Tags, users, search

| Method | Path | Notes |
|--------|------|-------|
| GET | `/api/tags` | Tag counts, most used first |
| GET | `/api/tags/suggest` | `?q=` prefix match, max 10 |
| GET | `/api/users` | All users |
| GET | `/api/me` | Requires `x-user-id` header |
| GET | `/api/search` | `?q=` across titles and tags |
