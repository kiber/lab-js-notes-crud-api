# Notes CRUD API

## Features
- CRUD operations for notes
- API versioning via `API_BASE_PATH` (default: `/api/v1`)
- Auth middleware that validates bearer tokens via external auth service
- Soft delete (`isDeleted: true`) instead of hard delete
- Filtering, search, sorting, and pagination
- Structured logging with Winston
- Unit tests with Jest

## Installation
```bash
npm install
```

## Run
```bash
# development (nodemon)
npm run dev

# production-like
npm start
```

Service health endpoint:
- `GET /health`

## Authentication
All notes endpoints require:

```http
Authorization: Bearer <token>
```

The token is verified by calling:
- `POST {AUTH_SERVICE_URL}/auth/verify`

If verification fails, API returns `401 Unauthorized`.

## API Base URL
By default (from `.env.example`):
- `API_BASE_PATH=/api/v1`

So notes endpoints are under:
- `/api/v1/notes`

## Notes API
Base path used below:
- `{API_BASE_PATH}/notes`

### Create Note
- `POST {API_BASE_PATH}/notes`

Request body:
```json
{
  "title": "Buy groceries",
  "content": "Milk, eggs, bread",
  "completed": false,
  "priority": "medium",
  "dueDate": "2026-02-20T12:00:00.000Z",
  "tags": ["home", "errands"]
}
```

### List Notes
- `GET {API_BASE_PATH}/notes`

Query params:
- `page` (default: `1`)
- `limit` (default: `10`)
- `completed` (`true` or `false`)
- `priority` (`low`, `medium`, `high`)
- `search` (matches `title` or `content`, case-insensitive)
- `sortBy` (default: `createdAt`)
- `order` (`asc` or `desc`, default: `desc`)

### Get Note By ID
- `GET {API_BASE_PATH}/notes/:id`

### Update Note
- `PUT {API_BASE_PATH}/notes/:id`

Request body: any updatable note fields.

### Delete Note (Soft Delete)
- `DELETE {API_BASE_PATH}/notes/:id`

This marks `isDeleted = true` and excludes the note from subsequent queries.

## Response Format
Success:
```json
{
  "status": "success",
  "message": "Notes fetched successfully",
  "data": [],
  "meta": {
    "total": 0,
    "page": 1,
    "limit": 10
  }
}
```

Error:
```json
{
  "status": "error",
  "message": "Unauthorized"
}
```