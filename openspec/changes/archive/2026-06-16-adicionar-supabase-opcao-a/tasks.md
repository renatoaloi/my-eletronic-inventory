## 1. Dependências

- [x] 1.1 Adicionar `psycopg2-binary` ao `backend/requirements.txt`

## 2. Configuração

- [x] 2.1 Adicionar `SUPABASE_URL` e `SUPABASE_DATABASE_URL` em `backend/app/config.py`
- [x] 2.2 Remover `connect_args={"check_same_thread": False}` de `backend/app/infrastructure/database/config.py` e configurar engine para PostgreSQL

## 3. Migrations

- [x] 3.1 Atualizar `backend/alembic/versions/001_initial.py` para usar tipos compatíveis com PostgreSQL (substituir `server_default="0"` em Boolean por `server_default=sa.text("false")`)
- [x] 3.2 Garantir que `backend/alembic/env.py` use a `DATABASE_URL` do config

## 4. Docker e Deploy

- [x] 4.1 Atualizar `docker-compose.yml` com as variáveis `SUPABASE_URL` e `SUPABASE_DATABASE_URL` no serviço backend
- [x] 4.2 Criar `backend/.env.example` documentando as novas variáveis de ambiente

## 5. Verificação

- [x] 5.1 Rodar `alembic upgrade head` apontando para PostgreSQL e confirmar que todas as tabelas são criadas
- [x] 5.2 Executar os testes existentes (`backend/tests/test_entities.py`) para garantir que nada quebrou
- [x] 5.3 Subir com `docker compose up -d --build` e validar que a API responde corretamente
