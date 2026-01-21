'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Plus,
  Search,
  Filter,
  Eye,
  Pencil,
  Trash2,
  ExternalLink,
  Loader2
} from 'lucide-react'
import { AdminHeader } from '@/components/admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'

interface Post {
  id: string
  title: string
  slug: string
  status: string
  views: number
  createdAt: string
  author: { id: string; name: string }
  category: { id: string; name: string; slug: string } | null
}

interface Stats {
  total: number
  published: number
  draft: number
  review: number
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'PUBLISHED':
      return <Badge className="bg-green-100 text-green-700">Publicado</Badge>
    case 'REVIEW':
      return <Badge className="bg-yellow-100 text-yellow-700">Em revisão</Badge>
    case 'DRAFT':
      return <Badge className="bg-gray-100 text-gray-700">Rascunho</Badge>
    case 'ARCHIVED':
      return <Badge className="bg-red-100 text-red-700">Arquivado</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export default function NoticiasAdminPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [posts, setPosts] = useState<Post[]>([])
  const [stats, setStats] = useState<Stats>({ total: 0, published: 0, draft: 0, review: 0 })
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetchPosts()
    fetchStats()
  }, [])

  async function fetchPosts() {
    try {
      const res = await fetch('/api/posts?limit=50')
      const data = await res.json()
      if (data.success) {
        setPosts(data.data)
      }
    } catch (error) {
      console.error('Erro ao buscar posts:', error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchStats() {
    try {
      const res = await fetch('/api/stats')
      const data = await res.json()
      if (data.success) {
        setStats(data.data.posts)
      }
    } catch (error) {
      console.error('Erro ao buscar stats:', error)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja excluir esta notícia?')) return

    setDeleting(id)
    try {
      const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setPosts(posts.filter(p => p.id !== id))
        fetchStats()
      }
    } catch (error) {
      console.error('Erro ao excluir:', error)
    } finally {
      setDeleting(null)
    }
  }

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <>
      <AdminHeader
        title="Notícias"
        description="Gerencie as notícias do portal"
      />

      <div className="p-6">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Buscar notícias..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtrar
            </Button>
            <Button asChild>
              <Link href="/admin/noticias/nova">
                <Plus className="h-4 w-4 mr-2" />
                Nova Notícia
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-500">Total</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.published}</div>
              <div className="text-sm text-gray-500">Publicadas</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.review}</div>
              <div className="text-sm text-gray-500">Em revisão</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-600">{stats.draft}</div>
              <div className="text-sm text-gray-500">Rascunhos</div>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <Card>
          {loading ? (
            <div className="p-8 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary-600" />
              <p className="text-gray-500 mt-2">Carregando notícias...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-4 font-medium text-gray-600">Título</th>
                      <th className="text-left p-4 font-medium text-gray-600">Status</th>
                      <th className="text-left p-4 font-medium text-gray-600 hidden md:table-cell">Categoria</th>
                      <th className="text-left p-4 font-medium text-gray-600 hidden lg:table-cell">Autor</th>
                      <th className="text-left p-4 font-medium text-gray-600 hidden sm:table-cell">Data</th>
                      <th className="text-right p-4 font-medium text-gray-600">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPosts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-gray-500">
                          Nenhuma notícia encontrada
                        </td>
                      </tr>
                    ) : (
                      filteredPosts.map((post) => (
                        <tr key={post.id} className="border-b hover:bg-gray-50">
                          <td className="p-4">
                            <Link
                              href={`/admin/noticias/${post.id}`}
                              className="font-medium text-gray-900 hover:text-primary-600"
                            >
                              {post.title}
                            </Link>
                            {post.views > 0 && (
                              <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                <Eye className="h-3 w-3" />
                                {post.views} visualizações
                              </p>
                            )}
                          </td>
                          <td className="p-4">
                            {getStatusBadge(post.status)}
                          </td>
                          <td className="p-4 hidden md:table-cell">
                            {post.category ? (
                              <Badge variant="outline">{post.category.name}</Badge>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="p-4 hidden lg:table-cell text-gray-600">
                            {post.author.name}
                          </td>
                          <td className="p-4 hidden sm:table-cell text-gray-600">
                            {formatDate(post.createdAt)}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-end gap-1">
                              {post.status === 'PUBLISHED' && (
                                <Button variant="ghost" size="icon" asChild>
                                  <Link href={`/noticias/${post.slug}`} target="_blank">
                                    <ExternalLink className="h-4 w-4" />
                                  </Link>
                                </Button>
                              )}
                              <Button variant="ghost" size="icon" asChild>
                                <Link href={`/admin/noticias/${post.id}`}>
                                  <Pencil className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleDelete(post.id)}
                                disabled={deleting === post.id}
                              >
                                {deleting === post.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="p-4 border-t flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Mostrando {filteredPosts.length} de {stats.total} notícias
                </p>
              </div>
            </>
          )}
        </Card>
      </div>
    </>
  )
}
