import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/api-auth'
import { categoryUpdateSchema } from '@/lib/validations'
import { logUpdate, logDelete } from '@/lib/audit'

type RouteParams = { params: Promise<{ id: string }> }

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: { select: { posts: true, documents: true } },
      },
    })

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Categoria não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        ...category,
        postsCount: category._count.posts,
        documentsCount: category._count.documents,
      },
    })
  } catch (error) {
    console.error('Error fetching category:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar categoria' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const auth = await requireAdmin()
    if (!auth.authorized) {
      return auth.response
    }

    const existing = await prisma.category.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Categoria não encontrada' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const validationResult = categoryUpdateSchema.safeParse(body)
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

    // Verificar conflito de nome/slug
    if (name || slug) {
      const conflict = await prisma.category.findFirst({
        where: {
          AND: [
            { id: { not: id } },
            { OR: [...(name ? [{ name }] : []), ...(slug ? [{ slug }] : [])] },
          ],
        },
      })
      if (conflict) {
        return NextResponse.json(
          { success: false, error: 'Já existe uma categoria com este nome ou slug' },
          { status: 409 }
        )
      }
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(description !== undefined && { description }),
      },
    })

    await logUpdate('Category', id, auth.session.user.id, { name: category.name })

    return NextResponse.json({ success: true, data: category })
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao atualizar categoria' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const auth = await requireAdmin()
    if (!auth.authorized) {
      return auth.response
    }

    const existing = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { posts: true, documents: true } } },
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Categoria não encontrada' },
        { status: 404 }
      )
    }

    // Não permitir excluir se tiver posts ou documentos
    if (existing._count.posts > 0 || existing._count.documents > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Não é possível excluir categoria com posts ou documentos vinculados',
        },
        { status: 400 }
      )
    }

    await prisma.category.delete({ where: { id } })
    await logDelete('Category', id, auth.session.user.id, { name: existing.name })

    return NextResponse.json({ success: true, message: 'Categoria excluída com sucesso' })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao excluir categoria' },
      { status: 500 }
    )
  }
}
