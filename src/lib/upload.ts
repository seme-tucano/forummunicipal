import crypto from 'crypto'
import path from 'path'
import { getSupabaseAdmin, STORAGE_BUCKETS, getPublicUrl } from './supabase'

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

const ALLOWED_TYPES = {
  documents: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'text/csv',
  ],
  images: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
}

const EXTENSION_MAP: Record<string, string> = {
  'application/pdf': '.pdf',
  'application/msword': '.doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
  'application/vnd.ms-excel': '.xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
  'application/vnd.ms-powerpoint': '.ppt',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx',
  'text/plain': '.txt',
  'text/csv': '.csv',
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/webp': '.webp',
  'image/svg+xml': '.svg',
}

export type UploadType = 'documents' | 'images'

export interface UploadResult {
  url: string
  fileName: string
  fileSize: number
  mimeType: string
}

export class UploadError extends Error {
  constructor(
    message: string,
    public code: 'INVALID_TYPE' | 'FILE_TOO_LARGE' | 'UPLOAD_FAILED'
  ) {
    super(message)
    this.name = 'UploadError'
  }
}

/**
 * Valida o tipo de arquivo
 */
export function validateFileType(mimeType: string, type: UploadType): boolean {
  return ALLOWED_TYPES[type].includes(mimeType)
}

/**
 * Valida o tamanho do arquivo
 */
export function validateFileSize(size: number): boolean {
  return size <= MAX_FILE_SIZE
}

/**
 * Gera um nome único para o arquivo
 */
export function generateFileName(originalName: string, mimeType: string): string {
  const ext = EXTENSION_MAP[mimeType] || path.extname(originalName) || ''
  const hash = crypto.randomBytes(16).toString('hex')
  const timestamp = Date.now()
  return `${timestamp}-${hash}${ext}`
}

/**
 * Obtém o bucket correspondente ao tipo de upload
 */
function getBucket(type: UploadType): string {
  return type === 'documents' ? STORAGE_BUCKETS.DOCUMENTS : STORAGE_BUCKETS.IMAGES
}

/**
 * Salva um arquivo no Supabase Storage
 */
export async function saveFile(
  file: File,
  type: UploadType
): Promise<UploadResult> {
  // Validar tipo
  if (!validateFileType(file.type, type)) {
    throw new UploadError(
      `Tipo de arquivo não permitido. Tipos aceitos: ${ALLOWED_TYPES[type].join(', ')}`,
      'INVALID_TYPE'
    )
  }

  // Validar tamanho
  if (!validateFileSize(file.size)) {
    throw new UploadError(
      `Arquivo muito grande. Tamanho máximo: ${MAX_FILE_SIZE / 1024 / 1024}MB`,
      'FILE_TOO_LARGE'
    )
  }

  try {
    const bucket = getBucket(type)
    const fileName = generateFileName(file.name, file.type)

    // Organizar por ano/mês
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const filePath = `${year}/${month}/${fileName}`

    // Converter File para ArrayBuffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload para Supabase Storage
    const { data, error } = await getSupabaseAdmin().storage
      .from(bucket)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (error) {
      console.error('Supabase storage error:', error)
      throw new UploadError('Erro ao salvar arquivo no storage', 'UPLOAD_FAILED')
    }

    // Obter URL pública
    const url = getPublicUrl(bucket, data.path)

    return {
      url,
      fileName,
      fileSize: file.size,
      mimeType: file.type,
    }
  } catch (error) {
    if (error instanceof UploadError) {
      throw error
    }
    console.error('Error saving file:', error)
    throw new UploadError('Erro ao salvar arquivo', 'UPLOAD_FAILED')
  }
}

/**
 * Remove um arquivo do Supabase Storage
 */
export async function deleteFile(url: string): Promise<void> {
  try {
    // Extrair bucket e path da URL
    // URL format: https://[project].supabase.co/storage/v1/object/public/[bucket]/[path]
    const urlObj = new URL(url)
    const pathParts = urlObj.pathname.split('/storage/v1/object/public/')

    if (pathParts.length < 2) {
      console.warn('Invalid storage URL format:', url)
      return
    }

    const [bucket, ...rest] = pathParts[1].split('/')
    const filePath = rest.join('/')

    const { error } = await getSupabaseAdmin().storage
      .from(bucket)
      .remove([filePath])

    if (error) {
      console.warn('Error deleting file from storage:', error)
    }
  } catch (error) {
    console.warn('Error deleting file:', error)
  }
}

/**
 * Formata o tamanho do arquivo para exibição
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
