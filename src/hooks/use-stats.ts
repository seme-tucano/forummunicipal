'use client'

import { useState, useEffect, useCallback } from 'react'

interface Stats {
  posts: {
    total: number
    published: number
    draft: number
    review: number
  }
  documents: {
    total: number
  }
  events: {
    total: number
    upcoming: number
  }
  gallery: {
    albums: number
    images: number
  }
  users: {
    total: number
    active: number
  }
  contact: {
    unread: number
  }
  recent: {
    posts: Array<{
      id: string
      title: string
      status: string
      createdAt: string
      author: { name: string }
    }>
    documents: Array<{
      id: string
      title: string
      type: string
      createdAt: string
      uploadedBy: { name: string }
    }>
  }
}

export function useStats() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/stats')
      const json = await res.json()

      if (json.success) {
        setStats(json.data)
      } else {
        setError(json.error || 'Erro ao carregar estatísticas')
      }
    } catch {
      setError('Erro de conexão')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return { stats, loading, error, refetch: fetchStats }
}
