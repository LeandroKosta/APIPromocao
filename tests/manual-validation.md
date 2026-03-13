# Checklist de Validação Manual da API

## 1. Health Check
```bash
curl http://localhost:3000/health
```
**Esperado:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```
- [ ] Status code 200
- [ ] Campo "status" = "ok"
- [ ] Campo "timestamp" presente

---

## 2. Sources
```bash
curl http://localhost:3000/sources
```
**Esperado:**
```json
{
  "success": true,
  "data": [
    {
      "name": "mercadolivre",
      "displayName": "Mercado Livre",
      "isConfigured": true,
      "isActive": true
    }
  ]
}
```
- [ ] Status code 200
- [ ] Array com providers
- [ ] Cada provider tem name, displayName, isConfigured, isActive

---

## 3. Promotions List
```bash
curl "http://localhost:3000/promotions?page=1&limit=10"
```
**Esperado:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```
- [ ] Status code 200
- [ ] Array de promoções
- [ ] Objeto pagination com page, limit, total, totalPages

---

## 4. Featured Promotions
```bash
curl "http://localhost:3000/promotions/featured?limit=5"
```
**Esperado:**
```json
{
  "success": true,
  "data": [...]
}
```
- [ ] Status code 200
- [ ] Apenas promoções com isFeatured = true

---

## 5. Import (sem autenticação)
```bash
curl -X POST http://localhost:3000/promotions/import
```
**Esperado:**
- [ ] Status code 401
- [ ] Mensagem de erro de autenticação

---

## 6. Import (com autenticação)
```bash
curl -X POST http://localhost:3000/promotions/import \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"source": "mercadolivre"}'
```
**Esperado:**
```json
{
  "success": true,
  "data": {
    "source": "mercadolivre",
    "status": "success",
    "totalFetched": 50,
    "totalInserted": 45,
    "totalUpdated": 5,
    "totalDisabled": 0
  }
}
```
- [ ] Status code 200
- [ ] Campos totalFetched, totalInserted, totalUpdated presentes

---

## 7. Verificar no Banco
```sql
-- Contar promoções importadas
SELECT COUNT(*) FROM "Promotion" WHERE source = 'mercadolivre';

-- Ver últimas promoções
SELECT id, title, "newPrice", source, "isActive" 
FROM "Promotion" 
ORDER BY "importedAt" DESC 
LIMIT 10;

-- Ver logs de importação
SELECT * FROM "ImportLog" ORDER BY "createdAt" DESC LIMIT 5;
```
- [ ] Promoções foram salvas
- [ ] Logs de importação registrados

---

## 8. Cleanup (sem autenticação)
```bash
curl -X POST http://localhost:3000/promotions/cleanup
```
**Esperado:**
- [ ] Status code 401

---

## 9. Cleanup (com autenticação)
```bash
curl -X POST http://localhost:3000/promotions/cleanup \
  -H "Authorization: Bearer SEU_TOKEN"
```
**Esperado:**
```json
{
  "success": true,
  "message": "3 promotions disabled"
}
```
- [ ] Status code 200
- [ ] Mensagem com quantidade desativada

---

## 10. Verificar Cleanup no Banco
```sql
-- Ver promoções expiradas
SELECT COUNT(*) FROM "Promotion" 
WHERE "expiresAt" < NOW() AND "isActive" = false;
```
- [ ] Promoções expiradas foram desativadas

---

## 11. Formato Padrão de Promoção
Verificar se cada promoção retornada tem:
- [ ] id (string)
- [ ] title (string)
- [ ] description (string | null)
- [ ] storeName (string)
- [ ] imageUrl (string | null)
- [ ] productUrl (string)
- [ ] affiliateUrl (string | null)
- [ ] oldPrice (number | null)
- [ ] newPrice (number)
- [ ] discountPercent (number | null)
- [ ] couponCode (string | null)
- [ ] source (string)
- [ ] category (string | null)
- [ ] city (string | null)
- [ ] isFeatured (boolean)
- [ ] isActive (boolean)
- [ ] expiresAt (date | null)
- [ ] importedAt (date)

---

## 12. Filtros e Paginação
```bash
# Por categoria
curl "http://localhost:3000/promotions?category=eletronicos&limit=5"

# Por cidade
curl "http://localhost:3000/promotions?city=São Paulo&limit=5"

# Por fonte
curl "http://localhost:3000/promotions?source=mercadolivre&limit=5"

# Ordenação por desconto
curl "http://localhost:3000/promotions?orderBy=discount&limit=10"

# Ordenação por recentes
curl "http://localhost:3000/promotions?orderBy=recent&limit=10"

# Paginação
curl "http://localhost:3000/promotions?page=2&limit=20"
```
- [ ] Filtros funcionando
- [ ] Ordenação funcionando
- [ ] Paginação funcionando
