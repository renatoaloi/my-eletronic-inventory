## ADDED Requirements

### Requirement: Photo images are served without authentication
The system SHALL serve product photo files at `GET /api/v1/photos/{id}/file` without requiring an API key. This endpoint MUST remain accessible to browsers loading `<img>` tags.

#### Scenario: Browser loads product image without API key
- **WHEN** an `<img>` tag requests `GET /api/v1/photos/{id}/file` without an `X-Api-Key` header
- **THEN** the server responds with HTTP 200 and the image file content with correct Content-Type

#### Scenario: Authenticated mutation endpoints still require API key
- **WHEN** a client sends `PUT /api/v1/photos/{id}/cover` or `DELETE /api/v1/photos/{id}` without an `X-Api-Key` header
- **THEN** the server responds with HTTP 403

### Requirement: Document files are downloadable without authentication
The system SHALL serve document files at `GET /api/v1/documents/{id}/download` without requiring an API key. This endpoint MUST remain accessible to browser `<a>` download links.

#### Scenario: Browser downloads document without API key
- **WHEN** a user clicks an `<a>` download link for `GET /api/v1/documents/{id}/download` without an `X-Api-Key` header
- **THEN** the server responds with HTTP 200 and the document file content

### Requirement: Frontend image URLs use consistent API prefix
All `<img>` src attributes for photo URLs SHALL use the fallback `'/api/v1'` when `VITE_API_BASE_URL` is not set, matching the API client's base URL fallback.

#### Scenario: Image loads with default fallback in development
- **WHEN** `VITE_API_BASE_URL` environment variable is not set
- **AND** the frontend renders a product image with `import.meta.env.VITE_API_BASE_URL || '/api/v1'`
- **THEN** the image URL resolves to `/api/v1/photos/{id}/file`

#### Scenario: Image loads with configured URL in production
- **WHEN** `VITE_API_BASE_URL` is set to `/api/v1` (as in Docker build)
- **AND** the frontend renders a product image
- **THEN** the image URL resolves to `/api/v1/photos/{id}/file`
