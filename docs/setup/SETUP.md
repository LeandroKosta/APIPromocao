# Guia de Instalacao e Configuracao

## Pre-requisitos

- Node.js 18 ou superior
- PostgreSQL 12 ou superior
- npm ou yarn

## Instalacao Passo a Passo

### 1. Clone o Repositorio

git clone https://github.com/seu-usuario/api-promocoes.git
cd api-promocoes

### 2. Instale as Dependencias

npm install

### 3. Configure o Banco de Dados

Opcao A: pgAdmin (Recomendado)

1. Abra o pgAdmin
2. Conecte ao servidor PostgreSQL
3. Crie um novo Login/Group Role:
   - Nome: apiuser
   - Senha: sua_senha_segura
   - Marque Can login
4. Crie um novo Database:
   - Nome: apipromocao
   - Owner: apiuser

Opcao B: SQL Shell (psql)

CREATE USER apiuser WITH PASSWORD 'sua_senha_segura';
CREATE DATABASE apipromocao OWNER apiuser;
GRANT ALL PRIVILEGES ON DATABASE apipromocao TO apiuser;

### 4. Configure as Variaveis de Ambiente

cp .env.example .env

Edite o arquivo .env:

DATABASE_URL="postgresql://apiuser:sua_senha_segura@localhost:5432/apipromocao"
PORT=3000
NODE_ENV=development
API_SECRET_TOKEN=seu-token-secreto-aqui

### 5. Execute as Migrations do Prisma

npx prisma generate
npx prisma db push

### 6. Inicie o Servidor

npm run dev

## Verificacao

Teste se a API esta funcionando:

curl http://localhost:3000/health

Resposta esperada: status ok

## Troubleshooting

Erro Authentication failed:
- Verifique se o usuario apiuser foi criado
- Verifique se a senha no .env esta correta
- Verifique se o PostgreSQL esta rodando

Erro Port 3000 already in use:
- Altere a porta no .env
- Ou mate o processo na porta 3000

Erro Prisma Client not generated:
- Execute: npx prisma generate
