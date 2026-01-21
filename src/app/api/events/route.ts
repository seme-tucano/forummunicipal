import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireEditor } from '@/lib/api-auth'
import { eventCreateSchema, eventsQuerySchema } from '@/lib/validations'
import { logCreate } from '@/lib/audit'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const queryResult = eventsQuerySchema.safeParse({
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      published: searchParams.get('published'),
      upcoming: searchParams.get('upcoming'),
    })

    const { page, limit, published, upcoming } = queryResult.success
      ? queryResult.data
      : { page: 1, limit: 10, published: undefined, upcoming: undefined }

    const skip = (page - 1) * limit
    const now = new Date()

    const where = {
      ...(published !== undefined && { published }),
      ...(upcoming && { startDate: { gte: now } }),
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        orderBy: { startDate: upcoming ? 'asc' : 'desc' },
        skip,
        take: limit,
      }),
      prisma.event.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: events,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar eventos' },
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
    const validationResult = eventCreateSchema.safeParse(body)
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

    const { title, slug, description, location, address, startDate, endDate, published } =
      validationResult.data

    // Verificar slug único
    const existing = await prisma.event.findUnique({ where: { slug } })
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Já existe um evento com este slug' },
        { status: 409 }
      )
    }

    const event = await prisma.event.create({
      data: {
        title,
        slug,
        description,
        location,
        address,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        published: published ?? false,
      },
    })

    await logCreate('Event', event.id, auth.session.user.id, { title })

    return NextResponse.json({ success: true, data: event }, { status: 201 })
  } catch (error) {
    console.error('Error creating event:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao criar evento' },
      { status: 500 }
    )
  }
}
