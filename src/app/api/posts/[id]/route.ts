import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { PostStatus } from '@prisma/client'
import { requireEditor, requireOwnerOrAdmin } from '@/lib/api-auth'
import { postUpdateSchema } from '@/lib/validations'
import { logUpdate, logDelete } from '@/lib/audit'

type RouteParams = { params: Promise<{ id: string }> }

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, email: true } },
        category: { select: { id: true, name: true, slug: true } },
        tags: { include: { tag: true } },
      },
    })

    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Notícia não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        ...post,
        tags: post.tags.map((pt) => pt.tag),
      },
    })
  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar notícia' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    // Buscar post atual
    const existingPost = await prisma.post.findUnique({ where: { id } })
    if (!existingPost) {
      return NextResponse.json(
        { success: false, error: 'Notícia não encontrada' },
        { status: 404 }
      )
    }

    // Verificar autenticação - dono ou admin
    const auth = await requireOwnerOrAdmin(existingPost.authorId)
    if (!auth.authorized) {
      return auth.response
    }

    const body = await request.json()

    // Validar dados
    const validationResult = postUpdateSchema.safeParse(body)
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

    const { title, slug, excerpt, content, coverImage, categoryId, tags, status } = validationResult.data

    // Verificar se novo slug já existe (se foi alterado)
    if (slug && slug !== existingPost.slug) {
      const slugExists = await prisma.post.findUnique({ where: { slug } })
      if (slugExists) {
        return NextResponse.json(
          { success: false, error: 'Já existe uma notícia com este slug' },
          { status: 409 }
        )
      }
    }

    // Atualizar tags se fornecidas
    if (tags !== undefined) {
      // Remover tags antigas
      await prisma.postTag.deleteMany({ where: { postId: id } })
    }

    const post = await prisma.post.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(slug && { slug }),
        ...(excerpt && { excerpt }),
        ...(content && { content }),
        ...(coverImage !== undefined && { coverImage }),
        ...(categoryId !== undefined && { categoryId }),
        ...(status && { status: status as PostStatus }),
        ...(status === 'PUBLISHED' && !existingPost.publishedAt && { publishedAt: new Date() }),
        ...(tags?.length && {
          tags: {
            create: tags.map((tagId: string) => ({
              tag: { connect: { id: tagId } },
            })),
          },
        }),
      },
      include: {
        author: { select: { id: true, name: true } },
        category: true,
        tags: { include: { tag: true } },
      },
    })

    // Log de auditoria
    await logUpdate('Post', post.id, auth.session.user.id, { title: post.title })

    return NextResponse.json({
      success: true,
      data: {
        ...post,
        tags: post.tags.map((pt) => pt.tag),
      },
    })
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao atualizar notícia' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    // Buscar post atual
    const existingPost = await prisma.post.findUnique({ where: { id } })
    if (!existingPost) {
      return NextResponse.json(
        { success: false, error: 'Notícia não encontrada' },
        { status: 404 }
      )
    }

    // Verificar autenticação - dono ou admin
    const auth = await requireOwnerOrAdmin(existingPost.authorId)
    if (!auth.authorized) {
      return auth.response
    }

    // Deletar tags primeiro (por causa da relação)
    await prisma.postTag.deleteMany({ where: { postId: id } })

    // Deletar post
    await prisma.post.delete({ where: { id } })

    // Log de auditoria
    await logDelete('Post', id, auth.session.user.id, { title: existingPost.title })

    return NextResponse.json({
      success: true,
      message: 'Notícia excluída com sucesso',
    })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao excluir notícia' },
      { status: 500 }
    )
  }
}
