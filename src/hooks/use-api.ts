'use client'

import { useState, useCallback } from 'react'

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  errors?: Record<string, string[]>
  total?: number
  page?: number
  limit?: number
  totalPages?: number
}

interface UseApiOptions {
  onSuccess?: (data: unknown) => void
  onError?: (error: string) => void
}

export function useApi<T>(options?: UseApiOptions) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const request = useCallback(
    async (
      url: string,
      method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
      body?: unknown
    ): Promise<ApiResponse<T> | null> => {
      setLoading(true)
      setError(null)

      try {
        const res = await fetch(url, {
          method,
          headers: body ? { 'Content-Type': 'application/json' } : undefined,
          body: body ? JSON.stringify(body) : undefined,
        })

        const json: ApiResponse<T> = await res.json()

        if (!json.success) {
          const errorMessage = json.error || 'Erro desconhecido'
          setError(errorMessage)
          options?.onError?.(errorMessage)
          return json
        }

        setData(json.data || null)
        options?.onSuccess?.(json.data)
        return json
      } catch (err) {
        const errorMessage = 'Erro de conexão'
        setError(errorMessage)
        options?.onError?.(errorMessage)
        return null
      } finally {
        setLoading(false)
      }
    },
    [options]
  )

  const get = useCallback((url: string) => request(url, 'GET'), [request])
  const post = useCallback((url: string, body: unknown) => request(url, 'POST', body), [request])
  const put = useCallback((url: string, body: unknown) => request(url, 'PUT', body), [request])
  const del = useCallback((url: string) => request(url, 'DELETE'), [request])

  return {
    data,
    loading,
    error,
    request,
    get,
    post,
    put,
    del,
    setData,
    setError,
  }
}

// Hook para upload de arquivos
export function useUpload() {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const upload = useCallback(
    async (
      file: File,
      type: 'documents' | 'images'
    ): Promise<{
      url: string
      fileName: string
      fileSize: number
      mimeType: string
    } | null> => {
      setUploading(true)
      setError(null)
      setProgress(0)

      try {
        const formData = new FormData()
        formData.append('file', file)

        const res = await fetch(`/api/upload?type=${type}`, {
          method: 'POST',
          body: formData,
        })

        const json = await res.json()

        if (!json.success) {
          setError(json.error || 'Erro no upload')
          return null
        }

        setProgress(100)
        return json.data
      } catch {
        setError('Erro de conexão')
        return null
      } finally {
        setUploading(false)
      }
    },
    []
  )

  return { upload, uploading, progress, error }
}
