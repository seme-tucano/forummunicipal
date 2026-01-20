# Fórum Municipal da Educação

Portal institucional do Fórum Municipal da Educação com painel administrativo para gestão de conteúdo, documentos e eventos.

## Stack Tecnológica

| Camada | Tecnologia |
|--------|------------|
| Framework | Next.js 15 (App Router, Turbopack) |
| Linguagem | TypeScript |
| Banco de dados | PostgreSQL 16 |
| ORM | Prisma |
| Autenticação | NextAuth.js v5 |
| UI | Tailwind CSS + Radix UI |
| Editor | Tiptap |
| Validação | Zod |

## Requisitos

- Node.js 20+
- PostgreSQL 16+
- npm ou pnpm

## Instalação

1. Clone o repositório:
```bash
git clone git@github.com:danielllimaa/forummunicipal.git
cd forummunicipal
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

4. Configure o banco de dados:
```bash
npx prisma migrate dev
npx prisma db seed
```

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Credenciais de Demonstração

| Perfil | Email | Senha |
|--------|-------|-------|
| Admin | admin@fme.edu.br | admin123 |
| Editor | editor@fme.edu.br | editor123 |

## Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento |
| `npm run build` | Gera build de produção |
| `npm start` | Inicia servidor de produção |
| `npm run lint` | Executa linter |
| `npx prisma studio` | Interface visual do banco |

## Estrutura do Projeto

```
src/
├── app/                    # App Router (Next.js 15)
│   ├── (public)/          # Páginas públicas
│   ├── (admin)/           # Painel administrativo
│   └── api/               # API Routes
├── components/
│   ├── ui/                # Componentes base
│   ├── public/            # Componentes do site
│   └── admin/             # Componentes do admin
├── lib/                   # Utilitários e configurações
└── types/                 # TypeScript interfaces
```

## Funcionalidades

### Site Público
- Página inicial com destaques
- Listagem e leitura de notícias
- Biblioteca de documentos
- Galeria de fotos
- Agenda de eventos
- Formulário de contato

### Painel Administrativo
- Dashboard com estatísticas
- CRUD de notícias com editor rich text
- Upload e gestão de documentos
- Galeria com álbuns
- Gestão de eventos
- Gestão de usuários (RBAC)
- Logs de auditoria

## Segurança

- Autenticação JWT via NextAuth.js
- RBAC (Role-Based Access Control)
- Proteção CSRF automática
- Sanitização de HTML
- Queries parametrizadas (Prisma)
- Rate limiting
- Headers de segurança

## Deploy

### Vercel (Recomendado)

1. Conecte o repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Docker

```bash
docker-compose up -d
```

## Licença

MIT License - veja [LICENSE](LICENSE) para detalhes.
