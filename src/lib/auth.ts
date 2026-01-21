import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import type { Role } from '@prisma/client'

// Mensagem genérica para evitar enumeração de usuários
const INVALID_CREDENTIALS_ERROR = 'Credenciais inválidas'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: Role
      active: boolean
    }
  }

  interface User {
    id: string
    email: string
    name: string
    role: Role
    active: boolean
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    email: string
    name: string
    role: Role
    active: boolean
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        // Validação básica
        if (!credentials?.email || !credentials?.password) {
          throw new Error(INVALID_CREDENTIALS_ERROR)
        }

        // Normalizar email
        const email = credentials.email.toLowerCase().trim()

        // Buscar usuário
        const user = await prisma.user.findUnique({
          where: { email },
        })

        // Usuário não encontrado - mesma mensagem genérica
        if (!user) {
          // Delay para prevenir timing attacks
          await new Promise((resolve) => setTimeout(resolve, 500))
          throw new Error(INVALID_CREDENTIALS_ERROR)
        }

        // Usuário inativo - mesma mensagem genérica
        if (!user.active) {
          throw new Error(INVALID_CREDENTIALS_ERROR)
        }

        // Verificar senha
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        )

        if (!isPasswordValid) {
          throw new Error(INVALID_CREDENTIALS_ERROR)
        }

        // Log de auditoria com IP (será capturado pelo middleware)
        try {
          await prisma.auditLog.create({
            data: {
              action: 'LOGIN',
              entity: 'User',
              entityId: user.id,
              userId: user.id,
              details: { email: user.email },
            },
          })
        } catch {
          // Não falhar login se log falhar
          console.error('Erro ao registrar log de login')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          active: user.active,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.role = user.role
        token.active = user.active
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id,
          email: token.email,
          name: token.name,
          role: token.role,
          active: token.active,
        }
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 4 * 60 * 60, // 4 horas (mais seguro que 24h)
  },
  secret: process.env.NEXTAUTH_SECRET,
}
