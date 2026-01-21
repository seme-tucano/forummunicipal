import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { requireAdmin } from '@/lib/api-auth'
import { userUpdateSchema } from '@/lib/validations'
import { logUpdate, logDelete } from '@/lib/audit'

type RouteParams = { params: Promise<{ id: string }> }

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const auth = await requireAdmin()
    if (!auth.authorized) {
      return auth.response
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        active: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { posts: true, documents: true } },
      },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        ...user,
        postsCount: user._count.posts,
        documentsCount: user._count.documents,
      },
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar usuário' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const auth = await requireAdmin()
    if (!auth.authorized) {
      return auth.response
    }

    const existing = await prisma.user.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const validationResult = userUpdateSchema.safeParse(body)
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

    const { email, name, password, role, active } = validationResult.data

    // Verificar conflito de email
    if (email && email.toLowerCase() !== existing.email) {
      const conflict = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
      if (conflict) {
        return NextResponse.json(
          { success: false, error: 'Já existe um usuário com este email' },
          { status: 409 }
        )
      }
    }

    // Não permitir desativar o próprio usuário ou remover admin de si mesmo
    if (id === auth.session.user.id) {
      if (active === false) {
        return NextResponse.json(
          { success: false, error: 'Você não pode desativar sua própria conta' },
          { status: 400 }
        )
      }
      if (role && role !== 'ADMIN') {
        return NextResponse.json(
          { success: false, error: 'Você não pode remover sua própria permissão de admin' },
          { status: 400 }
        )
      }
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(email && { email: email.toLowerCase() }),
        ...(name && { name }),
        ...(password && { passwordHash: await bcrypt.hash(password, 12) }),
        ...(role && { role }),
        ...(active !== undefined && { active }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        active: true,
        updatedAt: true,
      },
    })

    await logUpdate('User', id, auth.session.user.id, {
      email: user.email,
      role: user.role,
      active: user.active,
    })

    return NextResponse.json({ success: true, data: user })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao atualizar usuário' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const auth = await requireAdmin()
    if (!auth.authorized) {
      return auth.response
    }

    // Não permitir excluir o próprio usuário
    if (id === auth.session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Você não pode excluir sua própria conta' },
        { status: 400 }
      )
    }

    const existing = await prisma.user.findUnique({
      where: { id },
      include: { _count: { select: { posts: true, documents: true } } },
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Não permitir excluir se tiver posts ou documentos
    if (existing._count.posts > 0 || existing._count.documents > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Não é possível excluir usuário com posts ou documentos. Desative-o em vez disso.',
        },
        { status: 400 }
      )
    }

    await prisma.user.delete({ where: { id } })
    await logDelete('User', id, auth.session.user.id, { email: existing.email })

    return NextResponse.json({ success: true, message: 'Usuário excluído com sucesso' })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao excluir usuário' },
      { status: 500 }
    )
  }
}
