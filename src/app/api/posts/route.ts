import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { PostStatus } from '@prisma/client'
import { requireEditor } from '@/lib/api-auth'
import { postCreateSchema, postsQuerySchema } from '@/lib/validations'
import { logCreate } from '@/lib/audit'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Validar query params
    const queryResult = postsQuerySchema.safeParse({
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      status: searchParams.get('status'),
      category: searchParams.get('category'),
      search: searchParams.get('search'),
    })

    const { page, limit, status, category, search } = queryResult.success
      ? queryResult.data
      : { page: 1, limit: 10, status: undefined, category: undefined, search: undefined }

    const skip = (page - 1) * limit

    const where = {
      ...(status ? { status: status as PostStatus } : { status: PostStatus.PUBLISHED }),
      ...(category && { category: { slug: category } }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { excerpt: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: {
            select: { id: true, name: true },
          },
          category: {
            select: { id: true, name: true, slug: true },
          },
          tags: {
            include: {
              tag: true,
            },
          },
        },
        orderBy: { publishedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.post.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: posts.map((post) => ({
        ...post,
        tags: post.tags.map((pt) => pt.tag),
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar notícias' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação - apenas ADMIN e EDITOR podem criar posts
    const auth = await requireEditor()
    if (!auth.authorized) {
      return auth.response
    }

    const body = await request.json()

    // Validar dados de entrada
    const validationResult = postCreateSchema.safeParse(body)
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

    // Verificar se slug já existe
    const existingPost = await prisma.post.findUnique({ where: { slug } })
    if (existingPost) {
      return NextResponse.json(
        { success: false, error: 'Já existe uma notícia com este slug' },
        { status: 409 }
      )
    }

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        coverImage,
        categoryId,
        authorId: auth.session.user.id,
        status: status || PostStatus.DRAFT,
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
        tags: tags?.length
          ? {
              create: tags.map((tagId: string) => ({
                tag: { connect: { id: tagId } },
              })),
            }
          : undefined,
      },
      include: {
        author: { select: { id: true, name: true } },
        category: true,
        tags: { include: { tag: true } },
      },
    })

    // Log de auditoria
    await logCreate('Post', post.id, auth.session.user.id, { title: post.title })

    return NextResponse.json(
      {
        success: true,
        data: {
          ...post,
          tags: post.tags.map((pt) => pt.tag),
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao criar notícia' },
      { status: 500 }
    )
  }
}
