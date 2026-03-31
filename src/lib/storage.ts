import * as Minio from 'minio'

export const BUCKET = process.env.STORAGE_BUCKET || 'forummunicipal'

export const STORAGE_BUCKETS = {
  DOCUMENTS: 'documents',
  IMAGES: 'images',
  COVERS: 'covers',
} as const

// Inicialização lazy — não instancia no import (evita erro no build sem env vars)
let _client: Minio.Client | null = null

function getClient(): Minio.Client {
  if (!_client) {
    _client = new Minio.Client({
      endPoint: process.env.STORAGE_ENDPOINT!,
      port: 443,
      useSSL: true,
      accessKey: process.env.STORAGE_ACCESS_KEY!,
      secretKey: process.env.STORAGE_SECRET_KEY!,
    })
  }
  return _client
}

async function ensureBucket() {
  const client = getClient()
  const exists = await client.bucketExists(BUCKET)
  if (!exists) {
    await client.makeBucket(BUCKET)
  }
}

export function getPublicUrl(folder: string, filePath: string): string {
  const baseUrl = process.env.STORAGE_PUBLIC_URL
  if (!baseUrl) throw new Error('STORAGE_PUBLIC_URL não configurado')
  return `${baseUrl}/${folder}/${filePath}`
}

export async function uploadFile(
  folder: string,
  filePath: string,
  file: Buffer | Blob,
  contentType: string
): Promise<{ url: string; path: string } | null> {
  try {
    await ensureBucket()

    const buffer = file instanceof Blob
      ? Buffer.from(await file.arrayBuffer())
      : file

    const objectName = `${folder}/${filePath}`

    await getClient().putObject(BUCKET, objectName, buffer, buffer.length, {
      'Content-Type': contentType,
    })

    return {
      url: getPublicUrl(folder, filePath),
      path: objectName,
    }
  } catch (error) {
    console.error('Erro no upload:', error)
    return null
  }
}

export async function deleteStorageFile(url: string): Promise<boolean> {
  try {
    const baseUrl = process.env.STORAGE_PUBLIC_URL || ''
    const objectName = url.replace(`${baseUrl}/`, '')
    await getClient().removeObject(BUCKET, objectName)
    return true
  } catch (error) {
    console.error('Erro ao deletar:', error)
    return false
  }
}
