## Context

O projeto atualmente usa SQLite como banco de dados, armazenado em `storage/database.db`. A engine SQLAlchemy (em `backend/app/infrastructure/database/config.py`) usa `connect_args={"check_same_thread": False}` — específico do SQLite. As migrations Alembic foram escritas com tipos SQLite (ex: `sa.String(36)` para UUIDs, `sa.Boolean` com `server_default="0"`).

O Supabase provê PostgreSQL 15 gerenciado, com conexão SSL, backups automáticos, e suporte nativo a concorrência. A mudança é puramente na camada de infraestrutura do repositório — o restante do sistema (serviços, DTOs, endpoints, frontend) permanece idêntico.

## Goals / Non-Goals

**Goals:**
- Substituir SQLite por PostgreSQL do Supabase como banco de dados
- Manter o SQLAlchemy como ORM (mínima mudança no código de acesso a dados)
- Manter compatibilidade total da API REST existente
- Nenhuma mudança no frontend
- Nenhuma mudança no sistema de autenticação (X-Api-Key)
- Nenhuma mudança no armazenamento de arquivos (local `storage/`)

**Non-Goals:**
- Não implementar Supabase Auth (manter X-Api-Key)
- Não implementar Supabase Storage (manter storage local)
- Não usar o cliente `supabase-py` SDK (apenas a conexão PostgreSQL direta)
- Não mudar o esquema do banco de dados (tabelas, colunas, relacionamentos)

## Decisions

| Decisão | Opção Escolhida | Alternativa Considerada | Motivo |
|---|---|---|---|
| Driver PostgreSQL | `psycopg2-binary` | `asyncpg`, `pg8000` | `psycopg2-binary` é o driver mais maduro e compatível com SQLAlchemy 2.0, sem necessidade de async |
| Cliente Supabase | Conexão PostgreSQL direta (connection string) | `supabase-py` SDK | O SDK adicionaria outra camada de abstração; SQLAlchemy já gerencia o pool de conexões |
| Pool de conexões | `sqlalchemy.pool.NullPool` ou pooling default do SQLAlchemy | Configurar PgBouncer no Supabase | Para um projeto single-user, o pooling padrão é suficiente. PgBouncer pode ser adicionado depois se necessário |
| Migração de dados | Manual via script único (fora do escopo desta change) | Automática via Alembic | O banco atual pode ter dados; a migração será documentada para execução manual |

## Risks / Trade-offs

| Risco | Mitigação |
|---|---|
| Tipos SQLAlchemy incompatíveis entre SQLite e PostgreSQL | Revisar `models.py` e migration `001_initial.py`: `String(36)` funciona nos dois, `Boolean` com `server_default="0"` precisa ser `server_default=sa.text("false")` no PostgreSQL |
| Perda de dados na migração | Documentar procedimento de export/import; fazer backup do SQLite antes |
| Aumento de latência de rede (banco remoto vs local) | Conexão SSL com pooling mantido; para volume pessoal é insignificante |
| Vazamento de credenciais Supabase | Usar variáveis de ambiente; `SUPABASE_SERVICE_KEY` nunca vai para o frontend |
