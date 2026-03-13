# Instruções para Configurar o Banco de Dados

## Problema Identificado
O usuário `apiuser` não existe no PostgreSQL ou a senha está incorreta.

## Solução

### Opção 1: Usando pgAdmin (Recomendado)

1. Abra o **pgAdmin**
2. Conecte ao servidor PostgreSQL (usuário: postgres)
3. Clique com botão direito em "Login/Group Roles" → "Create" → "Login/Group Role"
4. Na aba "General": Nome = `apiuser`
5. Na aba "Definition": Password = `minhasenha152634`
6. Na aba "Privileges": Marque "Can login?"
7. Clique em "Save"
8. Clique com botão direito em "Databases" → "Create" → "Database"
9. Nome = `apipromocao`
10. Owner = `apiuser`
11. Clique em "Save"

### Opção 2: Usando SQL Shell (psql)

1. Abra o **SQL Shell (psql)** do menu iniciar
2. Pressione Enter para aceitar os valores padrão até pedir a senha
3. Digite a senha do usuário `postgres`
4. Execute os comandos:

```sql
CREATE USER apiuser WITH PASSWORD 'minhasenha152634';
CREATE DATABASE apipromocao OWNER apiuser;
GRANT ALL PRIVILEGES ON DATABASE apipromocao TO apiuser;
```

### Opção 3: Linha de Comando (PowerShell como Administrador)

```powershell
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -f setup-simple.sql
```

## Após Configurar o Banco

Execute os seguintes comandos na pasta do projeto:

```bash
# 1. Gerar Prisma Client
npx prisma generate

# 2. Criar tabelas no banco
npx prisma db push

# 3. Iniciar a API
npm run dev

# 4. Testar
curl http://localhost:3000/health
curl http://localhost:3000/promotions
```

## Verificar se Funcionou

Se tudo estiver correto, você verá:

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 0,
    "totalPages": 0
  }
}
```
