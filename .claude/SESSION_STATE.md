# Estado da Sessão - Forum Municipal da Educação

**Última atualização:** 2026-01-21 (Sessão 2)
**Último commit:** 42b0fad - Adiciona seed do banco e dependência tsx

## O QUE JÁ FOI FEITO

### Backend (APIs)
- [x] Autenticação NextAuth v4 com credenciais
- [x] Middleware de proteção de rotas `/admin/*`
- [x] API Posts: CRUD completo (`/api/posts`, `/api/posts/[id]`)
- [x] API Documents: CRUD completo (`/api/documents`, `/api/documents/[id]`)
- [x] API Events: CRUD completo (`/api/events`, `/api/events/[id]`)
- [x] API Albums: CRUD completo (`/api/albums`, `/api/albums/[id]`)
- [x] API Categories: CRUD completo (`/api/categories`, `/api/categories/[id]`)
- [x] API Tags: GET (`/api/tags`)
- [x] API Users: CRUD completo (`/api/users`, `/api/users/[id]`)
- [x] API Stats: Dashboard (`/api/stats`)
- [x] API Upload: Upload de arquivos (`/api/upload`)
- [x] Sistema de auditoria (audit.ts)
- [x] Validações Zod (validations.ts)
- [x] Helpers de auth para APIs (api-auth.ts)

### Frontend (Páginas)
- [x] Layout público com header/footer
- [x] Home page com seções
- [x] Página de notícias (listagem)
- [x] Página de notícia individual (`/noticias/[slug]`)
- [x] Página de documentos
- [x] Página de agenda/eventos
- [x] Página de galeria
- [x] Página de contato
- [x] **Login page** (funcional com NextAuth)
- [x] Dashboard admin (estatísticas)
- [x] Admin - Listagem de notícias
- [x] Admin - Editor de notícia (`/admin/noticias/[id]`)
- [x] Admin - Listagem de categorias
- [x] Admin - Listagem de eventos
- [x] Admin - Listagem de documentos
- [x] Admin - Listagem de galeria
- [x] Admin - Listagem de usuários

### Infraestrutura
- [x] Prisma schema completo
- [x] Migração inicial
- [x] Docker Compose (postgres)
- [x] ESLint flat config
- [x] Build passando

## O QUE FALTA FAZER

### Prioridade Alta
- [x] Criar seed do banco com dados de exemplo ✅
- [x] Testar fluxo completo de login → dashboard ✅
- [ ] Implementar logout funcional
- [ ] Conectar páginas admin aos dados reais (usar hooks)

### Prioridade Média
- [ ] Admin - Modal/página de criar nova notícia
- [ ] Admin - Modal de criar nova categoria
- [ ] Admin - Modal de criar novo evento
- [ ] Admin - Modal de criar novo documento
- [ ] Admin - Modal de criar novo álbum
- [ ] Admin - Modal de criar novo usuário
- [ ] Implementar paginação nas listagens
- [ ] Implementar busca/filtros

### Prioridade Baixa
- [ ] Responsividade mobile
- [ ] Loading states e skeletons
- [ ] Notificações toast para ações
- [ ] Confirmação de exclusão
- [ ] Preview de imagens no upload
- [ ] Editor WYSIWYG melhorado (TipTap)

## COMANDOS ÚTEIS

```bash
# Iniciar dev
npm run dev

# Build
npm run build

# Banco de dados
docker-compose up -d postgres
npx prisma migrate dev
npx prisma studio

# Seed (quando criado)
npx prisma db seed
```

## CREDENCIAIS DE TESTE

**Admin:**
- Email: `admin@forum.gov.br`
- Senha: `admin123`

Seed executado via: `npx prisma db seed`

## CONEXÃO COM VPS (BANCO DE DADOS)

O banco PostgreSQL está no Coolify (VPS Hetzner):
- **IP VPS:** 178.156.218.152
- **Usuário SSH:** mkdls
- **Chave:** pvHETZER_dec.pem (na pasta forum)
- **Senha sudo:** 153640
- **Container DB:** do8g4gw004c0gksgw04w04s0 (IP interno: 10.0.1.7)

**Criar túnel SSH:**
```bash
ssh -f -N -L 5433:10.0.1.7:5432 mkdls@178.156.218.152 -i pvHETZER_dec.pem
```

## NOTAS IMPORTANTES

1. NextAuth v4 (não v5) - API estável
2. ESLint 9 com flat config
3. Arquivos sensíveis no .gitignore: *.pem, *.ppk, hertz
4. O projeto pai (/home/mkdls) tem node_modules que conflitava com ESLint - resolvido com outputFileTracingRoot
5. Banco de dados na VPS Coolify via túnel SSH na porta 5433
