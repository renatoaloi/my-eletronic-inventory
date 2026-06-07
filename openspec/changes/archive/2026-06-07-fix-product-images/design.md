## Context

The photo serving endpoint `GET /photos/{id}/file` and document download endpoint `GET /documents/{id}/download` are behind API key authentication (router-level `dependencies=[Depends(verify_api_key)]` in `photos.py` line 14 and `documents.py` line 14). However, `<img>` tags and `<a>` download links cannot send custom `X-Api-Key` headers. This causes all product images and document downloads to fail with HTTP 403 in the frontend.

Additionally, the image `<img>` src URLs in the frontend use an inconsistent fallback value: they fall back to `'/api'` when `VITE_API_BASE_URL` is unset, but the API client correctly uses `'/api/v1'`. In development without the env var, the wrong prefix causes 404s.

## Goals / Non-Goals

**Goals:**
- Product images load correctly in all frontend views (ProductCard, ProductDetail, Dashboard, ProductForm)
- Document download links work for end users
- No functional regression on authenticated endpoints
- Consistent URL fallback behavior between API calls and image/document URLs

**Non-Goals:**
- Not changing the authentication model for endpoints that modify data (POST/PUT/DELETE)
- Not implementing user-based auth or session management
- Not changing the file storage mechanism

## Decisions

### 1. Separate public routers for file serving — not exceptions or middleware

**Decision**: Create dedicated public `APIRouter` instances (without API key dependency) for the `GET /photos/{id}/file` and `GET /documents/{id}/download` endpoints. Register these public routers in `api.py` with the same prefix, but BEFORE the authenticated routers so they take precedence.

**Alternatives considered:**
- *Per-endpoint override via `dependencies=[]`* in the route decorator was considered but is not supported by FastAPI when the router already has a dependency — the router-level dependency still applies.
- *Middleware that skips auth for certain paths* — adds complexity and couples auth logic to URL routing.
- *Path-based exception in verify_api_key* — would need to parse request URL inside the dependency, which is fragile.

**Rationale**: Separate routers are the cleanest FastAPI-native approach. They keep the auth boundary explicit and readable.

### 2. Frontend fallback URL consistency — change all `'/api'` to `'/api/v1'`

**Decision**: All image src URLs and the `getDocumentUrl` function currently use `import.meta.env.VITE_API_BASE_URL || '/api'`. Change every occurrence to `import.meta.env.VITE_API_BASE_URL || '/api/v1'` so the fallback matches the API client's fallback.

**Rationale**: The docker-compose build already sets `VITE_API_BASE_URL=/api/v1`, so this only affects development without a `.env` file. Using the same fallback everywhere eliminates a silent inconsistency that causes broken images only in certain environments.

### 3. In production, nginx proxy already maps `/api/` → backend — no nginx changes needed

The nginx.conf proxies `/api/` → `http://backend:8000`. Since the full URL path will be `/api/v1/photos/{id}/file`, this will correctly match the `/api/` location block and forward to the backend. No nginx changes required.

### 4. Vite dev proxy already forwards `/api` → localhost:8000 — no Vite config changes needed

The vite.config.js proxies `/api` entirely. No changes needed.

## Risks / Trade-offs

- **[Security] Public file endpoints could be scraped** → The photo IDs are UUIDs (unguessable). For sensitive documents, additional access control could be added later. This matches the current implicit security model.
- **[Consistency] Document downloads already used `'/api'` fallback** → The same fix is applied. If any other components also use `'/api'` fallback, they should be updated in the same pass.
- **[Regression] Authenticated endpoints remain unaffected** — only GET file-serving routes move to public routers. POST/PUT/DELETE stay fully authenticated.
