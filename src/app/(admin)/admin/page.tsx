import Link from 'next/link'
import {
  Newspaper,
  FileText,
  Images,
  Calendar,
  Users,
  TrendingUp,
  Eye,
  Download,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { AdminHeader } from '@/components/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const stats = [
  {
    name: 'Notícias Publicadas',
    value: '24',
    change: '+3',
    changeType: 'positive',
    icon: Newspaper,
    href: '/admin/noticias',
  },
  {
    name: 'Documentos',
    value: '45',
    change: '+7',
    changeType: 'positive',
    icon: FileText,
    href: '/admin/documentos',
  },
  {
    name: 'Fotos na Galeria',
    value: '259',
    change: '+28',
    changeType: 'positive',
    icon: Images,
    href: '/admin/galeria',
  },
  {
    name: 'Eventos Agendados',
    value: '4',
    change: '0',
    changeType: 'neutral',
    icon: Calendar,
    href: '/admin/eventos',
  },
]

const recentPosts = [
  {
    id: '1',
    title: 'Fórum aprova novas diretrizes para o PME',
    status: 'PUBLISHED',
    date: '15 Jan 2026',
    views: 234,
  },
  {
    id: '2',
    title: 'Inscrições abertas para a Conferência Municipal',
    status: 'PUBLISHED',
    date: '12 Jan 2026',
    views: 189,
  },
  {
    id: '3',
    title: 'Relatório de acompanhamento das metas do PME',
    status: 'REVIEW',
    date: '10 Jan 2026',
    views: 0,
  },
  {
    id: '4',
    title: 'Audiência pública sobre educação inclusiva',
    status: 'DRAFT',
    date: '08 Jan 2026',
    views: 0,
  },
]

const recentDocuments = [
  {
    id: '1',
    title: 'Ata da Reunião Ordinária - Janeiro/2026',
    type: 'ATA',
    downloads: 45,
  },
  {
    id: '2',
    title: 'Resolução nº 01/2026 - Diretrizes do PME',
    type: 'RESOLUCAO',
    downloads: 32,
  },
  {
    id: '3',
    title: 'Edital de Convocação - Conferência 2026',
    type: 'EDITAL',
    downloads: 67,
  },
]

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

export default function AdminDashboard() {
  return (
    <>
      <AdminHeader
        title="Dashboard"
        description="Visão geral do portal"
      />

      <div className="p-6">
        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <Link key={stat.name} href={stat.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center">
                      <stat.icon className="h-5 w-5 text-primary-600" />
                    </div>
                    {stat.changeType !== 'neutral' && (
                      <div className={`flex items-center text-sm ${
                        stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.changeType === 'positive' ? (
                          <ArrowUpRight className="h-4 w-4" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4" />
                        )}
                        {stat.change}
                      </div>
                    )}
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-500">
                    {stat.name}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Button asChild>
            <Link href="/admin/noticias/nova">
              <Newspaper className="h-4 w-4 mr-2" />
              Nova Notícia
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/documentos/upload">
              <FileText className="h-4 w-4 mr-2" />
              Upload de Documento
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/eventos/novo">
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
              <div className="space-y-4">
                {recentPosts.map((post) => (
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
                      <p className="text-sm text-gray-500">{post.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {post.views > 0 && (
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Eye className="h-3.5 w-3.5" />
                          {post.views}
                        </span>
                      )}
                      {getStatusBadge(post.status)}
                    </div>
                  </div>
                ))}
              </div>
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
              <div className="space-y-4">
                {recentDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between py-3 border-b last:border-0"
                  >
                    <div className="flex-1 min-w-0 mr-4">
                      <Link
                        href={`/admin/documentos/${doc.id}`}
                        className="font-medium text-gray-900 hover:text-primary-600 truncate block"
                      >
                        {doc.title}
                      </Link>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {doc.type}
                      </Badge>
                    </div>
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <Download className="h-3.5 w-3.5" />
                      {doc.downloads}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity / Chart placeholder */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary-600" />
              Visitas do Portal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg flex items-center justify-center">
              <p className="text-primary-600 text-sm">Gráfico de visitas</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
