# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projeto: Site do Fórum Municipal da Educação

Portal institucional do Fórum Municipal da Educação com painel administrativo para gestão de conteúdo, documentos e eventos.

## Arquitetura

**Decisão**: Full Custom com Next.js 15 (App Router)

Justificativa: Stack única, controle total, baixo custo de hospedagem, SSG/ISR nativo para performance, sem dependência de CMS externo.

### Stack Tecnológica

| Camada | Tecnologia |
|--------|------------|
| Framework | Next.js 15 (App Router, Turbopack) |
| Linguagem | TypeScript (strict mode) |
| Banco de dados | PostgreSQL 16 |
| ORM | Prisma |
| Autenticação | NextAuth.js v5 |
| UI | Tailwind CSS 4 + Radix UI |
| Editor Rich Text | Tiptap |
| Validação | Zod |
| Storage | Cloudflare R2 (S3-compatible) |
| CDN | Cloudflare (free tier) |
| Email | Resend |

## Comandos de Desenvolvimento

```bash
# Instalar dependências
npm install

# Desenvolvimento (com Turbopack)
npm run dev

# Build de produção
npm run build

# Iniciar produção
npm start

# Lint
npm run lint

# Prisma - Banco de dados
npx prisma generate          # Gerar client após mudanças no schema
npx prisma migrate dev       # Criar migration em desenvolvimento
npx prisma migrate deploy    # Aplicar migrations em produção
npx prisma studio            # Interface visual do banco
npx prisma db seed           # Popular dados iniciais

# Testes
npm test                     # Rodar todos os testes
npm test -- --watch          # Modo watch
npm test -- path/to/file     # Teste específico
```

## Estrutura do Projeto

```
src/
├── app/                      # App Router (Next.js 15)
│   ├── (public)/            # Grupo: páginas públicas
│   │   ├── page.tsx         # Home
│   │   ├── noticias/        # Listagem e [slug] de notícias
│   │   ├── documentos/      # Biblioteca de arquivos
│   │   ├── galeria/         # Fotos e vídeos
│   │   ├── agenda/          # Eventos
│   │   └── contato/         # Formulário de contato
│   ├── (admin)/             # Grupo: painel administrativo
│   │   └── admin/
│   │       ├── layout.tsx   # Layout com sidebar
│   │       ├── page.tsx     # Dashboard
│   │       ├── noticias/    # CRUD notícias
│   │       ├── documentos/  # Upload e gestão
│   │       ├── galeria/     # Upload de imagens
│   │       ├── eventos/     # CRUD eventos
│   │       ├── categorias/  # Gestão de categorias
│   │       └── usuarios/    # Gestão de usuários
│   ├── api/                 # API Routes
│   │   ├── auth/           # NextAuth handlers
│   │   ├── upload/         # Upload de arquivos
│   │   └── contact/        # Envio de formulário
│   ├── layout.tsx          # Root layout
│   └── globals.css         # Estilos globais
├── components/
│   ├── ui/                 # Componentes base (Button, Card, Input...)
│   ├── public/             # Componentes do site público
│   └── admin/              # Componentes do painel admin
├── lib/
│   ├── prisma.ts           # Cliente Prisma singleton
│   ├── auth.ts             # Configuração NextAuth
│   ├── storage.ts          # Cliente S3/R2
│   └── utils.ts            # Utilitários gerais
├── actions/                # Server Actions
│   ├── posts.ts            # Ações de notícias
│   ├── documents.ts        # Ações de documentos
│   └── users.ts            # Ações de usuários
└── types/
    └── index.ts            # TypeScript interfaces
```

## Modelo de Dados (Prisma Schema)

### Entidades Principais

```prisma
// Usuário do sistema
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String
  passwordHash  String
  role          Role      @default(EDITOR)
  active        Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  posts         Post[]
  documents     Document[]
  auditLogs     AuditLog[]
}

enum Role {
  ADMIN      // Acesso total
  EDITOR     // Criar e editar conteúdo próprio
  REVIEWER   // Revisar e aprovar conteúdo
}

// Notícia/Post
model Post {
  id          String      @id @default(cuid())
  title       String
  slug        String      @unique
  excerpt     String      @db.Text
  content     String      @db.Text  // HTML do Tiptap
  coverImage  String?
  status      PostStatus  @default(DRAFT)
  publishedAt DateTime?
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  authorId    String
  author      User        @relation(fields: [authorId], references: [id])
  categoryId  String?
  category    Category?   @relation(fields: [categoryId], references: [id])
  tags        Tag[]
}

enum PostStatus {
  DRAFT       // Rascunho
  REVIEW      // Aguardando revisão
  PUBLISHED   // Publicado
  ARCHIVED    // Arquivado
}

// Categoria
model Category {
  id          String   @id @default(cuid())
  name        String   @unique
  slug        String   @unique
  description String?

  posts       Post[]
  documents   Document[]
}

// Tag
model Tag {
  id    String @id @default(cuid())
  name  String @unique
  slug  String @unique

  posts Post[]
}

// Documento/Arquivo
model Document {
  id          String       @id @default(cuid())
  title       String
  description String?      @db.Text
  fileName    String
  fileUrl     String
  fileSize    Int
  mimeType    String
  type        DocumentType
  year        Int?
  version     Int          @default(1)
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt

  uploadedById String
  uploadedBy   User        @relation(fields: [uploadedById], references: [id])
  categoryId   String?
  category     Category?   @relation(fields: [categoryId], references: [id])
}

enum DocumentType {
  ATA
  RESOLUCAO
  EDITAL
  PARECER
  RELATORIO
  PLANILHA
  OUTRO
}

// Imagem da Galeria
model GalleryImage {
  id          String   @id @default(cuid())
  title       String?
  description String?
  imageUrl    String
  thumbnailUrl String?
  albumId     String?
  album       Album?   @relation(fields: [albumId], references: [id])
  order       Int      @default(0)
  createdAt   DateTime @default(now())
}

model Album {
  id          String         @id @default(cuid())
  name        String
  slug        String         @unique
  description String?
  coverImage  String?
  createdAt   DateTime       @default(now())

  images      GalleryImage[]
}

// Evento
model Event {
  id          String    @id @default(cuid())
  title       String
  slug        String    @unique
  description String    @db.Text
  location    String?
  startDate   DateTime
  endDate     DateTime?
  published   Boolean   @default(false)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

// Log de Auditoria
model AuditLog {
  id        String   @id @default(cuid())
  action    String   // CREATE, UPDATE, DELETE, LOGIN, etc
  entity    String   // Post, Document, User, etc
  entityId  String?
  details   Json?
  ip        String?
  userAgent String?
  createdAt DateTime @default(now())

  userId    String?
  user      User?    @relation(fields: [userId], references: [id])
}

// Configurações do site
model SiteSettings {
  id          String @id @default("main")
  siteName    String @default("Fórum Municipal da Educação")
  description String?
  logo        String?
  favicon     String?
  socialLinks Json?  // {facebook, instagram, youtube}
  contactEmail String?
  address     String?
  phone       String?
  updatedAt   DateTime @updatedAt
}
```

## Fluxos de Trabalho

### Publicação de Notícia

```
1. DRAFT (Rascunho)
   ↓ Autor clica "Enviar para revisão"
2. REVIEW (Em revisão)
   ↓ Revisor aprova
3. PUBLISHED (Publicado)
   ↓ Qualquer editor pode arquivar
4. ARCHIVED (Arquivado)
```

**Regras:**
- EDITOR: cria, edita próprios posts, envia para revisão
- REVIEWER: revisa, aprova/rejeita, publica
- ADMIN: todas as ações + gestão de usuários

### Upload de Documento

1. Usuário seleciona arquivo (validação: tipo, tamanho máximo 50MB)
2. Upload para R2/S3 com nome único (uuid + extensão original)
3. Extração de metadados (tamanho, mime type)
4. Usuário preenche: título, descrição, tipo, ano, categoria
5. Salva no banco com referência ao arquivo
6. Gera log de auditoria

### Gestão de Usuários

- Apenas ADMIN pode criar/editar/desativar usuários
- Senhas: bcrypt com cost factor 12
- Sessões: JWT via NextAuth, httpOnly cookies
- Toda ação administrativa gera AuditLog

## Segurança

### Implementações Obrigatórias

| Requisito | Implementação |
|-----------|---------------|
| Autenticação | NextAuth.js v5, sessões JWT |
| Autorização | RBAC (Role-Based Access Control) via middleware |
| CSRF | Token automático do NextAuth |
| XSS | Sanitização de HTML (DOMPurify), CSP headers |
| SQL Injection | Prisma (queries parametrizadas) |
| Upload seguro | Validação MIME, limite de tamanho, extensões permitidas |
| Rate Limiting | Middleware com limite por IP (100 req/min) |
| Headers | Helmet.js ou headers manuais (X-Frame-Options, etc) |
| HTTPS | Obrigatório em produção |
| 2FA | Opcional via TOTP (fase 2) |

### Headers de Segurança (next.config.js)

```javascript
headers: [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]
```

### Validação de Upload

```typescript
const ALLOWED_TYPES = {
  documents: ['application/pdf', 'application/msword', ...],
  images: ['image/jpeg', 'image/png', 'image/webp'],
};
const MAX_SIZE = 50 * 1024 * 1024; // 50MB
```

## Performance

### Estratégias de Renderização

| Página | Estratégia | Revalidação |
|--------|------------|-------------|
| Home | ISR | 60 segundos |
| Lista de notícias | ISR | 60 segundos |
| Notícia individual | SSG + ISR | On-demand |
| Documentos | ISR | 300 segundos |
| Galeria | ISR | 300 segundos |
| Admin | SSR | Nenhuma (dinâmico) |

### Otimizações

- **Imagens**: next/image com otimização automática, WebP, lazy loading
- **Fontes**: next/font com subset e preload
- **CSS**: Tailwind com purge em produção
- **Cache**: CDN para assets estáticos, stale-while-revalidate
- **Bundle**: Code splitting automático, dynamic imports para admin
- **Banco**: Índices em slug, createdAt, status; paginação cursor-based

## SEO e Acessibilidade

### SEO

- Metadata API do Next.js 15 para title, description, Open Graph
- Sitemap dinâmico em `/sitemap.xml`
- robots.txt em `/robots.txt`
- URLs amigáveis: `/noticias/[slug]`, `/documentos/[id]`
- Dados estruturados (JSON-LD) para artigos e eventos

### Acessibilidade (WCAG 2.1 AA)

- Radix UI: componentes acessíveis por padrão
- Skip links, landmarks, headings hierárquicos
- Contraste mínimo 4.5:1
- Focus visible em todos elementos interativos
- Alt text obrigatório em imagens
- Formulários com labels associados e mensagens de erro

## DevOps

### Ambientes

| Ambiente | URL | Branch |
|----------|-----|--------|
| Development | localhost:3000 | feature/* |
| Staging | staging.forum.edu.br | develop |
| Production | forum.edu.br | main |

### CI/CD (GitHub Actions)

```yaml
# .github/workflows/ci.yml
- Lint (ESLint)
- Type check (tsc --noEmit)
- Testes unitários
- Build de verificação
- Deploy automático para staging (develop)
- Deploy manual para produção (main)
```

### Hospedagem Recomendada (Baixo Custo)

| Serviço | Opção | Custo estimado |
|---------|-------|----------------|
| Frontend/API | Vercel (free tier) ou VPS | $0 - $5/mês |
| Banco | Supabase (free) ou VPS | $0 - $5/mês |
| Storage | Cloudflare R2 | $0.015/GB |
| CDN | Cloudflare | $0 |
| Email | Resend (free tier) | $0 |

**Total estimado**: $0 - $15/mês para MVP

## Plano de Entrega

### Fase 1 - MVP (2-3 semanas)

- [x] Setup do projeto (Next.js, Prisma, auth)
- [ ] Modelo de dados básico
- [ ] Autenticação e autorização (login, RBAC)
- [ ] CRUD de notícias com editor rich text
- [ ] Listagem pública de notícias com paginação
- [ ] Página de notícia individual (SSG)
- [ ] Upload básico de documentos
- [ ] Biblioteca de documentos com filtros
- [ ] Layout responsivo básico
- [ ] Deploy em staging

### Fase 2 - Complementos (2 semanas)

- [ ] Galeria de fotos com álbuns
- [ ] Agenda de eventos
- [ ] Formulário de contato
- [ ] Busca full-text
- [ ] Categorias e tags
- [ ] Sitemap e SEO completo

### Fase 3 - Polimento (1-2 semanas)

- [ ] Dashboard com estatísticas
- [ ] Fluxo de revisão completo
- [ ] Logs de auditoria visíveis no admin
- [ ] Otimizações de performance
- [ ] Testes E2E
- [ ] Documentação de uso

### Fase 4 - Evoluções Futuras

- [ ] 2FA opcional
- [ ] Notificações por email
- [ ] API pública (opcional)
- [ ] Integração com redes sociais
- [ ] Versões de documentos
- [ ] Moderação de comentários (se aplicável)

## Variáveis de Ambiente

```env
# Banco de dados
DATABASE_URL="postgresql://user:pass@localhost:5432/forum_educacao"

# NextAuth
NEXTAUTH_SECRET="gerar-com-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# Storage (Cloudflare R2)
S3_ENDPOINT="https://account.r2.cloudflarestorage.com"
S3_ACCESS_KEY_ID="..."
S3_SECRET_ACCESS_KEY="..."
S3_BUCKET="forum-educacao"
S3_PUBLIC_URL="https://cdn.forum.edu.br"

# Email
RESEND_API_KEY="re_..."
EMAIL_FROM="noreply@forum.edu.br"
```

## Convenções de Código

- **Commits**: em português, descritivos
- **Branches**: `feature/nome`, `fix/nome`, `hotfix/nome`
- **Componentes**: PascalCase, um por arquivo
- **Funções**: camelCase
- **Constantes**: UPPER_SNAKE_CASE
- **Arquivos**: kebab-case

## Git Config

```bash
git config user.name "Nome do Desenvolvedor"
git config user.email "email@prefeitura.gov.br"
```
