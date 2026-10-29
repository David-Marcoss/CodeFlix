# CodeFlix com Docker (desenvolvimento)

Na raiz deste repositório:

```bash
docker compose up -d --build
docker compose logs -f
```

Requer Docker Compose 2.24.4 ou superior (suporte a `!reset`). O Nest instala
as dependências e executa as migrations antes de iniciar em modo watch.
As configurações de autenticação e Cloudinary continuam sendo lidas de
`admin-codeflix-nest/envs/.env`, que deve estar configurado localmente.

| Serviço | Endereço na máquina | Endereço na rede Docker |
| --- | --- | --- |
| Admin React | http://localhost:5173 | http://admin:5173 |
| API Nest | http://localhost:3000 | http://app:3000 |
| Portal Next.js | http://localhost:3002 | http://portal:3000 |
| API simulada do portal | http://localhost:3001 | http://portal-api:3001 |
| MySQL | localhost:3307 | db:3306 |
| RabbitMQ | localhost:5672 | rabbitmq:5672 |
| Painel RabbitMQ | http://localhost:15672 | rabbitmq:15672 |

O RabbitMQ usa `admin` / `admin`; o MySQL usa `root` / `root`.
Essas credenciais são destinadas ao ambiente local.

Todos os serviços compartilham a rede padrão do Compose. O Next usa
`API_URL=http://portal-api:3001` nas requisições do servidor. O portal ainda
consome o contrato de `db.json`; esse contrato não é substituído pela API Nest.
O admin mantém os dados locais/Redux existentes. Para chamadas à API Nest no
navegador, use `/api/categories`, por exemplo: o Vite encaminha `/api/*` para
`http://app:3000/*`, evitando chamadas do navegador a nomes internos do Docker.

O código dos front-ends é montado para atualização automática. Dependências,
cache do Next e dados do MySQL ficam em volumes separados. O `db.json` é montado
diretamente: escritas da API simulada alteram esse arquivo no host.

```bash
# Parar mantendo os volumes e os dados
docker compose down

# Após modificar package-lock.json, atualizar dependências dos front-ends
docker compose run --rm --no-deps admin npm ci
docker compose run --rm --no-deps portal npm ci
docker compose up -d --build
```

Evite executar simultaneamente o Compose antigo do Nest, pois ele usa as mesmas
portas. Esta configuração inicia o ambiente de desenvolvimento e não inclui
um provedor externo de identidade nem um serviço externo de processamento de vídeo.

Se a porta 5173 já estiver ocupada, use `ADMIN_PORT=5174 docker compose up -d --build`
e acesse o admin em http://localhost:5174. Mantenha a mesma variável nas próximas
execuções. O serviço `volume-init` prepara as permissões apenas dos volumes Docker
vazios do Nest e do cache Next, para que as aplicações executem como usuário `node`.
