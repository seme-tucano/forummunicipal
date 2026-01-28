import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { requireAdmin } from '@/lib/api-auth'
import { siteSettingsSchema } from '@/lib/validations'

// GET - Buscar configurações (público)
export async function GET() {
  try {
    let settings = await prisma.siteSettings.findUnique({
      where: { id: 'main' }
    })

    // Se não existir, criar com valores padrão
    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          id: 'main',
          siteName: 'Fórum Municipal da Educação',
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: settings
    })
  } catch (error) {
    console.error('Erro ao buscar configurações:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar configurações' },
      { status: 500 }
    )
  }
}

// PUT - Atualizar configurações (apenas admin)
export async function PUT(request: NextRequest) {
  try {
    const auth = await requireAdmin()
    if (!auth.authorized) {
      return auth.response
    }

    const body = await request.json()

    // Validar dados
    const validationResult = siteSettingsSchema.safeParse(body)
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

    const data = validationResult.data

    // Preparar socialLinks para o Prisma (null precisa ser Prisma.JsonNull)
    const socialLinksData = data.socialLinks
      ? (data.socialLinks as Prisma.InputJsonValue)
      : Prisma.JsonNull

    // Atualizar ou criar configurações
    const settings = await prisma.siteSettings.upsert({
      where: { id: 'main' },
      update: {
        siteName: data.siteName,
        description: data.description,
        logo: data.logo,
        favicon: data.favicon,
        socialLinks: socialLinksData,
        contactEmail: data.contactEmail,
        address: data.address,
        phone: data.phone,
      },
      create: {
        id: 'main',
        siteName: data.siteName || 'Fórum Municipal da Educação',
        description: data.description,
        logo: data.logo,
        favicon: data.favicon,
        socialLinks: socialLinksData,
        contactEmail: data.contactEmail,
        address: data.address,
        phone: data.phone,
      }
    })

    return NextResponse.json({
      success: true,
      data: settings
    })
  } catch (error) {
    console.error('Erro ao atualizar configurações:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao atualizar configurações' },
      { status: 500 }
    )
  }
}
