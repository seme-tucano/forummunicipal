import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireEditor } from '@/lib/api-auth'
import { eventUpdateSchema } from '@/lib/validations'
import { logUpdate, logDelete } from '@/lib/audit'

type RouteParams = { params: Promise<{ id: string }> }

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const event = await prisma.event.findUnique({ where: { id } })

    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Evento não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: event })
  } catch (error) {
    console.error('Error fetching event:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar evento' },
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

    const existing = await prisma.event.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Evento não encontrado' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const validationResult = eventUpdateSchema.safeParse(body)
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

    // Verificar conflito de slug
    if (slug && slug !== existing.slug) {
      const conflict = await prisma.event.findUnique({ where: { slug } })
      if (conflict) {
        return NextResponse.json(
          { success: false, error: 'Já existe um evento com este slug' },
          { status: 409 }
        )
      }
    }

    const event = await prisma.event.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(slug && { slug }),
        ...(description && { description }),
        ...(location !== undefined && { location }),
        ...(address !== undefined && { address }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate !== undefined && { endDate: endDate ? new Date(endDate) : null }),
        ...(published !== undefined && { published }),
      },
    })

    await logUpdate('Event', id, auth.session.user.id, { title: event.title })

    return NextResponse.json({ success: true, data: event })
  } catch (error) {
    console.error('Error updating event:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao atualizar evento' },
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

    const existing = await prisma.event.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Evento não encontrado' },
        { status: 404 }
      )
    }

    await prisma.event.delete({ where: { id } })
    await logDelete('Event', id, auth.session.user.id, { title: existing.title })

    return NextResponse.json({ success: true, message: 'Evento excluído com sucesso' })
  } catch (error) {
    console.error('Error deleting event:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao excluir evento' },
      { status: 500 }
    )
  }
}
