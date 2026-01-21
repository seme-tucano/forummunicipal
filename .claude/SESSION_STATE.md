# Forum Municipal - PRONTO PARA PRODUÇÃO

**Último commit:** fa12dde
**Status:** 100% funcional, pronto para deploy

## CREDENCIAIS
- **Admin:** admin@forum.gov.br / admin123
- **VPS:** 178.156.218.152 (mkdls, chave: pvHETZER_dec.pem, sudo: 153640)
- **DB Container:** 10.0.1.7:5432

## VARIÁVEIS PARA COOLIFY
```env
DATABASE_URL=postgresql://usuario:senha@10.0.1.7:5432/forum
NEXTAUTH_SECRET=gerar-com-openssl-rand-base64-32
NEXTAUTH_URL=https://seu-dominio.com.br
```

## COMANDOS
```bash
npm run build    # Build
npm run dev      # Dev local
npx prisma db seed  # Popular banco
```

## O QUE ESTÁ PRONTO
- Todas páginas públicas (home, notícias, documentos, agenda, galeria, contato)
- Todas páginas admin com API real (dashboard, notícias, eventos, documentos, galeria, usuários, categorias)
- Autenticação NextAuth v4
- Upload de arquivos
- CRUD completo em todas seções

## PRÓXIMA SESSÃO
1. Configurar Coolify com variáveis de ambiente
2. Fazer deploy
3. Trocar senha admin em produção
