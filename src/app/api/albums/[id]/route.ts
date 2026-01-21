import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireEditor } from '@/lib/api-auth'
import { albumUpdateSchema, galleryImageCreateSchema } from '@/lib/validations'
import { logUpdate, logDelete, logCreate } from '@/lib/audit'

type RouteParams = { params: Promise<{ id: string }> }

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const album = await prisma.album.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
        _count: { select: { images: true } },
      },
    })

    if (!album) {
      return NextResponse.json(
        { success: false, error: 'Álbum não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        ...album,
        imagesCount: album._count.images,
      },
    })
  } catch (error) {
    console.error('Error fetching album:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar álbum' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const auth = await requireEditor()
    if (!auth.authorized) {
      return auth.response
    }

    const existing = await prisma.album.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Álbum não encontrado' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const validationResult = albumUpdateSchema.safeParse(body)
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

    if (slug && slug !== existing.slug) {
      const conflict = await prisma.album.findUnique({ where: { slug } })
      if (conflict) {
        return NextResponse.json(
          { success: false, error: 'Já existe um álbum com este slug' },
          { status: 409 }
        )
      }
    }

    const album = await prisma.album.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(description !== undefined && { description }),
        ...(coverImage !== undefined && { coverImage }),
      },
    })

    await logUpdate('Album', id, auth.session.user.id, { name: album.name })

    return NextResponse.json({ success: true, data: album })
  } catch (error) {
    console.error('Error updating album:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao atualizar álbum' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const auth = await requireEditor()
    if (!auth.authorized) {
      return auth.response
    }

    const existing = await prisma.album.findUnique({
      where: { id },
      include: { _count: { select: { images: true } } },
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Álbum não encontrado' },
        { status: 404 }
      )
    }

    // Deletar imagens primeiro
    await prisma.galleryImage.deleteMany({ where: { albumId: id } })
    await prisma.album.delete({ where: { id } })

    await logDelete('Album', id, auth.session.user.id, { name: existing.name })

    return NextResponse.json({ success: true, message: 'Álbum excluído com sucesso' })
  } catch (error) {
    console.error('Error deleting album:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao excluir álbum' },
      { status: 500 }
    )
  }
}

// POST para adicionar imagem ao álbum
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const auth = await requireEditor()
    if (!auth.authorized) {
      return auth.response
    }

    const album = await prisma.album.findUnique({ where: { id } })
    if (!album) {
      return NextResponse.json(
        { success: false, error: 'Álbum não encontrado' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const validationResult = galleryImageCreateSchema.safeParse({ ...body, albumId: id })
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

    const { title, description, imageUrl, thumbnailUrl, order } = validationResult.data

    // Obter próxima ordem se não especificada
    let imageOrder = order
    if (imageOrder === undefined) {
      const lastImage = await prisma.galleryImage.findFirst({
        where: { albumId: id },
        orderBy: { order: 'desc' },
      })
      imageOrder = (lastImage?.order ?? -1) + 1
    }

    const image = await prisma.galleryImage.create({
      data: {
        title,
        description,
        imageUrl,
        thumbnailUrl,
        order: imageOrder,
        albumId: id,
      },
    })

    await logCreate('GalleryImage', image.id, auth.session.user.id, { albumId: id })

    return NextResponse.json({ success: true, data: image }, { status: 201 })
  } catch (error) {
    console.error('Error adding image to album:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao adicionar imagem' },
      { status: 500 }
    )
  }
}
