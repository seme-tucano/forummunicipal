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

    // Debug: ver o que está chegando
    console.log('Settings PUT - body recebido:', JSON.stringify(body, null, 2))

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

    // Debug: ver dados após validação
    console.log('Settings PUT - dados validados:', JSON.stringify(data, null, 2))
    console.log('Settings PUT - socialLinks recebido:', JSON.stringify(body.socialLinks, null, 2))
    console.log('Settings PUT - socialLinks validado:', JSON.stringify(data.socialLinks, null, 2))

    // Preparar socialLinks para o Prisma (null precisa ser Prisma.JsonNull)
    const socialLinksData = data.socialLinks
      ? (data.socialLinks as Prisma.InputJsonValue)
      : Prisma.JsonNull

    console.log('Settings PUT - socialLinksData para Prisma:', JSON.stringify(socialLinksData, null, 2))

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
