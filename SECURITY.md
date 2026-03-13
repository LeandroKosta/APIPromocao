# Security Policy

## Versões Suportadas

| Versão | Suportada          |
| ------ | ------------------ |
| 1.0.x  | :white_check_mark: |

## Reportando uma Vulnerabilidade

A segurança do projeto é levada a sério. Se você descobrir uma vulnerabilidade de segurança, por favor siga estas diretrizes:

### Como Reportar

1. **NÃO** abra uma issue pública
2. Envie um email para: [seu-email@exemplo.com]
3. Inclua:
   - Descrição detalhada da vulnerabilidade
   - Passos para reproduzir
   - Impacto potencial
   - Sugestões de correção (se houver)

### O que Esperar

- Confirmação de recebimento em até 48 horas
- Avaliação inicial em até 7 dias
- Atualizações regulares sobre o progresso
- Crédito público após a correção (se desejar)

## Boas Práticas de Segurança

### Para Usuários

- Nunca compartilhe seu `API_SECRET_TOKEN`
- Use HTTPS em produção
- Mantenha as dependências atualizadas
- Revise os logs regularmente
- Configure rate limiting no proxy reverso

### Para Desenvolvedores

- Nunca commite arquivos `.env`
- Use variáveis de ambiente para secrets
- Valide todas as entradas de usuário
- Sanitize dados antes de queries
- Mantenha dependências atualizadas
- Execute `npm audit` regularmente

## Configurações Recomendadas

### Produção

```env
NODE_ENV=production
API_SECRET_TOKEN=<token-forte-aleatorio>
DATABASE_URL=<url-segura-com-ssl>
```

### Rate Limiting

Recomendamos configurar rate limiting no nginx/proxy:

```nginx
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
```

## Atualizações de Segurança

Atualizações de segurança serão lançadas o mais rápido possível e comunicadas através de:

- GitHub Security Advisories
- Release notes
- Email (para vulnerabilidades críticas)

## Agradecimentos

Agradecemos a todos que reportam vulnerabilidades de forma responsável.
