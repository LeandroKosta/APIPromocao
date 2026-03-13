# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [1.0.0] - 2026-03-13

### Adicionado
- Sistema de autenticação por Bearer token
- Endpoints públicos para listagem de promoções
- Endpoints protegidos para importação e gerenciamento
- Paginação completa com metadados
- Filtros por categoria, cidade, fonte e destaque
- Ordenação por desconto, data e preço
- Providers modulares (Mercado Livre, Amazon, Shopee)
- Sistema de importação em lote
- Cleanup automático de promoções expiradas
- Cron jobs para importação diária e limpeza
- Logs de importação com rastreamento
- Suporte a PostgreSQL via Prisma ORM
- Documentação completa
- Testes automatizados
- CI/CD com GitHub Actions
- Scripts de validação

### Estrutura
- Arquitetura modular e escalável
- Normalização de dados entre providers
- DTOs e mappers para separação de camadas
- Middleware de autenticação
- Tratamento de erros padronizado
- Validação de dados

[1.0.0]: https://github.com/seu-usuario/api-promocoes/releases/tag/v1.0.0
