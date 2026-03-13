# Checklist Rápido - Validação API

## ✅ Testes Essenciais

### 1. Health Check
```bash
curl http://localhost:3000/health
```
- [ ] Status 200

### 2. Sources
```bash
curl http://localhost:3000/sources
```
- [ ] Status 200

### 3. Promotions
```bash
curl "http://localhost:3000/promotions?page=1&limit=10"
```
- [ ] Status 200
- [ ] Tem paginação

### 4. Featured
```bash
curl "http://localhost:3000/promotions/featured?limit=5"
```
- [ ] Status 200

### 5. Import (sem token)
```bash
curl -X POST http://localhost:3000/promotions/import
```
- [ ] Status 401

### 6. Import (com token)
```bash
curl -X POST http://localhost:3000/promotions/import \
  -H "Authorization: Bearer TOKEN" \
  -d '{"source": "mercadolivre"}'
```
- [ ] Status 200

### 7. Cleanup (sem token)
```bash
curl -X POST http://localhost:3000/promotions/cleanup
```
- [ ] Status 401

### 8. Cleanup (com token)
```bash
curl -X POST http://localhost:3000/promotions/cleanup \
  -H "Authorization: Bearer TOKEN"
```
- [ ] Status 200

---

## Verificações no Banco

```sql
SELECT COUNT(*) FROM "Promotion";
SELECT * FROM "ImportLog" ORDER BY "createdAt" DESC LIMIT 5;
```

---

## Status Final
- [ ] Todos os testes passaram
- [ ] API pronta

**Data**: ___/___/______
