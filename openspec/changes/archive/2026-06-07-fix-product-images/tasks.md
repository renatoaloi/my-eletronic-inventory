## 1. Backend — Public File-Serving Routers

- [x] 1.1 Create a public `APIRouter` in `backend/app/api/v1/endpoints/photos.py` for `GET /{id}/file` without API key dependency
- [x] 1.2 Create a public `APIRouter` in `backend/app/api/v1/endpoints/documents.py` for `GET /{id}/download` without API key dependency
- [x] 1.3 Register the new public routers in `backend/app/api/v1/api.py` BEFORE the authenticated routers (same prefix, FastAPI matches first-registered route)

## 2. Frontend — Fix Fallback URLs

- [x] 2.1 Update `frontend/src/components/ProductCard.jsx` — change `'/api'` to `'/api/v1'` in the image URL fallback
- [x] 2.2 Update `frontend/src/pages/ProductDetail.jsx` — change all 3 `'/api'` to `'/api/v1'` in image URL fallbacks
- [x] 2.3 Update `frontend/src/pages/Dashboard.jsx` — change `'/api'` to `'/api/v1'` in the image URL fallback
- [x] 2.4 Update `frontend/src/pages/ProductForm.jsx` — change `'/api'` to `'/api/v1'` in the image URL fallback
- [x] 2.5 Update `frontend/src/api/documents.js` — change `'/api'` to `'/api/v1'` in `getDocumentUrl` fallback

## 3. Verification

- [x] 3.1 Run `docker compose up -d --build` and confirm the app starts without errors
- [x] 3.2 Verify product images load correctly on the dashboard, product list, product detail, and product form pages
- [x] 3.3 Verify document download links work
- [x] 3.4 Verify authenticated endpoints (create/edit/delete product) still require API key
