import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireEditor } from '@/lib/api-auth'
import { tagCreateSchema } from '@/lib/validations'
import { logCreate, logDelete } from '@/lib/audit'

export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      include: {
        _count: { select: { posts: true } },
      },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json({
      success: true,
      data: tags.map((tag) => ({
        ...tag,
        postsCount: tag._count.posts,
      })),
    })
  } catch (error) {
    console.error('Error fetching tags:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar tags' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireEditor()
    if (!auth.authorized) {
      return auth.response
    }

    const body = await request.json()
    const validationResult = tagCreateSchema.safeParse(body)
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

    const { name, slug } = validationResult.data

    const existing = await prisma.tag.findFirst({
      where: { OR: [{ name }, { slug }] },
    })
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Já existe uma tag com este nome ou slug' },
        { status: 409 }
      )
    }

    const tag = await prisma.tag.create({ data: { name, slug } })
    await logCreate('Tag', tag.id, auth.session.user.id, { name })

    return NextResponse.json({ success: true, data: tag }, { status: 201 })
  } catch (error) {
    console.error('Error creating tag:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao criar tag' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = await requireEditor()
    if (!auth.authorized) {
      return auth.response
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID da tag é obrigatório' },
        { status: 400 }
      )
    }

    const existing = await prisma.tag.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Tag não encontrada' },
        { status: 404 }
      )
    }

    // Remover relações primeiro
    await prisma.postTag.deleteMany({ where: { tagId: id } })
    await prisma.tag.delete({ where: { id } })

    await logDelete('Tag', id, auth.session.user.id, { name: existing.name })

    return NextResponse.json({ success: true, message: 'Tag excluída com sucesso' })
  } catch (error) {
    console.error('Error deleting tag:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao excluir tag' },
      { status: 500 }
    )
  }
}
