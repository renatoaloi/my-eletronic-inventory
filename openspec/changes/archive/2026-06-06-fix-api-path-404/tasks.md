## 1. Frontend API Client Config

- [x] 1.1 Change fallback `baseURL` default from `/api` to `/api/v1` in `frontend/src/api/client.js`

## 2. Docker Compose Config

- [x] 2.1 Change `VITE_API_BASE_URL` build arg from `/api` to `/api/v1` in `docker-compose.yml`

## 3. Dev Proxy Config

- [x] 3.1 Remove `rewrite` from `frontend/vite.config.js` — Opção C não precisa de rewrite

## 4. Production Proxy Config

- [x] 4.1 Revert `proxy_pass` in `frontend/nginx.conf` to plain `http://backend:8000` — sem URI, sem rewrite
- [x] 4.2 Fix `proxy_set_header Host $host` → `$http_host` para incluir porta no redirect

## 5. Backend — Redirect Slashes Fix

- [x] 5.1 Add `redirect_slashes=False` to FastAPI app in `main.py`
- [x] 5.2 Change all `@router.get("/")` → `@router.get("")` em categories, types, products, dashboard
- [x] 5.3 Change all `@router.post("/")` → `@router.post("")` em categories, types, products

## 6. Healthcheck

- [x] 6.1 Fix healthcheck URL em `docker-compose.yml` — remover trailing slash

## 7. Verify

- [x] 7.1 Rebuild and restart: `docker compose up -d --build`
- [x] 7.2 Confirm GET/POST via Nginx funcionam sem 404, redirect ou CORS error
