# CodeFlix Admin — Catálogo de vídeos com DDD e NestJS

Backend administrativo de um catálogo de vídeos desenvolvido como projeto de estudo sobre Domain-Driven Design (DDD), Clean Architecture, persistência relacional, testes automatizados e comunicação assíncrona.

A aplicação permite administrar categorias, gêneros, membros do elenco, vídeos e arquivos de mídia. As regras de negócio são mantidas independentes do framework HTTP, do ORM, do banco de dados, do armazenamento de arquivos e do sistema de mensageria.

## Objetivos do projeto

O projeto foi construído para estudar e demonstrar:

- Modelagem de domínio com entidades, agregados e objetos de valor.
- Separação entre domínio, aplicação, infraestrutura e apresentação.
- Casos de uso independentes do NestJS.
- Repository Pattern e inversão de dependência.
- Mapeamento entre agregados de domínio e models de persistência.
- Transações com Unit of Work.
- Eventos de domínio e eventos de integração.
- Processamento assíncrono de mídias com RabbitMQ.
- Autenticação JWT e autorização baseada em roles.
- Testes unitários, de integração e end-to-end.
- Migrations, containers e pipeline de CI/CD.

## Funcionalidades

### Categorias

- Criação, edição e exclusão.
- Ativação e desativação.
- Consulta por identificador.
- Pesquisa paginada com filtro e ordenação.

### Gêneros

- Criação, edição e exclusão.
- Associação com uma ou mais categorias.
- Validação da existência das categorias relacionadas.
- Pesquisa paginada.

### Membros do elenco

- Cadastro de atores e diretores.
- Atualização, consulta, pesquisa e exclusão.
- Validação do tipo do membro do elenco.

### Vídeos

- Cadastro dos dados principais do vídeo.
- Associação com categorias, gêneros e membros do elenco.
- Classificação indicativa.
- Upload de banner, thumbnail e thumbnail reduzida.
- Upload de vídeo e trailer.
- Controle do estado de processamento da mídia.
- Publicação automática após vídeo e trailer serem processados com sucesso.

### Segurança

- Autenticação por Bearer Token.
- Validação de JWT com algoritmo RS256.
- Autorização por role administrativa `admin-catalog`.
- Ambiente opcional com Keycloak para emissão de tokens.

## Visão arquitetural

O sistema é um monólito modular organizado por domínio. Os módulos compartilham o mesmo deploy e banco de dados, mas mantêm contratos e responsabilidades bem definidos.

```text
HTTP / RabbitMQ
       │
       ▼
Controllers, DTOs, Presenters e Consumers
       │
       ▼
Casos de uso — Application
       │
       ▼
Entidades, agregados e objetos de valor — Domain
       │
       ▼
Interfaces de Repository, Storage e Message Broker
       │
       ▼
Sequelize, MySQL, Cloudinary e RabbitMQ — Infrastructure
```

O código está dividido principalmente em:

- `src/core`: domínio, casos de uso, contratos e adaptadores de infraestrutura.
- `src/nest-modules`: controllers, DTOs, presenters, providers e composição das dependências.
- `test`: testes end-to-end da API.
- `envs`: arquivos de configuração por ambiente.

Embora algumas implementações de infraestrutura estejam dentro de `core`, as dependências seguem a ideia central da Clean Architecture: as regras de negócio não conhecem controllers, banco de dados ou serviços externos.

## Conceitos de DDD aplicados

### Linguagem ubíqua

O código utiliza termos do negócio de catálogo, como `Category`, `Genre`, `CastMember`, `Video`, `Trailer`, `Rating` e `Thumbnail`. Esses nomes aparecem no domínio, nos casos de uso e nas entradas e saídas da aplicação.

### Entidades

Entidades possuem identidade própria e são comparadas por seus identificadores. As principais entidades são:

- `Category`, identificada por `CategoryId`.
- `Genre`, identificado por `GenreId`.
- `CastMember`, identificado por `CastMemberId`.
- `Video`, identificado por `VideoId`.

A abstração comum está em `src/core/shared/domain/entity.ts`.

### Objetos de valor

Objetos de valor representam conceitos definidos pelos seus valores, sem identidade própria. Alguns exemplos são:

- `Uuid`: criação e validação de identificadores.
- `Rating`: classificação indicativa.
- `Banner`, `Thumbnail` e `ThumbnailHalf`: imagens do vídeo.
- `VideoMedia` e `Trailer`: mídias e seus estados de processamento.
- `SearchParams` e `SearchResult`: busca, ordenação e paginação.

Além de tornar o código mais expressivo, esses objetos centralizam validações e evitam o uso de strings e números sem significado de negócio.

### Agregados

As entidades principais estendem `AggregateRoot`, que controla eventos de domínio e alterações relevantes do agregado.

`Video` é o agregado mais completo do sistema. Ele concentra comportamentos como:

- Alterar dados do vídeo.
- Gerenciar IDs de categorias, gêneros e membros do elenco.
- Substituir imagens e mídias.
- Controlar o status de publicação.
- Gerar eventos quando uma mídia é substituída.

As relações são armazenadas por identificadores, evitando acoplamento excessivo entre agregados.

### Modelo de domínio rico

As alterações são realizadas por métodos que expressam intenções do negócio:

```ts
video.changeRating(rating);
video.replaceTrailer(trailer);
video.replaceVideo(videoMedia);
video.addCategoryId(categoryId);
```

Controllers e models Sequelize não implementam essas regras. Eles apenas entregam dados ao caso de uso ou representam a estrutura de persistência.

### Notification Pattern

As entidades possuem um objeto de notificação que acumula erros de validação. O caso de uso verifica essa notificação e lança `EntityValidationError` quando necessário.

Esse padrão permite retornar vários problemas de validação em uma única resposta, em vez de interromper a verificação no primeiro erro.

### Repository Pattern

Os casos de uso dependem de interfaces como `ICategoryRepository` e `IVideoRepository`, e não diretamente do Sequelize.

Existem implementações:

- Em memória, adequadas para testes unitários.
- Com Sequelize, usadas na aplicação e nos testes de integração.

Essa estrutura aplica inversão de dependência e permite substituir o mecanismo de persistência sem reescrever as regras de negócio.

### Mappers

Agregados de domínio e models Sequelize são objetos diferentes. Classes como `CategoryModelMapper` e `VideoModelMapper` convertem dados entre esses dois formatos.

Essa separação evita que decorators, associações e comportamentos do ORM contaminem o domínio.

### Unit of Work

`UnitOfWorkSequelize` coordena transações envolvendo a entidade principal e suas relações.

Ele controla:

- Início da transação.
- Commit e rollback.
- A transação utilizada pelos repositórios.
- Agregados modificados durante a operação.

Operações complexas de gênero e vídeo são executadas de forma atômica, preservando a consistência em caso de falha.

### Eventos de domínio e integração

Eventos de domínio representam fatos relevantes ocorridos no agregado:

- `VideoCreatedEvent`.
- `VideoAudioMediaReplaced`.

Quando necessário, um evento de domínio gera um evento de integração. Depois da confirmação da transação, handlers publicam esse evento no RabbitMQ.

O projeto utiliza eventos para integração, mas não utiliza Event Sourcing: o banco relacional continua sendo a fonte principal dos dados.

## Fluxo de processamento de mídia

O processamento de vídeo e trailer é assíncrono:

1. A API recebe o arquivo usando Multer.
2. O domínio valida tamanho, MIME type e nome.
3. O arquivo original é armazenado no Cloudinary.
4. O agregado `Video` substitui a mídia e registra um evento.
5. O repositório persiste a alteração em uma transação.
6. Após o commit, um evento de integração é publicado no RabbitMQ.
7. Um serviço externo pode consumir o evento e converter a mídia.
8. O resultado da conversão retorna por outra fila.
9. O `VideoConsumer` atualiza a mídia para `completed` ou `failed`.
10. O vídeo é publicado quando vídeo e trailer estão concluídos.

O RabbitMQ também possui configuração de Dead Letter Exchange e Dead Letter Queue para mensagens que não puderam ser processadas.

Os consumers podem ser executados em um processo separado da API, permitindo escalabilidade independente.

## Camada HTTP

O NestJS é utilizado como mecanismo de entrega e composição da aplicação.

Os controllers:

- Recebem os dados HTTP.
- Aplicam DTOs e validações de transporte.
- Executam os casos de uso.
- Convertem resultados com presenters.
- Definem códigos de status e upload de arquivos.

A aplicação possui configurações globais para:

- Transformação e validação com `ValidationPipe`.
- Respostas no formato `{ data: ... }`.
- Serialização com `class-transformer`.
- Conversão de erros de domínio em respostas HTTP.

Os principais endpoints são:

| Método   | Rota               | Responsabilidade                    |
| -------- | ------------------ | ----------------------------------- |
| `GET`    | `/auth`            | Validar o token                     |
| `POST`   | `/categories`      | Criar categoria                     |
| `GET`    | `/categories`      | Pesquisar categorias                |
| `GET`    | `/categories/:id`  | Consultar categoria                 |
| `PATCH`  | `/categories/:id`  | Atualizar categoria                 |
| `DELETE` | `/categories/:id`  | Excluir categoria                   |
| `POST`   | `/genres`          | Criar gênero                        |
| `GET`    | `/genres`          | Pesquisar gêneros                   |
| `GET`    | `/genres/:id`      | Consultar gênero                    |
| `PATCH`  | `/genres/:id`      | Atualizar gênero                    |
| `DELETE` | `/genres/:id`      | Excluir gênero                      |
| `POST`   | `/cast-member`     | Criar membro do elenco              |
| `GET`    | `/cast-member`     | Pesquisar membros                   |
| `GET`    | `/cast-member/:id` | Consultar membro                    |
| `PATCH`  | `/cast-member/:id` | Atualizar membro                    |
| `DELETE` | `/cast-member/:id` | Excluir membro                      |
| `POST`   | `/videos`          | Criar vídeo                         |
| `GET`    | `/videos/:id`      | Consultar vídeo                     |
| `PATCH`  | `/videos/:id`      | Atualizar dados ou enviar uma mídia |

As rotas administrativas exigem:

```http
Authorization: Bearer <token>
```

O token deve conter a role `admin-catalog` em `realm_access.roles`.

## Persistência

O projeto utiliza MySQL no ambiente principal e SQLite nos testes.

Os models Sequelize representam:

- `categories`
- `genres`
- `cast_members`
- `videos`
- `image_medias`
- `audio_video_medias`
- `genre_category`
- `category_video`
- `genre_video`
- `cast_member_video`

As migrations são gerenciadas pelo Umzug e ficam próximas aos respectivos módulos de persistência.

## Tecnologias

| Tecnologia                | Utilização                                               |
| ------------------------- | -------------------------------------------------------- |
| TypeScript                | Linguagem principal e tipagem                            |
| Node.js                   | Ambiente de execução                                     |
| NestJS                    | API, módulos, injeção de dependência, guards e consumers |
| Sequelize                 | ORM e acesso ao banco                                    |
| Sequelize-Typescript      | Models baseados em decorators                            |
| MySQL                     | Banco relacional principal                               |
| SQLite                    | Banco isolado para testes                                |
| Umzug                     | Execução e histórico de migrations                       |
| RabbitMQ                  | Mensageria e processamento assíncrono                    |
| EventEmitter2             | Mediação de eventos dentro da aplicação                  |
| Cloudinary                | Armazenamento de imagens e vídeos                        |
| Keycloak                  | Provedor de identidade no ambiente local                 |
| JWT com RS256             | Autenticação e autorização                               |
| class-validator           | Validação de entradas e regras                           |
| class-transformer         | Transformação e serialização                             |
| Joi                       | Validação das variáveis de ambiente                      |
| Multer                    | Upload multipart                                         |
| Jest                      | Testes unitários e de integração                         |
| Supertest                 | Testes end-to-end da API                                 |
| Chance                    | Geração de dados com Fake Builders                       |
| Docker Compose            | Ambiente local e de CI                                   |
| GitHub Actions            | Pipeline de CI/CD                                        |
| GitHub Container Registry | Publicação da imagem de produção                         |

## Estrutura de diretórios

```text
src/
├── core/
│   ├── category/
│   │   ├── application/
│   │   ├── domain/
│   │   └── infra/
│   ├── genre/
│   ├── cast-member/
│   ├── video/
│   └── shared/
│       ├── application/
│       ├── domain/
│       └── infra/
├── nest-modules/
│   ├── auth-module/
│   ├── categories-module/
│   ├── cast-members-module/
│   ├── genre-module/
│   ├── video-module/
│   ├── database-module/
│   ├── event-module/
│   ├── rabbitmq-module/
│   ├── shared-module/
│   └── usecase-module/
├── cmd/
│   └── rabbitmq.ts
├── main.ts
└── migrate.ts
test/
└── testes end-to-end
```

## Configuração do ambiente

### Pré-requisitos

- Node.js 22 ou superior.
- npm.
- Docker e Docker Compose para o ambiente containerizado.

Crie o arquivo `envs/.env`. As principais variáveis utilizadas são:

```dotenv
PORT=3000

DB_VENDOR=mysql
DB_HOST=localhost
DB_PORT=3307
DB_USERNAME=root
DB_PASSWORD=root
DB_DATABASE=codeflix
DB_LOGGING=false
DB_AUTO_LOAD_MODELS=true

JWT_PRIVATE_KEY="chave-privada-rsa"
JWT_PUBLIC_KEY="chave-publica-rsa"

RABBITMQ_URI=amqp://admin:admin@localhost:5672
RABBITMQ_REGISTER_HANDLER=false

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDNARY_UPLOAD_PATH=uploads
```

Ao executar a aplicação dentro do Docker Compose, utilize `db` como `DB_HOST`, a porta interna `3306` e `rabbitmq` como host do broker.

As chaves JWT podem ser fornecidas pelo Keycloak ou por outro emissor compatível com RS256.

## Instalação

```bash
npm install
```

## Execução local

Inicie MySQL, RabbitMQ e os demais serviços necessários. Depois execute:

```bash
npm run start:dev
```

A API estará disponível em:

```text
http://localhost:3000
```

Para iniciar os consumers RabbitMQ em desenvolvimento:

```bash
npm run rabbitmq:consumers:dev
```

## Execução com Docker

O arquivo `docker-compose.yaml` inicia a aplicação, MySQL e RabbitMQ:

```bash
docker compose up -d --build
```

Serviços locais:

- API: `http://localhost:3000`
- MySQL: `localhost:3307`
- RabbitMQ: `localhost:5672`
- RabbitMQ Management: `http://localhost:15672`

Para acompanhar os logs:

```bash
docker compose logs -f app
```

Para encerrar o ambiente:

```bash
docker compose down
```

O Keycloak pode ser iniciado separadamente:

```bash
docker compose -f docker-compose.keycloak.yaml up -d
```

Ele ficará disponível em `http://localhost:8080`. O realm, o client e a role `admin-catalog` precisam ser configurados no Keycloak.

## Migrations

As migrations são executadas pelo entrypoint `src/migrate.ts` e gerenciadas pelo Umzug.

Para executar a versão compilada:

```bash
npm run build
node dist/src/migrate.js up
```

Para reverter a migration mais recente:

```bash
node dist/src/migrate.js down
```

Consulte os comandos disponíveis:

```bash
node dist/src/migrate.js --help
```

## Testes

Executar testes unitários e de integração:

```bash
npm test
```

Executar em modo de observação:

```bash
npm run test:watch
```

Executar com cobertura:

```bash
npm run test:cov
```

Executar testes end-to-end:

```bash
npm run test:e2e
```

A estratégia de testes inclui:

- Testes unitários das entidades e objetos de valor.
- Testes dos casos de uso.
- Repositórios em memória.
- Fake Builders para criação de cenários.
- Testes de integração dos models e repositórios Sequelize.
- Testes de controllers e filters.
- Integração com RabbitMQ.
- Testes end-to-end com Supertest.

## Qualidade e build

Executar o linter:

```bash
npm run lint
```

Formatar o código:

```bash
npm run format
```

Gerar o build:

```bash
npm run build
```

Executar o build de produção:

```bash
npm run start:prod
```

## CI/CD

O workflow do GitHub Actions:

1. Cria os serviços de CI com Docker Compose.
2. Executa testes unitários e de integração.
3. Executa os testes end-to-end.
4. Gera a imagem de produção.
5. Publica a imagem no GitHub Container Registry em pushes autorizados.

O `Dockerfile.prod` utiliza múltiplos estágios para separar dependências de desenvolvimento, build e imagem final de produção.

## Decisões e possíveis evoluções

O projeto prioriza clareza arquitetural e aprendizado. Algumas evoluções possíveis são:

- Transactional Outbox para garantir a publicação dos eventos após o commit.
- Documentação OpenAPI/Swagger.
- Health checks HTTP para banco, RabbitMQ e storage.
- Observabilidade com logs estruturados, métricas e tracing.
- Idempotência nos consumers RabbitMQ.
- Testcontainers para testes de integração.
- Separação mais rígida dos Bounded Contexts caso o catálogo cresça.

## Síntese

Este projeto demonstra como implementar um backend de catálogo no qual:

- O domínio concentra as regras do negócio.
- Casos de uso orquestram as operações.
- Repositórios abstraem a persistência.
- Mappers protegem o domínio do ORM.
- Transações mantêm os agregados consistentes.
- Eventos integram processos assíncronos.
- NestJS atua como camada de entrega e composição.

O resultado é uma base de estudo sobre DDD aplicada a um problema real, com persistência, autenticação, upload de arquivos, mensageria, testes e automação de entrega.
