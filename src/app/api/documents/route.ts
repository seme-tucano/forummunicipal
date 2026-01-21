import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { DocumentType } from '@prisma/client'
import { requireEditor } from '@/lib/api-auth'
import { documentCreateSchema, documentsQuerySchema } from '@/lib/validations'
import { logCreate } from '@/lib/audit'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const queryResult = documentsQuerySchema.safeParse({
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      type: searchParams.get('type'),
      year: searchParams.get('year'),
      search: searchParams.get('search'),
    })

    const { page, limit, type, year, search } = queryResult.success
      ? queryResult.data
      : { page: 1, limit: 10, type: undefined, year: undefined, search: undefined }

    const skip = (page - 1) * limit

    const where = {
      ...(type && { type: type as DocumentType }),
      ...(year && { year }),
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
    // Verificar autenticação
    const auth = await requireEditor()
    if (!auth.authorized) {
      return auth.response
    }

    const body = await request.json()

    // Validar dados
    const validationResult = documentCreateSchema.safeParse(body)
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
    } = validationResult.data

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
        uploadedById: auth.session.user.id,
      },
      include: {
        uploadedBy: { select: { id: true, name: true } },
        category: true,
      },
    })

    // Log de auditoria
    await logCreate('Document', document.id, auth.session.user.id, {
      title: document.title,
      fileName: document.fileName,
    })

    return NextResponse.json(
      { success: true, data: document },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating document:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao criar documento' },
      { status: 500 }
    )
  }
}
