# AGENTS.md

## Purpose

SaaS project scaffolding repo. The user edits `specs/Project.md` with their idea, then tells an AI to execute `specs/Prompt.txt` — which generates the full backend (`backend/`) + frontend (`frontend/`) code.

## Key workflow

1. Read `specs/Project.md` (user's requirements), then read `specs/DockerConfig.md` (Docker setup).
2. Generate the entire project into `backend/` and `frontend/`.
3. Create Dockerfiles + `docker-compose.yml` per `specs/DockerConfig.md`.
4. User runs: `docker compose up -d --build` and accesses at `https://localhost:8080`.

## Architecture (from spec)

| Layer | Stack |
|---|---|
| Backend | Python + FastAPI + SQLAlchemy + Alembic, Clean Architecture, DI |
| Frontend | React + Vite + Tailwind, responsive |
| DB | SQLite in `storage/` |
| Auth | X-Api-Key header (no user login) |
| Deploy | Docker Compose |

## Hard constraints

- **Never write/modify `storage/`** — it holds SQLite DB + uploaded files (sensitive user data).
- Entity IDs must be **UUIDs**.
- All dates/times/currency in **Brazilian locale** (pt-BR).
- Theme: primary `#FFE600` (yellow), secondary `#3483FA` (blue).
- No `alert()` or `confirm()` — use Modal components.
- Markdown description fields: edit as raw text, render as formatted.
- Frontend uses Vite env vars for API base URL + API key.
- Backend uses env vars for API key, DB URL, port, storage path.
- Product name/category/type fields: max 50 chars. Price: 2 decimal places.

## Build & run

```bash
docker compose up -d --build
```

After generation, the project should work with this single command. No other build tooling exists yet.
