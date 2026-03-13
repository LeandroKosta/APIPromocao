# 🐘 Guia de Configuração do PostgreSQL

## Opção 1: Docker (Recomendado)

### Instalar Docker
```bash
# Windows (WSL2)
# Baixar Docker Desktop: https://www.docker.com/products/docker-desktop

# Linux
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

### Iniciar PostgreSQL com Docker
```bash
docker run --name postgres-promotions \
  -e POSTGRES_USER=promotions_user \
  -e POSTGRES_PASSWORD=promotions_pass \
  -e POSTGRES_DB=promotions_db \
  -p 5432:5432 \
  -d postgres:15

# Verificar se está rodando
docker ps
```

### Atualizar .env
```env
DATABASE_URL="postgresql://promotions_user:promotions_pass@localhost:5432/promotions_db"
```

### Aplicar Migrations
```bash
npx prisma migrate deploy
npx prisma generate
```

---

## Opção 2: PostgreSQL Local

### Instalar PostgreSQL

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows:**
- Baixar: https://www.postgresql.org/download/windows/
- Instalar e configurar senha

**macOS:**
```bash
brew install postgresql@15
brew services start postgresql@15
```

### Criar Banco de Dados
```bash
# Conectar como postgres
sudo -u postgres psql

# Criar usuário e banco
CREATE USER promotions_user WITH PASSWORD 'promotions_pass';
CREATE DATABASE promotions_db OWNER promotions_user;
GRANT ALL PRIVILEGES ON DATABASE promotions_db TO promotions_user;
\q
```

### Atualizar .env
```env
DATABASE_URL="postgresql://promotions_user:promotions_pass@localhost:5432/promotions_db"
```

### Aplicar Migrations
```bash
npx prisma migrate deploy
npx prisma generate
```

---

## Opção 3: SQLite (Apenas para Testes)

### Vantagens
- ✅ Não requer instalação
- ✅ Arquivo local
- ✅ Rápido para desenvolvimento

### Desvantagens
- ❌ Não recomendado para produção
- ❌ Menos recursos que PostgreSQL

### Configuração

1. **Atualizar prisma/schema.prisma:**
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

2. **Atualizar .env:**
```env
DATABASE_URL="file:./dev.db"
```

3. **Aplicar migrations:**
```bash
npx prisma migrate dev --name init
npx prisma generate
```

---

## Verificar Configuração

```bash
# Testar conexão
npx prisma db push

# Ver tabelas criadas
npx prisma studio
```

---

## Comandos Úteis

```bash
# Parar container Docker
docker stop postgres-promotions

# Iniciar container Docker
docker start postgres-promotions

# Remover container Docker
docker rm -f postgres-promotions

# Ver logs do PostgreSQL
docker logs postgres-promotions

# Conectar ao banco via psql
docker exec -it postgres-promotions psql -U promotions_user -d promotions_db
```

---

## Troubleshooting

### Erro: "Can't reach database server"
- Verificar se PostgreSQL está rodando
- Verificar porta 5432 disponível
- Verificar credenciais no .env

### Erro: "P1001"
- PostgreSQL não está ativo
- Firewall bloqueando porta 5432

### Erro: "P3009"
- Migrations já aplicadas
- Use `npx prisma migrate resolve --applied <migration_name>`
