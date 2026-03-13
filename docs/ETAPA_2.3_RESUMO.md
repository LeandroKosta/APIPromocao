# Etapa 2.3 - Promoções Locais vs Online

## ✅ Implementado

### 1. Schema do Banco
- ✅ Campo `type` (default: 'online')
- ✅ Campo `state` para localização completa
- ✅ Índice em `type` para performance
- ✅ Migration criada

### 2. DTOs e Mappers
- ✅ `PromotionDTO` atualizado com campo `type`
- ✅ Mapper atualizado para incluir `type`
- ✅ Source agora é string genérico (não mais enum fixo)

### 3. Service e Rotas
- ✅ Filtro `type` adicionado ao service
- ✅ Rota GET /promotions aceita `?type=local` ou `?type=online`
- ✅ Combinação de filtros: `?type=local&city=São Paulo`

### 4. Helpers para Front-end
- ✅ `getPromotionTypeLabel()` - retorna "Oferta Local" ou "Oferta Online"
- ✅ `getPromotionSourceLabel()` - retorna nome amigável da fonte
- ✅ `getPromotionBadgeColor()` - retorna cor para badges

### 5. Documentação
- ✅ `docs/ARCHITECTURE_LOCAL_VS_ONLINE.md` - arquitetura completa
- ✅ Exemplos de uso no Next.js
- ✅ Regras de negócio
- ✅ Plano de escalabilidade
- ✅ README atualizado

## 🎯 Decisões de Arquitetura

### Por que `type` + `source`?

**Campo `type`** (categoria de negócio):
- `local` - Promoção de empresa local
- `online` - Promoção de marketplace

**Campo `source`** (origem dos dados):
- `mercadolivre`, `amazon`, `shopee` - Marketplaces
- `local` - Cadastro local
- Futuro: `mobile-app`, `admin-panel`, `api-integration`

### Vantagens

1. **Separação de Responsabilidades**
   - `type` = regra de negócio
   - `source` = origem técnica

2. **Escalabilidade**
   - Fácil adicionar novos tipos: `hybrid`, `flash`, `exclusive`
   - Fácil adicionar novas fontes sem mudar o tipo

3. **Filtros Poderosos**
   - `?type=local` - todas locais
   - `?type=local&city=SP` - locais de SP
   - `?source=mercadolivre` - só do ML

4. **Front-end Intuitivo**
   - Labels claros: "Oferta Local" vs "Oferta Online"
   - Badges coloridos: azul para local, verde para online
   - Fácil distinguir visualmente

## 📋 Próximos Passos

1. Aplicar migration:
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

2. Atualizar providers existentes para definir `type: 'online'`

3. Criar endpoint POST /promotions para cadastro de promoções locais

4. Implementar validação: promoções locais devem ter `companyId` e `city`

## 🔄 Retrocompatibilidade

- Promoções existentes recebem `type='online'` automaticamente (default)
- Nenhuma quebra de contrato na API
- Front-end pode ignorar o campo `type` se não quiser usar
