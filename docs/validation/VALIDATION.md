# Guia de Validação da API de Promoções

## Pré-requisitos

1. API rodando: `npm run dev`
2. Banco de dados configurado
3. Variáveis de ambiente configuradas (.env)

## Validação Rápida (Automatizada)

### Opção 1: Script Bash
```bash
npm run validate
```

### Opção 2: Testes Jest
```bash
npm test
```

## Validação Manual (Passo a Passo)

### 1. Health Check ✅
```bash
curl http://localhost:3000/health
```
**Deve retornar:**
- Status 200
- `{ "status": "ok", "timestamp": "..." }`

### 2. Listar Fontes ✅
```bash
curl http://localhost:3000/sources
```
**Deve retornar:**
- Lista de providers (mercadolivre, amazon, shopee)
- Cada um com: name, displayName, isConfigured, isActive

### 3. Listar Promoções ✅
```bash
curl "http://localhost:3000/promotions?page=1&limit=10"
```
**Deve retornar:**
- Array de promoções
- Objeto pagination com: page, limit, total, totalPages

### 4. Promoções em Destaque ✅
```bash
curl "http://localhost:3000/promotions/featured?limit=5"
```
**Deve retornar:**
- Apenas promoções com isFeatured = true

### 5. Importar Promoções (Protegido) 🔒
```bash
# Sem token (deve falhar)
curl -X POST http://localhost:3000/promotions/import

# Com token (deve funcionar)
curl -X POST http://localhost:3000/promotions/import \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"source": "mercadolivre"}'
```
**Deve retornar:**
- Sem token: 401 Unauthorized
- Com token: dados da importação (totalFetched, totalInserted, etc)

### 6. Cleanup (Protegido) 🔒
```bash
# Com token
curl -X POST http://localhost:3000/promotions/cleanup \
  -H "Authorization: Bearer SEU_TOKEN"
```
**Deve retornar:**
- Quantidade de promoções desativadas

### 7. Verificar no Banco de Dados 💾
```sql
-- Ver promoções
SELECT COUNT(*) FROM "Promotion";

-- Ver logs de importação
SELECT * FROM "ImportLog" ORDER BY "createdAt" DESC LIMIT 5;

-- Ver promoções por fonte
SELECT source, COUNT(*) FROM "Promotion" GROUP BY source;
```

## Testes de Filtros

### Por Categoria
```bash
curl "http://localhost:3000/promotions?category=eletronicos&limit=10"
```

### Por Cidade
```bash
curl "http://localhost:3000/promotions?city=São Paulo&limit=10"
```

### Por Fonte
```bash
curl "http://localhost:3000/promotions?source=mercadolivre&limit=10"
```

### Ordenação
```bash
# Maior desconto
curl "http://localhost:3000/promotions?orderBy=discount&limit=10"

# Mais recentes
curl "http://localhost:3000/promotions?orderBy=recent&limit=10"

# Menor preço
curl "http://localhost:3000/promotions?orderBy=price&limit=10"
```

### Paginação
```bash
# Página 1
curl "http://localhost:3000/promotions?page=1&limit=20"

# Página 2
curl "http://localhost:3000/promotions?page=2&limit=20"
```

## Formato Padrão de Resposta

Toda promoção deve ter:
```json
{
  "id": "uuid",
  "title": "string",
  "description": "string | null",
  "storeName": "string",
  "imageUrl": "string | null",
  "productUrl": "string",
  "affiliateUrl": "string | null",
  "oldPrice": "number | null",
  "newPrice": "number",
  "discountPercent": "number | null",
  "couponCode": "string | null",
  "source": "string",
  "sourceItemId": "string",
  "category": "string | null",
  "city": "string | null",
  "isFeatured": "boolean",
  "isActive": "boolean",
  "expiresAt": "date | null",
  "importedAt": "date",
  "createdAt": "date",
  "updatedAt": "date"
}
```

## Checklist Final

- [ ] Health check funcionando
- [ ] Sources retornando providers
- [ ] Promotions com paginação
- [ ] Featured promotions funcionando
- [ ] Import protegido por token
- [ ] Cleanup protegido por token
- [ ] Filtros funcionando (categoria, cidade, fonte)
- [ ] Ordenação funcionando (desconto, recente, preço)
- [ ] Paginação funcionando
- [ ] Dados salvos no banco
- [ ] Logs de importação registrados
- [ ] Formato padrão validado

## Próximos Passos

Após validação completa:
1. Deploy da API em produção
2. Configurar domínio (api.seudominio.com)
3. Integrar com Guia Comercial
4. Configurar cron jobs em produção
