#!/bin/bash

echo "🔍 Iniciando Validação Completa da API de Promoções"
echo "=================================================="
echo ""

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

SUCCESS=0
FAILED=0
SKIPPED=0

# Função para log
log_success() {
    echo -e "${GREEN}✅ $1${NC}"
    ((SUCCESS++))
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
    ((FAILED++))
}

log_skip() {
    echo -e "${YELLOW}⏭️  $1${NC}"
    ((SKIPPED++))
}

echo "1️⃣  Verificando estrutura do projeto..."
echo "----------------------------------------"

# Verificar arquivos essenciais
if [ -f "package.json" ]; then
    log_success "package.json existe"
else
    log_error "package.json não encontrado"
fi

if [ -f "tsconfig.json" ]; then
    log_success "tsconfig.json existe"
else
    log_error "tsconfig.json não encontrado"
fi

if [ -f "prisma/schema.prisma" ]; then
    log_success "prisma/schema.prisma existe"
else
    log_error "prisma/schema.prisma não encontrado"
fi

if [ -f ".env" ]; then
    log_success ".env existe"
else
    log_error ".env não encontrado"
fi

echo ""
echo "2️⃣  Verificando dependências..."
echo "----------------------------------------"

if [ -d "node_modules" ]; then
    log_success "node_modules instalado"
else
    log_error "node_modules não encontrado - execute npm install"
fi

echo ""
echo "3️⃣  Verificando TypeScript..."
echo "----------------------------------------"

npx tsc --noEmit 2>&1 > /tmp/tsc-output.txt
if [ $? -eq 0 ]; then
    log_success "Sem erros de TypeScript"
else
    log_error "Erros de TypeScript encontrados"
    cat /tmp/tsc-output.txt
fi

echo ""
echo "4️⃣  Verificando estrutura de arquivos..."
echo "----------------------------------------"

# Verificar diretórios
for dir in src src/routes src/services src/providers src/dtos src/mappers src/types prisma tests; do
    if [ -d "$dir" ]; then
        log_success "Diretório $dir existe"
    else
        log_error "Diretório $dir não encontrado"
    fi
done

# Verificar arquivos principais
files=(
    "src/server.ts"
    "src/routes/promotions.routes.ts"
    "src/routes/import.routes.ts"
    "src/routes/sources.routes.ts"
    "src/services/promotion.service.ts"
    "src/services/import.service.ts"
    "src/dtos/promotion.dto.ts"
    "src/mappers/promotion.mapper.ts"
    "src/types/promotion.ts"
    "src/providers/base.provider.ts"
    "src/providers/mercadolivre.provider.ts"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        log_success "$file existe"
    else
        log_error "$file não encontrado"
    fi
done

echo ""
echo "5️⃣  Verificando Prisma..."
echo "----------------------------------------"

if [ -d "node_modules/@prisma/client" ]; then
    log_success "Prisma Client gerado"
else
    log_error "Prisma Client não gerado - execute npx prisma generate"
fi

# Verificar se há migrations
if [ -d "prisma/migrations" ]; then
    migration_count=$(ls -1 prisma/migrations | wc -l)
    log_success "Migrations encontradas: $migration_count"
else
    log_error "Diretório de migrations não encontrado"
fi

echo ""
echo "6️⃣  Verificando campo 'type' no schema..."
echo "----------------------------------------"

if grep -q "type.*String" prisma/schema.prisma; then
    log_success "Campo 'type' encontrado no schema"
else
    log_error "Campo 'type' não encontrado no schema"
fi

if grep -q "state.*String" prisma/schema.prisma; then
    log_success "Campo 'state' encontrado no schema"
else
    log_error "Campo 'state' não encontrado no schema"
fi

echo ""
echo "7️⃣  Verificando DTOs e Mappers..."
echo "----------------------------------------"

if grep -q "type.*'local'.*'online'" src/dtos/promotion.dto.ts; then
    log_success "DTO com campo 'type' correto"
else
    log_error "DTO sem campo 'type' ou formato incorreto"
fi

if grep -q "PromotionMapper" src/mappers/promotion.mapper.ts; then
    log_success "PromotionMapper existe"
else
    log_error "PromotionMapper não encontrado"
fi

if grep -q "toPaginatedResponse" src/mappers/promotion.mapper.ts; then
    log_success "Método toPaginatedResponse existe"
else
    log_error "Método toPaginatedResponse não encontrado"
fi

echo ""
echo "8️⃣  Verificando rotas..."
echo "----------------------------------------"

if grep -q "GET.*/" src/routes/promotions.routes.ts; then
    log_success "Rota GET /promotions existe"
else
    log_error "Rota GET /promotions não encontrada"
fi

if grep -q "featured" src/routes/promotions.routes.ts; then
    log_success "Rota GET /promotions/featured existe"
else
    log_error "Rota GET /promotions/featured não encontrada"
fi

echo ""
echo "9️⃣  Verificando autenticação..."
echo "----------------------------------------"

if grep -q "Authorization" src/middleware/auth.middleware.ts 2>/dev/null || grep -q "Bearer" src/routes/import.routes.ts; then
    log_success "Sistema de autenticação implementado"
else
    log_skip "Sistema de autenticação não verificado"
fi

echo ""
echo "🔟 Verificando documentação..."
echo "----------------------------------------"

docs=(
    "README.md"
    "STATUS_FINAL.md"
    "CHECKLIST_FINAL.md"
    "docs/API_RESPONSE_FORMAT.md"
    "docs/ARCHITECTURE_LOCAL_VS_ONLINE.md"
)

for doc in "${docs[@]}"; do
    if [ -f "$doc" ]; then
        log_success "$doc existe"
    else
        log_error "$doc não encontrado"
    fi
done

echo ""
echo "=================================================="
echo "📊 RESUMO DA VALIDAÇÃO"
echo "=================================================="
echo -e "${GREEN}✅ Sucessos: $SUCCESS${NC}"
echo -e "${RED}❌ Falhas: $FAILED${NC}"
echo -e "${YELLOW}⏭️  Ignorados: $SKIPPED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 Validação concluída com sucesso!${NC}"
    exit 0
else
    echo -e "${RED}⚠️  Validação concluída com $FAILED erro(s)${NC}"
    exit 1
fi
