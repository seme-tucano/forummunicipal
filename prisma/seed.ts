import { PrismaClient, Role, PostStatus, DocumentType } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Iniciando seed do banco de dados...')

  // Criar usuário admin
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@fme.edu.br' },
    update: {},
    create: {
      email: 'admin@fme.edu.br',
      name: 'Administrador',
      passwordHash: adminPassword,
      role: Role.ADMIN,
      active: true,
    },
  })
  console.log('Usuário admin criado:', admin.email)

  // Criar usuário editor
  const editorPassword = await bcrypt.hash('editor123', 12)
  const editor = await prisma.user.upsert({
    where: { email: 'editor@fme.edu.br' },
    update: {},
    create: {
      email: 'editor@fme.edu.br',
      name: 'Editor de Conteúdo',
      passwordHash: editorPassword,
      role: Role.EDITOR,
      active: true,
    },
  })
  console.log('Usuário editor criado:', editor.email)

  // Criar categorias
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'institucional' },
      update: {},
      create: {
        name: 'Institucional',
        slug: 'institucional',
        description: 'Notícias e informações sobre o Fórum',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'eventos' },
      update: {},
      create: {
        name: 'Eventos',
        slug: 'eventos',
        description: 'Conferências, audiências e reuniões',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'documentos' },
      update: {},
      create: {
        name: 'Documentos',
        slug: 'documentos',
        description: 'Publicações de atas, resoluções e pareceres',
      },
    }),
  ])
  console.log('Categorias criadas:', categories.length)

  // Criar tags
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { slug: 'pme' },
      update: {},
      create: { name: 'PME', slug: 'pme' },
    }),
    prisma.tag.upsert({
      where: { slug: 'educacao-infantil' },
      update: {},
      create: { name: 'Educação Infantil', slug: 'educacao-infantil' },
    }),
    prisma.tag.upsert({
      where: { slug: 'conferencia' },
      update: {},
      create: { name: 'Conferência', slug: 'conferencia' },
    }),
    prisma.tag.upsert({
      where: { slug: 'inclusao' },
      update: {},
      create: { name: 'Inclusão', slug: 'inclusao' },
    }),
  ])
  console.log('Tags criadas:', tags.length)

  // Criar notícias de exemplo
  const posts = await Promise.all([
    prisma.post.upsert({
      where: { slug: 'forum-aprova-novas-diretrizes-pme' },
      update: {},
      create: {
        title: 'Fórum aprova novas diretrizes para o Plano Municipal de Educação',
        slug: 'forum-aprova-novas-diretrizes-pme',
        excerpt: 'Em reunião extraordinária realizada nesta semana, foram definidas as metas prioritárias para os próximos dois anos com foco na educação infantil e inclusão.',
        content: `<p>O Fórum Municipal da Educação realizou nesta quinta-feira (15) uma reunião extraordinária para discutir e aprovar as novas diretrizes do Plano Municipal de Educação (PME) para o biênio 2026-2028.</p>
<p>Durante o encontro, que contou com a participação de representantes de diversos segmentos da comunidade educacional, foram definidas as metas prioritárias com foco especial na educação infantil e na inclusão de estudantes com deficiência.</p>
<h2>Principais deliberações</h2>
<ul>
<li>Ampliação de vagas na educação infantil;</li>
<li>Implementação de programa de formação continuada;</li>
<li>Criação de comissão de acompanhamento das políticas de inclusão;</li>
<li>Estabelecimento de indicadores de qualidade.</li>
</ul>`,
        status: PostStatus.PUBLISHED,
        publishedAt: new Date(),
        authorId: admin.id,
        categoryId: categories[0].id,
        views: 234,
      },
    }),
    prisma.post.upsert({
      where: { slug: 'inscricoes-conferencia-municipal-2026' },
      update: {},
      create: {
        title: 'Inscrições abertas para a Conferência Municipal de Educação 2026',
        slug: 'inscricoes-conferencia-municipal-2026',
        excerpt: 'O evento acontece nos dias 25 e 26 de fevereiro e reunirá educadores, gestores e sociedade civil para debater o futuro da educação no município.',
        content: `<p>Estão abertas as inscrições para a Conferência Municipal de Educação 2026, que será realizada nos dias 25 e 26 de fevereiro no Centro de Convenções Municipal.</p>
<p>O evento é gratuito e aberto a toda a comunidade educacional. As inscrições podem ser feitas pelo portal até o dia 20 de fevereiro.</p>`,
        status: PostStatus.PUBLISHED,
        publishedAt: new Date(),
        authorId: editor.id,
        categoryId: categories[1].id,
        views: 189,
      },
    }),
  ])
  console.log('Notícias criadas:', posts.length)

  // Criar documentos de exemplo
  const documents = await Promise.all([
    prisma.document.create({
      data: {
        title: 'Ata da Reunião Ordinária - Janeiro/2026',
        description: 'Registro da reunião ordinária do Fórum Municipal da Educação.',
        fileName: 'ata-reuniao-janeiro-2026.pdf',
        fileUrl: '/uploads/documents/ata-reuniao-janeiro-2026.pdf',
        fileSize: 245760,
        mimeType: 'application/pdf',
        type: DocumentType.ATA,
        year: 2026,
        uploadedById: admin.id,
        categoryId: categories[0].id,
        downloads: 45,
      },
    }),
    prisma.document.create({
      data: {
        title: 'Resolução nº 01/2026 - Diretrizes do PME',
        description: 'Estabelece as novas diretrizes para o Plano Municipal de Educação.',
        fileName: 'resolucao-01-2026.pdf',
        fileUrl: '/uploads/documents/resolucao-01-2026.pdf',
        fileSize: 512000,
        mimeType: 'application/pdf',
        type: DocumentType.RESOLUCAO,
        year: 2026,
        uploadedById: admin.id,
        categoryId: categories[2].id,
        downloads: 32,
      },
    }),
  ])
  console.log('Documentos criados:', documents.length)

  // Criar eventos de exemplo
  const events = await Promise.all([
    prisma.event.create({
      data: {
        title: 'Reunião Ordinária do Fórum',
        slug: 'reuniao-ordinaria-janeiro-2026',
        description: 'Reunião mensal para discussão de pautas e deliberações do Fórum Municipal da Educação.',
        location: 'Auditório da Secretaria de Educação',
        address: 'Rua da Educação, 123 - Centro',
        startDate: new Date('2026-01-22T14:00:00'),
        endDate: new Date('2026-01-22T17:00:00'),
        published: true,
      },
    }),
    prisma.event.create({
      data: {
        title: 'Conferência Municipal de Educação 2026',
        slug: 'conferencia-municipal-2026',
        description: 'Grande evento bienal que reúne toda a comunidade educacional para debater e propor políticas para o município.',
        location: 'Centro de Convenções Municipal',
        address: 'Av. Principal, 500 - Centro',
        startDate: new Date('2026-02-25T08:00:00'),
        endDate: new Date('2026-02-26T18:00:00'),
        published: true,
      },
    }),
  ])
  console.log('Eventos criados:', events.length)

  // Criar álbum de exemplo
  const album = await prisma.album.create({
    data: {
      name: 'Posse dos Conselheiros 2026-2028',
      slug: 'posse-conselheiros-2026',
      description: 'Cerimônia de posse dos novos conselheiros do Fórum.',
    },
  })
  console.log('Álbum criado:', album.name)

  // Criar configurações do site
  const settings = await prisma.siteSettings.upsert({
    where: { id: 'main' },
    update: {},
    create: {
      id: 'main',
      siteName: 'Fórum Municipal da Educação',
      description: 'Portal oficial do Fórum Municipal da Educação',
      contactEmail: 'contato@fme.edu.br',
      phone: '(00) 0000-0000',
      address: 'Rua da Educação, 123 - Centro - CEP 00000-000',
      socialLinks: {
        facebook: 'https://facebook.com/fme',
        instagram: 'https://instagram.com/fme',
        youtube: 'https://youtube.com/fme',
      },
    },
  })
  console.log('Configurações do site criadas')

  console.log('Seed concluído com sucesso!')
}

main()
  .catch((e) => {
    console.error('Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
