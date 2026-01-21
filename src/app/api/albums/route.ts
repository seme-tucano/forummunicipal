import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireEditor } from '@/lib/api-auth'
import { albumCreateSchema, paginationSchema } from '@/lib/validations'
import { logCreate } from '@/lib/audit'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const queryResult = paginationSchema.safeParse({
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
    })

    const { page, limit } = queryResult.success ? queryResult.data : { page: 1, limit: 10 }
    const skip = (page - 1) * limit

    const [albums, total] = await Promise.all([
      prisma.album.findMany({
        include: {
          _count: { select: { images: true } },
          images: {
            take: 4,
            orderBy: { order: 'asc' },
            select: { id: true, imageUrl: true, thumbnailUrl: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.album.count(),
    ])

    return NextResponse.json({
      success: true,
      data: albums.map((album) => ({
        ...album,
        imagesCount: album._count.images,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Error fetching albums:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar álbuns' },
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
    const validationResult = albumCreateSchema.safeParse(body)
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

    const { name, slug, description, coverImage } = validationResult.data

    const existing = await prisma.album.findUnique({ where: { slug } })
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Já existe um álbum com este slug' },
        { status: 409 }
      )
    }

    const album = await prisma.album.create({
      data: { name, slug, description, coverImage },
    })

    await logCreate('Album', album.id, auth.session.user.id, { name })

    return NextResponse.json({ success: true, data: album }, { status: 201 })
  } catch (error) {
    console.error('Error creating album:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao criar álbum' },
      { status: 500 }
    )
  }
}
