# Formato de Resposta da API

## GET /promotions

### Resposta Padrão

```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Smart TV 50\" 4K UHD",
      "description": "Smart TV com tecnologia 4K e HDR",
      "storeName": "Loja Exemplo",
      "category": "eletronicos",
      "newPrice": 1899.90,
      "oldPrice": 2999.90,
      "discountPercent": 37,
      "imageUrl": "https://example.com/image.jpg",
      "productUrl": "https://example.com/produto",
      "source": "mercadolivre",
      "location": {
        "city": "São Paulo",
        "state": "SP"
      },
      "isFeatured": true,
      "createdAt": "2026-03-12T16:09:53.267Z",
      "expiresAt": "2026-03-19T16:09:53.267Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## GET /promotions/featured

### Resposta

```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Smart TV 50\" 4K UHD",
      "description": "Smart TV com tecnologia 4K e HDR",
      "storeName": "Loja Exemplo",
      "category": "eletronicos",
      "newPrice": 1899.90,
      "oldPrice": 2999.90,
      "discountPercent": 37,
      "imageUrl": "https://example.com/image.jpg",
      "productUrl": "https://example.com/produto",
      "source": "mercadolivre",
      "location": {
        "city": "São Paulo",
        "state": "SP"
      },
      "isFeatured": true,
      "createdAt": "2026-03-12T16:09:53.267Z",
      "expiresAt": "2026-03-19T16:09:53.267Z"
    }
  ]
}
```

## GET /promotions/:id

### Resposta

```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Smart TV 50\" 4K UHD",
    "description": "Smart TV com tecnologia 4K e HDR",
    "storeName": "Loja Exemplo",
    "category": "eletronicos",
    "newPrice": 1899.90,
    "oldPrice": 2999.90,
    "discountPercent": 37,
    "imageUrl": "https://example.com/image.jpg",
    "productUrl": "https://example.com/produto",
    "source": "mercadolivre",
    "location": {
      "city": "São Paulo",
      "state": "SP"
    },
    "isFeatured": true,
    "createdAt": "2026-03-12T16:09:53.267Z",
    "expiresAt": "2026-03-19T16:09:53.267Z"
  }
}
```

## Campos da Promoção

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | string | UUID único da promoção |
| title | string | Título do produto |
| description | string \| null | Descrição detalhada |
| storeName | string | Nome da loja |
| category | string \| null | Categoria do produto |
| newPrice | number | Preço promocional |
| oldPrice | number \| null | Preço original (antes da promoção) |
| discountPercent | number \| null | Percentual de desconto |
| imageUrl | string \| null | URL da imagem do produto |
| productUrl | string | Link para o produto |
| source | 'mercadolivre' \| 'amazon' \| 'shopee' | Origem da promoção |
| location.city | string \| null | Cidade |
| location.state | string \| null | Estado (UF) |
| isFeatured | boolean | Se é promoção em destaque |
| createdAt | string | Data de criação (ISO 8601) |
| expiresAt | string \| null | Data de expiração (ISO 8601) |

## Paginação

| Campo | Tipo | Descrição |
|-------|------|-----------|
| page | number | Página atual |
| limit | number | Itens por página |
| total | number | Total de itens |
| totalPages | number | Total de páginas |
| hasNext | boolean | Se existe próxima página |
| hasPrev | boolean | Se existe página anterior |

## Integração com Next.js

### Exemplo de Fetch

```typescript
interface Promotion {
  id: string;
  title: string;
  description: string | null;
  storeName: string;
  category: string | null;
  newPrice: number;
  oldPrice: number | null;
  discountPercent: number | null;
  imageUrl: string | null;
  productUrl: string;
  source: 'mercadolivre' | 'amazon' | 'shopee';
  location: {
    city: string | null;
    state: string | null;
  };
  isFeatured: boolean;
  createdAt: string;
  expiresAt: string | null;
}

interface PromotionListResponse {
  data: Promotion[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

async function getPromotions(page = 1): Promise<PromotionListResponse> {
  const res = await fetch(`http://localhost:3000/promotions?page=${page}&limit=20`);
  return res.json();
}
```

### Exemplo de Componente

```tsx
'use client';

import { useState, useEffect } from 'react';

export default function PromotionsList() {
  const [data, setData] = useState<PromotionListResponse | null>(null);

  useEffect(() => {
    fetch('http://localhost:3000/promotions')
      .then(res => res.json())
      .then(setData);
  }, []);

  if (!data) return <div>Carregando...</div>;

  return (
    <div>
      {data.data.map(promo => (
        <div key={promo.id}>
          <h3>{promo.title}</h3>
          <p>{promo.storeName}</p>
          <p>R$ {promo.newPrice.toFixed(2)}</p>
          {promo.discountPercent && <span>{promo.discountPercent}% OFF</span>}
        </div>
      ))}
      
      <div>
        Página {data.pagination.page} de {data.pagination.totalPages}
      </div>
    </div>
  );
}
```
