# Projeto my-eletronic-inventory

O objetivo do projeto é catalogar meu estoque de componentes eletrônicos, onde eu possa visualizar os produtos em cards, separados por categorias e tipos. Os produtos devem ter preços e status de vendido ou a venda. Assim eu posso controlar o que já foi vendido ou não. Além disso o site precisa exportar ou integrar com plataformas de vendas, exemplo Mercado Livre e OLX.

## Regras de Negócio

- Cadastro de produtos, com descrição, preço, quantidade e foto
- Upload de documentos como datasheets de especificações técnicas
- Cadastro de categorias para agrupar os produtos
- Página de categorias onde eu possa filtrar os produtos por nome também
- Quero também poder filtrar pelo status do que foi vendido ou não
- Exportação de kit para cadastro em sites de venda (contendo título, descrição e imagens)
- Não precisa de login, só eu vou usar o sistema
- Os cards de exibição dos produtos devem ter uma imagem de capa, que pode ser marcada no momento do cadastro do produto ou no momento do upload das imagens do produto
- Além de quantidade, preciso cadastrar o preço do produto, e também o tipo e a categoria
- As categorias pode ser voltadas para componentes eletrônicos, exemplo: Capacitores
- Os tipos devem ser cadastrados conforme o cadastro do produto exigir um tipo novo, exemplo: quando estou cadastrando um capacitor eletrolítico, e não existe o tipo eletrolítico, eu devo poder criar um novo tipo durante o cadastro do produto
- Status pode ser "a venda", "reservado", "vendido", "não vender"
- O site deve ter uma dashboard com os últimos produtos cadastrados, além dos valores total do estoque e das 5 categorias com maior valor
- Deve ser possível baixar as fotos e visualizar também em Modal
- Deve ser possível baixar os documentos de especificação

## Entidades

- Produto: Id, Nome, Descrição, Preço, Tipo, Categoria, Fotos, Quantidade, Documentos, Código
- Categoria: Id, Nome, Descrição
- Tipo: Id, Nome, Descrição
- Foto: Id, Nome do Arquivo, Caminho do Arquivo
- Documento:  Id, Nome do Arquivo, Caminho do Arquivo

## Requisitos Funcionais

- Não pode ter produtos com o mesmo código
- Não pode ter produtos com o mesmo nome
- Campo nome dos produtos, categorias e tipos não deve ter mais de 50 caracteres
- Preço deve ter sempre 2 dígitos decimais

## Requisitos Não Funcionais
- Opções do menu lateral: Dashboard, Produtos, Categorias, Tipos, Pesquisa, Filtros
- Tema visual: Amarelo vibrante (#FFE600), Secundária: Azul (#3483FA), Neutros: Branco, Cinza muito claro, Cinza médio para textos, Tipografia: Proxima Nova, Inter, Roboto, Textos curtos, Hierarquia forte, Preços grandes, Pouca decoração, Espaçamento: Sistema baseado em múltiplos de 8px. Muito espaço em branco para evitar sensação de poluição.

## Requisitos Técnicos

- Usuário único, não precisa de login (API deve apenas receber uma X API Key para chamadas do frontend)
- Frontend em React + Vite usando Tailwind e responsivo
- Backend em Python + FastAPI + SQLAlchemy + Alembic
- Banco de dados SQLite local na pasta storage
- Upload de arquivos na pasta storage, dentro de subpastas por id da entidade de origem.
- Todos Ids de entidades devem ser UUID's.
- Utilizar migrações do Alembic para criar o banco e para alterações estruturais nas entidades (usando sempre a API do Alembic)
- Não utilizar alert() nem confirm() para comunicação com o usuário no frontend, ao invés disso, usar componentes Modal com design compatível com o site
- Nunca escreva/modifique na pasta storage, pois é onde ficam os dados sensíveis de usuário

## Frontend

- Página inicial é o dashboard
- Menu lateral com opções listadas nos requisitos não funcionais
- Responsivo
- Tema visual conforme detalhado nos requisitos não funcionais
- Campo para editar markdown no preenchimento de descrição, com opções de negrito, títulos, elementos etc
- Os campos markdown devem ser exibidos formatados, mas editados no texto puro.
- Datas e horas no formato brasileiro respeitando fuso horário do Brasil
- Números e valores monetários exibir no padrão brasileiro no frontend
- Utilizar variáveis de ambiente do Vite, tanto para baseUrl quanto para a chave de API

## Backend

- Arquitetura Clean, com isolamento de camada de aplicação, domínio e infraestrutura
- Injeção de dependência de serviço no controller
- Injeção de dependência do banco no serviço
- Testes unitários das entidades e validação de campos
- Testes de duplicidade de registros (exemplo: não pode duplicar clientes)
- Autenticação por X-Api-Key no header
- Upload de documentos na pasta storage
- Banco de dados na pasta storage
- Utilizar variáveis de ambiente para a chave API, database URL, porta e storage path.