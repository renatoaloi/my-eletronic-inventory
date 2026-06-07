## Why

Product images (photos) are not loading in the frontend — users see broken image placeholders instead of actual product photos. This makes the inventory system nearly unusable since products cannot be visually identified.

## What Changes

- **Backend**: Exclude the `GET /photos/{id}/file` endpoint from API key authentication so that `<img>` tags (which cannot send custom HTTP headers) can successfully load images
- **Frontend**: Fix the inconsistent fallback URL in image `<img>` tags — they use `'/api'` when env var is not set, but the correct API prefix is `'/api/v1'`
- **Backend** (same pattern): Also fix the `GET /documents/{id}/download` endpoint for consistency (same API key issue on document download links)

## Capabilities

### New Capabilities
- `public-file-serving`: Allow unauthenticated GET requests for file-serving endpoints (photo images and document downloads) while keeping all other endpoints behind API key authentication

### Modified Capabilities
<!-- No existing specs to modify — this is a new project without prior spec artifacts -->

## Impact

- `backend/app/api/v1/endpoints/photos.py` — move `GET /{id}/file` to a separate router without API key dependency
- `backend/app/api/v1/endpoints/documents.py` — move `GET /{id}/download` to a separate router without API key dependency
- `backend/app/api/v1/api.py` — register the new public routers
- `frontend/src/components/ProductCard.jsx` — fix fallback URL
- `frontend/src/pages/ProductDetail.jsx` — fix fallback URL
- `frontend/src/pages/Dashboard.jsx` — fix fallback URL
- `frontend/src/pages/ProductForm.jsx` — fix fallback URL
- `frontend/src/api/documents.js` — fix fallback URL in `getDocumentUrl`
