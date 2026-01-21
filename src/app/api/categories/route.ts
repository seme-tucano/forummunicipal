import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/api-auth'
import { categoryCreateSchema } from '@/lib/validations'
import { logCreate } from '@/lib/audit'

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            posts: true,
            documents: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json({
      success: true,
      data: categories.map((cat) => ({
        ...cat,
        postsCount: cat._count.posts,
        documentsCount: cat._count.documents,
      })),
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar categorias' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Apenas admin pode criar categorias
    const auth = await requireAdmin()
    if (!auth.authorized) {
      return auth.response
    }

    const body = await request.json()

    // Validar dados
    const validationResult = categoryCreateSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Dados inválidos',
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const { name, slug, description } = validationResult.data

    // Verificar se já existe
    const existing = await prisma.category.findFirst({
      where: { OR: [{ name }, { slug }] },
    })
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Já existe uma categoria com este nome ou slug' },
        { status: 409 }
      )
    }

    const category = await prisma.category.create({
      data: { name, slug, description },
    })

    await logCreate('Category', category.id, auth.session.user.id, { name })

    return NextResponse.json({ success: true, data: category }, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao criar categoria' },
      { status: 500 }
    )
  }
}
