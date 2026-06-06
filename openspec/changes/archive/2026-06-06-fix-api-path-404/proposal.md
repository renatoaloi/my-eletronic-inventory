## Why

All frontend API calls return 404 because the backend mounts routes at `/api/v1` but the frontend sends requests to `/api`. This breaks every page: dashboard, products, types, categories, and all CRUD operations. The healthcheck in docker-compose uses the correct path (`/api/v1/dashboard/`) so the backend appears healthy while the frontend is completely non-functional.

## What Changes

- Change `VITE_API_BASE_URL` from `/api` to `/api/v1` in `docker-compose.yml`
- Update the default fallback in `frontend/src/api/client.js` from `/api` to `/api/v1`
- Add a `rewrite` rule in `frontend/vite.config.js` to strip `/api` prefix when proxying to backend (dev mode)
- Fix `frontend/nginx.conf` `proxy_pass` to rewrite `/api/` → `/api/v1/` (production mode)

## Capabilities

### New Capabilities
<!-- No new capabilities — this is a bugfix -->

### Modified Capabilities
<!-- No spec-level behavior changes — purely infrastructure/configuration -->

## Impact

- **Backend**: No changes — prefix `/api/v1` stays as-is
- **Frontend**: `client.js` default base URL, `vite.config.js` dev proxy, `nginx.conf` production reverse proxy
- **Docker**: `docker-compose.yml` env var for frontend build
- No database, model, or API contract changes
