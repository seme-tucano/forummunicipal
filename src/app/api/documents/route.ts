import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { DocumentType } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const type = searchParams.get('type') as DocumentType | null
    const year = searchParams.get('year')
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    const where = {
      ...(type && { type }),
      ...(year && { year: parseInt(year) }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    }

    const [documents, total] = await Promise.all([
      prisma.document.findMany({
        where,
        include: {
          uploadedBy: {
            select: { id: true, name: true },
          },
          category: {
            select: { id: true, name: true, slug: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.document.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: documents,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Error fetching documents:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar documentos' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      fileName,
      fileUrl,
      fileSize,
      mimeType,
      type,
      year,
      categoryId,
      uploadedById,
    } = body

    const document = await prisma.document.create({
      data: {
        title,
        description,
        fileName,
        fileUrl,
        fileSize,
        mimeType,
        type,
        year,
        categoryId,
        uploadedById,
      },
      include: {
        uploadedBy: { select: { id: true, name: true } },
        category: true,
      },
    })

    // Log de auditoria
    await prisma.auditLog.create({
      data: {
        action: 'CREATE',
        entity: 'Document',
        entityId: document.id,
        userId: uploadedById,
        details: { title: document.title, fileName: document.fileName },
      },
    })

    return NextResponse.json({
      success: true,
      data: document,
    })
  } catch (error) {
    console.error('Error creating document:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao criar documento' },
      { status: 500 }
    )
  }
}
