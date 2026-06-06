# my-eletronic-inventory

Sistema de gerenciamento de estoque de componentes eletrônicos. Catálogo de produtos com fotos, documentos, categorias e tipos, com exportação para marketplaces.

## Tecnologias

| Camada | Stack |
|---|---|
| Backend | Python + FastAPI + SQLAlchemy + Alembic (Clean Architecture) |
| Frontend | React + Vite + Tailwind (responsivo) |
| Banco | SQLite |
| Auth | X-Api-Key |
| Deploy | Docker Compose |

## Funcionalidades

- Dashboard com valor total do estoque, últimos produtos, top 5 categorias
- CRUD de produtos com fotos, documentos, descrição markdown
- Categorias e tipos (criação inline durante cadastro de produtos)
- Status do produto: a venda, reservado, vendido, não vender
- Foto de capa e galeria com modal
- Exportação de kit para marketplaces (Mercado Livre, OLX)
- Filtros por nome, categoria, tipo e status
- Upload de documentos (datasheets)

## Como usar (Docker)

```bash
docker compose up -d --build
```

Acesse: `http://localhost:8080`

API Key padrão: `my-secret-api-key`

## Ambiente de desenvolvimento

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

API em: `http://localhost:8000/api/v1`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend em: `http://localhost:5173` (com proxy para API)

### Variáveis de ambiente

**Backend:**
- `API_KEY` (default: `my-secret-api-key`)
- `DATABASE_URL` (default: `sqlite:///./storage/database.db`)
- `PORT` (default: `8000`)
- `STORAGE_PATH` (default: `./storage`)

**Frontend (`frontend/.env`):**
- `VITE_API_BASE_URL` (default: `/api`)
- `VITE_API_KEY` (default: `my-secret-api-key`)

## Estrutura

```
backend/
├── app/
│   ├── api/v1/endpoints/   # Rotas FastAPI
│   ├── application/        # Serviços e DTOs
│   ├── domain/             # Entidades e interfaces
│   └── infrastructure/     # Banco, repositórios, storage, auth
├── alembic/                # Migrações
└── tests/                  # Testes unitários
frontend/
├── src/
│   ├── api/                # Cliente HTTP
│   ├── components/         # Componentes reutilizáveis
│   └── pages/              # Páginas
└── dist/                   # Build de produção
storage/                    # Banco SQLite + uploads (dados sensíveis)
```
