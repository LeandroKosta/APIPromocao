# API de Promoções - Guia Comercial Digital

API externa modular para buscar, normalizar e servir promoções de múltiplas fontes online.

## 🚀 Tecnologias

- **Node.js** + **TypeScript**
- **Express** - Framework web
- **Prisma ORM** - Database ORM
- **PostgreSQL** - Banco de dados
- **Node-cron** - Agendamento de tarefas

## 📋 Funcionalidades

- ✅ Autenticação por token (Bearer)
- ✅ Paginação completa
- ✅ Filtros (categoria, cidade, fonte, destaque)
- ✅ Ordenação (desconto, recente, preço)
- ✅ Providers modulares (Mercado Livre, Amazon, Shopee)
- ✅ Importação em lote de promoções
- ✅ Cleanup automático de promoções expiradas
- ✅ Cron jobs configurados
- ✅ Logs de importação

## 🔧 Instalação

### Pré-requisitos

- Node.js 18+
- PostgreSQL 12+
- npm ou yarn

### Passo a Passo

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/api-promocoes.git
cd api-promocoes

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas configurações

# 4. Configure o banco de dados
# Crie o usuário e banco no PostgreSQL:
# CREATE USER apiuser WITH PASSWORD 'sua_senha';
# CREATE DATABASE apipromocao OWNER apiuser;
# GRANT ALL PRIVILEGES ON DATABASE apipromocao TO apiuser;

# 5. Execute as migrations
npx prisma generate
npx prisma db push

# 6. Inicie o servidor
npm run dev
```

## 📡 Endpoints

### Públicos

- `GET /health` - Status da API
- `GET /sources` - Lista providers disponíveis
- `GET /promotions` - Lista promoções (com paginação)
- `GET /promotions/featured` - Promoções em destaque
- `GET /promotions/:id` - Busca promoção por ID

### Protegidos (requerem token)

- `POST /promotions/import` - Importa promoções
- `POST /promotions/cleanup` - Remove promoções expiradas
- `GET /promotions/logs` - Logs de importação

## 🔐 Autenticação

Rotas protegidas requerem header:
```
Authorization: Bearer SEU_TOKEN
```

Configure `API_SECRET_TOKEN` no arquivo `.env`

## 🔍 Filtros e Paginação

```bash
# Paginação
GET /promotions?page=1&limit=20

# Filtros
GET /promotions?category=eletronicos&city=São Paulo

# Ordenação
GET /promotions?orderBy=discount  # maior desconto
GET /promotions?orderBy=recent    # mais recentes
GET /promotions?orderBy=price     # menor preço

# Combinado
GET /promotions?category=eletronicos&orderBy=discount&page=1&limit=10
```

## 📦 Formato Padrão de Resposta

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "string",
      "storeName": "string",
      "newPrice": 99.99,
      "oldPrice": 149.99,
      "discountPercent": 33,
      "source": "mercadolivre",
      "isActive": true,
      "isFeatured": false,
      ...
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

## ⏰ Cron Jobs

- **Importação**: Diariamente às 3h da manhã
- **Cleanup**: A cada 6 horas

## 🔌 Adicionar Novos Providers

1. Crie `src/providers/nome.provider.ts`
2. Estenda `BaseProvider`
3. Implemente os métodos obrigatórios:
   - `authenticate()`
   - `fetchPromotions()`
   - `isConfigured()`
4. Registre em `src/providers/index.ts`

Exemplo:

```typescript
import { BaseProvider } from './base.provider';
import { StandardPromotion } from '../types/promotion';

export class NovoProvider extends BaseProvider {
  name = 'novo';
  displayName = 'Novo Provider';

  isConfigured(): boolean {
    return !!process.env.NOVO_API_KEY;
  }

  async authenticate(): Promise<void> {
    // Lógica de autenticação
  }

  async fetchPromotions(): Promise<StandardPromotion[]> {
    // Lógica de busca
    return [];
  }
}
```

## 📚 Documentação

- [Setup Completo](docs/setup/SETUP.md)
- [Guia de Validação](docs/validation/VALIDATION.md)
- [Checklist Técnico](docs/validation/CHECKLIST-TECNICO.md)

## 🧪 Testes

```bash
# Executar testes
npm test

# Validação rápida
npm run validate
```

## 📂 Estrutura do Projeto

```
api-promocoes/
├── src/
│   ├── routes/           # Rotas da API
│   ├── services/         # Lógica de negócio
│   ├── providers/        # Providers (ML, Amazon, Shopee)
│   ├── middleware/       # Autenticação
│   ├── cron/            # Jobs agendados
│   ├── types/           # TypeScript types
│   └── server.ts        # Servidor Express
├── prisma/
│   └── schema.prisma    # Schema do banco
├── tests/               # Testes automatizados
├── scripts/             # Scripts utilitários
├── docs/                # Documentação
├── .env.example         # Exemplo de variáveis
├── package.json
└── README.md
```

## 🌍 Variáveis de Ambiente

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# Server
PORT=3000
NODE_ENV=development

# Security
API_SECRET_TOKEN=your-secret-token

# Mercado Livre (opcional)
MERCADOLIVRE_CLIENT_ID=
MERCADOLIVRE_CLIENT_SECRET=
MERCADOLIVRE_ACCESS_TOKEN=

# Amazon (opcional)
AMAZON_ACCESS_KEY=
AMAZON_SECRET_KEY=
AMAZON_PARTNER_TAG=
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT.

## 👥 Autores

- Seu Nome - [GitHub](https://github.com/seu-usuario)

## 🙏 Agradecimentos

- Guia Comercial Digital
- Comunidade Open Source
