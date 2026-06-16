## Why

SQLite como banco de dados relacional no `storage/` local não é adequado para produção: não suporta concorrência, não tem backups gerenciados, e trava o armazenamento de arquivos ao mesmo volume. Migrar para PostgreSQL gerenciado via Supabase oferece resiliência, backups automáticos, e prepara o projeto para escala futura sem alterar a arquitetura geral.

## What Changes

- Substituir SQLite por PostgreSQL rodando no Supabase como provedor de banco gerenciado
- Alterar a `DATABASE_URL` de `sqlite:///...` para a connection string PostgreSQL do Supabase
- Adicionar `psycopg2-binary` como driver PostgreSQL
- Remover `connect_args={"check_same_thread": False}` da engine SQLAlchemy (específico do SQLite)
- Atualizar migration Alembic existente para compatibilidade com PostgreSQL
- Atualizar `docker-compose.yml` com as novas variáveis de ambiente do Supabase
- Manter inalterado:
  - Autenticação via `X-Api-Key` (nenhuma mudança no Auth)
  - Armazenamento local de arquivos em `storage/`
  - Todo o backend FastAPI + Clean Architecture
  - Todo o frontend React

## Capabilities

### New Capabilities
- `supabase-database`: Configuração de conexão com PostgreSQL do Supabase, substituindo SQLite como banco de dados do projeto

### Modified Capabilities
<!-- Nenhuma capability existente tem requisitos alterados — apenas a implementação do banco muda -->

## Impact

- **Arquivos alterados no `backend/`**:
  - `backend/requirements.txt` — adicionar `psycopg2-binary`
  - `backend/app/config.py` — adicionar `SUPABASE_URL`, `SUPABASE_DATABASE_URL`
  - `backend/app/infrastructure/database/config.py` — remover `check_same_thread`, engine PostgreSQL
  - `backend/alembic/env.py` — garante que usa a nova DATABASE_URL
  - `backend/alembic/versions/001_initial.py` — migration compatível com PostgreSQL (tipos SQL)
- **Arquivos alterados na raiz**:
  - `docker-compose.yml` — adicionar `SUPABASE_URL`, `SUPABASE_SERVICE_KEY` nas env vars do backend
  - `backend/.env.example` (criar) — documentar novas variáveis
- **Nenhuma mudança no frontend**
- **Nenhuma mudança no storage local**
