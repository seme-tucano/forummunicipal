'use client'

import Link from 'next/link'
import {
  Newspaper,
  FileText,
  Images,
  Calendar,
  Eye,
  Download,
  TrendingUp,
  Loader2,
  RefreshCw,
} from 'lucide-react'
import { AdminHeader } from '@/components/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useStats } from '@/hooks'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

function getStatusBadge(status: string) {
  switch (status) {
    case 'PUBLISHED':
      return <Badge variant="success">Publicado</Badge>
    case 'REVIEW':
      return <Badge variant="warning">Em revisão</Badge>
    case 'DRAFT':
      return <Badge variant="secondary">Rascunho</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

function formatDate(date: string) {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ptBR })
}

export default function AdminDashboard() {
  const { stats, loading, error, refetch } = useStats()

  if (loading) {
    return (
      <>
        <AdminHeader title="Dashboard" description="Visão geral do portal" />
        <div className="p-6 flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        </div>
      </>
    )
  }

  if (error || !stats) {
    return (
      <>
        <AdminHeader title="Dashboard" description="Visão geral do portal" />
        <div className="p-6">
          <Card className="p-8 text-center">
            <p className="text-gray-500 mb-4">{error || 'Erro ao carregar dados'}</p>
            <Button onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar novamente
            </Button>
          </Card>
        </div>
      </>
    )
  }

  const statsCards = [
    {
      name: 'Notícias Publicadas',
      value: stats.posts.published,
      total: stats.posts.total,
      icon: Newspaper,
      href: '/admin/noticias',
    },
    {
      name: 'Documentos',
      value: stats.documents.total,
      icon: FileText,
      href: '/admin/documentos',
    },
    {
      name: 'Fotos na Galeria',
      value: stats.gallery.images,
      albums: stats.gallery.albums,
      icon: Images,
      href: '/admin/galeria',
    },
    {
      name: 'Eventos',
      value: stats.events.upcoming,
      total: stats.events.total,
      icon: Calendar,
      href: '/admin/eventos',
    },
  ]

  return (
    <>
      <AdminHeader title="Dashboard" description="Visão geral do portal" />

      <div className="p-6">
        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statsCards.map((stat) => (
            <Link key={stat.name} href={stat.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center">
                      <stat.icon className="h-5 w-5 text-primary-600" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-500">
                    {stat.name}
                    {stat.total !== undefined && stat.total !== stat.value && (
                      <span className="text-gray-400"> / {stat.total} total</span>
                    )}
                    {stat.albums !== undefined && (
                      <span className="text-gray-400"> em {stat.albums} álbuns</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Button asChild>
            <Link href="/admin/noticias/novo">
              <Newspaper className="h-4 w-4 mr-2" />
              Nova Notícia
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/documentos">
              <FileText className="h-4 w-4 mr-2" />
              Upload de Documento
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/eventos">
              <Calendar className="h-4 w-4 mr-2" />
              Novo Evento
            </Link>
          </Button>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Posts */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Últimas Notícias</CardTitle>
              <Button asChild variant="ghost" size="sm">
                <Link href="/admin/noticias">Ver todas</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {stats.recent.posts.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Nenhuma notícia ainda</p>
              ) : (
                <div className="space-y-4">
                  {stats.recent.posts.map((post) => (
                    <div
                      key={post.id}
                      className="flex items-center justify-between py-3 border-b last:border-0"
                    >
                      <div className="flex-1 min-w-0 mr-4">
                        <Link
                          href={`/admin/noticias/${post.id}`}
                          className="font-medium text-gray-900 hover:text-primary-600 truncate block"
                        >
                          {post.title}
                        </Link>
                        <p className="text-sm text-gray-500">
                          {post.author.name} • {formatDate(post.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(post.status)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Documents */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Documentos Recentes</CardTitle>
              <Button asChild variant="ghost" size="sm">
                <Link href="/admin/documentos">Ver todos</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {stats.recent.documents.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Nenhum documento ainda</p>
              ) : (
                <div className="space-y-4">
                  {stats.recent.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between py-3 border-b last:border-0"
                    >
                      <div className="flex-1 min-w-0 mr-4">
                        <Link
                          href={`/admin/documentos`}
                          className="font-medium text-gray-900 hover:text-primary-600 truncate block"
                        >
                          {doc.title}
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {doc.type}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {formatDate(doc.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Summary Card */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary-600" />
              Resumo do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{stats.users.active}</div>
                <div className="text-sm text-gray-500">Usuários ativos</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{stats.posts.draft}</div>
                <div className="text-sm text-gray-500">Rascunhos</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{stats.posts.review}</div>
                <div className="text-sm text-gray-500">Em revisão</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{stats.contact.unread}</div>
                <div className="text-sm text-gray-500">Mensagens não lidas</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
