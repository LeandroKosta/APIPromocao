#!/bin/bash

API_URL="${API_URL:-http://localhost:3000}"
API_TOKEN="${API_SECRET_TOKEN:-test-token}"

echo "🔍 Validando API de Promoções..."
echo "URL: $API_URL"
echo ""

echo "1️⃣ Testando /health..."
curl -s "$API_URL/health" | jq '.'
echo ""

echo "2️⃣ Testando /sources..."
curl -s "$API_URL/sources" | jq '.'
echo ""

echo "3️⃣ Testando /promotions..."
curl -s "$API_URL/promotions?limit=5" | jq '.'
echo ""

echo "4️⃣ Testando /promotions/featured..."
curl -s "$API_URL/promotions/featured?limit=3" | jq '.'
echo ""

echo "5️⃣ Testando /promotions/import sem autenticação (deve retornar 401)..."
curl -s -w "\nStatus: %{http_code}\n" -X POST "$API_URL/promotions/import"
echo ""

echo "6️⃣ Testando /promotions/cleanup sem autenticação (deve retornar 401)..."
curl -s -w "\nStatus: %{http_code}\n" -X POST "$API_URL/promotions/cleanup"
echo ""

echo "✅ Validação concluída!"
