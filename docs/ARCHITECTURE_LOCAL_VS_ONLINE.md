# Arquitetura: Promoções Locais vs Online

## Visão Geral

A API suporta dois tipos de promoções:
1. **Promoções Online** - Importadas de marketplaces (Mercado Livre, Amazon, Shopee)
2. **Promoções Locais** - Cadastradas por empresas locais da cidade

## Campos Identificadores

### Campo `type`
Define a categoria de negócio da promoção:
- `online` - Promoção de marketplace online
- `local` - Promoção de empresa local

### Campo `source`
Define a origem específica dos dados:
- `mercadolivre`, `amazon`, `shopee` - Para promoções online
- `local` - Para promoções cadastradas localmente
- Futuro: `mobile-app`, `admin-panel`, etc.

## Estrutura de Dados

```typescript
{
  "id": "uuid",
  "title": "Produto X",
  "type": "local" | "online",
  "source": "mercadolivre" | "amazon" | "shopee" | "local",
  "storeName": "Loja ABC",
  "location": {
    "city": "São Paulo",
    "state": "SP"
  },
  ...
}
```

## Filtros Disponíveis

```bash
# Apenas promoções locais
GET /promotions?type=local

# Apenas promoções online
GET /promotions?type=online

# Promoções locais de uma cidade específica
GET /promotions?type=local&city=São Paulo

# Promoções online do Mercado Livre
GET /promotions?type=online&source=mercadolivre
```

## Labels para o Front-end

### Helpers Disponíveis

```typescript
import { 
  getPromotionTypeLabel, 
  getPromotionSourceLabel,
  getPromotionBadgeColor 
} from './utils/promotion-labels';

// Labels
getPromotionTypeLabel('local')   // "Oferta Local"
getPromotionTypeLabel('online')  // "Oferta Online"

getPromotionSourceLabel('mercadolivre')  // "Mercado Livre"
getPromotionSourceLabel('local')         // "Cadastro Local"

// Cores para badges
getPromotionBadgeColor('local')   // "blue"
getPromotionBadgeColor('online')  // "green"
```

### Exemplo de Uso no Next.js

```tsx
import { PromotionDTO } from '@/types/promotion';
import { getPromotionTypeLabel, getPromotionBadgeColor } from '@/utils/promotion-labels';

export function PromotionCard({ promotion }: { promotion: PromotionDTO }) {
  const badgeColor = getPromotionBadgeColor(promotion.type);
  const typeLabel = getPromotionTypeLabel(promotion.type);

  return (
    <div className="promotion-card">
      <span className={`badge badge-${badgeColor}`}>
        {typeLabel}
      </span>
      <h3>{promotion.title}</h3>
      <p>{promotion.storeName}</p>
      
      {promotion.type === 'local' && promotion.location.city && (
        <p className="location">📍 {promotion.location.city}</p>
      )}
      
      <p className="price">R$ {promotion.newPrice.toFixed(2)}</p>
    </div>
  );
}
```

## Regras de Negócio

### Promoções Online
- `type` = `online`
- `source` = nome do marketplace
- Importadas automaticamente via cron jobs
- Podem ter `affiliateUrl` para comissão
- Geralmente não têm `companyId`

### Promoções Locais
- `type` = `local`
- `source` = `local` (ou origem específica no futuro)
- Cadastradas manualmente por empresas
- Devem ter `companyId` vinculado
- Devem ter `city` e preferencialmente `state`
- Podem ter `neighborhood` para localização mais precisa

## Escalabilidade Futura

### Novos Tipos
Adicionar novos valores ao enum `type`:
```typescript
type: 'local' | 'online' | 'hybrid' | 'flash'
```

### Novas Fontes
Adicionar novos valores ao `source`:
```typescript
// Promoções locais
source: 'local' | 'mobile-app' | 'admin-panel' | 'api-integration'

// Promoções online
source: 'mercadolivre' | 'amazon' | 'shopee' | 'aliexpress' | 'magalu'
```

### Filtros Compostos
```bash
# Promoções locais OU online de São Paulo
GET /promotions?city=São Paulo

# Apenas locais de São Paulo
GET /promotions?type=local&city=São Paulo

# Apenas online com entrega em São Paulo
GET /promotions?type=online&city=São Paulo
```

## Migration

Para aplicar as mudanças no banco:

```bash
# Aplicar migration
npx prisma migrate deploy

# Ou em desenvolvimento
npx prisma migrate dev

# Regenerar Prisma Client
npx prisma generate
```

## Exemplo de Cadastro Local

```typescript
// POST /promotions (rota protegida)
{
  "title": "Pizza Grande + Refrigerante",
  "description": "Promoção válida de segunda a quinta",
  "storeName": "Pizzaria do Bairro",
  "companyId": "company-uuid",
  "type": "local",
  "source": "local",
  "newPrice": 45.90,
  "oldPrice": 65.00,
  "category": "alimentacao",
  "city": "São Paulo",
  "state": "SP",
  "neighborhood": "Vila Mariana",
  "imageUrl": "https://...",
  "productUrl": "https://pizzariadobairro.com.br/promo",
  "expiresAt": "2026-03-19T23:59:59Z"
}
```

## Vantagens da Arquitetura

1. **Separação Clara** - Front-end sabe exatamente o tipo de promoção
2. **Flexível** - Fácil adicionar novos tipos e fontes
3. **Escalável** - Suporta múltiplas origens de dados
4. **Filtros Poderosos** - Permite combinações complexas
5. **Indexado** - Campo `type` tem índice para performance
6. **Retrocompatível** - Promoções existentes recebem `type='online'` por padrão
