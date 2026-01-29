import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/api-auth'
import { Resend } from 'resend'
import { z } from 'zod'

const replySchema = z.object({
  subject: z.string().min(1, 'Assunto é obrigatório'),
  message: z.string().min(1, 'Mensagem é obrigatória'),
})

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdmin()
    if (!auth.authorized) {
      return auth.response
    }

    const { id } = await params

    // Verificar se o Resend está configurado
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'Serviço de e-mail não configurado. Configure a RESEND_API_KEY nas variáveis de ambiente.' },
        { status: 500 }
      )
    }

    // Buscar a mensagem original
    const originalMessage = await prisma.contactMessage.findUnique({
      where: { id },
    })

    if (!originalMessage) {
      return NextResponse.json(
        { success: false, error: 'Mensagem não encontrada' },
        { status: 404 }
      )
    }

    // Validar dados da resposta
    const body = await request.json()
    const result = replySchema.safeParse(body)

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

    const { subject, message } = result.data

    // Buscar configurações do site para o nome
    const settings = await prisma.siteSettings.findUnique({
      where: { id: 'main' },
    })

    const siteName = settings?.siteName || 'Fórum Municipal da Educação'
    const fromEmail = process.env.EMAIL_FROM || 'noreply@forum.edu.br'

    // Enviar e-mail
    const resend = new Resend(process.env.RESEND_API_KEY)

    const { error: emailError } = await resend.emails.send({
      from: `${siteName} <${fromEmail}>`,
      to: originalMessage.email,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #1e3a5f; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">${siteName}</h1>
          </div>

          <div style="padding: 30px; background-color: #f9fafb;">
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
              Olá, <strong>${originalMessage.name}</strong>!
            </p>

            <div style="background-color: white; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #1e3a5f;">
              ${message.replace(/\n/g, '<br>')}
            </div>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

            <p style="color: #6b7280; font-size: 14px;">
              <strong>Sua mensagem original:</strong><br>
              <em>"${originalMessage.message.substring(0, 200)}${originalMessage.message.length > 200 ? '...' : ''}"</em>
            </p>
          </div>

          <div style="background-color: #1e3a5f; color: white; padding: 15px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">Esta é uma resposta à sua mensagem enviada pelo site.</p>
            <p style="margin: 5px 0 0 0;">Por favor, não responda diretamente a este e-mail.</p>
          </div>
        </div>
      `,
    })

    if (emailError) {
      console.error('Error sending email:', emailError)
      return NextResponse.json(
        { success: false, error: 'Erro ao enviar e-mail: ' + emailError.message },
        { status: 500 }
      )
    }

    // Marcar mensagem como lida
    await prisma.contactMessage.update({
      where: { id },
      data: { read: true },
    })

    return NextResponse.json({
      success: true,
      message: 'Resposta enviada com sucesso para ' + originalMessage.email,
    })
  } catch (error) {
    console.error('Error replying to message:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao enviar resposta' },
      { status: 500 }
    )
  }
}
