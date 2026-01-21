import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireEditor, requireOwnerOrAdmin } from '@/lib/api-auth'
import { documentUpdateSchema } from '@/lib/validations'
import { logUpdate, logDelete, logDownload } from '@/lib/audit'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

type RouteParams = { params: Promise<{ id: string }> }

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const document = await prisma.document.findUnique({
      where: { id },
      include: {
        uploadedBy: { select: { id: true, name: true } },
        category: { select: { id: true, name: true, slug: true } },
      },
    })

    if (!document) {
      return NextResponse.json(
        { success: false, error: 'Documento não encontrado' },
        { status: 404 }
      )
    }

    // Incrementar contador de downloads se for um download real
    const { searchParams } = new URL(request.url)
    if (searchParams.get('download') === 'true') {
      await prisma.document.update({
        where: { id },
        data: { downloads: { increment: 1 } },
      })

      const session = await getServerSession(authOptions)
      await logDownload(id, session?.user?.id, { fileName: document.fileName })
    }

    return NextResponse.json({ success: true, data: document })
  } catch (error) {
    console.error('Error fetching document:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar documento' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const existing = await prisma.document.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Documento não encontrado' },
        { status: 404 }
      )
    }

    const auth = await requireOwnerOrAdmin(existing.uploadedById)
    if (!auth.authorized) {
      return auth.response
    }

    const body = await request.json()
    const validationResult = documentUpdateSchema.safeParse(body)
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

    const { title, description, fileName, fileUrl, fileSize, mimeType, type, year, categoryId } =
      validationResult.data

    const document = await prisma.document.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(fileName && { fileName }),
        ...(fileUrl && { fileUrl }),
        ...(fileSize && { fileSize }),
        ...(mimeType && { mimeType }),
        ...(type && { type }),
        ...(year !== undefined && { year }),
        ...(categoryId !== undefined && { categoryId }),
      },
      include: {
        uploadedBy: { select: { id: true, name: true } },
        category: true,
      },
    })

    await logUpdate('Document', id, auth.session.user.id, { title: document.title })

    return NextResponse.json({ success: true, data: document })
  } catch (error) {
    console.error('Error updating document:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao atualizar documento' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const existing = await prisma.document.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Documento não encontrado' },
        { status: 404 }
      )
    }

    const auth = await requireOwnerOrAdmin(existing.uploadedById)
    if (!auth.authorized) {
      return auth.response
    }

    await prisma.document.delete({ where: { id } })

    // TODO: Excluir arquivo físico do storage

    await logDelete('Document', id, auth.session.user.id, { title: existing.title })

    return NextResponse.json({ success: true, message: 'Documento excluído com sucesso' })
  } catch (error) {
    console.error('Error deleting document:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao excluir documento' },
      { status: 500 }
    )
  }
}
