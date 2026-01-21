import { NextRequest, NextResponse } from 'next/server'
import { requireEditor } from '@/lib/api-auth'
import { saveFile, UploadError, type UploadType } from '@/lib/upload'

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const auth = await requireEditor()
    if (!auth.authorized) {
      return auth.response
    }

    // Obter tipo de upload
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') as UploadType

    if (!type || !['documents', 'images'].includes(type)) {
      return NextResponse.json(
        { success: false, error: 'Tipo de upload inválido. Use "documents" ou "images"' },
        { status: 400 }
      )
    }

    // Obter arquivo do formdata
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Nenhum arquivo enviado' },
        { status: 400 }
      )
    }

    // Salvar arquivo
    const result = await saveFile(file, type)

    return NextResponse.json({
      success: true,
      data: {
        url: result.url,
        fileName: result.fileName,
        fileSize: result.fileSize,
        mimeType: result.mimeType,
        originalName: file.name,
      },
    })
  } catch (error) {
    if (error instanceof UploadError) {
      return NextResponse.json(
        { success: false, error: error.message, code: error.code },
        { status: 400 }
      )
    }

    console.error('Error uploading file:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao fazer upload do arquivo' },
      { status: 500 }
    )
  }
}

// Lidar com múltiplos arquivos
export async function PUT(request: NextRequest) {
  try {
    const auth = await requireEditor()
    if (!auth.authorized) {
      return auth.response
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') as UploadType

    if (!type || !['documents', 'images'].includes(type)) {
      return NextResponse.json(
        { success: false, error: 'Tipo de upload inválido' },
        { status: 400 }
      )
    }

    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Nenhum arquivo enviado' },
        { status: 400 }
      )
    }

    const results = []
    const errors = []

    for (const file of files) {
      try {
        const result = await saveFile(file, type)
        results.push({
          ...result,
          originalName: file.name,
        })
      } catch (error) {
        errors.push({
          fileName: file.name,
          error: error instanceof UploadError ? error.message : 'Erro desconhecido',
        })
      }
    }

    return NextResponse.json({
      success: errors.length === 0,
      data: results,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (error) {
    console.error('Error uploading files:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao fazer upload dos arquivos' },
      { status: 500 }
    )
  }
}
