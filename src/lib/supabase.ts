import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Client para uso no servidor (lazy initialization)
let _supabaseAdmin: SupabaseClient | null = null

export function getSupabaseAdmin(): SupabaseClient {
  if (!_supabaseAdmin) {
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase environment variables not configured')
    }
    _supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  }
  return _supabaseAdmin
}

// Alias para compatibilidade (deprecated, usar getSupabaseAdmin())
export const supabaseAdmin = {
  get storage() {
    return getSupabaseAdmin().storage
  },
}

// Buckets disponíveis
export const STORAGE_BUCKETS = {
  DOCUMENTS: 'documents',
  IMAGES: 'images',
  COVERS: 'covers',
} as const

// Helper para obter URL pública de um arquivo
export function getPublicUrl(bucket: string, path: string): string {
  // Construir URL diretamente para evitar inicialização do client durante build
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL not configured')
  }
  return `${url}/storage/v1/object/public/${bucket}/${path}`
}

// Helper para upload de arquivo
export async function uploadFile(
  bucket: string,
  path: string,
  file: Buffer | Blob,
  contentType: string
): Promise<{ url: string; path: string } | null> {
  const { data, error } = await getSupabaseAdmin().storage
    .from(bucket)
    .upload(path, file, {
      contentType,
      upsert: true,
    })

  if (error) {
    console.error('Erro no upload:', error)
    return null
  }

  return {
    url: getPublicUrl(bucket, data.path),
    path: data.path,
  }
}

// Helper para deletar arquivo
export async function deleteStorageFile(bucket: string, path: string): Promise<boolean> {
  const { error } = await getSupabaseAdmin().storage.from(bucket).remove([path])

  if (error) {
    console.error('Erro ao deletar:', error)
    return false
  }

  return true
}
