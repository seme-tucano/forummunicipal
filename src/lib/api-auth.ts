import { getServerSession } from 'next-auth'
import { authOptions } from './auth'
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import type { Role } from '@prisma/client'

interface AuthResult {
  authorized: true
  session: {
    user: {
      id: string
      email: string
      name: string
      role: Role
    }
  }
}

interface AuthError {
  authorized: false
  response: NextResponse
}

type RequireAuthResult = AuthResult | AuthError

/**
 * Verifica se o usuário está autenticado e tem a role necessária
 * @param allowedRoles - Roles permitidas (opcional, se não informado aceita qualquer role)
 */
export async function requireAuth(
  allowedRoles?: Role[]
): Promise<RequireAuthResult> {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, error: 'Não autorizado' },
        { status: 401 }
      ),
    }
  }

  if (allowedRoles && !allowedRoles.includes(session.user.role)) {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, error: 'Sem permissão para esta ação' },
        { status: 403 }
      ),
    }
  }

  return {
    authorized: true,
    session,
  }
}

/**
 * Verifica se o usuário é admin
 */
export async function requireAdmin(): Promise<RequireAuthResult> {
  return requireAuth(['ADMIN'])
}

/**
 * Verifica se o usuário pode editar conteúdo (ADMIN ou EDITOR)
 */
export async function requireEditor(): Promise<RequireAuthResult> {
  return requireAuth(['ADMIN', 'EDITOR'])
}

/**
 * Verifica se o usuário pode revisar conteúdo (ADMIN, EDITOR ou REVIEWER)
 */
export async function requireReviewer(): Promise<RequireAuthResult> {
  return requireAuth(['ADMIN', 'EDITOR', 'REVIEWER'])
}

/**
 * Obtém informações do request para logging
 */
export async function getRequestInfo() {
  const headersList = await headers()
  return {
    ip:
      headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      headersList.get('x-real-ip') ||
      'unknown',
    userAgent: headersList.get('user-agent') || 'unknown',
  }
}

/**
 * Verifica se o usuário é dono do recurso ou admin
 */
export async function requireOwnerOrAdmin(
  resourceOwnerId: string
): Promise<RequireAuthResult> {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, error: 'Não autorizado' },
        { status: 401 }
      ),
    }
  }

  // Admin pode tudo
  if (session.user.role === 'ADMIN') {
    return { authorized: true, session }
  }

  // Verificar se é o dono
  if (session.user.id !== resourceOwnerId) {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, error: 'Sem permissão para este recurso' },
        { status: 403 }
      ),
    }
  }

  return { authorized: true, session }
}
