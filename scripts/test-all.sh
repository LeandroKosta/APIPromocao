#!/bin/bash

API_URL="${API_URL:-http://localhost:3000}"
API_TOKEN="${API_SECRET_TOKEN}"

echo "======================================"
echo "  TESTE COMPLETO DA API DE PROMOÇÕES"
echo "======================================"
echo ""
echo "URL: $API_URL"
echo ""

PASSED=0
FAILED=0

test_endpoint() {
  local name=$1
  local expected_status=$2
  shift 2
  
  echo "Testando: $name"
  response=$(curl -s -w "\n%{http_code}" "$@")
  status=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')
  
  if [ "$status" -eq "$expected_status" ]; then
    echo "✅ PASSOU (Status: $status)"
    ((PASSED++))
  else
    echo "❌ FALHOU (Esperado: $expected_status, Recebido: $status)"
    ((FAILED++))
  fi
  echo ""
}

echo "1. Health Check"
test_endpoint "GET /health" 200 "$API_URL/health"

echo "2. Sources"
test_endpoint "GET /sources" 200 "$API_URL/sources"

echo "3. Promotions"
test_endpoint "GET /promotions" 200 "$API_URL/promotions?page=1&limit=10"

echo "4. Featured"
test_endpoint "GET /promotions/featured" 200 "$API_URL/promotions/featured?limit=5"

echo "5. Import sem auth (deve falhar)"
test_endpoint "POST /promotions/import sem auth" 401 -X POST "$API_URL/promotions/import"

if [ -n "$API_TOKEN" ]; then
  echo "6. Import com auth"
  test_endpoint "POST /promotions/import com auth" 200 \
    -X POST "$API_URL/promotions/import" \
    -H "Authorization: Bearer $API_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"source": "mercadolivre"}'
  
  echo "7. Cleanup sem auth (deve falhar)"
  test_endpoint "POST /promotions/cleanup sem auth" 401 -X POST "$API_URL/promotions/cleanup"
  
  echo "8. Cleanup com auth"
  test_endpoint "POST /promotions/cleanup com auth" 200 \
    -X POST "$API_URL/promotions/cleanup" \
    -H "Authorization: Bearer $API_TOKEN"
else
  echo "⚠️  API_SECRET_TOKEN não configurado. Pulando testes autenticados."
  ((FAILED+=3))
fi

echo "======================================"
echo "  RESULTADO FINAL"
echo "======================================"
echo "✅ Passou: $PASSED"
echo "❌ Falhou: $FAILED"
echo ""

if [ $FAILED -eq 0 ]; then
  echo "🎉 Todos os testes passaram!"
  exit 0
else
  echo "⚠️  Alguns testes falharam."
  exit 1
fi
