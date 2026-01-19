'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  ExternalLink
} from 'lucide-react'
import { AdminHeader } from '@/components/admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const posts = [
  {
    id: '1',
    title: 'Fórum aprova novas diretrizes para o Plano Municipal de Educação',
    status: 'PUBLISHED',
    category: 'Institucional',
    author: 'Maria Silva',
    date: '15 Jan 2026',
    views: 234,
  },
  {
    id: '2',
    title: 'Inscrições abertas para a Conferência Municipal de Educação 2026',
    status: 'PUBLISHED',
    category: 'Eventos',
    author: 'João Santos',
    date: '12 Jan 2026',
    views: 189,
  },
  {
    id: '3',
    title: 'Publicado relatório de acompanhamento das metas do PME',
    status: 'REVIEW',
    category: 'Documentos',
    author: 'Maria Silva',
    date: '10 Jan 2026',
    views: 0,
  },
  {
    id: '4',
    title: 'Fórum realiza audiência pública sobre educação inclusiva',
    status: 'DRAFT',
    category: 'Eventos',
    author: 'Carlos Oliveira',
    date: '08 Jan 2026',
    views: 0,
  },
  {
    id: '5',
    title: 'Nova composição do Fórum toma posse para biênio 2026-2028',
    status: 'PUBLISHED',
    category: 'Institucional',
    author: 'Maria Silva',
    date: '05 Jan 2026',
    views: 312,
  },
]

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
              <div className="text-2xl font-bold text-gray-900">24</div>
              <div className="text-sm text-gray-500">Total</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">18</div>
              <div className="text-sm text-gray-500">Publicadas</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">3</div>
              <div className="text-sm text-gray-500">Em revisão</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-600">3</div>
              <div className="text-sm text-gray-500">Rascunhos</div>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <Card>
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
                {posts.map((post) => (
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
                      <Badge variant="outline">{post.category}</Badge>
                    </td>
                    <td className="p-4 hidden lg:table-cell text-gray-600">
                      {post.author}
                    </td>
                    <td className="p-4 hidden sm:table-cell text-gray-600">
                      {post.date}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1">
                        {post.status === 'PUBLISHED' && (
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/noticias/${post.id}`} target="_blank">
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/admin/noticias/${post.id}`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Mostrando 1-5 de 24 notícias
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Anterior
              </Button>
              <Button variant="outline" size="sm">
                Próxima
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  )
}
