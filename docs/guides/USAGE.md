# Guia de Uso da API

## Endpoints Disponiveis

### 1. Health Check

GET /health

Resposta: status ok timestamp

### 2. Listar Promocoes

GET /promotions?page=1&limit=20

Parametros de Query:
- page: Numero da pagina (padrao: 1)
- limit: Itens por pagina (padrao: 20)
- category: Filtrar por categoria
- city: Filtrar por cidade
- source: Filtrar por fonte
- isFeatured: Apenas promocoes em destaque
- orderBy: Ordenacao (discount, recent, price)

Exemplos:

curl http://localhost:3000/promotions
curl "http://localhost:3000/promotions?category=eletronicos"
curl "http://localhost:3000/promotions?orderBy=discount&limit=10"

### 3. Promocoes em Destaque

GET /promotions/featured?limit=10

### 4. Buscar Promocao por ID

GET /promotions/:id

### 5. Listar Fontes (Providers)

GET /sources

## Endpoints Protegidos

Requerem autenticacao via token Bearer.

### 6. Importar Promocoes

POST /promotions/import
Authorization: Bearer SEU_TOKEN
Content-Type: application/json

Exemplo:

curl -X POST http://localhost:3000/promotions/import \
  -H "Authorization: Bearer seu-token" \
  -H "Content-Type: application/json" \
  -d '{"source": "mercadolivre"}'

### 7. Cleanup de Promocoes Expiradas

POST /promotions/cleanup
Authorization: Bearer SEU_TOKEN

### 8. Logs de Importacao

GET /promotions/logs?source=mercadolivre&limit=10

## Codigos de Status HTTP

- 200: Sucesso
- 401: Nao autorizado
- 404: Recurso nao encontrado
- 500: Erro interno do servidor

## Exemplos de Integracao

JavaScript:

const response = await fetch('http://localhost:3000/promotions?page=1&limit=10');
const data = await response.json();
console.log(data.data);

Python:

import requests
response = requests.get('http://localhost:3000/promotions')
data = response.json()
promotions = data['data']
