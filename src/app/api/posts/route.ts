import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { PostStatus } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const status = searchParams.get('status') as PostStatus | null
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    const where = {
      ...(status ? { status } : { status: PostStatus.PUBLISHED }),
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
    const body = await request.json()
    const { title, slug, excerpt, content, coverImage, categoryId, tags, authorId } = body

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        coverImage,
        categoryId,
        authorId,
        status: PostStatus.DRAFT,
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
    await prisma.auditLog.create({
      data: {
        action: 'CREATE',
        entity: 'Post',
        entityId: post.id,
        userId: authorId,
        details: { title: post.title },
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        ...post,
        tags: post.tags.map((pt) => pt.tag),
      },
    })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao criar notícia' },
      { status: 500 }
    )
  }
}
