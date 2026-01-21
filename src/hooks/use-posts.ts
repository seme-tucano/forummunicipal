'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Post, PostStatus } from '@prisma/client'

interface PostWithRelations extends Post {
  author: { id: string; name: string }
  category: { id: string; name: string; slug: string } | null
  tags: { id: string; name: string; slug: string }[]
}

interface UsePostsParams {
  page?: number
  limit?: number
  status?: PostStatus
  category?: string
  search?: string
}

interface UsePostsReturn {
  posts: PostWithRelations[]
  loading: boolean
  error: string | null
  total: number
  totalPages: number
  page: number
  refetch: (params?: UsePostsParams) => Promise<void>
}

export function usePosts(initialParams?: UsePostsParams): UsePostsReturn {
  const [posts, setPosts] = useState<PostWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(initialParams?.page || 1)

  const fetchPosts = useCallback(async (params?: UsePostsParams) => {
    setLoading(true)
    setError(null)

    try {
      const searchParams = new URLSearchParams()
      if (params?.page) searchParams.set('page', String(params.page))
      if (params?.limit) searchParams.set('limit', String(params.limit))
      if (params?.status) searchParams.set('status', params.status)
      if (params?.category) searchParams.set('category', params.category)
      if (params?.search) searchParams.set('search', params.search)

      const res = await fetch(`/api/posts?${searchParams}`)
      const json = await res.json()

      if (json.success) {
        setPosts(json.data)
        setTotal(json.total)
        setTotalPages(json.totalPages)
        setPage(json.page)
      } else {
        setError(json.error || 'Erro ao carregar notícias')
      }
    } catch {
      setError('Erro de conexão')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPosts(initialParams)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return { posts, loading, error, total, totalPages, page, refetch: fetchPosts }
}

export function usePost(id: string | null) {
  const [post, setPost] = useState<PostWithRelations | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPost = useCallback(async () => {
    if (!id || id === 'novo') {
      setPost(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/posts/${id}`)
      const json = await res.json()

      if (json.success) {
        setPost(json.data)
      } else {
        setError(json.error || 'Erro ao carregar notícia')
      }
    } catch {
      setError('Erro de conexão')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchPost()
  }, [fetchPost])

  return { post, loading, error, refetch: fetchPost }
}
