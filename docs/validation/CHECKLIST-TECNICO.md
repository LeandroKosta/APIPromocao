# Checklist Técnico de Testes - API de Promoções

## Informações do Teste
- **Data do Teste**: ___/___/______
- **Testador**: _______________________
- **Ambiente**: [ ] Local [ ] Staging [ ] Produção
- **URL Base**: _______________________
- **Token API**: _______________________

---

## 1. Health Check

### Objetivo
Verificar se a API está online e respondendo corretamente.

### Requisição
```bash
curl -X GET http://localhost:3000/health
```

### Resultado Esperado
- **Status Code**: 200
- **Response Body**:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Validações
- [ ] Status code é 200
- [ ] Campo "status" existe e é "ok"
- [ ] Campo "timestamp" existe e está no formato ISO
- [ ] Resposta retorna em menos de 1 segundo

### Confirmação no Banco
Não aplicável (endpoint não acessa banco de dados)

### Status
- [ ] ✅ Validado
- [ ] ⏳ Pendente
- [ ] ❌ Erro

**Observações**: _______________________________________________

---

## 2. Listar Fontes (Sources)

### Objetivo
Verificar se a API retorna a lista de providers disponíveis e suas configurações.

### Requisição
```bash
curl -X GET http://localhost:3000/sources
```

### Resultado Esperado
- **Status Code**: 200
- **Response Body**:
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

### Validações
- [ ] Status code é 200
- [ ] Campo "success" é true
- [ ] Campo "data" é um array
- [ ] Cada provider tem: name, displayName, isConfigured, isActive

### Status
- [ ] ✅ Validado
- [ ] ⏳ Pendente
- [ ] ❌ Erro

---

## 3. Listar Promoções

### Requisição
```bash
curl -X GET "http://localhost:3000/promotions?page=1&limit=10"
```

### Validações
- [ ] Status code é 200
- [ ] Campo "pagination" existe
- [ ] Filtros funcionam (categoria, cidade, fonte)
- [ ] Ordenação funciona (desconto, recente, preço)

### Status
- [ ] ✅ Validado
- [ ] ⏳ Pendente
- [ ] ❌ Erro

---

## 4. Promoções em Destaque

### Requisição
```bash
curl -X GET "http://localhost:3000/promotions/featured?limit=5"
```

### Validações
- [ ] Status code é 200
- [ ] Todas têm isFeatured = true

### Status
- [ ] ✅ Validado
- [ ] ⏳ Pendente
- [ ] ❌ Erro

---

## 5. Importar Promoções

### 5.1 Sem Autenticação
```bash
curl -X POST http://localhost:3000/promotions/import
```
- [ ] Status 401 (deve falhar)

### 5.2 Com Autenticação
```bash
curl -X POST http://localhost:3000/promotions/import \
  -H "Authorization: Bearer TOKEN" \
  -d '{"source": "mercadolivre"}'
```
- [ ] Status 200
- [ ] Retorna totalFetched, totalInserted

### Status
- [ ] ✅ Validado
- [ ] ⏳ Pendente
- [ ] ❌ Erro

---

## 6. Cleanup

### 6.1 Sem Autenticação
```bash
curl -X POST http://localhost:3000/promotions/cleanup
```
- [ ] Status 401 (deve falhar)

### 6.2 Com Autenticação
```bash
curl -X POST http://localhost:3000/promotions/cleanup \
  -H "Authorization: Bearer TOKEN"
```
- [ ] Status 200
- [ ] Retorna quantidade desativada

### Status
- [ ] ✅ Validado
- [ ] ⏳ Pendente
- [ ] ❌ Erro

---

## Resumo Final

- **Testes Validados**: _____ / 6
- **API Status**: [ ] ✅ Aprovada [ ] ❌ Reprovada

**Assinatura**: _______________________
