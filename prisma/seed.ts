import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Iniciando seed...')

  // Criar usuário admin
  const adminPassword = await bcrypt.hash('admin123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@forum.gov.br' },
    update: {},
    create: {
      email: 'admin@forum.gov.br',
      name: 'Administrador',
      passwordHash: adminPassword,
      role: 'ADMIN',
      active: true,
    },
  })
  console.log('Usuario admin criado:', admin.email)

  // Criar categorias padrao
  const categorias = [
    { name: 'Noticias', slug: 'noticias', description: 'Noticias gerais do forum' },
    { name: 'Eventos', slug: 'eventos', description: 'Eventos e reunioes' },
    { name: 'Documentos', slug: 'documentos', description: 'Documentos oficiais' },
    { name: 'Legislacao', slug: 'legislacao', description: 'Leis e normas' },
    { name: 'Atas', slug: 'atas', description: 'Atas de reunioes' },
  ]

  for (const cat of categorias) {
    const categoria = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
    console.log('Categoria criada:', categoria.name)
  }

  // Criar tags padrao
  const tags = ['Educacao', 'Forum', 'Municipal', 'Politicas Publicas', 'Reuniao', 'Deliberacao']

  for (const tagName of tags) {
    const slug = tagName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-')
    const tag = await prisma.tag.upsert({
      where: { slug },
      update: {},
      create: { name: tagName, slug },
    })
    console.log('Tag criada:', tag.name)
  }

  // Criar post de exemplo
  const categoriaNoticia = await prisma.category.findUnique({ where: { slug: 'noticias' } })

  if (categoriaNoticia) {
    const post = await prisma.post.upsert({
      where: { slug: 'bem-vindo-ao-forum-municipal-da-educacao' },
      update: {},
      create: {
        title: 'Bem-vindo ao Forum Municipal da Educacao',
        slug: 'bem-vindo-ao-forum-municipal-da-educacao',
        excerpt: 'Conheca o novo portal do Forum Municipal da Educacao.',
        content: '<h2>Sobre o Forum</h2><p>O Forum Municipal da Educacao e um espaco de participacao social permanente.</p>',
        status: 'PUBLISHED',
        publishedAt: new Date(),
        authorId: admin.id,
        categoryId: categoriaNoticia.id,
      },
    })
    console.log('Post de exemplo criado:', post.title)
  }

  // Criar evento de exemplo
  const nextMonth = new Date()
  nextMonth.setMonth(nextMonth.getMonth() + 1)
  nextMonth.setHours(14, 0, 0, 0)

  const endTime = new Date(nextMonth)
  endTime.setHours(17, 0, 0, 0)

  const event = await prisma.event.upsert({
    where: { slug: 'reuniao-ordinaria-fevereiro-2026' },
    update: {},
    create: {
      title: 'Reuniao Ordinaria - Fevereiro 2026',
      slug: 'reuniao-ordinaria-fevereiro-2026',
      description: 'Reuniao ordinaria mensal do Forum Municipal da Educacao.',
      location: 'Camara Municipal - Sala de Reunioes',
      startDate: nextMonth,
      endDate: endTime,
      published: true,
    },
  })
  console.log('Evento de exemplo criado:', event.title)

  console.log('Seed concluido com sucesso!')
}

main()
  .catch((e) => {
    console.error('Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
