## Context

The backend FastAPI app mounts all routes at `/api/v1` (`main.py:19`), but the frontend axios client defaults to `/api` (`client.js:4`). In production, Nginx proxies `/api/` → `http://backend:8000` without path rewriting (`nginx.conf:13`). In development, Vite's proxy forwards `/api` to `http://localhost:8000` without rewriting (`vite.config.js:8-13`). Result: every frontend API call hits the wrong path and returns 404.

```
Frontend           Nginx/Vite          Backend
  /api/dashboard  ──►  /api/dashboard  ──► 404 (only knows /api/v1/dashboard)
```

The docker-compose healthcheck already uses the correct path (`/api/v1/dashboard/`), confirming the backend works — it's purely a frontend-to-backend path mismatch.

## Goals / Non-Goals

**Goals:**
- Fix all API calls from frontend so they reach the correct backend paths
- Keep backend prefix `/api/v1` unchanged (versioned API path is good practice)
- Ensure both dev (`npm run dev`) and production (Docker Compose) modes work

**Non-Goals:**
- No backend code changes
- No API contract or data model changes
- No database or storage changes

## Decisions

### Strategy: Frontend sends requests to `/api/v1`

**Chosen: Opção C** — Change the frontend base URL from `/api` to `/api/v1`.

Alternatives considered:
- **Opção A** (Nginx rewrite only): More complex, requires path manipulation in two places (Nginx + Vite). Fragile if backend prefix changes.
- **Opção B** (Change backend to `/api`): Cleanest but drops version prefix. Future API versions would require a breaking change.
- **Opção C (chosen)**: Simplest change, keeps API versioning, single source of truth. The frontend should match the backend's actual routes.

### Specific changes

1. **`frontend/src/api/client.js:4`** — Change fallback default from `/api` to `/api/v1`
2. **`docker-compose.yml:25`** — Change build arg `VITE_API_BASE_URL` from `/api` to `/api/v1`
3. **`frontend/vite.config.js:8-13`** — Remove rewrite (was added in error). Opção C means frontend already sends correct path, no rewrite needed.
4. **`frontend/nginx.conf:13`** — Keep `proxy_pass http://backend:8000` (no URI path). Nginx passes full URI unchanged: `/api/v1/categories` → `http://backend:8000/api/v1/categories`.
5. **`frontend/nginx.conf:14`** — Fix `proxy_set_header Host $host` → `$http_host` to include port in Host header.
6. **`backend/app/main.py:5-8`** — Add `redirect_slashes=False` to FastAPI app. Prevents FastAPI from issuing 307 redirects adding/removing trailing slashes.
7. **Backend route definitions** — Change `@router.get("/")` → `@router.get("")` and `@router.post("/")` → `@router.post("")` in all endpoint files (`categories.py`, `types.py`, `products.py`, `dashboard.py`).
8. **`docker-compose.yml:15`** — Fix healthcheck URL: remove trailing slash from `/api/v1/dashboard/` → `/api/v1/dashboard`.

## Risks / Trade-offs

- **[Low] Backend coupling**: The frontend now depends on the `/api/v1` prefix. If the backend changes it, the frontend must update too. Acceptable — they're deployed together.
- **[None] redirect_slashes disabled**: Routes must match exactly. All routes use `""` (no slash), frontend sends no trailing slash — consistent.
- **[None] No Nginx rewrite**: Requests pass through transparently, no path manipulation risk.
