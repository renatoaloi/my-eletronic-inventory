## ADDED Requirements

### Requirement: Conexão com PostgreSQL do Supabase
O sistema DEVE conectar-se a um banco PostgreSQL 15 (ou superior) gerenciado pelo Supabase utilizando a connection string fornecida via variável de ambiente.

#### Scenario: Conexão bem-sucedida
- **WHEN** a variável `SUPABASE_DATABASE_URL` contém uma connection string PostgreSQL válida
- **THEN** o SQLAlchemy DEVE estabelecer uma conexão com o banco e executar queries com sucesso

#### Scenario: Conexão recusada
- **WHEN** a variável `SUPABASE_DATABASE_URL` está ausente ou contém uma string inválida
- **THEN** o sistema DEVE falhar ao iniciar com erro claro indicando a falha de conexão

### Requirement: Variáveis de ambiente
O sistema DEVE ler as seguintes variáveis de ambiente para configurar a conexão com o Supabase:

- `SUPABASE_URL` — URL do projeto Supabase (ex: `https://<project>.supabase.co`)
- `SUPABASE_DATABASE_URL` — connection string PostgreSQL completa com credentials

#### Scenario: Configuração lida corretamente
- **WHEN** o módulo `app/config.py` carrega as variáveis de ambiente
- **THEN** `SUPABASE_URL` e `SUPABASE_DATABASE_URL` DEVEM estar disponíveis como constantes do módulo

### Requirement: Migrations compatíveis com PostgreSQL
As migrations Alembic DEVEM funcionar tanto em SQLite (desenvolvimento) quanto em PostgreSQL (produção), ou ser especificamente escritas para PostgreSQL.

#### Scenario: Migration executada no PostgreSQL
- **WHEN** o comando `alembic upgrade head` é executado com `DATABASE_URL` apontando para PostgreSQL
- **THEN** todas as tabelas (categories, types, products, photos, documents) DEVEM ser criadas com tipos compatíveis com PostgreSQL

### Requirement: Pool de conexões configurado para PostgreSQL
A engine SQLAlchemy DEVE ser configurada sem `check_same_thread` (específico do SQLite) e com pooling apropriado para PostgreSQL.

#### Scenario: Engine criada sem parâmetros SQLite
- **WHEN** a engine é criada com `DATABASE_URL` PostgreSQL
- **THEN** `connect_args` NÃO DEVE conter `check_same_thread`
- **THEN** a engine DEVE usar pooling padrão do SQLAlchemy para PostgreSQL

### Requirement: Driver PostgreSQL instalado
O arquivo `requirements.txt` DEVE incluir `psycopg2-binary` como dependência do driver PostgreSQL.

#### Scenario: Dependência presente
- **WHEN** o comando `pip install -r requirements.txt` é executado
- **THEN** `psycopg2-binary` DEVE estar instalado e disponível para o SQLAlchemy
