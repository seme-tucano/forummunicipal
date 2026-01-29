import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/api-auth'

// GET - Buscar mensagem específica
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdmin()
    if (!auth.authorized) {
      return auth.response
    }

    const { id } = await params

    const message = await prisma.contactMessage.findUnique({
      where: { id },
    })

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Mensagem não encontrada' },
        { status: 404 }
      )
    }

    // Marcar como lida automaticamente ao visualizar
    if (!message.read) {
      await prisma.contactMessage.update({
        where: { id },
        data: { read: true },
      })
    }

    return NextResponse.json({
      success: true,
      data: { ...message, read: true },
    })
  } catch (error) {
    console.error('Error fetching message:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar mensagem' },
      { status: 500 }
    )
  }
}

// PUT - Atualizar status da mensagem (marcar como lida/não lida)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdmin()
    if (!auth.authorized) {
      return auth.response
    }

    const { id } = await params
    const body = await request.json()

    const message = await prisma.contactMessage.update({
      where: { id },
      data: {
        read: body.read,
      },
    })

    return NextResponse.json({
      success: true,
      data: message,
    })
  } catch (error) {
    console.error('Error updating message:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao atualizar mensagem' },
      { status: 500 }
    )
  }
}

// DELETE - Excluir mensagem
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdmin()
    if (!auth.authorized) {
      return auth.response
    }

    const { id } = await params

    await prisma.contactMessage.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Mensagem excluída com sucesso',
    })
  } catch (error) {
    console.error('Error deleting message:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao excluir mensagem' },
      { status: 500 }
    )
  }
}
