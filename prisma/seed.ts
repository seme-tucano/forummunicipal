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

  console.log('Seed concluido com sucesso!')
  console.log('Sistema pronto para producao - adicione conteudo pelo painel administrativo.')
}

main()
  .catch((e) => {
    console.error('Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
