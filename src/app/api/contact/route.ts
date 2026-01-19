import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().optional(),
  subject: z.string().min(3, 'Assunto deve ter pelo menos 3 caracteres'),
  message: z.string().min(10, 'Mensagem deve ter pelo menos 10 caracteres'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validar dados
    const result = contactSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Dados inválidos',
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const { name, email, phone, subject, message } = result.data

    // Salvar mensagem
    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone,
        subject,
        message,
      },
    })

    // TODO: Enviar e-mail de notificação para o admin

    return NextResponse.json({
      success: true,
      message: 'Mensagem enviada com sucesso',
      data: { id: contactMessage.id },
    })
  } catch (error) {
    console.error('Error sending contact message:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao enviar mensagem' },
      { status: 500 }
    )
  }
}
