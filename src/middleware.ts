import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Rotas públicas que não precisam de autenticação
  const publicPaths = [
    '/login',
    '/api/auth',
    '/api/contact',
    '/',
    '/noticias',
    '/documentos',
    '/galeria',
    '/agenda',
    '/contato',
  ]

  // Verificar se é rota pública
  const isPublicPath = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  )

  // APIs públicas (apenas GET)
  const isPublicApi =
    pathname.startsWith('/api/posts') ||
    pathname.startsWith('/api/documents') ||
    pathname.startsWith('/api/events') ||
    pathname.startsWith('/api/albums') ||
    pathname.startsWith('/api/categories') ||
    pathname.startsWith('/api/tags') ||
    pathname.startsWith('/api/stats')

  // Se for GET em API pública, permitir
  if (isPublicApi && request.method === 'GET') {
    return NextResponse.next()
  }

  // Se for rota pública, permitir
  if (isPublicPath) {
    return NextResponse.next()
  }

  // Verificar token para rotas protegidas
  // Em produção com HTTPS, NextAuth usa prefixo __Secure-
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    cookieName: process.env.NODE_ENV === 'production'
      ? '__Secure-next-auth.session-token'
      : 'next-auth.session-token',
  })

  // Se não tem token e está tentando acessar /admin ou API protegida
  if (!token) {
    // Se for API, retornar 401
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { success: false, error: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Se for página admin, redirecionar para login
    if (pathname.startsWith('/admin')) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Verificar se usuário está ativo (info no token)
  if (token && !token.active) {
    // Usuário inativo - redirecionar para login
    if (pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/login?error=inactive', request.url))
    }
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { success: false, error: 'Usuário inativo' },
        { status: 403 }
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin',
    '/admin/:path*',
    '/api/posts/:path*',
    '/api/documents/:path*',
    '/api/events/:path*',
    '/api/albums/:path*',
    '/api/categories/:path*',
    '/api/tags/:path*',
    '/api/users/:path*',
    '/api/upload/:path*',
    '/api/stats/:path*',
  ],
}
